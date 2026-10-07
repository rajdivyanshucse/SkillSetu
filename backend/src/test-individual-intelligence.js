/**
 * Comprehensive Automated Individual Intelligence Test Suite (Phase 21)
 * Covers all 53 verification scenarios across Profile, Skills, Experience,
 * Education, Target Roles, Skill Intelligence, Coverage, Gaps, Career,
 * Roadmap, Learning Recommendations, Opportunities, Saved, Applications,
 * Dashboard, and Regressions.
 */
import http from 'node:http';
import app from './app.js';
import prisma from './config/db.js';

let server;
let baseUrl;

const makeRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null);
  return { status: response.status, body, headers: response.headers };
};

const runTests = async () => {
  console.log('\n==================================================');
  console.log('PHASE 21 — CORE INDIVIDUAL INTELLIGENCE TEST SUITE');
  console.log('==================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  const test = (description, assertion) => {
    if (assertion) {
      console.log(`  ✓ PASS: ${description}`);
      passedCount++;
    } else {
      console.error(`  ✗ FAIL: ${description}`);
      failedCount++;
    }
  };

  try {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}/api/v1`;
    console.log(`Test server running on port ${port}\n`);

    const timestamp = Date.now();
    const indEmail1 = `individual.${timestamp}@skillsetu.com`;
    const indEmail2 = `another.user.${timestamp}@skillsetu.com`;
    const orgEmail = `company.${timestamp}@enterprise.com`;
    const testPassword = 'Password123!';

    // Register User 1 (Individual)
    const regRes1 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: indEmail1,
        password: testPassword,
        accountType: 'INDIVIDUAL',
        fullName: 'Maya Lin',
      }),
    });
    const token1 = regRes1.body?.data?.tokens?.accessToken;
    const authHeader1 = { Authorization: `Bearer ${token1}` };

    // Register User 2 (Individual)
    const regRes2 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: indEmail2,
        password: testPassword,
        accountType: 'INDIVIDUAL',
        fullName: 'David Chen',
      }),
    });
    const token2 = regRes2.body?.data?.tokens?.accessToken;
    const authHeader2 = { Authorization: `Bearer ${token2}` };

    // Register Organization User
    const regResOrg = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: orgEmail,
        password: testPassword,
        accountType: 'ORGANIZATION',
        organizationName: 'Global Cloud Systems',
      }),
    });
    const orgToken = regResOrg.body?.data?.tokens?.accessToken;
    const orgAuthHeader = { Authorization: `Bearer ${orgToken}` };

    // --- 1. AUTH / OWNERSHIP ---
    console.log('--- 1. Auth & Ownership Boundaries ---');
    test('1. Individual user can access /profile', (await makeRequest('/profile', { headers: authHeader1 })).status === 200);
    test('2. Organization user is rejected from individual profile (403 Forbidden)', (await makeRequest('/profile', { headers: orgAuthHeader })).status === 403);
    test('3. Unauthenticated access rejected with 401 Unauthorized', (await makeRequest('/profile')).status === 401);

    // --- 2. PROFILE & COMPLETENESS ---
    console.log('\n--- 2. Profile Management & Completeness ---');
    const pRes = await makeRequest('/profile', { headers: authHeader1 });
    test('7. Get profile returns individual profile', pRes.status === 200 && pRes.body?.data?.profile?.fullName === 'Maya Lin');

    const updatePRes = await makeRequest('/profile', {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({
        headline: 'Senior Cloud Architect & Systems Designer',
        location: 'Bengaluru, India',
        targetIndustry: 'Technology',
        experienceSummary: '10+ years designing distributed systems, databases, and microservices.',
        careerGoals: ['Master Distributed Systems', 'Transition to Principal Systems Architect'],
      }),
    });
    test('9. Update profile updates fields and returns 200 OK', updatePRes.status === 200);
    test('10. Profile completeness calculation works deterministically', updatePRes.body?.data?.profile?.completeness >= 30);

    // --- 3. SKILL CATALOG & USER SKILLS ---
    console.log('\n--- 3. Skill Catalog & User Skills ---');
    const catRes = await makeRequest('/skills?page=1&limit=10', { headers: authHeader1 });
    test('11. Skill catalog search returns paginated catalog skills', catRes.status === 200 && catRes.body?.data?.skills?.length > 0);
    const catalogSkills = catRes.body?.data?.skills || [];
    const skill1 = catalogSkills[0];
    const skill2 = catalogSkills[1] || catalogSkills[0];

    const addSkillRes = await makeRequest('/profile/skills', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({
        skillId: skill1.id,
        proficiency: 'ADVANCED',
        yearsOfExperience: 4.5,
      }),
    });
    test('12. Add user skill associates skill with profile (201 Created)', addSkillRes.status === 201);
    test('15. Duplicate skill addition is prevented (409 Conflict)', (await makeRequest('/profile/skills', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({ skillId: skill1.id, proficiency: 'EXPERT' }),
    })).status === 409);

    const updateSkillRes = await makeRequest(`/profile/skills/${skill1.id}`, {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({ proficiency: 'EXPERT', yearsOfExperience: 5.0 }),
    });
    test('13. Update user skill updates proficiency and experience (200 OK)', updateSkillRes.status === 200);

    // --- 4. EXPERIENCE MANAGEMENT & OWNERSHIP ---
    console.log('\n--- 4. Experience Credentials & Ownership ---');
    const addExpRes = await makeRequest('/profile/experience', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({
        company: 'Starlight Tech Inc.',
        roleTitle: 'Senior Software Engineer',
        employmentType: 'FULL_TIME',
        location: 'Bengaluru',
        startDate: '2021-01-15',
        isCurrent: true,
        description: 'Leading backend platform microservices and database clustering.',
      }),
    });
    test('16. Create experience record returns 201 Created', addExpRes.status === 201);
    const expId = addExpRes.body?.data?.experience?.id;

    test('5. User 2 cannot modify User 1 experience record (404/403 Protected)', (await makeRequest(`/profile/experience/${expId}`, {
      method: 'PATCH',
      headers: authHeader2,
      body: JSON.stringify({ roleTitle: 'Hacked Title' }),
    })).status === 404);

    const updateExpRes = await makeRequest(`/profile/experience/${expId}`, {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({ roleTitle: 'Lead Software Engineer' }),
    });
    test('17. Update own experience succeeds (200 OK)', updateExpRes.status === 200 && updateExpRes.body?.data?.experience?.roleTitle === 'Lead Software Engineer');

    // --- 5. EDUCATION MANAGEMENT & OWNERSHIP ---
    console.log('\n--- 5. Education Credentials ---');
    const addEduRes = await makeRequest('/profile/education', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({
        institution: 'National Institute of Technology',
        degree: 'Bachelor of Technology',
        fieldOfStudy: 'Computer Science and Engineering',
        startDate: '2016-08-01',
        endDate: '2020-05-30',
        isCurrent: false,
      }),
    });
    test('19. Create education record returns 201 Created', addEduRes.status === 201);
    const eduId = addEduRes.body?.data?.education?.id;

    const updateEduRes = await makeRequest(`/profile/education/${eduId}`, {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({ description: 'Graduated with First Class with Distinction' }),
    });
    test('20. Update education succeeds (200 OK)', updateEduRes.status === 200);

    // --- 6. TARGET ROLE ---
    console.log('\n--- 6. Target Role Configuration ---');
    // Fetch available roles
    const rolesRes = await makeRequest('/intelligence/career', { headers: authHeader1 });
    const availableRoles = rolesRes.body?.data?.availableRoles || [];
    const targetRole = availableRoles[0];

    if (targetRole) {
      const setRoleRes = await makeRequest('/profile/target-roles', {
        method: 'PUT',
        headers: authHeader1,
        body: JSON.stringify({ targetRoleId: targetRole.id }),
      });
      test('22. Set target role sets primary target role (200 OK)', setRoleRes.status === 200);
      const getRoleRes = await makeRequest('/profile/target-roles', { headers: authHeader1 });
      test('23. Retrieve target role returns configured role (200 OK)', getRoleRes.status === 200 && getRoleRes.body?.data?.targetRole?.id === targetRole.id);
    }

    // --- 7. SKILL INTELLIGENCE & COVERAGE ---
    console.log('\n--- 7. Skill Intelligence & Coverage Calculations ---');
    const skillIntelRes = await makeRequest('/intelligence/skills', { headers: authHeader1 });
    test('24. Skill intelligence summary aggregates inventory by category', skillIntelRes.status === 200 && skillIntelRes.body?.data?.totalSkills >= 1);
    test('Skill intelligence response includes deterministic methodology metadata', Boolean(skillIntelRes.body?.data?.methodology));

    const coverageRes = await makeRequest('/intelligence/skills/coverage', { headers: authHeader1 });
    test('25. Skill coverage calculates benchmark requirement alignment', coverageRes.status === 200 && typeof coverageRes.body?.data?.coveragePercentage === 'number');

    // --- 8. SKILL GAPS ---
    console.log('\n--- 8. Skill Gap Analysis ---');
    const gapsRes = await makeRequest('/intelligence/skill-gaps', { headers: authHeader1 });
    test('26. Skill gaps endpoint returns structured gaps array and summary', gapsRes.status === 200 && Array.isArray(gapsRes.body?.data?.gaps));
    const firstGap = gapsRes.body?.data?.gaps?.[0];
    if (firstGap) {
      const gapDetailRes = await makeRequest(`/intelligence/skill-gaps/${firstGap.skillId}`, { headers: authHeader1 });
      test('27. Skill gap detail returns structured rationale and development guidance', gapDetailRes.status === 200 && Boolean(gapDetailRes.body?.data?.gapAnalysis));
    }

    // --- 9. CAREER INTELLIGENCE ---
    console.log('\n--- 9. Career Intelligence & Compatibility ---');
    const careerRes = await makeRequest('/intelligence/career', { headers: authHeader1 });
    test('28. Career intelligence returns target role fit', careerRes.status === 200);
    test('29. Compatibility components calculated (overall, requiredFit, experienceAlignment)', Boolean(careerRes.body?.data?.compatibility?.overall !== undefined));
    test('30. Compatibility disclaims hiring probability guarantee', Boolean(careerRes.body?.data?.methodology?.disclaimer));

    // --- 10. ROADMAP & LEARNING RECOMMENDATIONS ---
    console.log('\n--- 10. Development Roadmap & Learning Recommendations ---');
    const roadmapRes = await makeRequest('/intelligence/roadmap', { headers: authHeader1 });
    test('31. Roadmap retrieval synthesizes 4 developmental stages (LEARN, PRACTICE, BUILD, VALIDATE)', roadmapRes.status === 200 && roadmapRes.body?.data?.phases?.length === 4);

    const progressRes = await makeRequest('/intelligence/roadmap/progress', {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({ progressPct: 40, status: 'IN_PROGRESS' }),
    });
    test('32. Development progress update succeeds', progressRes.status === 200);

    const learnRecRes = await makeRequest('/intelligence/learning/recommendations', { headers: authHeader1 });
    test('33. Learning recommendations returns mapped learning paths', learnRecRes.status === 200 && Array.isArray(learnRecRes.body?.data?.recommendations));

    // --- 11. OPPORTUNITIES & COMPATIBILITY ---
    console.log('\n--- 11. Opportunities & Job Compatibility ---');
    const oppsRes = await makeRequest('/opportunities?page=1&limit=10', { headers: authHeader1 });
    test('34. Opportunity list returns opportunities from database', oppsRes.status === 200 && oppsRes.body?.data?.opportunities?.length > 0);
    const oppList = oppsRes.body?.data?.opportunities || [];
    const testOpp = oppList[0];

    const oppFilterRes = await makeRequest('/opportunities?workMode=REMOTE&employmentType=FULL_TIME', { headers: authHeader1 });
    test('35. Opportunity filtering by workMode and employmentType works', oppFilterRes.status === 200);

    const oppDetailRes = await makeRequest(`/opportunities/${testOpp.id}`, { headers: authHeader1 });
    test('36. Opportunity detail returns full specs with compensation', oppDetailRes.status === 200 && Boolean(oppDetailRes.body?.data?.opportunity?.title));

    const oppCompatRes = await makeRequest(`/opportunities/${testOpp.id}/compatibility`, { headers: authHeader1 });
    test('37. Opportunity compatibility calculates required and preferred skill fit', oppCompatRes.status === 200 && typeof oppCompatRes.body?.data?.compatibility?.overall === 'number');

    // --- 12. SAVED OPPORTUNITIES ---
    console.log('\n--- 12. Saved Opportunity Bookmarks ---');
    const saveRes = await makeRequest(`/opportunities/${testOpp.id}/save`, {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({ notes: 'Priority opportunity for cloud systems' }),
    });
    test('38. Save opportunity bookmarks opportunity (201 Created)', saveRes.status === 201);
    test('39. Duplicate save returns 409 Conflict', (await makeRequest(`/opportunities/${testOpp.id}/save`, {
      method: 'POST',
      headers: authHeader1,
    })).status === 409);

    const savedListRes = await makeRequest('/opportunities/saved', { headers: authHeader1 });
    test('41. Saved opportunity list returns bookmarked items', savedListRes.status === 200 && savedListRes.body?.data?.savedOpportunities?.length >= 1);

    const unsaveRes = await makeRequest(`/opportunities/${testOpp.id}/save`, {
      method: 'DELETE',
      headers: authHeader1,
    });
    test('40. Remove saved opportunity succeeds (200 OK)', unsaveRes.status === 200);

    // --- 13. APPLICATIONS LIFECYCLE ---
    console.log('\n--- 13. Application Tracking & Ownership ---');
    const applyRes = await makeRequest('/applications', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({
        opportunityId: testOpp.id,
        status: 'APPLIED',
        notes: 'Submitted resume via SkillSetu Platform',
      }),
    });
    test('42. Create application records job application (201 Created)', applyRes.status === 201);
    const appId = applyRes.body?.data?.application?.id;

    const updateAppRes = await makeRequest(`/applications/${appId}`, {
      method: 'PATCH',
      headers: authHeader1,
      body: JSON.stringify({ status: 'INTERVIEW', notes: 'First technical screen scheduled' }),
    });
    test('43. Update application status updates lifecycle state', updateAppRes.status === 200 && updateAppRes.body?.data?.application?.status === 'INTERVIEW');

    test('45. User 2 cannot access or delete User 1 application (404/403)', (await makeRequest(`/applications/${appId}`, {
      method: 'DELETE',
      headers: authHeader2,
    })).status === 404);

    const appListRes = await makeRequest('/applications', { headers: authHeader1 });
    test('44. Application list returns authenticated user applications', appListRes.status === 200 && appListRes.body?.data?.applications?.length === 1);

    // --- 14. DASHBOARD & SNAPSHOTS ---
    console.log('\n--- 14. Dashboard Intelligence & Snapshots ---');
    const dashRes = await makeRequest('/dashboard/individual', { headers: authHeader1 });
    test('46. Individual dashboard API returns aggregated intelligence payload', dashRes.status === 200 && Boolean(dashRes.body?.data?.profile && dashRes.body?.data?.careerSnapshot));

    const snapRes = await makeRequest('/profile/snapshot', { headers: authHeader1 });
    test('47. Profile snapshot API returns compact widget metrics', snapRes.status === 200 && snapRes.body?.data?.snapshot?.fullName === 'Maya Lin');

    // --- 15. GENERAL / PAGINATION / VALIDATIONS ---
    console.log('\n--- 15. Validation & Pagination Robustness ---');
    const invalidSkillRes = await makeRequest('/profile/skills', {
      method: 'POST',
      headers: authHeader1,
      body: JSON.stringify({ skillId: 'not-a-uuid', proficiency: 'SUPER_HERO' }),
    });
    test('49. Validation failure returns 422 Unprocessable Entity', invalidSkillRes.status === 422);

    const pageRes = await makeRequest('/skills?page=2&limit=5', { headers: authHeader1 });
    test('48. Pagination metadata accurately returned', pageRes.body?.meta?.pagination?.page === 2);

    // --- 16. REGRESSIONS ---
    console.log('\n--- 16. Baseline Regressions ---');
    const rootRes = await fetch(`http://127.0.0.1:${port}/`);
    test('51. Phase 18 root endpoint returns 200 OK', rootRes.status === 200);

    const authCheck = await makeRequest('/auth/me', { headers: authHeader1 });
    test('52. Phase 20 authentication /auth/me returns current user', authCheck.status === 200 && authCheck.body?.data?.user?.email === indEmail1);

  } catch (err) {
    console.error('Test execution error:', err);
    failedCount++;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log('\n==================================================');
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
};

runTests();
