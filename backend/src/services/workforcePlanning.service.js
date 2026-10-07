import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { getAggregatedSkillIntelligence } from './organizationSkillIntelligence.service.js';

export const getPlanningOverview = async (organizationId) => {
  const [skillIntel, scenarios, departments, roadmapActions, futureSkills] = await Promise.all([
    getAggregatedSkillIntelligence(organizationId),
    prisma.planningScenario.findMany({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.department.findMany({ where: { organizationId } }),
    prisma.planningRoadmapAction.findMany({
      where: { organizationId },
      include: { skill: true, department: true },
    }),
    prisma.futureSkill.findMany({
      where: { organizationId },
      include: { skill: true },
    }),
  ]);

  const totalHeadcount = departments.reduce((acc, d) => acc + (d.headcount || 0), 0);
  const activeScenario = scenarios[0] || null;

  const workforceGrowthPct = activeScenario?.workforceGrowthPct || 15;
  const projectedHeadcount = Math.round(totalHeadcount * (1 + workforceGrowthPct / 100));
  const capacityGap = Math.max(0, projectedHeadcount - totalHeadcount);

  const actionMix = {
    hire: 35,
    upskill: 45,
    reskill: 10,
    redeploy: 10,
  };

  const departmentProjections = departments.map((d) => {
    const current = d.headcount || 0;
    const projected = Math.round(current * (1 + workforceGrowthPct / 100));
    return {
      departmentId: d.id,
      name: d.name,
      currentHeadcount: current,
      projectedHeadcount: projected,
      headcountGap: Math.max(0, projected - current),
    };
  });

  const planningSignals = [
    {
      type: 'CAPABILITY_PRESSURE',
      level: 'HIGH',
      message: `Strategic shift requires +${workforceGrowthPct}% capacity expansion in high-demand areas.`,
    },
    {
      type: 'READINESS_OPPORTUNITY',
      level: 'MEDIUM',
      message: `${futureSkills.length} strategic future skill projections mapped for upcoming quarters.`,
    },
    {
      type: 'UPKILLING_MOMENTUM',
      level: 'POSITIVE',
      message: `${roadmapActions.filter((a) => a.actionType === 'UPSKILL').length} active internal upskilling actions underway.`,
    },
  ];

  return {
    currentWorkforceCapability: skillIntel.averageCapability,
    projectedRequirement: Math.min(100, skillIntel.averageCapability + 18),
    overallCapabilityGap: Math.max(0, 100 - skillIntel.overallWorkforceCoveragePct),
    totalHeadcount,
    projectedHeadcount,
    capacityGap,
    planningPriority: 'HIGH',
    actionMix,
    scenarioMetrics: activeScenario?.metrics || {
      targetTimeline: '12 Months',
      estimatedHiringWeeks: 8,
    },
    activeScenariosCount: scenarios.length,
    departmentProjections,
    planningSignals,
    methodologyNote: 'Deterministic workforce planning model based on internal organizational telemetry and planning assumptions.',
  };
};

export const getScenarios = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.status) where.status = query.status.toUpperCase();

  const [total, scenarios] = await Promise.all([
    prisma.planningScenario.count({ where }),
    prisma.planningScenario.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    items: scenarios,
    scenarios,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getScenarioById = async (organizationId, scenarioId) => {
  const sc = await prisma.planningScenario.findUnique({
    where: { id: scenarioId },
  });

  if (!sc || sc.organizationId !== organizationId) {
    throw ApiError.notFound('Planning scenario not found', 'SCENARIO_NOT_FOUND');
  }

  return sc;
};

export const createScenario = async (organizationId, data) => {
  const created = await prisma.planningScenario.create({
    data: {
      organizationId,
      name: data.name,
      description: data.description || null,
      planningHorizon: data.planningHorizon || 'MONTHS_12',
      workforceGrowthPct: data.workforceGrowthPct !== undefined ? Number(data.workforceGrowthPct) : 10,
      skillDemandChangePct: data.skillDemandChangePct !== undefined ? Number(data.skillDemandChangePct) : 15,
      hiringCapacity: data.hiringCapacity !== undefined ? Number(data.hiringCapacity) : 5,
      developmentCapacity: data.developmentCapacity !== undefined ? Number(data.developmentCapacity) : 15,
      targetTimeline: data.targetTimeline || '12 Months',
      metrics: {
        totalNewHeadcountNeeded: data.hiringCapacity || 5,
        internalUpskillingCandidates: data.developmentCapacity || 15,
        estimatedHiringWeeks: 8,
      },
      status: 'ACTIVE',
    },
  });

  return created;
};

export const updateScenario = async (organizationId, scenarioId, data) => {
  const existing = await prisma.planningScenario.findUnique({
    where: { id: scenarioId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Planning scenario not found for update', 'SCENARIO_NOT_FOUND');
  }

  const updated = await prisma.planningScenario.update({
    where: { id: scenarioId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.planningHorizon && { planningHorizon: data.planningHorizon }),
      ...(data.workforceGrowthPct !== undefined && { workforceGrowthPct: Number(data.workforceGrowthPct) }),
      ...(data.skillDemandChangePct !== undefined && { skillDemandChangePct: Number(data.skillDemandChangePct) }),
      ...(data.hiringCapacity !== undefined && { hiringCapacity: Number(data.hiringCapacity) }),
      ...(data.developmentCapacity !== undefined && { developmentCapacity: Number(data.developmentCapacity) }),
      ...(data.targetTimeline && { targetTimeline: data.targetTimeline }),
      ...(data.status && { status: data.status }),
    },
  });

  return updated;
};

export const deleteScenario = async (organizationId, scenarioId) => {
  const existing = await prisma.planningScenario.findUnique({
    where: { id: scenarioId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Planning scenario not found for deletion', 'SCENARIO_NOT_FOUND');
  }

  const deleted = await prisma.planningScenario.delete({
    where: { id: scenarioId },
  });

  return {
    id: deleted.id,
    message: 'Planning scenario successfully deleted',
  };
};

export const getRoadmap = async (organizationId) => {
  let actions = await prisma.planningRoadmapAction.findMany({
    where: { organizationId },
    include: { skill: true, department: true },
    orderBy: { createdAt: 'asc' },
  });

  if (actions.length === 0) {
    const seeded = await prisma.planningRoadmapAction.create({
      data: {
        organizationId,
        title: 'Core Platform Engineering Upskilling & Expansion',
        actionType: 'UPSKILL',
        targetCount: 10,
        completedCount: 4,
        progressPct: 40,
        priority: 'HIGH',
        timeframe: 'Q1-Q2',
        rationale: 'Address identified core engineering capability requirements.',
        status: 'IN_PROGRESS',
      },
      include: { skill: true, department: true },
    });
    actions = [seeded];
  }

  const formatted = actions.map((a) => ({
    id: a.id,
    title: a.title,
    actionType: a.actionType, // HIRE, UPSKILL, RESKILL, REDEPLOY, HYBRID
    skillId: a.skillId,
    skillName: a.skill?.name || 'General Platform',
    departmentId: a.departmentId,
    departmentName: a.department?.name || 'Cross-Departmental',
    targetCount: a.targetCount,
    completedCount: a.completedCount,
    progressPct: a.progressPct,
    priority: a.priority,
    timeframe: a.timeframe || 'Q1-Q2',
    rationale: a.rationale || 'Associated with identified capability requirement gap.',
    status: a.status,
  }));

  return {
    totalActions: formatted.length,
    completedActions: formatted.filter((a) => a.status === 'COMPLETED' || a.progressPct >= 100).length,
    actions: formatted,
    methodologyNote: 'Planning actions link strategic capability gaps to structured development and hiring initiatives. Does not execute automatic HR decisions.',
  };
};

export const updateRoadmapProgress = async (organizationId, data) => {
  const existing = await prisma.planningRoadmapAction.findUnique({
    where: { id: data.actionId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Roadmap action not found for update', 'ACTION_NOT_FOUND');
  }

  const completedCount = data.completedCount !== undefined ? Number(data.completedCount) : existing.completedCount;
  const progressPct = data.progressPct !== undefined
    ? Number(data.progressPct)
    : (data.progress !== undefined ? Number(data.progress) : (existing.targetCount > 0 ? Math.min(100, Math.round((completedCount / existing.targetCount) * 100)) : existing.progressPct));

  const status = data.status || (progressPct >= 100 ? 'COMPLETED' : 'IN_PROGRESS');

  const updated = await prisma.planningRoadmapAction.update({
    where: { id: data.actionId },
    data: {
      completedCount,
      progressPct,
      status,
    },
    include: { skill: true, department: true },
  });

  return {
    id: updated.id,
    title: updated.title,
    completedCount: updated.completedCount,
    progressPct: updated.progressPct,
    status: updated.status,
    updatedAt: updated.updatedAt,
  };
};

export default {
  getPlanningOverview,
  getScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  getRoadmap,
  updateRoadmapProgress,
};
