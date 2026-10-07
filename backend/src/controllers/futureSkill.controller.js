import futureSkillService from '../services/futureSkill.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getFutureSkills = async (req, res, next) => {
  try {
    const result = await futureSkillService.getFutureSkills(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future skill requirements retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getFutureSkillById = async (req, res, next) => {
  try {
    const futureSkill = await futureSkillService.getFutureSkillById(req.organization.id, req.params.futureSkillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future skill requirement details retrieved',
      data: { futureSkill },
    });
  } catch (error) {
    return next(error);
  }
};

export const createFutureSkill = async (req, res, next) => {
  try {
    const futureSkill = await futureSkillService.createFutureSkill(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Future skill requirement created successfully',
      data: { futureSkill },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateFutureSkill = async (req, res, next) => {
  try {
    const futureSkill = await futureSkillService.updateFutureSkill(
      req.organization.id,
      req.params.futureSkillId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future skill requirement updated successfully',
      data: { futureSkill },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteFutureSkill = async (req, res, next) => {
  try {
    const result = await futureSkillService.deleteFutureSkill(req.organization.id, req.params.futureSkillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { futureSkillId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getFutureSkills,
  getFutureSkillById,
  createFutureSkill,
  updateFutureSkill,
  deleteFutureSkill,
};
