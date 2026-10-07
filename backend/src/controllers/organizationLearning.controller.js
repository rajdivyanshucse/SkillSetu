import organizationLearningService from '../services/organizationLearning.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getLearningOverview = async (req, res, next) => {
  try {
    const result = await organizationLearningService.getLearningOverview(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization learning overview retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPrograms = async (req, res, next) => {
  try {
    const result = await organizationLearningService.getPrograms(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Learning programs retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProgramById = async (req, res, next) => {
  try {
    const program = await organizationLearningService.getProgramById(req.organization.id, req.params.programId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Learning program details retrieved',
      data: { program },
    });
  } catch (error) {
    return next(error);
  }
};

export const createProgram = async (req, res, next) => {
  try {
    const program = await organizationLearningService.createProgram(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Learning program created successfully',
      data: { program },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProgram = async (req, res, next) => {
  try {
    const program = await organizationLearningService.updateProgram(
      req.organization.id,
      req.params.programId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Learning program updated successfully',
      data: { program },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProgram = async (req, res, next) => {
  try {
    const result = await organizationLearningService.deleteProgram(req.organization.id, req.params.programId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { programId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getLearningOverview,
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
