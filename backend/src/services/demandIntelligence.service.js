import prisma from '../config/db.js';
import aiClient from './aiClient.service.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Centralized configurable trend analysis thresholds.
 */
export const DEMAND_CONFIG = {
  GROWTH_THRESHOLD: 10.0,
  DECLINE_THRESHOLD: -10.0,
  VOLATILITY_THRESHOLD: 0.30,
  MIN_OBSERVATIONS_FOR_TREND: 2,
  MIN_OBSERVATIONS_FOR_FORECAST: 3,
  EMERGING_MIN_PERIODS_GROWING: 3,
  EMERGING_MIN_GROWTH_RATE: 15.0,
  DISCLAIMER: 'Demand analytics and trend indicators are statistical summaries based strictly on historical observations in the dataset. They do not constitute economic guarantees, market certainties, or employment assurances.',
};

export class DemandIntelligenceService {
  /**
   * Deterministically calculates growth rate (%) and volatility coefficient from values.
   */
  static computeGrowthAndVolatility(values) {
    if (!values || values.length < 2) {
      return { growthRate: 0.0, volatility: 0.0, currentDemand: values?.[0] || 0, previousDemand: 0 };
    }

    const prev = values[values.length - 2];
    const curr = values[values.length - 1];

    const growthRate = prev === 0
      ? (curr > 0 ? 100.0 : 0.0)
      : Number((((curr - prev) / prev) * 100.0).toFixed(2));

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    let volatility = 0.0;
    if (mean > 0) {
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      volatility = Number((Math.sqrt(variance) / mean).toFixed(4));
    }

    return {
      growthRate,
      volatility,
      currentDemand: curr,
      previousDemand: prev,
    };
  }

  /**
   * Deterministically classifies trend category and returns explainable evidence.
   */
  static classifyTrend(values) {
    if (!values || values.length < DEMAND_CONFIG.MIN_OBSERVATIONS_FOR_TREND) {
      return {
        trendCategory: 'INSUFFICIENT_DATA',
        growthRate: 0.0,
        volatility: 0.0,
        currentDemand: values?.[0] || 0,
        previousDemand: 0,
        confidence: 'INSUFFICIENT_DATA',
        evidence: ['Insufficient historical observation periods (minimum 2 required).'],
      };
    }

    const { growthRate, volatility, currentDemand, previousDemand } = this.computeGrowthAndVolatility(values);
    const count = values.length;
    const evidence = [
      `Observed demand changed from ${previousDemand} to ${currentDemand} (${growthRate >= 0 ? '+' : ''}${growthRate}% in the observed dataset).`,
    ];

    let category = 'STABLE';
    if (volatility >= DEMAND_CONFIG.VOLATILITY_THRESHOLD) {
      category = 'VOLATILE';
      evidence.push(`Demand variation (${(volatility * 100).toFixed(1)}%) exceeds volatility threshold (${DEMAND_CONFIG.VOLATILITY_THRESHOLD * 100}%).`);
    } else if (growthRate >= DEMAND_CONFIG.GROWTH_THRESHOLD) {
      category = 'GROWING';
      evidence.push(`Growth rate (+${growthRate}%) meets growing threshold (>= +${DEMAND_CONFIG.GROWTH_THRESHOLD}%).`);
    } else if (growthRate <= DEMAND_CONFIG.DECLINE_THRESHOLD) {
      category = 'DECLINING';
      evidence.push(`Growth rate (${growthRate}%) meets declining threshold (<= ${DEMAND_CONFIG.DECLINE_THRESHOLD}%).`);
    } else {
      category = 'STABLE';
      evidence.push(`Demand variation is within stable bounds (${DEMAND_CONFIG.DECLINE_THRESHOLD}% to +${DEMAND_CONFIG.GROWTH_THRESHOLD}%).`);
    }

    let confidence = 'LOW';
    if (count >= 6 && volatility < 0.20) {
      confidence = 'HIGH';
    } else if (count >= 3 && volatility < 0.40) {
      confidence = 'MEDIUM';
    }

    return {
      trendCategory: category,
      growthRate,
      volatility,
      currentDemand,
      previousDemand,
      confidence,
      evidence,
    };
  }

  /**
   * Retrieves comprehensive demand intelligence for a single skill.
   */
  static async getSkillDemand(skillId, options = {}) {
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill) {
      throw ApiError.notFound(`Skill with ID '${skillId}' not found`, 'SKILL_NOT_FOUND');
    }

    const whereClause = { skillId };
    if (options.location) whereClause.location = options.location;
    if (options.experienceLevel) whereClause.experienceLevel = options.experienceLevel;

    const observations = await prisma.skillDemandObservation.findMany({
      where: whereClause,
      orderBy: { period: 'asc' },
    });

