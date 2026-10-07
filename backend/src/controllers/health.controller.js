import { getSystemHealth, getSystemReadiness } from '../services/health.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Health check controller
 */
export const checkHealth = async (req, res, next) => {
  try {
    const healthData = await getSystemHealth();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'SkillSetu API is running',
      data: healthData,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Readiness probe controller
 */
export const checkReadiness = async (req, res, next) => {
  try {
    const readiness = await getSystemReadiness();

    if (!readiness.ready) {
      return sendError(res, {
        statusCode: 503,
        message: 'System is not ready to accept traffic',
        code: 'SYSTEM_NOT_READY',
        details: readiness,
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'System is ready to accept traffic',
      data: readiness,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  checkHealth,
  checkReadiness,
};
