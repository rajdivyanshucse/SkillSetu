/**
 * Process-Local Observability & Operational Metrics Service
 * Tracks throughput, latencies, status codes, AI failures, and background job states.
 */
class MetricsService {
  constructor() {
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.requestsByMethod = {};
    this.requestsByStatusCode = {
      '2xx': 0,
      '3xx': 0,
      '4xx': 0,
      '5xx': 0,
    };
    this.routeStats = {}; // route: { count, totalDurationMs, minDurationMs, maxDurationMs }
    this.slowRequests = {
      normal: 0,     // < 500ms
      slow: 0,       // 500ms - 1500ms
      verySlow: 0,   // > 1500ms
    };
    this.aiMetrics = {
      total: 0,
      success: 0,
      failed: 0,
      timeouts: 0,
      circuitBreakerTrips: 0,
      totalDurationMs: 0,
    };
    this.databaseMetrics = {
      operations: 0,
      errors: 0,
    };
    this.jobMetrics = {
      queued: 0,
      running: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
    };
    this.cacheMetrics = {
      hits: 0,
      misses: 0,
    };
    this.ingestionMetrics = {
      datasetsImported: 0,
      recordsProcessed: 0,
      recordsAccepted: 0,
      recordsRejected: 0,
      recordsQuarantined: 0,
      duplicatesDetected: 0,
      normalizationSuccesses: 0,
      normalizationFailures: 0,
      totalDurationMs: 0,
      rebuildJobsTriggered: 0,
      rebuildJobsFailed: 0,
    };
  }

  recordRequest(method, route, statusCode, durationMs) {
    this.totalRequests += 1;

    // Method count
    this.requestsByMethod[method] = (this.requestsByMethod[method] || 0) + 1;

    // Status code class
    const statusClass = `${Math.floor(statusCode / 100)}xx`;
    if (this.requestsByStatusCode[statusClass] !== undefined) {
      this.requestsByStatusCode[statusClass] += 1;
    }

    // Performance classification
    if (durationMs < 500) {
      this.slowRequests.normal += 1;
    } else if (durationMs <= 1500) {
      this.slowRequests.slow += 1;
    } else {
      this.slowRequests.verySlow += 1;
    }

    // Normalized route stats
    const cleanRoute = route || 'unknown';
    if (!this.routeStats[cleanRoute]) {
      this.routeStats[cleanRoute] = {
        count: 0,
        totalDurationMs: 0,
        minDurationMs: durationMs,
        maxDurationMs: durationMs,
      };
    }
    const stat = this.routeStats[cleanRoute];
    stat.count += 1;
    stat.totalDurationMs += durationMs;
    stat.minDurationMs = Math.min(stat.minDurationMs, durationMs);
    stat.maxDurationMs = Math.max(stat.maxDurationMs, durationMs);
  }

  recordAiCall(durationMs, status = 'success', errorType = null) {
    this.aiMetrics.total += 1;
    this.aiMetrics.totalDurationMs += durationMs || 0;

    if (status === 'success') {
      this.aiMetrics.success += 1;
    } else {
      this.aiMetrics.failed += 1;
      if (errorType === 'AI_SERVICE_TIMEOUT') {
        this.aiMetrics.timeouts += 1;
      }
    }
  }

  recordCircuitBreakerTrip() {
    this.aiMetrics.circuitBreakerTrips += 1;
  }

  recordDbOperation(isError = false) {
    this.databaseMetrics.operations += 1;
    if (isError) {
      this.databaseMetrics.errors += 1;
    }
  }

  recordCacheHit() {
    this.cacheMetrics.hits += 1;
  }

  recordCacheMiss() {
    this.cacheMetrics.misses += 1;
  }

  updateJobState(status) {
    if (this.jobMetrics[status.toLowerCase()] !== undefined) {
      this.jobMetrics[status.toLowerCase()] += 1;
    }
  }

  recordIngestionBatch(stats = {}) {
    if (stats.datasetsImported) this.ingestionMetrics.datasetsImported += stats.datasetsImported;
    if (stats.processed) this.ingestionMetrics.recordsProcessed += stats.processed;
    if (stats.accepted) this.ingestionMetrics.recordsAccepted += stats.accepted;
    if (stats.rejected) this.ingestionMetrics.recordsRejected += stats.rejected;
    if (stats.quarantined) this.ingestionMetrics.recordsQuarantined += stats.quarantined;
    if (stats.duplicates) this.ingestionMetrics.duplicatesDetected += stats.duplicates;
    if (stats.normSuccess) this.ingestionMetrics.normalizationSuccesses += stats.normSuccess;
    if (stats.normFail) this.ingestionMetrics.normalizationFailures += stats.normFail;
    if (stats.durationMs) this.ingestionMetrics.totalDurationMs += stats.durationMs;
  }

  recordRebuildJob(isSuccess = true) {
    this.ingestionMetrics.rebuildJobsTriggered += 1;
    if (!isSuccess) {
      this.ingestionMetrics.rebuildJobsFailed += 1;
    }
  }

  getMetricsSummary() {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const memory = process.memoryUsage();

    const formattedRoutes = {};
    for (const [route, stat] of Object.entries(this.routeStats)) {
      formattedRoutes[route] = {
        requests: stat.count,
        avgLatencyMs: Math.round((stat.totalDurationMs / stat.count) * 100) / 100,
        minLatencyMs: Math.round(stat.minDurationMs * 100) / 100,
        maxLatencyMs: Math.round(stat.maxDurationMs * 100) / 100,
      };
    }

    const totalCacheAccess = this.cacheMetrics.hits + this.cacheMetrics.misses;
    const cacheHitRate = totalCacheAccess > 0
      ? `${Math.round((this.cacheMetrics.hits / totalCacheAccess) * 100)}%`
      : '0%';

    const recordsPerSec = this.ingestionMetrics.totalDurationMs > 0
      ? Math.round((this.ingestionMetrics.recordsProcessed / (this.ingestionMetrics.totalDurationMs / 1000)) * 100) / 100
      : 0;

    return {
      service: 'skillsetu-backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      memory: {
        rssMb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
      },
      requests: {
        total: this.totalRequests,
        byMethod: this.requestsByMethod,
        byStatusCode: this.requestsByStatusCode,
        latencyDistribution: {
          normal_under_500ms: this.slowRequests.normal,
          slow_500_to_1500ms: this.slowRequests.slow,
          very_slow_over_1500ms: this.slowRequests.verySlow,
        },
      },
      routes: formattedRoutes,
      aiService: {
        ...this.aiMetrics,
        avgLatencyMs: this.aiMetrics.total > 0
          ? Math.round((this.aiMetrics.totalDurationMs / this.aiMetrics.total) * 100) / 100
          : 0,
      },
      database: this.databaseMetrics,
      backgroundJobs: this.jobMetrics,
      cache: {
        ...this.cacheMetrics,
        hitRate: cacheHitRate,
      },
      dataIngestion: {
        ...this.ingestionMetrics,
        recordsPerSecond: recordsPerSec,
      },
    };
  }
}

export const metricsService = new MetricsService();
export default metricsService;
