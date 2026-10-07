import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { ApiError } from '../utils/apiError.js';

const PROFICIENCY_LEVELS = {
  NONE: 0,
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

/**
 * Deterministically computes skill gaps between an individual's current skills and target role requirements.
 * @param {string} userId
 * @param {Object} [filters]
 */
export const getSkillGaps = async (userId, { roleId = null, category = null, priority = null } = {}) => {
  const profile = await getProfile(userId);
  const targetRoleId = roleId || profile.targetRoleId;

  if (!targetRoleId) {
    return {
      targetRole: null,
      gaps: [],
      summary: { totalGaps: 0, criticalGaps: 0, highGaps: 0, mediumGaps: 0, lowGaps: 0 },
      message: 'No target role selected yet. Please select a target role to analyze skill gaps.',
    };
  }

  const role = await prisma.role.findUnique({
    where: { id: targetRoleId },
    include: {
      roleSkills: {
        include: { skill: true },
      },
    },
  });

  if (!role) {
    throw ApiError.notFound('Target role not found', 'ROLE_NOT_FOUND');
  }

  const userSkillsMap = new Map();
  (profile.skills || []).forEach((us) => {
    userSkillsMap.set(us.skillId, us);
  });

  let gaps = [];

  role.roleSkills.forEach((rs) => {
    const userSkill = userSkillsMap.get(rs.skillId);
    const userProf = userSkill ? userSkill.proficiency : 'NONE';
    const userWeight = PROFICIENCY_LEVELS[userProf] || 0;
    const targetWeight = PROFICIENCY_LEVELS[rs.targetProficiency] || 2;

    if (userWeight < targetWeight) {
      const gapSteps = targetWeight - userWeight;
      const reqMultiplier = rs.requirementType === 'REQUIRED' ? 1.4 : 1.0;
      const priorityScore = gapSteps * (rs.importance / 100) * reqMultiplier;

      let gapPriority = 'LOW';
      if (priorityScore >= 2.5) gapPriority = 'CRITICAL';
      else if (priorityScore >= 1.8) gapPriority = 'HIGH';
      else if (priorityScore >= 1.0) gapPriority = 'MEDIUM';

      // Semantic discovery for related user skills
      const missingSkillName = (rs.skill?.name || '').toLowerCase();
      const missingNorm = missingSkillName.replace(/[^a-z0-9]/g, '');
      const relatedUserSkills = [];

      (profile.skills || []).forEach((us) => {
        const uName = (us.skill?.name || us.name || '').toLowerCase();
        const uNorm = uName.replace(/[^a-z0-9]/g, '');
        if (uNorm === missingNorm && uName !== missingSkillName) {
          relatedUserSkills.push({
            skillName: us.skill?.name || us.name,
            relationType: 'NORMALIZED_ALIAS',
            similarity: 0.95,
            note: 'Normalized taxonomy alias exists in your profile',
          });
        } else if (us.skill?.category === rs.skill?.category && uName !== missingSkillName) {
          relatedUserSkills.push({
            skillName: us.skill?.name || us.name,
            relationType: 'DOMAIN_RELATED',
            similarity: 0.75,
            note: `Related skill in ${rs.skill?.category || 'same domain'}`,
          });
        }
      });

      gaps.push({
        skillId: rs.skillId,
        skillName: rs.skill?.name,
        category: rs.skill?.category,
        requirementType: rs.requirementType,
        roleImportance: rs.importance,
        currentProficiency: userProf,
        targetProficiency: rs.targetProficiency,
        gapSteps,
        priority: gapPriority,
        priorityScore: Number(priorityScore.toFixed(2)),
        status: userWeight === 0 ? 'MISSING' : 'PARTIALLY_ALIGNED',
        rationale: `${rs.requirementType === 'REQUIRED' ? 'Essential core prerequisite' : 'Preferred differentiator'} for ${role.name} (${rs.targetProficiency} required, currently ${userProf}).`,
        recommendedDevelopmentDirection: userWeight === 0 ? 'Foundation learning & guided exercises' : 'Advanced project implementation & design patterns',
        semanticRelatedSkills: relatedUserSkills.slice(0, 3),
        semanticSimilarity: relatedUserSkills.length > 0 ? relatedUserSkills[0].similarity : null,
        semanticEvidence: relatedUserSkills.length > 0
          ? `User possesses related skill "${relatedUserSkills[0].skillName}" (${relatedUserSkills[0].relationType}). Requirement remains developmental focus.`
          : null,
        marketRelevance: null, // As per guidelines: null when live market signal is unavailable
        futureRelevance: null,
        demandEvidence: null,
      });
    }
  });

  // Attach optional demand evidence asynchronously
  try {
    const DemandIntelligenceService = (await import('./demandIntelligence.service.js')).default;
    for (const gap of gaps) {
      try {
        const summary = await DemandIntelligenceService.getSkillDemand(gap.skillId);
        gap.demandEvidence = {
          currentDemand: summary.currentDemand,
          growthRate: summary.growthRate,
          trendCategory: summary.trendCategory,
          isEmerging: summary.isEmerging,
          evidence: summary.evidence?.[0] || 'Historical demand observations available.',
        };
      } catch {}
    }
  } catch {}

  // Apply filters
  if (category) {
    gaps = gaps.filter((g) => g.category?.toLowerCase() === category.toLowerCase());
  }
  if (priority) {
    gaps = gaps.filter((g) => g.priority === priority.toUpperCase());
  }

  // Sort by priorityScore descending
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  const summary = {
    totalGaps: gaps.length,
    criticalGaps: gaps.filter((g) => g.priority === 'CRITICAL').length,
    highGaps: gaps.filter((g) => g.priority === 'HIGH').length,
    mediumGaps: gaps.filter((g) => g.priority === 'MEDIUM').length,
    lowGaps: gaps.filter((g) => g.priority === 'LOW').length,
  };

  return {
    targetRole: {
      id: role.id,
      name: role.name,
      category: role.category,
    },
    summary,
    gaps,
    methodology: {
      type: 'Deterministic Benchmark Differential',
      formula: 'Gap Steps × (Role Importance / 100) × Requirement Weight',
      disclaimer: 'Skill gaps identify developmental focus areas and do not guarantee employability or hiring outcomes.',
    },
  };
};

/**
 * Retrieves granular detail and developmental guidance for a specific skill gap.
 */
export const getSkillGapDetail = async (userId, skillId, roleId = null) => {
  const gapsData = await getSkillGaps(userId, { roleId });
  const gap = gapsData.gaps.find((g) => g.skillId === skillId);

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw ApiError.notFound('Skill not found in catalog', 'SKILL_NOT_FOUND');

  // Search curated learning resources for this skill
  const relatedResources = await prisma.learningResource.findMany({
    where: { skillId },
    take: 5,
  });

  return {
    skill: {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
    },
    targetRole: gapsData.targetRole,
    gapAnalysis: gap || {
      status: 'MATCHED_NO_GAP',
      message: 'You have already met or exceeded the benchmark proficiency for this skill.',
    },
    recommendedResources: relatedResources,
  };
};

export default {
  getSkillGaps,
  getSkillGapDetail,
};
