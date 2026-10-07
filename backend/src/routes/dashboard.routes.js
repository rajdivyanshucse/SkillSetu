import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import organizationDashboardController from '../controllers/organizationDashboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';

const router = Router();

router.use(authenticate);

// Individual Dashboard Aggregated Intelligence
router.get('/individual', requireAccountType('INDIVIDUAL'), dashboardController.getIndividualDashboard);

// Organization Dashboard Aggregated Intelligence
router.get(
  '/organization',
  requireAccountType('ORGANIZATION'),
  requireOrganizationAccess('Viewer'),
  organizationDashboardController.getOrganizationDashboard
);

export default router;
