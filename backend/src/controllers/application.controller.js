import applicationService from '../services/application.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getUserApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getUserApplications(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'User applications retrieved',
      data: { applications },
    });
  } catch (error) {
    return next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Application recorded successfully',
      data: { application },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const application = await applicationService.updateApplication(req.user.id, req.params.applicationId, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Application updated successfully',
      data: { application },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const result = await applicationService.deleteApplication(req.user.id, req.params.applicationId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getUserApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
