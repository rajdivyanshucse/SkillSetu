import http from 'node:http';
import app from './app.js';
import prisma from './config/db.js';
import { sourceRegistryService, SOURCE_CATEGORIES, DATASET_VERSION_STATUS } from './services/ingestion/sourceRegistry.service.js';
import { normalizationService, MATCH_METHOD, NORMALIZATION_STATUS } from './services/ingestion/normalization.service.js';
import { validationService, QUARANTINE_REASONS } from './services/ingestion/validation.service.js';
import { deduplicationService } from './services/ingestion/deduplication.service.js';
import { qualityService } from './services/ingestion/quality.service.js';
import { quarantineService, QUARANTINE_STATUS } from './services/ingestion/quarantine.service.js';
import { provenanceService, PROVENANCE_SOURCE_TYPES } from './services/ingestion/provenance.service.js';
import { importService } from './services/ingestion/import.service.js';
import { ingestionService } from './services/ingestion/ingestion.service.js';
import metricsService from './services/metrics.service.js';
import jobService from './services/job.service.js';

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
  console.log('================================================================');
  console.log('STARTING PHASE 28 — DATA INGESTION & DATA QUALITY PIPELINE TESTS');
  console.log('================================================================\n');

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
    const rand = Math.floor(Math.random() * 1000000);
    const adminEmail = `admin_ingestion_${rand}@example.com`;
    const userEmail = `user_ingestion_${rand}@example.com`;
    const password = 'Password123!';

    // Register admin account
    const adminReg = await makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password,
        accountType: 'INDIVIDUAL',
        fullName: 'System Admin',
      }),
    });

    const adminUserId = adminReg.data?.data?.user?.id;
    if (adminUserId) {
      await prisma.user.update({
        where: { id: adminUserId },
        data: { role: 'ADMIN' },
      });
    }

    const adminLogin = await makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        password,
      }),
    });

    const adminToken = adminLogin.data?.data?.tokens?.accessToken;

    // Register user account
    const userReg = await makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userEmail,
        password,
        accountType: 'INDIVIDUAL',
        fullName: 'John Dev',
      }),
    });

    const userToken = userReg.data?.data?.tokens?.accessToken;

    assert(Boolean(adminToken && userToken), 'Admin and user authentication tokens generated');

    // -------------------------------------------------------------
    // Test 1: Data Source Creation
    // -------------------------------------------------------------
    console.log('\n2. Testing Data Source Creation & Registry...');
    const testSourceName = `Naukri-Job-Feed-${Date.now()}`;
    const source = await sourceRegistryService.registerSource({
      name: testSourceName,
      type: SOURCE_CATEGORIES.JOB_POSTINGS,
      provider: 'Naukri Feed Provider',
      description: 'Standard external job postings feed',
      license: 'CC-BY-4.0',
    });

    assert(source && source.id && source.name === testSourceName, 'Data source registered via service');
    assert(source.type === 'JOB_POSTINGS' && source.status === 'ACTIVE', 'Source has correct type and ACTIVE status');

    // -------------------------------------------------------------
    // Test 2: Dataset Creation
    // -------------------------------------------------------------
    console.log('\n3. Testing Dataset Creation...');
    const dataset = await sourceRegistryService.registerDataset({
      sourceId: source.id,
      name: 'India Tech Jobs 2026',
      category: SOURCE_CATEGORIES.JOB_POSTINGS,
      description: 'Quarterly job postings dataset for Indian tech market',
    });

    assert(dataset && dataset.id && dataset.sourceId === source.id, 'Dataset registered under data source');

    // -------------------------------------------------------------
    // Test 3: Dataset Versioning
    // -------------------------------------------------------------
    console.log('\n4. Testing Dataset Versioning...');
    const version = await sourceRegistryService.createDatasetVersion({
      datasetId: dataset.id,
      versionTag: '2026-Q1-batch1',
      schemaVersion: '1.0',
      format: 'JSON',
    });

    assert(version && version.id && version.versionTag === '2026-Q1-batch1', 'Dataset version created with DRAFT status');
    assert(version.status === DATASET_VERSION_STATUS.DRAFT, 'Default dataset version status is DRAFT');

    // -------------------------------------------------------------
    // Test 4: Import Content Parsing & Format Validation (JSON & CSV)
    // -------------------------------------------------------------
    console.log('\n5. Testing File Format Parsing (JSON & CSV)...');
    const jsonSample = JSON.stringify([
      {
        id: 'JOB-001',
        title: 'Full Stack Engineer',
        skills: ['React', 'Node.js', 'PostgreSQL'],
        experience: '2-5 years',
        location: 'Bengaluru, Karnataka, India',
        salary: '₹12-18 LPA',
        organization: 'TechCorp India',
        date: '2026-02-15',
      },
    ]);

    const parsedJson = await importService.parseContent(jsonSample, 'JSON');
    assert(parsedJson.records.length === 1 && parsedJson.records[0].id === 'JOB-001', 'JSON parser parsed 1 valid record');
    assert(parsedJson.fileHash && parsedJson.fileHash.length === 64, 'JSON parser generated sha256 file hash');

    const csvSample = `id,title,skills,experience,location,salary,organization,date\nJOB-002,Backend Developer,"Node.js; PostgreSQL; Docker",3+ yrs,"New Delhi, India",15 LPA,CloudSolutions,2026-03-01`;
    const parsedCsv = await importService.parseContent(csvSample, 'CSV');
    assert(parsedCsv.records.length === 1 && parsedCsv.records[0].title === 'Backend Developer', 'CSV parser parsed 1 valid record');
    assert(Array.isArray(parsedCsv.records[0].skills) && parsedCsv.records[0].skills.includes('Node.js'), 'CSV parser converted semicolon skills into array');

    // -------------------------------------------------------------
    // Test 5: Malformed Record Rejection
    // -------------------------------------------------------------
    console.log('\n6. Testing Malformed & Empty Record Validation...');
    let rejectedMalformed = false;
    try {
      await importService.parseContent('invalid json content { [', 'JSON');
    } catch (err) {
      rejectedMalformed = true;
    }
    assert(rejectedMalformed, 'Malformed JSON content correctly rejected with validation error');

    // -------------------------------------------------------------
    // Test 6: Skill Normalization (Exact, Alias, Unmatched)
    // -------------------------------------------------------------
    console.log('\n7. Testing Skill Normalization Pipeline...');
    const normSkills = await normalizationService.normalizeSkills(['React', 'ts', 'PostgreSQL', 'UnknownSkill123']);
    assert(normSkills.length === 4, 'Normalized 4 input skills');

    const reactSkill = normSkills.find((s) => s.raw === 'React');
    const tsSkill = normSkills.find((s) => s.raw === 'ts');
    const unknownSkill = normSkills.find((s) => s.raw === 'UnknownSkill123');

    assert(reactSkill && reactSkill.canonicalName === 'React.js' && reactSkill.status === NORMALIZATION_STATUS.NORMALIZED, 'Skill alias "React" -> "React.js" normalized');
    assert(tsSkill && tsSkill.canonicalName === 'TypeScript' && tsSkill.method === MATCH_METHOD.ALIAS, 'Skill alias "ts" -> "TypeScript" normalized');
    assert(unknownSkill && unknownSkill.status === NORMALIZATION_STATUS.UNRESOLVED, 'Unknown skill left as UNRESOLVED without hallucination');

    // -------------------------------------------------------------
    // Test 7: Role / Job Title Normalization
    // -------------------------------------------------------------
    console.log('\n8. Testing Role Normalization...');
    const normRole1 = await normalizationService.normalizeRole('Frontend Developer');
    const normRole2 = await normalizationService.normalizeRole('Back End Developer');
    const normRole3 = await normalizationService.normalizeRole('Senior Chief Quantum Architect 9000');

    assert(normRole1.canonicalRole === 'Frontend Engineer' && normRole1.status === NORMALIZATION_STATUS.NORMALIZED, 'Title "Frontend Developer" normalized to "Frontend Engineer"');
    assert(normRole2.canonicalRole === 'Backend Engineer' && normRole2.status === NORMALIZATION_STATUS.NORMALIZED, 'Title "Back End Developer" normalized to "Backend Engineer"');
    assert(normRole3.status === NORMALIZATION_STATUS.UNRESOLVED, 'Unrecognized role preserved as UNRESOLVED');

    // -------------------------------------------------------------
    // Test 8: Experience Normalization
    // -------------------------------------------------------------
    console.log('\n9. Testing Experience Normalization...');
    const exp1 = normalizationService.normalizeExperience('2-4 years');
    const exp2 = normalizationService.normalizeExperience('5+ yrs');
    const exp3 = normalizationService.normalizeExperience('Fresher');

    assert(exp1.minYears === 2 && exp1.maxYears === 4 && exp1.isStructured, 'Experience "2-4 years" -> min: 2, max: 4');
    assert(exp2.minYears === 5 && exp2.maxYears === null, 'Experience "5+ yrs" -> min: 5, max: null');
    assert(exp3.minYears === 0 && exp3.maxYears === 1, 'Experience "Fresher" -> min: 0, max: 1');

    // -------------------------------------------------------------
    // Test 9: Location Normalization
    // -------------------------------------------------------------
    console.log('\n10. Testing Location Normalization...');
    const loc1 = normalizationService.normalizeLocation('Bengaluru, Karnataka, India');
    const loc2 = normalizationService.normalizeLocation('Remote, India');

    assert(loc1.city === 'Bengaluru' && loc1.state === 'Karnataka' && loc1.country === 'India', 'Location "Bengaluru, Karnataka, India" parsed');
    assert(loc2.workMode === 'REMOTE' && loc2.country === 'India', 'Remote location workMode detected as REMOTE');

    // -------------------------------------------------------------
    // Test 10: Compensation Normalization ("Advertised Compensation Pattern")
    // -------------------------------------------------------------
    console.log('\n11. Testing Compensation Normalization...');
    const comp1 = normalizationService.normalizeCompensation('₹8-12 LPA');
    const comp2 = normalizationService.normalizeCompensation('$80k-$100k');
    const comp3 = normalizationService.normalizeCompensation('Competitive salary');

    assert(comp1.minSalary === 800000 && comp1.maxSalary === 1200000 && comp1.currency === 'INR', 'Compensation "₹8-12 LPA" -> min: 800000, max: 1200000 INR');
    assert(comp2.minSalary === 80000 && comp2.maxSalary === 100000 && comp2.currency === 'USD', 'Compensation "$80k-$100k" -> min: 80000, max: 100000 USD');
    assert(!comp3.isNumeric && comp3.patternType === 'DESCRIPTIVE_PATTERN', 'Non-numeric compensation preserved without false precision');

    // -------------------------------------------------------------
    // Test 11: Date Normalization
    // -------------------------------------------------------------
    console.log('\n12. Testing Date Normalization into Observation Periods...');
    const dt1 = normalizationService.normalizeDate('2026-02-15');
    const dt2 = normalizationService.normalizeDate('2026-08-20');

    assert(dt1.quarter === '2026-Q1' && dt1.month === '2026-02' && dt1.year === 2026, 'Date "2026-02-15" mapped to 2026-Q1');
    assert(dt2.quarter === '2026-Q3' && dt2.year === 2026, 'Date "2026-08-20" mapped to 2026-Q3');

    // -------------------------------------------------------------
    // Test 12: Deduplication & Fingerprinting
    // -------------------------------------------------------------
    console.log('\n13. Testing Deterministic Fingerprinting & Deduplication...');
    const jobA = {
      role: { canonicalRole: 'Frontend Engineer' },
      organization: 'Acme Corp',
      location: { city: 'Bengaluru' },
      date: { quarter: '2026-Q1' },
      skills: [{ canonicalName: 'React.js' }, { canonicalName: 'TypeScript' }],
      externalId: 'EXT-100',
    };

    const fp1 = deduplicationService.generateFingerprint({ data: jobA }, source.id);
    const fp2 = deduplicationService.generateFingerprint({ data: jobA }, source.id);

    assert(fp1 === fp2, 'Deterministic fingerprint generated consistently for identical content');

    const seenSet = new Set([fp1]);
    const dupCheck = await deduplicationService.checkDuplicate(fp1, 'EXT-100', version.id, seenSet);
    assert(dupCheck.isDuplicate, 'Duplicate record correctly detected in batch');

    // -------------------------------------------------------------
    // Test 13: Quarantine Handling
    // -------------------------------------------------------------
    console.log('\n14. Testing Quarantine System...');
    const badRecord = {
      title: '', // Missing title
      salary: 'Invalid salary format',
      experience: '-5 years',
    };

    const valBad = validationService.validateRecord(badRecord);
    assert(valBad.shouldQuarantine && valBad.quarantineReason === QUARANTINE_REASONS.INVALID_REQUIRED_FIELD, 'Missing required title flagged for quarantine');

    const quarantined = await quarantineService.quarantineRecord({
      datasetVersionId: version.id,
      reason: valBad.quarantineReason,
      validationErrors: valBad.errors,
      rawRecord: badRecord,
    });

    assert(quarantined && quarantined.status === QUARANTINE_STATUS.QUARANTINED, 'Record stored in quarantined_records table');

    const reviewedQuarantine = await quarantineService.reviewQuarantinedRecord(quarantined.id, {
      status: 'DISCARDED',
      notes: 'Confirmed bad record discarded by admin',
      reviewedBy: 'test-admin',
    });

    assert(reviewedQuarantine.status === 'DISCARDED', 'Admin reviewed and updated quarantined record status');

    // -------------------------------------------------------------
    // Test 14: Quality Scoring Engine
    // -------------------------------------------------------------
    console.log('\n15. Testing Data Quality Engine...');
    // Ingest sample batch of records into dataset version
    const testBatch = [
      {
        id: 'VALID-001',
        title: 'Software Engineer',
        skills: ['JavaScript', 'React.js', 'Node.js'],
        experience: '3-5 years',
        location: 'Bengaluru, India',
        salary: '₹14-20 LPA',
        organization: 'Apex Software',
        date: '2026-01-10',
      },
      {
        id: 'VALID-002',
        title: 'Backend Engineer',
        skills: ['Node.js', 'PostgreSQL', 'Docker'],
        experience: '2-4 years',
        location: 'New Delhi, India',
        salary: '₹12-16 LPA',
        organization: 'CyberTech',
        date: '2026-02-10',
      },
      {
        id: 'DUP-001',
        title: 'Software Engineer',
        skills: ['JavaScript', 'React.js', 'Node.js'],
        experience: '3-5 years',
        location: 'Bengaluru, India',
        salary: '₹14-20 LPA',
        organization: 'Apex Software',
        date: '2026-01-10',
      },
      {
        id: 'BAD-001',
        title: '', // Bad
        skills: [],
      },
    ];

    const importResult = await ingestionService.processDatasetImport(version.id, testBatch);
    assert(importResult.status === 'SUCCESS', 'Batch ingestion processed successfully');
    assert(importResult.successCount === 3, '3 records stored (2 valid + 1 duplicate)');
    assert(importResult.quarantinedCount === 1, '1 bad record quarantined');

    const qualityReport = await qualityService.evaluateDatasetQuality(version.id);
    assert(qualityReport && qualityReport.overallScore >= 0.5 && qualityReport.overallScore <= 1.0, 'Quality score computed in valid 0.0-1.0 range');
    assert(qualityReport.completenessScore > 0 && qualityReport.validityScore > 0, 'Completeness and validity metrics generated');

    // -------------------------------------------------------------
    // Test 15: Idempotency (Re-importing same dataset version)
    // -------------------------------------------------------------
    console.log('\n16. Testing Idempotent Re-import Safety...');
    const reimportResult = await ingestionService.processDatasetImport(version.id, testBatch);
    assert(reimportResult.status === 'ALREADY_IMPORTED', 'Re-import of imported dataset version recognized as ALREADY_IMPORTED');

    // -------------------------------------------------------------
    // Test 16: Provenance & Demand Observation Integration
    // -------------------------------------------------------------
    console.log('\n17. Testing Provenance & Demand Observation Integration...');
    const importedObs = await prisma.skillDemandObservation.findMany({
      where: { sourceType: PROVENANCE_SOURCE_TYPES.IMPORTED },
    });

    assert(importedObs.length > 0, 'Imported job postings aggregated into SkillDemandObservation with sourceType="IMPORTED"');
    assert(importedObs[0].demandCount > 0, 'Imported observation demand count aggregated correctly');

    // -------------------------------------------------------------
    // Test 17: Admin Ingestion APIs & RBAC Controls
    // -------------------------------------------------------------
    console.log('\n18. Testing Admin Ingestion API Endpoints & RBAC...');

    // 17.1 List data sources (Admin: 200)
    const listSourcesRes = await makeRequest('/api/v1/admin/ingestion/sources', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(listSourcesRes.status === 200 && Array.isArray(listSourcesRes.data?.data), 'Admin GET /api/v1/admin/ingestion/sources returned 200');

    // 17.2 List data sources (Standard User: 403 Forbidden)
    const forbiddenRes = await makeRequest('/api/v1/admin/ingestion/sources', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(forbiddenRes.status === 403, 'Standard user GET /api/v1/admin/ingestion/sources returned 403 Forbidden');

    // 17.3 Create Dataset via API (Admin: 201)
    const apiDatasetRes = await makeRequest('/api/v1/admin/ingestion/datasets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        sourceId: source.id,
        name: `API-Dataset-${Date.now()}`,
        category: 'JOB_POSTINGS',
        description: 'Created via admin REST API',
      }),
    });
    assert(apiDatasetRes.status === 201 && apiDatasetRes.data?.data?.id, 'Admin POST /api/v1/admin/ingestion/datasets returned 201');
    const apiDatasetId = apiDatasetRes.data.data.id;

    // 17.4 Create Version via API
    const apiVersionRes = await makeRequest(`/api/v1/admin/ingestion/datasets/${apiDatasetId}/versions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        datasetId: apiDatasetId,
        versionTag: 'v1.0.0',
        format: 'JSON',
      }),
    });
    assert(apiVersionRes.status === 201 && apiVersionRes.data?.data?.versionTag === 'v1.0.0', 'Admin POST /api/v1/admin/ingestion/datasets/:id/versions returned 201');
    const apiVersionId = apiVersionRes.data.data.id;

    // 17.5 Import Dataset via API
    const apiImportRes = await makeRequest(`/api/v1/admin/ingestion/datasets/${apiDatasetId}/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        datasetVersionId: apiVersionId,
        records: [
          {
            id: 'API-JOB-1',
            title: 'Backend Engineer',
            skills: ['Node.js', 'PostgreSQL'],
            location: 'Mumbai, India',
            experience: '2-4 years',
            salary: '₹10-15 LPA',
            date: '2026-03-15',
          },
        ],
      }),
    });
    assert(apiImportRes.status === 200 && apiImportRes.data?.data?.status === 'SUCCESS', 'Admin POST /api/v1/admin/ingestion/datasets/:id/import executed successfully');

    // 17.6 Get Quality Report via API
    const apiQualityRes = await makeRequest(`/api/v1/admin/ingestion/quality/${apiVersionId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(apiQualityRes.status === 200 && apiQualityRes.data?.data?.overallScore !== undefined, 'Admin GET /api/v1/admin/ingestion/quality/:versionId returned quality report');

    // 17.7 List Quarantine via API
    const apiQuarantineRes = await makeRequest('/api/v1/admin/ingestion/quarantine', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(apiQuarantineRes.status === 200 && Array.isArray(apiQuarantineRes.data?.data), 'Admin GET /api/v1/admin/ingestion/quarantine returned records');

    // -------------------------------------------------------------
    // Test 18: Ingestion Background Job Lifecycle & Cancellation
    // -------------------------------------------------------------
    console.log('\n19. Testing Background Job Lifecycle & Cancellation...');
    const bgVersion = await sourceRegistryService.createDatasetVersion({
      datasetId: dataset.id,
      versionTag: `bg-batch-${Date.now()}`,
      format: 'JSON',
    });

    const bgJobResult = await ingestionService.enqueueDatasetImport(bgVersion.id, testBatch, {
      createdBy: 'admin-test',
    });

    assert(!bgJobResult.isDuplicate && bgJobResult.job && bgJobResult.job.id, 'Ingestion job enqueued in background job service');

    // Check job listing via API
    const listJobsRes = await makeRequest('/api/v1/admin/ingestion/jobs', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(listJobsRes.status === 200 && Array.isArray(listJobsRes.data?.data), 'Admin GET /api/v1/admin/ingestion/jobs returned 200');

    // -------------------------------------------------------------
    // Test 19: Observability & Metrics Verification
    // -------------------------------------------------------------
    console.log('\n20. Testing Observability Metrics Integration...');
    const metrics = metricsService.getMetricsSummary();
    assert(metrics.dataIngestion && metrics.dataIngestion.recordsProcessed > 0, 'Metrics summary tracks dataIngestion recordsProcessed');
    assert(metrics.dataIngestion.datasetsImported > 0, 'Metrics summary tracks datasetsImported');

    console.log('\n================================================================');
    console.log(`PHASE 28 TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
};

runSuite();
