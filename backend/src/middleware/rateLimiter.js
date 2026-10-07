import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

const createRateLimiter = (windowMs, max, customMessage, customCode = 'RATE_LIMIT_EXCEEDED') => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return sendError(res, {
        statusCode: 429,
        message: customMessage || 'Too many requests, please try again later.',
        code: customCode,
        details: {
          windowMs,
          max,
        },
      });
    },
  });
};

/**
 * Global general API rate limiter
 */
export const globalRateLimiter = createRateLimiter(
  env.rateLimit.windowMs,
  env.rateLimit.max,
  'Too many requests from this IP address, please try again later.',
  'RATE_LIMIT_EXCEEDED'
);

/**
 * Strict authentication limiter (login, register, token refresh)
 */
export const authRateLimiter = createRateLimiter(
  env.authRateLimit.windowMs,
  env.authRateLimit.max,
  'Too many authentication attempts from this IP address, please try again later.',
  'AUTH_RATE_LIMIT_EXCEEDED'
);

/**
 * Strict password reset and verification limiter
 */
export const passwordResetLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  'Too many password reset requests. Please wait 15 minutes before trying again.',
  'PASSWORD_RESET_RATE_LIMIT_EXCEEDED'
);

/**
 * AI NLP extraction & similarity proxy limiter
 */
export const aiRateLimiter = createRateLimiter(
  60 * 1000,
  30,
  'Too many AI requests. Please slow down.',
  'AI_RATE_LIMIT_EXCEEDED'
);

/**
 * Recommendation generation limiter (compute-intensive)
 */
export const recommendationRateLimiter = createRateLimiter(
  60 * 1000,
  15,
  'Too many recommendation generation requests. Please wait before generating again.',
  'RECOMMENDATION_RATE_LIMIT_EXCEEDED'
);

/**
 * Heavy administrative rebuild limiter
 */
export const adminRebuildLimiter = createRateLimiter(
  60 * 1000,
  5,
  'Too many administrative rebuild requests. Please wait before initiating another rebuild.',
  'ADMIN_REBUILD_RATE_LIMIT_EXCEEDED'
);

export default globalRateLimiter;
