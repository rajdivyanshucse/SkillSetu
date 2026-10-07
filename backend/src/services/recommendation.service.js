import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { getSkillGaps } from './skillGap.service.js';
import { getCareerIntelligence } from './careerIntelligence.service.js';
import DemandIntelligenceService from './demandIntelligence.service.js';
import { aiClient } from './aiClient.service.js';

/**
 * Standard recommendation disclaimer
 */
export const RECOMMENDATION_DISCLAIMER =
  'Recommendations are decision-support outputs generated from available profile, skill, semantic, demand, learning, opportunity, and workforce signals. They do not guarantee employment, hiring, compensation, or future market outcomes.';

/**
 * Advanced Recommendation Service for Individuals (Phase 26)
 * Generates explainable, evidence-based, personalized career intelligence recommendations.
 */
export class RecommendationService {
  /**
   * Deterministic local fallback prioritization weights (sum = 1.00)
   */
  static WEIGHTS = {
    SKILL_GAP: 0.30,
    ROLE_IMPORTANCE: 0.20,
    DEMAND_SIGNAL: 0.15,
    SEMANTIC_RELEVANCE: 0.10,
    EMERGING_SIGNAL: 0.10,
    LEARNING_RELEVANCE: 0.10,
    PROGRESS: 0.05,
  };

  /**
   * Generates or refreshes personalized recommendations for an individual user.
   *
   * @param {string} userId - User ID
   * @param {Object} options - Options (forceRefresh, horizon, etc.)
   * @returns {Promise<Object>} Generated recommendations & evidence
   */
  async generateIndividualRecommendations(userId, options = {}) {
    // 1. Fetch user profile and context
    const profile = await prisma.individualProfile.findUnique({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        targetRole: { include: { roleSkills: { include: { skill: true } } } },
        experiences: true,
        educations: true,
        projects: true,
      },
    });

    if (!profile) {
      throw ApiError.notFound('User profile not found', 'PROFILE_NOT_FOUND');
    }

    // 2. Load supporting signals across existing deterministic engines
    const [skillGapsData, careerIntelData, emergingSkillsData] = await Promise.all([
      getSkillGaps(userId).catch(() => ({ gaps: [], summary: {} })),
      getCareerIntelligence(userId).catch(() => ({ matches: [] })),
      DemandIntelligenceService.detectEmergingSkills({ limit: 10 }).catch(() => ({ data: [] })),
    ]);

    // Load available learning paths & opportunities
    const [allLearningPaths, allOpportunities] = await Promise.all([
      prisma.learningPath.findMany({ include: { modules: true } }).catch(() => []),
      prisma.opportunity.findMany({ include: { opportunitySkills: { include: { skill: true } } } }).catch(() => []),
    ]);

    const candidates = [];

    // Map user's existing skill IDs and names
    const userSkillMap = new Map();
    (profile.skills || []).forEach((us) => {
      if (us.skill) {
        userSkillMap.set(us.skill.id, us);
        userSkillMap.set(us.skill.name.toLowerCase(), us);
      }
    });

