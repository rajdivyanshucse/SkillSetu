import { FutureCapabilityIntelligenceService } from '../services/futureCapabilityIntelligence.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getRoleFutureCapabilities = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { roleId } = req.params;
    const { forecastHorizon, includeAdjacent } = req.query;

    const data = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(userId, roleId, {
      forecastHorizon: forecastHorizon ? Number(forecastHorizon) : 3,
      includeAdjacent: includeAdjacent !== 'false' && includeAdjacent !== false,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future capability intelligence retrieved successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleFutureHorizon = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { roleId } = req.params;
    const { forecastHorizon } = req.query;

    const fullData = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(userId, roleId, {
      forecastHorizon: forecastHorizon ? Number(forecastHorizon) : 3,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future capability horizon retrieved successfully',
      data: {
        targetRole: fullData.targetRole,
        horizons: fullData.horizons,
        summary: fullData.summary,
        disclaimer: fullData.disclaimer,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleFutureGaps = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { roleId } = req.params;

    const fullData = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(userId, roleId);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Future-relevant capability gaps retrieved successfully',
      data: {
        targetRole: fullData.targetRole,
        futureRelevantGaps: fullData.futureRelevantGaps,
        disclaimer: fullData.disclaimer,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillFutureCapabilityDetail = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { skillId } = req.params;
    const { roleId } = req.query;

    const data = await FutureCapabilityIntelligenceService.getSkillFutureCapabilityDetail(userId, skillId, roleId);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill future capability detail retrieved successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getWorkforceFutureCapabilities = async (req, res, next) => {
  try {
    const organizationId = req.user?.organizationId || req.query.organizationId || 'org-demo-1';
    const data = await FutureCapabilityIntelligenceService.getWorkforceFutureCapabilities(organizationId, req.query);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Workforce future capability intelligence retrieved successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getRoleFutureCapabilities,
  getRoleFutureHorizon,
  getRoleFutureGaps,
  getSkillFutureCapabilityDetail,
  getWorkforceFutureCapabilities,
};
