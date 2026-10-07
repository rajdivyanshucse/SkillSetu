import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import DemandIntelligenceController from '../controllers/demandIntelligence.controller.js';
import { validateForecastQuery } from '../validators/demandIntelligence.validator.js';

const router = Router();

// Require authentication and ORGANIZATION or ADMIN account type
router.use(authenticate);
router.use(requireAccountType('ORGANIZATION', 'ADMIN'));
router.use(requireOrganizationAccess('Viewer'));

/**
 * Organization Demand Intelligence Routes
 * Base prefix: /api/v1/organization/intelligence/demand
 */
router.get('/', DemandIntelligenceController.getOrganizationDemandOverview);
router.get('/skills', DemandIntelligenceController.getOrganizationSkillsDemand);
router.get('/roles', DemandIntelligenceController.getOrganizationRolesDemand);
router.get('/forecast', validateForecastQuery, DemandIntelligenceController.getOrganizationDemandForecast);

export default router;
