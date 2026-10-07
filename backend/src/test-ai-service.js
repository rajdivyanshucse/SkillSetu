/**
 * =========================================================================
 * PHASE 23 — AI/ML INTELLIGENCE FOUNDATION & PYTHON INTEGRATION TEST SUITE
 * =========================================================================
 * Tests the Node.js <-> Python FastAPI AI Microservice communication,
 * authentication, validation, error mapping, timeouts, audit logs, and regressions.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import env from './config/env.js';
import aiClient from './services/aiClient.service.js';
import prisma from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let server;
let baseUrl;
let pythonProcess = null;

let passed = 0;
let failed = 0;

const test = (description, condition) => {
  if (condition) {
    console.log(`  ✓ PASS: ${description}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${description}`);
    failed++;
  }
};

const makeRequest = async (endpoint, options = {}) => {
  const url = `${baseUrl}/api/v1${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, headers: res.headers, body };
  } catch (err) {
    return { status: 500, error: err.message, body: null };
  }
};

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
    } catch {
      // Retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function startPythonService() {
  const isUp = await waitForAiService(2);
  if (isUp) {
    console.log('Python AI Service is already active on port 8001.');
    return;
  }

  console.log('Launching Python AI Microservice on port 8001...');
  const aiServiceDir = path.resolve(__dirname, '../../ai-service');
  const pythonExe = path.resolve(aiServiceDir, '.venv/Scripts/python.exe');

  pythonProcess = spawn(
    pythonExe,
    ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8001'],
    {
      cwd: aiServiceDir,
      stdio: 'ignore',
      detached: false,
    }
  );

  const ready = await waitForAiService(25);
  if (!ready) {
    console.error('Failed to connect to Python AI Microservice on port 8001.');
  } else {
    console.log('Python AI Microservice connected successfully.');
  }
}

async function runTests() {
  console.log('===============================================================');
  console.log('PHASE 23 — AI/ML SERVICE & NLP INTELLIGENCE TEST SUITE');
  console.log('===============================================================\n');

  try {
    // 1. Ensure Python AI microservice is running
    await startPythonService();

    // 2. Start Express test server on ephemeral port
    server = await new Promise((resolve) => {
      const s = app.listen(0, () => {
        const port = s.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        console.log(`Node.js Test server running on ${baseUrl}\n`);
        resolve(s);
      });
    });

    const timestamp = Date.now();
    const testPassword = 'TestPassword123!';

    // Setup Test Users
    const indEmail = `ai.ind.${timestamp}@example.com`;
    const orgEmail = `ai.org.${timestamp}@example.com`;

    const indReg = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: indEmail,
        password: testPassword,
        accountType: 'INDIVIDUAL',
        fullName: 'Dr. Jane AI Specialist',
      }),
    });
    const indToken = indReg.body?.data?.tokens?.accessToken;

    const orgReg = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: orgEmail,
        password: testPassword,
        accountType: 'ORGANIZATION',
        fullName: 'TechCorp Director',
        organizationName: `TechCorp AI ${timestamp}`,
        industry: 'Software & AI',
        companySize: '100-500',
      }),
    });
    const orgToken = orgReg.body?.data?.tokens?.accessToken;

    // -------------------------------------------------------------
    // SECTION 1: AI MICROSERVICE HEALTH & DIRECT COMMUNICATION
    // -------------------------------------------------------------
    console.log('--- SECTION 1: AI SERVICE HEALTH & STATUS ---');

    // 1. Direct Python AI Health
    const directHealthRes = await fetch('http://127.0.0.1:8001/health');
    const directHealthData = await directHealthRes.json().catch(() => null);
    test('1. Python AI Service /health returns healthy (200)', directHealthRes.status === 200 && directHealthData?.status === 'healthy');

    // 2. Direct Python AI Readiness
    const directReadyRes = await fetch('http://127.0.0.1:8001/ready');
    const directReadyData = await directReadyRes.json().catch(() => null);
    test('2. Python AI Service /ready returns ready (200)', directReadyRes.status === 200 && directReadyData?.status === 'ready');

    // 3. Node AI Status Endpoint
    const nodeAiStatus = await makeRequest('/ai/status', {
      headers: { Authorization: `Bearer ${indToken}` },
    });
    test('3. Node.js /ai/status proxies status successfully (200)', nodeAiStatus.status === 200 && nodeAiStatus.body?.data?.aiStatus?.isAvailable === true);

    // -------------------------------------------------------------
    // SECTION 2: AI SERVICE AUTHENTICATION & SECURITY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: AI SERVICE AUTHENTICATION & KEY VALIDATION ---');

    // 4. Unauthorized direct call to Python service rejected
    const unauthDirect = await fetch('http://127.0.0.1:8001/ai/v1/skills/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Java developer' }),
    });
    test('4. Direct request to Python AI without key rejected (401)', unauthDirect.status === 401);

    // 5. Invalid key to Python service rejected
    const invalidKeyDirect = await fetch('http://127.0.0.1:8001/ai/v1/skills/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AI-Service-Key': 'invalid-bogus-key',
      },
      body: JSON.stringify({ text: 'Java developer' }),
    });
    test('5. Direct request to Python AI with invalid key rejected (401)', invalidKeyDirect.status === 401);

    // 6. Node aiClient with invalid key mapping
    let authFailedMapped = false;
    try {
      await aiClient.post('/ai/v1/skills/extract', { text: 'Python developer' }, { apiKey: 'wrong-key' });
    } catch (err) {
      authFailedMapped = err.statusCode === 500 && (err.code === 'AI_SERVICE_AUTH_FAILED' || err.errorCode === 'AI_SERVICE_AUTH_FAILED');
    }
    test('6. Node.js client translates AI key failure to AI_SERVICE_AUTH_FAILED', authFailedMapped);

    // -------------------------------------------------------------
    // SECTION 3: SKILL EXTRACTION & NORMALIZATION PROXY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: SKILL EXTRACTION PROXY ---');

    // 7. Individual skill extraction
    const sampleText = 'Senior Full Stack Engineer with 5+ years of experience in JavaScript, React.js, Node.js, PostgreSQL, Docker, and AWS Cloud.';
    const extractRes = await makeRequest('/ai/skills/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: sampleText }),
    });
    const extractedSkills = extractRes.body?.data?.skills || [];
    const skillNames = extractedSkills.map((s) => s.name);

    test('7. Skill extraction returns 200 and extracted skills list', extractRes.status === 200 && extractedSkills.length >= 5);
    test('8. Extracted skills normalized to canonical taxonomy names', skillNames.includes('JavaScript') && skillNames.includes('React.js') && skillNames.includes('PostgreSQL'));
    test('9. Confidence levels assigned (HIGH / MEDIUM)', extractedSkills.every((s) => typeof s.confidence === 'number' && ['HIGH', 'MEDIUM', 'LOW'].includes(s.confidenceLevel)));
    test('10. Catalog correlation tags existing catalog skills', extractedSkills.some((s) => s.existsInCatalog === true));

    // 11. Variant normalization test
    const variantText = 'Skills: JS, NodeJS, K8s, Postgres, TailwindCSS';
    const variantExtract = await makeRequest('/ai/skills/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: variantText }),
    });
    const variantSkills = (variantExtract.body?.data?.skills || []).map((s) => s.name);
    test('11. Synonyms (JS, NodeJS, K8s, Postgres) normalize properly', variantSkills.includes('JavaScript') && variantSkills.includes('Node.js') && variantSkills.includes('Kubernetes') && variantSkills.includes('PostgreSQL'));

    // -------------------------------------------------------------
    // SECTION 4: RESUME ANALYSIS PROXY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: RESUME ANALYSIS ---');

    const resumeSample = `
    Alex Rivera
    Senior Distributed Backend Engineer with 6+ years of experience.
    Education: B.Tech in Information Technology.
    Core Competencies:
    - Python, FastAPI, Django, REST APIs, Microservices
    - PostgreSQL, Redis, Apache Kafka, Docker, Kubernetes
    - AWS Cloud, CI/CD Pipelines, System Architecture
    `;

    const resumeRes = await makeRequest('/ai/resume/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: resumeSample }),
    });
    const resumeData = resumeRes.body?.data;
    const resumeSkills = (resumeData?.skills || []).map((s) => s.name);

    test('12. Resume analysis returns structured skills and signals (200)', resumeRes.status === 200 && resumeSkills.length >= 6);
    test('13. Resume analysis detects role signals', Array.isArray(resumeData?.roles) && resumeData.roles.length >= 1);
    test('14. Resume analysis detects experience signals', Array.isArray(resumeData?.experienceSignals) && resumeData.experienceSignals.length >= 1);
    test('15. Resume analysis summary counts provided', typeof resumeData?.summary?.skillsCount === 'number');

    // -------------------------------------------------------------
    // SECTION 5: JOB DESCRIPTION ANALYSIS PROXY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: JOB DESCRIPTION ANALYSIS ---');

    const jdSample = `
    Position: Lead Cloud & DevOps Specialist
    
    Required Qualifications:
    - Must have extensive experience in Kubernetes, Docker, and AWS Cloud.
    - Required proficiency in CI/CD Pipelines and Linux.
    
    Preferred & Bonus Skills:
    - Nice to have experience with Terraform and Python.
    - Plus if experienced with PostgreSQL and Microservices.
    `;

    const jdRes = await makeRequest('/ai/job-description/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: JSON.stringify({ text: jdSample }),
    });
    const jdData = jdRes.body?.data;
    const reqSkillNames = (jdData?.requiredSkills || []).map((s) => s.name);
    const prefSkillNames = (jdData?.preferredSkills || []).map((s) => s.name);

    test('16. Job description analysis returns categorized skills (200)', jdRes.status === 200 && jdData?.skills?.length >= 5);
    test('17. Required skills classified deterministically from text', reqSkillNames.includes('Kubernetes') || reqSkillNames.includes('Docker') || reqSkillNames.includes('AWS Cloud'));
    test('18. Preferred skills classified deterministically from text', prefSkillNames.includes('Terraform') || prefSkillNames.includes('Python'));
    test('19. Role signals identified in job description', Array.isArray(jdData?.roles) && jdData.roles.length >= 1);

    // -------------------------------------------------------------
    // SECTION 6: AUTHORIZATION & BOUNDARIES
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: AUTHORIZATION & ACCOUNT TYPE BOUNDARIES ---');

    // 20. Unauthenticated access rejected
    const unauthExtract = await makeRequest('/ai/skills/extract', {
      method: 'POST',
      body: JSON.stringify({ text: 'JavaScript' }),
    });
    test('20. Unauthenticated AI request rejected (401)', unauthExtract.status === 401);

    // 21. Organization rejected from individual-only resume analysis
    const orgResumeAnalysis = await makeRequest('/ai/resume/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: JSON.stringify({ text: 'Resume text' }),
    });
    test('21. Organization account rejected from individual resume endpoint (403)', orgResumeAnalysis.status === 403);

    // 22. Individual rejected from organization-only job description analysis
    const indJdAnalysis = await makeRequest('/ai/job-description/analyze', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: 'Job description text' }),
    });
    test('22. Individual account rejected from organization job description endpoint (403)', indJdAnalysis.status === 403);

    // -------------------------------------------------------------
    // SECTION 7: INPUT VALIDATION & CONSTRAINTS
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: INPUT VALIDATION & LIMITS ---');

    // 23. Empty text rejected
    const emptyExtract = await makeRequest('/ai/skills/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: '   ' }),
    });
    test('23. Empty text payload rejected with 422 Unprocessable Entity', emptyExtract.status === 422);

    // 24. Oversized text rejected (>50,000 chars)
    const hugeText = 'JavaScript '.repeat(6000); // ~66,000 chars
    const hugeExtract = await makeRequest('/ai/skills/extract', {
      method: 'POST',
      headers: { Authorization: `Bearer ${indToken}` },
      body: JSON.stringify({ text: hugeText }),
    });
    test('24. Text exceeding 50,000 characters rejected with 422', hugeExtract.status === 422);

    // -------------------------------------------------------------
    // SECTION 8: ERROR MAPPING & RESILIENCE
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: ERROR MAPPING & RESILIENCE ---');

    // 25. Timeout handling simulation
    let timeoutMapped = false;
    try {
      await aiClient.post('/ai/v1/skills/extract', { text: 'Slow request' }, { timeoutMs: 1 });
    } catch (err) {
      timeoutMapped = err.statusCode === 504 && (err.code === 'AI_SERVICE_TIMEOUT' || err.errorCode === 'AI_SERVICE_TIMEOUT');
    }
    test('25. Timeout abort mapped to 504 AI_SERVICE_TIMEOUT', timeoutMapped);

    // 26. Service unavailable simulation (connecting to unused port)
    let unavailableMapped = false;
    try {
      const offlineClient = new (aiClient.constructor)();
      offlineClient.baseUrl = 'http://127.0.0.1:59999';
      await offlineClient.post('/ai/v1/skills/extract', { text: 'Offline request' }, { timeoutMs: 500 });
    } catch (err) {
      unavailableMapped = err.statusCode === 503 && (err.code === 'AI_SERVICE_UNAVAILABLE' || err.errorCode === 'AI_SERVICE_UNAVAILABLE');
    }
    test('26. Offline AI service mapped to 503 AI_SERVICE_UNAVAILABLE without crashing server', unavailableMapped);

    // -------------------------------------------------------------
    // SECTION 9: AUDIT LOGGING & PRIVACY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 9: AUDIT LOGGING & PRIVACY ---');

    const auditLogs = await prisma.authAuditLog.findMany();
    const aiEvents = auditLogs.filter((l) => l.action.startsWith('AI_'));

    test('27. Audit events recorded for AI extraction and analysis', aiEvents.length >= 1);
    test('28. Raw resume/job description texts are NOT stored in audit logs', aiEvents.every((l) => !l.metadata?.text && !l.metadata?.resumeText));

    // -------------------------------------------------------------
    // SECTION 10: REGRESSIONS ACROSS PREVIOUS PHASES
    // -------------------------------------------------------------
    console.log('\n--- SECTION 10: REGRESSIONS ACROSS PREVIOUS PHASES ---');

    // Phase 18 Root & Health
    const rootFetch = await fetch(`${baseUrl}/`);
    const rootBody = await rootFetch.json().catch(() => null);
    test('29. Phase 18 root endpoint returns API metadata (200)', rootFetch.status === 200 && rootBody?.success === true);

    const healthRes = await makeRequest('/health');
    test('30. Phase 18 health check endpoint returns UP (200)', healthRes.status === 200);

    // Phase 20 Auth Me
    const meRes = await makeRequest('/auth/me', {
      headers: { Authorization: `Bearer ${indToken}` },
    });
    test('31. Phase 20 authentication /auth/me returns current user (200)', meRes.status === 200 && meRes.body?.data?.user?.email === indEmail);

    // Phase 21 Individual Dashboard
    const indDashRes = await makeRequest('/dashboard/individual', {
      headers: { Authorization: `Bearer ${indToken}` },
    });
    test('32. Phase 21 individual dashboard returns aggregated intelligence (200)', indDashRes.status === 200);

    // Phase 22 Organization Dashboard
    const orgDashRes = await makeRequest('/dashboard/organization', {
      headers: { Authorization: `Bearer ${orgToken}` },
    });
    test('33. Phase 22 organization dashboard returns aggregated workforce intelligence (200)', orgDashRes.status === 200);

    console.log('\n===============================================================');
    console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('===============================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during test execution:', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    if (pythonProcess) {
      pythonProcess.kill();
    }
  }
}

runTests();
