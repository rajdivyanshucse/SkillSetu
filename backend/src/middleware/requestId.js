import crypto from 'node:crypto';

/**
 * Request ID / Correlation ID Middleware
 * Extracts incoming X-Request-Id or generates a secure UUID v4.
 * Attaches the ID to req.id, res.locals.requestId, and sets the X-Request-Id response header.
 */
export const requestId = (req, res, next) => {
  const incomingId = req.headers['x-request-id'] || req.headers['x-correlation-id'];
  
  // Validate incoming ID format or generate a fresh UUID
  let validId = incomingId;
  if (!validId || typeof validId !== 'string' || validId.length > 64) {
    validId = crypto.randomUUID();
  }

  req.id = validId;
  res.locals.requestId = validId;
  res.setHeader('X-Request-Id', validId);

  next();
};

export default requestId;
