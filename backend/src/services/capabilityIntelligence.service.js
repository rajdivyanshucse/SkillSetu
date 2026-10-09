import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { calculateSkillCoverage } from './skillIntelligence.service.js';
import { ApiError } from '../utils/apiError.js';

const PROFICIENCY_LEVELS = {
  NONE: 0,
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

function normalizeName(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Format recency from a date
 */
function formatRecency(date) {
  if (!date) return 'Not recorded';
  const now = new Date();
  const d = new Date(date);
  const diffMonths = Math.max(0, Math.round((now - d) / (1000 * 60 * 60 * 24 * 30.4375)));
  if (diffMonths === 0) return 'Recent (this month)';
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  const rem = diffMonths % 12;
  return rem > 0 ? `${diffYears}y ${rem}m ago` : `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Harvests all platform evidence for a profile:
 * 1. Explicit CapabilityEvidence table rows
 * 2. GrowthProject associations
 * 3. Work Experience associations
 * 4. LearningProgress associations
 * Deduplicated by (sourceEntityType, sourceEntityId, skillId).
 */
export async function harvestProfileEvidence(profile) {
  const profileId = profile.id;
  const harvested = [];
  const seenKey = new Set();

  // 1. Explicit CapabilityEvidence rows
  const explicitEvidences = (await prisma.capabilityEvidence.findMany({
    where: { profileId },
    include: { skill: true },
  })) || [];

  explicitEvidences.forEach((ce) => {
    const key = `${ce.sourceEntityType}_${ce.sourceEntityId || 'manual'}_${ce.skillId}`;
    if (!seenKey.has(key)) {
      seenKey.add(key);
      harvested.push({
        id: ce.id,
        skillId: ce.skillId,
        skillName: ce.skill?.name || 'Skill',
        evidenceType: ce.evidenceType,
        sourceEntityType: ce.sourceEntityType,
        sourceEntityId: ce.sourceEntityId,
        title: ce.title,
        description: ce.description,
        evidenceStrength: ce.evidenceStrength,
        evidenceDepth: ce.evidenceDepth,
        verificationStatus: ce.verificationStatus,
        occurredAt: ce.occurredAt,
        provenance: ce.provenance,
        createdAt: ce.createdAt,
      });
    }
  });

  // Helper map for skill name -> skill object in catalog
  const catalogSkills = (await prisma.skill.findMany({ where: { isActive: true } })) || [];
  const catalogMap = new Map();
  catalogSkills.forEach((s) => {
    catalogMap.set(normalizeName(s.name), s);
  });

  // 2. GrowthProject evidence
  const projects = profile.projects || [];
  projects.forEach((proj) => {
    const projSkills = Array.isArray(proj.skills) ? proj.skills : [];
    projSkills.forEach((skillName) => {
      const norm = normalizeName(skillName);
      const skill = catalogMap.get(norm);
      if (skill) {
        const key = `GrowthProject_${proj.id}_${skill.id}`;
        if (!seenKey.has(key)) {
          seenKey.add(key);
          const isCompleted = proj.status === 'COMPLETED' || proj.status === 'Completed';
          harvested.push({
            id: `proj-ev-${proj.id}-${skill.id}`,
            skillId: skill.id,
            skillName: skill.name,
            evidenceType: 'PROJECT',
            sourceEntityType: 'GrowthProject',
            sourceEntityId: proj.id,
            title: proj.title,
            description: proj.description || `Applied in project: ${proj.title}`,
            evidenceStrength: isCompleted ? 'MODERATE' : 'LIMITED',
            evidenceDepth: 'BUILT_WITH',
            verificationStatus: 'PLATFORM_ATTACHED',
            occurredAt: proj.updatedAt || proj.createdAt,
            provenance: 'PROJECT_ASSOCIATED',
            createdAt: proj.createdAt,
          });
        }
      }
    });
  });

  // 3. Experience evidence
  const experiences = profile.experiences || [];
  experiences.forEach((exp) => {
    const combinedText = `${exp.roleTitle || ''} ${exp.description || ''}`.toLowerCase();
    catalogSkills.forEach((skill) => {
      const sName = skill.name.toLowerCase();
      // Match whole word or exact token in experience description
      const regex = new RegExp(`\\b${sName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(combinedText)) {
        const key = `Experience_${exp.id}_${skill.id}`;
        if (!seenKey.has(key)) {
          seenKey.add(key);
          harvested.push({
            id: `exp-ev-${exp.id}-${skill.id}`,
            skillId: skill.id,
            skillName: skill.name,
            evidenceType: 'EXPERIENCE',
            sourceEntityType: 'Experience',
            sourceEntityId: exp.id,
            title: `${exp.roleTitle} at ${exp.company}`,
            description: exp.description || `Applied during professional tenure at ${exp.company}`,
            evidenceStrength: 'MODERATE',
            evidenceDepth: 'USED',
            verificationStatus: 'PLATFORM_ATTACHED',
            occurredAt: exp.startDate,
            provenance: 'EXPERIENCE_ASSOCIATED',
            createdAt: exp.createdAt,
          });
        }
      }
    });
  });

  // 4. LearningProgress evidence
  const progressList = (await prisma.learningProgress.findMany({
    where: { userId: profile.userId },
    include: { resource: { include: { skill: true } } },
  })) || [];

  progressList.forEach((lp) => {
    if (lp.resource?.skill) {
      const skill = lp.resource.skill;
      const key = `LearningProgress_${lp.id}_${skill.id}`;
      if (!seenKey.has(key)) {
        seenKey.add(key);
        const isCompleted = lp.status === 'COMPLETED' || lp.status === 'Completed' || lp.progressPct === 100;
        harvested.push({
          id: `learn-ev-${lp.id}-${skill.id}`,
          skillId: skill.id,
          skillName: skill.name,
          evidenceType: 'LEARNING',
          sourceEntityType: 'LearningProgress',
          sourceEntityId: lp.id,
          title: lp.resource.title,
          description: `Learning curriculum: ${lp.resource.title} (${lp.progressPct}% completed)`,
          evidenceStrength: isCompleted ? 'MODERATE' : 'LIMITED',
          evidenceDepth: 'MENTIONED',
          verificationStatus: 'PLATFORM_ATTACHED',
          occurredAt: lp.completedAt || lp.updatedAt || lp.createdAt,
          provenance: 'LEARNING_ASSOCIATED',
          createdAt: lp.createdAt,
        });
      }
    }
  });

  return harvested;
}

