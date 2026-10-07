import organizationService from '../services/organization.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await organizationService.getProfile(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization profile retrieved',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const createProfile = async (req, res, next) => {
  try {
    const profile = await organizationService.createProfile(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Organization profile created successfully',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await organizationService.updateProfile(req.organization.id, req.body, req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization profile updated successfully',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const resetProfile = async (req, res, next) => {
  try {
    const profile = await organizationService.resetProfile(req.organization.id, req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization profile reset successfully',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSnapshot = async (req, res, next) => {
  try {
    const snapshot = await organizationService.getSnapshot(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization snapshot retrieved',
      data: { snapshot },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getProfile,
  createProfile,
  updateProfile,
  resetProfile,
  getSnapshot,
};
