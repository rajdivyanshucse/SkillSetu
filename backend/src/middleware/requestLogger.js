import logger from '../utils/logger.js';
import metricsService from '../services/metrics.service.js';

/**
 * Structured HTTP Request Logger & Performance Tracking Middleware
 */
export const requestLogger = (req, res, next) => {
  const startHrTime = process.hrtime.bigint();

  // Attach listener to calculate response time on completion
  res.on('finish', () => {
    const endHrTime = process.hrtime.bigint();
    const durationMs = Number((endHrTime - startHrTime) / 1_000_000n);

    const statusCode = res.statusCode;
    const method = req.method;
    const route = req.baseUrl || req.route?.path || req.path;
    const requestId = req.id || res.locals?.requestId || res.getHeader('X-Request-Id');
    const userId = req.user?.id || req.tokenPayload?.userId || null;
    const organizationId = req.organizationId || req.user?.activeOrganizationId || null;

    // Performance classification
    let performanceClass = 'NORMAL';
    if (durationMs > 1500) {
      performanceClass = 'VERY_SLOW';
    } else if (durationMs >= 500) {
      performanceClass = 'SLOW';
    }

    // Record metrics in metrics service
    metricsService.recordRequest(method, route, statusCode, durationMs);

    const logMeta = {
      requestId,
      method,
      route: req.originalUrl || req.url,
      statusCode,
      durationMs,
      performanceClass,
      userId,
      organizationId,
      userAgent: req.headers['user-agent'] || null,
      ip: req.ip || req.socket?.remoteAddress || null,
    };

    if (statusCode >= 500) {
      logger.error(`HTTP ${method} ${req.originalUrl} - ${statusCode} (${durationMs}ms)`, logMeta);
    } else if (statusCode >= 400) {
      logger.warn(`HTTP ${method} ${req.originalUrl} - ${statusCode} (${durationMs}ms)`, logMeta);
    } else if (performanceClass !== 'NORMAL') {
      logger.warn(`[SLOW REQUEST] HTTP ${method} ${req.originalUrl} - ${statusCode} (${durationMs}ms)`, logMeta);
    } else {
      logger.info(`HTTP ${method} ${req.originalUrl} - ${statusCode} (${durationMs}ms)`, logMeta);
    }
  });

  next();
};

export default requestLogger;