/**
 * Deterministic capability state derivation based on evidence, proficiency, and target requirements
 */
export function deriveCapabilityIntelligence({
  userSkill = null,
  roleSkill = null,
  evidenceList = [],
}) {
  const userProficiency = userSkill ? userSkill.proficiency : 'NONE';
  const userWeight = PROFICIENCY_LEVELS[userProficiency] || 0;
  const isDeclaredOnProfile = !!userSkill;

  const targetProficiency = roleSkill ? roleSkill.targetProficiency : 'INTERMEDIATE';
  const targetWeight = PROFICIENCY_LEVELS[targetProficiency] || 2;
  const requirementType = roleSkill ? roleSkill.requirementType : 'SUPPORTING';
  const isRequiredForTargetRole = requirementType === 'REQUIRED';

  // Count distinct independent sources
  const distinctSources = new Set();
  let hasCompletedProject = false;
  let hasExperience = false;
  let hasLearning = false;
  let latestOccurredAt = null;

  evidenceList.forEach((ev) => {
    const sourceKey = `${ev.sourceEntityType}_${ev.sourceEntityId || ev.id}`;
    distinctSources.add(sourceKey);

    if (ev.evidenceType === 'PROJECT' && (ev.evidenceStrength === 'STRONG' || ev.evidenceStrength === 'MODERATE')) {
      hasCompletedProject = true;
    }
    if (ev.evidenceType === 'EXPERIENCE') {
      hasExperience = true;
    }
    if (ev.evidenceType === 'LEARNING') {
      hasLearning = true;
    }

    if (ev.occurredAt) {
      const d = new Date(ev.occurredAt);
      if (!latestOccurredAt || d > latestOccurredAt) {
        latestOccurredAt = d;
      }
    }
  });

  const independentSourceCount = distinctSources.size;

  // 1. Evidence State
  let evidenceState = 'NONE';
  if (evidenceList.some((e) => e.verificationStatus === 'VALIDATED')) {
    evidenceState = 'VALIDATED';
  } else if (independentSourceCount >= 2) {
    evidenceState = 'MULTI_SOURCE';
  } else if (independentSourceCount === 1) {
    evidenceState = 'ATTACHED';
  } else if (isDeclaredOnProfile) {
    evidenceState = 'DECLARED_ONLY';
  } else {
    evidenceState = 'NONE';
  }

  // 2. Evidence Strength
  let evidenceStrength = 'NONE';
  if (independentSourceCount >= 2 && (hasCompletedProject || hasExperience)) {
    evidenceStrength = 'STRONG';
  } else if (independentSourceCount >= 1 && (hasCompletedProject || hasExperience)) {
    evidenceStrength = 'MODERATE';
  } else if (independentSourceCount >= 1) {
    evidenceStrength = 'LIMITED';
  } else {
    evidenceStrength = 'NONE';
  }

  // 3. Capability State
  let capabilityState = 'SELF_REPORTED';

  if (hasCompletedProject || (hasExperience && userWeight >= 2) || (independentSourceCount >= 2 && userWeight >= 2)) {
    capabilityState = 'DEMONSTRATED';
  } else if (independentSourceCount >= 1 || (userWeight > 0 && userWeight < targetWeight && roleSkill)) {
    capabilityState = 'DEVELOPING';
  } else if (isRequiredForTargetRole && independentSourceCount === 0) {
    capabilityState = 'EVIDENCE_NEEDED';
  } else if (isDeclaredOnProfile) {
    capabilityState = 'SELF_REPORTED';
  } else {
    capabilityState = 'EVIDENCE_NEEDED';
  }

  // 4. Skill Gap & Evidence Gap
  const skillGapSteps = Math.max(0, targetWeight - userWeight);

  let evidenceGap = 'NONE';
  if (capabilityState === 'DEMONSTRATED' && evidenceStrength === 'STRONG') {
    evidenceGap = 'NONE';
  } else if (capabilityState === 'DEMONSTRATED' && evidenceStrength === 'MODERATE') {
    evidenceGap = 'LOW';
  } else if (capabilityState === 'DEVELOPING') {
    evidenceGap = isRequiredForTargetRole ? 'MEDIUM' : 'LOW';
  } else if (isRequiredForTargetRole && (evidenceStrength === 'NONE' || evidenceStrength === 'LIMITED')) {
    evidenceGap = 'HIGH';
  } else if (requirementType === 'PREFERRED' && evidenceStrength === 'NONE') {
    evidenceGap = 'MEDIUM';
  } else if (evidenceStrength === 'NONE') {
    evidenceGap = 'LOW';
  }

  // 5. Structured Explanation Object
  const explanation = [];
  if (isDeclaredOnProfile) {
    explanation.push(`Self-reported proficiency: ${userProficiency}`);
  } else {
    explanation.push('Not declared in profile skills');
  }

  explanation.push(`Attached evidence sources: ${independentSourceCount} (${evidenceState})`);

  if (hasCompletedProject) {
    explanation.push('Project evidence: Completed project implementation');
  }
  if (hasExperience) {
    explanation.push('Experience evidence: Professional workplace application');
  }
  if (hasLearning) {
    explanation.push('Learning evidence: Active curriculum / module progress');
  }

  if (roleSkill) {
    explanation.push(`Target benchmark requirement: ${requirementType} (${targetProficiency})`);
  }

  explanation.push(`Evidence strength: ${evidenceStrength}`);
  explanation.push(`Recency: ${formatRecency(latestOccurredAt)}`);

  return {
    proficiency: userProficiency,
    capabilityState,
    evidenceState,
    evidenceStrength,
    evidenceGap,
    targetRequirement: requirementType,
    targetProficiency,
    skillGapSteps,
    independentSourceCount,
    latestOccurredAt,
    recencyText: formatRecency(latestOccurredAt),
    explanation,
  };
}

