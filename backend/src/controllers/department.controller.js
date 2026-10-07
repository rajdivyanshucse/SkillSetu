import departmentService from '../services/department.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDepartments = async (req, res, next) => {
  try {
    const result = await departmentService.getDepartments(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Departments retrieved successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartmentById(req.organization.id, req.params.departmentId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Department details retrieved',
      data: { department },
    });
  } catch (error) {
    return next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.createDepartment(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.updateDepartment(
      req.organization.id,
      req.params.departmentId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Department updated successfully',
      data: { department },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.deleteDepartment(req.organization.id, req.params.departmentId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { departmentId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
