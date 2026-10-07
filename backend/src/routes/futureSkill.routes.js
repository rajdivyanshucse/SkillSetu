import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import futureSkillController from '../controllers/futureSkill.controller.js';
import {
  futureSkillParamSchema,
  createFutureSkillSchema,
  updateFutureSkillSchema,
  listFutureSkillsQuerySchema,
} from '../validators/futureSkill.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(listFutureSkillsQuerySchema),
  futureSkillController.getFutureSkills
);

router.get(
  '/:futureSkillId',
  requireOrganizationAccess('Viewer'),
  validate(futureSkillParamSchema),
  futureSkillController.getFutureSkillById
);

router.post(
  '/',
  requireOrganizationAccess('Editor'),
  validate(createFutureSkillSchema),
  futureSkillController.createFutureSkill
);

router.patch(
  '/:futureSkillId',
  requireOrganizationAccess('Editor'),
  validate(updateFutureSkillSchema),
  futureSkillController.updateFutureSkill
);

router.delete(
  '/:futureSkillId',
  requireOrganizationAccess('Editor'),
  validate(futureSkillParamSchema),
  futureSkillController.deleteFutureSkill
);

export default router;
