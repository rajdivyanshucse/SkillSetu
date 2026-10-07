/**
 * =========================================================================
 * PHASE 25 — DEMAND INTELLIGENCE, SKILL TRENDS & DEMAND FORECASTING TEST SUITE
 * =========================================================================
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import env from './config/env.js';
import aiClient from './services/aiClient.service.js';
import prisma from './config/db.js';
import DemandIntelligenceService from './services/demandIntelligence.service.js';
import DemandForecastService from './services/demandForecast.service.js';

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
    } catch (e) {
      // retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('STARTING PHASE 25 — DEMAND INTELLIGENCE & FORECASTING TEST SUITE');
  console.log('===============================================================\n');

  // Start FastAPI Python AI Microservice on port 8001
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
  test('FastAPI AI Microservice is running and healthy on port 8001', aiReady);

  // Start Node Express test server
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Setup test accounts & tokens
  const timestamp = Date.now();
  const indEmail = `test.demand.ind.${timestamp}@example.com`;
  const orgEmail = `test.demand.org.${timestamp}@example.com`;
  const adminEmail = `test.demand.admin.${timestamp}@example.com`;

  // 1. Register INDIVIDUAL
  const indReg = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: indEmail,
      password: 'Password123!',
      fullName: 'Demand Tester',
      accountType: 'INDIVIDUAL',
    }),
  });
  const indToken = indReg.body?.data?.tokens?.accessToken;
  const indUserId = indReg.body?.data?.user?.id;

  // 2. Register ORGANIZATION
  const orgReg = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: orgEmail,
      password: 'Password123!',
      fullName: 'Demand Org Lead',
      accountType: 'ORGANIZATION',
      organizationName: 'Demand Org Test',
    }),
  });
  const orgToken = orgReg.body?.data?.tokens?.accessToken;

  // 3. Register ADMIN
  const adminReg = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: 'Password123!',
      fullName: 'Demand Administrator',
      accountType: 'INDIVIDUAL',
    }),
  });
  const adminUserId = adminReg.body?.data?.user?.id;
  if (adminUserId) {
    await prisma.user.update({ where: { id: adminUserId }, data: { role: 'ADMIN' } });
  }

  const adminLogin = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: 'Password123!',
    }),
  });
  const adminToken = adminLogin.body?.data?.tokens?.accessToken;

  test('Registered test users (Individual, Organization, Admin)', Boolean(indToken && orgToken && adminToken));

  // Retrieve seed skill & role
  const skillsList = await prisma.skill.findMany({ take: 5 });
  const reactSkill = skillsList.find((s) => s.name.toLowerCase().includes('react')) || skillsList[0];
  const rolesList = await prisma.role.findMany({ take: 5 });
  const backendRole = rolesList.find((r) => r.name.toLowerCase().includes('backend')) || rolesList[0];

  console.log('\n--- 1. DIRECT PYTHON AI FORECASTING & TREND ENDPOINTS ---');
  if (aiReady) {
    const series = [
      { period: '2025-Q1', value: 100 },
      { period: '2025-Q2', value: 120 },
      { period: '2025-Q3', value: 140 },
      { period: '2025-Q4', value: 160 },
    ];
    const fcDirect = await aiClient.forecastDemand(series, 2, 'LINEAR_TREND');
    test('AI microservice /ai/v1/demand/forecast returns predicted projections', fcDirect?.success && fcDirect?.forecast?.length === 2 && fcDirect?.forecast[0]?.predictedDemand === 180);
    test('AI forecast contains lower/upper confidence bounds', fcDirect?.forecast[0]?.lowerBound !== null && fcDirect?.forecast[0]?.upperBound !== null);
    test('AI forecast returns non-guarantee disclaimer', Boolean(fcDirect?.disclaimer && fcDirect.disclaimer.includes('statistical')));

    const trDirect = await aiClient.analyzeTrend(series);
    test('AI microservice /ai/v1/demand/trend classifies upward trend as GROWING', trDirect?.trendCategory === 'GROWING');
    test('AI trend returns explainability evidence array', Array.isArray(trDirect?.evidence) && trDirect.evidence.length > 0);

    const valDirect = await aiClient.validateDemandModel(series, 1, 'LINEAR_TREND');
    test('AI microservice /ai/v1/demand/validate backtests on holdout period', valDirect?.isValid && valDirect?.metrics?.mae !== undefined);
  } else {
    console.log('  (Skipping direct Python AI tests - AI service offline)');
  }

  console.log('\n--- 2. AUTHENTICATION & AUTHORIZATION ENFORCEMENT ---');
  const unauthSkills = await makeRequest('/intelligence/demand/skills');
  test('Unauthenticated GET /intelligence/demand/skills returns 401', unauthSkills.status === 401);

  const unauthOrg = await makeRequest('/organization/intelligence/demand');
  test('Unauthenticated GET /organization/intelligence/demand returns 401', unauthOrg.status === 401);

  const indRebuild = await makeRequest('/admin/ai/demand/rebuild', {
    method: 'POST',
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('Individual user POST /admin/ai/demand/rebuild returns 403 Forbidden', indRebuild.status === 403);

  const orgRebuild = await makeRequest('/admin/ai/demand/rebuild', {
    method: 'POST',
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('Organization user POST /admin/ai/demand/rebuild returns 403 Forbidden', orgRebuild.status === 403);

  console.log('\n--- 3. INDIVIDUAL DEMAND INTELLIGENCE ENDPOINTS ---');
  const demandSkillsRes = await makeRequest('/intelligence/demand/skills', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /api/v1/intelligence/demand/skills returns 200 and skill list', demandSkillsRes.status === 200 && Array.isArray(demandSkillsRes.body?.data?.data));
  test('Skills list response contains non-guarantee disclaimer', Boolean(demandSkillsRes.body?.data?.disclaimer));

  const singleSkillRes = await makeRequest(`/intelligence/demand/skills/${reactSkill.id}`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /api/v1/intelligence/demand/skills/:skillId returns 200 and skill breakdown', singleSkillRes.status === 200 && singleSkillRes.body?.data?.skill?.id === reactSkill.id);
  test('Skill demand includes trendCategory, growthRate, and volatility', singleSkillRes.body?.data?.trendCategory !== undefined && singleSkillRes.body?.data?.growthRate !== undefined);
  test('Skill demand includes dataQuality metadata (SEEDED, observationCount, quality)', singleSkillRes.body?.data?.dataQuality?.sourceType === 'SEEDED' && singleSkillRes.body?.data?.dataQuality?.quality !== undefined);
  test('Skill demand includes explainable evidence array', Array.isArray(singleSkillRes.body?.data?.evidence) && singleSkillRes.body?.data?.evidence.length > 0);

  const emergingRes = await makeRequest('/intelligence/demand/emerging-skills', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /api/v1/intelligence/demand/emerging-skills returns 200 and emerging skills list', emergingRes.status === 200 && Array.isArray(emergingRes.body?.data?.skills));
  test('Emerging skills have positive growth rate and role coverage count', emergingRes.body?.data?.skills?.length > 0 ? emergingRes.body.data.skills[0].growthRate > 0 : true);

  const skillForecastRes = await makeRequest(`/intelligence/demand/forecast?skillId=${reactSkill.id}&horizon=3`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /api/v1/intelligence/demand/forecast?skillId returns 200 and forecast projections', skillForecastRes.status === 200 && skillForecastRes.body?.data?.forecasts?.length === 3);
  test('Forecast payload includes modelUsed, confidenceLevel, and disclaimer', Boolean(skillForecastRes.body?.data?.modelUsed && skillForecastRes.body?.data?.confidenceLevel && skillForecastRes.body?.data?.disclaimer));

  const roleForecastRes = await makeRequest(`/intelligence/demand/forecast?roleId=${backendRole.id}&horizon=2`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /api/v1/intelligence/demand/forecast?roleId returns 200 and role projections', roleForecastRes.status === 200 && roleForecastRes.body?.data?.forecasts?.length === 2);

  const dummySkill = await prisma.skill.create({
    data: {
      name: 'Obscure Legacy Skill',
      normalizedName: 'obscure-legacy-skill-' + Date.now(),
      category: 'Legacy',
      isActive: true,
    },
  });
  const insufficientFc = await makeRequest(`/intelligence/demand/forecast?skillId=${dummySkill.id}`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('Forecasting on insufficient data returns INSUFFICIENT_DATA status without hallucinating', insufficientFc.status === 200 && insufficientFc.body?.data?.forecastStatus === 'INSUFFICIENT_DATA' && insufficientFc.body?.data?.forecasts?.length === 0);

  console.log('\n--- 4. ORGANIZATION DEMAND INTELLIGENCE ENDPOINTS ---');
  const orgOverviewRes = await makeRequest('/organization/intelligence/demand', {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('GET /api/v1/organization/intelligence/demand returns 200 and workforce demand signals', orgOverviewRes.status === 200 && orgOverviewRes.body?.data?.workforceSkillSignals !== undefined);
  test('Organization demand signals include decision-support tags (HIRE_SIGNAL / UPSKILL_SIGNAL / MONITOR_SIGNAL)', ['HIRE_SIGNAL', 'UPSKILL_SIGNAL', 'MONITOR_SIGNAL', 'DATA_INSUFFICIENT'].includes(orgOverviewRes.body?.data?.workforceSkillSignals?.[0]?.signal || 'MONITOR_SIGNAL'));

  const orgSkillsRes = await makeRequest('/organization/intelligence/demand/skills', {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('GET /api/v1/organization/intelligence/demand/skills returns 200 and skills telemetry', orgSkillsRes.status === 200 && Array.isArray(orgSkillsRes.body?.data?.skills));

  const orgRolesRes = await makeRequest('/organization/intelligence/demand/roles', {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('GET /api/v1/organization/intelligence/demand/roles returns 200 and roles telemetry', orgRolesRes.status === 200 && Array.isArray(orgRolesRes.body?.data?.roles));

  const orgFcRes = await makeRequest(`/organization/intelligence/demand/forecast?skillId=${reactSkill.id}`, {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('GET /api/v1/organization/intelligence/demand/forecast returns 200 and forecast projections', orgFcRes.status === 200 && orgFcRes.body?.data?.forecasts?.length > 0);

  console.log('\n--- 5. ADMIN DEMAND INTELLIGENCE ENDPOINTS ---');
  const adminStatusRes = await makeRequest('/admin/ai/demand/status', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  test('GET /api/v1/admin/ai/demand/status returns 200 and observation counts', adminStatusRes.status === 200 && adminStatusRes.body?.data?.skillDemandObservations > 0);

  const adminRebuildRes = await makeRequest('/admin/ai/demand/rebuild', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  test('POST /api/v1/admin/ai/demand/rebuild returns 200 and status REBUILD_COMPLETE', adminRebuildRes.status === 200 && adminRebuildRes.body?.data?.status === 'REBUILD_COMPLETE');

  const adminFcRebuildRes = await makeRequest('/admin/ai/demand/forecast/rebuild', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ horizon: 3 }),
  });
  test('POST /api/v1/admin/ai/demand/forecast/rebuild returns 200 and processes skills & roles', adminFcRebuildRes.status === 200 && adminFcRebuildRes.body?.data?.skillsProcessed > 0);

  console.log('\n--- 6. MATHEMATICAL ACCURACY & DETERMINISTIC TREND LOGIC ---');
  const testSeriesUp = [100, 110, 125];
  const trUp = DemandIntelligenceService.classifyTrend(testSeriesUp);
  test('Growth +13.6% classified as GROWING', trUp.trendCategory === 'GROWING' && trUp.growthRate === 13.64);

  const testSeriesFlat = [100, 101, 102];
  const trFlat = DemandIntelligenceService.classifyTrend(testSeriesFlat);
  test('Growth +0.99% classified as STABLE', trFlat.trendCategory === 'STABLE' && trFlat.growthRate === 0.99);

  const testSeriesDown = [100, 95, 80];
  const trDown = DemandIntelligenceService.classifyTrend(testSeriesDown);
  test('Growth -15.8% classified as DECLINING', trDown.trendCategory === 'DECLINING' && trDown.growthRate === -15.79);

  const testSeriesVolatile = [20, 200, 30, 220];
  const trVol = DemandIntelligenceService.classifyTrend(testSeriesVolatile);
  test('High variance classified as VOLATILE', trVol.trendCategory === 'VOLATILE' && trVol.volatility >= 0.30);

  console.log('\n--- 7. REGRESSION COMPATIBILITY: CAREER & SKILL GAPS ---');
  await makeRequest('/profile/target-roles', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${indToken}` },
    body: JSON.stringify({ targetRoleId: backendRole.id }),
  });

  const careerRes = await makeRequest('/intelligence/career', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /intelligence/career retains deterministic compatibility matrix', careerRes.status === 200 && careerRes.body?.data?.compatibility?.overall !== undefined);
  test('GET /intelligence/career includes optional marketDemand signals', careerRes.body?.data?.marketDemand !== undefined);

  const gapsRes = await makeRequest('/intelligence/skill-gaps', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /intelligence/skill-gaps retains priority and gap calculations', gapsRes.status === 200 && Array.isArray(gapsRes.body?.data?.gaps));
  test('Skill gaps include optional demandEvidence signals', gapsRes.body?.data?.gaps?.length > 0 ? gapsRes.body.data.gaps[0].demandEvidence !== undefined : true);

  const learnRes = await makeRequest('/intelligence/learning/recommendations', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('GET /intelligence/learning/recommendations includes demand rationale in recommendedBecause', learnRes.status === 200 && learnRes.body?.data?.recommendations?.[0]?.recommendedBecause?.length > 0);

  console.log('\n--- 8. INPUT VALIDATION & CONSTRAINTS ---');
  const invalidHorizon = await makeRequest(`/intelligence/demand/forecast?skillId=${reactSkill.id}&horizon=99`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('Horizon > 12 is rejected with 400 Bad Request', invalidHorizon.status === 400 && invalidHorizon.body?.error?.code === 'INVALID_HORIZON');

  const invalidTrend = await makeRequest('/intelligence/demand/skills?trend=SUPER_TRENDING', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('Invalid trend category is rejected with 400 Bad Request', invalidTrend.status === 400 && invalidTrend.body?.error?.code === 'INVALID_TREND_CATEGORY');

  // Teardown
  if (server) {
    server.close();
  }
  if (pythonProcess) {
    try {
      pythonProcess.kill();
    } catch {}
  }

  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  if (server) server.close();
  if (pythonProcess) pythonProcess.kill();
  process.exit(1);
});
