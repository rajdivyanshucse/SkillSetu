import AdaptiveRoadmapService from '../services/adaptiveRoadmap.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getActiveRoadmap = async (req, res, next) => {
  try {
    const roadmap = await AdaptiveRoadmapService.getActiveRoadmap(req.user.id, {
      targetRoleId: req.query.targetRoleId || req.query.roleId,
      forceRecalculate: req.query.forceRecalculate === 'true',
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Active adaptive development roadmap retrieved successfully',
      data: roadmap,
    });
  } catch (error) {
    return next(error);
  }
};

export const generateRoadmap = async (req, res, next) => {
  try {
    const roadmap = await AdaptiveRoadmapService.generateRoadmap(req.user.id, {
      targetRoleId: req.body.targetRoleId || req.query.targetRoleId,
      reason: req.body.reason || 'MANUAL_RECALCULATION',
      triggerEntity: req.body.triggerEntity,
    });
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Adaptive development roadmap generated successfully',
      data: roadmap,
    });
  } catch (error) {
    return next(error);
  }
};

export const completeStage = async (req, res, next) => {
  try {
    const { roadmapId, stageId } = req.params;
    const { completedEvidenceId } = req.body;
    const result = await AdaptiveRoadmapService.completeStage(req.user.id, roadmapId, stageId, {
      completedEvidenceId,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message || 'Stage completed successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const reEvaluateRoadmap = async (req, res, next) => {
  try {
    const roadmap = await AdaptiveRoadmapService.reEvaluateRoadmap(req.user.id, {
      triggerType: req.body.triggerType || 'MANUAL',
      triggerEntity: req.body.triggerEntity,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Roadmap re-evaluated and updated against latest capability intelligence',
      data: roadmap,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoadmapHistory = async (req, res, next) => {
  try {
    const { roadmapId } = req.params;
    const history = await AdaptiveRoadmapService.getRoadmapHistory(req.user.id, roadmapId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Roadmap version and re-evaluation history retrieved successfully',
      data: history,
    });
  } catch (error) {
    return next(error);
  }
};

export const syncLegacyProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const result = await AdaptiveRoadmapService.syncLegacyProgress(req.user.id, progress);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message || 'Legacy progress synchronized successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getActiveRoadmap,
  generateRoadmap,
  completeStage,
  reEvaluateRoadmap,
  getRoadmapHistory,
  syncLegacyProgress,
};
