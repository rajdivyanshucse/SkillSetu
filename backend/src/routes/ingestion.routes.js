import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { ApiError } from '../utils/apiError.js';
import IngestionController from '../controllers/ingestion.controller.js';
import {
  createSourceSchema,
  createDatasetSchema,
  createDatasetVersionSchema,
  importDatasetSchema,
  importOnetSchema,
  importEscoSchema,
  quarantineReviewSchema,
} from '../validators/ingestion.validator.js';

const router = Router();

// Middleware ensuring platform administrator privileges
const requirePlatformAdmin = (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication is required', 'UNAUTHENTICATED'));
  }
  const role = req.user.role || req.tokenPayload?.role;
  if (role !== 'ADMIN') {
    return next(
      ApiError.forbidden('Access denied. Platform administrator privileges required.', 'FORBIDDEN_ADMIN_ACCESS')
    );
  }
  return next();
};

router.use(authenticate);
router.use(requirePlatformAdmin);

// Data Sources & Summaries
router.post('/sources', validate(createSourceSchema), IngestionController.createSource);
router.get('/sources', IngestionController.listSources);
router.get('/sources-summary', IngestionController.getSourcesSummary);
router.get('/sources/:sourceId', IngestionController.getSourceById);
router.post('/sources/:sourceId/check-update', IngestionController.checkSourceUpdate);

// Official O*NET & ESCO Taxonomy Ingestion (Phase 33)
router.post('/onet/import', validate(importOnetSchema), IngestionController.importOnet);
router.post('/esco/import', validate(importEscoSchema), IngestionController.importEsco);
router.get('/taxonomy-mappings', IngestionController.listTaxonomyMappings);

// Datasets
router.post('/datasets', validate(createDatasetSchema), IngestionController.createDataset);
router.get('/datasets', IngestionController.listDatasets);
router.get('/datasets/:datasetId', IngestionController.getDatasetById);
router.post('/datasets/:datasetId/versions', validate(createDatasetVersionSchema), IngestionController.createDatasetVersion);
router.get('/datasets/:datasetId/versions', IngestionController.listDatasetVersions);
router.post('/datasets/:datasetId/import', validate(importDatasetSchema), IngestionController.importDataset);

// Ingestion Jobs
router.get('/jobs', IngestionController.listJobs);
router.get('/jobs/:jobId', IngestionController.getJobById);
router.post('/jobs/:jobId/cancel', IngestionController.cancelJob);

// Data Quality Reports
router.get('/quality/:datasetVersionId', IngestionController.getQualityReport);

// Quarantine Management
router.get('/quarantine', IngestionController.listQuarantine);
router.get('/quarantine/:recordId', IngestionController.getQuarantinedRecord);
router.patch('/quarantine/:recordId/review', validate(quarantineReviewSchema), IngestionController.reviewQuarantinedRecord);

export default router;

