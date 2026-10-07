import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';
import embeddingService from './embedding.service.js';

/**
 * Deterministic Compatibility Formula:
 * - Required skills = 45%
 * - Preferred skills = 20%
 * - Role alignment = 20%
 * - Experience alignment = 15%
 *
 * NOTE: Compatibility is only a capability alignment indicator.
 * It is NOT a hiring probability, selection prediction, or guarantee.
 */
export const calculateCompatibility = (candidateSkills = [], candidateExperiences = [], role = null) => {
  if (!role || !role.roleSkills || role.roleSkills.length === 0) {
    // Baseline calculation when no specific role requirements are compared against
    const totalSkills = candidateSkills.length;
    const avgProficiency = totalSkills > 0
      ? candidateSkills.reduce((acc, s) => {
          const p = s.proficiency;
          const score = p === 'EXPERT' ? 100 : p === 'ADVANCED' ? 80 : p === 'INTERMEDIATE' ? 60 : 40;
          return acc + score;
        }, 0) / totalSkills
      : 50;

    const reqScore = Math.min(100, Math.round(avgProficiency));
    const prefScore = 70;
    const roleScore = 75;
    const expScore = Math.min(100, candidateExperiences.length * 25);

    return {
      overallCompatibility: Math.min(100, Math.round(avgProficiency)),
      breakdown: {
        requiredSkillsAlignment: reqScore,
        requiredSkillsScore: reqScore,
        preferredSkillsAlignment: prefScore,
        preferredSkillsScore: prefScore,
        roleAlignment: roleScore,
        roleAlignmentScore: roleScore,
        experienceAlignment: expScore,
        experienceAlignmentScore: expScore,
      },
      matchedRequiredSkills: [],
      missingRequiredSkills: [],
      matchedPreferredSkills: [],
      disclaimer: 'Compatibility score is a capability indicator, not a hiring prediction.',
    };
  }

  const reqSkills = role.roleSkills.filter((rs) => rs.requirementType === 'REQUIRED');
  const prefSkills = role.roleSkills.filter((rs) => rs.requirementType === 'PREFERRED');

  const candSkillMap = new Map();
  candidateSkills.forEach((cs) => {
    const sName = cs.skill?.name?.toLowerCase() || '';
    const sId = cs.skillId;
    const profWeight = cs.proficiency === 'EXPERT' ? 1.0 : cs.proficiency === 'ADVANCED' ? 0.85 : cs.proficiency === 'INTERMEDIATE' ? 0.65 : 0.4;
    candSkillMap.set(sName, { ...cs, profWeight });
    if (sId) candSkillMap.set(sId, { ...cs, profWeight });
  });

  // 1. Required skills alignment (45%)
  let matchedReqScore = 0;
  const matchedRequiredSkills = [];
  const missingRequiredSkills = [];

  if (reqSkills.length > 0) {
    reqSkills.forEach((rs) => {
      const sName = rs.skill?.name?.toLowerCase() || '';
      const sId = rs.skillId;
      const match = candSkillMap.get(sName) || candSkillMap.get(sId);
      if (match) {
        matchedReqScore += match.profWeight;
        matchedRequiredSkills.push(rs.skill?.name || sName);
      } else {
        missingRequiredSkills.push(rs.skill?.name || sName);
      }
    });
    matchedReqScore = (matchedReqScore / reqSkills.length) * 100;
  } else {
    matchedReqScore = 80;
  }

  // 2. Preferred skills alignment (20%)
  let matchedPrefScore = 0;
  const matchedPreferredSkills = [];
  if (prefSkills.length > 0) {
    prefSkills.forEach((rs) => {
      const sName = rs.skill?.name?.toLowerCase() || '';
      const sId = rs.skillId;
      const match = candSkillMap.get(sName) || candSkillMap.get(sId);
      if (match) {
        matchedPrefScore += match.profWeight;
        matchedPreferredSkills.push(rs.skill?.name || sName);
      }
    });
    matchedPrefScore = (matchedPrefScore / prefSkills.length) * 100;
  } else {
    matchedPrefScore = 75;
  }

  // 3. Role alignment (20%)
  let roleAlignmentScore = 70;
  if (role.name) {
    const rLower = role.name.toLowerCase();
    const hasMatchingExp = candidateExperiences.some((e) =>
      e.roleTitle?.toLowerCase().includes(rLower) || rLower.includes(e.roleTitle?.toLowerCase() || '')
    );
    if (hasMatchingExp) roleAlignmentScore = 95;
  }

  // 4. Experience alignment (15%)
  const totalYoe = candidateExperiences.reduce((acc, exp) => {
    const start = new Date(exp.startDate).getTime();
    const end = exp.endDate ? new Date(exp.endDate).getTime() : Date.now();
    const years = Math.max(0.5, (end - start) / (1000 * 60 * 60 * 24 * 365));
    return acc + years;
  }, 0);
  const expScore = Math.min(100, Math.round((totalYoe / 5) * 100));

  // Weighted overall calculation: (0.45 * Req) + (0.20 * Pref) + (0.20 * Role) + (0.15 * Exp)
  const overall = (matchedReqScore * 0.45) + (matchedPrefScore * 0.20) + (roleAlignmentScore * 0.20) + (expScore * 0.15);

  return {
    overallCompatibility: Math.min(100, Math.round(overall)),
    breakdown: {
      requiredSkillsAlignment: Math.min(100, Math.round(matchedReqScore)),
      requiredSkillsScore: Math.min(100, Math.round(matchedReqScore)),
      preferredSkillsAlignment: Math.min(100, Math.round(matchedPrefScore)),
      preferredSkillsScore: Math.min(100, Math.round(matchedPrefScore)),
      roleAlignment: Math.min(100, Math.round(roleAlignmentScore)),
      roleAlignmentScore: Math.min(100, Math.round(roleAlignmentScore)),
      experienceAlignment: Math.min(100, Math.round(expScore)),
      experienceAlignmentScore: Math.min(100, Math.round(expScore)),
    },
    matchedRequiredSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    disclaimer: 'Compatibility score is a capability indicator, not a hiring prediction.',
  };
};