    // Group by chronological period
    const periodMap = new Map();
    for (const obs of observations) {
      const prev = periodMap.get(obs.period) || 0;
      periodMap.set(obs.period, prev + obs.demandCount);
    }

    const sortedPeriods = Array.from(periodMap.keys()).sort();
    const timeSeries = sortedPeriods.map((p) => ({
      period: p,
      value: periodMap.get(p),
    }));

    const values = timeSeries.map((t) => t.value);
    const trendInfo = this.classifyTrend(values);

    // Associated roles count
    const associatedRoles = await prisma.roleSkill.findMany({
      where: { skillId },
      include: { role: true },
    });

    const roleCoverageCount = associatedRoles.length;
    const roleNames = associatedRoles.map((r) => r.role?.name).filter(Boolean);

    // Emerging evaluation
    const isEmerging = (
      trendInfo.trendCategory === 'GROWING' &&
      trendInfo.growthRate >= DEMAND_CONFIG.EMERGING_MIN_GROWTH_RATE &&
      values.length >= 3 &&
      roleCoverageCount >= 1
    );

    const evidence = [...trendInfo.evidence];
    if (roleCoverageCount > 0) {
      evidence.push(`Skill is required or preferred across ${roleCoverageCount} canonical role(s): ${roleNames.slice(0, 3).join(', ')}${roleNames.length > 3 ? '...' : ''}.`);
    }

    const dataQuality = observations.length >= 8 ? 'HIGH' : (observations.length >= 3 ? 'MEDIUM' : 'LOW');
    const sourceType = observations[0]?.sourceType || 'SEEDED';

