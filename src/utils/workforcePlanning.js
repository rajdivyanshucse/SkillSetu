/**
 * SkillSetu Workforce Planning Calculation Engine (Phase 12)
 * Deterministic scenario modeling, capacity gap projections, action mix allocations, and roadmap generation.
 *
 * NOTE: Planning outputs are illustrative decision-support heuristics based on configured assumptions.
 */

import {
  defaultPlanningScenarios,
  planningHorizons,
  baselineCapabilities,
  baselineDepartmentPlanning,
  roadmapMilestones,
} from '../data/workforcePlanningData';

/**
 * Calculates projected requirement based on current capacity and scenario multipliers
 */
export const calculateProjectedRequirement = (currentCapacity = 20, multiplier = 1.2, horizonMultiplier = 1.0) => {
  const base = typeof currentCapacity === 'number' ? currentCapacity : parseInt(currentCapacity, 10) || 20;
  return Math.round(base * multiplier * horizonMultiplier);
};

/**
 * Calculates capacity gap between projected requirement and current capacity
 */
export const calculateCapacityGap = (projectedRequirement, currentCapacity) => {
  return Math.max(0, projectedRequirement - currentCapacity);
};

/**
 * Calculates planning priority (Critical, High, Medium, Low)
 */
export const calculateSkillPlanningPriority = (gap = 0, importance = 'Medium', currentCoverage = 50) => {
  const isCritical = importance === 'Critical';
  const isHigh = importance === 'High';

  if (gap >= 15 || (gap >= 10 && isCritical) || (gap >= 8 && currentCoverage < 40)) {
    return 'Critical';
  }
  if (gap >= 10 || (gap >= 6 && (isCritical || isHigh))) {
    return 'High';
  }
  if (gap >= 5 || isCritical || isHigh) {
    return 'Medium';
  }
  return 'Low';
};

/**
 * Calculates action mix allocation breakdown (Hiring, Upskilling, Reskilling, Internal Mobility)
 */
export const calculateActionMix = (gap = 10, scenarioMix = { hiring: 40, upskilling: 45, reskilling: 5, internalMobility: 10 }) => {
  const hireUnits = Math.round((gap * (scenarioMix.hiring || 40)) / 100);
  const upskillUnits = Math.round((gap * (scenarioMix.upskilling || 45)) / 100);
  const reskillUnits = Math.round((gap * (scenarioMix.reskilling || 5)) / 100);
  const mobilityUnits = Math.max(0, gap - (hireUnits + upskillUnits + reskillUnits));

  return {
    hiringUnits: hireUnits,
    upskillUnits: upskillUnits,
    reskillUnits: reskillUnits,
    mobilityUnits: mobilityUnits,
    percentages: scenarioMix,
  };
};

/**
 * Calculates executive KPI metrics for a scenario
 */
export const calculateScenarioMetrics = (scenario = defaultPlanningScenarios[0], horizonMonths = 24, orgData = null) => {
  // Use organization workforce headcount if present, otherwise default to 287
  let currentHeadcount = 287;
  if (orgData?.workforce?.departments) {
    currentHeadcount = Object.values(orgData.workforce.departments).reduce(
      (acc, v) => acc + (parseInt(v, 10) || 0),
      0
    ) || 287;
  }

  const growthRate = scenario.growthRate || 0.12;
  const multiplier = scenario.skillDemandMultiplier || 1.2;
  const horizonObj = planningHorizons.find((h) => h.value === horizonMonths) || planningHorizons[1];
  const horizonMultiplier = horizonObj.multiplier || 1.15;

  // Total projected headcount
  const projectedHeadcount = Math.round(currentHeadcount * (1 + growthRate * (horizonMonths / 24)));
  const totalHeadcountDelta = projectedHeadcount - currentHeadcount;

  // Process capability metrics
  const processedCapabilities = baselineCapabilities.map((cap) => {
    const projected = calculateProjectedRequirement(cap.currentCapacity, multiplier, horizonMultiplier);
    const gap = calculateCapacityGap(projected, cap.currentCapacity);
    const priority = calculateSkillPlanningPriority(gap, cap.importance, cap.currentCoveragePct);
    const actionMix = calculateActionMix(gap, scenario.defaultActionMix);

    return {
      ...cap,
      projectedRequirement: projected,
      capacityGap: gap,
      priority,
      actionMix,
    };
  });

  const totalCapacityGap = processedCapabilities.reduce((acc, c) => acc + c.capacityGap, 0);
  const futureCriticalCount = processedCapabilities.filter((c) => c.priority === 'Critical' || c.importance === 'Critical').length;
  const totalHiringUnits = processedCapabilities.reduce((acc, c) => acc + c.actionMix.hiringUnits, 0);
  const totalUpskillUnits = processedCapabilities.reduce((acc, c) => acc + c.actionMix.upskillUnits, 0);
  const developmentPrioritiesCount = processedCapabilities.filter((c) => c.actionMix.upskillUnits > 0).length;

  return {
    currentHeadcount,
    projectedHeadcount,
    totalHeadcountDelta,
    totalCapacityGap,
    futureCriticalCount,
    totalHiringUnits,
    totalUpskillUnits,
    developmentPrioritiesCount,
    capabilities: processedCapabilities,
  };
};

