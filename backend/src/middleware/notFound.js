import { sendError } from '../utils/apiResponse.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFound = (req, res) => {
  return sendError(res, {
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    code: 'ROUTE_NOT_FOUND',
    details: {
      method: req.method,
      url: req.originalUrl,
    },
  });
};

export default notFound;
