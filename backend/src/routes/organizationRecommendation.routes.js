import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import organizationRecommendationController from '../controllers/organizationRecommendation.controller.js';

const router = Router();

// Require authentication and ORGANIZATION or ADMIN account type
router.use(authenticate);
router.use(requireAccountType('ORGANIZATION', 'ADMIN'));
router.use(requireOrganizationAccess('Viewer'));

/**
 * Organization Recommendations Routes
 * Base prefix: /api/v1/organization/recommendations
 */

// Category specific filters
router.get('/workforce', organizationRecommendationController.getWorkforceRecommendations);
router.get('/skills', organizationRecommendationController.getSkillRecommendations);
router.get('/learning', organizationRecommendationController.getLearningRecommendations);
router.get('/future-skills', organizationRecommendationController.getFutureSkillRecommendations);

// Core endpoints
router.get('/', organizationRecommendationController.getRecommendations);
router.post('/generate', requireOrganizationAccess('Editor'), organizationRecommendationController.generateRecommendations);
router.get('/:id', organizationRecommendationController.getRecommendationById);
router.patch('/:id/status', requireOrganizationAccess('Editor'), organizationRecommendationController.updateStatus);

export default router;