/**
 * Generates an explainable Capability Profile for an individual user
 */
export async function getCapabilityProfile(userId, { targetRoleId = null, category = null, state = null } = {}) {
  const profile = await getProfile(userId);
  const activeTargetRoleId = targetRoleId || profile.targetRoleId;

  let targetRole = null;
  let roleSkills = [];

  if (activeTargetRoleId) {
    targetRole = await prisma.role.findUnique({
      where: { id: activeTargetRoleId },
      include: {
        roleSkills: {
          include: { skill: true },
        },
      },
    });
    if (targetRole) {
      roleSkills = targetRole.roleSkills || [];
    }
  }

  // Harvest all deduplicated evidence
  const allEvidences = await harvestProfileEvidence(profile);

  // Group evidence by skillId
  const evidenceBySkill = new Map();
  allEvidences.forEach((ev) => {
    if (!evidenceBySkill.has(ev.skillId)) {
      evidenceBySkill.set(ev.skillId, []);
    }
    evidenceBySkill.get(ev.skillId).push(ev);
  });

  // Map user profile skills
  const userSkillMap = new Map();
  (profile.skills || []).forEach((us) => {
    userSkillMap.set(us.skillId, us);
  });

  // Map target role skills
  const roleSkillMap = new Map();
  roleSkills.forEach((rs) => {
    roleSkillMap.set(rs.skillId, rs);
  });

  // Union of all relevant skill IDs
  const allSkillIds = new Set([
    ...userSkillMap.keys(),
    ...roleSkillMap.keys(),
    ...evidenceBySkill.keys(),
  ]);

  const capabilities = [];

  for (const skillId of allSkillIds) {
    let skill = null;
    const userSkill = userSkillMap.get(skillId);
    const roleSkill = roleSkillMap.get(skillId);
    const evidenceList = evidenceBySkill.get(skillId) || [];

    if (userSkill?.skill) skill = userSkill.skill;
    else if (roleSkill?.skill) skill = roleSkill.skill;
    else {
      skill = await prisma.skill.findUnique({ where: { id: skillId } });
    }

    if (!skill) continue;

    const intelligence = deriveCapabilityIntelligence({
      userSkill,
      roleSkill,
      evidenceList,
    });

    capabilities.push({
      skill: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
      },
      proficiency: intelligence.proficiency,
      capabilityState: intelligence.capabilityState,
      evidenceState: intelligence.evidenceState,
      evidenceStrength: intelligence.evidenceStrength,
      evidenceGap: intelligence.evidenceGap,
      targetRequirement: intelligence.targetRequirement,
      targetProficiency: intelligence.targetProficiency,
      skillGapSteps: intelligence.skillGapSteps,
      isTargetRoleRequirement: !!roleSkill,
      independentSourceCount: intelligence.independentSourceCount,
      recencyText: intelligence.recencyText,
      lastDemonstratedAt: intelligence.latestOccurredAt,
      evidence: evidenceList,
      explanation: intelligence.explanation,
    });
  }

  // Summary counts
  const demonstrated = capabilities.filter((c) => c.capabilityState === 'DEMONSTRATED').length;
  const developing = capabilities.filter((c) => c.capabilityState === 'DEVELOPING').length;
  const selfReported = capabilities.filter((c) => c.capabilityState === 'SELF_REPORTED').length;
  const evidenceNeeded = capabilities.filter((c) => c.capabilityState === 'EVIDENCE_NEEDED').length;

  // Calculate Evidence Coverage for target role requirements
  const targetRequiredCaps = capabilities.filter((c) => c.isTargetRoleRequirement && c.targetRequirement === 'REQUIRED');
  const targetWithEvidence = targetRequiredCaps.filter(
    (c) => c.capabilityState === 'DEMONSTRATED' || (c.capabilityState === 'DEVELOPING' && c.independentSourceCount > 0)
  );

  const totalRequiredCount = targetRequiredCaps.length;
  const coveredRequiredCount = targetWithEvidence.length;
  const evidenceCoverageRatio = totalRequiredCount > 0 ? `${coveredRequiredCount} / ${totalRequiredCount}` : '0 / 0';
  const evidenceCoveragePct = totalRequiredCount > 0 ? Math.round((coveredRequiredCount / totalRequiredCount) * 100) : 100;

  // Filter if requested
  let filteredCaps = capabilities;
  if (category) {
    filteredCaps = filteredCaps.filter((c) => c.skill.category?.toLowerCase() === category.toLowerCase());
  }
  if (state) {
    filteredCaps = filteredCaps.filter((c) => c.capabilityState === state.toUpperCase());
  }

  return {
    targetRole: targetRole
      ? {
          id: targetRole.id,
          name: targetRole.name,
          category: targetRole.category,
          description: targetRole.description,
        }
      : null,
    summary: {
      total: capabilities.length,
      demonstrated,
      developing,
      selfReported,
      evidenceNeeded,
      evidenceCoverage: {
        ratio: evidenceCoverageRatio,
        percentage: evidenceCoveragePct,
        coveredCount: coveredRequiredCount,
        totalRequired: totalRequiredCount,
        interpretation: `${evidenceCoverageRatio} target capabilities supported by verifiable project or experience evidence.`,
      },
    },
    capabilities: filteredCaps,
    methodology: {
      type: 'Deterministic Multi-Source Capability Intelligence Engine',
      principles: [
        'Distinguishes self-reported claims from demonstrable application evidence',
        'Separates proficiency level from capability verification state',
        'Calculates independent evidence sources without duplicate counting',
        'Maintains transparency without opaque AI capability percentages',
      ],
      disclaimer: 'Capability intelligence is a developmental diagnostic tool and does not guarantee hiring selection or employment outcomes.',
    },
  };
}

