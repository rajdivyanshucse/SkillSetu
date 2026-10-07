import organizationRoleService from '../services/organizationRole.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getRoles = async (req, res, next) => {
  try {
    const result = await organizationRoleService.getRoles(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role benchmarks retrieved successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const role = await organizationRoleService.getRoleById(req.organization.id, req.params.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role benchmark details retrieved',
      data: { role },
    });
  } catch (error) {
    return next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const role = await organizationRoleService.createRole(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Role benchmark created successfully',
      data: { role },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await organizationRoleService.updateRole(
      req.organization.id,
      req.params.roleId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role benchmark updated successfully',
      data: { role },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const result = await organizationRoleService.deleteRole(req.organization.id, req.params.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { roleId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleSemanticSkills = async (req, res, next) => {
  try {
    const result = await organizationRoleService.getRoleSemanticSkills(
      req.organization.id,
      req.params.roleId
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role semantic skill analysis retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleSemanticSkills,
};

