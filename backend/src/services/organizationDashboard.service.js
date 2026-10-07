import { getSnapshot } from './organization.service.js';
import { getAggregatedSkillIntelligence } from './organizationSkillIntelligence.service.js';
import { getSkillGaps } from './organizationSkillGap.service.js';
import { getFutureSkills } from './futureSkill.service.js';
import { getTalentPool, getShortlist } from './talent.service.js';
import { getPlanningOverview } from './workforcePlanning.service.js';
import { getGrowthOverview } from './organizationGrowth.service.js';
import { getCompensationOverview } from './compensation.service.js';

export const getOrganizationDashboard = async (organizationId) => {
  const [
    snapshot,
    skillIntelligence,
    skillGaps,
    futureSkills,
    talentPool,
    shortlist,
    planning,
    growth,
    compensation,
  ] = await Promise.all([
    getSnapshot(organizationId),
    getAggregatedSkillIntelligence(organizationId),
    getSkillGaps(organizationId, { limit: 5 }),
    getFutureSkills(organizationId, { limit: 5 }),
    getTalentPool(organizationId, { limit: 5 }),
    getShortlist(organizationId, { limit: 5 }),
    getPlanningOverview(organizationId),
    getGrowthOverview(organizationId),
    getCompensationOverview(organizationId),
  ]);

  return {
    snapshot,
    organizationSnapshot: snapshot,
    capability: {
      overallWorkforceCoveragePct: skillIntelligence.overallWorkforceCoveragePct,
      averageCapability: skillIntelligence.averageCapability,
      totalTrackedSkills: skillIntelligence.totalTrackedSkills,
      strongestAreas: skillIntelligence.strongestSkillAreas.slice(0, 4),
      developingAreas: skillIntelligence.developingSkillAreas.slice(0, 4),
      topGaps: skillGaps.items,
    },
    futureSkills: {
      requirementsCount: futureSkills.pagination.total,
      topRequirements: futureSkills.items,
      type: 'Planning Assumptions',
    },
    talent: {
      candidatePoolCount: talentPool.pagination.total,
      shortlistCount: shortlist.pagination.total,
      recentCandidates: talentPool.items.slice(0, 3),
      recentShortlist: shortlist.items.slice(0, 3),
    },
    planning: {
      capacityGap: planning.capacityGap,
      planningPriority: planning.planningPriority,
      actionMix: planning.actionMix,
      planningSignals: planning.planningSignals,
    },
    development: {
      activity: growth.developmentActivity,
      capability: growth.capabilityDevelopment,
      milestonesSummary: growth.milestonesSummary,
    },
    compensation: {
      averageRange: compensation.overview,
      topRolePatterns: compensation.rolePatterns.slice(0, 3),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      disclaimer: 'Deterministic aggregated organization telemetry. Not individual employee performance scoring.',
    },
  };
};

export default {
  getOrganizationDashboard,
};
