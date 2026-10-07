import crypto from 'node:crypto';
import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export const DUPLICATE_REASONS = {
  EXACT_EXTERNAL_ID: 'EXACT_EXTERNAL_ID',
  CONTENT_FINGERPRINT_MATCH: 'CONTENT_FINGERPRINT_MATCH',
  NORMALIZED_COMPOSITE_MATCH: 'NORMALIZED_COMPOSITE_MATCH',
};

export class DeduplicationService {
  /**
   * Generates a deterministic fingerprint hash for a normalized job posting.
   */
  generateFingerprint(normalizedRecord, sourceId = '') {
    const data = normalizedRecord.data || normalizedRecord;
    const title = (data.role?.canonicalRole || data.rawTitle || '').toLowerCase().trim();
    const org = (data.organization || '').toLowerCase().trim();
    const city = (data.location?.city || data.location?.country || '').toLowerCase().trim();
    const date = (data.date?.quarter || data.date?.month || '').toLowerCase().trim();
    const skills = (data.skills || [])
      .map((s) => s.canonicalName || s.raw || '')
      .filter(Boolean)
      .map((s) => s.toLowerCase().trim())
      .sort()
      .join('|');

    const externalId = (data.externalId || '').trim();

    const compositeString = `${sourceId}:::${externalId}:::${title}:::${org}:::${city}:::${date}:::${skills}`;
    return crypto.createHash('sha256').update(compositeString).digest('hex');
  }

  /**
   * Evaluates a record against seen fingerprints in current batch and past ingested records.
   */
  async checkDuplicate(fingerprint, externalId, datasetVersionId, seenInBatch = new Set()) {
    // 1. Check within current batch
    if (seenInBatch.has(fingerprint)) {
      return {
        isDuplicate: true,
        duplicateOf: fingerprint,
        duplicateReason: DUPLICATE_REASONS.CONTENT_FINGERPRINT_MATCH,
        fingerprint,
      };
    }

    // 2. Check in database for the same dataset version
    const existingInVersion = await prisma.ingestionRecord.findFirst({
      where: {
        datasetVersionId,
        recordFingerprint: fingerprint,
      },
    });

    if (existingInVersion) {
      return {
        isDuplicate: true,
        duplicateOf: existingInVersion.id,
        duplicateReason: DUPLICATE_REASONS.CONTENT_FINGERPRINT_MATCH,
        fingerprint,
      };
    }

    // 3. Check across other versions if external ID exists
    if (externalId) {
      const existingByExt = await prisma.ingestionRecord.findFirst({
        where: {
          externalId,
          validationStatus: 'VALID',
        },
      });

      if (existingByExt) {
        return {
          isDuplicate: true,
          duplicateOf: existingByExt.id,
          duplicateReason: DUPLICATE_REASONS.EXACT_EXTERNAL_ID,
          fingerprint,
        };
      }
    }

    // Not a duplicate
    return {
      isDuplicate: false,
      duplicateOf: null,
      duplicateReason: null,
      fingerprint,
    };
  }
}

export const deduplicationService = new DeduplicationService();
export default deduplicationService;