export const formatCandidate = (profile, role = null, isShortlisted = false) => {
  const comp = calculateCompatibility(profile.skills || [], profile.experiences || [], role);

  return {
    id: profile.id,
    userId: profile.userId,
    fullName: profile.fullName,
    headline: profile.headline || 'Software Engineering Professional',
    location: profile.location || 'Location Not Specified',
    education: profile.education || null,
    currentStatus: profile.currentStatus || 'Available',
    experienceSummary: profile.experienceSummary || null,
    completeness: profile.completeness || 85,
    skills: (profile.skills || []).map((s) => ({
      skillId: s.skillId,
      name: s.skill?.name || 'Skill',
      category: s.skill?.category || 'General',
      proficiency: s.proficiency,
      yearsOfExperience: s.yearsOfExperience,
    })),
    experiences: (profile.experiences || []).map((e) => ({
      company: e.company,
      roleTitle: e.roleTitle,
      employmentType: e.employmentType,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
      description: e.description,
    })),
    isShortlisted,
    compatibility: comp,
  };
};

export const getTalentPool = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  // Load target role if roleId query is specified
  let targetRole = null;
  if (query.roleId) {
    targetRole = await prisma.role.findUnique({
      where: { id: query.roleId },
      include: {
        roleSkills: { include: { skill: true } },
      },
    });
  }

  // Load all individual profiles
  const profiles = await prisma.individualProfile.findMany({
    include: {
      skills: { include: { skill: true } },
      experiences: true,
      educations: true,
    },
  });

  // Load organization shortlisted candidate IDs
  const shortlists = await prisma.talentShortlist.findMany({
    where: { organizationId },
  });
  const shortlistedMap = new Set(shortlists.map((s) => s.candidateId));

  let formatted = profiles.map((p) =>
    formatCandidate(p, targetRole, shortlistedMap.has(p.id) || shortlistedMap.has(p.userId))
  );

  // Apply search filtering
  if (query.query) {
    const q = query.query.toLowerCase();
    formatted = formatted.filter((c) =>
      c.fullName.toLowerCase().includes(q) ||
      (c.headline && c.headline.toLowerCase().includes(q)) ||
      c.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (query.skill) {
    const sk = query.skill.toLowerCase();
    formatted = formatted.filter((c) =>
      c.skills.some((s) => s.name.toLowerCase().includes(sk))
    );
  }

  const total = formatted.length;
  const paginatedItems = formatted.slice(skip, skip + limit);

  return {
    items: paginatedItems,
    candidates: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    methodologyNote: 'Talent capability matching based on deterministic skill alignment weights. Not a hiring probability.',
  };
};

export const getCandidateById = async (organizationId, candidateId) => {
  let profile = await prisma.individualProfile.findUnique({
    where: { id: candidateId },
    include: {
      skills: { include: { skill: true } },
      experiences: true,
      educations: true,
    },
  });

  if (!profile) {
    profile = await prisma.individualProfile.findUnique({
      where: { userId: candidateId },
      include: {
        skills: { include: { skill: true } },
        experiences: true,
        educations: true,
      },
    });
  }

  if (!profile) {
    throw ApiError.notFound('Candidate profile not found', 'CANDIDATE_NOT_FOUND');
  }

  const shortlist = await prisma.talentShortlist.findFirst({
    where: {
      organizationId,
      OR: [{ candidateId: profile.id }, { candidateId: profile.userId }],
    },
  });

  return formatCandidate(profile, null, !!shortlist);
};

export const getCandidateCompatibility = async (organizationId, candidateId, query = {}) => {
  const candidate = await getCandidateById(organizationId, candidateId);

  let targetRole = null;
  if (query.roleId) {
    targetRole = await prisma.role.findUnique({
      where: { id: query.roleId },
      include: {
        roleSkills: { include: { skill: true } },
      },
    });
  }

  const compatibility = calculateCompatibility(candidate.skills, candidate.experiences, targetRole);

  return {
    candidateId: candidate.id,
    candidateName: candidate.fullName,
    targetRole: targetRole ? targetRole.name : 'General Software Engineering Baseline',
    ...compatibility,
  };
};

export const compareCandidates = async (organizationId, candidateIds = [], roleId = null) => {
  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    throw ApiError.badRequest('At least one candidateId is required for comparison', 'MISSING_CANDIDATE_IDS');
  }

  let targetRole = null;
  if (roleId) {
    targetRole = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        roleSkills: { include: { skill: true } },
      },
    });
  }

  const comparisonProfiles = [];
  for (const id of candidateIds) {
    if (!id || id === 'undefined') continue;
    try {
      const cand = await getCandidateById(organizationId, id.trim());
      const comp = calculateCompatibility(cand.skills, cand.experiences, targetRole);
      comparisonProfiles.push({
        candidateId: cand.id,
        fullName: cand.fullName,
        headline: cand.headline,
        location: cand.location,
        totalExperienceCount: cand.experiences.length,
        skillsCount: cand.skills.length,
        skills: cand.skills,
        compatibility: comp,
      });
    } catch {
      // Ignore not found candidate silently in compare list
    }
  }

  return {
    targetRole: targetRole ? targetRole.name : 'General Capability Benchmark',
    candidatesCompared: comparisonProfiles.length,
    candidates: comparisonProfiles,
    comparison: comparisonProfiles,
    comparisonDisclaimer: 'Neutral side-by-side capability comparison. Does not determine a winner or hiring decision.',
    methodologyNote: 'Neutral side-by-side capability comparison. Does not determine a winner or hiring decision.',
  };
};

