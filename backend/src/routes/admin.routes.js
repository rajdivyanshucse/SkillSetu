import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { adminRebuildLimiter } from '../middleware/rateLimiter.js';
import { ApiError } from '../utils/apiError.js';
import {
  getAdminAiStatus,
  reindexSkillEmbeddings,
  switchEmbeddingModel,
  getDemandAdminStatus,
  rebuildDemandData,
  rebuildDemandForecasts,
  listAdminJobs,
  getAdminJobDetails,
  cancelAdminJob,
  getAdminMetrics,
} from '../controllers/admin.controller.js';

const router = Router();

// Middleware ensuring platform administrator role exclusively
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

// AI Administration
router.get('/ai/status', getAdminAiStatus);
router.post('/ai/skills/reindex', adminRebuildLimiter, reindexSkillEmbeddings);
router.post('/ai/model/switch', adminRebuildLimiter, switchEmbeddingModel);

// Demand Admin Endpoints
router.get('/ai/demand/status', getDemandAdminStatus);
router.post('/ai/demand/rebuild', adminRebuildLimiter, rebuildDemandData);
router.post('/ai/demand/forecast/rebuild', adminRebuildLimiter, rebuildDemandForecasts);

// Background Jobs Endpoints
router.get('/jobs', listAdminJobs);
router.get('/jobs/:jobId', getAdminJobDetails);
router.post('/jobs/:jobId/cancel', cancelAdminJob);

// Observability Metrics Endpoint
router.get('/metrics', getAdminMetrics);

export default router;
