import prisma from '../config/db.js';
import { getProfile } from './profile.service.js';
import { getSkillGaps } from './skillGap.service.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Career Roadmap & Development Planning Service
 * Structures deterministic 4-stage progression: LEARN -> PRACTICE -> BUILD -> VALIDATE
 */

export const getCareerRoadmap = async (userId) => {
  const profile = await getProfile(userId);
  const gapsData = await getSkillGaps(userId);
  const targetRole = gapsData.targetRole;

  if (!targetRole) {
    return {
      targetRole: null,
      phases: [],
      message: 'Select a target role in your profile to generate a structured developmental roadmap.',
    };
  }

  const criticalGaps = gapsData.gaps.slice(0, 4);

  // Retrieve user's active milestones
  const milestones = await prisma.growthMilestone.findMany({
    where: { profileId: profile.id },
  });

  // Retrieve curated learning paths
  const learningPaths = await prisma.learningPath.findMany({
    where: { isActive: true },
    include: { resources: true },
    take: 2,
  });

  const phases = [
    {
      id: 'phase-1-learn',
      stage: 'LEARN',
      title: 'Foundation & Core Skill Acquisition',
      description: 'Acquire theoretical concepts and structural syntax for high-priority missing skills.',
      items: criticalGaps.map((g, idx) => ({
        id: `learn-${g.skillId}`,
        skillName: g.skillName,
        category: g.category,
        priority: g.priority,
        objective: `Master fundamentals and architecture principles of ${g.skillName}`,
        estimatedHours: 12 + idx * 4,
        status: idx === 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      })),
    },
    {
      id: 'phase-2-practice',
      stage: 'PRACTICE',
      title: 'Interactive Exercises & Guided Labs',
      description: 'Implement targeted hands-on modules to transition from beginner to intermediate capability.',
      items: criticalGaps.slice(0, 2).map((g) => ({
        id: `practice-${g.skillId}`,
        skillName: g.skillName,
        objective: `Build isolated test pipelines and API endpoints utilizing ${g.skillName}`,
        estimatedHours: 16,
        status: 'NOT_STARTED',
      })),
    },
    {
      id: 'phase-3-build',
      stage: 'BUILD',
      title: 'Applied Portfolio & Capstone Projects',
      description: 'Synthesize acquired capabilities into production-grade multi-tier project deliverables.',
      items: [
        {
          id: 'build-capstone-1',
          title: `Full-Scale ${targetRole.name} Systems Architecture`,
          skillsCovered: criticalGaps.map((g) => g.skillName),
          objective: 'Design and deploy an end-to-end resilient platform matching industry benchmarks.',
          status: 'NOT_STARTED',
        },
      ],
    },
    {
      id: 'phase-4-validate',
      stage: 'VALIDATE',
      title: 'Verification & Milestone Calibration',
      description: 'Validate applied capability via code reviews, skill verifications, and portfolio evidence.',
      items: [
        {
          id: 'validate-milestone-1',
          title: `${targetRole.name} Benchmark Calibration Assessment`,
          objective: 'Review completed portfolio milestones against target role capability criteria.',
          status: 'NOT_STARTED',
        },
      ],
    },
  ];

  return {
    targetRole,
    developmentProgress: {
      completedMilestones: milestones.filter((m) => m.status === 'COMPLETED').length,
      totalMilestones: Math.max(4, milestones.length),
      progressPercentage: 25,
    },
    phases,
    activePaths: learningPaths,
    methodology: {
      type: 'Deterministic 4-Stage Development Architecture',
      stages: ['LEARN', 'PRACTICE', 'BUILD', 'VALIDATE'],
      disclaimer: 'Development progress reflects self-paced learning milestones and does not constitute employee productivity scoring.',
    },
  };
};

export const updateRoadmapProgress = async (userId, { milestoneId = null, pathId = null, status = 'IN_PROGRESS', progressPct = 0 }) => {
  const profile = await getProfile(userId);

  if (milestoneId) {
    const existing = await prisma.growthMilestone.findUnique({ where: { id: milestoneId } });
    if (existing && existing.profileId === profile.id) {
      const updated = await prisma.growthMilestone.update({
        where: { id: milestoneId },
        data: { status },
      });
      return { success: true, milestone: updated };
    }
  }

  // Record milestone if new
  const newMilestone = await prisma.growthMilestone.create({
    data: {
      profileId: profile.id,
      title: 'Roadmap Milestone Progress Update',
      status,
    },
  });

  return {
    success: true,
    milestone: newMilestone,
    progressPercentage: progressPct,
  };
};

export default {
  getCareerRoadmap,
  updateRoadmapProgress,
};