/**
 * Retrieves concise capability summary
 */
export async function getCapabilitySummary(userId, { targetRoleId = null } = {}) {
  const profileData = await getCapabilityProfile(userId, { targetRoleId });
  return {
    targetRole: profileData.targetRole,
    summary: profileData.summary,
    methodology: profileData.methodology,
  };
}

/**
 * Retrieves granular detail for a single capability
 */
export async function getCapabilityDetail(userId, skillId, { targetRoleId = null } = {}) {
  const profileData = await getCapabilityProfile(userId, { targetRoleId });
  const cap = profileData.capabilities.find((c) => c.skill.id === skillId);

  if (!cap) {
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) throw ApiError.notFound('Skill not found in catalog');
    return {
      skill: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
      },
      proficiency: 'NONE',
      capabilityState: 'EVIDENCE_NEEDED',
      evidenceState: 'NONE',
      evidenceStrength: 'NONE',
      evidenceGap: 'HIGH',
      targetRequirement: 'SUPPORTING',
      targetProficiency: 'INTERMEDIATE',
      skillGapSteps: 2,
      isTargetRoleRequirement: false,
      independentSourceCount: 0,
      recencyText: 'Not recorded',
      lastDemonstratedAt: null,
      evidence: [],
      explanation: ['Skill not declared in profile and no evidence attached.'],
      targetRole: profileData.targetRole,
      recommendedNextAction: 'Add a project or experience evidencing this capability.',
    };
  }

  // Developmental next action
  let recommendedNextAction = 'Maintain active application in complex problem domains.';
  if (cap.capabilityState === 'EVIDENCE_NEEDED') {
    recommendedNextAction = `Build and attach a project demonstrating ${cap.skill.name} implementation.`;
  } else if (cap.capabilityState === 'SELF_REPORTED') {
    recommendedNextAction = `Attach concrete project or workplace experience artifacts for ${cap.skill.name}.`;
  } else if (cap.capabilityState === 'DEVELOPING') {
    recommendedNextAction = `Complete ongoing project implementation and benchmark against ${cap.targetProficiency} proficiency.`;
  }

  return {
    ...cap,
    targetRole: profileData.targetRole,
    recommendedNextAction,
  };
}