export const getShortlist = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.status) where.status = query.status;

  const [total, shortlists] = await Promise.all([
    prisma.talentShortlist.count({ where }),
    prisma.talentShortlist.findMany({
      where,
      skip,
      take: limit,
      include: {
        candidate: {
          include: {
            skills: { include: { skill: true } },
            experiences: true,
          },
        },
      },
    }),
  ]);

  const items = shortlists.map((s) => ({
    id: s.id,
    organizationId: s.organizationId,
    candidateId: s.candidateId,
    fullName: s.candidate?.fullName || 'Candidate',
    headline: s.candidate?.headline || null,
    location: s.candidate?.location || null,
    notes: s.notes || null,
    status: s.status,
    skillsCount: s.candidate?.skills?.length || 0,
    shortlistedAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const addToShortlist = async (organizationId, candidateId, data = {}, userId = null) => {
  // Ensure candidate profile exists
  let candidate = await prisma.individualProfile.findUnique({ where: { id: candidateId } });
  if (!candidate) {
    candidate = await prisma.individualProfile.findUnique({ where: { userId: candidateId } });
  }

  if (!candidate) {
    throw ApiError.notFound('Candidate not found to shortlist', 'CANDIDATE_NOT_FOUND');
  }

  // Prevent duplicate shortlist records
  const existing = await prisma.talentShortlist.findUnique({
    where: {
      organizationId_candidateId: {
        organizationId,
        candidateId: candidate.id,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('Candidate is already shortlisted for this organization', 'SHORTLIST_DUPLICATE');
  }

  const created = await prisma.talentShortlist.create({
    data: {
      organizationId,
      candidateId: candidate.id,
      notes: data.notes || null,
      status: data.status || 'ACTIVE',
    },
    include: {
      candidate: true,
    },
  });

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'TALENT_SHORTLIST_ADDED',
      metadata: { organizationId, candidateId: candidate.id },
    });
  }

  return {
    id: created.id,
    organizationId: created.organizationId,
    candidateId: created.candidateId,
    fullName: created.candidate?.fullName,
    notes: created.notes,
    status: created.status,
    shortlistedAt: created.createdAt,
  };
};

export const removeFromShortlist = async (organizationId, candidateId, userId = null) => {
  let target = await prisma.talentShortlist.findUnique({
    where: {
      organizationId_candidateId: {
        organizationId,
        candidateId,
      },
    },
  });

  if (!target) {
    // Look up via individualProfile if candidateId is a profile or user ID
    const cand = await prisma.individualProfile.findUnique({ where: { id: candidateId } })
      || await prisma.individualProfile.findUnique({ where: { userId: candidateId } });
    if (cand) {
      target = await prisma.talentShortlist.findUnique({
        where: {
          organizationId_candidateId: {
            organizationId,
            candidateId: cand.id,
          },
        },
      });
    }
  }

  if (!target) {
    // Check by primary shortlist ID
    target = await prisma.talentShortlist.findUnique({ where: { id: candidateId } });
    if (target && target.organizationId !== organizationId) target = null;
  }

  if (!target) {
    throw ApiError.notFound('Shortlist record not found', 'SHORTLIST_NOT_FOUND');
  }

  const deleted = await prisma.talentShortlist.delete({
    where: { id: target.id },
  });

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'TALENT_SHORTLIST_REMOVED',
      metadata: { organizationId, candidateId: target.candidateId },
    });
  }

  return {
    id: deleted.id,
    message: 'Candidate successfully removed from organization shortlist',
  };
};

