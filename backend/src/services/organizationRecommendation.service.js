import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import DemandIntelligenceService from './demandIntelligence.service.js';

export const ORG_RECOMMENDATION_DISCLAIMER =
  'Workforce recommendations are strategic decision-support analyses based on internal capability benchmarks and external market observations. They do not represent automated personnel actions or hiring mandates.';

/**
 * Organization Recommendation Service (Phase 26)
 * Generates decision-support intelligence for workforce upskilling, hiring, and future capability development.
 */
export class OrganizationRecommendationService {
  /**
   * Generates or refreshes workforce recommendations for an organization.
   *
   * @param {string} organizationId - Organization ID
   * @param {Object} options - Options (forceRefresh, horizon, etc.)
   * @returns {Promise<Object>} Generated recommendations & evidence
   */
  async generateOrganizationRecommendations(organizationId, options = {}) {
    // 1. Load organization context
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        skills: { include: { skill: true } },
        futureSkills: { include: { skill: true } },
        departments: true,
        roles: true,
        learningPrograms: true,
      },
    });

    if (!org) {
      throw ApiError.notFound('Organization not found', 'ORGANIZATION_NOT_FOUND');
    }

    const orgSkills = org.skills || [];
    const futureSkills = org.futureSkills || [];
    const candidates = [];

    // 2. Fetch external demand trends for comparison
    const demandOverview = await DemandIntelligenceService.listSkillsDemand({ limit: 50 }).catch(() => ({ data: [] }));
    const demandMap = new Map();
    (demandOverview.data || demandOverview.skills || []).forEach((s) => {
      if (s.skill?.id) demandMap.set(s.skill.id, s);
      if (s.skill?.name) demandMap.set(s.skill.name.toLowerCase(), s);
    });

    // -------------------------------------------------------------
    // A. Evaluate Internal Workforce Skills for UPSKILL vs HIRE
    // -------------------------------------------------------------
    for (const os of orgSkills) {
      const skillName = os.skill?.name || 'Tracked Skill';
      const skillId = os.skillId;
      const currentCap = os.currentCapability || 50;
      const targetCap = os.targetCapability || 80;
      const deficit = Math.max(targetCap - currentCap, 0);
      const headcount = os.workforceCount || 0;

      const demandData = demandMap.get(skillId) || demandMap.get(skillName.toLowerCase());
      const trend = demandData?.trendCategory || 'STABLE';
      const growth = demandData?.growthRate || 0;

      // HIRE_SIGNAL: Critical capability deficit (< 25) with high market demand
      if (currentCap < 25 && (trend === 'GROWING' || deficit >= 50)) {
        candidates.push({
          type: 'HIRE',
          entityType: 'WORKFORCE',
          entityId: skillId,
          title: `External Talent Acquisition: ${skillName}`,
          summary: `Critical internal capability deficit (${currentCap}/100) paired with growing market demand indicates external hiring priority.`,
          priority: 'HIGH',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'HIRE',
          evidence: [
            {
              signal: 'INTERNAL_CAPABILITY_DEFICIT',
              value: `${currentCap}/100`,
              source: 'Phase22WorkforceInventory',
              explanation: `Current organizational capability score is in critical deficit range (< 25).`,
            },
            {
              signal: 'EXTERNAL_MARKET_DEMAND',
              value: trend,
              source: 'Phase25DemandIntelligence',
              explanation: `External market posting volume is ${trend}${growth ? ` (+${growth.toFixed(1)}%)` : ''}.`,
            },
            {
              signal: 'TARGET_CAPABILITY_GAP',
              value: `${deficit} pts`,
              source: 'OrganizationBenchmark',
              explanation: `Target capability benchmark is ${targetCap}/100.`,
            },
          ],
          sourceSignals: ['WORKFORCE_DEFICIT', 'MARKET_DEMAND', 'TARGET_GAP'],
        });
      }
      // UPSKILL_SIGNAL: Developing capability (25 - 74) where internal team can be trained
      else if (deficit >= 20) {
        candidates.push({
          type: 'UPSKILL',
          entityType: 'WORKFORCE',
          entityId: skillId,
          title: `Internal Workforce Upskilling: ${skillName}`,
          summary: `Developing internal capability (${currentCap}/100) presents high-ROI opportunity for internal workforce training programs.`,
          priority: deficit >= 35 ? 'HIGH' : 'MEDIUM',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'UPSKILL',
          evidence: [
            {
              signal: 'CURRENT_WORKFORCE_FOUNDATION',
              value: `${headcount} members (${currentCap}/100)`,
              source: 'Phase22WorkforceInventory',
              explanation: `${headcount} workforce members already have developing competency in ${skillName}.`,
            },
            {
              signal: 'CAPABILITY_GROWTH_POTENTIAL',
              value: `+${deficit} pts to target`,
              source: 'UpskillingROIModel',
              explanation: `Closing the ${deficit}-point deficit via structured internal programs optimizes talent retention.`,
            },
            {
              signal: 'DEMAND_TREND',
              value: trend,
              source: 'Phase25DemandIntelligence',
              explanation: `Observed market demand trajectory is ${trend}.`,
            },
          ],
          sourceSignals: ['WORKFORCE_DEVELOPING', 'UPSKILLING_POTENTIAL', 'MARKET_TREND'],
        });
      }
    }

    // -------------------------------------------------------------
    // B. Evaluate FUTURE_SKILL Requirements
    // -------------------------------------------------------------
    for (const fs of futureSkills) {
      const skillName = fs.skill?.name || 'Future Capability';
      const horizon = fs.planningHorizon || 'MONTHS_12';
      const reqCap = fs.requiredCapability || 80;
      const currCap = fs.currentCapability || 30;
      const gap = Math.max(reqCap - currCap, 0);

      candidates.push({
        type: 'FUTURE_SKILL',
        entityType: 'FUTURE_SKILL',
        entityId: fs.id,
        title: `Strategic Horizon Preparation: ${skillName} (${horizon.replace('_', ' ')})`,
        summary: `Prepare organizational readiness for ${skillName} projected for ${horizon.replace('_', ' ')} planning window.`,
        priority: fs.priority || (gap >= 40 ? 'HIGH' : 'MEDIUM'),
        confidence: 'HIGH',
        dataQuality: 'HIGH',
        recommendedAction: 'REDISTRIBUTE',
        evidence: [
          {
            signal: 'PLANNING_HORIZON',
            value: horizon,
            source: 'Phase22FutureSkillsRoadmap',
            explanation: `Strategic workforce roadmap targets ${reqCap}/100 capability across ${horizon.replace('_', ' ')}.`,
          },
          {
            signal: 'FUTURE_READINESS_GAP',
            value: `${gap} pts`,
            source: 'FutureReadinessModel',
            explanation: `Current capability (${currCap}/100) requires a ${gap}-point capability advancement.`,
          },
        ],
        sourceSignals: ['FUTURE_SKILL_ROADMAP', 'READINESS_GAP'],
      });
    }

    // -------------------------------------------------------------
    // C. Generate LEARNING_PROGRAM Recommendations
    // -------------------------------------------------------------
    if (orgSkills.length > 0) {
      const topDeficitSkill = [...orgSkills].sort(
        (a, b) => (b.targetCapability - b.currentCapability) - (a.targetCapability - a.currentCapability)
      )[0];

      if (topDeficitSkill?.skill) {
        candidates.push({
          type: 'LEARNING_PROGRAM',
          entityType: 'LEARNING_PROGRAM',
          entityId: null,
          title: `Initiate Cohort Training: ${topDeficitSkill.skill.name} Mastery`,
          summary: `Structured departmental learning program to accelerate competency in ${topDeficitSkill.skill.name}.`,
          priority: 'MEDIUM',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'UPSKILL',
          evidence: [
            {
              signal: 'ORGANIZATIONAL_SKILL_GAP',
              value: topDeficitSkill.skill.name,
              source: 'Phase22OrganizationIntelligence',
              explanation: `Identified as highest aggregate capability deficit across tracked workforce skills.`,
            },
            {
              signal: 'AFFECTED_HEADCOUNT',
              value: `${topDeficitSkill.workforceCount || 10} members`,
              source: 'WorkforceRoster',
              explanation: `Directly impacts ${topDeficitSkill.workforceCount || 10} active workforce contributors.`,
            },
          ],
          sourceSignals: ['AGGREGATE_SKILL_GAP', 'HEADCOUNT_REACH'],
        });
      }
    }

    // -------------------------------------------------------------
    // D. Baseline Recommendations for Initialized Organizations
    // -------------------------------------------------------------
    if (candidates.length === 0) {
      const topRoles = await prisma.role.findMany({ take: 3, include: { roleSkills: { include: { skill: true } } } }).catch(() => []);
      for (const r of topRoles) {
        candidates.push({
          type: 'WORKFORCE_CAPABILITY',
          entityType: 'ROLE',
          entityId: r.id,
          title: `Establish Core Workforce Benchmark: ${r.name}`,
          summary: `Define organizational capability benchmarks and inventory requirements for ${r.name}.`,
          priority: 'HIGH',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'MONITOR',
          evidence: [
            {
              signal: 'INDUSTRY_BENCHMARK',
              value: r.name,
              source: 'TaxonomyRoleBenchmark',
              explanation: `Key industry standard role with defined capability benchmarks across ${(r.roleSkills || []).length} core skills.`,
            },
            {
              signal: 'MARKET_READINESS',
              value: 'Foundational Benchmark',
              source: 'Phase22WorkforcePlanning',
              explanation: `Initializing workforce tracking enables deterministic gap analysis and hiring/upskilling ROI modeling.`,
            },
          ],
          sourceSignals: ['ROLE_BENCHMARK', 'WORKFORCE_FOUNDATION'],
        });
      }
    }

    // -------------------------------------------------------------
    // E. Persist in Database / MemoryStore
    // -------------------------------------------------------------
    if (options.forceRefresh) {
      await prisma.recommendation.deleteMany({
        where: { organizationId, status: 'NEW' },
      }).catch(() => {});
    }

    const createdRecords = [];
    for (const cand of candidates) {
      const record = await prisma.recommendation.create({
        data: {
          organizationId,
          userId: null,
          type: cand.type,
          entityType: cand.entityType,
          entityId: cand.entityId,
          title: cand.title,
          summary: cand.summary,
          priority: cand.priority,
          confidence: cand.confidence,
          dataQuality: cand.dataQuality,
          status: 'NEW',
          recommendedAction: cand.recommendedAction,
          evidence: cand.evidence,
          sourceSignals: cand.sourceSignals,
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60-day organization lifecycle
        },
      });
      createdRecords.push(record);
    }

    return {
      success: true,
      totalGenerated: createdRecords.length,
      recommendations: createdRecords,
      disclaimer: ORG_RECOMMENDATION_DISCLAIMER,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Retrieves organization recommendations with multi-tenant isolation.
   */
  async getOrganizationRecommendations(organizationId, query = {}) {
    const where = { organizationId };

    if (query.type) {
      where.type = query.type;
    }
    if (query.status) {
      where.status = query.status;
    } else {
      where.status = { not: 'DISMISSED' };
    }
    if (query.priority) {
      where.priority = query.priority;
    }

    let list = await prisma.recommendation.findMany({
      where,
      take: query.limit ? parseInt(query.limit, 10) : 50,
      skip: query.skip ? parseInt(query.skip, 10) : 0,
    });

    if (list.length === 0 && !query.status) {
      const generated = await this.generateOrganizationRecommendations(organizationId).catch(() => null);
      if (generated?.recommendations) {
        list = generated.recommendations;
        if (query.type) {
          list = list.filter((r) => r.type === query.type);
        }
      }
    }

    return {
      success: true,
      total: list.length,
      recommendations: list,
      disclaimer: ORG_RECOMMENDATION_DISCLAIMER,
    };
  }

  /**
   * Retrieves single organization recommendation by ID with tenant isolation.
   */
  async getOrganizationRecommendationById(organizationId, id) {
    const rec = await prisma.recommendation.findUnique({
      where: { id },
    });

    if (!rec || rec.organizationId !== organizationId) {
      throw ApiError.notFound('Organization recommendation not found', 'RECOMMENDATION_NOT_FOUND');
    }

    if (rec.status === 'NEW') {
      await prisma.recommendation.update({
        where: { id },
        data: { status: 'VIEWED' },
      }).catch(() => {});
      rec.status = 'VIEWED';
    }

    return {
      success: true,
      recommendation: rec,
      disclaimer: ORG_RECOMMENDATION_DISCLAIMER,
    };
  }

  /**
   * Updates organization recommendation status.
   */
  async updateOrganizationRecommendationStatus(organizationId, id, status, notes = null, userId = null) {
    const rec = await prisma.recommendation.findUnique({
      where: { id },
    });

    if (!rec || rec.organizationId !== organizationId) {
      throw ApiError.notFound('Organization recommendation not found', 'RECOMMENDATION_NOT_FOUND');
    }

    const updated = await prisma.recommendation.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });

    await prisma.recommendationFeedback.create({
      data: {
        recommendationId: id,
        userId,
        action: status,
        notes,
      },
    }).catch(() => {});

    return {
      success: true,
      recommendation: updated,
      message: `Organization recommendation status updated to ${status}`,
    };
  }

  /**
   * Specific filtered organization getters
   */
  async getOrganizationWorkforceRecommendations(organizationId, query = {}) {
    return this.getOrganizationRecommendations(organizationId, { ...query, type: 'WORKFORCE_CAPABILITY' });
  }

  async getOrganizationSkillRecommendations(organizationId, query = {}) {
    return this.getOrganizationRecommendations(organizationId, { ...query, type: 'UPSKILL' });
  }

  async getOrganizationLearningRecommendations(organizationId, query = {}) {
    return this.getOrganizationRecommendations(organizationId, { ...query, type: 'LEARNING_PROGRAM' });
  }

  async getOrganizationFutureSkillRecommendations(organizationId, query = {}) {
    return this.getOrganizationRecommendations(organizationId, { ...query, type: 'FUTURE_SKILL' });
  }
}

export const organizationRecommendationService = new OrganizationRecommendationService();
export default organizationRecommendationService;
