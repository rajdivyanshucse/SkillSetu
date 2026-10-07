import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { sourceRegistryService, DATASET_VERSION_STATUS } from './sourceRegistry.service.js';
import { normalizationService, NORMALIZATION_STATUS } from './normalization.service.js';
import { validationService } from './validation.service.js';
import { deduplicationService } from './deduplication.service.js';
import { qualityService } from './quality.service.js';
import { quarantineService } from './quarantine.service.js';
import { provenanceService } from './provenance.service.js';
import { importService } from './import.service.js';
import jobService, { JOB_TYPE } from '../job.service.js';
import metricsService from '../metrics.service.js';
import { ValidationError, ConflictError } from '../../utils/errors.js';

export const INGESTION_STAGES = {
  QUEUED: 'QUEUED',
  VALIDATING: 'VALIDATING',
  NORMALIZING: 'NORMALIZING',
  DEDUPLICATING: 'DEDUPLICATING',
  QUALITY_CHECK: 'QUALITY_CHECK',
  UPLOADING: 'UPLOADING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  PARTIAL_SUCCESS: 'PARTIAL_SUCCESS',
};

export class IngestionService {
  /**
   * Orchestrates the complete ingestion lifecycle for a dataset version.
   * Can be executed directly or inside a background job.
   */
  async processDatasetImport(datasetVersionId, contentOrRecords, options = {}) {
    const startTime = Date.now();
    const version = await sourceRegistryService.getDatasetVersionById(datasetVersionId);
    const dataset = await sourceRegistryService.getDatasetById(version.datasetId);

    // 1. Idempotency Check
    if (version.status === DATASET_VERSION_STATUS.IMPORTED && !options.force) {
      logger.info(`[Ingestion] Dataset version ${version.versionTag} already imported. Skipping.`, {
        datasetVersionId,
        status: version.status,
      });
      return {
        status: 'ALREADY_IMPORTED',
        message: 'Dataset version has already been successfully imported.',
        datasetVersionId,
        recordCount: version.recordCount,
        validRecordCount: version.validRecordCount,
      };
    }

    // 2. Create Ingestion Job Record for tracking
    const jobRecord = await prisma.ingestionJobRecord.create({
      data: {
        datasetVersionId,
        stage: INGESTION_STAGES.VALIDATING,
        status: 'PROCESSING',
        progressPercent: 5,
        startedAt: new Date(),
        metadata: {
          requestId: options.requestId || null,
          user: options.user || 'ADMIN',
        },
      },
    });

    // Mark version as VALIDATING
    await sourceRegistryService.updateDatasetVersion(datasetVersionId, {
      status: DATASET_VERSION_STATUS.VALIDATING,
    });

    try {
      // 3. Raw Content Parsing
      let rawRecords = [];
      let fileHash = version.fileHash;

      if (Array.isArray(contentOrRecords)) {
        rawRecords = contentOrRecords;
      } else {
        const parsed = await importService.parseContent(contentOrRecords, version.format);
        rawRecords = parsed.records;
        fileHash = parsed.fileHash;
        await sourceRegistryService.updateDatasetVersion(datasetVersionId, {
          fileHash,
          recordCount: rawRecords.length,
        });
      }

      if (rawRecords.length === 0) {
        throw new ValidationError('No records found to import');
      }

      logger.info(`[Ingestion] Processing ${rawRecords.length} records for dataset version ${version.versionTag}`, {
        datasetVersionId,
        jobId: jobRecord.id,
        recordCount: rawRecords.length,
      });

      // Update progress
      await this._updateJobProgress(jobRecord.id, INGESTION_STAGES.NORMALIZING, 20);

      const seenBatchFingerprints = new Set();
      const processedRecords = [];
      let successCount = 0;
      let failureCount = 0;
      let duplicateCount = 0;
      let quarantinedCount = 0;
      let normSuccess = 0;
      let normFail = 0;

      // 4. Batch Normalization, Validation, and Deduplication Loop
      for (let i = 0; i < rawRecords.length; i++) {
        const raw = rawRecords[i];
        const externalId = raw.id || raw.externalId || raw.jobId || null;

        // Normalization
        const normalized = await normalizationService.normalizeJobPosting(raw);
        if (normalized.isNormalized) normSuccess++;
        else normFail++;

        // Validation
        const validation = validationService.validateRecord(raw, normalized);

        // Deduplication
        const fingerprint = deduplicationService.generateFingerprint(normalized, dataset.sourceId);
        const dupCheck = await deduplicationService.checkDuplicate(
          fingerprint,
          externalId,
          datasetVersionId,
          seenBatchFingerprints
        );
        seenBatchFingerprints.add(fingerprint);

        if (dupCheck.isDuplicate) {
          duplicateCount++;
        }

        // Quarantine check
        if (validation.shouldQuarantine) {
          quarantinedCount++;
          failureCount++;
          await quarantineService.quarantineRecord({
            datasetVersionId,
            ingestionJobId: jobRecord.id,
            externalId,
            reason: validation.quarantineReason,
            validationErrors: validation.errors,
            rawRecord: raw,
          });
        } else {
          successCount++;
          const recStatus = dupCheck.isDuplicate ? 'DUPLICATE' : 'VALID';

          const ingestionRec = await prisma.ingestionRecord.create({
            data: {
              datasetVersionId,
              ingestionJobId: jobRecord.id,
              externalId,
              recordFingerprint: fingerprint,
              rawData: raw,
              normalizedData: normalized.data,
              validationStatus: recStatus,
              normalizationStatus: normalized.status,
              qualityScore: normalized.skillCoverage || 1.0,
              duplicateOf: dupCheck.duplicateOf,
              duplicateReason: dupCheck.duplicateReason,
            },
          });

          processedRecords.push(ingestionRec);
        }

        // Progress update every 50 records
        if ((i + 1) % 50 === 0 || i === rawRecords.length - 1) {
          const pct = Math.min(80, Math.round(20 + ((i + 1) / rawRecords.length) * 60));
          await this._updateJobProgress(jobRecord.id, INGESTION_STAGES.NORMALIZING, pct, {
            processedCount: i + 1,
            successCount,
            failureCount,
            duplicateCount,
            quarantinedCount,
          });
        }
      }

      // 5. Quality Scoring Evaluation
      await this._updateJobProgress(jobRecord.id, INGESTION_STAGES.QUALITY_CHECK, 85);
      const qualityReport = await qualityService.evaluateDatasetQuality(datasetVersionId);

      // 6. Domain Upsert & Provenance Observation Integration
      await this._updateJobProgress(jobRecord.id, INGESTION_STAGES.UPLOADING, 90);
      const observationResult = await provenanceService.recordImportedDemandObservations({
        datasetVersionId,
        sourceId: dataset.sourceId,
        ingestionJobId: jobRecord.id,
        normalizedRecords: processedRecords,
      });

      // 7. Complete Ingestion
      const durationMs = Date.now() - startTime;
      const finalStatus =
        quarantinedCount > 0 && successCount > 0
          ? INGESTION_STAGES.PARTIAL_SUCCESS
          : failureCount > 0 && successCount === 0
          ? INGESTION_STAGES.FAILED
          : INGESTION_STAGES.COMPLETED;

      await prisma.ingestionJobRecord.update({
        where: { id: jobRecord.id },
        data: {
          stage: finalStatus,
          status: 'COMPLETED',
          progressPercent: 100,
          processedCount: rawRecords.length,
          successCount,
          failureCount,
          duplicateCount,
          quarantinedCount,
          completedAt: new Date(),
        },
      });

      await sourceRegistryService.updateDatasetVersion(datasetVersionId, {
        status: finalStatus === INGESTION_STAGES.FAILED ? DATASET_VERSION_STATUS.FAILED : DATASET_VERSION_STATUS.IMPORTED,
        validRecordCount: successCount,
        rejectedRecordCount: quarantinedCount,
        duplicateCount,
        quarantinedCount,
        qualityScore: qualityReport.overallScore,
      });

      // Record metrics
      metricsService.recordIngestionBatch({
        datasetsImported: 1,
        processed: rawRecords.length,
        accepted: successCount,
        rejected: quarantinedCount,
        quarantined: quarantinedCount,
        duplicates: duplicateCount,
        normSuccess,
        normFail,
        durationMs,
      });

      // 8. Safe Trigger of Analytical Rebuilds via Background Jobs if new observations were added
      if (observationResult.createdSkillObservations > 0 || observationResult.createdRoleObservations > 0) {
        this._triggerAsyncAnalyticalRebuilds(datasetVersionId);
      }

      logger.info(`[Ingestion] Completed import for dataset version ${version.versionTag} in ${durationMs}ms`, {
        datasetVersionId,
        total: rawRecords.length,
        success: successCount,
        quarantined: quarantinedCount,
        duplicates: duplicateCount,
        qualityScore: qualityReport.overallScore,
      });

      return {
        status: 'SUCCESS',
        datasetVersionId,
        versionTag: version.versionTag,
        totalRecords: rawRecords.length,
        successCount,
        quarantinedCount,
        duplicateCount,
        qualityScore: qualityReport.overallScore,
        observationsCreated: observationResult,
        durationMs,
      };
    } catch (err) {
      logger.error(`[Ingestion] Ingestion failed for dataset version ${datasetVersionId}: ${err.message}`, {
        datasetVersionId,
        error: err.message,
        stack: err.stack,
      });

      await prisma.ingestionJobRecord.update({
        where: { id: jobRecord.id },
        data: {
          stage: INGESTION_STAGES.FAILED,
          status: 'FAILED',
          errorLog: { message: err.message, stack: err.stack },
          completedAt: new Date(),
        },
      });

      await sourceRegistryService.updateDatasetVersion(datasetVersionId, {
        status: DATASET_VERSION_STATUS.FAILED,
      });

      throw err;
    }
  }

