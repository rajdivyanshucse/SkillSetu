import { ApiError } from '../utils/apiError.js';

/**
 * Reusable schema validation middleware factory
 * Supports Zod schemas with shape { body, query, params }
 * @param {import('zod').ZodSchema | Object} schema
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        return next(ApiError.unprocessable('Validation failed on request payload', 'VALIDATION_ERROR', formattedErrors));
      }
      return next(ApiError.badRequest('Invalid request format', 'INVALID_PAYLOAD', error.message));
    }
  };
};

export default validate;
