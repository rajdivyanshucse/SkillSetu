import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { ApiError } from '../utils/apiError.js';

const PROFICIENCY_WEIGHTS = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

/**
 * Aggregates skill intelligence for the authenticated individual.
 * Uses deterministic calculations on actual stored skills.
 * @param {string} userId
 */
export const getSkillIntelligence = async (userId) => {
  const profile = await getProfile(userId);
  const userSkills = profile.skills || [];

  // Group by category
  const byCategory = {};
  const proficiencyDistribution = {
    BEGINNER: 0,
    INTERMEDIATE: 0,
    ADVANCED: 0,
    EXPERT: 0,
  };

  const strongest = [];
  const developing = [];
  let verifiedCount = 0;

  userSkills.forEach((us) => {
    const cat = us.skill?.category || 'General';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({
      id: us.skillId,
      name: us.skill?.name,
      proficiency: us.proficiency,
      yearsOfExperience: us.yearsOfExperience,
      isVerified: us.isVerified,
    });

    if (proficiencyDistribution[us.proficiency] !== undefined) {
      proficiencyDistribution[us.proficiency]++;
    }

    if (us.isVerified) verifiedCount++;

    if (us.proficiency === 'ADVANCED' || us.proficiency === 'EXPERT') {
      strongest.push({
        id: us.skillId,
        name: us.skill?.name,
        category: cat,
        proficiency: us.proficiency,
      });
    } else {
      developing.push({
        id: us.skillId,
        name: us.skill?.name,
        category: cat,
        proficiency: us.proficiency,
      });
    }
  });

  return {
    totalSkills: userSkills.length,
    verifiedSkillsCount: verifiedCount,
    skillsByCategory: byCategory,
    proficiencyDistribution,
    strongestSkillAreas: strongest,
    developingSkillAreas: developing,
    methodology: {
      type: 'Deterministic Capability Telemetry',
      signalsUsed: ['User-Declared Skills', 'Verified Badges', 'Proficiency Matrix'],
      disclaimer: 'Skill intelligence reflects registered capability inventory and does not represent employee productivity or performance scoring.',
    },
  };
};

/**
 * Calculates skill coverage against a target role's benchmark requirements.
 * @param {string} userId
 * @param {string} [roleId]
 */
export const calculateSkillCoverage = async (userId, roleId = null) => {
  const profile = await getProfile(userId);
  const targetRoleId = roleId || profile.targetRoleId;

  if (!targetRoleId) {
    return {
      targetRole: null,
      coveragePercentage: 0,
      requiredMatched: 0,
      requiredTotal: 0,
      preferredMatched: 0,
      preferredTotal: 0,
      matchedSkills: [],
      partiallyAlignedSkills: [],
      missingSkills: [],
      message: 'No target role selected yet. Please configure a target role to view capability coverage.',
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

  const matchedSkills = [];
  const partiallyAlignedSkills = [];
  const missingSkills = [];

  let requiredTotal = 0;
  let requiredMatched = 0;
  let preferredTotal = 0;
  let preferredMatched = 0;

  role.roleSkills.forEach((rs) => {
    const isRequired = rs.requirementType === 'REQUIRED';
    if (isRequired) requiredTotal++;
    else preferredTotal++;

    const userSkill = userSkillsMap.get(rs.skillId);
    if (!userSkill) {
      missingSkills.push({
        skillId: rs.skillId,
        name: rs.skill?.name,
        category: rs.skill?.category,
        requirementType: rs.requirementType,
        importance: rs.importance,
        targetProficiency: rs.targetProficiency,
        currentProficiency: 'NONE',
      });
    } else {
      const userWeight = PROFICIENCY_WEIGHTS[userSkill.proficiency] || 1;
      const targetWeight = PROFICIENCY_WEIGHTS[rs.targetProficiency] || 2;

      if (userWeight >= targetWeight) {
        if (isRequired) requiredMatched++;
        else preferredMatched++;

        matchedSkills.push({
          skillId: rs.skillId,
          name: rs.skill?.name,
          category: rs.skill?.category,
          requirementType: rs.requirementType,
          targetProficiency: rs.targetProficiency,
          userProficiency: userSkill.proficiency,
        });
      } else {
        partiallyAlignedSkills.push({
          skillId: rs.skillId,
          name: rs.skill?.name,
          category: rs.skill?.category,
          requirementType: rs.requirementType,
          targetProficiency: rs.targetProficiency,
          userProficiency: userSkill.proficiency,
          gap: targetWeight - userWeight,
        });
      }
    }
  });

  // Calculate deterministic weighted coverage percentage
  let coveragePercentage = 0;
  if (requiredTotal > 0 || preferredTotal > 0) {
    const reqRatio = requiredTotal > 0 ? requiredMatched / requiredTotal : 1;
    const prefRatio = preferredTotal > 0 ? preferredMatched / preferredTotal : 1;
    const partialRatio = (partiallyAlignedSkills.length * 0.5) / (requiredTotal + preferredTotal || 1);

    const baseScore = reqRatio * 75 + prefRatio * 25 + partialRatio * 10;
    coveragePercentage = Math.min(100, Math.round(baseScore));
  }

  return {
    targetRole: {
      id: role.id,
      name: role.name,
      category: role.category,
      description: role.description,
    },
    coveragePercentage,
    requiredSkills: {
      matched: requiredMatched,
      total: requiredTotal,
      percentage: requiredTotal > 0 ? Math.round((requiredMatched / requiredTotal) * 100) : 100,
    },
    preferredSkills: {
      matched: preferredMatched,
      total: preferredTotal,
      percentage: preferredTotal > 0 ? Math.round((preferredMatched / preferredTotal) * 100) : 100,
    },
    matchedSkills,
    partiallyAlignedSkills,
    missingSkills,
    methodology: {
      type: 'Deterministic Benchmark Coverage',
      formula: '(Required Fit * 0.75) + (Preferred Fit * 0.25) + Partial Credit',
      disclaimer: 'Capability coverage indicates curriculum/skill alignment and does not guarantee job selection or hiring probability.',
    },
  };
};

export default {
  getSkillIntelligence,
  calculateSkillCoverage,
};
