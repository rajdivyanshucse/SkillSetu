import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import DemandIntelligenceController from '../controllers/demandIntelligence.controller.js';
import {
  validateForecastQuery,
  validateDemandListQuery,
  validateSkillIdParam,
} from '../validators/demandIntelligence.validator.js';

const router = Router();

/**
 * Individual Demand Intelligence Routes
 * Base prefix: /api/v1/intelligence/demand
 */
router.get(
  '/skills',
  authenticate,
  validateDemandListQuery,
  DemandIntelligenceController.getSkillsDemand
);

router.get(
  '/skills/:skillId',
  authenticate,
  validateSkillIdParam,
  DemandIntelligenceController.getSkillDemandById
);

router.get(
  '/emerging-skills',
  authenticate,
  DemandIntelligenceController.getEmergingSkills
);

router.get(
  '/forecast',
  authenticate,
  validateForecastQuery,
  DemandIntelligenceController.getDemandForecast
);

export default router;
