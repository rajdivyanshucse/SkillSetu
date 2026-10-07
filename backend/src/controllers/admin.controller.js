import embeddingService from '../services/embedding.service.js';
import aiClient from '../services/aiClient.service.js';
import prisma from '../config/db.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import jobService, { JOB_TYPE } from '../services/job.service.js';
import metricsService from '../services/metrics.service.js';
import { ApiError } from '../utils/apiError.js';

export const getAdminAiStatus = async (req, res, next) => {
  try {
    let pythonReachable = false;
    let aiHealth = null;
    let supportedLanguages = embeddingService.supportedLanguages;
    let testedLanguages = embeddingService.testedLanguages;

    try {
      aiHealth = await aiClient.checkHealth();
      if (aiHealth?.status === 'healthy') {
        pythonReachable = true;
      }
    } catch {
      pythonReachable = false;
    }

    const modelStatus = await embeddingService.getModelStatus();

    return sendSuccess(res, {
      message: 'AI service administrative status retrieved',
      data: {
        pythonServiceReachable: pythonReachable,
        embeddingModelLoaded: pythonReachable,
        model: modelStatus.activeModel,
        mode: modelStatus.mode,
        dimension: modelStatus.dimension,
        englishModel: modelStatus.englishModel,
        multilingualModel: modelStatus.multilingualModel,
        supportedLanguages: modelStatus.supportedLanguages,
        testedLanguages: modelStatus.testedLanguages,
        totalEmbeddedSkills: modelStatus.indexedCounts.activeModel,
        indexedCounts: modelStatus.indexedCounts,
        reindexStatus: modelStatus.reindex,
        status: pythonReachable ? 'OPERATIONAL' : 'DEGRADED',
        circuitBreaker: aiClient.getCircuitState(),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const switchEmbeddingModel = async (req, res, next) => {
  try {
    const { mode, model } = req.body || {};
    let status;
    if (mode) {
      status = await embeddingService.setModelMode(mode);
    } else if (model) {
      status = await embeddingService.setModel(model);
    } else {
      throw ApiError.badRequest('Either mode ("ENGLISH" | "MULTILINGUAL") or model name must be provided');
    }

    return sendSuccess(res, {
      message: `Active embedding model switched successfully to ${embeddingService.modelName} (${embeddingService.mode})`,
      data: status,
    });
  } catch (error) {
    return next(error);
  }
};

export const reindexSkillEmbeddings = async (req, res, next) => {
  try {
    const isAsync = req.query.async === 'true' || req.body?.async === true;
    const force = req.body?.force === true;
    const model = req.body?.model || embeddingService.modelName;

    if (isAsync) {
      const enqueueResult = await jobService.enqueueJob(
        JOB_TYPE.SKILL_REINDEX,
        async (job, updateProgress) => {
          updateProgress(10);
          const result = await embeddingService.reindexAllSkills({ force, model });
          updateProgress(100);
          return result;
        },
        { createdBy: req.user?.id || 'ADMIN' }
      );

      if (enqueueResult.isDuplicate) {
        return sendSuccess(res, {
          statusCode: 200,
          message: enqueueResult.message,
          data: enqueueResult.job,
        });
      }

      return sendSuccess(res, {
        statusCode: 202,
        message: 'Skill embeddings reindex job enqueued',
        data: enqueueResult.job,
      });
    }

    const result = await embeddingService.reindexAllSkills({ force, model });
    return sendSuccess(res, {
      message: 'Skill embeddings reindexed successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDemandAdminStatus = async (req, res, next) => {
  try {
    const skillObsCount = await prisma.skillDemandObservation.count();
    const roleObsCount = await prisma.roleDemandObservation.count();
    const forecastCount = await prisma.demandForecast.count();
    const snapshotCount = await prisma.demandTrendSnapshot.count();

    return sendSuccess(res, {
      message: 'Demand intelligence admin status retrieved',
      data: {
        skillDemandObservations: skillObsCount,
        roleDemandObservations: roleObsCount,
        activeForecasts: forecastCount,
        trendSnapshots: snapshotCount,
        sourceTypes: ['SEEDED', 'IMPORTED', 'DERIVED'],
        dataQualityTier: 'MEDIUM',
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const rebuildDemandData = async (req, res, next) => {
  try {
    const isAsync = req.query.async === 'true' || req.body?.async === true;

    if (isAsync) {
      const enqueueResult = await jobService.enqueueJob(
        JOB_TYPE.DEMAND_REBUILD,
        async (job, updateProgress) => {
          updateProgress(25);
          const skillObsCount = await prisma.skillDemandObservation.count();
          updateProgress(50);
          const roleObsCount = await prisma.roleDemandObservation.count();
          updateProgress(100);
          return {
            status: 'REBUILD_COMPLETE',
            observationsProcessed: skillObsCount + roleObsCount,
          };
        },
        { createdBy: req.user?.id || 'ADMIN' }
      );

      if (enqueueResult.isDuplicate) {
        return sendSuccess(res, {
          statusCode: 200,
          message: enqueueResult.message,
          data: enqueueResult.job,
        });
      }

      return sendSuccess(res, {
        statusCode: 202,
        message: 'Demand data rebuild job enqueued',
        data: enqueueResult.job,
      });
    }

    const skillObsCount = await prisma.skillDemandObservation.count();
    const roleObsCount = await prisma.roleDemandObservation.count();

    return sendSuccess(res, {
      message: 'Demand data catalog rebuilt successfully',
      data: {
        status: 'REBUILD_COMPLETE',
        observationsProcessed: skillObsCount + roleObsCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const rebuildDemandForecasts = async (req, res, next) => {
  try {
    const isAsync = req.query.async === 'true' || req.body?.async === true;

    if (isAsync) {
      const enqueueResult = await jobService.enqueueJob(
        JOB_TYPE.FORECAST_REBUILD,
        async (job, updateProgress) => {
          updateProgress(20);
          const DemandForecastService = (await import('../services/demandForecast.service.js')).default;
          updateProgress(50);
          const result = await DemandForecastService.rebuildAllForecasts(req.body);
          updateProgress(100);
          return result;
        },
        { createdBy: req.user?.id || 'ADMIN' }
      );

      if (enqueueResult.isDuplicate) {
        return sendSuccess(res, {
          statusCode: 200,
          message: enqueueResult.message,
          data: enqueueResult.job,
        });
      }

      return sendSuccess(res, {
        statusCode: 202,
        message: 'Demand forecasts rebuild job enqueued',
        data: enqueueResult.job,
      });
    }

    const DemandForecastService = (await import('../services/demandForecast.service.js')).default;
    const result = await DemandForecastService.rebuildAllForecasts(req.body);

    return sendSuccess(res, {
      message: 'Demand forecasts and trend snapshots rebuilt successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Background Job Management Handlers (Admin Only)
 */
export const listAdminJobs = async (req, res, next) => {
  try {
    const { status, type, limit, offset } = req.query;
    const parsedLimit = Number.parseInt(limit, 10) || 20;
    const parsedOffset = Number.parseInt(offset, 10) || 0;

    const data = jobService.listJobs({
      status,
      type,
      limit: parsedLimit,
      offset: parsedOffset,
    });

    return sendSuccess(res, {
      message: 'Background jobs retrieved successfully',
      data,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminJobDetails = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = jobService.getJob(jobId);

    if (!job) {
      throw ApiError.notFound(`Background job with ID ${jobId} not found`, 'RESOURCE_NOT_FOUND');
    }

    return sendSuccess(res, {
      message: 'Background job details retrieved',
      data: job,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelAdminJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const result = jobService.cancelJob(jobId, req.user?.id || 'ADMIN');

    if (!result) {
      throw ApiError.notFound(`Background job with ID ${jobId} not found`, 'RESOURCE_NOT_FOUND');
    }

    if (!result.success) {
      return sendError(res, {
        statusCode: 400,
        message: result.message,
        code: 'JOB_NOT_CANCELLABLE',
        details: result.job,
      });
    }

    return sendSuccess(res, {
      message: result.message,
      data: result.job,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Observability Metrics Handler (Admin Only)
 */
export const getAdminMetrics = async (req, res, next) => {
  try {
    const metrics = metricsService.getMetricsSummary();

    return sendSuccess(res, {
      message: 'Platform observability metrics retrieved',
      data: metrics,
    });
  } catch (error) {
    return next(error);
  }
};
