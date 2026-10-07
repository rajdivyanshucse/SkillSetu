import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import organizationMemberController from '../controllers/organizationMember.controller.js';
import {
  memberParamSchema,
  createMemberSchema,
  updateMemberSchema,
  listMembersQuerySchema,
} from '../validators/organizationMember.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(listMembersQuerySchema),
  organizationMemberController.getMembers
);

router.get(
  '/:memberId',
  requireOrganizationAccess('Viewer'),
  validate(memberParamSchema),
  organizationMemberController.getMemberById
);

router.post(
  '/',
  requireOrganizationAccess('Admin'),
  validate(createMemberSchema),
  organizationMemberController.createMember
);

router.patch(
  '/:memberId',
  requireOrganizationAccess('Admin'),
  validate(updateMemberSchema),
  organizationMemberController.updateMember
);

router.delete(
  '/:memberId',
  requireOrganizationAccess('Admin'),
  validate(memberParamSchema),
  organizationMemberController.deleteMember
);

export default router;
