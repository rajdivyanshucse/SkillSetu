import env from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import logger from '../utils/logger.js';
import metricsService from './metrics.service.js';

const CIRCUIT_STATE = {
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  HALF_OPEN: 'HALF_OPEN',
};

/**
 * Low-level resilient HTTP client for communicating with the Python AI microservice.
 * Features:
 * - Centralized timeout (AbortController)
 * - Circuit Breaker pattern (CLOSED -> OPEN -> HALF_OPEN)
 * - Controlled retry for safe/idempotent operations
 * - Request correlation ID propagation
 * - Metric recording & structured error translation
 */
class AiClient {
  constructor() {
    this.baseUrl = env.aiService?.url || 'http://127.0.0.1:8001';
    this.apiKey = env.aiService?.apiKey || 'sk-skillsetu-ai-dev-secret-key';
    this.timeoutMs = env.aiService?.timeoutMs || 5000;

    // Circuit Breaker State
    this.circuitState = CIRCUIT_STATE.CLOSED;
    this.failureCount = 0;
    this.failureThreshold = 5; // Open circuit after 5 consecutive failures
    this.cooldownMs = 15000;   // Wait 15s in OPEN state before probing
    this.lastFailureTime = null;
  }

  _checkCircuit() {
    if (this.circuitState === CIRCUIT_STATE.OPEN) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.circuitState = CIRCUIT_STATE.HALF_OPEN;
        logger.info('[AiClient CircuitBreaker] Entering HALF_OPEN state to probe AI service');
      } else {
        metricsService.recordCircuitBreakerTrip();
        throw ApiError.serviceUnavailable(
          'AI intelligence service is temporarily unavailable (circuit breaker open)',
          'AI_SERVICE_UNAVAILABLE'
        );
      }
    }
  }

  _recordSuccess() {
    if (this.circuitState !== CIRCUIT_STATE.CLOSED) {
      logger.info('[AiClient CircuitBreaker] Probe succeeded. Resetting circuit to CLOSED');
    }
    this.circuitState = CIRCUIT_STATE.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  _recordFailure() {
    this.failureCount += 1;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold || this.circuitState === CIRCUIT_STATE.HALF_OPEN) {
      this.circuitState = CIRCUIT_STATE.OPEN;
      metricsService.recordCircuitBreakerTrip();
      logger.warn('[AiClient CircuitBreaker] Tripped to OPEN state due to AI service failures', {
        failureCount: this.failureCount,
        cooldownMs: this.cooldownMs,
      });
    }
  }

  /**
   * Performs an authenticated HTTP request to the Python AI service.
   *
   * @param {string} endpoint - Path relative to base URL (e.g. '/ai/v1/skills/extract')
   * @param {Object} options - Request options (method, body, timeoutMs, requestId, etc.)
   * @returns {Promise<Object>} JSON response body
   */
  async request(endpoint, options = {}) {
    this._checkCircuit();

    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const timeout = options.timeoutMs || this.timeoutMs;
    const method = options.method || 'POST';
    const maxRetries = options.retries !== undefined ? options.retries : (method === 'GET' ? 1 : 0);

    let attempt = 0;
    const startTime = Date.now();

    while (attempt <= maxRetries) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-AI-Service-Key': options.apiKey || this.apiKey,
        ...(options.requestId ? { 'X-Request-Id': options.requestId } : {}),
        ...(options.headers || {}),
      };

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        let data;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            data = await response.json();
          } catch {
            data = null;
          }
        } else {
          const text = await response.text();
          data = { message: text };
        }

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            this._recordFailure();
            metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_SERVICE_AUTH_FAILED');
            throw ApiError.internal('AI service authentication failure', 'AI_SERVICE_AUTH_FAILED');
          }
          if (response.status === 422) {
            // Validation error is client/input issue, not service outage
            metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_INPUT_TOO_LARGE');
            throw ApiError.unprocessable(
              data?.message || 'AI request payload exceeds allowed constraints or failed validation',
              'AI_INPUT_TOO_LARGE',
              data?.details
            );
          }
          if (response.status >= 500) {
            this._recordFailure();
            metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_SERVICE_INVALID_RESPONSE');
            throw ApiError.badGateway(
              'The AI microservice encountered an internal error',
              'AI_SERVICE_INVALID_RESPONSE'
            );
          }

          this._recordFailure();
          metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_SERVICE_INVALID_RESPONSE');
          throw ApiError.badGateway(
            data?.message || 'Invalid response from AI microservice',
            'AI_SERVICE_INVALID_RESPONSE'
          );
        }

        this._recordSuccess();
        metricsService.recordAiCall(Date.now() - startTime, 'success');
        return data;
      } catch (error) {
        clearTimeout(timer);

        if (error instanceof ApiError && (error.code === 'AI_INPUT_TOO_LARGE' || error.code === 'AI_SERVICE_AUTH_FAILED')) {
          throw error;
        }

        const isTimeout = error.name === 'AbortError' || error.type === 'aborted';
        const isNetworkError = !isTimeout && !(error instanceof ApiError);

        attempt += 1;
        if (attempt <= maxRetries && (isTimeout || isNetworkError)) {
          logger.warn(`[AiClient] Retrying ${method} ${endpoint} (attempt ${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, 300));
          continue;
        }

        this._recordFailure();

        if (isTimeout) {
          metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_SERVICE_TIMEOUT');
          throw ApiError.gatewayTimeout(
            'The AI intelligence service request timed out',
            'AI_SERVICE_TIMEOUT'
          );
        }

        if (error instanceof ApiError) {
          throw error;
        }

        // Network connection errors / ECONNREFUSED
        metricsService.recordAiCall(Date.now() - startTime, 'failed', 'AI_SERVICE_UNAVAILABLE');
        throw ApiError.serviceUnavailable(
          'The AI intelligence service is currently offline or unavailable',
          'AI_SERVICE_UNAVAILABLE'
        );
      }
    }
  }

  /**
   * Health check probe.
   */
  async checkHealth() {
    return this.request('/health', { method: 'GET', timeoutMs: 2000, retries: 0 });
  }

  /**
   * Readiness probe.
   */
  async checkReadiness() {
    return this.request('/ready', { method: 'GET', timeoutMs: 2000, retries: 0 });
  }

  /**
   * POST request helper.
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: 'POST', body, ...options });
  }

  /**
   * Generates embeddings for an array of texts.
   */
  async generateEmbeddings(texts, options = {}) {
    return this.post('/ai/v1/embeddings/generate', { texts }, options);
  }

  /**
   * Computes semantic similarity between a source text and candidates.
   */
  async calculateSimilarity(sourceText, candidateTexts, options = {}) {
    return this.post('/ai/v1/semantic/similarity', { sourceText, candidateTexts }, options);
  }

  /**
   * Performs hybrid skill matching across source and candidate skill lists.
   */
  async matchSkills(sourceSkills, candidateSkills, options = {}) {
    return this.post('/ai/v1/semantic/skills/match', { sourceSkills, candidateSkills }, options);
  }

  /**
   * Calculates time-series demand projections with confidence bounds.
   */
  async forecastDemand(series, horizon = 3, model = 'AUTO', confidenceLevel = 0.95, options = {}) {
    return this.post('/ai/v1/demand/forecast', { series, horizon, model, confidenceLevel }, options);
  }

  /**
   * Deterministically classifies historical demand trend and growth rate.
   */
  async analyzeTrend(series, options = {}) {
    return this.post('/ai/v1/demand/trend', { series }, options);
  }

  /**
   * Validates/backtests forecasting model on historical holdout data.
   */
  async validateDemandModel(series, testPeriods = 1, model = 'AUTO', options = {}) {
    return this.post('/ai/v1/demand/validate', { series, testPeriods, model }, options);
  }

  /**
   * Computes analytical recommendation feature weighting and priority ranking.
   */
  async computeRecommendationFeatures(items, context = {}, options = {}) {
    return this.post('/ai/v1/recommendations/features', { items, context }, options);
  }

  /**
   * Returns current circuit breaker status for diagnostics.
   */
  getCircuitState() {
    return {
      state: this.circuitState,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }

  /**
   * Resets circuit breaker state (useful for tests and manual recovery).
   */
  resetCircuit() {
    this.circuitState = CIRCUIT_STATE.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
  }
}

export const aiClient = new AiClient();
export default aiClient;
