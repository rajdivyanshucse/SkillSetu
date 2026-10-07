import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import organizationController from '../controllers/organization.controller.js';
import { createOrganizationSchema, updateOrganizationSchema } from '../validators/organization.validator.js';

const router = Router();

// Require authenticated organization account
router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

// Organization Profile APIs
router.get(
  '/profile',
  requireOrganizationAccess('Viewer'),
  organizationController.getProfile
);

router.post(
  '/profile',
  validate(createOrganizationSchema),
  organizationController.createProfile
);

router.patch(
  '/profile',
  requireOrganizationAccess('Editor'),
  validate(updateOrganizationSchema),
  organizationController.updateProfile
);

router.delete(
  '/profile',
  requireOrganizationAccess('Admin'),
  organizationController.resetProfile
);

router.get(
  '/profile/snapshot',
  requireOrganizationAccess('Viewer'),
  organizationController.getSnapshot
);

export default router;
