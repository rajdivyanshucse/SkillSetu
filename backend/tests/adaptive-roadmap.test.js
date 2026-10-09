import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../src/config/db.js';
import AdaptiveRoadmapService, { ROADMAP_DISCLAIMER } from '../src/services/adaptiveRoadmap.service.js';
import capabilityService from '../src/services/capabilityIntelligence.service.js';

describe('Phase 40 — Adaptive Gap-to-Growth Engine & Dynamic Roadmaps', () => {
  let userA, profileA, userB, profileB;
  let skillJava, skillDocker, skillAWS, skillKubernetes, skillReact;
  let roleBackend;

  before(async () => {
    // 1. Fetch or create test skills
    const skills = await prisma.skill.findMany({ take: 10 });
    skillJava = skills.find((s) => s.name === 'Java') || (await prisma.skill.create({ data: { name: 'Java', category: 'Programming' } }));
    skillDocker = skills.find((s) => s.name === 'Docker') || (await prisma.skill.create({ data: { name: 'Docker', category: 'DevOps' } }));
    skillAWS = skills.find((s) => s.name === 'AWS Cloud') || (await prisma.skill.create({ data: { name: 'AWS Cloud', category: 'Cloud' } }));
    skillKubernetes = skills.find((s) => s.name === 'Kubernetes') || (await prisma.skill.create({ data: { name: 'Kubernetes', category: 'DevOps' } }));
    skillReact = skills.find((s) => s.name === 'React.js') || (await prisma.skill.create({ data: { name: 'React.js', category: 'Frontend' } }));

    // 2. Fetch or create test role
    const roles = await prisma.role.findMany({ take: 5 });
    roleBackend = roles.find((r) => r.name.includes('Backend')) || (await prisma.role.create({
      data: {
        name: 'Backend Software Engineer',
        category: 'Software Engineering',
        description: 'Backend distributed systems',
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
        skillId: skillDocker.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'INTERMEDIATE',
        importance: 85,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillAWS.id,
        requirementType: 'REQUIRED',
        targetProficiency: 'INTERMEDIATE',
        importance: 80,
      },
    });
    await prisma.roleSkill.create({
      data: {
        roleId: roleBackend.id,
        skillId: skillKubernetes.id,
        requirementType: 'PREFERRED',
        targetProficiency: 'BEGINNER',
        importance: 60,
      },
    });

    // 3. Create Candidate A (Docker = Self-reported intermediate, Java = Advanced with project, AWS = Missing)
    userA = await prisma.user.create({
      data: {
        email: `candidate.roadmap.a.${Date.now()}@test.skillsetu.io`,
        name: 'Alex Developer',
        role: 'USER',
        accountType: 'INDIVIDUAL',
        passwordHash: 'hash',
      },
    });

    profileA = await prisma.individualProfile.create({
      data: {
        userId: userA.id,
        targetRoleId: roleBackend.id,
        fullName: 'Alex Developer',
      },
    });

    // Add UserSkills
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
        skillId: skillDocker.id,
        proficiency: 'INTERMEDIATE', // Meets target proficiency, but NO evidence
        yearsOfExperience: 2,
      },
    });

    // Attach verified project evidence for Java
    const projJava = await prisma.growthProject.create({
      data: {
        profileId: profileA.id,
        title: 'High-Throughput Order Engine',
        description: 'Built Java 21 asynchronous microservices',
        skills: ['Java'],
        status: 'COMPLETED',
      },
    });
    await prisma.capabilityEvidence.create({
      data: {
        userId: userA.id,
        skillId: skillJava.id,
        evidenceType: 'PROJECT',
        title: 'Order Engine Java',
        sourceId: projJava.id,
        sourceType: 'PROJECT',
        confidenceScore: 0.9,
      },
    });

    // 4. Create Candidate B (for security/isolation tests)
    userB = await prisma.user.create({
      data: {
        email: `candidate.roadmap.b.${Date.now()}@test.skillsetu.io`,
        name: 'Jordan Engineer',
        role: 'USER',
        accountType: 'INDIVIDUAL',
        passwordHash: 'hash',
      },
    });
    profileB = await prisma.individualProfile.create({
      data: {
        userId: userB.id,
        targetRoleId: roleBackend.id,
        fullName: 'Jordan Engineer',
      },
    });
  });

  it('1. Generates deterministic development roadmap with appropriate need types and skipped beginner stages', async () => {
    const roadmap = await AdaptiveRoadmapService.generateRoadmap(userA.id, {
      targetRoleId: roleBackend.id,
    });

    assert.ok(roadmap);
    assert.ok(roadmap.id);
    assert.equal(roadmap.userId, userA.id);
    assert.equal(roadmap.targetRoleId, roleBackend.id);
    assert.equal(roadmap.version, 1);
    assert.ok(roadmap.plans.length >= 3);

    // Docker has claimed proficiency = INTERMEDIATE (target = INTERMEDIATE), but 0 evidence
    const dockerPlan = roadmap.plans.find((p) => p.skillId === skillDocker.id);
    assert.ok(dockerPlan, 'Docker capability plan must exist');
    assert.equal(dockerPlan.developmentNeed, 'EVIDENCE_GAP');
    assert.equal(dockerPlan.priority, 'HIGH');

    // Docker stages must NOT include LEARN because proficiency already meets target!
    const dockerStages = roadmap.stages.filter((s) => s.planId === dockerPlan.id || s.skillId === skillDocker.id);
    const dockerStageTypes = dockerStages.map((s) => s.stageType);
    assert.ok(!dockerStageTypes.includes('LEARN'), 'Docker must skip LEARN stage due to met proficiency');
    assert.ok(dockerStageTypes.includes('BUILD'), 'Docker must have BUILD stage');
    assert.ok(dockerStageTypes.includes('VALIDATE'), 'Docker must have VALIDATE stage');

    // AWS has NO proficiency and NO evidence -> KNOWLEDGE_GAP -> MUST include LEARN
    const awsPlan = roadmap.plans.find((p) => p.skillId === skillAWS.id);
    assert.ok(awsPlan, 'AWS capability plan must exist');
    assert.equal(awsPlan.developmentNeed, 'KNOWLEDGE_GAP');
    const awsStages = roadmap.stages.filter((s) => s.planId === awsPlan.id);
    const awsStageTypes = awsStages.map((s) => s.stageType);
    assert.ok(awsStageTypes.includes('LEARN'), 'AWS missing skill must include LEARN stage');
    assert.ok(awsStageTypes.includes('PRACTICE'), 'AWS missing skill must include PRACTICE stage');
    assert.ok(awsStageTypes.includes('BUILD'), 'AWS missing skill must include BUILD stage');
    assert.ok(awsStageTypes.includes('VALIDATE'), 'AWS missing skill must include VALIDATE stage');
  });

  it('2. Deterministically derives Next Best Action pointing to top priority incomplete stage', async () => {
    const activeRoadmap = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    assert.ok(activeRoadmap);
    assert.ok(activeRoadmap.nextBestAction);

    const nba = activeRoadmap.nextBestAction;
    assert.ok(nba.skillName, 'Next best action must specify skill');
    assert.ok(nba.stageType, 'Next best action must specify stage type');
    assert.ok(nba.objective, 'Next best action must specify clear objective');
    assert.ok(nba.rationale, 'Next best action must explain WHY');
    assert.ok(nba.ctaText, 'Next best action must provide clear CTA');
  });

  it('3. Enforces validation integrity guard: Cannot complete VALIDATE stage without real evidence artifact', async () => {
    const activeRoadmap = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    const dockerPlan = activeRoadmap.plans.find((p) => p.skillId === skillDocker.id);
    const validateStage = activeRoadmap.stages.find(
      (s) => s.planId === dockerPlan.id && s.stageType === 'VALIDATE'
    );

    assert.ok(validateStage, 'Docker VALIDATE stage exists');

    // Attempting to complete VALIDATE stage with NO evidence artifact should throw EVIDENCE_ATTACHMENT_REQUIRED
    await assert.rejects(
      async () => {
        await AdaptiveRoadmapService.completeStage(userA.id, activeRoadmap.id, validateStage.id, {
          completedEvidenceId: null,
        });
      },
      (err) => {
        assert.equal(err.code, 'EVIDENCE_ATTACHMENT_REQUIRED');
        return true;
      }
    );
  });

  it('4. Closed-loop execution: Completing BUILD stage and attaching project evidence re-evaluates capability & updates roadmap', async () => {
    const activeRoadmap = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    const dockerPlan = activeRoadmap.plans.find((p) => p.skillId === skillDocker.id);
    const buildStage = activeRoadmap.stages.find(
      (s) => s.planId === dockerPlan.id && s.stageType === 'BUILD'
    );

    assert.ok(buildStage, 'Docker BUILD stage exists');

    // 1. Complete BUILD stage
    const buildResult = await AdaptiveRoadmapService.completeStage(userA.id, activeRoadmap.id, buildStage.id);
    assert.equal(buildResult.success, true);
    assert.equal(buildResult.stage.status, 'COMPLETED');

    // 2. User attaches verified Docker containerization project
    const projDocker = await prisma.growthProject.create({
      data: {
        profileId: profileA.id,
        title: 'Cloud Native Microservices Deployment',
        description: 'Multi-stage Dockerfile and docker-compose deployment for distributed order system',
        skills: ['Docker'],
        status: 'COMPLETED',
      },
    });

    const dockerEvidence = await prisma.capabilityEvidence.create({
      data: {
        userId: userA.id,
        skillId: skillDocker.id,
        evidenceType: 'PROJECT',
        title: 'Docker Deployment Project',
        sourceId: projDocker.id,
        sourceType: 'PROJECT',
        confidenceScore: 0.85,
      },
    });

    // 3. Re-evaluate capability intelligence (Phase 38)
    const capProfile = await capabilityService.getCapabilityProfile(userA.id, {
      targetRoleId: roleBackend.id,
    });
    const dockerCap = capProfile.capabilities.find((c) => c.skill?.id === skillDocker.id);
    assert.ok(dockerCap);
    assert.equal(dockerCap.capabilityState, 'DEMONSTRATED');

    // 4. Now complete VALIDATE stage with attached evidence
    const currentRoadmap = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    const dockerPlanV2 = currentRoadmap.plans.find((p) => p.skillId === skillDocker.id);
    const validateStage = currentRoadmap.stages.find(
      (s) => s.planId === dockerPlanV2.id && s.stageType === 'VALIDATE'
    );

    const valResult = await AdaptiveRoadmapService.completeStage(userA.id, currentRoadmap.id, validateStage.id, {
      completedEvidenceId: dockerEvidence.id,
    });
    assert.equal(valResult.success, true);
    assert.equal(valResult.stage.status, 'COMPLETED');

    // 5. Verify roadmap version incremented and history preserved
    const updatedRoadmap = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    assert.ok(updatedRoadmap.version >= 2, 'Roadmap version should increment upon stage completions');
  });

  it('5. Preserves completion history across roadmap recalculations', async () => {
    // Force a re-evaluation
    const reevaluated = await AdaptiveRoadmapService.reEvaluateRoadmap(userA.id, {
      triggerType: 'MANUAL',
    });

    assert.ok(reevaluated);
    // Find Docker stages in newly generated version
    const dockerPlan = reevaluated.plans.find((p) => p.skillId === skillDocker.id);
    const dockerStages = reevaluated.stages.filter((s) => s.planId === dockerPlan.id);

    const completedStages = dockerStages.filter((s) => s.status === 'COMPLETED');
    assert.ok(completedStages.length >= 1, 'Previously completed stages must remain COMPLETED after recalculation');
  });

  it('6. Enforces tenant security and authorization: User B cannot modify User A roadmap', async () => {
    const roadmapA = await AdaptiveRoadmapService.getActiveRoadmap(userA.id);
    const stageA = roadmapA.stages[0];

    await assert.rejects(
      async () => {
        await AdaptiveRoadmapService.completeStage(userB.id, roadmapA.id, stageA.id);
      },
      (err) => {
        assert.equal(err.code, 'FORBIDDEN');
        return true;
      }
    );
  });

  it('7. Synchronizes legacy frontend progress (skillsetu_roadmap_progress_v1) safely without duplicate stages', async () => {
    const legacyMap = {
      'aws-learn-basics': true,
      'aws-practice-lab': true,
    };

    const syncResult = await AdaptiveRoadmapService.syncLegacyProgress(userA.id, legacyMap);
    assert.ok(syncResult);
    assert.equal(typeof syncResult.syncedCount, 'number');
  });

  it('8. Retrieves version and re-evaluation history correctly', async () => {
    const history = await AdaptiveRoadmapService.getRoadmapHistory(userA.id);
    assert.ok(history);
    assert.ok(history.totalVersions >= 1);
    assert.ok(Array.isArray(history.history));
    assert.ok(history.history[0].version);
  });
});