  /**
   * Enqueues an import as an asynchronous background job.
   */
  async enqueueDatasetImport(datasetVersionId, contentOrRecords, options = {}) {
    return jobService.enqueueJob(
      JOB_TYPE.DATASET_IMPORT,
      async (job, updateProgress) => {
        return this.processDatasetImport(datasetVersionId, contentOrRecords, {
          ...options,
          jobId: job.id,
          updateProgress,
        });
      },
      {
        targetId: datasetVersionId,
        createdBy: options.createdBy || 'ADMIN',
        metadata: {
          datasetVersionId,
          versionTag: options.versionTag || null,
        },
      }
    );
  }

  async _updateJobProgress(jobId, stage, percent, extraCounts = {}) {
    await prisma.ingestionJobRecord.update({
      where: { id: jobId },
      data: {
        stage,
        progressPercent: percent,
        ...extraCounts,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Triggers analytical demand/forecast rebuilds asynchronously in background.
   */
  _triggerAsyncAnalyticalRebuilds(datasetVersionId) {
    setImmediate(async () => {
      try {
        logger.info(`[Ingestion] Enqueuing DEMAND_REBUILD for datasetVersion ${datasetVersionId}`);
        await jobService.enqueueJob(
          JOB_TYPE.DEMAND_REBUILD,
          async () => {
            metricsService.recordRebuildJob(true);
            return { message: 'Demand observations rebuilt from imported datasets' };
          },
          { targetId: datasetVersionId, createdBy: 'INGESTION_PIPELINE' }
        );
      } catch (err) {
        metricsService.recordRebuildJob(false);
        logger.warn(`[Ingestion] Async rebuild enqueue skipped: ${err.message}`);
      }
    });
  }
}

export const ingestionService = new IngestionService();
export default ingestionService;
