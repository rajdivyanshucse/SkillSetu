import { Router } from 'express';
import * as capabilityController from '../controllers/capabilityIntelligence.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { linkEvidenceSchema, capabilityQuerySchema } from '../validators/capability.validator.js';

const router = Router();

// All capability intelligence routes require authentication & INDIVIDUAL account type
router.use(authenticate);
router.use(requireAccountType('INDIVIDUAL'));

/**
 * Capability Profile & Summary
 */
router.get('/', validate(capabilityQuerySchema), capabilityController.getCapabilityProfile);
router.get('/summary', validate(capabilityQuerySchema), capabilityController.getCapabilitySummary);

/**
 * Capability Evidence Management
 */
router.get('/evidence', capabilityController.getCapabilityEvidenceList);
router.post('/evidence', validate(linkEvidenceSchema), capabilityController.linkEvidence);
router.delete('/evidence/:evidenceId', capabilityController.unlinkEvidence);

/**
 * Granular Capability Detail & Attached Evidence
 */
router.get('/:skillId', capabilityController.getCapabilityDetail);
router.get('/:skillId/evidence', capabilityController.getCapabilityEvidenceList);

/**
 * Target Role Capability Readiness Telemetry
 */
router.get('/roles/:roleId/readiness', capabilityController.getRoleCapabilityReadiness);

export default router;
