import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Opportunities and Saved Opportunities Service
 */

/**
 * Lists available opportunities with flexible filtering, search, and pagination.
 */
export const getOpportunities = async ({
  search = null,
  role = null,
  location = null,
  workMode = null,
  employmentType = null,
  experienceLevel = null,
  page = 1,
  limit = 20,
  sort = 'newest',
}) => {
  const skip = (page - 1) * limit;

  const where = {
    status: 'ACTIVE',
    ...(workMode && { workMode }),
    ...(employmentType && { employmentType }),
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
    ...(experienceLevel && { experienceLevel: { contains: experienceLevel, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  let orderBy = { createdAt: 'desc' };
  if (sort === 'oldest') orderBy = { createdAt: 'asc' };
  else if (sort === 'title') orderBy = { title: 'asc' };

  const [opportunities, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      include: {
        skills: {
          include: { skill: true },
        },
        advertisedCompensations: true,
      },
      orderBy,
      skip,
      take: Math.min(100, limit),
    }),
    prisma.opportunity.count({ where }),
  ]);

  return {
    opportunities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieves full details for a single opportunity.
 */
export const getOpportunityById = async (opportunityId) => {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      skills: {
        include: { skill: true },
      },
      advertisedCompensations: true,
      organization: {
        select: {
          id: true,
          name: true,
          industry: true,
          companySize: true,
          location: true,
        },
      },
    },
  });

  if (!opportunity) {
    throw ApiError.notFound('Opportunity not found', 'OPPORTUNITY_NOT_FOUND');
  }

  return opportunity;
};

/**
 * Computes deterministic skill compatibility for a specific opportunity.
 */
export const calculateOpportunityCompatibility = async (userId, opportunityId) => {
  const profile = await getProfile(userId);
  const opp = await getOpportunityById(opportunityId);

  const userSkillsMap = new Map();
  (profile.skills || []).forEach((us) => {
    userSkillsMap.set(us.skillId, us);
  });

  const matchedRequired = [];
  const missingRequired = [];
  const matchedPreferred = [];
  const missingPreferred = [];

  (opp.skills || []).forEach((os) => {
    const isRequired = os.requirementType === 'REQUIRED';
    const userSkill = userSkillsMap.get(os.skillId);

    if (userSkill) {
      if (isRequired) matchedRequired.push({ id: os.skillId, name: os.skill?.name });
      else matchedPreferred.push({ id: os.skillId, name: os.skill?.name });
    } else {
      if (isRequired) missingRequired.push({ id: os.skillId, name: os.skill?.name });
      else missingPreferred.push({ id: os.skillId, name: os.skill?.name });
    }
  });

  const reqTotal = matchedRequired.length + missingRequired.length;
  const prefTotal = matchedPreferred.length + missingPreferred.length;

  const reqFit = reqTotal > 0 ? Math.round((matchedRequired.length / reqTotal) * 100) : 100;
  const prefFit = prefTotal > 0 ? Math.round((matchedPreferred.length / prefTotal) * 100) : 100;
  const overall = Math.round(reqFit * 0.7 + prefFit * 0.3);

  // Semantic signal computation
  const userSkillNames = (profile.skills || []).map(s => (s.skill?.name || s.name || '').toLowerCase());
  const oppRequiredNames = missingRequired.map(s => (s.name || '').toLowerCase());
  const semanticEvidence = [];

  oppRequiredNames.forEach(reqName => {
    const norm = reqName.replace(/[^a-z0-9]/g, '');
    const found = userSkillNames.find(u => u.replace(/[^a-z0-9]/g, '') === norm && u !== reqName);
    if (found) {
      semanticEvidence.push({
        requiredSkill: reqName,
        candidateSkill: found,
        matchType: 'NORMALIZED',
        similarity: 0.95,
        reason: 'Canonical taxonomy alias in user profile',
      });
    }
  });

  const semanticSkillSignal = {
    exactCoveragePct: reqFit,
    semanticMatchesCount: semanticEvidence.length,
    supplementalSignalScore: semanticEvidence.length > 0 ? Math.min(100, reqFit + semanticEvidence.length * 10) : reqFit,
    isSignalOnly: true,
  };

  return {
    opportunityId: opp.id,
    title: opp.title,
    companyName: opp.companyName,
    compatibility: {
      overall,
      requiredSkillFit: reqFit,
      preferredSkillFit: prefFit,
    },
    semanticSkillSignal,
    semanticSkillEvidence: semanticEvidence,
    matchedSkills: {
      required: matchedRequired,
      preferred: matchedPreferred,
    },
    developmentAreas: {
      required: missingRequired,
      preferred: missingPreferred,
    },
    methodology: {
      type: 'Deterministic Job Requirement Compatibility Match + Supplemental Semantic Signal',
      disclaimer: 'Compatibility indicators represent skill overlap and do not calculate candidate hiring probability or selection likelihood.',
    },
  };
};

/**
 * Saved opportunities management.
 */
export const getSavedOpportunities = async (userId) => {
  return prisma.savedOpportunity.findMany({
    where: { userId },
    include: {
      opportunity: {
        include: {
          advertisedCompensations: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const saveOpportunity = async (userId, opportunityId, notes = null) => {
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw ApiError.notFound('Opportunity not found', 'OPPORTUNITY_NOT_FOUND');

  const existing = await prisma.savedOpportunity.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('Opportunity is already in your saved bookmarks', 'ALREADY_SAVED');
  }

  const saved = await prisma.savedOpportunity.create({
    data: {
      userId,
      opportunityId,
      notes,
    },
    include: {
      opportunity: true,
    },
  });

  await logAuthEvent({
    userId,
    action: 'OPPORTUNITY_SAVED',
    metadata: { opportunityId, title: opp.title },
  });

  return saved;
};

export const removeSavedOpportunity = async (userId, opportunityId) => {
  const existing = await prisma.savedOpportunity.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });

  if (!existing) {
    throw ApiError.notFound('Saved bookmark not found', 'SAVED_NOT_FOUND');
  }

  await prisma.savedOpportunity.delete({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });

  return { message: 'Opportunity removed from saved bookmarks' };
};

export default {
  getOpportunities,
  getOpportunityById,
  calculateOpportunityCompatibility,
  getSavedOpportunities,
  saveOpportunity,
  removeSavedOpportunity,
};