/**
 * Retrieves all traceable evidence items for the user
 */
export async function getCapabilityEvidenceList(userId, { skillId = null, evidenceType = null } = {}) {
  const profile = await getProfile(userId);
  let evidences = await harvestProfileEvidence(profile);

  if (skillId) {
    evidences = evidences.filter((e) => e.skillId === skillId);
  }
  if (evidenceType) {
    evidences = evidences.filter((e) => e.evidenceType === evidenceType.toUpperCase());
  }

  return {
    total: evidences.length,
    evidences,
  };
}

/**
 * Safely link an evidence item to a skill with ownership validation
 */
export async function linkEvidence(userId, {
  skillId,
  evidenceType,
  sourceEntityType,
  sourceEntityId = null,
  title,
  description = null,
  evidenceStrength = 'MODERATE',
  evidenceDepth = 'USED',
  occurredAt = null,
}) {
  const profile = await getProfile(userId);

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw ApiError.notFound('Skill not found in catalog');

  // Verify ownership of source entity
  if (sourceEntityType === 'GrowthProject' && sourceEntityId) {
    const proj = await prisma.growthProject.findFirst({
      where: { id: sourceEntityId, profileId: profile.id },
    });
    if (!proj) {
      throw ApiError.forbidden('Unauthorized: You can only link projects belonging to your own profile.');
    }
  }

  if (sourceEntityType === 'Experience' && sourceEntityId) {
    const exp = await prisma.experience.findFirst({
      where: { id: sourceEntityId, profileId: profile.id },
    });
    if (!exp) {
      throw ApiError.forbidden('Unauthorized: You can only link work experiences belonging to your own profile.');
    }
  }

  // Create evidence record
  const evidence = await prisma.capabilityEvidence.create({
    data: {
      profileId: profile.id,
      skillId,
      evidenceType,
      sourceEntityType,
      sourceEntityId,
      title,
      description,
      evidenceStrength,
      evidenceDepth,
      verificationStatus: 'PLATFORM_ATTACHED',
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      provenance: 'USER_ATTACHED',
    },
    include: { skill: true },
  });

  return evidence;
}

