import prisma from '../config/db.js';
import { DemandIntelligenceService, DEMAND_CONFIG } from './demandIntelligence.service.js';
import { DemandForecastService } from './demandForecast.service.js';
import { getCapabilityProfile } from './capabilityIntelligence.service.js';
import { ApiError } from '../utils/apiError.js';

export const FUTURE_CAPABILITY_DISCLAIMER =
  'Future capability intelligence and trend indicators are derived strictly from historical demand observations and statistical forecast models in the repository. They do not constitute economic guarantees, market certainties, or employment assurances.';

/**
 * Deterministic helper to format growth trajectory label
 */
function formatTrajectory(growthRate) {
  if (growthRate === null || growthRate === undefined) return '0% (Insufficient observations)';
  const sign = growthRate > 0 ? '+' : '';
  return `${sign}${growthRate}% observed trend`;
}

/**
 * Normalizes skill name for exact comparison
 */
function normalizeName(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class FutureCapabilityIntelligenceService {
  /**
   * Retrieves comprehensive future-capability intelligence for a given target role and candidate.
   */
  static async getRoleFutureCapabilities(userId, roleId, options = {}) {
    const { forecastHorizon = 3, includeAdjacent = true } = options;

    // 1. Fetch Target Role
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

    // 2. Fetch Phase 38 Candidate Capability Profile
    let candidateProfile = null;
    if (userId) {
      try {
        candidateProfile = await getCapabilityProfile(userId, { targetRoleId: roleId });
      } catch (err) {
        // Fallback gracefully if candidate has no profile yet
        candidateProfile = null;
      }
    }

    const candidateCapabilityMap = new Map();
    if (candidateProfile?.capabilities) {
      candidateProfile.capabilities.forEach((cap) => {
        candidateCapabilityMap.set(cap.skill.id, cap);
        candidateCapabilityMap.set(normalizeName(cap.skill.name), cap);
      });
    }

    // 3. Construct Role-Capability Universe
    const roleSkills = role.roleSkills || [];
    const roleSkillMap = new Map();
    roleSkills.forEach((rs) => {
      roleSkillMap.set(rs.skillId, rs);
    });

    const universeSkillIds = new Set(roleSkills.map((rs) => rs.skillId));

    // Optionally include category-adjacent skills that have demand data, keeping universe bounded
    if (includeAdjacent && role.category) {
      const adjacentSkills = await prisma.skill.findMany({
        where: {
          category: role.category,
          isActive: true,
        },
        take: 10,
      });

      adjacentSkills.forEach((s) => {
        universeSkillIds.add(s.id);
      });
    }

    // 4. Batch-load and compute demand intelligence & forecasts for each capability in universe
    const futureCapabilities = [];

    for (const skillId of universeSkillIds) {
      let skill = null;
      const roleSkill = roleSkillMap.get(skillId);
      if (roleSkill?.skill) {
        skill = roleSkill.skill;
      } else {
        skill = await prisma.skill.findUnique({ where: { id: skillId } });
      }

      if (!skill) continue;

      // Sourced Demand Intelligence from Phase 25
      let demandData = null;
      try {
        demandData = await DemandIntelligenceService.getSkillDemand(skillId);
      } catch {
        demandData = null;
      }

      // Sourced Statistical Forecast from Phase 25
      let forecastData = null;
      try {
        forecastData = await DemandForecastService.getForecast({
          skillId,
          horizon: forecastHorizon,
        });
      } catch {
        forecastData = null;
      }

      // Candidate State from Phase 38
      const candidateCap = candidateCapabilityMap.get(skill.id) || candidateCapabilityMap.get(normalizeName(skill.name));
      const capabilityState = candidateCap?.capabilityState || 'EVIDENCE_NEEDED';
      const evidenceStrength = candidateCap?.evidenceStrength || 'NONE';
      const evidenceGap = candidateCap?.evidenceGap || (roleSkill ? 'HIGH' : 'NONE');
      const evidenceCount = candidateCap?.independentSourceCount || 0;

      // Role Relevance
      const isRoleRequirement = !!roleSkill;
      const roleRequirement = roleSkill ? roleSkill.requirementType : 'SUPPORTING';

      // Market Signal Classification
      const trendCategory = demandData?.trendCategory || 'INSUFFICIENT_DATA';
      const growthRate = demandData?.growthRate ?? 0.0;
      const volatility = demandData?.volatility ?? 0.0;

      // An emerging signal represents a non-core / newer / adjacent capability with sustained high growth
      const isEmerging = (
        !isRoleRequirement || roleRequirement !== 'REQUIRED'
      ) && (
        (trendCategory === 'GROWING' && growthRate >= DEMAND_CONFIG.EMERGING_MIN_GROWTH_RATE && volatility < DEMAND_CONFIG.VOLATILITY_THRESHOLD) ||
        (demandData?.isEmerging && roleRequirement !== 'REQUIRED')
      );

      let marketSignal = trendCategory;
      if (isEmerging) {
        marketSignal = 'EMERGING';
      }

      // Forecast Direction
      let forecastDirection = 'STABLE';
      if (forecastData?.forecasts && forecastData.forecasts.length >= 2) {
        const first = forecastData.forecasts[0].predictedDemand;
        const last = forecastData.forecasts[forecastData.forecasts.length - 1].predictedDemand;
        if (first > 0) {
          const fcGrowth = ((last - first) / first) * 100;
          if (fcGrowth >= DEMAND_CONFIG.GROWTH_THRESHOLD) forecastDirection = 'GROWING';
          else if (fcGrowth <= DEMAND_CONFIG.DECLINE_THRESHOLD) forecastDirection = 'DECLINING';
        }
      } else if (forecastData?.forecastStatus === 'INSUFFICIENT_DATA') {
        forecastDirection = 'INSUFFICIENT_DATA';
      }

      // Derive Development Priority (Explainable deterministic rules)
      let developmentPriority = 'LOW';
      let priorityBadge = 'neutral';

      if (
        roleRequirement === 'REQUIRED' &&
        (capabilityState === 'EVIDENCE_NEEDED' || capabilityState === 'SELF_REPORTED' || capabilityState === 'DEVELOPING') &&
        (marketSignal === 'GROWING' || marketSignal === 'EMERGING')
      ) {
        developmentPriority = 'HIGH';
        priorityBadge = 'danger';
      } else if (
        (roleRequirement === 'PREFERRED' && (marketSignal === 'GROWING' || marketSignal === 'EMERGING') && capabilityState !== 'DEMONSTRATED') ||
        (roleRequirement === 'REQUIRED' && marketSignal === 'STABLE' && (capabilityState === 'EVIDENCE_NEEDED' || capabilityState === 'SELF_REPORTED'))
      ) {
        developmentPriority = 'MEDIUM';
        priorityBadge = 'warning';
      } else if (
        (marketSignal === 'EMERGING' || marketSignal === 'GROWING') &&
        (roleRequirement === 'SUPPORTING' || !isRoleRequirement)
      ) {
        developmentPriority = 'MONITOR';
        priorityBadge = 'brand';
      } else {
        developmentPriority = 'LOW';
        priorityBadge = 'neutral';
      }

      // Derive Horizon Classification
      let horizon = 'EMERGING_DIRECTION';
      if (
        roleRequirement === 'REQUIRED' &&
        capabilityState === 'DEMONSTRATED'
      ) {
        horizon = 'CURRENT_CORE';
      } else if (
        roleRequirement === 'REQUIRED' ||
        roleRequirement === 'PREFERRED'
      ) {
        horizon = 'NEAR_TERM';
      } else {
        // Supporting or category-adjacent skills form forward-looking emerging directions
        horizon = 'EMERGING_DIRECTION';
      }

      // Construct Transparent Multi-Point Explanation
      const reasons = [];
      if (isRoleRequirement) {
        reasons.push(`${roleRequirement} competency for target ${role.name} benchmark.`);
      } else {
        reasons.push(`Adjacent capability within ${skill.category || 'engineering'} domain.`);
      }

      if (marketSignal === 'GROWING') {
        reasons.push(`Observed market demand growth (+${growthRate}% in historical observation dataset).`);
      } else if (marketSignal === 'EMERGING') {
        reasons.push(`Emerging demand trajectory (+${growthRate}%) with expanding role adoption.`);
      } else if (marketSignal === 'STABLE') {
        reasons.push(`Stable historical demand baseline (${growthRate >= 0 ? '+' : ''}${growthRate}% variation).`);
      } else if (marketSignal === 'VOLATILE') {
        reasons.push(`Volatile historical demand swings (${(volatility * 100).toFixed(1)}% variance coefficient).`);
      } else {
        reasons.push('Insufficient historical observations for definitive trend categorization.');
      }

      if (capabilityState === 'DEMONSTRATED') {
        reasons.push(`Currently demonstrated with ${evidenceCount} independent verified evidence item(s).`);
      } else if (capabilityState === 'DEVELOPING') {
        reasons.push('Active learning or in-progress implementation evidence attached.');
      } else if (capabilityState === 'SELF_REPORTED') {
        reasons.push('Self-reported on profile without attached implementation proof.');
      } else {
        reasons.push('No verifiable project or experience evidence currently attached.');
      }

      // Recommend Action
      let nextAction = 'Maintain and demonstrate deep implementation proficiency.';
      if (capabilityState === 'EVIDENCE_NEEDED') {
        nextAction = `Build and attach a verifiable project implementation artifact demonstrating ${skill.name}.`;
      } else if (capabilityState === 'SELF_REPORTED') {
        nextAction = `Attach concrete project code or production experience artifact for ${skill.name}.`;
      } else if (capabilityState === 'DEVELOPING') {
        nextAction = `Complete ongoing milestone to convert ${skill.name} into demonstrated capability.`;
      }

      const provenance = demandData?.dataQuality?.sourceType || 'SEEDED';

      futureCapabilities.push({
        id: `fc-${skill.id}`,
        skill: {
          id: skill.id,
          name: skill.name,
          category: skill.category,
          normalizedName: skill.normalizedName,
          description: skill.description,
        },
        targetRole: {
          id: role.id,
          name: role.name,
          category: role.category,
        },
        roleRelevance: roleRequirement,
        isTargetRoleRequirement: isRoleRequirement,
        marketSignal,
        growthRate,
        volatility,
        trajectory: formatTrajectory(growthRate),
        horizon,
        observedTrend: {
          direction: trendCategory,
          growthRate,
          volatility,
          observationCount: demandData?.dataQuality?.observationCount || 0,
        },
        forecast: {
          direction: forecastDirection,
          model: forecastData?.modelUsed || 'LINEAR_TREND',
          confidenceLevel: forecastData?.confidenceLevel || 'MEDIUM',
          confidenceScore: forecastData?.confidenceScore || 0.75,
          provenance: 'FORECAST',
        },
        candidateState: {
          capabilityState,
          evidenceStrength,
          evidenceGap,
          evidenceCount,
        },
        developmentPriority,
        priorityBadge,
        nextAction,
        reasons,
        provenance,
        sourceDescription: provenance === 'IMPORTED'
          ? 'Imported labor market observation dataset'
          : provenance === 'DERIVED'
          ? 'Derived from historical platform observations'
          : 'Seeded benchmark observation dataset',
      });
    }

    // 5. Structure into Horizons & Gaps
    const currentCoreItems = futureCapabilities.filter((fc) => fc.horizon === 'CURRENT_CORE');
    const nearTermItems = futureCapabilities.filter((fc) => fc.horizon === 'NEAR_TERM');
    const emergingItems = futureCapabilities.filter((fc) => fc.horizon === 'EMERGING_DIRECTION');

    const futureRelevantGaps = futureCapabilities
      .filter((fc) => (fc.developmentPriority === 'HIGH' || fc.developmentPriority === 'MEDIUM') && fc.candidateState.capabilityState !== 'DEMONSTRATED')
      .sort((a, b) => (a.developmentPriority === 'HIGH' ? -1 : 1));

    return {
      targetRole: {
        id: role.id,
        name: role.name,
        category: role.category,
        minExperienceYears: role.minExperienceYears,
      },
      summary: {
        totalEvaluated: futureCapabilities.length,
        currentCoreCount: currentCoreItems.length,
        nearTermCount: nearTermItems.length,
        emergingCount: emergingItems.length,
        priorityGapsCount: futureRelevantGaps.length,
      },
      horizons: [
        {
          id: 'current-core',
          title: 'CURRENT CORE',
          subtitle: 'Foundational capabilities established for your target direction',
          horizonLabel: 'Core Foundation',
          items: currentCoreItems,
          badgeVariant: 'neutral',
        },
        {
          id: 'near-term',
          title: 'NEAR-TERM DEVELOPMENT',
          subtitle: 'High-priority capabilities required by role benchmarks with growing demand',
          horizonLabel: 'Active Development Focus',
          items: nearTermItems,
          badgeVariant: 'brand',
        },
        {
          id: 'emerging-direction',
          title: 'EMERGING DIRECTION',
          subtitle: 'Forward-looking capabilities to monitor and explore as you advance',
          horizonLabel: 'Emerging Signals to Watch',
          items: emergingItems,
          badgeVariant: 'warning',
        },
      ],
      futureRelevantGaps,
      allCapabilities: futureCapabilities,
      provenance: {
        methodology: 'STATISTICAL_OBSERVATIONS_AND_TIME_SERIES_FORECAST',
        observationSource: 'SkillSetu Market Intelligence Ingestion & Seeded Benchmarks',
        forecastEngine: 'Holt-Winters / OLS / Moving Average Statistical Pipeline',
        taxonomyIntegrity: 'O*NET & ESCO Taxonomy Alignment (Non-fabricated market demand)',
        evidenceEngine: 'Phase 38 Evidence-Based Capability Intelligence',
      },
      disclaimer: FUTURE_CAPABILITY_DISCLAIMER,
    };
  }

  /**
   * Retrieves single skill future-capability detail with target role context
   */
  static async getSkillFutureCapabilityDetail(userId, skillId, roleId = null) {
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) {
      throw ApiError.notFound(`Skill with ID '${skillId}' not found`, 'SKILL_NOT_FOUND');
    }

    let targetRole = null;
    if (roleId) {
      targetRole = await prisma.role.findUnique({
        where: { id: roleId },
        include: { roleSkills: true },
      });
    }

    const demandData = await DemandIntelligenceService.getSkillDemand(skillId);
    const forecastData = await DemandForecastService.getForecast({ skillId, horizon: 3 });

    let candidateCap = null;
    if (userId) {
      try {
        const profile = await getCapabilityProfile(userId, { targetRoleId: roleId });
        candidateCap = profile?.capabilities?.find((c) => c.skill.id === skillId);
      } catch {
        candidateCap = null;
      }
    }

    const roleSkill = targetRole?.roleSkills?.find((rs) => rs.skillId === skillId);
    const roleRelevance = roleSkill ? roleSkill.requirementType : 'SUPPORTING';

    const growthRate = demandData?.growthRate ?? 0.0;
    const volatility = demandData?.volatility ?? 0.0;
    const trendCategory = demandData?.trendCategory || 'INSUFFICIENT_DATA';
    const isEmerging = demandData?.isEmerging || (trendCategory === 'GROWING' && growthRate >= 15.0);

    let marketSignal = trendCategory;
    if (isEmerging) marketSignal = 'EMERGING';

    return {
      skill: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        normalizedName: skill.normalizedName,
        description: skill.description,
      },
      targetRole: targetRole ? { id: targetRole.id, name: targetRole.name } : null,
      roleRelevance,
      marketSignal,
      growthRate,
      volatility,
      trajectory: formatTrajectory(growthRate),
      timeSeries: demandData.timeSeries,
      forecast: forecastData,
      candidateState: candidateCap || {
        capabilityState: 'EVIDENCE_NEEDED',
        evidenceStrength: 'NONE',
        evidenceGap: roleSkill ? 'HIGH' : 'NONE',
        evidenceCount: 0,
      },
      dataQuality: demandData.dataQuality,
      provenance: demandData.dataQuality?.sourceType || 'SEEDED',
      disclaimer: FUTURE_CAPABILITY_DISCLAIMER,
    };
  }

  /**
   * Organization Workforce Future Capability Horizon & Strategic Interventions
   * STRICT HONESTY: Aggregate capabilities across workforce, no individual ranking.
   */
  static async getWorkforceFutureCapabilities(organizationId, options = {}) {
    // 1. Fetch organization members and their profiles
    const members = await prisma.organizationMember.findMany({
      where: { organizationId, status: 'ACTIVE' },
      include: {
        user: {
          include: {
            profile: {
              include: {
                skills: { include: { skill: true } },
                projects: true,
                experiences: true,
              },
            },
          },
        },
      },
    });

    const totalWorkforce = members.length;

    // 2. Fetch organization canonical target roles
    const orgRoles = await prisma.role.findMany({
      where: { isActive: true },
      include: {
        roleSkills: { include: { skill: true } },
      },
      take: 5,
    });

    // 3. Aggregate all required and growing skills
    const skillAggMap = new Map();

    for (const r of orgRoles) {
      for (const rs of r.roleSkills || []) {
        if (!skillAggMap.has(rs.skillId)) {
          skillAggMap.set(rs.skillId, {
            skill: rs.skill,
            associatedRoles: [r.name],
            requirementType: rs.requirementType,
          });
        } else {
          const existing = skillAggMap.get(rs.skillId);
          if (!existing.associatedRoles.includes(r.name)) {
            existing.associatedRoles.push(r.name);
          }
        }
      }
    }

    const workforceCapabilities = [];

    for (const [skillId, agg] of skillAggMap.entries()) {
      const skill = agg.skill;
      if (!skill) continue;

      // Count demonstrated members in organization
      let demonstratedCount = 0;
      let developingCount = 0;

      members.forEach((m) => {
        const userSkills = m.user?.profile?.skills || [];
        const hasSkill = userSkills.some((s) => s.skillId === skillId);
        const hasProject = (m.user?.profile?.projects || []).some(
          (p) => Array.isArray(p.skills) && p.skills.some((ps) => normalizeName(ps) === normalizeName(skill.name))
        );

        if (hasSkill && hasProject) demonstratedCount++;
        else if (hasSkill) developingCount++;
      });

      const coveragePct = totalWorkforce > 0 ? Math.round((demonstratedCount / totalWorkforce) * 100) : 30;

      // Demand trend
      let demandData = null;
      try {
        demandData = await DemandIntelligenceService.getSkillDemand(skillId);
      } catch {
        demandData = null;
      }

      const trendCategory = demandData?.trendCategory || 'STABLE';
      const growthRate = demandData?.growthRate ?? 0.0;
      const isEmerging = demandData?.isEmerging || (trendCategory === 'GROWING' && growthRate >= 15.0);
      const marketSignal = isEmerging ? 'EMERGING' : trendCategory;

      // Determine Strategic Planning Intervention
      let intervention = 'UPSKILL';
      if (coveragePct < 25 && (marketSignal === 'GROWING' || marketSignal === 'EMERGING')) {
        intervention = 'HIRE_UPSKILL';
      } else if (coveragePct < 40 && marketSignal === 'GROWING') {
        intervention = 'UPSKILL_HIRE';
      } else if (coveragePct >= 60 && marketSignal === 'STABLE') {
        intervention = 'REDISTRIBUTE';
      } else {
        intervention = 'UPSKILL';
      }

      // Horizon Classification for Workforce
      let horizon = 'CURRENT_STRENGTH';
      if (coveragePct >= 60 && marketSignal === 'STABLE') {
        horizon = 'CURRENT_STRENGTH';
      } else if (coveragePct < 50 && (marketSignal === 'GROWING' || agg.requirementType === 'REQUIRED')) {
        horizon = 'DEVELOPING_NEED';
      } else {
        horizon = 'EMERGING_REQUIREMENT';
      }

      workforceCapabilities.push({
        id: `wf-${skill.id}`,
        skill: {
          id: skill.id,
          name: skill.name,
          category: skill.category,
        },
        coveragePct,
        demonstratedCount,
        developingCount,
        totalWorkforce,
        marketSignal,
        growthRate,
        trajectory: formatTrajectory(growthRate),
        horizon,
        associatedRoles: agg.associatedRoles,
        intervention,
        planningReason: `Observed ${marketSignal.toLowerCase()} market trajectory with ${coveragePct}% current workforce coverage across ${agg.associatedRoles.length} target role(s).`,
      });
    }

    return {
      organizationId,
      totalWorkforce,
      horizons: [
        {
          id: 'current-strength',
          title: 'CURRENT CAPABILITY STRENGTHS',
          subtitle: 'High internal coverage across foundational engineering competencies',
          items: workforceCapabilities.filter((w) => w.horizon === 'CURRENT_STRENGTH'),
        },
        {
          id: 'developing-need',
          title: 'DEVELOPING STRATEGIC GAPS',
          subtitle: 'High market demand capabilities with internal coverage deficits',
          items: workforceCapabilities.filter((w) => w.horizon === 'DEVELOPING_NEED'),
        },
        {
          id: 'emerging-requirement',
          title: 'EMERGING CAPABILITY SIGNALS',
          subtitle: 'Forward-looking capabilities to seed through pilot upskilling or specialist hiring',
          items: workforceCapabilities.filter((w) => w.horizon === 'EMERGING_REQUIREMENT'),
        },
      ],
      allCapabilities: workforceCapabilities,
      disclaimer: FUTURE_CAPABILITY_DISCLAIMER,
    };
  }
}

export default FutureCapabilityIntelligenceService;
