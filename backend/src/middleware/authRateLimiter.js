import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Strict rate limiter for sensitive authentication endpoints
 * (login, register, forgot-password, reset-password, verify-email)
 */
export const authRateLimiter = rateLimit({
  windowMs: env.authRateLimit?.windowMs || 15 * 60 * 1000, // 15 minutes
  max: env.authRateLimit?.max || 20, // max 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    return sendError(res, {
      statusCode: 429,
      message: 'Too many authentication attempts from this IP, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      details: {
        windowMs: env.authRateLimit?.windowMs || 15 * 60 * 1000,
        max: env.authRateLimit?.max || 20,
      },
    });
  },
});

export default authRateLimiter;
