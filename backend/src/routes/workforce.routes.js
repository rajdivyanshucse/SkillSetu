import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import workforceController from '../controllers/workforce.controller.js';
import {
  skillParamSchema,
  createOrgSkillSchema,
  updateOrgSkillSchema,
  listWorkforceQuerySchema,
} from '../validators/workforce.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

// 1. Workforce Skill Inventory
router.get(
  '/workforce',
  requireOrganizationAccess('Viewer'),
  validate(listWorkforceQuerySchema),
  workforceController.getWorkforce
);

router.get(
  '/workforce/:skillId',
  requireOrganizationAccess('Viewer'),
  validate(skillParamSchema),
  workforceController.getWorkforceSkillById
);

router.post(
  '/workforce/skills',
  requireOrganizationAccess('Editor'),
  validate(createOrgSkillSchema),
  workforceController.createWorkforceSkill
);

router.patch(
  '/workforce/skills/:skillId',
  requireOrganizationAccess('Editor'),
  validate(updateOrgSkillSchema),
  workforceController.updateWorkforceSkill
);

router.delete(
  '/workforce/skills/:skillId',
  requireOrganizationAccess('Editor'),
  validate(skillParamSchema),
  workforceController.deleteWorkforceSkill
);

// 2. Organization Skill Intelligence
router.get(
  '/intelligence/skills',
  requireOrganizationAccess('Viewer'),
  workforceController.getSkillIntelligence
);

router.get(
  '/intelligence/skill-clusters',
  requireOrganizationAccess('Viewer'),
  workforceController.getSkillClusters
);

// 3. Workforce Skill Gap Analysis
router.get(
  '/intelligence/skill-gaps',
  requireOrganizationAccess('Viewer'),
  workforceController.getSkillGaps
);

router.get(
  '/intelligence/skill-gaps/:skillId',
  requireOrganizationAccess('Viewer'),
  validate(skillParamSchema),
  workforceController.getSkillGapById
);

export default router;
