import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import planningController from '../controllers/planning.controller.js';
import {
  scenarioParamSchema,
  createScenarioSchema,
  updateScenarioSchema,
  listScenariosQuerySchema,
  updateRoadmapProgressSchema,
} from '../validators/planning.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

// 1. Planning Overview
router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  planningController.getPlanningOverview
);

// 2. Planning Roadmap
router.get(
  '/roadmap',
  requireOrganizationAccess('Viewer'),
  planningController.getRoadmap
);

router.patch(
  '/roadmap/progress',
  requireOrganizationAccess('Editor'),
  validate(updateRoadmapProgressSchema),
  planningController.updateRoadmapProgress
);

// 3. Planning Scenarios
router.get(
  '/scenarios',
  requireOrganizationAccess('Viewer'),
  validate(listScenariosQuerySchema),
  planningController.getScenarios
);

router.get(
  '/scenarios/:scenarioId',
  requireOrganizationAccess('Viewer'),
  validate(scenarioParamSchema),
  planningController.getScenarioById
);

router.post(
  '/scenarios',
  requireOrganizationAccess('Editor'),
  validate(createScenarioSchema),
  planningController.createScenario
);

router.patch(
  '/scenarios/:scenarioId',
  requireOrganizationAccess('Editor'),
  validate(updateScenarioSchema),
  planningController.updateScenario
);

router.delete(
  '/scenarios/:scenarioId',
  requireOrganizationAccess('Admin'),
  validate(scenarioParamSchema),
  planningController.deleteScenario
);

export default router;
