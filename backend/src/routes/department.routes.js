import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import departmentController from '../controllers/department.controller.js';
import {
  departmentParamSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  listDepartmentsQuerySchema,
} from '../validators/department.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(listDepartmentsQuerySchema),
  departmentController.getDepartments
);

router.get(
  '/:departmentId',
  requireOrganizationAccess('Viewer'),
  validate(departmentParamSchema),
  departmentController.getDepartmentById
);

router.post(
  '/',
  requireOrganizationAccess('Editor'),
  validate(createDepartmentSchema),
  departmentController.createDepartment
);

router.patch(
  '/:departmentId',
  requireOrganizationAccess('Editor'),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment
);

router.delete(
  '/:departmentId',
  requireOrganizationAccess('Admin'),
  validate(departmentParamSchema),
  departmentController.deleteDepartment
);

export default router;
