import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { getCapabilityProfile } from './capabilityIntelligence.service.js';
import { FutureCapabilityIntelligenceService } from './futureCapabilityIntelligence.service.js';
import { ApiError } from '../utils/apiError.js';

export const ROADMAP_DISCLAIMER =
  'Adaptive development roadmaps are deterministic planning guides based on your current capability evidence, role requirements, and historical market observations. They do not constitute employment guarantees or formal certifications.';

function normalizeName(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class AdaptiveRoadmapService {
  /**
   * Retrieves active development roadmap or generates one if missing
   */
  static async getActiveRoadmap(userId, options = {}) {
    const { targetRoleId = null, forceRecalculate = false } = options;

    const profile = await getProfile(userId);
    const roleId = targetRoleId || profile.targetRoleId || (
      await prisma.role.findFirst({ where: { isActive: true } })
    )?.id;

    if (!roleId) {
      throw ApiError.badRequest('Target role must be selected to generate a development roadmap', 'TARGET_ROLE_REQUIRED');
    }

    if (!forceRecalculate) {
      const activeRoadmap = await prisma.developmentRoadmap.findFirst({
        where: {
          userId,
          targetRoleId: roleId,
          status: 'ACTIVE',
        },
        include: {
          targetRole: true,
          plans: {
            include: {
              skill: true,
              stages: true,
            },
          },
          stages: {
            include: {
              skill: true,
            },
          },
          reevaluations: true,
        },
      });

      if (activeRoadmap) {
        const nextBestAction = this._deriveNextBestAction(activeRoadmap);
        return {
          ...activeRoadmap,
          nextBestAction,
          disclaimer: ROADMAP_DISCLAIMER,
        };
      }
    }

    return this.generateRoadmap(userId, {
      targetRoleId: roleId,
      reason: forceRecalculate ? 'MANUAL_RECALCULATION' : 'INITIAL_GENERATION',
    });
  }

  /**
   * Generates a personalized, adaptive capability development roadmap
   */
  static async generateRoadmap(userId, { targetRoleId = null, reason = 'INITIAL_GENERATION', triggerEntity = null } = {}) {
    const profile = await getProfile(userId);
    const roleId = targetRoleId || profile.targetRoleId;

    if (!roleId) {
      throw ApiError.badRequest('Target role must be specified for roadmap generation', 'TARGET_ROLE_REQUIRED');
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        roleSkills: {
          include: { skill: true },
        },
      },
    });

    if (!role) {
      throw ApiError.notFound(`Target Role with ID '${roleId}' not found`, 'ROLE_NOT_FOUND');
    }

    // 1. Fetch Phase 38 Capability Intelligence Profile
    const capabilityProfile = await getCapabilityProfile(userId, { targetRoleId: roleId });

    // 2. Fetch Phase 39 Future Capability Intelligence
    let futureIntel = null;
    try {
      futureIntel = await FutureCapabilityIntelligenceService.getRoleFutureCapabilities(userId, roleId);
    } catch {
      futureIntel = null;
    }

    // 3. Find previous active roadmap to preserve completed stages and track versioning
    const prevRoadmap = await prisma.developmentRoadmap.findFirst({
      where: {
        userId,
        targetRoleId: roleId,
        status: 'ACTIVE',
      },
      include: {
        plans: true,
        stages: true,
      },
    });

    // Map previously completed stages by key `${skillId}_${stageType}`
    const previousCompletedStageMap = new Map();
    if (prevRoadmap?.stages) {
      prevRoadmap.stages.forEach((st) => {
        if (st.status === 'COMPLETED') {
          const key = `${st.skillId}_${st.stageType}`;
          previousCompletedStageMap.set(key, st);
        }
      });
    }

    // 4. Construct Capability Development Plans
    const plansToCreate = [];
    const stagesToCreate = [];
    const changes = [];

    const futureCapsMap = new Map();
    if (futureIntel?.allCapabilities) {
      futureIntel.allCapabilities.forEach((fc) => {
        futureCapsMap.set(fc.skill.id, fc);
        futureCapsMap.set(normalizeName(fc.skill.name), fc);
      });
    }

    const capabilities = capabilityProfile.capabilities || [];

    // Sort capabilities: REQUIRED first, then by priority score descending
    const evaluatedCaps = capabilities.map((cap) => {
      const fc = futureCapsMap.get(cap.skill.id) || futureCapsMap.get(normalizeName(cap.skill.name));
      const roleReq = cap.targetRequirement || 'SUPPORTING';
      const capState = cap.capabilityState;
      const evGap = cap.evidenceGap;
      const mktSignal = fc?.marketSignal || 'STABLE';

      // Determine Development Need Type
      let developmentNeed = 'KNOWLEDGE_GAP';
      if (cap.proficiency === 'NONE') {
        developmentNeed = 'KNOWLEDGE_GAP';
      } else if (capState === 'DEMONSTRATED' && cap.skillGapSteps <= 0) {
        developmentNeed = 'TARGET_PROFICIENCY_GAP';
      } else if ((capState === 'SELF_REPORTED' || capState === 'EVIDENCE_NEEDED') && cap.skillGapSteps <= 0 && (evGap === 'HIGH' || evGap === 'MODERATE')) {
        developmentNeed = 'EVIDENCE_GAP';
      } else if (cap.proficiency !== 'NONE' && capState === 'DEVELOPING') {
        developmentNeed = 'PRACTICE_GAP';
      } else if (cap.proficiency !== 'NONE' && cap.skillGapSteps > 0) {
        developmentNeed = 'TARGET_PROFICIENCY_GAP';
      } else if (cap.proficiency !== 'NONE' && (capState === 'SELF_REPORTED' || capState === 'EVIDENCE_NEEDED')) {
        developmentNeed = 'APPLICATION_GAP';
      } else if (roleReq === 'SUPPORTING' || !cap.isTargetRoleRequirement) {
        developmentNeed = 'FUTURE_RELEVANCE_GAP';
      } else {
        developmentNeed = 'KNOWLEDGE_GAP';
      }

      // Determine Development Priority
      let priority = 'LOW';
      let priorityScore = 10;

      if (roleReq === 'REQUIRED' && capState !== 'DEMONSTRATED' && (mktSignal === 'GROWING' || mktSignal === 'EMERGING')) {
        priority = 'CRITICAL';
        priorityScore = 95;
      } else if (roleReq === 'REQUIRED' && (capState === 'EVIDENCE_NEEDED' || capState === 'SELF_REPORTED')) {
        priority = 'HIGH';
        priorityScore = 85;
      } else if (roleReq === 'PREFERRED' && capState !== 'DEMONSTRATED') {
        priority = 'MEDIUM';
        priorityScore = 65;
      } else if (mktSignal === 'EMERGING' && (roleReq === 'SUPPORTING' || !cap.isTargetRoleRequirement)) {
        priority = 'MONITOR';
        priorityScore = 45;
      } else if (capState === 'DEMONSTRATED') {
        priority = 'LOW';
        priorityScore = 15;
      }

      // Determine Plan Status
      let planStatus = 'NOT_STARTED';
      if (capState === 'DEMONSTRATED' && cap.skillGapSteps <= 0) {
        planStatus = 'COMPLETED';
      } else if (capState === 'DEVELOPING' || cap.independentSourceCount > 0) {
        planStatus = 'IN_PROGRESS';
      }

      return {
        cap,
        fc,
        roleReq,
        capState,
        evGap,
        mktSignal,
        developmentNeed,
        priority,
        priorityScore,
        planStatus,
      };
    });

    evaluatedCaps.sort((a, b) => b.priorityScore - a.priorityScore);

    let planOrder = 1;
    for (const item of evaluatedCaps) {
      const { cap, fc, roleReq, capState, evGap, mktSignal, developmentNeed, priority, priorityScore, planStatus } = item;
      const skill = cap.skill;

      // Plan explainability reasons
      const reasons = [];
      reasons.push(`${roleReq} competency for target ${role.name} benchmark.`);
      if (mktSignal === 'GROWING' || mktSignal === 'EMERGING') {
        reasons.push(`Market demand signal: ${mktSignal} (+${fc?.growthRate || 0}% observed trend).`);
      } else {
        reasons.push(`Stable market requirement in observed dataset.`);
      }

      if (developmentNeed === 'EVIDENCE_GAP') {
        reasons.push(`Proficiency claimed (${cap.proficiency}), but demonstrable implementation evidence is currently missing.`);
      } else if (developmentNeed === 'KNOWLEDGE_GAP') {
        reasons.push(`Foundational concepts and syntax required.`);
      } else if (developmentNeed === 'PRACTICE_GAP') {
        reasons.push(`Learning exposure present; hands-on exercises required.`);
      } else if (capState === 'DEMONSTRATED') {
        reasons.push(`Demonstrated capability with verified project/experience evidence.`);
      }

      let nextAction = `Build and validate project evidence for ${skill.name}.`;
      if (developmentNeed === 'KNOWLEDGE_GAP') {
        nextAction = `Complete foundational study and interactive exercises for ${skill.name}.`;
      } else if (developmentNeed === 'PRACTICE_GAP') {
        nextAction = `Implement guided exercises and integration scripts using ${skill.name}.`;
      } else if (capState === 'DEMONSTRATED') {
        nextAction = `Maintain competency and benchmark advanced implementations.`;
      }

      const planId = prisma.uuid ? prisma.uuid() : `plan-${Date.now()}-${planOrder}`;
      const planRecord = {
        id: planId,
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        developmentNeed,
        priority,
        priorityScore,
        currentCapabilityState: capState,
        targetProficiency: cap.targetProficiency || 'INTERMEDIATE',
        currentProficiency: cap.proficiency || 'NONE',
        evidenceGap: evGap,
        marketSignal: mktSignal,
        status: planStatus,
        reasons,
        nextAction,
        order: planOrder++,
      };

      plansToCreate.push(planRecord);

      // Generate Stages for this capability based on Development Need
      const skillStages = this._generateStagesForNeed({
        planId,
        skill,
        role,
        developmentNeed,
        capState,
        previousCompletedStageMap,
      });

      skillStages.forEach((st) => stagesToCreate.push(st));
    }

    // 5. Determine Overall Roadmap Metrics
    const totalRequired = capabilities.filter((c) => c.isTargetRoleRequirement && c.targetRequirement === 'REQUIRED').length;
    const coveredRequired = capabilities.filter(
      (c) => c.isTargetRoleRequirement && c.targetRequirement === 'REQUIRED' && (c.capabilityState === 'DEMONSTRATED' || (c.capabilityState === 'DEVELOPING' && c.independentSourceCount > 0))
    ).length;
    const evidenceCoverageRatio = totalRequired > 0 ? `${coveredRequired} / ${totalRequired}` : '0 / 0';
    const alignmentPct = totalRequired > 0 ? Math.round((coveredRequired / totalRequired) * 100) : 75;

    // Identify current focus skill
    const activePlans = plansToCreate.filter((p) => p.status !== 'COMPLETED' && p.status !== 'RETIRED');
    const currentFocusSkillId = activePlans[0]?.skillId || plansToCreate[0]?.skillId || null;

    // Versioning & Change Summary
    const version = prevRoadmap ? (prevRoadmap.version || 1) + 1 : 1;
    let changeSummary = 'Initial adaptive development roadmap generated.';
    if (prevRoadmap) {
      if (reason === 'NEW_EVIDENCE') {
        changeSummary = 'Roadmap re-evaluated following newly attached capability evidence.';
      } else if (reason === 'STAGE_COMPLETED') {
        changeSummary = 'Roadmap updated following completed milestone stage.';
      } else if (reason === 'TARGET_ROLE_CHANGED') {
        changeSummary = `Roadmap re-calibrated for new target role: ${role.name}.`;
      } else {
        changeSummary = 'Roadmap refreshed with current capability and market intelligence.';
      }
    }

    // Persist new DevelopmentRoadmap in database
    const newRoadmapId = prisma.uuid ? prisma.uuid() : `rm-${Date.now()}`;

    // Mark previous roadmap as SUPERSEDED if existing
    if (prevRoadmap) {
      await prisma.developmentRoadmap.update({
        where: { id: prevRoadmap.id },
        data: { status: 'SUPERSEDED' },
      });
    }

    const createdRoadmap = await prisma.developmentRoadmap.create({
      data: {
        id: newRoadmapId,
        userId,
        targetRoleId: role.id,
        version,
        status: 'ACTIVE',
        alignmentPct,
        evidenceCoverageRatio,
        currentFocusSkillId,
        changeReason: reason,
        changeSummary,
        metadata: {
          totalPlans: plansToCreate.length,
          totalStages: stagesToCreate.length,
          completedStagesCount: stagesToCreate.filter((s) => s.status === 'COMPLETED').length,
          triggerEntity,
        },
      },
    });

    // Persist CapabilityDevelopmentPlans
    for (const plan of plansToCreate) {
      await prisma.capabilityDevelopmentPlan.create({
        data: {
          id: plan.id,
          roadmapId: newRoadmapId,
          skillId: plan.skillId,
          developmentNeed: plan.developmentNeed,
          priority: plan.priority,
          priorityScore: plan.priorityScore,
          currentCapabilityState: plan.currentCapabilityState,
          targetProficiency: plan.targetProficiency,
          currentProficiency: plan.currentProficiency,
          evidenceGap: plan.evidenceGap,
          marketSignal: plan.marketSignal,
          status: plan.status,
          reasons: plan.reasons,
          nextAction: plan.nextAction,
          order: plan.order,
        },
      });
    }

    // Persist RoadmapStageProgress
    for (const stage of stagesToCreate) {
      await prisma.roadmapStageProgress.create({
        data: {
          id: stage.id,
          roadmapId: newRoadmapId,
          planId: stage.planId,
          skillId: stage.skillId,
          stageType: stage.stageType,
          title: stage.title,
          objective: stage.objective,
          expectedOutput: stage.expectedOutput,
          evidenceRequirement: stage.evidenceRequirement,
          status: stage.status,
          completedAt: stage.completedAt,
          completedEvidenceId: stage.completedEvidenceId,
          order: stage.order,
        },
      });
    }

    // Log RoadmapReevaluation event
    await prisma.roadmapReevaluation.create({
      data: {
        userId,
        roadmapId: newRoadmapId,
        triggerType: reason,
        triggerEntity,
        previousSnapshot: prevRoadmap ? { id: prevRoadmap.id, version: prevRoadmap.version } : null,
        newSnapshot: { id: newRoadmapId, version, alignmentPct, evidenceCoverageRatio },
        changes,
        status: 'APPLIED',
      },
    });

    // Return full aggregated roadmap
    const completeRoadmap = await prisma.developmentRoadmap.findUnique({
      where: { id: newRoadmapId },
      include: {
        targetRole: true,
        plans: {
          include: {
            skill: true,
            stages: true,
          },
        },
        stages: {
          include: {
            skill: true,
          },
        },
        reevaluations: true,
      },
    });

    const nextBestAction = this._deriveNextBestAction(completeRoadmap);

    return {
      ...completeRoadmap,
      nextBestAction,
      disclaimer: ROADMAP_DISCLAIMER,
    };
  }

  /**
   * Deterministically generates specific stages for a capability based on Development Need
   */
  static _generateStagesForNeed({ planId, skill, role, developmentNeed, capState, previousCompletedStageMap }) {
    const stages = [];
    let order = 1;

    const checkPreviousCompletion = (stageType) => {
      const prev = previousCompletedStageMap.get(`${skill.id}_${stageType}`);
      if (prev) {
        return {
          status: 'COMPLETED',
          completedAt: prev.completedAt || new Date(),
          completedEvidenceId: prev.completedEvidenceId || null,
        };
      }
      return {
        status: capState === 'DEMONSTRATED' ? 'COMPLETED' : 'NOT_STARTED',
        completedAt: capState === 'DEMONSTRATED' ? new Date() : null,
        completedEvidenceId: null,
      };
    };

    // 1. LEARN Stage (Only included if fundamental knowledge gap exists)
    if (developmentNeed === 'KNOWLEDGE_GAP' || developmentNeed === 'FUTURE_RELEVANCE_GAP') {
      const prev = checkPreviousCompletion('LEARN');
      stages.push({
        id: prisma.uuid ? prisma.uuid() : `st-learn-${skill.id}-${Date.now()}`,
        planId,
        skillId: skill.id,
        stageType: 'LEARN',
        title: `Learn ${skill.name} Fundamentals & Architecture`,
        objective: `Understand core syntax, design patterns, and architectural principles of ${skill.name}.`,
        expectedOutput: `Conceptual mastery of ${skill.name} fundamentals.`,
        evidenceRequirement: null,
        status: prev.status,
        completedAt: prev.completedAt,
        completedEvidenceId: prev.completedEvidenceId,
        order: order++,
      });
    }

    // 2. PRACTICE Stage (Included for knowledge gap, practice gap, target proficiency gap)
    if (developmentNeed === 'KNOWLEDGE_GAP' || developmentNeed === 'PRACTICE_GAP' || developmentNeed === 'TARGET_PROFICIENCY_GAP') {
      const prev = checkPreviousCompletion('PRACTICE');
      stages.push({
        id: prisma.uuid ? prisma.uuid() : `st-practice-${skill.id}-${Date.now()}`,
        planId,
        skillId: skill.id,
        stageType: 'PRACTICE',
        title: `Hands-On Practice & Guided Labs — ${skill.name}`,
        objective: `Implement isolated modules, algorithms, and test suites utilizing ${skill.name}.`,
        expectedOutput: `Tested implementation modules demonstrating intermediate application.`,
        evidenceRequirement: null,
        status: prev.status,
        completedAt: prev.completedAt,
        completedEvidenceId: prev.completedEvidenceId,
        order: order++,
      });
    }

    // 3. BUILD Stage (Included for all active development needs)
    const prevBuild = checkPreviousCompletion('BUILD');
    stages.push({
      id: prisma.uuid ? prisma.uuid() : `st-build-${skill.id}-${Date.now()}`,
      planId,
      skillId: skill.id,
      stageType: 'BUILD',
      title: `Build Deliverable Project with ${skill.name}`,
      objective: `Construct and deploy a production-grade application deliverable showcasing ${skill.name}.`,
      expectedOutput: `Functional code repository or project artifact implementing ${skill.name}.`,
      evidenceRequirement: `Project artifact or repository link implementing ${skill.name}`,
      status: prevBuild.status,
      completedAt: prevBuild.completedAt,
      completedEvidenceId: prevBuild.completedEvidenceId,
      order: order++,
    });

    // 4. VALIDATE Stage (Requires verified evidence attachment)
    const prevValidate = checkPreviousCompletion('VALIDATE');
    stages.push({
      id: prisma.uuid ? prisma.uuid() : `st-validate-${skill.id}-${Date.now()}`,
      planId,
      skillId: skill.id,
      stageType: 'VALIDATE',
      title: `Attach Verified Capability Evidence for ${skill.name}`,
      objective: `Connect a completed project, work experience, or assessment artifact to validate capability.`,
      expectedOutput: `Verified evidence attachment in portfolio.`,
      evidenceRequirement: `Platform-attached project or professional experience artifact`,
      status: prevValidate.status,
      completedAt: prevValidate.completedAt,
      completedEvidenceId: prevValidate.completedEvidenceId,
      order: order++,
    });

    // 5. RE_EVALUATE Stage (Triggers closed-loop re-evaluation)
    stages.push({
      id: prisma.uuid ? prisma.uuid() : `st-reeval-${skill.id}-${Date.now()}`,
      planId,
      skillId: skill.id,
      stageType: 'RE_EVALUATE',
      title: `Re-evaluate ${skill.name} Capability State`,
      objective: `Re-run Phase 38 capability intelligence to calibrate updated evidence against ${role.name} criteria.`,
      expectedOutput: `Upgraded capability state and dynamic roadmap re-prioritization.`,
      evidenceRequirement: null,
      status: capState === 'DEMONSTRATED' ? 'COMPLETED' : 'NOT_STARTED',
      completedAt: capState === 'DEMONSTRATED' ? new Date() : null,
      completedEvidenceId: null,
      order: order++,
    });

    return stages;
  }

  /**
   * Completes a roadmap stage with evidence validation
   */
  static async completeStage(userId, roadmapIdOrOptions, maybeStageId = null, maybeOptions = {}) {
    let roadmapId;
    let stageId;
    let completedEvidenceId = null;
    let notes = null;

    if (typeof roadmapIdOrOptions === 'object' && roadmapIdOrOptions !== null) {
      roadmapId = roadmapIdOrOptions.roadmapId;
      stageId = roadmapIdOrOptions.stageId;
      completedEvidenceId = roadmapIdOrOptions.completedEvidenceId || null;
      notes = roadmapIdOrOptions.notes || null;
    } else {
      roadmapId = roadmapIdOrOptions;
      stageId = maybeStageId;
      completedEvidenceId = maybeOptions?.completedEvidenceId || null;
      notes = maybeOptions?.notes || null;
    }

    const roadmap = await prisma.developmentRoadmap.findUnique({
      where: { id: roadmapId },
      include: { stages: true, plans: true },
    });

    if (!roadmap) {
      throw ApiError.notFound(`Roadmap with ID '${roadmapId}' not found`, 'ROADMAP_NOT_FOUND');
    }

    if (roadmap.userId !== userId) {
      throw ApiError.forbidden('You are not authorized to modify this development roadmap', 'FORBIDDEN');
    }

    const stage = await prisma.roadmapStageProgress.findUnique({
      where: { id: stageId },
      include: { skill: true },
    });

    if (!stage || stage.roadmapId !== roadmapId) {
      throw ApiError.notFound(`Roadmap stage with ID '${stageId}' not found on this roadmap`, 'STAGE_NOT_FOUND');
    }

    // VALIDATION INTEGRITY GUARD: If stage is VALIDATE, verify legitimate evidence exists
    if (stage.stageType === 'VALIDATE') {
      let validEvidence = null;
      if (completedEvidenceId) {
        validEvidence = await prisma.capabilityEvidence.findUnique({
          where: { id: completedEvidenceId },
        });
      } else {
        validEvidence = await prisma.capabilityEvidence.findFirst({
          where: { skillId: stage.skillId },
        });
      }

      if (!validEvidence) {
        throw ApiError.badRequest(
          `Cannot complete VALIDATE stage for '${stage.skill?.name || 'skill'}': No verified project or experience evidence artifact attached. Please attach project evidence first.`,
          'EVIDENCE_ATTACHMENT_REQUIRED'
        );
      }

      completedEvidenceId = validEvidence.id;
    }

    // Update Stage to COMPLETED
    const updatedStage = await prisma.roadmapStageProgress.update({
      where: { id: stageId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completedEvidenceId,
      },
    });

    // Re-evaluate roadmap after stage completion
    const reevaluated = await this.generateRoadmap(userId, {
      targetRoleId: roadmap.targetRoleId,
      reason: 'STAGE_COMPLETED',
      triggerEntity: stage.stageType,
    });

    return {
      success: true,
      stage: updatedStage,
      roadmap: reevaluated,
      message: `Completed stage '${stage.title}' successfully.`,
    };
  }

  /**
   * Triggers closed-loop re-evaluation of roadmap from latest capability and market intelligence
   */
  static async reEvaluateRoadmap(userId, { triggerType = 'MANUAL', triggerEntity = null } = {}) {
    const profile = await getProfile(userId);
    const targetRoleId = profile.targetRoleId;

    if (!targetRoleId) {
      throw ApiError.badRequest('Target role must be selected in profile before re-evaluating roadmap', 'TARGET_ROLE_REQUIRED');
    }

    return this.generateRoadmap(userId, {
      targetRoleId,
      reason: triggerType,
      triggerEntity,
    });
  }

  /**
   * Derives Next Best Action deterministically from active roadmap plans & stages
   */
  static _deriveNextBestAction(roadmap) {
    if (!roadmap || !roadmap.plans || roadmap.plans.length === 0) {
      return {
        title: 'Select a Target Role to Begin',
        stageType: 'LEARN',
        skillName: 'General Foundations',
        objective: 'Select your target engineering role to initialize your capability roadmap.',
        expectedOutput: 'Configured role benchmark.',
        priorityBadge: 'neutral',
        rationale: 'Target role provides the benchmark criteria for personalized development.',
        ctaText: 'Select Target Role',
        route: '/dashboard/profile',
      };
    }

    const activePlans = roadmap.plans
      .filter((p) => p.status !== 'COMPLETED' && p.status !== 'RETIRED')
      .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

    const topPlan = activePlans[0] || roadmap.plans[0];
    const skillName = topPlan.skill?.name || topPlan.skillName || 'Primary Capability';

    // Find first incomplete stage for this plan
    const planStages = (roadmap.stages || [])
      .filter((s) => s.planId === topPlan.id && s.status !== 'COMPLETED')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const nextStage = planStages[0];

    if (!nextStage) {
      return {
        title: `Maintain ${skillName} Implementations`,
        stageType: 'RE_EVALUATE',
        skillName,
        objective: `All active stages for ${skillName} completed. Maintain and benchmark ongoing capabilities.`,
        expectedOutput: 'Verified portfolio evidence.',
        priorityBadge: 'success',
        rationale: `${skillName} capability targets are satisfied.`,
        ctaText: 'Review Next Priority Plan',
        route: '/dashboard/career-roadmap',
      };
    }

    let priorityBadge = 'danger';
    if (topPlan.priority === 'MEDIUM') priorityBadge = 'warning';
    else if (topPlan.priority === 'MONITOR') priorityBadge = 'brand';

    return {
      title: nextStage.title,
      stageType: nextStage.stageType,
      stageId: nextStage.id,
      roadmapId: roadmap.id,
      planId: topPlan.id,
      skillId: topPlan.skillId,
      skillName,
      objective: nextStage.objective,
      expectedOutput: nextStage.expectedOutput,
      evidenceRequirement: nextStage.evidenceRequirement,
      priority: topPlan.priority,
      priorityBadge,
      rationale: `Why: Required for ${roadmap.targetRole?.name || 'target role'} • ${topPlan.evidenceGap} evidence gap • ${topPlan.marketSignal} market signal.`,
      ctaText: nextStage.stageType === 'VALIDATE' ? 'Attach Project Evidence' : nextStage.stageType === 'BUILD' ? 'Build Project Artifact' : 'Continue Development Path',
      route: `/dashboard/career-roadmap`,
    };
  }

  /**
   * Retrieves version history and re-evaluations for user roadmap
   */
  static async getRoadmapHistory(userId, roadmapId) {
    const roadmaps = await prisma.developmentRoadmap.findMany({
      where: { userId },
      orderBy: { version: 'desc' },
      include: {
        targetRole: true,
        reevaluations: {
          orderBy: { createdAt: 'desc' },
        },
      },
      take: 10,
    });

    return {
      userId,
      totalVersions: roadmaps.length,
      history: roadmaps.map((rm) => ({
        id: rm.id,
        version: rm.version,
        status: rm.status,
        targetRole: rm.targetRole?.name,
        alignmentPct: rm.alignmentPct,
        evidenceCoverageRatio: rm.evidenceCoverageRatio,
        changeReason: rm.changeReason,
        changeSummary: rm.changeSummary,
        generatedAt: rm.generatedAt,
        reevaluations: rm.reevaluations || [],
      })),
    };
  }

  /**
   * Safely migrates frontend localStorage progress (skillsetu_roadmap_progress_v1) into backend
   */
  static async syncLegacyProgress(userId, legacyProgressMap = {}) {
    const activeRoadmap = await this.getActiveRoadmap(userId);
    if (!activeRoadmap || !activeRoadmap.stages) {
      return { syncedCount: 0 };
    }

    let syncedCount = 0;
    for (const [key, isCompleted] of Object.entries(legacyProgressMap)) {
      if (!isCompleted) continue;

      // Match by activity key or skill name token in stage
      const matchingStage = activeRoadmap.stages.find((st) => {
        const normKey = normalizeName(key);
        const normTitle = normalizeName(st.title);
        const normSkill = normalizeName(st.skill?.name || '');
        return normTitle.includes(normKey) || normKey.includes(normSkill);
      });

      if (matchingStage && matchingStage.status !== 'COMPLETED') {
        await prisma.roadmapStageProgress.update({
          where: { id: matchingStage.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
        syncedCount++;
      }
    }

    return {
      syncedCount,
      roadmapId: activeRoadmap.id,
      message: `Successfully synchronized ${syncedCount} legacy progress milestones.`,
    };
  }
}

export default AdaptiveRoadmapService;