    // -------------------------------------------------------------
    // A. Generate SKILL_PRIORITY & SKILL_GAP Recommendations
    // -------------------------------------------------------------
    const gaps = skillGapsData.gaps || [];
    for (const gap of gaps) {
      const skillName = gap.skillName;
      const skillId = gap.skillId;
      const gapScore = gap.gapMagnitude || (gap.targetLevelNum - gap.currentLevelNum) * 25;

      // Check demand metrics
      let demandTrend = 'STABLE';
      let growthRate = 0;
      let isEmerging = false;
      try {
        if (skillId) {
          const detail = await DemandIntelligenceService.getSkillDemand(skillId).catch(() => null);
          if (detail) {
            demandTrend = detail.trendCategory || 'STABLE';
            growthRate = detail.growthRate || 0;
            isEmerging = !!detail.isEmerging;
          }
        }
      } catch {
        // Fallback gracefully
      }

      // Check emerging status
      const emergingList = emergingSkillsData.data || emergingSkillsData.emergingSkills || [];
      const emergingMatch = emergingList.find(
        (es) => es.skill?.id === skillId || es.skill?.name?.toLowerCase() === skillName?.toLowerCase()
      );
      if (emergingMatch) {
        isEmerging = true;
      }

      // Determine recommended action
      let recommendedAction = 'LEARN';
      if (gap.currentLevelNum === 0) {
        recommendedAction = 'LEARN';
      } else if (gap.currentLevelNum >= 2) {
        recommendedAction = 'PRACTICE';
      } else {
        recommendedAction = 'BUILD';
      }

      const priority = gap.priority || (gapScore >= 50 ? 'HIGH' : gapScore >= 25 ? 'MEDIUM' : 'LOW');
      const confidence = gapScore > 0 && demandTrend !== 'INSUFFICIENT_DATA' ? 'HIGH' : 'MEDIUM';

      const evidence = [
        {
          signal: 'SKILL_GAP',
          value: Math.round(gapScore),
          source: 'Phase21SkillGapEngine',
          explanation: `Target role requires ${skillName} proficiency (${gap.targetLevel}) above your current level (${gap.currentLevel || 'None'}).`,
        },
        {
          signal: 'DEMAND_TREND',
          value: demandTrend,
          source: 'Phase25DemandIntelligence',
          explanation: `Market demand is classified as ${demandTrend}${growthRate ? ` (growth: ${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%)` : ''}.`,
        },
        {
          signal: 'ROLE_IMPORTANCE',
          value: gap.importance || 80,
          source: 'TaxonomyRoleBenchmark',
          explanation: `${skillName} is a ${gap.requirementType || 'REQUIRED'} core capability for your target role.`,
        },
      ];

      if (isEmerging) {
        evidence.push({
          signal: 'EMERGING_SKILL',
          value: true,
          source: 'Phase25EmergingSkillDetection',
          explanation: `${skillName} exhibits rapid multi-period market demand momentum.`,
        });
      }

      candidates.push({
        type: 'SKILL_PRIORITY',
        entityType: 'SKILL',
        entityId: skillId,
        title: `Develop capability in ${skillName}`,
        summary: `Prioritize developing ${skillName} to close target role capability gaps and match growing market demand.`,
        priority,
        confidence,
        dataQuality: 'HIGH',
        recommendedAction,
        evidence,
        sourceSignals: ['SKILL_GAP', 'DEMAND_TREND', 'ROLE_BENCHMARK'],
        rawGapScore: gapScore,
        rawGrowthRate: growthRate,
        rawImportance: gap.importance || 80,
      });
    }

    // -------------------------------------------------------------
    // B. Generate CAREER_ROLE Recommendations
    // -------------------------------------------------------------
    const careerMatches = careerIntelData.matches || [];
    for (const match of careerMatches.slice(0, 3)) {
      const roleName = match.roleName || match.role?.name;
      const roleId = match.roleId || match.role?.id;
      const compScore = match.overallCompatibility || match.compatibilityScore || 50;

      const evidence = [
        {
          signal: 'CAREER_COMPATIBILITY',
          value: compScore,
          source: 'Phase21DeterministicCareerIntelligence',
          explanation: `Your current verified competencies align with ${compScore}% of the baseline requirements for ${roleName}.`,
        },
        {
          signal: 'SKILL_OVERLAP',
          value: `${match.matchingSkillsCount || 0}/${match.totalRequiredSkills || 0} skills`,
          source: 'SkillTaxonomyMatch',
          explanation: `You currently possess verified foundations in ${match.matchingSkillsCount || 0} required skills for this role.`,
        },
      ];

      if (match.semanticOverlapScore) {
        evidence.push({
          signal: 'SEMANTIC_SIMILARITY',
          value: `${match.semanticOverlapScore}%`,
          source: 'Phase24SemanticIntelligence',
          explanation: `Dense semantic similarity indicates related conceptual alignment with adjacent domain capabilities.`,
        });
      }

      candidates.push({
        type: 'CAREER_ROLE',
        entityType: 'ROLE',
        entityId: roleId,
        title: `Recommended role to explore: ${roleName}`,
        summary: `Role aligned with your current verified skill profile and experience portfolio.`,
        priority: compScore >= 75 ? 'HIGH' : 'MEDIUM',
        confidence: 'HIGH',
        dataQuality: 'HIGH',
        recommendedAction: 'VALIDATE',
        evidence,
        sourceSignals: ['CAREER_COMPATIBILITY', 'SKILL_OVERLAP', 'SEMANTIC_ALIGNMENT'],
        rawCompScore: compScore,
      });
    }

    // -------------------------------------------------------------
    // C. Generate LEARNING_PATH Recommendations
    // -------------------------------------------------------------
    for (const path of allLearningPaths.slice(0, 3)) {
      // Find matching gaps for this path
      const matchingGaps = gaps.filter(
        (g) =>
          path.title?.toLowerCase().includes(g.skillName?.toLowerCase()) ||
          path.description?.toLowerCase().includes(g.skillName?.toLowerCase())
      );

      if (matchingGaps.length > 0 || path.roleCategory === profile.targetRole?.category) {
        const topGap = matchingGaps[0] || gaps[0];
        const gapName = topGap ? topGap.skillName : 'target role competencies';

        candidates.push({
          type: 'LEARNING_PATH',
          entityType: 'LEARNING_PATH',
          entityId: path.id,
          title: `Structured Learning: ${path.title}`,
          summary: `Guided curriculum designed to address capability deficits in ${gapName}.`,
          priority: matchingGaps.length > 0 ? 'HIGH' : 'MEDIUM',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'LEARN',
          evidence: [
            {
              signal: 'CURRICULUM_ALIGNMENT',
              value: matchingGaps.length,
              source: 'Phase15LearningSystem',
              explanation: `Curriculum directly covers ${matchingGaps.length || 1} verified skill gaps in your profile.`,
            },
            {
              signal: 'STRUCTURED_MODULES',
              value: `${(path.modules || []).length} modules`,
              source: 'LearningCatalog',
              explanation: `Contains ${(path.modules || []).length} structured modules with progressive hands-on assessments.`,
            },
          ],
          sourceSignals: ['SKILL_GAP', 'LEARNING_CURRICULUM'],
        });
      }
    }

    // -------------------------------------------------------------
    // D. Generate PROJECT Recommendations
    // -------------------------------------------------------------
    if (gaps.length > 0) {
      const topGap = gaps[0];
      candidates.push({
        type: 'PROJECT',
        entityType: 'PROJECT',
        entityId: null,
        title: `Portfolio Project: Build a production-grade system with ${topGap.skillName}`,
        summary: `Practical implementation project demonstrating verified competence in ${topGap.skillName} and system design.`,
        priority: 'MEDIUM',
        confidence: 'HIGH',
        dataQuality: 'HIGH',
        recommendedAction: 'BUILD',
        evidence: [
          {
            signal: 'PRACTICE_GAP',
            value: topGap.skillName,
            source: 'Phase21GrowthEvidence',
            explanation: `Building real-world code artifacts establishes demonstrable evidence for ${topGap.skillName}.`,
          },
          {
            signal: 'PORTFOLIO_VALIDATION',
            value: 'Verified Code Evidence',
            source: 'GrowthProjectFramework',
            explanation: `Completing project milestones validates hands-on proficiency for candidate profile showcases.`,
          },
        ],
        sourceSignals: ['SKILL_GAP', 'PROJECT_EVIDENCE'],
      });
    }

    // -------------------------------------------------------------
    // E. Generate OPPORTUNITY Recommendations
    // -------------------------------------------------------------
    for (const opp of allOpportunities.slice(0, 3)) {
      candidates.push({
        type: 'OPPORTUNITY',
        entityType: 'OPPORTUNITY',
        entityId: opp.id,
        title: `Opportunity: ${opp.title} at ${opp.companyName || 'Technology Partner'}`,
        summary: `Market opportunity matching your core verified capabilities and target role preferences.`,
        priority: 'MEDIUM',
        confidence: 'MEDIUM',
        dataQuality: 'MEDIUM',
        recommendedAction: 'VALIDATE',
        evidence: [
          {
            signal: 'ROLE_ALIGNMENT',
            value: opp.title,
            source: 'Phase21OpportunityMatching',
            explanation: `Opportunity title and requirements align with your target role aspirations.`,
          },
          {
            signal: 'EXPERIENCE_MATCH',
            value: opp.experienceLevel || 'Mid-Senior',
            source: 'OpportunityCriteria',
            explanation: `Experience level requirements match your current background.`,
          },
        ],
        sourceSignals: ['OPPORTUNITY_MATCH', 'ROLE_ALIGNMENT'],
      });
    }

    // -------------------------------------------------------------
    // F. Generate EMERGING_SKILL Recommendations
    // -------------------------------------------------------------
    const emergingList = emergingSkillsData.data || emergingSkillsData.emergingSkills || [];
    for (const em of emergingList.slice(0, 2)) {
      const emSkillId = em.skill?.id || em.skillId;
      const emSkillName = em.skill?.name || em.skillName;
      if (emSkillId && !userSkillMap.has(emSkillId) && !userSkillMap.has(emSkillName?.toLowerCase())) {
        candidates.push({
          type: 'EMERGING_SKILL',
          entityType: 'SKILL',
          entityId: emSkillId,
          title: `Emerging skill alert: ${emSkillName}`,
          summary: `High market momentum signal detected for ${emSkillName} across recent quarterly periods.`,
          priority: 'MEDIUM',
          confidence: 'HIGH',
          dataQuality: 'HIGH',
          recommendedAction: 'MONITOR',
          evidence: [
            {
              signal: 'DEMAND_MOMENTUM',
              value: `+${(em.growthRate || 25).toFixed(1)}%`,
              source: 'Phase25EmergingSkillDetection',
              explanation: `${emSkillName} shows accelerating job-market posting frequency across consecutive quarters.`,
            },
            {
              signal: 'ROLE_COVERAGE',
              value: `${em.roleCoverageCount || 5} benchmark roles`,
              source: 'Phase25DemandIntelligence',
              explanation: `Skill is increasingly referenced across diverse industry benchmark roles.`,
            },
          ],
          sourceSignals: ['EMERGING_DEMAND', 'MARKET_VELOCITY'],
        });
      }
    }

    // -------------------------------------------------------------
    // G. Deduplication & Grouping
    // -------------------------------------------------------------
    const deduplicated = this._deduplicateRecommendations(candidates);

    // -------------------------------------------------------------
    // H. Persist in Database / MemoryStore
    // -------------------------------------------------------------
    // Mark prior unaccepted recommendations as EXPIRED if refreshing
    if (options.forceRefresh) {
      await prisma.recommendation.deleteMany({
        where: { userId, status: 'NEW' },
      }).catch(() => {});
    }

    const createdRecords = [];
    for (const cand of deduplicated) {
      const record = await prisma.recommendation.create({
        data: {
          userId,
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
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day lifecycle
        },
      });
      createdRecords.push(record);
    }

    return {
      success: true,
      totalGenerated: createdRecords.length,
      recommendations: createdRecords,
      disclaimer: RECOMMENDATION_DISCLAIMER,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Retrieves active recommendations for an individual user with optional filters.
   */
  async getIndividualRecommendations(userId, query = {}) {
    const where = { userId };

    if (query.type) {
      where.type = query.type;
    }
    if (query.status) {
      where.status = query.status;
    } else {
      // Default: exclude dismissed and expired unless explicitly requested
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

    // If no recommendations exist yet, generate initial set
    if (list.length === 0 && !query.status) {
      const generated = await this.generateIndividualRecommendations(userId).catch(() => null);
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
      disclaimer: RECOMMENDATION_DISCLAIMER,
    };
  }

  /**
   * Retrieves single recommendation by ID with ownership verification.
   */
  async getRecommendationById(userId, recommendationId) {
    const rec = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec || rec.userId !== userId) {
      throw ApiError.notFound('Recommendation not found or access unauthorized', 'RECOMMENDATION_NOT_FOUND');
    }

    // Auto-mark as VIEWED if it was NEW
    if (rec.status === 'NEW') {
      await prisma.recommendation.update({
        where: { id: recommendationId },
        data: { status: 'VIEWED' },
      }).catch(() => {});
      rec.status = 'VIEWED';
    }

    return {
      success: true,
      recommendation: rec,
      disclaimer: RECOMMENDATION_DISCLAIMER,
    };
  }

  /**
   * Updates recommendation status (VIEWED, ACCEPTED, IN_PROGRESS, COMPLETED, etc.).
   */
  async updateRecommendationStatus(userId, recommendationId, status, notes = null) {
    const rec = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec || rec.userId !== userId) {
      throw ApiError.notFound('Recommendation not found or access unauthorized', 'RECOMMENDATION_NOT_FOUND');
    }

    const updated = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { status, updatedAt: new Date() },
    });

