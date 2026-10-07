import workforcePlanningService from '../services/workforcePlanning.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getPlanningOverview = async (req, res, next) => {
  try {
    const planning = await workforcePlanningService.getPlanningOverview(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce planning overview retrieved',
      data: { planning },
    });
  } catch (error) {
    return next(error);
  }
};

export const getScenarios = async (req, res, next) => {
  try {
    const result = await workforcePlanningService.getScenarios(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Planning scenarios retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getScenarioById = async (req, res, next) => {
  try {
    const scenario = await workforcePlanningService.getScenarioById(req.organization.id, req.params.scenarioId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Planning scenario details retrieved',
      data: { scenario },
    });
  } catch (error) {
    return next(error);
  }
};

export const createScenario = async (req, res, next) => {
  try {
    const scenario = await workforcePlanningService.createScenario(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Planning scenario created successfully',
      data: { scenario },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateScenario = async (req, res, next) => {
  try {
    const scenario = await workforcePlanningService.updateScenario(
      req.organization.id,
      req.params.scenarioId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Planning scenario updated successfully',
      data: { scenario },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteScenario = async (req, res, next) => {
  try {
    const result = await workforcePlanningService.deleteScenario(req.organization.id, req.params.scenarioId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { scenarioId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await workforcePlanningService.getRoadmap(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Planning roadmap retrieved',
      data: { roadmap },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRoadmapProgress = async (req, res, next) => {
  try {
    const progress = await workforcePlanningService.updateRoadmapProgress(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Planning roadmap action progress updated',
      data: { progress },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getPlanningOverview,
  getScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  getRoadmap,
  updateRoadmapProgress,
};
