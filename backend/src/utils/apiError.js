/**
 * Custom Operational API Error Class
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description message
   * @param {string} [code='OPERATIONAL_ERROR'] - Application-level error code
   * @param {*} [details=null] - Optional validation or error details
   */
  constructor(statusCode, message, code = 'OPERATIONAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', details = null) {
    return new ApiError(400, message, code, details);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED', details = null) {
    return new ApiError(401, message, code, details);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN', details = null) {
    return new ApiError(403, message, code, details);
  }

  static notFound(message = 'Resource Not Found', code = 'NOT_FOUND', details = null) {
    return new ApiError(404, message, code, details);
  }

  static conflict(message = 'Conflict', code = 'CONFLICT', details = null) {
    return new ApiError(409, message, code, details);
  }

  static unprocessable(message = 'Unprocessable Entity', code = 'UNPROCESSABLE_ENTITY', details = null) {
    return new ApiError(422, message, code, details);
  }

  static tooManyRequests(message = 'Too Many Requests', code = 'TOO_MANY_REQUESTS', details = null) {
    return new ApiError(429, message, code, details);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_SERVER_ERROR', details = null) {
    return new ApiError(500, message, code, details);
  }

  static badGateway(message = 'Bad Gateway', code = 'BAD_GATEWAY', details = null) {
    return new ApiError(502, message, code, details);
  }

  static serviceUnavailable(message = 'Service Unavailable', code = 'SERVICE_UNAVAILABLE', details = null) {
    return new ApiError(503, message, code, details);
  }

  static gatewayTimeout(message = 'Gateway Timeout', code = 'GATEWAY_TIMEOUT', details = null) {
    return new ApiError(504, message, code, details);
  }
}

export default ApiError;
