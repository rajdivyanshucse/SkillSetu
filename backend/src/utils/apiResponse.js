/**
 * Standard API Response Format Utilities for SkillSetu
 */

/**
 * Send a standardized success response.
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=200]
 * @param {string} [options.message='Request successful']
 * @param {*} [options.data=null]
 * @param {Object} [options.meta=null]
 */
export const sendSuccess = (res, {
  statusCode = 200,
  message = 'Request successful',
  data = null,
  meta = null,
} = {}) => {
  const requestId = res.locals?.requestId || res.getHeader?.('X-Request-Id') || undefined;

  const responseBody = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(meta !== null && { meta }),
    ...(requestId && { requestId }),
  };

  return res.status(statusCode).json(responseBody);
};

/**
 * Send a standardized error response.
 * @param {import('express').Response} res
 * @param {Object} options
 * @param {number} [options.statusCode=500]
 * @param {string} [options.message='An unexpected error occurred']
 * @param {string} [options.code='INTERNAL_SERVER_ERROR']
 * @param {*} [options.details=null]
 * @param {string} [options.stack=null]
 * @param {string} [options.requestId=null]
 */
export const sendError = (res, {
  statusCode = 500,
  message = 'An unexpected error occurred',
  code = 'INTERNAL_SERVER_ERROR',
  details = null,
  stack = null,
  requestId = null,
} = {}) => {
  const reqId = requestId || res.locals?.requestId || res.getHeader?.('X-Request-Id') || undefined;

  const responseBody = {
    success: false,
    message,
    error: {
      code,
      message,
      ...(reqId && { requestId: reqId }),
      ...(details !== null && { details }),
      ...(stack !== null && { stack }),
    },
  };

  return res.status(statusCode).json(responseBody);
};

export default {
  sendSuccess,
  sendError,
};
