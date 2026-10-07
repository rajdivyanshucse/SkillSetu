import http from 'node:http';
import app from './app.js';
import logger, { sanitizeLogData } from './utils/logger.js';
import cache from './utils/cache.js';
import metricsService from './services/metrics.service.js';
import jobService, { JOB_TYPE, JOB_STATUS } from './services/job.service.js';
import aiClient from './services/aiClient.service.js';
import { validateFileUpload } from './validators/upload.validator.js';

let server;
let baseUrl;
let passed = 0;
let failed = 0;

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed += 1;
  }
};

const makeRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text();
    data = { text };
  }

  return {
    status: response.status,
    headers: response.headers,
    data,
  };
};

const runSuite = async () => {
  console.log('===============================================================');
  console.log('STARTING PHASE 27 — PRODUCTION HARDENING & OBSERVABILITY TESTS');
  console.log('===============================================================\n');

  // Start temporary server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running on ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------
    // Register test accounts: 1 Admin, 1 Individual, 1 Org
    // -------------------------------------------------------------
    const rand = Math.floor(Math.random() * 1000000);
    const adminEmail = `admin_prod_${rand}@example.com`;
    const userEmail = `user_prod_${rand}@example.com`;
    const orgEmail = `org_prod_${rand}@example.com`;

    // 1. Admin
    const adminReg = await makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password: 'Password123!',
        accountType: 'INDIVIDUAL',
        fullName: 'System Admin',
      }),
    });
    const adminUserId = adminReg.data?.data?.user?.id;
    if (adminUserId) {
      const prisma = (await import('./config/db.js')).default;
      await prisma.user.update({
        where: { id: adminUserId },
        data: { role: 'ADMIN' },
      });
    }

    const adminLogin = await makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password: 'Password123!',
      }),
    });
    const adminToken = adminLogin.data?.data?.tokens?.accessToken;

    // 2. Individual
    const userReg = await makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userEmail,
        password: 'Password123!',
        accountType: 'INDIVIDUAL',
        fullName: 'John Dev',
      }),
    });
    const userToken = userReg.data?.data?.tokens?.accessToken;

    assert(Boolean(adminToken && userToken), 'Registered test accounts for admin and individual');

    // -------------------------------------------------------------
    // 1. Request IDs & Correlation Header
    // -------------------------------------------------------------
    console.log('\n--- 1. REQUEST ID & CORRELATION HEADERS ---');
    const autoReq = await makeRequest('/health');
    assert(autoReq.status === 200, 'GET /health returns 200 OK');
    const generatedReqId = autoReq.headers.get('x-request-id');
    assert(Boolean(generatedReqId && generatedReqId.length > 10), 'X-Request-Id header is automatically generated and returned');

    const customReqId = 'custom-correlation-id-98765';
    const customReq = await makeRequest('/health', {
      headers: { 'x-request-id': customReqId },
    });
    assert(customReq.headers.get('x-request-id') === customReqId, 'Incoming X-Request-Id is preserved and echoed in response');

    // -------------------------------------------------------------
    // 2. Structured Error Format & Request ID Attachment
    // -------------------------------------------------------------
    console.log('\n--- 2. STRUCTURED ERROR RESPONSES ---');
    const notFoundRes = await makeRequest('/api/v1/non-existent-endpoint-test');
    assert(notFoundRes.status === 404, 'Non-existent route returns 404');
    assert(notFoundRes.data?.success === false, 'Error response has success: false');
    assert(Boolean(notFoundRes.data?.error?.code), 'Error response contains error.code');
    assert(Boolean(notFoundRes.data?.error?.requestId), 'Error response contains correlation requestId');

    // -------------------------------------------------------------
    // 3. Health & Readiness System
    // -------------------------------------------------------------
    console.log('\n--- 3. HEALTH & READINESS ENDPOINTS ---');
    const rootHealth = await makeRequest('/health');
    assert(rootHealth.status === 200, 'Root GET /health returns 200');
    assert(rootHealth.data?.data?.service === 'SkillSetu Core API', 'Health payload returns service name');
    assert(rootHealth.data?.data?.database?.pgvector?.dimension === 384, 'Health payload confirms pgvector dimension is 384');

    const rootReady = await makeRequest('/ready');
    assert(rootReady.status === 200, 'Root GET /ready returns 200 ready status');
    assert(rootReady.data?.data?.ready === true, 'Readiness probe indicates system is ready');

    const v1Health = await makeRequest('/api/v1/health');
    assert(v1Health.status === 200, 'Versioned GET /api/v1/health returns 200');

    // -------------------------------------------------------------
    // 4. Rate Limiting & Security Headers
    // -------------------------------------------------------------
    console.log('\n--- 4. RATE LIMITING & SECURITY HEADERS ---');
    assert(Boolean(rootHealth.headers.get('ratelimit-limit') || rootHealth.headers.get('ratelimit')), 'RateLimit standard headers are present');
    assert(Boolean(rootHealth.headers.get('x-content-type-options')), 'Helmet security headers (X-Content-Type-Options) are present');

    // -------------------------------------------------------------
    // 5. Sensitive Log Data Sanitization
    // -------------------------------------------------------------
    console.log('\n--- 5. SENSITIVE LOG PROTECTION ---');
    const dirtyData = {
      user: 'test_user',
      password: 'MySecretPassword123',
      token: 'jwt.token.string',
      refreshTokenHash: 'sha256_hash_value',
      authorization: 'Bearer secret_token',
      apiKey: 'sk-ai-key-123',
      resumeText: 'Full confidential resume text containing PII',
      nested: {
        embeddings: [0.123, 0.456, 0.789],
        validField: 'safe data',
      },
    };
    const cleanData = sanitizeLogData(dirtyData);
    assert(cleanData.password === '[REDACTED]', 'Sanitizer redacts password field');
    assert(cleanData.token === '[REDACTED]', 'Sanitizer redacts token field');
    assert(cleanData.apiKey === '[REDACTED]', 'Sanitizer redacts apiKey field');
    assert(cleanData.resumeText === '[REDACTED]', 'Sanitizer redacts resumeText field');
    assert(cleanData.nested.embeddings === '[REDACTED]', 'Sanitizer redacts nested embeddings array');
    assert(cleanData.nested.validField === 'safe data', 'Sanitizer preserves non-sensitive fields');

    // -------------------------------------------------------------
    // 6. In-Memory Cache Verification
    // -------------------------------------------------------------
    console.log('\n--- 6. CACHING LAYER ---');
    cache.clear();
    cache.set('taxonomy:skill:python', { name: 'Python', category: 'Programming' }, 10);
    assert(cache.get('taxonomy:skill:python')?.name === 'Python', 'Cache stores and retrieves data within TTL');

    cache.set('taxonomy:skill:java', { name: 'Java' }, 10);
    cache.set('user:private:123', { secret: 'do not bulk wipe' }, 10);
    cache.invalidatePrefix('taxonomy:skill:');
    assert(cache.get('taxonomy:skill:python') === null, 'Prefix invalidation clears matching taxonomy entries');
    assert(cache.get('user:private:123')?.secret === 'do not bulk wipe', 'Prefix invalidation preserves other keys');

    // -------------------------------------------------------------
    // 7. Background Job Manager & Deduplication
    // -------------------------------------------------------------
    console.log('\n--- 7. BACKGROUND JOB ARCHITECTURE ---');
    const jobExec = async (job, updateProgress) => {
      updateProgress(30);
      await new Promise((r) => setTimeout(r, 50));
      updateProgress(100);
      return { itemsProcessed: 42 };
    };

    const firstJob = await jobService.enqueueJob(JOB_TYPE.DEMAND_REBUILD, jobExec, {
      createdBy: 'ADMIN_TEST',
    });
    assert(firstJob.isDuplicate === false, 'First job enqueues successfully');
    assert(firstJob.job?.status === JOB_STATUS.QUEUED || firstJob.job?.status === JOB_STATUS.RUNNING, 'Job starts in QUEUED or RUNNING state');

    // Concurrent duplicate attempt
    const dupJob = await jobService.enqueueJob(JOB_TYPE.DEMAND_REBUILD, jobExec, {
      createdBy: 'ADMIN_TEST_2',
    });
    assert(dupJob.isDuplicate === true, 'Duplicate concurrent job is safely rejected/locked');

    // Wait for first job completion
    await new Promise((r) => setTimeout(r, 100));
    const completedJob = jobService.getJob(firstJob.job.id);
    assert(completedJob?.status === JOB_STATUS.COMPLETED, 'Background job transitions to COMPLETED');
    assert(completedJob?.result?.itemsProcessed === 42, 'Background job stores expected result payload');

    // Job cancellation test
    const slowJob = await jobService.enqueueJob(
      JOB_TYPE.FORECAST_REBUILD,
      async () => {
        await new Promise((r) => setTimeout(r, 500));
      },
      { createdBy: 'ADMIN_CANCEL_TEST' }
    );
    const cancelRes = jobService.cancelJob(slowJob.job.id, 'TEST_SUITE');
    assert(cancelRes.success === true, 'Job manager supports cancelling queued/running jobs');
    assert(jobService.getJob(slowJob.job.id)?.status === JOB_STATUS.CANCELLED, 'Cancelled job state is CANCELLED');

    // -------------------------------------------------------------
    // 8. Admin Job Endpoints & RBAC
    // -------------------------------------------------------------
    console.log('\n--- 8. ADMIN JOB ENDPOINTS & RBAC ---');
    // Ordinary individual trying to list jobs -> 403
    const userJobRes = await makeRequest('/api/v1/admin/jobs', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(userJobRes.status === 403, 'Individual user access to /api/v1/admin/jobs is forbidden (403)');

    // Admin listing jobs -> 200
    const adminJobRes = await makeRequest('/api/v1/admin/jobs', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminJobRes.status === 200, 'Admin user access to /api/v1/admin/jobs returns 200 OK');
    assert(Array.isArray(adminJobRes.data?.data?.jobs), 'Admin jobs response returns jobs array');

    // Admin metrics endpoint
    const metricsRes = await makeRequest('/api/v1/admin/metrics', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(metricsRes.status === 200, 'Admin user access to /api/v1/admin/metrics returns 200 OK');
    assert(typeof metricsRes.data?.data?.requests?.total === 'number', 'Metrics payload contains total requests count');

    // -------------------------------------------------------------
    // 9. AI Client Circuit Breaker & Resilience
    // -------------------------------------------------------------
    console.log('\n--- 9. AI CLIENT CIRCUIT BREAKER & RESILIENCE ---');
    aiClient.resetCircuit();
    assert(aiClient.getCircuitState().state === 'CLOSED', 'Circuit breaker initial state is CLOSED');

    // Simulate failures to trip circuit
    for (let i = 0; i < 5; i++) {
      aiClient._recordFailure();
    }
    assert(aiClient.getCircuitState().state === 'OPEN', 'Circuit breaker trips to OPEN after threshold failures');

    // Calling request in OPEN state throws fast without making network call
    let trippedError = null;
    try {
      await aiClient.request('/health');
    } catch (err) {
      trippedError = err;
    }
    assert(trippedError?.code === 'AI_SERVICE_UNAVAILABLE', 'Open circuit breaker returns structured AI_SERVICE_UNAVAILABLE');

    // Reset circuit for following tests
    aiClient.resetCircuit();
    assert(aiClient.getCircuitState().state === 'CLOSED', 'Circuit breaker resets cleanly to CLOSED');

    // -------------------------------------------------------------
    // 10. File Upload Safety & Validator
    // -------------------------------------------------------------
    console.log('\n--- 10. FILE UPLOAD SECURITY ---');
    // Valid PDF upload
    const validFile = {
      originalname: 'resume_john_doe.pdf',
      mimetype: 'application/pdf',
      size: 1024 * 500, // 500 KB
    };
    const validResult = validateFileUpload(validFile);
    assert(validResult.isValid === true, 'Valid PDF file passes upload validation');
    assert(validResult.sanitizedFilename === 'resume_john_doe.pdf', 'Safe filename is preserved');

    // Executable file upload attempt
    let exeError = null;
    try {
      validateFileUpload({
        originalname: 'malicious_script.exe',
        mimetype: 'application/x-msdownload',
        size: 1024,
      });
    } catch (err) {
      exeError = err;
    }
    assert(exeError?.code === 'INVALID_FILE_EXTENSION', 'Dangerous executable .exe is rejected with INVALID_FILE_EXTENSION');

    // Directory traversal attempt
    const traversalFile = {
      originalname: '../../../etc/passwd.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    };
    const traversalResult = validateFileUpload(traversalFile);
    assert(!traversalResult.sanitizedFilename.includes('..'), 'Path traversal characters are sanitized from filename');

    // Oversized file attempt
    let sizeError = null;
    try {
      validateFileUpload({
        originalname: 'large_video.pdf',
        mimetype: 'application/pdf',
        size: 10 * 1024 * 1024, // 10MB
      });
    } catch (err) {
      sizeError = err;
    }
    assert(sizeError?.code === 'FILE_TOO_LARGE', 'Oversized file is rejected with FILE_TOO_LARGE');

    // -------------------------------------------------------------
    // 11. Performance Tracking Diagnostics
    // -------------------------------------------------------------
    console.log('\n--- 11. PERFORMANCE TRACKING DIAGNOSTICS ---');
    const summary = metricsService.getMetricsSummary();
    assert(typeof summary.requests.latencyDistribution.normal_under_500ms === 'number', 'Latency distribution tracks normal requests (<500ms)');
    assert(typeof summary.requests.latencyDistribution.slow_500_to_1500ms === 'number', 'Latency distribution tracks slow requests (500-1500ms)');
    assert(typeof summary.cache.hits === 'number', 'Observability metrics track cache hits');

    console.log('\n===============================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log('===============================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('[TestSuite Fatal Error]', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
};

runSuite();
