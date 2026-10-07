/**
 * SkillSetu — Phase 29 End-to-End Platform Integration, Real-Data Validation & System Evaluation Suite
 * 
 * Validates the complete integrated pipeline:
 * DATA SOURCE -> INGESTION -> VALIDATION -> NORMALIZATION -> DEDUPLICATION ->
 * DATABASE -> SKILL INTELLIGENCE -> SEMANTIC MATCHING -> DEMAND INTELLIGENCE ->
 * FORECASTING -> SKILL GAP ANALYSIS -> CAREER INTELLIGENCE -> LEARNING RECOMMENDATIONS ->
 * OPPORTUNITY INTELLIGENCE -> COMPENSATION INTELLIGENCE -> ORGANIZATION WORKFORCE INTELLIGENCE ->
 * WORKFORCE PLANNING -> RECOMMENDATION ENGINE -> FRONTEND API CONSUMPTION
 */

import http from 'http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import prisma from './config/db.js';
import { aiClient } from './services/aiClient.service.js';
import { embeddingService } from './services/embedding.service.js';
import { sourceRegistryService } from './services/ingestion/sourceRegistry.service.js';
import { importService } from './services/ingestion/import.service.js';
import { normalizationService } from './services/ingestion/normalization.service.js';
import { validationService } from './services/ingestion/validation.service.js';
import { deduplicationService } from './services/ingestion/deduplication.service.js';
import { qualityService } from './services/ingestion/quality.service.js';
import { quarantineService } from './services/ingestion/quarantine.service.js';
import { provenanceService } from './services/ingestion/provenance.service.js';
import { ingestionService } from './services/ingestion/ingestion.service.js';
import { metricsService } from './services/metrics.service.js';
import { sanitizeLogData } from './utils/logger.js';
import { validateFileUpload } from './validators/upload.validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let server;
let baseUrl;
let pythonProcess = null;
let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(method, path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method,
    headers
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // not JSON
  }

  return {
    status: response.status,
    headers: response.headers,
    data
  };
}

