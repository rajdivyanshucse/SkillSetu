import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { calculateSkillCoverage } from './skillIntelligence.service.js';
import embeddingService from './embedding.service.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Career Intelligence Service
 * Provides transparent, deterministic career compatibility calculations across target roles.
 */

export const getCareerIntelligence = async (userId, requestedRoleId = null) => {
  const profile = await getProfile(userId);
  const targetRoleId = requestedRoleId || profile.targetRoleId;

  // Retrieve list of available career roles for exploration
  const availableRoles = await prisma.role.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
    },
    take: 10,
  });

  if (!targetRoleId) {
    return {
      currentTargetRole: null,
      compatibility: null,
      availableRoles,
      message: 'Configure a target role in your profile to generate career compatibility telemetry.',
    };
  }

  const coverage = await calculateSkillCoverage(userId, targetRoleId);
  const experiences = profile.experiences || [];

  // Calculate experience alignment (years vs standard archetype expectation)
  let totalExperienceYears = 0;
  experiences.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
    if (years > 0) totalExperienceYears += years;
  });

  // Expected benchmark experience (e.g. 2.5 - 4 years for mid-senior archetypes)
  const expectedYears = 3.0;
  const experienceAlignment = Math.min(100, Math.round((Math.max(0.5, totalExperienceYears) / expectedYears) * 100));

  const requiredSkillFit = coverage.requiredSkills.percentage;
  const preferredSkillFit = coverage.preferredSkills.percentage;

  // Weighted overall compatibility index
  const overall = Math.round(
    requiredSkillFit * 0.5 + preferredSkillFit * 0.25 + experienceAlignment * 0.25
  );

  // Optional market demand signals for target role
  let marketDemand = null;
  try {
    const DemandIntelligenceService = (await import('./demandIntelligence.service.js')).default;
    const roleDemand = await DemandIntelligenceService.getRoleDemand(targetRoleId);
    marketDemand = {
      trendCategory: roleDemand.trendCategory,
      growthRate: roleDemand.growthRate,
      currentDemand: roleDemand.currentDemand,
      confidence: roleDemand.confidence,
      dataQuality: roleDemand.dataQuality?.quality || 'MEDIUM',
      emergingSkills: (roleDemand.emergingAssociatedSkills || []).slice(0, 3).map((s) => s.name),
    };
  } catch {
    marketDemand = null;
  }

  return {
    targetRole: coverage.targetRole,
    compatibility: {
      overall,
      requiredSkillFit,
      preferredSkillFit,
      experienceAlignment,
      totalExperienceYears: Number(totalExperienceYears.toFixed(1)),
    },
    keyStrengths: coverage.matchedSkills.map((s) => s.name),
    growthFocusAreas: coverage.missingSkills.slice(0, 4).map((s) => s.name),
    marketDemand,
    availableRoles,
    methodology: {
      type: 'Deterministic Curriculum & Telemetry Compatibility Matrix',
      weights: {
        requiredSkills: '50%',
        preferredSkills: '25%',
        experienceAlignment: '25%',
      },
      disclaimer: 'Compatibility indices are self-development telemetry indicators. They do not calculate hiring probability, employment likelihood, candidate ranking, or recruitment selection guarantees.',
    },
  };
};

export const getCareerSemanticIntelligence = async (userId, requestedRoleId = null) => {
  const profile = await getProfile(userId);
  const targetRoleId = requestedRoleId || profile.targetRoleId;

  if (!targetRoleId) {
    return {
      targetRole: null,
      message: 'Configure a target role in your profile to generate semantic career intelligence.',
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
    throw ApiError.notFound('Target role not found');
  }

  const roleSkills = (role.roleSkills || []).map((rs) => rs.skill?.name).filter(Boolean);
  const userSkills = (profile.skills || []).map((us) => us.skill?.name).filter(Boolean);

  if (roleSkills.length === 0 || userSkills.length === 0) {
    return {
      targetRole: {
        id: role.id,
        name: role.name,
        category: role.category,
      },
      semanticCoverage: 0,
      exactMatches: [],
      normalizedMatches: [],
      semanticMatches: [],
      unmatchedRequirements: roleSkills,
      semanticEvidence: [],
      matchRate: 0,
      aggregateSemanticSignal: null,
      methodology: {
        type: 'Hybrid Lexical + Dense Semantic Embedding Matrix',
        model: embeddingService.modelName,
        dimension: embeddingService.dimension,
        disclaimer: 'Semantic intelligence is an analytical signal and does not guarantee employability.',
      },
    };
  }

  // Match: source = role required/preferred skills, candidate = user possessed skills
  const matchResult = await embeddingService.matchSkillSets(roleSkills, userSkills);

  const exactMatches = matchResult.matches.filter((m) => m.matchType === 'EXACT');
  const normalizedMatches = matchResult.matches.filter((m) => m.matchType === 'NORMALIZED');
  const semanticMatches = matchResult.matches.filter((m) => m.matchType === 'SEMANTIC');
  const unmatchedRequirements = matchResult.unmatchedSourceSkills;

  const totalReqs = roleSkills.length;
  const matchedCount = matchResult.matches.length;
  const semanticCoverage = totalReqs > 0 ? Math.round((matchedCount / totalReqs) * 100) : 0;

  return {
    targetRole: {
      id: role.id,
      name: role.name,
      category: role.category,
    },
    semanticCoverage,
    exactMatches,
    normalizedMatches,
    semanticMatches,
    unmatchedRequirements,
    semanticEvidence: matchResult.matches,
    matchRate: matchResult.matchRate,
    aggregateSemanticSignal: semanticMatches.length > 0
      ? Math.round(
          (semanticMatches.reduce((acc, m) => acc + (m.similarity || 0), 0) / semanticMatches.length) * 100
        ) / 100
      : null,
    methodology: {
      type: 'Hybrid Lexical + Dense Semantic Embedding Matrix',
      model: embeddingService.modelName,
      dimension: embeddingService.dimension,
      disclaimer:
        'Semantic matches indicate contextual skill relatedness. They represent supplemental capability signals and do not guarantee skill equivalence, candidate success, or hiring probability.',
    },
  };
};

export default {
  getCareerIntelligence,
  getCareerSemanticIntelligence,
};
