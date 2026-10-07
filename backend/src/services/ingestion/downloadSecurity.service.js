import { URL } from 'node:url';
import net from 'node:net';
import path from 'node:path';
import logger from '../../utils/logger.js';
import { ValidationError, ForbiddenError } from '../../utils/errors.js';

export const OFFICIAL_ALLOWED_HOSTS = [
  // O*NET Official Hosts
  'www.onetcenter.org',
  'services.onetcenter.org',
  'onetcenter.org',
  'static.onetcenter.org',
  // ESCO Official Hosts
  'esco.ec.europa.eu',
  'data.europa.eu',
  'ec.europa.eu',
  'eur-lex.europa.eu',
];

export const MAX_DOWNLOAD_SIZE_BYTES = 50 * 1024 * 1024; // 50MB safe upper limit for official taxonomy packages
export const DOWNLOAD_TIMEOUT_MS = 15000; // 15 seconds

/**
 * Checks whether an IP address belongs to a private, loopback, or reserved network range.
 */
export function isPrivateOrReservedIp(ip) {
  if (!ip) return true;

  // Normalize IPv6-mapped IPv4
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  if (ip === '::1' || ip === '0.0.0.0' || ip === 'localhost') return true;

  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;
  }

  // IPv6 checks
  if (ip.includes(':')) {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::' || lower.startsWith('fe80:') || lower.startsWith('fc00:') || lower.startsWith('fd00:')) {
      return true;
    }
  }

  return false;
}

export class DownloadSecurityService {
  /**
   * Validates a URL against strict official host allowlists and anti-SSRF rules.
   * @param {string} rawUrl - Target remote URL
   * @returns {URL} Parsed and validated URL object
   */
  validateDownloadUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      throw new ValidationError('A valid URL string is required for official download');
    }

    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new ValidationError(`Invalid URL format: "${rawUrl}"`);
    }

    // Protocol must strictly be https: (or http: in controlled test environments)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new ForbiddenError(`Forbidden protocol "${parsed.protocol}". Only HTTPS/HTTP are permitted.`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check against forbidden loopbacks / local identifiers
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.localhost')
    ) {
      throw new ForbiddenError(`SSRF Protection: Access to local/internal host "${hostname}" is prohibited.`);
    }

    // Direct IP address check
    if (net.isIP(hostname) && isPrivateOrReservedIp(hostname)) {
      throw new ForbiddenError(`SSRF Protection: Access to private/reserved IP address "${hostname}" is prohibited.`);
    }

    // Check host allowlist
    const isAllowedHost = OFFICIAL_ALLOWED_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );

    if (!isAllowedHost) {
      throw new ForbiddenError(
        `Host "${hostname}" is not in the official source allowlist. Allowed hosts: ${OFFICIAL_ALLOWED_HOSTS.join(', ')}`
      );
    }

    return parsed;
  }

  /**
   * Validates an extracted archive entry path to prevent Zip Slip / path traversal attacks.
   * @param {string} entryPath - Relative path of file inside archive
   * @param {string} destinationDir - Base destination directory
   * @returns {string} Safe resolved absolute path
   */
  validateArchiveEntryPath(entryPath, destinationDir = '/tmp/ingest') {
    if (!entryPath || typeof entryPath !== 'string') {
      throw new ValidationError('Archive entry path is missing or invalid');
    }

    // Reject null bytes
    if (entryPath.includes('\0')) {
      throw new ValidationError('Malicious archive entry: contains null byte');
    }

    // Reject leading slashes / Windows drive letters
    if (path.isAbsolute(entryPath) || /^[a-zA-Z]:/.test(entryPath)) {
      throw new ValidationError(`Malicious archive entry: absolute path rejected ("${entryPath}")`);
    }

    // Normalize and check for directory traversal
    const normalized = path.normalize(entryPath);
    if (normalized.startsWith('..') || normalized.includes(`${path.sep}..${path.sep}`) || normalized.endsWith(`${path.sep}..`)) {
      throw new ValidationError(`Zip Slip Protection: Path traversal attempt detected in entry "${entryPath}"`);
    }

    const resolved = path.resolve(destinationDir, normalized);
    const resolvedBase = path.resolve(destinationDir);

    if (!resolved.startsWith(resolvedBase)) {
      throw new ValidationError(`Zip Slip Protection: Entry escapes target directory ("${entryPath}")`);
    }

    return resolved;
  }

  /**
   * Safely downloads content with timeout, size limit, and SSRF validation.
   */
  async safeFetch(rawUrl, options = {}) {
    const validatedUrl = this.validateDownloadUrl(rawUrl);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DOWNLOAD_TIMEOUT_MS);

    try {
      logger.info(`[DownloadSecurity] Initiating safe fetch from ${validatedUrl.hostname}`, {
        url: validatedUrl.href,
      });

      const response = await fetch(validatedUrl.href, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'SkillSetu-Taxonomy-Ingestion/1.0 (+https://skillsetu.com)',
          Accept: 'application/json, text/csv, application/zip, text/plain, */*',
          ...(options.headers || {}),
        },
        signal: controller.signal,
        redirect: 'manual', // Prevent silent redirects to internal targets
      });

      // Handle redirect safely
      if ([301, 302, 307, 308].includes(response.status)) {
        const redirectLocation = response.headers.get('location');
        if (!redirectLocation) {
          throw new ValidationError('Redirect received without Location header');
        }
        const nextUrl = new URL(redirectLocation, validatedUrl.href).href;
        logger.info(`[DownloadSecurity] Following safe redirect to ${nextUrl}`);
        // Re-validate target URL
        return this.safeFetch(nextUrl, { ...options, redirectCount: (options.redirectCount || 0) + 1 });
      }

      if (!response.ok) {
        throw new Error(`Remote official server responded with HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > MAX_DOWNLOAD_SIZE_BYTES) {
        throw new ValidationError(`Remote file size (${contentLength} bytes) exceeds maximum limit of 50MB`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > MAX_DOWNLOAD_SIZE_BYTES) {
        throw new ValidationError(`Downloaded payload (${buffer.length} bytes) exceeds maximum limit of 50MB`);
      }

      return {
        status: response.status,
        headers: response.headers,
        buffer,
        contentType: response.headers.get('content-type') || 'application/octet-stream',
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`Download timed out after ${options.timeoutMs || DOWNLOAD_TIMEOUT_MS}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export const downloadSecurityService = new DownloadSecurityService();
export default downloadSecurityService;
