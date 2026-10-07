import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import compensationController from '../controllers/compensation.controller.js';
import {
  roleCompParamSchema,
  compQuerySchema,
} from '../validators/compensation.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(compQuerySchema),
  compensationController.getCompensationOverview
);

router.get(
  '/locations',
  requireOrganizationAccess('Viewer'),
  compensationController.getLocationCompensation
);

router.get(
  '/roles/:roleId',
  requireOrganizationAccess('Viewer'),
  validate(roleCompParamSchema),
  compensationController.getRoleCompensation
);

export default router;