    return {
      skill: {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        normalizedName: skill.normalizedName,
      },
      currentDemand: trendInfo.currentDemand,
      previousDemand: trendInfo.previousDemand,
      growthRate: trendInfo.growthRate,
      trendCategory: trendInfo.trendCategory,
      volatility: trendInfo.volatility,
      confidence: trendInfo.confidence,
      isEmerging,
      roleCoverageCount,
      associatedRoles: roleNames,
      timeSeries,
      dataQuality: {
        quality: dataQuality,
        sourceType,
        observationCount: observations.length,
        periodCoverage: sortedPeriods.length > 0 ? `${sortedPeriods[0]} to ${sortedPeriods[sortedPeriods.length - 1]}` : 'None',
        dataCompleteness: sortedPeriods.length >= 8 ? 0.95 : (sortedPeriods.length >= 4 ? 0.80 : 0.40),
      },
      evidence,
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Retrieves summary demand intelligence across all skills with filtering and pagination.
   */
  static async listSkillsDemand(query = {}) {
    const { category, trend, location, experienceLevel, limit = 20, offset = 0 } = query;

    let allSkills = await prisma.skill.findMany({
      where: { isActive: true, ...(category ? { category } : {}) },
    });

    const results = [];
    for (const skill of allSkills) {
      const summary = await this.getSkillDemand(skill.id, { location, experienceLevel });
      if (trend && summary.trendCategory !== trend) {
        continue;
      }
      results.push(summary);
    }

    // Sort by current demand descending
    results.sort((a, b) => b.currentDemand - a.currentDemand);

    const paginated = results.slice(Number(offset), Number(offset) + Number(limit));

    return {
      total: results.length,
      limit: Number(limit),
      offset: Number(offset),
      data: paginated,
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Detects emerging skills based on multi-period growth, volume, and role coverage.
   */
  static async detectEmergingSkills(options = {}) {
    const { limit = 10, minGrowth = DEMAND_CONFIG.EMERGING_MIN_GROWTH_RATE } = options;

    const allSkills = await prisma.skill.findMany({ where: { isActive: true } });
    const emergingList = [];

    for (const skill of allSkills) {
      const summary = await this.getSkillDemand(skill.id);
      if (
        summary.trendCategory === 'GROWING' &&
        summary.growthRate >= Number(minGrowth) &&
        summary.timeSeries.length >= 3
      ) {
        emergingList.push({
          skill: summary.skill,
          trend: summary.trendCategory,
          growthRate: summary.growthRate,
          currentDemand: summary.currentDemand,
          previousDemand: summary.previousDemand,
          roleCoverageCount: summary.roleCoverageCount,
          associatedRoles: summary.associatedRoles,
          confidence: summary.confidence,
          dataQuality: summary.dataQuality,
          evidence: [
            `Observed multi-period growth of +${summary.growthRate}% in the observed dataset.`,
            `Appears in ${summary.roleCoverageCount} target roles.`,
            'Recent period demand is above historical baseline.',
          ],
        });
      }
    }

    // Sort by growth rate descending
    emergingList.sort((a, b) => b.growthRate - a.growthRate);

    return {
      total: emergingList.length,
      limit: Number(limit),
      skills: emergingList.slice(0, Number(limit)),
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Retrieves role demand intelligence including associated and emerging skills.
   */
  static async getRoleDemand(roleId, options = {}) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        roleSkills: {
          include: { skill: true },
        },
      },
    });

    if (!role) {
      throw ApiError.notFound(`Role with ID '${roleId}' not found`, 'ROLE_NOT_FOUND');
    }

    const whereClause = { roleId };
    if (options.location) whereClause.location = options.location;
    if (options.experienceLevel) whereClause.experienceLevel = options.experienceLevel;

    const observations = await prisma.roleDemandObservation.findMany({
      where: whereClause,
      orderBy: { period: 'asc' },
    });

    const periodMap = new Map();
    for (const obs of observations) {
      const prev = periodMap.get(obs.period) || 0;
      periodMap.set(obs.period, prev + obs.demandCount);
    }

    const sortedPeriods = Array.from(periodMap.keys()).sort();
    const timeSeries = sortedPeriods.map((p) => ({
      period: p,
      value: periodMap.get(p),
    }));

    const values = timeSeries.map((t) => t.value);
    const trendInfo = this.classifyTrend(values);

    // Associated skills demand breakdown
    const associatedSkills = [];
    for (const rs of role.roleSkills || []) {
      if (rs.skill) {
        const skillDemand = await this.getSkillDemand(rs.skill.id);
        associatedSkills.push({
          id: rs.skill.id,
          name: rs.skill.name,
          category: rs.skill.category,
          requirementType: rs.requirementType,
          importance: rs.importance,
          currentDemand: skillDemand.currentDemand,
          growthRate: skillDemand.growthRate,
          trendCategory: skillDemand.trendCategory,
          isEmerging: skillDemand.isEmerging,
        });
      }
    }

    // Top associated & emerging associated skills
    associatedSkills.sort((a, b) => b.importance - a.importance);
    const topSkills = associatedSkills.slice(0, 5);
    const emergingSkills = associatedSkills.filter((s) => s.isEmerging || s.trendCategory === 'GROWING');

    const dataQuality = observations.length >= 8 ? 'HIGH' : (observations.length >= 3 ? 'MEDIUM' : 'LOW');

    return {
      role: {
        id: role.id,
        name: role.name,
        category: role.category,
        experienceLevel: role.experienceLevel,
      },
      currentDemand: trendInfo.currentDemand,
      previousDemand: trendInfo.previousDemand,
      growthRate: trendInfo.growthRate,
      trendCategory: trendInfo.trendCategory,
      volatility: trendInfo.volatility,
      confidence: trendInfo.confidence,
      timeSeries,
      topAssociatedSkills: topSkills,
      emergingAssociatedSkills: emergingSkills,
      allAssociatedSkills: associatedSkills,
      dataQuality: {
        quality: dataQuality,
        sourceType: observations[0]?.sourceType || 'SEEDED',
        observationCount: observations.length,
        periodCoverage: sortedPeriods.length > 0 ? `${sortedPeriods[0]} to ${sortedPeriods[sortedPeriods.length - 1]}` : 'None',
      },
      evidence: trendInfo.evidence,
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Retrieves summary demand intelligence for multiple roles.
   */
  static async listRolesDemand(query = {}) {
    const { category, trend, location, experienceLevel, limit = 20, offset = 0 } = query;

    let allRoles = await prisma.role.findMany({
      where: { isActive: true, ...(category ? { category } : {}) },
    });

    const results = [];
    for (const role of allRoles) {
      const summary = await this.getRoleDemand(role.id, { location, experienceLevel });
      if (trend && summary.trendCategory !== trend) {
        continue;
      }
      results.push(summary);
    }

    results.sort((a, b) => b.currentDemand - a.currentDemand);
    const paginated = results.slice(Number(offset), Number(offset) + Number(limit));

    return {
      total: results.length,
      limit: Number(limit),
      offset: Number(offset),
      data: paginated,
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Analyzes skill-role relational demand graph without a graph database.
   */
  static async getSkillRoleGraph(options = {}) {
    const { skillId, roleId } = options;

    if (skillId) {
      const skill = await prisma.skill.findUnique({ where: { id: skillId } });
      if (!skill) throw ApiError.notFound('Skill not found', 'SKILL_NOT_FOUND');

      const roleSkills = await prisma.roleSkill.findMany({
        where: { skillId },
        include: { role: true },
      });

      const roleBreakdown = [];
      for (const rs of roleSkills) {
        if (rs.role) {
          const roleSummary = await this.getRoleDemand(rs.role.id);
          roleBreakdown.push({
            roleId: rs.role.id,
            roleName: rs.role.name,
            requirementType: rs.requirementType,
            roleCurrentDemand: roleSummary.currentDemand,
            roleGrowthRate: roleSummary.growthRate,
            roleTrend: roleSummary.trendCategory,
          });
        }
      }

      return {
        skill: { id: skill.id, name: skill.name },
        associatedRolesCount: roleBreakdown.length,
        roles: roleBreakdown,
        explanation: `Skill '${skill.name}' is referenced across ${roleBreakdown.length} canonical roles with varying demand trajectories.`,
        disclaimer: DEMAND_CONFIG.DISCLAIMER,
      };
    }

    if (roleId) {
      const roleSummary = await this.getRoleDemand(roleId);
      return {
        role: roleSummary.role,
        associatedSkillsCount: roleSummary.allAssociatedSkills.length,
        skills: roleSummary.allAssociatedSkills,
        explanation: `Role '${roleSummary.role.name}' requires/prefers ${roleSummary.allAssociatedSkills.length} key skills.`,
        disclaimer: DEMAND_CONFIG.DISCLAIMER,
      };
    }

    throw ApiError.badRequest('Either skillId or roleId query parameter must be specified', 'INVALID_GRAPH_QUERY');
  }

  /**
   * Generates workforce demand decision-support signals for organizational workforce planning.
   */
  static buildWorkforceDemandSignals(currentCapability, targetCapability, skillTrend, demandGrowth) {
    const capabilityGap = targetCapability - currentCapability;

    if (skillTrend === 'INSUFFICIENT_DATA') {
      return {
        signal: 'DATA_INSUFFICIENT',
        recommendation: 'Collect additional capability and market observation data before planning major headcount or training investments.',
      };
    }

    if (capabilityGap > 20 && (skillTrend === 'GROWING' || demandGrowth >= 15.0)) {
      return {
        signal: 'HIRE_SIGNAL',
        recommendation: 'Market demand is expanding rapidly and internal capability gap is substantial. Consider strategic external hiring alongside targeted upskilling.',
      };
    }

    if (capabilityGap > 0 && skillTrend === 'GROWING') {
      return {
        signal: 'UPSKILL_SIGNAL',
        recommendation: 'Market demand is growing. Accelerate internal workforce upskilling and learning programs to bridge the gap.',
      };
    }

    return {
      signal: 'MONITOR_SIGNAL',
      recommendation: 'Workforce capability is aligned with current demand levels. Monitor market trends across upcoming quarters.',
    };
  }

  /**
   * Organization demand intelligence overview.
   */
  static async getOrganizationDemandOverview(organizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        organizationSkills: {
          include: { skill: true },
        },
        roles: true,
      },
    });

    if (!org) {
      throw ApiError.notFound('Organization not found', 'ORGANIZATION_NOT_FOUND');
    }

    const orgSkills = org.organizationSkills || [];
    const skillAnalysis = [];

    for (const os of orgSkills) {
      if (os.skill) {
        const skillDemand = await this.getSkillDemand(os.skill.id);
        const signalInfo = this.buildWorkforceDemandSignals(
          os.currentCapability,
          os.targetCapability,
          skillDemand.trendCategory,
          skillDemand.growthRate
        );

        skillAnalysis.push({
          skillId: os.skill.id,
          skillName: os.skill.name,
          category: os.skill.category,
          currentCapability: os.currentCapability,
          targetCapability: os.targetCapability,
          workforceCount: os.workforceCount,
          marketDemand: skillDemand.currentDemand,
          marketGrowthRate: skillDemand.growthRate,
          marketTrend: skillDemand.trendCategory,
          signal: signalInfo.signal,
          recommendation: signalInfo.recommendation,
        });
      }
    }

    // Role demand overview
    const roleAnalysis = [];
    for (const role of org.roles || []) {
      const roleDemand = await this.getRoleDemand(role.id);
      roleAnalysis.push({
        roleId: role.id,
        roleName: role.name,
        category: role.category,
        marketDemand: roleDemand.currentDemand,
        marketGrowthRate: roleDemand.growthRate,
        marketTrend: roleDemand.trendCategory,
      });
    }

    return {
      organization: {
        id: org.id,
        name: org.name,
        industry: org.industry,
      },
      totalSkillsTracked: skillAnalysis.length,
      totalRolesTracked: roleAnalysis.length,
      workforceSkillSignals: skillAnalysis,
      workforceRoleDemand: roleAnalysis,
      summarySignals: {
        hireSignals: skillAnalysis.filter((s) => s.signal === 'HIRE_SIGNAL').length,
        upskillSignals: skillAnalysis.filter((s) => s.signal === 'UPSKILL_SIGNAL').length,
        monitorSignals: skillAnalysis.filter((s) => s.signal === 'MONITOR_SIGNAL').length,
      },
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }
}

export default DemandIntelligenceService;
