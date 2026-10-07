import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import organizationGrowthController from '../controllers/organizationGrowth.controller.js';
import { growthQuerySchema } from '../validators/growth.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  organizationGrowthController.getGrowthOverview
);

router.get(
  '/milestones',
  requireOrganizationAccess('Viewer'),
  validate(growthQuerySchema),
  organizationGrowthController.getMilestones
);

router.get(
  '/projects',
  requireOrganizationAccess('Viewer'),
  validate(growthQuerySchema),
  organizationGrowthController.getProjects
);

export default router;
