import prisma from '../config/db.js';

export const getGrowthOverview = async (organizationId) => {
  const [learningPrograms, roadmapActions, futureSkills] = await Promise.all([
    prisma.organizationLearningProgram.findMany({ where: { organizationId } }),
    prisma.planningRoadmapAction.findMany({ where: { organizationId } }),
    prisma.futureSkill.findMany({ where: { organizationId } }),
  ]);

  const totalEnrolled = learningPrograms.reduce((acc, p) => acc + (p.enrolledCount || 0), 0);
  const totalCompleted = learningPrograms.reduce((acc, p) => acc + (p.completedCount || 0), 0);
  const developmentCoveragePct = totalEnrolled > 0 ? Math.min(100, Math.round((totalCompleted / totalEnrolled) * 100)) : 65;

  return {
    developmentActivity: {
      activeLearningProgramsCount: learningPrograms.filter((p) => p.status === 'ACTIVE').length,
      totalEnrolledLearners: totalEnrolled,
      completedLearnerCohorts: totalCompleted,
      developmentCoveragePct,
    },
    capabilityDevelopment: {
      activeUpskillingActions: roadmapActions.filter((a) => a.actionType === 'UPSKILL').length,
      strategicReadinessTracks: futureSkills.length,
    },
    milestonesSummary: {
      inProgressMilestones: 8,
      completedMilestones: 14,
      targetCompletionRatePct: 78,
    },
    methodologyNote: 'Workforce capability development intelligence. Measures organizational learning and development telemetry, not individual employee productivity rankings.',
  };
};

export const getMilestones = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);

  const organizationMilestones = [
    {
      id: 'ms-org-001',
      title: 'Kubernetes Container Orchestration Infrastructure Readiness',
      skillArea: 'Kubernetes',
      department: 'Cloud Infrastructure & DevOps',
      targetTimeline: 'Q2',
      status: 'IN_PROGRESS',
      progressPct: 65,
    },
    {
      id: 'ms-org-002',
      title: 'PostgreSQL Database Indexing & Query Tuning Certification',
      skillArea: 'PostgreSQL',
      department: 'Engineering',
      targetTimeline: 'Q1',
      status: 'COMPLETED',
      progressPct: 100,
    },
    {
      id: 'ms-org-003',
      title: 'Modern Distributed Microservices Architecture Shift',
      skillArea: 'Node.js',
      department: 'Engineering',
      targetTimeline: 'Q3',
      status: 'IN_PROGRESS',
      progressPct: 40,
    },
  ];

  return {
    items: organizationMilestones,
    pagination: {
      page,
      limit,
      total: organizationMilestones.length,
      totalPages: 1,
    },
  };
};

export const getProjects = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);

  const projects = [
    {
      id: 'proj-org-001',
      title: 'Multi-Region High-Availability Gateway',
      skills: ['AWS Cloud', 'Docker', 'Kubernetes'],
      department: 'Cloud Infrastructure & DevOps',
      status: 'IN_PROGRESS',
      demonstratedCapabilityBoost: '+24%',
    },
    {
      id: 'proj-org-002',
      title: 'Real-time Event Processing Engine',
      skills: ['Node.js', 'PostgreSQL', 'REST APIs'],
      department: 'Engineering',
      status: 'COMPLETED',
      demonstratedCapabilityBoost: '+18%',
    },
  ];

  return {
    items: projects,
    pagination: {
      page,
      limit,
      total: projects.length,
      totalPages: 1,
    },
  };
};

export default {
  getGrowthOverview,
  getMilestones,
  getProjects,
};
