import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

export const QUARANTINE_STATUS = {
  QUARANTINED: 'QUARANTINED',
  REVIEWED: 'REVIEWED',
  APPROVED: 'APPROVED',
  DISCARDED: 'DISCARDED',
};

export class QuarantineService {
  /**
   * Quarantines an invalid or suspicious raw record.
   */
  async quarantineRecord(data) {
    if (!data.datasetVersionId) {
      throw new ValidationError('datasetVersionId is required to quarantine a record');
    }
    if (!data.reason) {
      throw new ValidationError('Quarantine reason is required');
    }

    const record = await prisma.quarantinedRecord.create({
      data: {
        datasetVersionId: data.datasetVersionId,
        ingestionJobId: data.ingestionJobId || null,
        externalId: data.externalId || null,
        reason: data.reason,
        validationErrors: data.validationErrors || [],
        rawRecord: data.rawRecord || {},
        status: QUARANTINE_STATUS.QUARANTINED,
        reviewedBy: null,
        reviewNotes: null,
      },
    });

    logger.warn(`[QuarantineService] Quarantined record (${record.id}) - Reason: ${record.reason}`, {
      quarantinedId: record.id,
      datasetVersionId: record.datasetVersionId,
      reason: record.reason,
    });

    return record;
  }

  /**
   * Lists quarantined records with optional filters.
   */
  async listQuarantinedRecords(filter = {}) {
    const where = {};
    if (filter.datasetVersionId) where.datasetVersionId = filter.datasetVersionId;
    if (filter.status) where.status = filter.status;
    if (filter.reason) where.reason = filter.reason;

    return prisma.quarantinedRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 100,
      skip: filter.offset || 0,
    });
  }

  /**
   * Retrieves a quarantined record by ID.
   */
  async getQuarantinedRecordById(id) {
    const record = await prisma.quarantinedRecord.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Quarantined record not found with ID: ${id}`);
    }
    return record;
  }

  /**
   * Admin review of a quarantined record (e.g. approve or discard).
   */
  async reviewQuarantinedRecord(id, reviewData) {
    await this.getQuarantinedRecordById(id);

    const status = reviewData.status || QUARANTINE_STATUS.REVIEWED;
    return prisma.quarantinedRecord.update({
      where: { id },
      data: {
        status,
        reviewedBy: reviewData.reviewedBy || 'ADMIN',
        reviewNotes: reviewData.notes || null,
        updatedAt: new Date(),
      },
    });
  }
}

export const quarantineService = new QuarantineService();
export default quarantineService;
