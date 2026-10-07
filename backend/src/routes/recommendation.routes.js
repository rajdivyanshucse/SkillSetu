import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import recommendationController from '../controllers/recommendation.controller.js';
import {
  recommendationQuerySchema,
  recommendationStatusUpdateSchema,
  recommendationDismissSchema,
  recommendationGenerateSchema,
} from '../validators/recommendation.validator.js';

const router = Router();

// Authentication required for all individual recommendation endpoints
router.use(authenticate);

/**
 * Individual Recommendations Routes
 * Base prefix: /api/v1/recommendations
 */

// Specific category sub-routes (declared before parameterized :recommendationId)
router.get('/skills', recommendationController.getSkillRecommendations);
router.get('/career', recommendationController.getCareerRecommendations);
router.get('/learning', recommendationController.getLearningRecommendations);
router.get('/projects', recommendationController.getProjectRecommendations);
router.get('/opportunities', recommendationController.getOpportunityRecommendations);

// Core collection and generation endpoints
router.get('/', validate(recommendationQuerySchema), recommendationController.getRecommendations);
router.post('/generate', validate(recommendationGenerateSchema), recommendationController.generateRecommendations);

// Item specific endpoints
router.get('/:recommendationId', recommendationController.getRecommendationById);
router.patch('/:recommendationId/status', validate(recommendationStatusUpdateSchema), recommendationController.updateStatus);
router.post('/:recommendationId/dismiss', validate(recommendationDismissSchema), recommendationController.dismiss);

export default router;
