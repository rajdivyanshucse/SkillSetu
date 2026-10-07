import crypto from 'node:crypto';
import logger from '../utils/logger.js';
import metricsService from './metrics.service.js';

export const JOB_STATUS = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const JOB_TYPE = {
  DEMAND_REBUILD: 'DEMAND_REBUILD',
  FORECAST_REBUILD: 'FORECAST_REBUILD',
  SKILL_REINDEX: 'SKILL_REINDEX',
  RECOMMENDATION_REGENERATE: 'RECOMMENDATION_REGENERATE',
  DATA_AGGREGATION: 'DATA_AGGREGATION',
  DATASET_IMPORT: 'DATASET_IMPORT',
};

/**
 * Process-local background job manager.
 * Note: Process-local jobs run in memory and do not persist across server restarts.
 */
class BackgroundJobService {
  constructor() {
    this.jobs = new Map();
    this.activeLocks = new Set(); // Key format: `${type}:${targetId || 'global'}`
  }

  _getLockKey(type, targetId) {
    return `${type}:${targetId || 'global'}`;
  }

  /**
   * Enqueues and starts a background job if no conflicting job is running.
   *
   * @param {string} type - Job type from JOB_TYPE
   * @param {Function} executor - Async function (job, updateProgress) => Promise<result>
   * @param {Object} [options] - Options (metadata, targetId, createdBy)
   * @returns {Object} Job representation
   */
  async enqueueJob(type, executor, options = {}) {
    const lockKey = this._getLockKey(type, options.targetId);

    if (this.activeLocks.has(lockKey)) {
      // Find existing active job
      const existing = Array.from(this.jobs.values()).find(
        (j) => j.type === type && (j.status === JOB_STATUS.QUEUED || j.status === JOB_STATUS.RUNNING)
      );
      if (existing) {
        return {
          isDuplicate: true,
          job: existing,
          message: `A job of type ${type} is already active.`,
        };
      }
    }

    const jobId = crypto.randomUUID();
    const jobRecord = {
      id: jobId,
      type,
      status: JOB_STATUS.QUEUED,
      progress: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null,
      cancelledBy: null,
      createdBy: options.createdBy || 'SYSTEM',
      metadata: options.metadata || {},
      lockKey,
    };

    this.jobs.set(jobId, jobRecord);
    this.activeLocks.add(lockKey);
    metricsService.updateJobState(JOB_STATUS.QUEUED);

    logger.info(`[BackgroundJob] Enqueued job ${jobId} (${type})`, {
      jobId,
      type,
      createdBy: jobRecord.createdBy,
    });

    // Execute asynchronously on the next tick
    setImmediate(async () => {
      await this._executeJob(jobId, executor);
    });

    return {
      isDuplicate: false,
      job: jobRecord,
    };
  }

  async _executeJob(jobId, executor) {
    const job = this.jobs.get(jobId);
    if (!job || job.status === JOB_STATUS.CANCELLED) {
      if (job) this.activeLocks.delete(job.lockKey);
      return;
    }

    job.status = JOB_STATUS.RUNNING;
    job.startedAt = new Date().toISOString();
    metricsService.updateJobState(JOB_STATUS.RUNNING);

    const updateProgress = (pct) => {
      if (job.status === JOB_STATUS.RUNNING) {
        job.progress = Math.min(100, Math.max(0, Math.round(pct)));
      }
    };

    try {
      logger.info(`[BackgroundJob] Starting execution for job ${jobId} (${job.type})`);
      const result = await executor(job, updateProgress);

      if (job.status === JOB_STATUS.CANCELLED) {
        logger.warn(`[BackgroundJob] Job ${jobId} was cancelled during execution`);
        return;
      }

      job.status = JOB_STATUS.COMPLETED;
      job.progress = 100;
      job.completedAt = new Date().toISOString();
      job.result = result || { message: 'Job completed successfully' };
      metricsService.updateJobState(JOB_STATUS.COMPLETED);

      logger.info(`[BackgroundJob] Job ${jobId} completed successfully`, {
        jobId,
        type: job.type,
      });
    } catch (err) {
      job.status = JOB_STATUS.FAILED;
      job.completedAt = new Date().toISOString();
      job.error = err.message || 'Job execution encountered an unexpected error';
      metricsService.updateJobState(JOB_STATUS.FAILED);

      logger.error(`[BackgroundJob] Job ${jobId} failed: ${err.message}`, {
        jobId,
        type: job.type,
        error: err.message,
      });
    } finally {
      this.activeLocks.delete(job.lockKey);
    }
  }

  /**
   * Retrieves a job by ID.
   */
  getJob(jobId) {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Lists jobs with filtering and pagination.
   */
  listJobs({ status, type, limit = 20, offset = 0 } = {}) {
    let all = Array.from(this.jobs.values());

    if (status) {
      all = all.filter((j) => j.status === status.toUpperCase());
    }
    if (type) {
      all = all.filter((j) => j.type === type.toUpperCase());
    }

    // Sort descending by creation date
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = all.length;
    const paginated = all.slice(offset, offset + limit);

    return {
      jobs: paginated,
      total,
      limit,
      offset,
    };
  }

  /**
   * Cancels a queued or running job.
   */
  cancelJob(jobId, cancelledBy = 'ADMIN') {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    if (job.status === JOB_STATUS.COMPLETED || job.status === JOB_STATUS.FAILED) {
      return {
        success: false,
        message: `Cannot cancel job in ${job.status} state.`,
        job,
      };
    }

    job.status = JOB_STATUS.CANCELLED;
    job.completedAt = new Date().toISOString();
    job.cancelledBy = cancelledBy;
    this.activeLocks.delete(job.lockKey);
    metricsService.updateJobState(JOB_STATUS.CANCELLED);

    logger.info(`[BackgroundJob] Job ${jobId} cancelled by ${cancelledBy}`);
    return {
      success: true,
      message: 'Job cancelled successfully.',
      job,
    };
  }
}

export const jobService = new BackgroundJobService();
export default jobService;
