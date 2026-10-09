import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../src/config/db.js';
import {
  FutureCapabilityIntelligenceService,
  FUTURE_CAPABILITY_DISCLAIMER,
} from '../src/services/futureCapabilityIntelligence.service.js';
import { DemandIntelligenceService } from '../src/services/demandIntelligence.service.js';
import { DemandForecastService } from '../src/services/demandForecast.service.js';

describe('Phase 39 — Future Capability Intelligence Engine', () => {
  let user1, profile1;
  let skillJava, skillDocker, skillKubernetes, skillPython, skillNursing;
  let roleBackend;

  before(async () => {
    // 1. Fetch or create test skills
    const skills = await prisma.skill.findMany({ take: 20 });
    skillJava = skills.find((s) => s.name === 'Java') || (await prisma.skill.create({ data: { name: 'Java', category: 'Software Engineering' } }));
    skillDocker = skills.find((s) => s.name === 'Docker') || (await prisma.skill.create({ data: { name: 'Docker', category: 'Software Engineering' } }));
    skillKubernetes = skills.find((s) => s.name === 'Kubernetes') || (await prisma.skill.create({ data: { name: 'Kubernetes', category: 'Software Engineering' } }));
    skillPython = skills.find((s) => s.name === 'Python') || (await prisma.skill.create({ data: { name: 'Python', category: 'Software Engineering' } }));
    skillNursing = skills.find((s) => s.name === 'Clinical Nursing') || (await prisma.skill.create({ data: { name: 'Clinical Nursing', category: 'Healthcare' } }));

    // 2. Fetch or create test role: Backend Software Engineer
    const roles = await prisma.role.findMany({ take: 5 });
    roleBackend = roles.find((r) => r.name.includes('Backend')) || (await prisma.role.create({
      data: {
        name: 'Backend Software Engineer',
        category: 'Software Engineering',
        description: 'Backend system architecture',
      },
    }));

    // Ensure role skills
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
        skillId: skillDocker.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'INTERMEDIATE',
        importance: 85,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillKubernetes.id,
        requirementType: 'SUPPORTING',
        targetProficiency: 'BEGINNER',
        importance: 60,
      },
    });

    // 3. Create Demand Observations for skills
    // Java: Stable demand (100, 102, 105, 104)
    await prisma.skillDemandObservation.deleteMany({ where: { skillId: skillJava.id } });
    for (const [idx, val] of [100, 102, 105, 104].entries()) {
      await prisma.skillDemandObservation.create({
        data: {
          skillId: skillJava.id,
          period: `2025-Q${idx + 1}`,
          demandCount: val,
          sourceType: 'SEEDED',
        },
      });
    }

    // Docker: Growing demand (50, 60, 75, 95)
    await prisma.skillDemandObservation.deleteMany({ where: { skillId: skillDocker.id } });
    for (const [idx, val] of [50, 60, 75, 95].entries()) {
      await prisma.skillDemandObservation.create({
        data: {
          skillId: skillDocker.id,
          period: `2025-Q${idx + 1}`,
          demandCount: val,
          sourceType: 'SEEDED',
        },
      });
    }

    // Kubernetes: Emerging / Growing demand (10, 15, 25, 40)
    await prisma.skillDemandObservation.deleteMany({ where: { skillId: skillKubernetes.id } });
    for (const [idx, val] of [10, 15, 25, 40].entries()) {
      await prisma.skillDemandObservation.create({
        data: {
          skillId: skillKubernetes.id,
          period: `2025-Q${idx + 1}`,
          demandCount: val,
          sourceType: 'SEEDED',
        },
      });
    }

    // Clinical Nursing: Globally growing in Healthcare (200, 250, 310, 400)
    await prisma.skillDemandObservation.deleteMany({ where: { skillId: skillNursing.id } });
    for (const [idx, val] of [200, 250, 310, 400].entries()) {
      await prisma.skillDemandObservation.create({
        data: {
          skillId: skillNursing.id,
          period: `2025-Q${idx + 1}`,
          demandCount: val,
          sourceType: 'IMPORTED',
        },
      });
    }

    // 4. Create User & Profile with Demonstrated Java, but Missing Docker evidence
    user1 = await prisma.user.create({
      data: {
        email: `candidate-fc-${Date.now()}@test.com`,
        passwordHash: 'hashed_pw',
        accountType: 'INDIVIDUAL',
        isActive: true,
      },
    });

    profile1 = await prisma.individualProfile.create({
      data: {
        userId: user1.id,
        fullName: 'Candidate One',
        targetRoleId: roleBackend.id,
      },
    });

    // Add user skills
    await prisma.userSkill.create({
      data: {
        profileId: profile1.id,
        skillId: skillJava.id,
        proficiency: 'ADVANCED',
        isDeclared: true,
      },
    });

    await prisma.userSkill.create({
      data: {
        profileId: profile1.id,
        skillId: skillDocker.id,
        proficiency: 'BEGINNER',
        isDeclared: true,
      },
    });

    // Add verified project evidence for Java
    await prisma.capabilityEvidence.create({
      data: {
        profileId: profile1.id,
        skillId: skillJava.id,
        evidenceType: 'PROJECT',
        sourceEntityType: 'GrowthProject',
        sourceEntityId: 'proj-java-1',
        title: 'High Concurrency Java Service',
        description: 'Engineered microservice with thread pools',
        evidenceStrength: 'STRONG',
        evidenceDepth: 'CORE_TO_PROJECT',
        verificationStatus: 'VALIDATED',
        occurredAt: new Date(),
        provenance: 'PROJECT_ASSOCIATED',
      },
    });
  });

  it('1. Correctly classifies market signals (GROWING, STABLE, EMERGING) using repository thresholds', async () => {
    const javaDemand = await DemandIntelligenceService.getSkillDemand(skillJava.id);
    const dockerDemand = await DemandIntelligenceService.getSkillDemand(skillDocker.id);

    assert.equal(javaDemand.trendCategory, 'STABLE', 'Java should be classified as STABLE');
    assert.equal(dockerDemand.trendCategory, 'GROWING', 'Docker should be classified as GROWING');
  });

  it('2. Evaluates role future capabilities and segments into Current Core, Near-Term, and Emerging', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    assert.ok(res.targetRole, 'Response contains targetRole');
    assert.equal(res.targetRole.name, roleBackend.name);
    assert.ok(Array.isArray(res.horizons), 'Response contains horizons array');
    assert.equal(res.horizons.length, 3, 'Contains 3 horizon buckets');

    const currentCore = res.horizons.find((h) => h.id === 'current-core');
    const nearTerm = res.horizons.find((h) => h.id === 'near-term');
    const emerging = res.horizons.find((h) => h.id === 'emerging-direction');

    assert.ok(currentCore.items.some((i) => i.skill.name === 'Java'), 'Java is in Current Core');
    assert.ok(nearTerm.items.some((i) => i.skill.name === 'Docker'), 'Docker is in Near-Term Development');
    assert.ok(emerging.items.some((i) => i.skill.name === 'Kubernetes'), 'Kubernetes is in Emerging Direction');
  });

  it('3. Assigns HIGH development priority to REQUIRED + GROWING skills with EVIDENCE_NEEDED', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    const dockerCap = res.allCapabilities.find((c) => c.skill.name === 'Docker');
    assert.ok(dockerCap, 'Docker capability is present');
    assert.equal(dockerCap.roleRelevance, 'REQUIRED', 'Docker is REQUIRED for role');
    assert.equal(dockerCap.marketSignal, 'GROWING', 'Docker has GROWING market signal');
    assert.equal(dockerCap.developmentPriority, 'HIGH', 'Docker has HIGH development priority');
    assert.equal(dockerCap.priorityBadge, 'danger');
  });

  it('4. Assigns LOW development priority to REQUIRED + STABLE skills that are already DEMONSTRATED', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    const javaCap = res.allCapabilities.find((c) => c.skill.name === 'Java');
    assert.ok(javaCap, 'Java capability is present');
    assert.equal(javaCap.roleRelevance, 'REQUIRED');
    assert.equal(javaCap.candidateState.capabilityState, 'DEMONSTRATED');
    assert.equal(javaCap.developmentPriority, 'LOW', 'Demonstrated Java has LOW development priority');
  });

  it('5. PREVENTS TREND-CHASING: Globally growing unrelated skills (Nursing) must NOT become high priority for Backend Engineer', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    const nursingCap = res.allCapabilities.find((c) => c.skill.name === 'Clinical Nursing');
    assert.equal(nursingCap, undefined, 'Unrelated Healthcare skill is excluded from Backend Software Engineer horizon universe');

    // Verify priority gaps list does not contain unrelated skill
    assert.ok(!res.futureRelevantGaps.some((g) => g.skill.name === 'Clinical Nursing'));
  });

  it('6. Produces transparent multi-point explanations for future-relevant capability gaps', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    const dockerGap = res.futureRelevantGaps.find((g) => g.skill.name === 'Docker');
    assert.ok(dockerGap, 'Docker is identified as a future-relevant gap');
    assert.ok(dockerGap.reasons.length >= 3, 'Contains transparent multi-point reasons');
    assert.ok(dockerGap.reasons.some((r) => r.includes('REQUIRED')), 'Explanation notes role requirement');
    assert.ok(dockerGap.reasons.some((r) => r.includes('demand growth')), 'Explanation notes market trajectory');
    assert.ok(dockerGap.nextAction.includes('Docker'), 'Includes concrete next action');
  });

  it('7. Exposes statistical forecast metadata and provenance without fabricating data', async () => {
    const res = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(user1.id, roleBackend.id);

    const dockerCap = res.allCapabilities.find((c) => c.skill.name === 'Docker');
    assert.ok(dockerCap.forecast, 'Forecast object is present');
    assert.equal(dockerCap.forecast.provenance, 'FORECAST');
    assert.ok(dockerCap.forecast.model, 'Identifies forecast model used');
    assert.equal(res.provenance.methodology, 'STATISTICAL_OBSERVATIONS_AND_TIME_SERIES_FORECAST');
    assert.equal(res.disclaimer, FUTURE_CAPABILITY_DISCLAIMER);
  });

  it('8. Gracefully handles insufficient data without creating fake forecasts', async () => {
    // Create skill with zero or single demand observation
    const emptySkill = await prisma.skill.create({
      data: { name: `Rare Skill ${Date.now()}`, category: 'Emerging Tech' },
    });

    const detail = await FutureCapabilityIntelligenceService.getSkillFutureCapabilityDetail(user1.id, emptySkill.id);
    assert.equal(detail.marketSignal, 'INSUFFICIENT_DATA');
    assert.equal(detail.forecast.forecastStatus, 'INSUFFICIENT_DATA');
    assert.equal(detail.forecast.forecasts.length, 0);
  });

  it('9. Supports organization workforce capability horizon without employee scoring', async () => {
    const orgRes = await FutureCapabilityIntelligenceService.getWorkforceFutureCapabilities('org-test-1');

    assert.ok(Array.isArray(orgRes.horizons), 'Contains workforce horizons');
    assert.ok(orgRes.horizons.length >= 3);
    assert.ok(orgRes.allCapabilities.length > 0);

    // Verify each item has strategic intervention
    const firstCap = orgRes.allCapabilities[0];
    assert.ok(['UPSKILL', 'HIRE_UPSKILL', 'UPSKILL_HIRE', 'REDISTRIBUTE', 'HIRE'].includes(firstCap.intervention));
    assert.ok(firstCap.planningReason.includes('coverage'));
    assert.equal(orgRes.disclaimer, FUTURE_CAPABILITY_DISCLAIMER);
  });
});