export const getCandidateSemanticCompatibility = async (organizationId, candidateId, { roleId, targetRole } = {}) => {
  const candidate = await prisma.individualProfile.findUnique({
    where: { id: candidateId },
    include: {
      skills: { include: { skill: true } },
      experiences: true,
      educations: true,
    },
  });

  if (!candidate) {
    throw ApiError.notFound('Candidate not found', 'CANDIDATE_NOT_FOUND');
  }

  let role = null;
  if (roleId) {
    role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        roleSkills: { include: { skill: true } },
      },
    });
  } else if (targetRole) {
    const allRoles = await prisma.role.findMany({
      include: { roleSkills: { include: { skill: true } } },
    });
    role = allRoles.find((r) => r.name.toLowerCase() === targetRole.toLowerCase()) || null;
  }

  const roleSkills = (role?.roleSkills || []).map((rs) => rs.skill?.name).filter(Boolean);
  const candidateSkills = (candidate.skills || []).map((cs) => cs.skill?.name).filter(Boolean);

  if (candidateSkills.length === 0 || roleSkills.length === 0) {
    return {
      candidate: {
        id: candidate.id,
        fullName: candidate.fullName,
        headline: candidate.headline,
        location: candidate.location,
      },
      role: role ? { id: role.id, name: role.name, category: role.category } : null,
      semanticCoverage: 0,
      exactMatches: [],
      normalizedMatches: [],
      semanticMatches: [],
      unmatchedRequirements: roleSkills,
      semanticEvidence: [],
      matchRate: 0,
      aggregateSemanticSignal: null,
      disclaimer:
        'Semantic compatibility is an analytical capability signal. It does not replace deterministic role criteria, candidate ranking, or hiring decisions.',
    };
  }

  const matchResult = await embeddingService.matchSkillSets(
    roleSkills,
    candidateSkills
  );

  const exactMatches = matchResult.matches.filter((m) => m.matchType === 'EXACT');
  const normalizedMatches = matchResult.matches.filter((m) => m.matchType === 'NORMALIZED');
  const semanticMatches = matchResult.matches.filter((m) => m.matchType === 'SEMANTIC');
  const unmatchedRequirements = matchResult.unmatchedSourceSkills;

  const totalReqs = roleSkills.length || 1;
  const semanticCoverage = Math.round((matchResult.matches.length / totalReqs) * 100);

  return {
    candidate: {
      id: candidate.id,
      fullName: candidate.fullName,
      headline: candidate.headline,
      location: candidate.location,
    },
    role: role ? { id: role.id, name: role.name, category: role.category } : null,
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
    disclaimer:
      'Semantic compatibility is an analytical capability signal. It does not replace deterministic role criteria, candidate ranking, or hiring decisions.',
  };
};

export default {
  calculateCompatibility,
  formatCandidate,
  getTalentPool,
  getCandidateById,
  getCandidateCompatibility,
  getCandidateSemanticCompatibility,
  compareCandidates,
  getShortlist,
  addToShortlist,
  removeFromShortlist,
};
