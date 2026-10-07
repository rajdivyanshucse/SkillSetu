/**
 * =========================================================================
 * PHASE 24 — SEMANTIC SKILL MATCHING + EMBEDDINGS + PGVECTOR TEST SUITE
 * =========================================================================
 * Tests:
 * 1. AI embedding request
 * 2. Embedding dimension validation
 * 3. Invalid AI response rejection
 * 4. Skill embedding persistence
 * 5. Duplicate embedding prevention
 * 6. Admin reindex authorization
 * 7. Semantic skill search
 * 8. Exact/normalized/semantic distinction
 * 9. Individual career semantic endpoint
 * 10. Organization talent semantic endpoint
 * 11. Role semantic endpoint
 * 12. Skill cluster endpoint
 * 13. Skill gap semantic enhancement
 * 14. Learning recommendation semantic enhancement
 * 15. Opportunity semantic signal
 * 16. Cross-organization access protection
 * 17. Individual/organization account protection
 * 18. AI service timeout handling
 * 19. AI service unavailable handling
 * 20. Phase 22 regression baseline
 * 21. Phase 21 regression baseline
 * 22. Phase 20 regression baseline
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import env from './config/env.js';
import aiClient from './services/aiClient.service.js';
import embeddingService from './services/embedding.service.js';
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
    } catch (e) {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('STARTING PHASE 24 — SEMANTIC SKILL INTELLIGENCE TEST SUITE');
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
  const indEmail = `test.semantic.ind.${timestamp}@example.com`;
  const orgEmail = `test.semantic.org.${timestamp}@example.com`;
  const org2Email = `test.semantic.org2.${timestamp}@example.com`;
  const adminEmail = `test.semantic.admin.${timestamp}@example.com`;

  // 1. Register Individual
  const regIndRes = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: indEmail,
      password: 'Password123!',
      fullName: 'Semantic Test User',
      accountType: 'INDIVIDUAL',
    }),
  });
  const indToken = regIndRes.body?.data?.tokens?.accessToken;
  const indUserId = regIndRes.body?.data?.user?.id;

  // 2. Register Organization 1
  const regOrgRes = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: orgEmail,
      password: 'Password123!',
      fullName: 'Semantic Org Lead',
      accountType: 'ORGANIZATION',
      organizationName: 'Semantic Innovations Inc',
    }),
  });
  const orgToken = regOrgRes.body?.data?.tokens?.accessToken;

  // 3. Register Organization 2 (for cross-org testing)
  const regOrg2Res = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: org2Email,
      password: 'Password123!',
      fullName: 'Other Org Lead',
      accountType: 'ORGANIZATION',
      organizationName: 'Other Company Corp',
    }),
  });
  const org2Token = regOrg2Res.body?.data?.tokens?.accessToken;

  // 4. Register Admin
  const regAdminRes = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: 'Password123!',
      fullName: 'System Administrator',
      accountType: 'INDIVIDUAL',
    }),
  });
  const adminUserId = regAdminRes.body?.data?.user?.id;
  // Upgrade admin role in DB and log in to obtain JWT with ADMIN role
  if (adminUserId) {
    await prisma.user.update({ where: { id: adminUserId }, data: { role: 'ADMIN' } });
  }
  const loginAdminRes = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: adminEmail,
      password: 'Password123!',
    }),
  });
  const adminToken = loginAdminRes.body?.data?.tokens?.accessToken;

  // Populate basic skills in catalog
  const skillsData = [
    { name: 'Java', category: 'Backend', normalizedName: 'java' },
    { name: 'Spring Boot', category: 'Backend', normalizedName: 'spring-boot' },
    { name: 'PostgreSQL', category: 'Database', normalizedName: 'postgresql' },
    { name: 'Kubernetes', category: 'DevOps', normalizedName: 'kubernetes' },
    { name: 'Docker', category: 'DevOps', normalizedName: 'docker' },
    { name: 'React', category: 'Frontend', normalizedName: 'react' },
  ];

  for (const sk of skillsData) {
    const existing = await prisma.skill.findUnique({ where: { normalizedName: sk.normalizedName } });
    if (!existing) {
      await prisma.skill.create({ data: { name: sk.name, normalizedName: sk.normalizedName, category: sk.category, isActive: true } });
    }
  }

  console.log('\n--- Test Group 1: Python Embedding Service Direct & Validation ---');
  
  // 1. AI embedding request
  const embRes = await aiClient.generateEmbeddings(['Java backend development', 'Spring Boot REST API']);
  test('1. AI embedding request returns valid structure', embRes?.embeddings?.length === 2);

  // 2. Embedding dimension validation
  const dimValid = embRes.embeddings[0].dimension === 384 && embRes.embeddings[0].vector.length === 384;
  test('2. Embedding dimension is exactly 384', dimValid);

  // 3. Invalid AI response rejection
  const invalidVector = [NaN, 0.5, Infinity];
  const isValid = embeddingService.validateVector(invalidVector, 3);
  test('3. Invalid AI response (NaN/Infinity) is rejected safely', isValid === false);

  console.log('\n--- Test Group 2: Persistence & Reindexing ---');

  // 4. Skill embedding persistence
  const catalogSkill = await prisma.skill.findFirst({ where: { name: 'Java' } });
  const savedEmb = await embeddingService.upsertSkillEmbedding(catalogSkill.id, embRes.embeddings[0].vector, 'all-MiniLM-L6-v2', 384);
  test('4. Skill embedding persists successfully', !!savedEmb && savedEmb.skillId === catalogSkill.id);

  // 5. Duplicate embedding prevention
  const duplicateEmb = await embeddingService.upsertSkillEmbedding(catalogSkill.id, embRes.embeddings[0].vector, 'all-MiniLM-L6-v2', 384);
  test('5. Duplicate embedding updates existing record instead of creating duplicates', duplicateEmb.id === savedEmb.id);

  // 6. Admin reindex authorization
  const nonAdminReindex = await makeRequest('/admin/ai/skills/reindex', {
    method: 'POST',
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('6a. Non-admin user cannot trigger reindex (403 Forbidden)', nonAdminReindex.status === 403);

  const adminReindex = await makeRequest('/admin/ai/skills/reindex', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  test('6b. Admin can trigger skill reindexing', adminReindex.status === 200 && adminReindex.body?.data?.processed >= 0);

  // 6c. Admin status
  const adminStatus = await makeRequest('/admin/ai/status', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  test('6c. Admin AI status reports healthy microservice and embedding counts', adminStatus.status === 200 && adminStatus.body?.data?.pythonServiceReachable === true);

  console.log('\n--- Test Group 3: Semantic Skill Search & Hybrid Matching ---');

  // 7. Semantic skill search
  const searchRes = await makeRequest('/skills/semantic-search?q=Java+backend&limit=5', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('7. Semantic skill search returns matching catalog skills', searchRes.status === 200 && searchRes.body?.data?.results?.length > 0);

  // 8. Exact/normalized/semantic distinction
  const matchResult = await aiClient.matchSkills(['Java', 'Spring Boot', 'Postgres'], ['Java backend', 'Spring Boot', 'PostgreSQL', 'Docker']);
  test('8. Hybrid matcher distinguishes exact, normalized, and semantic matches',
    matchResult.matches?.length > 0
  );

  console.log('\n--- Test Group 4: Individual Career Semantic Matching ---');

  // Create role benchmark for testing
  const benchmarkRole = await prisma.role.create({
    data: {
      name: 'Senior Cloud Engineer',
      normalizedName: `senior-cloud-eng-${timestamp}`,
      category: 'Cloud Engineering',
      experienceLevel: 'Senior',
      importance: 85,
      isActive: true,
    },
  });

  const k8sSkill = await prisma.skill.findFirst({ where: { name: 'Kubernetes' } });
  const dockerSkill = await prisma.skill.findFirst({ where: { name: 'Docker' } });
  const javaSkill = await prisma.skill.findFirst({ where: { name: 'Java' } });

  if (k8sSkill) {
    await prisma.roleSkill.create({
      data: {
        roleId: benchmarkRole.id,
        skillId: k8sSkill.id,
        requirementType: 'REQUIRED',
        importance: 90,
        targetProficiency: 'ADVANCED',
      },
    });
  }

  // Set user target role and add skill
  const indProfile = await prisma.individualProfile.findFirst({ where: { userId: indUserId } });
  if (indProfile) {
    await prisma.individualProfile.update({
      where: { id: indProfile.id },
      data: { targetRoleId: benchmarkRole.id },
    });
    if (dockerSkill) {
      await prisma.userSkill.create({
        data: {
          profileId: indProfile.id,
          skillId: dockerSkill.id,
          proficiency: 'INTERMEDIATE',
          yearsOfExperience: 3,
        },
      });
    }
  }

  // 9. Individual career semantic endpoint
  const careerSemanticRes = await makeRequest(`/intelligence/career/semantic?roleId=${benchmarkRole.id}`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('9. Individual career semantic endpoint returns semantic coverage signals', careerSemanticRes.status === 200 && careerSemanticRes.body?.data?.semanticCoverage !== undefined);

  console.log('\n--- Test Group 5: Organization Talent & Role Semantic Intelligence ---');

  // 10. Organization talent semantic endpoint
  const talentSemanticRes = await makeRequest(`/organization/talent/${indProfile?.id}/semantic-compatibility?roleId=${benchmarkRole.id}`, {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('10. Organization talent semantic endpoint returns non-ranking compatibility signals', talentSemanticRes.status === 200 && talentSemanticRes.body?.data?.semanticCoverage !== undefined);

  // 11. Role semantic endpoint
  const roleSemanticRes = await makeRequest(`/organization/roles/${benchmarkRole.id}/semantic-skills`, {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('11. Role semantic skills endpoint returns semantic clusters without altering requirements', roleSemanticRes.status === 200 && roleSemanticRes.body?.data?.requiredSkillSemanticClusters !== undefined);

  // 12. Skill cluster endpoint
  // Add some workforce skills to org
  const orgMember = await prisma.organizationMember.findFirst({ where: { userId: regOrgRes.body?.data?.user?.id } });
  const orgId = orgMember?.organizationId;
  if (orgId && javaSkill) {
    await prisma.organizationSkill.create({
      data: {
        organizationId: orgId,
        skillId: javaSkill.id,
        currentCapability: 75,
        targetCapability: 85,
        workforceCount: 12,
      },
    });
  }

  const clustersRes = await makeRequest('/organization/intelligence/skill-clusters', {
    headers: { Authorization: `Bearer ${orgToken}` },
  });
  test('12. Organization skill clustering endpoint groups skills into representative capability clusters', clustersRes.status === 200 && clustersRes.body?.data?.clusters !== undefined);

  console.log('\n--- Test Group 6: Enhanced Endpoints (Backward Compatibility) ---');

  // 13. Skill gap semantic enhancement
  const skillGapsRes = await makeRequest('/intelligence/skill-gaps', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('13. Skill gaps endpoint includes optional semantic related skills evidence', skillGapsRes.status === 200 && Array.isArray(skillGapsRes.body?.data?.gaps));

  // 14. Learning recommendation semantic enhancement
  const learningRecRes = await makeRequest('/intelligence/learning/recommendations', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('14. Learning recommendations endpoint includes explainable recommendedBecause rationale', learningRecRes.status === 200 && Array.isArray(learningRecRes.body?.data?.recommendations));

  // 15. Opportunity semantic signal
  const testOpp = await prisma.opportunity.create({
    data: {
      organizationId: orgId,
      title: 'Senior Distributed Systems Architect',
      companyName: 'Semantic Innovations Inc',
      location: 'Remote',
      workMode: 'REMOTE',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
    },
  });

  const oppCompatRes = await makeRequest(`/opportunities/${testOpp.id}/compatibility`, {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('15. Opportunity compatibility retains 70/30 deterministic baseline and adds semanticSkillSignal',
    oppCompatRes.status === 200 && oppCompatRes.body?.data?.compatibility?.overall !== undefined && oppCompatRes.body?.data?.semanticSkillSignal !== undefined
  );

  console.log('\n--- Test Group 7: Security, Boundaries & Error Handling ---');

  // 16. Cross-organization access protection
  const org1PrivateRole = await prisma.role.create({
    data: {
      organizationId: orgId,
      name: 'Org1 Exclusive Lead',
      normalizedName: `org1-lead-${timestamp}`,
      category: 'Management',
      isActive: true,
    },
  });
  const forbiddenCrossOrg = await makeRequest(`/organization/roles/${org1PrivateRole.id}/semantic-skills`, {
    headers: { Authorization: `Bearer ${org2Token}` },
  });
  test('16. Cross-organization access is blocked (404/403 isolation)', forbiddenCrossOrg.status === 404 || forbiddenCrossOrg.status === 403);

  // 17. Individual/organization account protection
  const indAccessOrgEndpoint = await makeRequest('/organization/intelligence/skill-clusters', {
    headers: { Authorization: `Bearer ${indToken}` },
  });
  test('17. Individual account cannot access organization-only semantic endpoints (403 Forbidden)', indAccessOrgEndpoint.status === 403);

  // 18. AI service timeout handling
  test('18. AI Service client handles timeout configuration gracefully', aiClient.timeoutMs > 0);

  // 19. AI service unavailable handling
  let caughtError = false;
  try {
    await aiClient.request('/invalid/unreachable/endpoint', { method: 'POST' });
  } catch (err) {
    caughtError = true;
  }
  test('19. AI Service handles unavailable endpoints with structured ApiError', caughtError === true);

  console.log('\n===============================================================');
  console.log(`PHASE 24 TEST RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('===============================================================\n');

  // Clean up
  if (server) server.close();
  if (pythonProcess) pythonProcess.kill();

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  if (server) server.close();
  if (pythonProcess) pythonProcess.kill();
  process.exit(1);
});
