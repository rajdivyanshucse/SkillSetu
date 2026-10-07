import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import organizationLearningController from '../controllers/organizationLearning.controller.js';
import {
  programParamSchema,
  createProgramSchema,
  updateProgramSchema,
  listProgramsQuerySchema,
} from '../validators/learning.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  organizationLearningController.getLearningOverview
);

router.get(
  '/programs',
  requireOrganizationAccess('Viewer'),
  validate(listProgramsQuerySchema),
  organizationLearningController.getPrograms
);

router.get(
  '/programs/:programId',
  requireOrganizationAccess('Viewer'),
  validate(programParamSchema),
  organizationLearningController.getProgramById
);

router.post(
  '/programs',
  requireOrganizationAccess('Editor'),
  validate(createProgramSchema),
  organizationLearningController.createProgram
);

router.patch(
  '/programs/:programId',
  requireOrganizationAccess('Editor'),
  validate(updateProgramSchema),
  organizationLearningController.updateProgram
);

router.delete(
  '/programs/:programId',
  requireOrganizationAccess('Admin'),
  validate(programParamSchema),
  organizationLearningController.deleteProgram
);

export default router;
