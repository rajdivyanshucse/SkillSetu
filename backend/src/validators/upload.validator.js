import path from 'node:path';
import { ApiError } from '../utils/apiError.js';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt', '.docx', '.doc']);

const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.js',
  '.mjs',
  '.py',
  '.php',
  '.pl',
  '.vbs',
  '.ps1',
  '.jar',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates uploaded file metadata and safety constraints.
 *
 * @param {Object} file - File object containing originalname, mimetype, size
 * @param {Object} [options] - Optional custom constraints
 * @returns {Object} Sanitized file metadata
 */
export const validateFileUpload = (file, options = {}) => {
  if (!file) {
    throw ApiError.badRequest('No file provided for upload', 'FILE_REQUIRED');
  }

  const maxSize = options.maxSizeBytes || MAX_FILE_SIZE_BYTES;
  if (file.size > maxSize) {
    throw ApiError.unprocessable(
      `File exceeds the maximum allowed size of ${Math.round(maxSize / (1024 * 1024))}MB`,
      'FILE_TOO_LARGE',
      { size: file.size, maxSize }
    );
  }

  const ext = path.extname(file.originalname || '').toLowerCase();
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    throw ApiError.unprocessable(
      `Executable and script file uploads are strictly prohibited: ${ext}`,
      'INVALID_FILE_EXTENSION',
      { extension: ext }
    );
  }

  const allowedExts = options.allowedExtensions || ALLOWED_EXTENSIONS;
  if (!allowedExts.has(ext)) {
    throw ApiError.unprocessable(
      `File extension ${ext} is not supported. Allowed extensions: ${Array.from(allowedExts).join(', ')}`,
      'INVALID_FILE_EXTENSION',
      { extension: ext, allowed: Array.from(allowedExts) }
    );
  }

  const allowedMimes = options.allowedMimeTypes || ALLOWED_MIME_TYPES;
  if (file.mimetype && !allowedMimes.has(file.mimetype.toLowerCase())) {
    throw ApiError.unprocessable(
      `File MIME type ${file.mimetype} is not supported`,
      'INVALID_MIME_TYPE',
      { mimeType: file.mimetype }
    );
  }

  // Sanitize filename against directory traversal
  const sanitizedBaseName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');

  return {
    isValid: true,
    sanitizedFilename: sanitizedBaseName,
    extension: ext,
    sizeBytes: file.size,
    mimeType: file.mimetype,
  };
};

export default {
  validateFileUpload,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
};
