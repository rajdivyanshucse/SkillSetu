import env from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { sendError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import metricsService from '../services/metrics.service.js';

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const reqId = req?.id || res.locals?.requestId || res.getHeader?.('X-Request-Id');

  // Handle JSON parse error (e.g. malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn('[ErrorHandler] Malformed JSON payload received', {
      requestId: reqId,
      path: req.originalUrl,
    });
    return sendError(res, {
      statusCode: 400,
      message: 'Malformed JSON payload received',
      code: 'INVALID_JSON_BODY',
      details: env.isDevelopment ? err.message : null,
      requestId: reqId,
    });
  }

  // Handle operational ApiError
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(`[ErrorHandler] ApiError: ${err.message}`, {
        requestId: reqId,
        code: err.code,
        statusCode: err.statusCode,
      });
    } else {
      logger.warn(`[ErrorHandler] Client ApiError: ${err.message}`, {
        requestId: reqId,
        code: err.code,
        statusCode: err.statusCode,
      });
    }

    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      details: err.details,
      stack: env.isDevelopment ? err.stack : null,
      requestId: reqId,
    });
  }

  // Handle Prisma Known Request Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    metricsService.recordDbOperation(true);
    switch (err.code) {
      case 'P2002': {
        const fields = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
        return sendError(res, {
          statusCode: 409,
          message: `Unique constraint violation. A record with this ${fields} already exists.`,
          code: 'DUPLICATE_RESOURCE',
          details: { target: err.meta?.target },
          requestId: reqId,
        });
      }
      case 'P2003':
        return sendError(res, {
          statusCode: 400,
          message: 'Foreign key constraint violation. Referenced entity does not exist.',
          code: 'FOREIGN_KEY_VIOLATION',
          details: { field: err.meta?.field_name },
          requestId: reqId,
        });
      case 'P2025':
        return sendError(res, {
          statusCode: 404,
          message: 'The requested database record was not found.',
          code: 'RECORD_NOT_FOUND',
          requestId: reqId,
        });
      case 'P1001':
      case 'P1002':
        return sendError(res, {
          statusCode: 503,
          message: 'Database service is currently unavailable. Please try again shortly.',
          code: 'DATABASE_UNAVAILABLE',
          requestId: reqId,
        });
      default:
        break;
    }
  }

  // Handle Prisma Validation Errors
  if (err.name === 'PrismaClientValidationError') {
    metricsService.recordDbOperation(true);
    return sendError(res, {
      statusCode: 422,
      message: 'Database schema validation error on query input',
      code: 'DATABASE_VALIDATION_ERROR',
      details: env.isDevelopment ? err.message : null,
      requestId: reqId,
    });
  }

  // Handle generic / unexpected internal errors
  const statusCode = err.statusCode || err.status || 500;
  const message = env.isProduction && statusCode === 500
    ? 'Internal server error occurred'
    : err.message || 'Internal server error occurred';

  // Log unexpected errors
  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.message}`, {
      requestId: reqId,
      path: req.originalUrl,
      stack: err.stack,
    });
  }

  return sendError(res, {
    statusCode,
    message,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    details: env.isDevelopment && err.details ? err.details : null,
    stack: env.isDevelopment ? err.stack : null,
    requestId: reqId,
  });
};

export default errorHandler;
