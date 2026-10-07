import workforceService from '../services/workforce.service.js';
import skillIntelligenceService from '../services/organizationSkillIntelligence.service.js';
import skillGapService from '../services/organizationSkillGap.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getWorkforce = async (req, res, next) => {
  try {
    const result = await workforceService.getWorkforce(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce skill inventory retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getWorkforceSkillById = async (req, res, next) => {
  try {
    const skill = await workforceService.getWorkforceSkillById(req.organization.id, req.params.skillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce skill detail retrieved',
      data: { skill },
    });
  } catch (error) {
    return next(error);
  }
};

export const createWorkforceSkill = async (req, res, next) => {
  try {
    const skill = await workforceService.createWorkforceSkill(req.organization.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Skill added to workforce inventory successfully',
      data: { skill },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateWorkforceSkill = async (req, res, next) => {
  try {
    const skill = await workforceService.updateWorkforceSkill(
      req.organization.id,
      req.params.skillId,
      req.body
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce skill updated successfully',
      data: { skill },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteWorkforceSkill = async (req, res, next) => {
  try {
    const result = await workforceService.deleteWorkforceSkill(req.organization.id, req.params.skillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { skillId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

// Organization Skill Intelligence Endpoints
export const getSkillIntelligence = async (req, res, next) => {
  try {
    const intelligence = await skillIntelligenceService.getAggregatedSkillIntelligence(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Aggregated workforce skill intelligence retrieved',
      data: { intelligence },
    });
  } catch (error) {
    return next(error);
  }
};

// Organization Skill Gap Endpoints
export const getSkillGaps = async (req, res, next) => {
  try {
    const result = await skillGapService.getSkillGaps(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce skill gaps analysis retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillGapById = async (req, res, next) => {
  try {
    const gap = await skillGapService.getSkillGapBySkillId(req.organization.id, req.params.skillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill gap details retrieved',
      data: { gap },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillClusters = async (req, res, next) => {
  try {
    const result = await skillIntelligenceService.getSkillClusters(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce semantic skill clusters retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getWorkforce,
  getWorkforceSkillById,
  createWorkforceSkill,
  updateWorkforceSkill,
  deleteWorkforceSkill,
  getSkillIntelligence,
  getSkillGaps,
  getSkillGapById,
  getSkillClusters,
};

