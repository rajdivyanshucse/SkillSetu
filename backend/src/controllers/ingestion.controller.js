import { sendSuccess } from '../utils/apiResponse.js';
import prisma from '../config/db.js';
import { sourceRegistryService } from '../services/ingestion/sourceRegistry.service.js';
import { ingestionService } from '../services/ingestion/ingestion.service.js';
import { onetConnectorService } from '../services/ingestion/onetConnector.service.js';
import { escoConnectorService } from '../services/ingestion/escoConnector.service.js';
import { qualityService } from '../services/ingestion/quality.service.js';
import { quarantineService } from '../services/ingestion/quarantine.service.js';
import jobService, { JOB_TYPE } from '../services/job.service.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export class IngestionController {
  // --- Data Sources ---
  static async createSource(req, res, next) {
    try {
      const source = await sourceRegistryService.registerSource(req.body);
      return sendSuccess(res, {
        data: source,
        statusCode: 201,
        message: 'Data source registered successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async listSources(req, res, next) {
    try {
      const sources = await sourceRegistryService.listSources(req.query);
      return sendSuccess(res, {
        data: sources,
        message: 'Data sources retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSourceById(req, res, next) {
    try {
      const source = await sourceRegistryService.getSourceById(req.params.sourceId);
      return sendSuccess(res, {
        data: source,
        message: 'Data source retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Datasets ---
  static async createDataset(req, res, next) {
    try {
      const dataset = await sourceRegistryService.registerDataset(req.body);
      return sendSuccess(res, {
        data: dataset,
        statusCode: 201,
        message: 'Dataset registered successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async listDatasets(req, res, next) {
    try {
      const datasets = await sourceRegistryService.listDatasets(req.query);
      return sendSuccess(res, {
        data: datasets,
        message: 'Datasets retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDatasetById(req, res, next) {
    try {
      const dataset = await sourceRegistryService.getDatasetById(req.params.datasetId);
      const versions = await sourceRegistryService.listDatasetVersions(req.params.datasetId);
      return sendSuccess(res, {
        data: {
          ...dataset,
          versions,
        },
        message: 'Dataset details retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Dataset Versions ---
  static async createDatasetVersion(req, res, next) {
    try {
      const version = await sourceRegistryService.createDatasetVersion({
        ...req.body,
        datasetId: req.params.datasetId || req.body.datasetId,
      });
      return sendSuccess(res, {
        data: version,
        statusCode: 201,
        message: 'Dataset version created successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async listDatasetVersions(req, res, next) {
    try {
      const versions = await sourceRegistryService.listDatasetVersions(req.params.datasetId);
      return sendSuccess(res, {
        data: versions,
        message: 'Dataset versions retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Ingestion Execution ---
  static async importDataset(req, res, next) {
    try {
      const { datasetId } = req.params;
      const { versionTag, format, records, content, async: isAsync, force } = req.body;

      let version;
      if (req.body.datasetVersionId) {
        version = await sourceRegistryService.getDatasetVersionById(req.body.datasetVersionId);
      } else if (versionTag) {
        const existing = await prisma.datasetVersion.findFirst({
          where: { datasetId, versionTag },
        });
        if (existing) {
          version = existing;
        } else {
          version = await sourceRegistryService.createDatasetVersion({
            datasetId,
            versionTag,
            format: format || 'JSON',
          });
        }
      } else {
        // Create an auto timestamped batch version
        const tag = `batch-${Date.now()}`;
        version = await sourceRegistryService.createDatasetVersion({
          datasetId,
          versionTag: tag,
          format: format || 'JSON',
        });
      }

      const inputContent = records || content || req.file?.buffer || req.body;

      if (isAsync) {
        const jobResult = await ingestionService.enqueueDatasetImport(version.id, inputContent, {
          createdBy: req.user?.email || 'ADMIN',
          requestId: req.requestId,
          force,
        });
        return sendSuccess(res, {
          data: jobResult,
          statusCode: 202,
          message: 'Dataset import job enqueued successfully',
        });
      }

      const result = await ingestionService.processDatasetImport(version.id, inputContent, {
        requestId: req.requestId,
        user: req.user?.email || 'ADMIN',
        force,
      });

      return sendSuccess(res, {
        data: result,
        message: 'Dataset imported and processed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Jobs ---
  static async listJobs(req, res, next) {
    try {
      const jobs = await prisma.ingestionJobRecord.findMany({
        where: req.query.datasetVersionId ? { datasetVersionId: req.query.datasetVersionId } : {},
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess(res, {
        data: jobs,
        message: 'Ingestion jobs retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getJobById(req, res, next) {
    try {
      const job = await prisma.ingestionJobRecord.findUnique({
        where: { id: req.params.jobId },
      });
      if (!job) {
        throw new NotFoundError(`Ingestion job not found with ID: ${req.params.jobId}`);
      }
      return sendSuccess(res, {
        data: job,
        message: 'Ingestion job details retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancelJob(req, res, next) {
    try {
      const cancelled = await jobService.cancelJob(req.params.jobId, req.user?.email || 'ADMIN');
      if (!cancelled) {
        throw new NotFoundError(`Job not found or already completed/cancelled`);
      }
      return sendSuccess(res, {
        data: cancelled,
        message: 'Job cancelled successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Quality & Reports ---
  static async getQualityReport(req, res, next) {
    try {
      const report = await prisma.dataQualityReport.findFirst({
        where: { datasetVersionId: req.params.datasetVersionId },
        orderBy: { evaluatedAt: 'desc' },
      });
      if (!report) {
        // Try evaluating on the fly if records exist
        const evaluated = await qualityService.evaluateDatasetQuality(req.params.datasetVersionId);
        return sendSuccess(res, {
          data: evaluated,
          message: 'Data quality report generated successfully',
        });
      }
      return sendSuccess(res, {
        data: report,
        message: 'Data quality report retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Quarantine Management ---
  static async listQuarantine(req, res, next) {
    try {
      const records = await quarantineService.listQuarantinedRecords(req.query);
      return sendSuccess(res, {
        data: records,
        message: 'Quarantined records retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getQuarantinedRecord(req, res, next) {
    try {
      const record = await quarantineService.getQuarantinedRecordById(req.params.recordId);
      return sendSuccess(res, {
        data: record,
        message: 'Quarantined record retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async reviewQuarantinedRecord(req, res, next) {
    try {
      const reviewed = await quarantineService.reviewQuarantinedRecord(req.params.recordId, {
        status: req.body.status,
        notes: req.body.notes,
        reviewedBy: req.user?.email || 'ADMIN',
      });
      return sendSuccess(res, {
        data: reviewed,
        message: 'Quarantined record reviewed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  // --- Official O*NET & ESCO Taxonomy Ingestion (Phase 33) ---
  static async importOnet(req, res, next) {
    try {
      const { isAsync, async: asyncFlag } = req.body;
      const shouldRunAsync = isAsync || asyncFlag;

      if (shouldRunAsync) {
        const jobResult = await jobService.enqueueJob(
          'ONET_IMPORT',
          async (job, updateProgress) => {
            return onetConnectorService.importOnetDataset(req.body, {
              createdBy: req.user?.email || 'ADMIN',
              force: req.body.force,
            });
          },
          {
            createdBy: req.user?.email || 'ADMIN',
            metadata: { versionTag: req.body.versionTag || 'latest' },
          }
        );

        return sendSuccess(res, {
          data: jobResult,
          statusCode: 202,
          message: 'O*NET taxonomy import job enqueued successfully',
        });
      }

      const result = await onetConnectorService.importOnetDataset(req.body, {
        force: req.body.force,
      });

      return sendSuccess(res, {
        data: result,
        message: 'Official O*NET taxonomy dataset imported successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async importEsco(req, res, next) {
    try {
      const { isAsync, async: asyncFlag } = req.body;
      const shouldRunAsync = isAsync || asyncFlag;

      if (shouldRunAsync) {
        const jobResult = await jobService.enqueueJob(
          'ESCO_IMPORT',
          async (job, updateProgress) => {
            return escoConnectorService.importEscoDataset(req.body, {
              createdBy: req.user?.email || 'ADMIN',
              force: req.body.force,
            });
          },
          {
            createdBy: req.user?.email || 'ADMIN',
            metadata: { versionTag: req.body.versionTag || 'latest' },
          }
        );

        return sendSuccess(res, {
          data: jobResult,
          statusCode: 202,
          message: 'ESCO taxonomy import job enqueued successfully',
        });
      }

      const result = await escoConnectorService.importEscoDataset(req.body, {
        force: req.body.force,
      });

      return sendSuccess(res, {
        data: result,
        message: 'Official ESCO taxonomy dataset imported successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSourcesSummary(req, res, next) {
    try {
      // Ensure official sources are registered
      await onetConnectorService.ensureOnetSource();
      await escoConnectorService.ensureEscoSource();

      const summary = await sourceRegistryService.getSourcesSummary();
      return sendSuccess(res, {
        data: summary,
        message: 'Data sources summary retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkSourceUpdate(req, res, next) {
    try {
      const updateInfo = await sourceRegistryService.checkSourceUpdate(req.params.sourceId);
      return sendSuccess(res, {
        data: updateInfo,
        message: 'Source version update check completed',
      });
    } catch (err) {
      next(err);
    }
  }

  static async listTaxonomyMappings(req, res, next) {
    try {
      const { source, entityType, internalEntityType, take, skip } = req.query;
      const where = {};
      if (source) where.source = source.toUpperCase();
      if (entityType) where.entityType = entityType.toUpperCase();
      if (internalEntityType) where.internalEntityType = internalEntityType.toUpperCase();

      const mappings = await prisma.externalTaxonomyMapping.findMany({
        where,
        take: take ? parseInt(take, 10) : 50,
        skip: skip ? parseInt(skip, 10) : 0,
      });

      const total = await prisma.externalTaxonomyMapping.count({ where });

      return sendSuccess(res, {
        data: {
          mappings,
          total,
        },
        message: 'External taxonomy mappings retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default IngestionController;