/**
 * Calculates department breakdown under a scenario
 */
export const calculateDepartmentProjections = (scenario = defaultPlanningScenarios[0], horizonMonths = 24, orgData = null) => {
  const departments = orgData?.workforce?.departments || {};
  const hasCustomDepts = Object.keys(departments).length > 0;

  if (hasCustomDepts) {
    return Object.entries(departments).map(([dept, count]) => {
      const current = parseInt(count, 10) || 10;
      const rate = scenario.growthRate || 0.1;
      const projected = Math.round(current * (1 + rate * (horizonMonths / 24)));
      const diff = projected - current;

      return {
        department: dept,
        currentHeadcount: current,
        projectedHeadcount: projected,
        difference: diff >= 0 ? `+${diff}` : `${diff}`,
        differenceNum: diff,
        priorityCapability: dept === 'Engineering' ? 'Cloud Architecture & Backend APIs' : `${dept} Operations & Strategy`,
        potentialAction: diff > 10 ? 'Hybrid (Upskill 60% + Hire 40%)' : 'Internal Mobility & Upskilling',
      };
    });
  }

  return baselineDepartmentPlanning.map((d) => {
    const projected = Math.round(d.currentHeadcount * (1 + d.growthRate * (scenario.growthRate / 0.12) * (horizonMonths / 24)));
    const diff = projected - d.currentHeadcount;
    return {
      ...d,
      projectedHeadcount: projected,
      difference: diff >= 0 ? `+${diff}` : `${diff}`,
      differenceNum: diff,
    };
  });
};

/**
 * Generates deterministic workforce planning insights
 */
export const generateWorkforcePlanningInsights = (scenario, metrics) => {
  const insights = [];

  if (metrics.totalCapacityGap > 30) {
    insights.push({
      id: 'high-gap',
      type: 'warning',
      title: `Projected capacity gap of ${metrics.totalCapacityGap} units identified under ${scenario.name}.`,
      detail: 'Cloud Architecture and Generative AI represent the most significant potential capacity constraints.',
      tag: 'Capacity Analysis',
    });
  }

  insights.push({
    id: 'action-mix',
    type: 'info',
    title: `Internal upskilling accounts for approximately ${scenario.defaultActionMix?.upskilling || 45}% of planned gap mitigation.`,
    detail: 'Prioritizing structured internal learning cohorts minimizes external recruitment overhead while maintaining retention.',
    tag: 'Execution Mix',
  });

  insights.push({
    id: 'talent-signal',
    type: 'success',
    title: 'Prototype talent pool exhibits strong alignment across 4 high-priority capability gaps.',
    detail: 'Candidate profiles in Cloud and DevOps can be leveraged for targeted external acquisition as planned.',
    tag: 'Talent Pool Signal',
  });

  insights.push({
    id: 'horizon-sensitivity',
    type: 'purple',
    title: `Planning outputs are calibrated for a ${scenario.horizon || '24-Month'} horizon with ${scenario.workforceGrowth} growth.`,
    detail: 'Shifting to alternative scenarios or adjusting demand multipliers will dynamically update capability requirements.',
    tag: 'Scenario Sensitivity',
  });

  return insights;
};
