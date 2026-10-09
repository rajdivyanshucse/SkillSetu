import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import skillRoutes from './skill.routes.js';
import intelligenceRoutes from './intelligence.routes.js';
import opportunityRoutes from './opportunity.routes.js';
import applicationRoutes from './application.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import aiRoutes from './ai.routes.js';
import adminRoutes from './admin.routes.js';
import ingestionRoutes from './ingestion.routes.js';
import demandIntelligenceRoutes from './demandIntelligence.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import capabilityIntelligenceRoutes from './capabilityIntelligence.routes.js';
import futureCapabilityRoutes from './futureCapabilityIntelligence.routes.js';
import adaptiveRoadmapRoutes from './adaptiveRoadmap.routes.js';

// Organization intelligence route modules
import organizationRoutes from './organization.routes.js';
import organizationMemberRoutes from './organizationMember.routes.js';
import departmentRoutes from './department.routes.js';
import workforceRoutes from './workforce.routes.js';
import futureSkillRoutes from './futureSkill.routes.js';
import talentRoutes from './talent.routes.js';
import organizationRoleRoutes from './organizationRole.routes.js';
import planningRoutes from './planning.routes.js';
import compensationRoutes from './compensation.routes.js';
import organizationGrowthRoutes from './organizationGrowth.routes.js';
import organizationLearningRoutes from './organizationLearning.routes.js';
import organizationDemandRoutes from './organizationDemand.routes.js';
import organizationRecommendationRoutes from './organizationRecommendation.routes.js';

const router = Router();

/**
 * Core API v1 Routes
 */
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillRoutes);
router.use('/intelligence/demand', demandIntelligenceRoutes);
router.use('/intelligence/capabilities', capabilityIntelligenceRoutes);
router.use('/intelligence/future-capabilities', futureCapabilityRoutes);
router.use('/intelligence/roadmap', adaptiveRoadmapRoutes);
router.use('/intelligence', intelligenceRoutes);
router.use('/capabilities', capabilityIntelligenceRoutes);
router.use('/future-capabilities', futureCapabilityRoutes);
router.use('/individual/capabilities', capabilityIntelligenceRoutes);
router.use('/roadmaps', adaptiveRoadmapRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/ingestion', ingestionRoutes);

/**
 * Organization + Workforce Intelligence Routes
 */
router.use('/organization/intelligence/demand', organizationDemandRoutes);
router.use('/organization/recommendations', organizationRecommendationRoutes);
router.use('/organization', organizationRoutes);
router.use('/organization/members', organizationMemberRoutes);
router.use('/organization/departments', departmentRoutes);
router.use('/organization', workforceRoutes);
router.use('/organization/future-skills', futureSkillRoutes);
router.use('/organization/talent', talentRoutes);
router.use('/organization/roles', organizationRoleRoutes);
router.use('/organization/planning', planningRoutes);
router.use('/organization/compensation', compensationRoutes);
router.use('/organization/growth', organizationGrowthRoutes);
router.use('/organization/learning', organizationLearningRoutes);

export default router;

