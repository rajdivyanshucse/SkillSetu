import { Router } from 'express';
import * as opportunityController from '../controllers/opportunity.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { opportunityQuerySchema } from '../validators/application.validator.js';

const router = Router();

router.use(authenticate);

/**
 * Saved Opportunities (Individual Only)
 */
router.get('/saved', requireAccountType('INDIVIDUAL'), opportunityController.getSavedOpportunities);
router.post('/:opportunityId/save', requireAccountType('INDIVIDUAL'), opportunityController.saveOpportunity);
router.delete('/:opportunityId/save', requireAccountType('INDIVIDUAL'), opportunityController.removeSavedOpportunity);

/**
 * Opportunities Listing & Details
 */
router.get('/', validate(opportunityQuerySchema), opportunityController.getOpportunities);
router.get('/:opportunityId', opportunityController.getOpportunityById);
router.get('/:opportunityId/compatibility', requireAccountType('INDIVIDUAL'), opportunityController.calculateOpportunityCompatibility);

export default router;