/**
 * Safely unlink an evidence item with ownership validation
 */
export async function unlinkEvidence(userId, evidenceId) {
  const profile = await getProfile(userId);

  const existing = await prisma.capabilityEvidence.findUnique({
    where: { id: evidenceId },
  });

  if (!existing) {
    throw ApiError.notFound('Evidence record not found');
  }

  if (existing.profileId !== profile.id) {
    throw ApiError.forbidden('Unauthorized: You cannot delete evidence belonging to another candidate.');
  }

  await prisma.capabilityEvidence.delete({
    where: { id: evidenceId },
  });

  return {
    success: true,
    message: 'Evidence unlinked successfully',
  };
}

/**
 * Retrieves comprehensive target role capability readiness telemetry
 */
export async function getRoleCapabilityReadiness(userId, roleId) {
  const profileData = await getCapabilityProfile(userId, { targetRoleId: roleId });
  const role = profileData.targetRole;

  if (!role) {
    throw ApiError.notFound('Role not found');
  }

  const roleSkillFit = await calculateSkillCoverage(userId, roleId);

  return {
    role,
    roleAlignment: {
      overallFitPct: roleSkillFit.compatibility?.overall || roleSkillFit.requiredSkills?.percentage || 75,
      requiredSkillFitPct: roleSkillFit.requiredSkills?.percentage || 0,
      preferredSkillFitPct: roleSkillFit.preferredSkills?.percentage || 0,
    },
    evidenceCoverage: profileData.summary.evidenceCoverage,
    capabilityDistribution: {
      demonstrated: profileData.summary.demonstrated,
      developing: profileData.summary.developing,
      selfReported: profileData.summary.selfReported,
      evidenceNeeded: profileData.summary.evidenceNeeded,
    },
    capabilities: profileData.capabilities.filter((c) => c.isTargetRoleRequirement),
    methodology: profileData.methodology,
  };
}

export default {
  getCapabilityProfile,
  getCapabilitySummary,
  getCapabilityDetail,
  getCapabilityEvidenceList,
  linkEvidence,
  unlinkEvidence,
  getRoleCapabilityReadiness,
  deriveCapabilityIntelligence,
  harvestProfileEvidence,
};
