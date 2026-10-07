import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import organizationRoleController from '../controllers/organizationRole.controller.js';
import {
  roleParamSchema,
  createOrgRoleSchema,
  updateOrgRoleSchema,
  listOrgRolesQuerySchema,
} from '../validators/role.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(listOrgRolesQuerySchema),
  organizationRoleController.getRoles
);

router.get(
  '/:roleId/semantic-skills',
  requireOrganizationAccess('Viewer'),
  validate(roleParamSchema),
  organizationRoleController.getRoleSemanticSkills
);

router.get(
  '/:roleId',
  requireOrganizationAccess('Viewer'),
  validate(roleParamSchema),
  organizationRoleController.getRoleById
);

router.post(
  '/',
  requireOrganizationAccess('Editor'),
  validate(createOrgRoleSchema),
  organizationRoleController.createRole
);

router.patch(
  '/:roleId',
  requireOrganizationAccess('Editor'),
  validate(updateOrgRoleSchema),
  organizationRoleController.updateRole
);

router.delete(
  '/:roleId',
  requireOrganizationAccess('Admin'),
  validate(roleParamSchema),
  organizationRoleController.deleteRole
);

export default router;
