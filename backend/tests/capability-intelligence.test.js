import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../src/config/db.js';
import capabilityService, {
  deriveCapabilityIntelligence,
  harvestProfileEvidence,
} from '../src/services/capabilityIntelligence.service.js';

describe('Phase 38 — Evidence-Based Capability Intelligence Engine', () => {
  let userA, profileA, userB, profileB;
  let skillJava, skillSpringBoot, skillDocker, skillAWS, skillReact;
  let roleBackend;

  before(async () => {
    // 1. Fetch or create test skills
    const skills = await prisma.skill.findMany({ take: 10 });
    skillJava = skills.find((s) => s.name === 'Java') || (await prisma.skill.create({ data: { name: 'Java', category: 'Programming' } }));
    skillSpringBoot = skills.find((s) => s.name === 'Spring Boot') || (await prisma.skill.create({ data: { name: 'Spring Boot', category: 'Backend' } }));
    skillDocker = skills.find((s) => s.name === 'Docker') || (await prisma.skill.create({ data: { name: 'Docker', category: 'DevOps' } }));
    skillAWS = skills.find((s) => s.name === 'AWS Cloud') || (await prisma.skill.create({ data: { name: 'AWS Cloud', category: 'Cloud' } }));
    skillReact = skills.find((s) => s.name === 'React.js') || (await prisma.skill.create({ data: { name: 'React.js', category: 'Frontend' } }));

    // 2. Fetch or create test role
    const roles = await prisma.role.findMany({ take: 5 });
    roleBackend = roles.find((r) => r.name.includes('Backend')) || (await prisma.role.create({
      data: {
        name: 'Backend Software Engineer',
        category: 'Software Engineering',
        description: 'Backend architecture',
      },
    }));

    // Ensure role has required skills
    await prisma.roleSkill.deleteMany({ where: { roleId: roleBackend.id } });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillJava.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'ADVANCED',
        importance: 90,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillSpringBoot.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'ADVANCED',
        importance: 85,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillDocker.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'INTERMEDIATE',
        importance: 80,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillAWS.id,
        requirementType: 'PREFERRED',
        targetProficiency: 'INTERMEDIATE',
        importance: 70,
      },
    });

    // 3. Create User A (Primary Candidate)
    userA = await prisma.user.create({
      data: {
        email: `candidate.a.${Date.now()}@example.com`,
        accountType: 'INDIVIDUAL',
      },
    });
    profileA = await prisma.individualProfile.create({
      data: {
        userId: userA.id,
        fullName: 'Candidate Alpha',
        targetRoleId: roleBackend.id,
      },
    });

    // Add profile skills: Java (Advanced), Spring Boot (Intermediate), Docker (Intermediate - Self-reported only)
    await prisma.userSkill.create({
      data: {
        profileId: profileA.id,
        skillId: skillJava.id,
        proficiency: 'ADVANCED',
        yearsOfExperience: 4,
      },
    });
    await prisma.userSkill.create({
      data: {
        profileId: profileA.id,
        skillId: skillSpringBoot.id,
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: 2,
      },
    });
    await prisma.userSkill.create({
      data: {
        profileId: profileA.id,
        skillId: skillDocker.id,
        proficiency: 'INTERMEDIATE',
        yearsOfExperience: 2,
      },
    });

    // Add Completed Project for Java & Spring Boot
    await prisma.growthProject.create({
      data: {
        profileId: profileA.id,
        title: 'Microservices Payment Gateway',
        description: 'High throughput payment processing backend in Java and Spring Boot',
        skills: ['Java', 'Spring Boot'],
        status: 'COMPLETED',
      },
    });

    // Add Work Experience for Java
    await prisma.experience.create({
      data: {
        profileId: profileA.id,
        company: 'Starlight Fintech',
        roleTitle: 'Java Backend Engineer',
        description: 'Developed scalable distributed Java microservices and transactional APIs.',
        startDate: new Date('2024-01-01'),
        isCurrent: true,
      },
    });

    // 4. Create User B (for cross-user ownership tests)
    userB = await prisma.user.create({
      data: {
        email: `candidate.b.${Date.now()}@example.com`,
        accountType: 'INDIVIDUAL',
      },
    });
    profileB = await prisma.individualProfile.create({
      data: {
        userId: userB.id,
        fullName: 'Candidate Beta',
        targetRoleId: roleBackend.id,
      },
    });
  });

  describe('1. Deterministic State Matrix & Evidence Rules', () => {
    it('should classify Java as DEMONSTRATED with STRONG multi-source evidence (Project + Experience)', () => {
      const result = deriveCapabilityIntelligence({
        userSkill: { proficiency: 'ADVANCED' },
        roleSkill: { requirementType: 'REQUIRED', targetProficiency: 'ADVANCED' },
        evidenceList: [
          {
            sourceEntityType: 'GrowthProject',
            sourceEntityId: 'proj-1',
            evidenceType: 'PROJECT',
            evidenceStrength: 'MODERATE',
            occurredAt: new Date('2025-06-01'),
          },
          {
            sourceEntityType: 'Experience',
            sourceEntityId: 'exp-1',
            evidenceType: 'EXPERIENCE',
            evidenceStrength: 'MODERATE',
            occurredAt: new Date('2024-01-01'),
          },
        ],
      });

      assert.equal(result.capabilityState, 'DEMONSTRATED');
      assert.equal(result.evidenceState, 'MULTI_SOURCE');
      assert.equal(result.evidenceStrength, 'STRONG');
      assert.equal(result.evidenceGap, 'NONE');
      assert.equal(result.independentSourceCount, 2);
    });

    it('should classify Spring Boot as DEMONSTRATED with MODERATE evidence (Single Completed Project)', () => {
      const result = deriveCapabilityIntelligence({
        userSkill: { proficiency: 'INTERMEDIATE' },
        roleSkill: { requirementType: 'REQUIRED', targetProficiency: 'ADVANCED' },
        evidenceList: [
          {
            sourceEntityType: 'GrowthProject',
            sourceEntityId: 'proj-1',
            evidenceType: 'PROJECT',
            evidenceStrength: 'MODERATE',
            occurredAt: new Date('2025-06-01'),
          },
        ],
      });

      assert.equal(result.capabilityState, 'DEMONSTRATED');
      assert.equal(result.evidenceState, 'ATTACHED');
      assert.equal(result.evidenceStrength, 'MODERATE');
      assert.equal(result.evidenceGap, 'LOW');
      assert.equal(result.independentSourceCount, 1);
    });

    it('should classify Docker as EVIDENCE_NEEDED when required by target role but zero evidence attached', () => {
      const result = deriveCapabilityIntelligence({
        userSkill: { proficiency: 'INTERMEDIATE' },
        roleSkill: { requirementType: 'REQUIRED', targetProficiency: 'INTERMEDIATE' },
        evidenceList: [],
      });

      assert.equal(result.capabilityState, 'EVIDENCE_NEEDED');
      assert.equal(result.evidenceState, 'DECLARED_ONLY');
      assert.equal(result.evidenceStrength, 'NONE');
      assert.equal(result.evidenceGap, 'HIGH');
      assert.equal(result.independentSourceCount, 0);
    });

    it('should classify non-required skill as SELF_REPORTED when on profile without evidence', () => {
      const result = deriveCapabilityIntelligence({
        userSkill: { proficiency: 'INTERMEDIATE' },
        roleSkill: null,
        evidenceList: [],
      });

      assert.equal(result.capabilityState, 'SELF_REPORTED');
      assert.equal(result.evidenceState, 'DECLARED_ONLY');
      assert.equal(result.evidenceStrength, 'NONE');
      assert.equal(result.evidenceGap, 'LOW');
    });

    it('should classify in-progress learning / project as DEVELOPING', () => {
      const result = deriveCapabilityIntelligence({
        userSkill: { proficiency: 'BEGINNER' },
        roleSkill: { requirementType: 'REQUIRED', targetProficiency: 'ADVANCED' },
        evidenceList: [
          {
            sourceEntityType: 'LearningProgress',
            sourceEntityId: 'lp-1',
            evidenceType: 'LEARNING',
            evidenceStrength: 'LIMITED',
            occurredAt: new Date(),
          },
        ],
      });

      assert.equal(result.capabilityState, 'DEVELOPING');
      assert.equal(result.evidenceState, 'ATTACHED');
      assert.equal(result.evidenceStrength, 'LIMITED');
      assert.equal(result.evidenceGap, 'MEDIUM');
    });
  });

  describe('2. Capability Profile Generation & Evidence Coverage', () => {
    it('should generate complete capability profile with correct distribution and coverage', async () => {
      const profileData = await capabilityService.getCapabilityProfile(userA.id, {
        targetRoleId: roleBackend.id,
      });

      assert.ok(profileData.summary);
      assert.ok(profileData.capabilities.length >= 3);

      // Check Java
      const javaCap = profileData.capabilities.find((c) => c.skill.name === 'Java');
      assert.ok(javaCap);
      assert.equal(javaCap.capabilityState, 'DEMONSTRATED');
      assert.equal(javaCap.evidenceStrength, 'STRONG');
      assert.ok(javaCap.evidence.length >= 2);
      assert.ok(javaCap.explanation.length > 0);

      // Check Docker (Self-reported, but required by role => Evidence Needed)
      const dockerCap = profileData.capabilities.find((c) => c.skill.name === 'Docker');
      assert.ok(dockerCap);
      assert.equal(dockerCap.capabilityState, 'EVIDENCE_NEEDED');
      assert.equal(dockerCap.evidenceStrength, 'NONE');
      assert.equal(dockerCap.evidenceGap, 'HIGH');

      // Check Evidence Coverage
      const coverage = profileData.summary.evidenceCoverage;
      assert.ok(coverage);
      assert.ok(coverage.ratio.includes('/'));
      assert.ok(typeof coverage.percentage === 'number');
    });

    it('should produce lightweight summary via getCapabilitySummary', async () => {
      const summaryData = await capabilityService.getCapabilitySummary(userA.id, {
        targetRoleId: roleBackend.id,
      });

      assert.ok(summaryData.targetRole);
      assert.ok(summaryData.summary);
      assert.equal(typeof summaryData.summary.demonstrated, 'number');
      assert.equal(typeof summaryData.summary.evidenceNeeded, 'number');
      assert.equal(summaryData.capabilities, undefined); // summary does not return full capabilities array
    });

    it('should produce detailed capability analysis via getCapabilityDetail', async () => {
      const detail = await capabilityService.getCapabilityDetail(userA.id, skillJava.id, {
        targetRoleId: roleBackend.id,
      });

      assert.equal(detail.skill.name, 'Java');
      assert.equal(detail.capabilityState, 'DEMONSTRATED');
      assert.ok(detail.evidence.length >= 2);
      assert.ok(detail.recommendedNextAction);
      assert.ok(detail.recencyText);
    });
  });

  describe('3. Evidence Ownership & Tenant Security', () => {
    let projB;

    before(async () => {
      projB = await prisma.growthProject.create({
        data: {
          profileId: profileB.id,
          title: 'Candidate B Private Project',
          description: 'Top secret system architecture',
          skills: ['AWS Cloud'],
          status: 'COMPLETED',
        },
      });
    });

    it('should allow User A to link evidence to their own profile', async () => {
      const ev = await capabilityService.linkEvidence(userA.id, {
        skillId: skillAWS.id,
        evidenceType: 'PORTFOLIO',
        sourceEntityType: 'ExternalPortfolio',
        title: 'AWS Certified Architecture Diagram',
        description: 'Architected multi-region failover topology',
        evidenceStrength: 'STRONG',
      });

      assert.ok(ev.id);
      assert.equal(ev.skillId, skillAWS.id);

      // Verify it shows up in User A's evidence list
      const list = await capabilityService.getCapabilityEvidenceList(userA.id, { skillId: skillAWS.id });
      assert.ok(list.evidences.some((e) => e.id === ev.id));
    });

    it('should PREVENT User A from linking User B project (Cross-Tenant Authorization Violation)', async () => {
      await assert.rejects(
        async () => {
          await capabilityService.linkEvidence(userA.id, {
            skillId: skillAWS.id,
            evidenceType: 'PROJECT',
            sourceEntityType: 'GrowthProject',
            sourceEntityId: projB.id, // Belongs to User B!
            title: 'Hacked Project Link',
          });
        },
        (err) => {
          return err.statusCode === 403 && err.message.includes('Unauthorized');
        }
      );
    });

    it('should PREVENT User A from unlinking User B evidence', async () => {
      // Create evidence for User B
      const evB = await prisma.capabilityEvidence.create({
        data: {
          profileId: profileB.id,
          skillId: skillAWS.id,
          evidenceType: 'PROJECT',
          sourceEntityType: 'GrowthProject',
          title: 'User B AWS Project',
          verificationStatus: 'PLATFORM_ATTACHED',
        },
      });

      await assert.rejects(
        async () => {
          await capabilityService.unlinkEvidence(userA.id, evB.id); // User A attempts to delete User B evidence
        },
        (err) => {
          return err.statusCode === 403 && err.message.includes('Unauthorized');
        }
      );
    });

    it('should allow User A to unlink their own evidence and trigger recalculation', async () => {
      const ev = await capabilityService.linkEvidence(userA.id, {
        skillId: skillReact.id,
        evidenceType: 'PORTFOLIO',
        sourceEntityType: 'ExternalPortfolio',
        title: 'React Design System Repository',
      });

      const deleteRes = await capabilityService.unlinkEvidence(userA.id, ev.id);
      assert.equal(deleteRes.success, true);

      const listAfter = await capabilityService.getCapabilityEvidenceList(userA.id, { skillId: skillReact.id });
      assert.equal(listAfter.evidences.some((e) => e.id === ev.id), false);
    });
  });

  describe('4. Idempotency & Determinism', () => {
    it('should produce identical results across multiple recalculations with unchanged inputs', async () => {
      const run1 = await capabilityService.getCapabilityProfile(userA.id, { targetRoleId: roleBackend.id });
      const run2 = await capabilityService.getCapabilityProfile(userA.id, { targetRoleId: roleBackend.id });

      assert.deepEqual(run1.summary, run2.summary);
      assert.equal(run1.capabilities.length, run2.capabilities.length);
      for (let i = 0; i < run1.capabilities.length; i++) {
        assert.equal(run1.capabilities[i].capabilityState, run2.capabilities[i].capabilityState);
        assert.equal(run1.capabilities[i].evidenceStrength, run2.capabilities[i].evidenceStrength);
        assert.equal(run1.capabilities[i].evidenceGap, run2.capabilities[i].evidenceGap);
      }
    });
  });
});
