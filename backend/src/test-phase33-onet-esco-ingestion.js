import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import app from './app.js';
import prisma from './config/db.js';
import { onetConnectorService, ONET_SOURCE_KEY } from './services/ingestion/onetConnector.service.js';
import { escoConnectorService, ESCO_SOURCE_KEY } from './services/ingestion/escoConnector.service.js';
import { downloadSecurityService } from './services/ingestion/downloadSecurity.service.js';
import { sourceRegistryService, DATASET_VERSION_STATUS } from './services/ingestion/sourceRegistry.service.js';
import { generateAccessToken } from './utils/token.js';

let server;
let baseUrl;
let passed = 0;
let failed = 0;
let adminToken = '';
let individualToken = '';

const assert = (condition, testName) => {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed += 1;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed += 1;
  }
};

const makeRequest = async (apiPath, options = {}) => {
  const url = `${baseUrl}${apiPath}`;
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
  console.log('STARTING PHASE 33 — OFFICIAL O*NET + ESCO DATA INTEGRATION TESTS');
  console.log('================================================================\n');

  // Start ephemeral HTTP server for API testing
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  // Generate test auth tokens
  const adminUser = await prisma.user.create({
    data: {
      email: `admin-phase33-${Date.now()}@example.com`,
      accountType: 'ORGANIZATION',
      role: 'ADMIN',
    },
  });
  adminToken = generateAccessToken({
    id: adminUser.id,
    userId: adminUser.id,
    email: adminUser.email,
    accountType: 'ORGANIZATION',
    role: 'ADMIN',
  });

  const normalUser = await prisma.user.create({
    data: {
      email: `user-phase33-${Date.now()}@example.com`,
      accountType: 'INDIVIDUAL',
    },
  });
  individualToken = generateAccessToken({
    id: normalUser.id,
    userId: normalUser.id,
    email: normalUser.email,
    accountType: 'INDIVIDUAL',
    role: 'INDIVIDUAL',
  });

  // Load offline test fixtures
  const fixturesDir = path.resolve('backend/tests/fixtures');
  const onetOccCsv = fs.readFileSync(path.join(fixturesDir, 'onet/occupations.csv'), 'utf-8');
  const onetSklCsv = fs.readFileSync(path.join(fixturesDir, 'onet/skills.csv'), 'utf-8');
  const onetTechCsv = fs.readFileSync(path.join(fixturesDir, 'onet/technology_skills.csv'), 'utf-8');
  const onetRelCsv = fs.readFileSync(path.join(fixturesDir, 'onet/occupation_skills.csv'), 'utf-8');
  const onetAltCsv = fs.readFileSync(path.join(fixturesDir, 'onet/alternate_titles.csv'), 'utf-8');

  const escoOccCsv = fs.readFileSync(path.join(fixturesDir, 'esco/occupations_en.csv'), 'utf-8');
  const escoSklCsv = fs.readFileSync(path.join(fixturesDir, 'esco/skills_en.csv'), 'utf-8');
  const escoRelCsv = fs.readFileSync(path.join(fixturesDir, 'esco/occupationSkillRelations.csv'), 'utf-8');

  // 1. Official Source Registration
  console.log('1. Testing Official Source Registration...');
  const onetSource = await onetConnectorService.ensureOnetSource();
  assert(onetSource && onetSource.name.includes('O*NET'), 'O*NET source successfully registered with metadata');
  assert(onetSource.provider.includes('USDOL/ETA') || onetSource.provider.includes('Department of Labor'), 'O*NET provider correctly recorded');
  assert(onetSource.license && onetSource.license.includes('CC BY 4.0'), 'O*NET CC BY 4.0 license preserved');

  const escoSource = await escoConnectorService.ensureEscoSource();
  assert(escoSource && escoSource.name.includes('ESCO'), 'ESCO source successfully registered with metadata');
  assert(escoSource.provider.includes('European Commission'), 'ESCO provider correctly recorded');
  assert(escoSource.license && escoSource.license.includes('ODbL'), 'ESCO ODbL / CC BY license preserved');

  // 2. O*NET Connector & Ingestion
  console.log('\n2. Testing O*NET Official Connector Ingestion...');
  const onetImportRes = await onetConnectorService.importOnetDataset({
    versionTag: 'onet-v30.0-test',
    occupations: onetOccCsv,
    skills: onetSklCsv,
    technologySkills: onetTechCsv,
    occupationSkills: onetRelCsv,
    alternateTitles: onetAltCsv,
  });

  assert(onetImportRes.status === 'SUCCESS', 'O*NET dataset imported successfully');
  assert(onetImportRes.acceptedCount > 0, `O*NET entities accepted (count: ${onetImportRes.acceptedCount})`);
  assert(onetImportRes.datasetVersionId, 'Dataset version record created for O*NET import');
  assert(onetImportRes.fileHash && onetImportRes.fileHash.length === 64, 'SHA-256 source artifact hash computed');

  // Verify O*NET Roles and Skills in Database
  const swDevRole = await prisma.role.findFirst({
    where: { name: 'Software Developers' },
  });
  assert(swDevRole !== null, 'O*NET occupation mapped to canonical Role (Software Developers)');

  const progSkill = await prisma.skill.findFirst({
    where: { name: 'Programming' },
  });
  assert(progSkill !== null, 'O*NET skill mapped to canonical Skill (Programming)');

  const pythonSkill = await prisma.skill.findFirst({
    where: { name: 'Python' },
  });
  assert(pythonSkill !== null, 'O*NET technology skill mapped to canonical Skill (Python)');

  // Verify RoleSkill Relationship from O*NET
  if (swDevRole && progSkill) {
    const roleSkill = await prisma.roleSkill.findFirst({
      where: { roleId: swDevRole.id, skillId: progSkill.id },
    });
    assert(roleSkill !== null && roleSkill.requirementType === 'REQUIRED', 'O*NET occupation-skill relationship mapped to RoleSkill (REQUIRED)');
  }

  // Verify ExternalTaxonomyMapping for O*NET
  const onetMapping = await prisma.externalTaxonomyMapping.findFirst({
    where: { source: ONET_SOURCE_KEY, externalId: '15-1252.00', internalEntityType: 'ROLE' },
  });
  assert(onetMapping !== null, 'O*NET SOC code 15-1252.00 preserved in ExternalTaxonomyMapping');
  assert(onetMapping && onetMapping.internalEntityId === swDevRole?.id, 'External mapping correctly points to internal Role ID');

  // 3. O*NET Idempotent Re-Import
  console.log('\n3. Testing O*NET Idempotency & Checksum Protection...');
  const onetReimportRes = await onetConnectorService.importOnetDataset({
    versionTag: 'onet-v30.0-test',
    occupations: onetOccCsv,
    skills: onetSklCsv,
    technologySkills: onetTechCsv,
    occupationSkills: onetRelCsv,
    alternateTitles: onetAltCsv,
  });

  assert(onetReimportRes.status === 'ALREADY_IMPORTED', 'Identical O*NET re-import returns ALREADY_IMPORTED');
  assert(onetReimportRes.fileHash === onetImportRes.fileHash, 'Matching SHA-256 checksum detected without creating duplicates');

  // 4. ESCO Connector & Ingestion
  console.log('\n4. Testing ESCO Official Connector Ingestion...');
  const escoImportRes = await escoConnectorService.importEscoDataset({
    versionTag: 'esco-v1.2-test',
    occupations: escoOccCsv,
    skills: escoSklCsv,
    occupationSkillRelations: escoRelCsv,
  });

  assert(escoImportRes.status === 'SUCCESS', 'ESCO dataset imported successfully');
  assert(escoImportRes.acceptedCount > 0, `ESCO entities accepted (count: ${escoImportRes.acceptedCount})`);
  assert(escoImportRes.fileHash && escoImportRes.fileHash.length === 64, 'SHA-256 source hash computed for ESCO package');

  // Verify ESCO Concept URI Preservation
  const escoDevUri = 'http://data.europa.eu/esco/occupation/529f7f4a-85b4-4b55-a226-0a06c8fcbb31';
  const escoMapping = await prisma.externalTaxonomyMapping.findFirst({
    where: { source: ESCO_SOURCE_KEY, externalId: escoDevUri, internalEntityType: 'ROLE' },
  });
  assert(escoMapping !== null, 'ESCO stable concept URI preserved in ExternalTaxonomyMapping');
  assert(escoMapping && escoMapping.externalUri === escoDevUri, 'externalUri matches official ESCO URI');
  assert(escoMapping && escoMapping.preferredLabel === 'software developer', 'Preferred label preserved');

  // Verify ESCO Skill & Relationship
  const escoSkillUri = 'http://data.europa.eu/esco/skill/9c676d5e-d264-4437-a9a3-5c777d0a28f8';
  const escoSkillMapping = await prisma.externalTaxonomyMapping.findFirst({
    where: { source: ESCO_SOURCE_KEY, externalId: escoSkillUri, internalEntityType: 'SKILL' },
  });
  assert(escoSkillMapping !== null, 'ESCO skill concept URI preserved');
  assert(escoSkillMapping && escoSkillMapping.preferredLabel === 'software design', 'ESCO skill preferredLabel mapped');

  // 5. ESCO Idempotent Re-Import
  console.log('\n5. Testing ESCO Idempotency...');
  const escoReimportRes = await escoConnectorService.importEscoDataset({
    versionTag: 'esco-v1.2-test',
    occupations: escoOccCsv,
    skills: escoSklCsv,
    occupationSkillRelations: escoRelCsv,
  });
  assert(escoReimportRes.status === 'ALREADY_IMPORTED', 'Identical ESCO re-import returns ALREADY_IMPORTED without duplicates');

  // 6. Data Integrity & Demand Non-Contamination Boundaries
  console.log('\n6. Testing Demand & Salary Non-Contamination Boundaries...');
  // Taxonomy imports must NEVER create fake demand observations or fake advertised salaries
  const onetDemandObs = await prisma.skillDemandObservation.findFirst({
    where: { sourceType: 'ONET' },
  });
  assert(onetDemandObs === null, 'CRITICAL: No fake SkillDemandObservation records generated from O*NET taxonomy');

  const escoDemandObs = await prisma.skillDemandObservation.findFirst({
    where: { sourceType: 'ESCO' },
  });
  assert(escoDemandObs === null, 'CRITICAL: No fake SkillDemandObservation records generated from ESCO taxonomy');

  const taxonomyComp = await prisma.advertisedCompensation.findFirst({
    where: { source: { in: ['O*NET', 'ESCO', 'ONET'] } },
  });
  assert(taxonomyComp === null, 'CRITICAL: No fake AdvertisedCompensation records generated from taxonomy metadata');

  // 7. Data Quality & Quarantine Verification
  console.log('\n7. Testing Data Quality Reports & Quarantine...');
  const onetQuality = await prisma.dataQualityReport.findFirst({
    where: { datasetVersionId: onetImportRes.datasetVersionId },
  });
  assert(onetQuality !== null, 'DataQualityReport generated for O*NET import');
  assert(onetQuality && onetQuality.overallScore > 0, `O*NET Quality score calculated: ${onetQuality?.overallScore}`);

  // Test Quarantine on malformed O*NET input
  const malformedOnetRes = await onetConnectorService.importOnetDataset({
    versionTag: `onet-malformed-${Date.now()}`,
    occupations: [
      { onetsoc_code: '', title: 'Missing Code Role' },
      { onetsoc_code: '15-9999.00', title: 'test' }, // Ambiguous placeholder
    ],
    skills: [
      { element_id: '', element_name: 'Missing ID Skill' },
    ],
  });
  assert(malformedOnetRes.quarantinedCount >= 3, 'Malformed/ambiguous O*NET records correctly quarantined');

  // 8. Download Security & SSRF Protection
  console.log('\n8. Testing Download Security & SSRF Protection...');
  try {
    downloadSecurityService.validateDownloadUrl('http://localhost:8080/malicious.zip');
    assert(false, 'Localhost download URL should be rejected');
  } catch (err) {
    assert(err.message.includes('SSRF') || err.message.includes('Forbidden') || err.message.includes('prohibited'), 'Localhost target blocked by SSRF validation');
  }

  try {
    downloadSecurityService.validateDownloadUrl('http://192.168.1.50/data.csv');
    assert(false, 'Private IP download URL should be rejected');
  } catch (err) {
    assert(err.message.includes('SSRF') || err.message.includes('Forbidden') || err.message.includes('prohibited'), 'Private RFC1918 IP blocked');
  }

  try {
    downloadSecurityService.validateDownloadUrl('https://evil-unauthorized-host.com/data.csv');
    assert(false, 'Unauthorized host should be rejected');
  } catch (err) {
    assert(err.message.includes('allowlist') || err.message.includes('not in the official source allowlist'), 'Non-allowlisted host rejected');
  }

  const validOnetUrl = downloadSecurityService.validateDownloadUrl('https://www.onetcenter.org/database.html');
  assert(validOnetUrl.hostname === 'www.onetcenter.org', 'Official O*NET host www.onetcenter.org validated');

  const validEscoUrl = downloadSecurityService.validateDownloadUrl('https://esco.ec.europa.eu/data.csv');
  assert(validEscoUrl.hostname === 'esco.ec.europa.eu', 'Official ESCO host esco.ec.europa.eu validated');

  // Zip Slip Protection
  try {
    downloadSecurityService.validateArchiveEntryPath('../../etc/passwd', '/tmp/safe');
    assert(false, 'Path traversal in archive should be rejected');
  } catch (err) {
    assert(err.message.includes('Zip Slip') || err.message.includes('traversal'), 'Zip Slip directory traversal rejected');
  }

  try {
    downloadSecurityService.validateArchiveEntryPath('/etc/shadow', '/tmp/safe');
    assert(false, 'Absolute path in archive should be rejected');
  } catch (err) {
    assert(err.message.includes('absolute path rejected'), 'Absolute path in archive entry rejected');
  }

  const safePath = downloadSecurityService.validateArchiveEntryPath('occupations/data.csv', '/tmp/safe');
  assert(safePath.includes('occupations'), 'Valid relative archive entry path accepted safely');

  // 9. Large Dataset Chunked / Batch Ingestion Test
  console.log('\n9. Testing Large Dataset Chunked Batch Processing...');
  const largeBatchOccupations = [];
  const largeBatchSkills = [];
  for (let i = 1; i <= 250; i++) {
    const code = `15-${String(1000 + i).padStart(4, '0')}.00`;
    largeBatchOccupations.push({
      onetsoc_code: code,
      title: `Specialized Engineer Role ${i}`,
      description: `Automated test occupation description for specialized role ${i}.`,
    });
    largeBatchSkills.push({
      element_id: `2.B.${i}`,
      element_name: `Technical Capability Skill ${i}`,
      description: `Skill capability ${i} for large dataset batch test.`,
    });
  }

  const largeBatchRes = await onetConnectorService.importOnetDataset({
    versionTag: `onet-large-batch-${Date.now()}`,
    occupations: largeBatchOccupations,
    skills: largeBatchSkills,
  });
  assert(
    largeBatchRes.acceptedCount + largeBatchRes.updatedCount >= 500,
    `Processed ${largeBatchRes.acceptedCount + largeBatchRes.updatedCount} records without memory degradation`
  );

  // 10. Admin REST API Endpoints Integration
  console.log('\n10. Testing Admin Ingestion REST APIs...');

  // Non-admin rejection (403/401)
  const nonAdminRes = await makeRequest('/api/v1/admin/ingestion/onet/import', {
    method: 'POST',
    headers: { Authorization: `Bearer ${individualToken}` },
    body: JSON.stringify({ versionTag: 'unauthorized-test' }),
  });
  assert(nonAdminRes.status === 403 || nonAdminRes.status === 401, 'Non-admin user rejected from official import API (403/401)');

  // Admin Sources Summary
  const sourcesSummaryRes = await makeRequest('/api/v1/admin/ingestion/sources-summary', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(sourcesSummaryRes.status === 200, 'Admin GET /api/v1/admin/ingestion/sources-summary returned 200');
  assert(Array.isArray(sourcesSummaryRes.data?.data), 'Sources summary array returned');
  const hasOnet = sourcesSummaryRes.data?.data?.some((s) => s.officialKey === 'ONET');
  const hasEsco = sourcesSummaryRes.data?.data?.some((s) => s.officialKey === 'ESCO');
  assert(hasOnet && hasEsco, 'Official O*NET and ESCO source summaries present in API response');

  // Admin Check Update
  const onetSourceId = onetSource.id;
  const updateCheckRes = await makeRequest(`/api/v1/admin/ingestion/sources/${onetSourceId}/check-update`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(updateCheckRes.status === 200, 'Admin POST /api/v1/admin/ingestion/sources/:id/check-update returned 200');
  assert(updateCheckRes.data?.data?.officialKey === 'ONET', 'Update check returns official release information');

  // Admin Taxonomy Mappings
  const mappingsRes = await makeRequest('/api/v1/admin/ingestion/taxonomy-mappings?source=ONET', {
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(mappingsRes.status === 200, 'Admin GET /api/v1/admin/ingestion/taxonomy-mappings returned 200');
  assert(mappingsRes.data?.data?.total > 0, `Taxonomy mappings queryable (total: ${mappingsRes.data?.data?.total})`);

  // Admin POST O*NET Import via API
  const apiOnetImportRes = await makeRequest('/api/v1/admin/ingestion/onet/import', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      versionTag: `onet-api-${Date.now()}`,
      occupations: [
        { onetsoc_code: '15-1254.00', title: 'Web Developers', description: 'Develop and create websites.' }
      ],
      skills: [
        { element_id: '2.B.3.k', element_name: 'Web Architecture', description: 'Design web application systems.' }
      ],
    }),
  });
  assert(apiOnetImportRes.status === 200, 'Admin POST /api/v1/admin/ingestion/onet/import executed via API');

  // Admin POST ESCO Import via API
  const apiEscoImportRes = await makeRequest('/api/v1/admin/ingestion/esco/import', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      versionTag: `esco-api-${Date.now()}`,
      occupations: [
        {
          conceptUri: 'http://data.europa.eu/esco/occupation/api-test-01',
          preferredLabel: 'cloud architect',
          description: 'Architect distributed cloud environments.'
        }
      ],
      skills: [
        {
          conceptUri: 'http://data.europa.eu/esco/skill/api-test-skill-01',
          preferredLabel: 'cloud infrastructure provisioning',
          description: 'Automate infrastructure provisioning.'
        }
      ],
    }),
  });
  assert(apiEscoImportRes.status === 200, 'Admin POST /api/v1/admin/ingestion/esco/import executed via API');

  // Teardown
  await new Promise((resolve) => server.close(resolve));

  console.log('\n================================================================');
  console.log(`PHASE 33 TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
};

runSuite().catch((err) => {
  console.error('Fatal error in Phase 33 test suite:', err);
  if (server) server.close();
  process.exit(1);
});
