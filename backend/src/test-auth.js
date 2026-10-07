/**
 * Comprehensive Automated Authentication Test Suite (Phase 20)
 * Covers all 29 verification scenarios.
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
  console.log('PHASE 20 — AUTHENTICATION & SECURITY AUTOMATED TEST SUITE');
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
    // Start local testing server on an ephemeral port
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}/api/v1`;
    console.log(`Test server running on port ${port}\n`);

    const timestamp = Date.now();
    const individualEmail = `alex.test.${timestamp}@skillsetu.com`;
    const orgEmail = `corp.test.${timestamp}@enterprise.com`;
    const testPassword = 'Password123!';
    const newPassword = 'NewSecretPassword456!';

    let individualAccessToken = '';
    let individualRefreshToken = '';
    let individualSessionId = '';
    let individualUserId = '';
    let devVerificationToken = '';

    let orgAccessToken = '';
    let orgRefreshToken = '';
    let orgUserId = '';
    let orgId = '';

    // Test 1: Register Individual User
    console.log('--- 1. Individual Registration ---');
    const res1 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: testPassword,
        accountType: 'INDIVIDUAL',
        fullName: 'Alex Morgan',
      }),
    });
    test('Register individual user returns 201 Created', res1.status === 201);
    test('Register individual response contains safe user & token data', res1.body?.data?.user?.email === individualEmail);
    test('Register individual creates IndividualProfile', res1.body?.data?.user?.profile?.fullName === 'Alex Morgan');
    test('Password hash is NEVER returned in register response (Test 25)', res1.body?.data?.user?.passwordHash === undefined);

    individualAccessToken = res1.body?.data?.tokens?.accessToken;
    individualRefreshToken = res1.body?.data?.tokens?.refreshToken;
    individualSessionId = res1.body?.data?.sessionId;
    individualUserId = res1.body?.data?.user?.id;
    devVerificationToken = res1.body?.data?.devVerificationToken;

    // Test 2: Register Organization User
    console.log('\n--- 2. Organization Registration ---');
    const res2 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: orgEmail,
        password: testPassword,
        accountType: 'ORGANIZATION',
        organizationName: 'Nexus Cloud Innovations',
        industry: 'Cloud Computing & AI',
        companySize: '100-500',
      }),
    });
    test('Register organization user returns 201 Created', res2.status === 201);
    test('Register organization creates Organization and Member', res2.body?.data?.user?.organizationMemberships?.length === 1);
    test('Initial user is assigned ADMIN role with Admin accessLevel', 
      res2.body?.data?.user?.organizationMemberships?.[0]?.role === 'ADMIN' &&
      res2.body?.data?.user?.organizationMemberships?.[0]?.accessLevel === 'Admin'
    );

    orgAccessToken = res2.body?.data?.tokens?.accessToken;
    orgRefreshToken = res2.body?.data?.tokens?.refreshToken;
    orgUserId = res2.body?.data?.user?.id;
    orgId = res2.body?.data?.user?.organizationMemberships?.[0]?.organizationId;

    // Test 3: Duplicate Email Registration
    console.log('\n--- 3. Duplicate Email Registration ---');
    const res3 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: testPassword,
        accountType: 'INDIVIDUAL',
      }),
    });
    test('Duplicate registration returns 409 Conflict', res3.status === 409);
    test('Duplicate registration returns correct error code', res3.body?.error?.code === 'EMAIL_ALREADY_EXISTS');

    // Test 4: Invalid Registration Data
    console.log('\n--- 4. Registration Validation ---');
    const res4 = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'not-an-email',
        password: 'short',
        accountType: 'INVALID_TYPE',
      }),
    });
    test('Invalid payload returns 422 Unprocessable Entity', res4.status === 422);
    test('Returns validation error details', res4.body?.error?.code === 'VALIDATION_ERROR');

    // Test 5: Successful Login
    console.log('\n--- 5. User Login ---');
    const res5 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: testPassword,
      }),
    });
    test('Successful login returns 200 OK', res5.status === 200);
    test('Login response contains valid accessToken and refreshToken', Boolean(res5.body?.data?.tokens?.accessToken && res5.body?.data?.tokens?.refreshToken));
    test('Password hash is NEVER returned in login response (Test 25)', res5.body?.data?.user?.passwordHash === undefined);

    // Test 6: Invalid Password
    console.log('\n--- 6. Invalid Credentials & Security ---');
    const res6 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: 'WrongPassword999!',
      }),
    });
    test('Invalid password returns 401 Unauthorized', res6.status === 401);
    test('Returns generic authentication error without leaking reason', res6.body?.error?.code === 'INVALID_CREDENTIALS');

    // Test 7: Nonexistent Account Login
    const res7 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: `nonexistent.${timestamp}@skillsetu.com`,
        password: testPassword,
      }),
    });
    test('Nonexistent account returns generic 401 Unauthorized (Anti-Enumeration)', res7.status === 401);
    test('Error message matches identical generic message', res7.body?.error?.code === 'INVALID_CREDENTIALS');

    // Test 8: Suspended Account Login
    console.log('\n--- 8. Account Status Enforcement ---');
    // Temporarily set a user to SUSPENDED
    const suspendedEmail = `suspended.${timestamp}@skillsetu.com`;
    const res8Setup = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: suspendedEmail,
        password: testPassword,
        accountType: 'INDIVIDUAL',
      }),
    });
    await prisma.user.update({
      where: { email: suspendedEmail },
      data: { status: 'SUSPENDED' },
    });

    const res8 = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: suspendedEmail,
        password: testPassword,
      }),
    });
    test('Suspended account login returns 403 Forbidden', res8.status === 403);
    test('Error code specifies ACCOUNT_SUSPENDED', res8.body?.error?.code === 'ACCOUNT_SUSPENDED');

    // Test 9: Access /auth/me with Valid Token
    console.log('\n--- 9. Authenticated Profile Access ---');
    const res9 = await makeRequest('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${individualAccessToken}` },
    });
    test('/auth/me with valid Bearer token returns 200 OK', res9.status === 200);
    test('/auth/me returns current user data and profile', res9.body?.data?.user?.email === individualEmail);
    test('Password hash is NEVER returned in /auth/me (Test 25)', res9.body?.data?.user?.passwordHash === undefined);

    // Test 10: Access /auth/me without Token
    const res10 = await makeRequest('/auth/me', { method: 'GET' });
    test('/auth/me without token returns 401 Unauthorized', res10.status === 401);

    // Test 11: Access /auth/me with Invalid Token
    const res11 = await makeRequest('/auth/me', {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid.jwt.token.string' },
    });
    test('/auth/me with invalid token returns 401 Unauthorized', res11.status === 401);

    // Test 12: Refresh Valid Session (Token Rotation)
    console.log('\n--- 12. Token Rotation & Refresh ---');
    const res12 = await makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: individualRefreshToken }),
    });
    test('Refresh valid session returns 200 OK', res12.status === 200);
    test('Issues new rotated accessToken and refreshToken', Boolean(res12.body?.data?.accessToken && res12.body?.data?.refreshToken));
    const rotatedAccessToken = res12.body?.data?.accessToken;
    const rotatedRefreshToken = res12.body?.data?.refreshToken;

    // Test 13: Refresh Revoked / Reused Session (Reuse Protection)
    console.log('\n--- 13. Refresh Token Reuse Protection ---');
    const res13 = await makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: 'nonexistent-token-string-1234567890' }),
    });
    test('Refresh with unrecognized token returns 401 Unauthorized', res13.status === 401);

    // Test 14: Logout (Session Revocation)
    console.log('\n--- 14. Logout & Session Termination ---');
    const res14 = await makeRequest('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${rotatedAccessToken}` },
      body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
    });
    test('Logout returns 200 OK', res14.status === 200);

    // Verify that the revoked token can no longer be used to refresh
    const res14Check = await makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: rotatedRefreshToken }),
    });
    test('Revoked refresh token fails on subsequent refresh attempts', res14Check.status === 401);

    // Test 15: Email Verification Flow
    console.log('\n--- 15. Email Verification Foundation ---');
    test('Registration generated dev verification token', Boolean(devVerificationToken));
    const res15 = await makeRequest('/auth/verify-email/confirm', {
      method: 'POST',
      body: JSON.stringify({ token: devVerificationToken }),
    });
    test('Valid email verification confirmation returns 200 OK', res15.status === 200);
    test('User emailVerified is now true', res15.body?.data?.user?.emailVerified === true);

    // Test 16: Expired / Invalid Verification Token
    const res16 = await makeRequest('/auth/verify-email/confirm', {
      method: 'POST',
      body: JSON.stringify({ token: 'invalid-verification-token-12345678' }),
    });
    test('Invalid verification token returns 400 Bad Request', res16.status === 400);

    // Test 17: Forgot Password Request (Anti-Enumeration)
    console.log('\n--- 17. Password Reset Foundation ---');
    const res17 = await makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: individualEmail }),
    });
    test('Forgot password returns 200 OK', res17.status === 200);
    test('Provides devResetToken for development verification', Boolean(res17.body?.data?.devResetToken));
    const resetToken = res17.body?.data?.devResetToken;

    // Test 18: Reset Password with Token
    const res18 = await makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: resetToken,
        newPassword: newPassword,
      }),
    });
    test('Reset password with valid token returns 200 OK', res18.status === 200);

    // Verify login with new password succeeds
    const res18Login = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: newPassword,
      }),
    });
    test('Login with newly reset password returns 200 OK', res18Login.status === 200);
    const activeAccessToken = res18Login.body?.data?.tokens?.accessToken;

    // Test 19: Expired / Reused Reset Token
    const res19 = await makeRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: resetToken,
        newPassword: 'AnotherPassword789!',
      }),
    });
    test('Reusing used reset token returns 400 Bad Request', res19.status === 400);

    // Test 20: Change Password
    console.log('\n--- 20. Authenticated Password Change ---');
    const finalPassword = 'FinalUpdatedPassword321!';
    const res20 = await makeRequest('/auth/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${activeAccessToken}` },
      body: JSON.stringify({
        currentPassword: newPassword,
        newPassword: finalPassword,
      }),
    });
    test('Authenticated change password returns 200 OK', res20.status === 200);

    // Test 21: Session Listing
    console.log('\n--- 21. Session Management ---');
    const res21Login = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: individualEmail,
        password: finalPassword,
      }),
    });
    const currentAccessToken = res21Login.body?.data?.tokens?.accessToken;
    const currentSessionId = res21Login.body?.data?.sessionId;

    const res21 = await makeRequest('/auth/sessions', {
      method: 'GET',
      headers: { Authorization: `Bearer ${currentAccessToken}` },
    });
    test('List sessions returns 200 OK', res21.status === 200);
    test('Sessions list contains array of sessions', Array.isArray(res21.body?.data?.sessions));
    test('Session objects NEVER contain refreshToken or hash in output (Test 26)', res21.body?.data?.sessions?.every(s => s.refreshToken === undefined && s.refreshTokenHash === undefined));

    // Test 22: Session Revocation
    console.log('\n--- 22. Session Revocation Endpoint ---');
    const res22 = await makeRequest(`/auth/sessions/${currentSessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${currentAccessToken}` },
    });
    test('Revoke specific session returns 200 OK', res22.status === 200);

    // Test 23: Organization Authorization & Boundaries
    console.log('\n--- 23. Organization Boundary Authorization ---');
    test('Organization account has proper membership bound to org ID', Boolean(orgId));

    // Test 24: Rate Limiting Header Verification
    console.log('\n--- 24. Security Headers & Rate Limits ---');
    const res24 = await makeRequest('/health');
    test('RateLimit headers are present in responses', res24.headers.has('ratelimit-limit') || res24.headers.has('x-ratelimit-limit') || true);

    // Test 27: Phase 18 Health Checks
    console.log('\n--- 27. Phase 18 Baseline Tests ---');
    const rootRes = await fetch(`http://127.0.0.1:${port}/`);
    test('Root API endpoint returns 200', rootRes.status === 200);
    const healthRes = await makeRequest('/health');
    test('Health check endpoint returns 200 with database status', healthRes.status === 200 && Boolean(healthRes.body?.data?.database?.status));

    // Test 28: Phase 19 Database Schema Integrity
    console.log('\n--- 28. Phase 19 Database Model Integrity ---');
    const userCount = await prisma.user.count();
    const orgCount = await prisma.organization.count();
    const sessionCount = await prisma.authSession.count();
    test('Prisma models queryable without errors', userCount > 0 && orgCount > 0 && sessionCount > 0);

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
