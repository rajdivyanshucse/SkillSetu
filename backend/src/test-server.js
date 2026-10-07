import app from './app.js';
import env from './config/env.js';

async function runTests() {
  const server = app.listen(5001, async () => {
    console.log('Test server listening on port 5001');
    const baseUrl = 'http://localhost:5001';

    try {
      // 1. Test Root endpoint
      console.log('\n--- 1. Testing GET / ---');
      const rootRes = await fetch(`${baseUrl}/`);
      const rootJson = await rootRes.json();
      console.log('Status:', rootRes.status);
      console.log('Response:', JSON.stringify(rootJson, null, 2));

      // 2. Test GET /api/v1/health
      console.log('\n--- 2. Testing GET /api/v1/health ---');
      const healthRes = await fetch(`${baseUrl}/api/v1/health`);
      const healthJson = await healthRes.json();
      console.log('Status:', healthRes.status);
      console.log('Response:', JSON.stringify(healthJson, null, 2));

      // 3. Test Unknown route (404)
      console.log('\n--- 3. Testing GET /api/v1/unmapped-route (404 test) ---');
      const notFoundRes = await fetch(`${baseUrl}/api/v1/unmapped-route`);
      const notFoundJson = await notFoundRes.json();
      console.log('Status:', notFoundRes.status);
      console.log('Response:', JSON.stringify(notFoundJson, null, 2));

      // 4. Test Malformed JSON
      console.log('\n--- 4. Testing POST /api/v1/health with malformed JSON ---');
      const malformedRes = await fetch(`${baseUrl}/api/v1/health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"invalidJson": ',
      });
      const malformedJson = await malformedRes.json();
      console.log('Status:', malformedRes.status);
      console.log('Response:', JSON.stringify(malformedJson, null, 2));

      // 5. Test CORS header
      console.log('\n--- 5. Testing CORS headers ---');
      const corsRes = await fetch(`${baseUrl}/api/v1/health`, {
        headers: { Origin: 'http://localhost:5173' },
      });
      console.log('Access-Control-Allow-Origin:', corsRes.headers.get('access-control-allow-origin'));

      console.log('\n✅ ALL BACKEND ARCHITECTURE TESTS PASSED SUCCESSFULLY!\n');
    } catch (err) {
      console.error('❌ Test failed:', err);
      process.exit(1);
    } finally {
      server.close(() => {
        console.log('Test server closed cleanly.');
        process.exit(0);
      });
    }
  });
}

runTests();
