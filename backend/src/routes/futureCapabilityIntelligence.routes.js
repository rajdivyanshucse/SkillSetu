import { Router } from 'express';
import * as futureCapabilityController from '../controllers/futureCapabilityIntelligence.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  roleFutureCapabilitiesSchema,
  skillFutureCapabilitySchema,
  workforceFutureCapabilitiesSchema,
} from '../validators/futureCapability.validator.js';

const router = Router();

// Require authentication for all future capability intelligence endpoints
router.use(authenticate);

/**
 * Target Role Future Capability Intelligence & Horizons
 */
router.get('/roles/:roleId', validate(roleFutureCapabilitiesSchema), futureCapabilityController.getRoleFutureCapabilities);
router.get('/roles/:roleId/horizon', validate(roleFutureCapabilitiesSchema), futureCapabilityController.getRoleFutureHorizon);
router.get('/roles/:roleId/gaps', validate(roleFutureCapabilitiesSchema), futureCapabilityController.getRoleFutureGaps);

/**
 * Skill Future Capability Details
 */
router.get('/skills/:skillId', validate(skillFutureCapabilitySchema), futureCapabilityController.getSkillFutureCapabilityDetail);

/**
 * Organization Workforce Future Capability Horizon
 */
router.get('/workforce', validate(workforceFutureCapabilitiesSchema), futureCapabilityController.getWorkforceFutureCapabilities);

export default router;
