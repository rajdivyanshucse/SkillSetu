import { ApiError } from '../utils/apiError.js';

export const validateForecastQuery = (req, res, next) => {
  const { skillId, roleId, horizon, model, confidenceLevel } = req.query;

  if (!skillId && !roleId) {
    return next(ApiError.badRequest('Either skillId or roleId query parameter must be specified', 'MISSING_TARGET_PARAMETER'));
  }

  if (horizon !== undefined) {
    const h = parseInt(horizon, 10);
    if (isNaN(h) || h < 1 || h > 12) {
      return next(ApiError.badRequest('Forecast horizon must be an integer between 1 and 12', 'INVALID_HORIZON'));
    }
  }

  if (model !== undefined) {
    const validModels = ['AUTO', 'LINEAR_TREND', 'MOVING_AVERAGE', 'EXPONENTIAL_SMOOTHING', 'NAIVE'];
    if (!validModels.includes(model.toUpperCase())) {
      return next(ApiError.badRequest(`Model must be one of: ${validModels.join(', ')}`, 'INVALID_MODEL'));
    }
  }

  if (confidenceLevel !== undefined) {
    const c = parseFloat(confidenceLevel);
    if (isNaN(c) || c < 0.50 || c > 0.99) {
      return next(ApiError.badRequest('Confidence level must be a decimal between 0.50 and 0.99', 'INVALID_CONFIDENCE_LEVEL'));
    }
  }

  next();
};

export const validateDemandListQuery = (req, res, next) => {
  const { trend, limit, offset } = req.query;

  if (trend !== undefined) {
    const validTrends = ['GROWING', 'STABLE', 'DECLINING', 'VOLATILE', 'INSUFFICIENT_DATA'];
    if (!validTrends.includes(trend.toUpperCase())) {
      return next(ApiError.badRequest(`Trend category must be one of: ${validTrends.join(', ')}`, 'INVALID_TREND_CATEGORY'));
    }
  }

  if (limit !== undefined) {
    const l = parseInt(limit, 10);
    if (isNaN(l) || l < 1 || l > 100) {
      return next(ApiError.badRequest('Limit must be an integer between 1 and 100', 'INVALID_LIMIT'));
    }
  }

  if (offset !== undefined) {
    const o = parseInt(offset, 10);
    if (isNaN(o) || o < 0) {
      return next(ApiError.badRequest('Offset must be a non-negative integer', 'INVALID_OFFSET'));
    }
  }

  next();
};

export const validateSkillIdParam = (req, res, next) => {
  const { skillId } = req.params;
  if (!skillId || typeof skillId !== 'string' || skillId.trim().length === 0) {
    return next(ApiError.badRequest('Valid skillId parameter required', 'INVALID_SKILL_ID'));
  }
  next();
};
