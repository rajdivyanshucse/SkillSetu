import { Router } from 'express';
import * as roadmapController from '../controllers/adaptiveRoadmap.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  generateRoadmapSchema,
  completeStageSchema,
  reEvaluateRoadmapSchema,
  syncLegacyProgressSchema,
} from '../validators/adaptiveRoadmap.validator.js';

const router = Router();

// All roadmap routes require authentication & INDIVIDUAL account type
router.use(authenticate);
router.use(requireAccountType('INDIVIDUAL'));

/**
 * Development Roadmap Core Lifecycle
 */
router.get('/active', validate(generateRoadmapSchema), roadmapController.getActiveRoadmap);
router.post('/generate', validate(generateRoadmapSchema), roadmapController.generateRoadmap);
router.post('/re-evaluate', validate(reEvaluateRoadmapSchema), roadmapController.reEvaluateRoadmap);
router.post('/:roadmapId/re-evaluate', validate(reEvaluateRoadmapSchema), roadmapController.reEvaluateRoadmap);

/**
 * Stage Progress & Validation Guards
 */
router.patch('/:roadmapId/stages/:stageId/complete', validate(completeStageSchema), roadmapController.completeStage);
router.post('/:roadmapId/stages/:stageId/complete', validate(completeStageSchema), roadmapController.completeStage);

/**
 * Versioning & Traceable Re-evaluation History
 */
router.get('/:roadmapId/history', roadmapController.getRoadmapHistory);
router.get('/history', roadmapController.getRoadmapHistory);

/**
 * Safe Migration for Legacy Frontend Progress (skillsetu_roadmap_progress_v1)
 */
router.post('/sync-legacy', validate(syncLegacyProgressSchema), roadmapController.syncLegacyProgress);

export default router;