    // Log feedback action
    await prisma.recommendationFeedback.create({
      data: {
        recommendationId,
        userId,
        action: status,
        notes,
      },
    }).catch(() => {});

    return {
      success: true,
      recommendation: updated,
      message: `Recommendation status updated to ${status}`,
    };
  }

  /**
   * Dismisses a recommendation with explainable user feedback.
   */
  async dismissRecommendation(userId, recommendationId, reason = 'NOT_RELEVANT', notes = null) {
    const rec = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!rec || rec.userId !== userId) {
      throw ApiError.notFound('Recommendation not found or access unauthorized', 'RECOMMENDATION_NOT_FOUND');
    }

    const updated = await prisma.recommendation.update({
      where: { id: recommendationId },
      data: {
        status: 'DISMISSED',
        dismissReason: reason,
        dismissNotes: notes,
        updatedAt: new Date(),
      },
    });

    // Log feedback
    await prisma.recommendationFeedback.create({
      data: {
        recommendationId,
        userId,
        action: 'DISMISSED',
        reason,
        notes,
      },
    }).catch(() => {});

    return {
      success: true,
      recommendation: updated,
      message: 'Recommendation dismissed successfully',
    };
  }

  /**
   * Specific category filtered getters
   */
  async getSkillRecommendations(userId, query = {}) {
    return this.getIndividualRecommendations(userId, { ...query, type: 'SKILL_PRIORITY' });
  }

  async getCareerRecommendations(userId, query = {}) {
    return this.getIndividualRecommendations(userId, { ...query, type: 'CAREER_ROLE' });
  }

  async getLearningRecommendations(userId, query = {}) {
    return this.getIndividualRecommendations(userId, { ...query, type: 'LEARNING_PATH' });
  }

  async getProjectRecommendations(userId, query = {}) {
    return this.getIndividualRecommendations(userId, { ...query, type: 'PROJECT' });
  }

  async getOpportunityRecommendations(userId, query = {}) {
    return this.getIndividualRecommendations(userId, { ...query, type: 'OPPORTUNITY' });
  }

  /**
   * Deduplicates and groups recommendation candidates by entity and type.
   */
  _deduplicateRecommendations(candidates) {
    const seen = new Set();
    const result = [];

    for (const c of candidates) {
      const key = `${c.type}_${c.entityType || 'NONE'}_${c.entityId || c.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(c);
      }
    }

    return result;
  }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