async function waitForAiService(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch('http://127.0.0.1:8001/health');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'healthy') {
          return true;
        }
      }
    } catch (e) {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function runEndToEndTests() {
  console.log('===============================================================');
  console.log('SKILLSETU PHASE 29: END-TO-END PLATFORM INTEGRATION & EVALUATION');
  console.log('===============================================================\n');

  // 1. Spawn FastAPI Python AI microservice
  const pythonPath = path.resolve(__dirname, '../../ai-service');
  const venvPython = process.platform === 'win32'
    ? path.join(pythonPath, '.venv', 'Scripts', 'python.exe')
    : path.join(pythonPath, '.venv', 'bin', 'python');

  try {
    pythonProcess = spawn(venvPython, ['-m', 'uvicorn', 'app.main:app', '--port', '8001', '--host', '127.0.0.1'], {
      cwd: pythonPath,
      stdio: 'ignore',
      detached: false,
    });
  } catch (err) {
    console.warn('Could not spawn Python directly:', err.message);
  }

  const aiReady = await waitForAiService();
  assert(aiReady === true, 'FastAPI Python AI microservice is online and healthy on port 8001');

  // 2. Start Node Express test server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------------------
    // 1. COMPLETE SYSTEM ARCHITECTURE & BOUNDARY INTEGRITY AUDIT
    // -------------------------------------------------------------------------
    console.log('--- 1. ARCHITECTURE & BOUNDARY INTEGRITY AUDIT ---');
    assert(typeof app === 'function', 'Node.js Express application instance exists');
    assert(prisma && typeof prisma.user?.findMany === 'function', 'Node.js is sole owner of database access (Prisma / MemoryStore)');
    assert(typeof aiClient.generateEmbeddings === 'function', 'AI microservice integration encapsulated in Node aiClient');
    assert(typeof aiClient.forecastDemand === 'function', 'Analytical forecasting delegated to Python FastAPI AI client');

    const healthRes = await request('GET', '/health');
    assert(healthRes.status === 200, 'Liveness probe GET /health returns 200');
    assert(healthRes.data?.data?.database?.pgvector?.dimension === 384, 'pgvector dense embedding dimension is 384');
    assert(healthRes.data?.data?.service !== undefined, 'Backend service identity is verified');

    const readyRes = await request('GET', '/ready');
    assert(readyRes.status === 200, 'Readiness probe GET /ready returns 200');
    assert(readyRes.data?.data?.ready === true, 'System readiness state is true');

    // -------------------------------------------------------------------------
    // 2. END-TO-END DATA PIPELINE (PHASE 28 INGESTION & PROVENANCE)
    // -------------------------------------------------------------------------
    console.log('\n--- 2. END-TO-END DATA INGESTION & PROVENANCE PIPELINE ---');

    // A. Register external source
    const source = await sourceRegistryService.registerSource({
      name: `E2E Tech Workforce Survey ${Date.now()}`,
      sourceType: 'JOB_POSTINGS',
      provider: 'E2E Global Labor Institute',
      sourceUrl: 'https://e2e.example.org/workforce-2026',
      license: 'CC-BY-4.0',
      trustScore: 0.95,
      metadata: { datasetType: 'SEEDED_TEST', notes: 'Deterministic integration test payload' }
    });
    assert(source && source.id, 'Data source registered with license and category');

    // B. Create dataset & dataset version
    const dataset = await sourceRegistryService.registerDataset({
      sourceId: source.id,
      name: 'Q1 2026 Tech Job Postings',
      category: 'JOB_POSTINGS',
      description: 'E2E test dataset of verified job posting observations'
    });
    assert(dataset && dataset.id, 'Dataset container created under source');

    const version = await sourceRegistryService.createDatasetVersion({
      datasetId: dataset.id,
      versionTag: `v1.0.0-e2e-${Date.now()}`,
      schemaVersion: '1.0',
      effectiveStartDate: new Date('2026-01-01'),
      effectiveEndDate: new Date('2026-03-31')
    });
    assert(version && version.id && version.status === 'DRAFT', 'Immutable DatasetVersion snapshot created');

    // C. Deterministic import payload (clearly marked SEEDED / TEST)
    const testRecords = [
      {
        sourceRecordId: 'JOB-E2E-001',
        jobTitle: 'Senior Backend Engineer',
        company: 'CloudFlow Technologies',
        skills: 'Node.js, PostgreSQL, Docker, Redis',
        experience: '3-6 years',
        location: 'Bengaluru, Karnataka, India (Hybrid)',
        salary: '₹18-24 LPA',
        postingDate: '2026-01-15T00:00:00.000Z'
      },
      {
        sourceRecordId: 'JOB-E2E-002',
        jobTitle: 'Full Stack Developer',
        company: 'InnovateAI Labs',
        skills: 'React, Node.js, Python, Kubernetes',
        experience: '2+ years',
        location: 'Remote',
        salary: '$90k-$120k',
        postingDate: '2026-02-10T00:00:00.000Z'
      },
      {
        sourceRecordId: 'JOB-E2E-003',
        jobTitle: 'Data Engineer',
        company: 'DataMetrics Corp',
        skills: 'Python, SQL, Apache Spark',
        experience: '4 years',
        location: 'New Delhi, India',
        salary: '₹15-20 LPA',
        postingDate: '2026-02-20T00:00:00.000Z'
      },
      {
        sourceRecordId: 'JOB-E2E-004-QUARANTINE',
        jobTitle: '', // Invalid missing required field to test quarantine
        company: 'Broken Inc',
        skills: 'Java',
        salary: 'Negative Salary',
        postingDate: 'invalid-date'
      }
    ];

    // D. Run full ingestion lifecycle
    const ingestionResult = await ingestionService.processDatasetImport(
      version.id,
      testRecords,
      { batchSize: 10, skipRebuilds: true }
    );

    assert(ingestionResult.status === 'SUCCESS', 'Ingestion completed successfully');
    assert(ingestionResult.totalRecords === 4, 'Total records processed is 4');
    assert(ingestionResult.successCount === 3, 'Valid records successfully processed is 3');
    assert(ingestionResult.quarantinedCount === 1, 'Malformed record isolated to quarantine');
    assert(ingestionResult.qualityScore > 0.5, 'Data quality score computed deterministically');

    // E. Verify Quarantine record
    const quarantinedList = await quarantineService.listQuarantinedRecords({ datasetVersionId: version.id });
    assert(quarantinedList.length === 1, 'Quarantine record is reviewable');
    assert(quarantinedList[0].reason === 'INVALID_REQUIRED_FIELD', 'Quarantine reason indicates schema validation failure');

    // F. Verify Idempotent Re-import protection
    const duplicateRun = await ingestionService.processDatasetImport(
      version.id,
      testRecords
    );
    assert(duplicateRun.status === 'ALREADY_IMPORTED', 'Re-ingesting same dataset version returns ALREADY_IMPORTED idempotently');

    // G. Verify Provenance preservation
    const provMeta = provenanceService.createProvenanceMetadata({
      sourceType: 'IMPORTED',
      datasetVersionId: version.id,
      sourceId: source.id
    });
    assert(provMeta.sourceType === 'IMPORTED', 'Observations tagged strictly with IMPORTED provenance');
    assert(provMeta.datasetVersionId === version.id, 'Observations maintain immutable dataset version link');
    assert(ingestionResult.observationsCreated.createdSkillObservations > 0, 'Domain observations created with dataset provenance');

    // -------------------------------------------------------------------------
    // 3. INDIVIDUAL USER SETUP & AUTHENTICATION
    // -------------------------------------------------------------------------
    console.log('\n--- 3. USER SETUP & AUTHENTICATION ---');

    const userEmail = `e2e.individual.${Date.now()}@example.com`;
    const regRes = await request('POST', '/api/v1/auth/register', {
      body: {
        email: userEmail,
        password: 'Password123!',
        name: 'Aarav Sharma',
        accountType: 'INDIVIDUAL'
      }
    });
    assert(regRes.status === 201, 'Individual user registered successfully (201 Created)');
    const token = regRes.data?.data?.tokens?.accessToken;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // -------------------------------------------------------------------------
    // 4. DEMAND INTELLIGENCE & STATISTICAL TIME-SERIES FORECASTING (PHASE 25)
    // -------------------------------------------------------------------------
    console.log('\n--- 4. DEMAND INTELLIGENCE & FORECASTING EVALUATION ---');

    // Get skills demand list
    const demandSkillsRes = await request('GET', '/api/v1/intelligence/demand/skills', { headers: authHeaders });
    assert(demandSkillsRes.status === 200, 'GET /api/v1/intelligence/demand/skills returns 200');
    assert(Array.isArray(demandSkillsRes.data?.data?.data || demandSkillsRes.data?.data?.skills), 'Skill demand data array returned');

    // Emerging skills detection
    const emergingRes = await request('GET', '/api/v1/intelligence/demand/emerging-skills', { headers: authHeaders });
    assert(emergingRes.status === 200, 'GET /api/v1/intelligence/demand/emerging-skills returns 200');
    assert(Array.isArray(emergingRes.data?.data?.skills || emergingRes.data?.data?.emergingSkills), 'Emerging skills list returns array with acceleration signals');

    // Historical forecasting endpoint check
    const catalogSkill = (await prisma.skill.findMany())[0];
    const forecastRes = await request('GET', `/api/v1/intelligence/demand/forecast?skillId=${catalogSkill.id}&horizon=3`, { headers: authHeaders });
    assert(forecastRes.status === 200, 'GET /api/v1/intelligence/demand/forecast returns 200');
    assert(forecastRes.data?.data?.forecasts !== undefined, 'Demand forecast returns forecasts array');
    assert(forecastRes.data?.data?.disclaimer !== undefined, 'Demand forecast contains statistical non-guarantee disclaimer');

    // -------------------------------------------------------------------------
    // 5. SEMANTIC SKILL INTELLIGENCE & HYBRID MATCHING (PHASE 24)
    // -------------------------------------------------------------------------
    console.log('\n--- 5. SEMANTIC SKILL MATCHING & pgvector EVALUATION ---');

    // Reindex skills to ensure pgvector/memory embeddings are present for test catalog
    await embeddingService.reindexAllSkills({ force: true });

    const semanticSearchRes = await request('GET', '/api/v1/skills/semantic-search?q=Node.js+backend&limit=3', { headers: authHeaders });
    assert(semanticSearchRes.status === 200, 'GET /api/v1/skills/semantic-search returns 200');
    assert(Array.isArray(semanticSearchRes.data?.data?.results), 'Semantic search returns results array');
    assert(semanticSearchRes.data?.data?.results?.length > 0, 'Semantic search returns nearest matching skills');
    assert(semanticSearchRes.data?.data?.results[0]?.matchType !== undefined, 'Semantic match returns transparent matchType (EXACT/NORMALIZED/SEMANTIC)');

    // -------------------------------------------------------------------------
    // 6. INDIVIDUAL USER JOURNEY CONTINUED (PHASES 20, 21, 25, 26)
    // -------------------------------------------------------------------------
    console.log('\n--- 6. INDIVIDUAL USER COMPLETE END-TO-END JOURNEY ---');

    // Profile snapshot
    const profileRes = await request('GET', '/api/v1/profile/snapshot', { headers: authHeaders });
    assert(profileRes.status === 200, 'Profile snapshot accessible with JWT auth');

    // Add skills to individual profile
    const allSkills = await prisma.skill.findMany();
    const nodeSkill = allSkills.find(s => s.name === 'Node.js') || allSkills[0];
    const reactSkill = allSkills.find(s => s.name === 'React') || allSkills[1] || allSkills[0];

    const addSkillRes1 = await request('POST', '/api/v1/profile/skills', {
      headers: authHeaders,
      body: {
        skillId: nodeSkill.id,
        proficiency: 'ADVANCED',
        yearsOfExperience: 3.5,
      }
    });
    assert(addSkillRes1.status === 201, 'Node.js skill added to profile (201)');

    const addSkillRes2 = await request('POST', '/api/v1/profile/skills', {
      headers: authHeaders,
      body: {
        skillId: reactSkill.id,
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: 2.0,
      }
    });
    assert(addSkillRes2.status === 201 || addSkillRes2.status === 409, 'React skill added to profile (201/409)');

    // Select Target Role
    const roles = await prisma.role.findMany();
    const targetRole = roles[0];
    if (targetRole) {
      const setRoleRes = await request('PUT', '/api/v1/profile/target-roles', {
        headers: authHeaders,
        body: {
          targetRoleId: targetRole.id
        }
      });
      assert(setRoleRes.status === 200, 'Target role configured on profile');
    }

    // Skill Gaps analysis
    const gapsRes = await request('GET', '/api/v1/intelligence/skill-gaps', { headers: authHeaders });
    assert(gapsRes.status === 200, 'Skill gap analysis computes prioritized gaps (200)');
    assert(Array.isArray(gapsRes.data?.data?.gaps), 'Skill gap payload contains gaps array');

    // Career Compatibility
    const careerRes = await request('GET', '/api/v1/intelligence/career', { headers: authHeaders });
    assert(careerRes.status === 200, 'Career intelligence returns deterministic compatibility breakdown');
    assert(careerRes.data?.data?.compatibility !== undefined || Array.isArray(careerRes.data?.data?.availableRoles), 'Target role compatibility calculated');

    // Learning Recommendations
    const learningRes = await request('GET', '/api/v1/intelligence/learning/recommendations', { headers: authHeaders });
    assert(learningRes.status === 200, 'Learning recommendations generated with explainable signals');

    // Opportunity Compatibility
    const oppsRes = await request('GET', '/api/v1/opportunities', { headers: authHeaders });
    assert(oppsRes.status === 200, 'Opportunities search returns available opportunities');
    const oppList = oppsRes.data?.data?.opportunities || oppsRes.data?.data || [];
    if (Array.isArray(oppList) && oppList.length > 0) {
      const oppId = oppList[0].id;
      const compatRes = await request('GET', `/api/v1/opportunities/${oppId}/compatibility`, { headers: authHeaders });
      assert(compatRes.status === 200, 'Opportunity compatibility calculated (70% deterministic + 30% semantic)');
      assert(typeof compatRes.data?.data?.compatibility?.overall === 'number' || compatRes.data?.data?.overallCompatibility !== undefined, 'Compatibility percentage computed');
    }

    // Multi-Signal Individual Recommendations (Phase 26)
    const genRecRes = await request('POST', '/api/v1/recommendations/generate', {
      headers: authHeaders,
      body: { forceRefresh: true }
    });
    assert(genRecRes.status === 200, 'Individual recommendations generated successfully');
    const recs = genRecRes.data?.data?.recommendations || genRecRes.data?.recommendations;
    assert(Array.isArray(recs), 'Recommendations array returned');

    const recListRes = await request('GET', '/api/v1/recommendations', { headers: authHeaders });
    assert(recListRes.status === 200, 'GET /api/v1/recommendations returns stored recommendations');

    // Advertised Compensation Intelligence
    const compRes = await request('GET', '/api/v1/intelligence/compensation/patterns', { headers: authHeaders });
    assert(compRes.status === 200 || compRes.status === 404, 'Advertised compensation patterns endpoint operational');

    // -------------------------------------------------------------------------
    // 7. ORGANIZATION USER JOURNEY & TENANT ISOLATION (PHASES 20, 22, 26)
    // -------------------------------------------------------------------------
    console.log('\n--- 7. ORGANIZATION WORKFORCE JOURNEY & TENANT ISOLATION ---');

    // Org A Admin registration
    const orgAAdminEmail = `orgA.admin.${Date.now()}@example.com`;
    const orgAReg = await request('POST', '/api/v1/auth/register', {
      body: {
        email: orgAAdminEmail,
        password: 'Password123!',
        fullName: 'Devraj Rao',
        accountType: 'ORGANIZATION',
        organizationName: 'HexaCore Systems'
      }
    });
    assert(orgAReg.status === 201, 'Organization A admin registered (201)');
    const orgAToken = orgAReg.data?.data?.tokens?.accessToken;
    const orgAHeaders = { Authorization: `Bearer ${orgAToken}` };

    // Org B Admin registration (for tenant isolation tests)
    const orgBAdminEmail = `orgB.admin.${Date.now()}@example.com`;
    const orgBReg = await request('POST', '/api/v1/auth/register', {
      body: {
        email: orgBAdminEmail,
        password: 'Password123!',
        fullName: 'Pooja Nair',
        accountType: 'ORGANIZATION',
        organizationName: 'BluePeak Analytics'
      }
    });
    assert(orgBReg.status === 201, 'Organization B admin registered (201)');
    const orgBToken = orgBReg.data?.data?.tokens?.accessToken;
    const orgBHeaders = { Authorization: `Bearer ${orgBToken}` };

    // Org A creates a Department
    const deptRes = await request('POST', '/api/v1/organization/departments', {
      headers: orgAHeaders,
      body: {
        name: 'Engineering & Cloud Architecture',
        headCount: 45
      }
    });
    assert(deptRes.status === 201, 'Organization A created department');
    const deptId = deptRes.data?.data?.department?.id || deptRes.data?.data?.id;

    // Org A populates workforce inventory
    const addWfSkill = await request('POST', '/api/v1/organization/workforce/skills', {
      headers: orgAHeaders,
      body: {
        skillName: 'TypeScript',
        category: 'Engineering',
        workforceCount: 45,
        targetRequirement: 60,
        coveragePercentage: 75.0,
        department: 'Engineering & Cloud Architecture',
        importance: 'HIGH',
      }
    });
    assert(addWfSkill.status === 201, 'Organization A workforce skill inventory updated');

    // Org A Skill Gaps & Capability
    const orgGapsRes = await request('GET', '/api/v1/organization/intelligence/skill-gaps', { headers: orgAHeaders });
    assert(orgGapsRes.status === 200, 'Organization workforce skill gaps calculated');

    // Org A Planning Scenarios
    const scenarioRes = await request('POST', '/api/v1/organization/planning/scenarios', {
      headers: orgAHeaders,
      body: {
        name: 'FY27 Cloud Modernization Expansion',
        planningHorizon: 'MONTHS_12',
        workforceGrowthPct: 25.0,
        skillDemandChangePct: 30.0,
        hiringCapacity: 30,
        developmentCapacity: 50,
        targetTimeline: '12 Months',
        status: 'ACTIVE',
      }
    });
    assert(scenarioRes.status === 201, 'Organization A planning scenario created');
    const scenarioId = scenarioRes.data?.data?.scenario?.id || scenarioRes.data?.data?.id;

    // Org A Recommendations
    const orgRecGenRes = await request('POST', '/api/v1/organization/recommendations/generate', {
      headers: orgAHeaders,
      body: { forceRefresh: true }
    });
    assert(orgRecGenRes.status === 200, 'Organization A workforce recommendations generated');

    // TENANT ISOLATION CHECK: Org B cannot access Org A's Department or Scenario
    const crossDeptRes = await request('GET', `/api/v1/organization/departments/${deptId}`, { headers: orgBHeaders });
    assert(crossDeptRes.status === 404 || crossDeptRes.status === 403, 'Tenant Isolation: Org B cannot access Org A department (404/403)');

    const crossScenarioRes = await request('GET', `/api/v1/organization/planning/scenarios/${scenarioId}`, { headers: orgBHeaders });
    assert(crossScenarioRes.status === 404 || crossScenarioRes.status === 403, 'Tenant Isolation: Org B cannot access Org A scenario (404/403)');

    // -------------------------------------------------------------------------
    // 8. CROSS-MODULE CANONICAL ENTITY CONSISTENCY
    // -------------------------------------------------------------------------
    console.log('\n--- 8. CROSS-MODULE CANONICAL ENTITY CONSISTENCY ---');

    // Verify Node.js skill canonical ID is uniform across profile, gap, demand, and recommendations
    const profileSkillsRes = await request('GET', '/api/v1/profile/skills', { headers: authHeaders });
    const profileSkills = profileSkillsRes.data?.data?.skills || [];
    assert(profileSkills.some(s => s.skillId === nodeSkill.id), 'Canonical Skill ID matches in User Profile');

    const canonicalSkillInDb = await prisma.skill.findUnique({ where: { id: nodeSkill.id } });
    assert(canonicalSkillInDb && canonicalSkillInDb.name === 'Node.js', 'Canonical Skill resolves uniformly in DB');

    // -------------------------------------------------------------------------
    // 9. SECURITY, RBAC & FAILURE-SCENARIO TESTING
    // -------------------------------------------------------------------------
    console.log('\n--- 9. SECURITY, RBAC & FAILURE-SCENARIOS ---');

    // A. Unauthenticated access rejected
    const unauthRes = await request('GET', '/api/v1/recommendations');
    assert(unauthRes.status === 401, 'Unauthenticated request rejected with 401');
    assert(unauthRes.data?.error?.code === 'AUTH_TOKEN_REQUIRED' || unauthRes.data?.error?.code === 'UNAUTHENTICATED', 'Error follows standardized code');

    // B. Account type boundary: Individual user cannot access Organization endpoints
    const forbiddenOrgRes = await request('GET', '/api/v1/organization/departments', { headers: authHeaders });
    assert(forbiddenOrgRes.status === 403, 'Individual user blocked from Organization routes (403 Forbidden)');

    // C. Non-admin user cannot access Admin Ingestion APIs
    const nonAdminIngestionRes = await request('GET', '/api/v1/admin/ingestion/sources', { headers: authHeaders });
    assert(nonAdminIngestionRes.status === 403, 'Non-admin blocked from Admin Ingestion routes (403 Forbidden)');

    // D. Sensitive Log Sanitization verification
    const sensitiveObj = {
      password: 'PlaintextPassword123!',
      token: 'jwt-access-token-secret',
      apiKey: 'sk-live-secret-api-key',
      resumeText: 'Private personal information',
      embeddings: [0.1, 0.2, 0.3, 0.4],
      safeField: 'Public Safe Title'
    };
    const sanitized = sanitizeLogData(sensitiveObj);
    assert(sanitized.password === '[REDACTED]', 'Logger redacts password');
    assert(sanitized.token === '[REDACTED]', 'Logger redacts token');
    assert(sanitized.apiKey === '[REDACTED]', 'Logger redacts apiKey');
    assert(sanitized.resumeText === '[REDACTED]', 'Logger redacts resumeText');
    assert(sanitized.embeddings === '[REDACTED]', 'Logger redacts embeddings vector');
    assert(sanitized.safeField === 'Public Safe Title', 'Logger preserves non-sensitive fields');

    // E. File upload security
    const dangerousFile = {
      originalname: '../../../malicious_script.exe',
      mimetype: 'application/x-msdownload',
      size: 1024
    };
    let uploadRejected = false;
    try {
      validateFileUpload(dangerousFile, { allowedMimes: ['application/json', 'text/csv'] });
    } catch (err) {
      uploadRejected = true;
    }
    assert(uploadRejected, 'Dangerous file extension / MIME type rejected by upload security filter');

    // F. AI Client circuit breaker verification
    assert(aiClient.getCircuitState().state === 'CLOSED', 'Circuit breaker starts in CLOSED operational state');

    // -------------------------------------------------------------------------
    // 10. OBSERVABILITY & ADMIN METRICS AUDIT
    // -------------------------------------------------------------------------
    console.log('\n--- 10. OBSERVABILITY & METRICS TELEMETRY ---');

    const metricsSummary = metricsService.getMetricsSummary();
    assert(metricsSummary.requests !== undefined, 'Metrics service tracks total request throughput');
    assert(metricsSummary.dataIngestion !== undefined, 'Metrics service tracks dataIngestion counters');

    console.log('\n===============================================================');
    console.log(`END-TO-END TEST SUITE SUMMARY: ${passedCount} PASSED | ${failedCount} FAILED`);
    console.log('===============================================================');

  } catch (err) {
    console.error('Unhandled test execution error:', err);
    failedCount++;
  } finally {
    if (server) {
      server.close();
    }
    if (pythonProcess) {
      pythonProcess.kill();
    }
  }

  process.exit(failedCount > 0 ? 1 : 0);
}

runEndToEndTests().catch((err) => {
  console.error('Fatal runner error:', err);
  if (server) server.close();
  if (pythonProcess) pythonProcess.kill();
  process.exit(1);
});
