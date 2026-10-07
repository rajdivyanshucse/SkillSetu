import organizationGrowthService from '../services/organizationGrowth.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getGrowthOverview = async (req, res, next) => {
  try {
    const growth = await organizationGrowthService.getGrowthOverview(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce capability growth overview retrieved',
      data: { growth },
    });
  } catch (error) {
    return next(error);
  }
};

export const getMilestones = async (req, res, next) => {
  try {
    const result = await organizationGrowthService.getMilestones(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce development milestones retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const result = await organizationGrowthService.getProjects(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce development projects retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getGrowthOverview,
  getMilestones,
  getProjects,
};
