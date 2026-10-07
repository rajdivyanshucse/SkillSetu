import env from '../config/env.js';
import { checkDbConnection } from '../config/db.js';
import aiClient from './aiClient.service.js';
import metricsService from './metrics.service.js';

/**
 * Health check business service
 */
export const getSystemHealth = async () => {
  const uptimeSeconds = Math.floor(process.uptime());
  const memoryUsage = process.memoryUsage();
  const dbHealth = await checkDbConnection();

  // Non-blocking AI microservice probe
  let aiStatus = { status: 'unknown', available: false };
  try {
    const aiHealth = await aiClient.checkHealth();
    aiStatus = {
      status: aiHealth?.status === 'healthy' ? 'healthy' : 'online',
      available: true,
      service: aiHealth?.service || 'skillsetu-ai',
      version: aiHealth?.version || '1.0.0',
    };
  } catch (err) {
    aiStatus = {
      status: 'offline',
      available: false,
      circuitState: aiClient.getCircuitState()?.state || 'CLOSED',
      message: err.message || 'AI service is offline',
    };
  }

  // System overall health classification
  const isHealthy = dbHealth.status === 'connected' || dbHealth.status === 'in-memory-fallback' || env.isDevelopment || env.isTest;

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'SkillSetu Core API',
    version: '1.0.0',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: uptimeSeconds,
      formatted: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
    },
    database: {
      provider: 'postgresql',
      status: dbHealth.status,
      ...(dbHealth.latencyMs !== undefined && { latencyMs: dbHealth.latencyMs }),
      ...(dbHealth.error && { message: dbHealth.error }),
      pgvector: {
        available: true,
        dimension: 384,
      },
    },
    aiService: aiStatus,
    metrics: {
      totalRequests: metricsService.totalRequests,
      slowRequests: metricsService.slowRequests,
      activeBackgroundJobs: metricsService.jobMetrics.running,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      },
    },
  };
};

/**
 * Readiness probe business logic
 */
export const getSystemReadiness = async () => {
  const dbHealth = await checkDbConnection();
  const isDbReady = dbHealth.status === 'connected' || dbHealth.status === 'in-memory-fallback' || env.isDevelopment || env.isTest;

  return {
    ready: isDbReady,
    status: isDbReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbHealth.status,
      aiService: aiClient.getCircuitState()?.state || 'CLOSED',
    },
  };
};

export default {
  getSystemHealth,
  getSystemReadiness,
};
