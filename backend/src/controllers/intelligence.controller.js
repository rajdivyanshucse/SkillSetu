import skillIntelligenceService from '../services/skillIntelligence.service.js';
import skillGapService from '../services/skillGap.service.js';
import careerIntelligenceService from '../services/careerIntelligence.service.js';
import roadmapService from '../services/roadmap.service.js';
import learningRecommendationService from '../services/learningRecommendation.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getSkillIntelligence = async (req, res, next) => {
  try {
    const intelligence = await skillIntelligenceService.getSkillIntelligence(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill intelligence summary retrieved',
      data: intelligence,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillCoverage = async (req, res, next) => {
  try {
    const coverage = await skillIntelligenceService.calculateSkillCoverage(req.user.id, req.query.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Capability coverage retrieved',
      data: coverage,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillGaps = async (req, res, next) => {
  try {
    const gaps = await skillGapService.getSkillGaps(req.user.id, {
      roleId: req.query.roleId,
      category: req.query.category,
      priority: req.query.priority,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill gap analysis retrieved',
      data: gaps,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillGapDetail = async (req, res, next) => {
  try {
    const detail = await skillGapService.getSkillGapDetail(req.user.id, req.params.skillId, req.query.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill gap detail retrieved',
      data: detail,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCareerIntelligence = async (req, res, next) => {
  try {
    const career = await careerIntelligenceService.getCareerIntelligence(req.user.id, req.query.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Career intelligence retrieved',
      data: career,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCareerSemanticIntelligence = async (req, res, next) => {
  try {
    const result = await careerIntelligenceService.getCareerSemanticIntelligence(req.user.id, req.query.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Career semantic intelligence retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCareerRoadmap = async (req, res, next) => {
  try {
    const roadmap = await roadmapService.getCareerRoadmap(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Development roadmap retrieved',
      data: roadmap,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoadmapById = async (req, res, next) => {
  try {
    const roadmap = await roadmapService.getCareerRoadmap(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Development roadmap detail retrieved',
      data: { roadmapId: req.params.roadmapId, roadmap },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateRoadmapProgress = async (req, res, next) => {
  try {
    const result = await roadmapService.updateRoadmapProgress(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Roadmap progress updated successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getLearningRecommendations = async (req, res, next) => {
  try {
    const recommendations = await learningRecommendationService.getLearningRecommendations(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Learning recommendations retrieved',
      data: recommendations,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getSkillIntelligence,
  getSkillCoverage,
  getSkillGaps,
  getSkillGapDetail,
  getCareerIntelligence,
  getCareerSemanticIntelligence,
  getCareerRoadmap,
  getRoadmapById,
  updateRoadmapProgress,
  getLearningRecommendations,
};
