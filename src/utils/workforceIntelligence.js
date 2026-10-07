/**
 * SkillSetu Workforce Intelligence Calculation Engine
 * Deterministic aggregation and decision-support logic based on organization profile inputs
 */

import {
  defaultTargetCoverage,
  coverageStatusThresholds,
} from '../data/workforceIntelligenceData';

/**
 * Determines coverage status tier (Strong, Moderate, Developing, Limited)
 */
export const calculateCoverageStatus = (coveragePct = 0) => {
  const num = typeof coveragePct === 'number' ? coveragePct : parseInt(coveragePct, 10) || 0;
  for (const t of coverageStatusThresholds) {
    if (num >= t.min) {
      return t;
    }
  }
  return coverageStatusThresholds[coverageStatusThresholds.length - 1];
};

/**
 * Calculates gap in percentage points between current coverage and target benchmark
 */
export const calculateSkillGap = (skillName, currentCoverage = 50) => {
  const current = typeof currentCoverage === 'number' ? currentCoverage : parseInt(currentCoverage, 10) || 0;
  const target = defaultTargetCoverage[skillName] || 65;
  const gap = Math.max(0, target - current);

  let priority = 'Low';
  if (gap >= 30) priority = 'Critical';
  else if (gap >= 20) priority = 'High';
  else if (gap >= 10) priority = 'Medium';

  return {
    skillName,
    currentCoverage: current,
    targetCoverage: target,
    gap,
    gapPoints: gap,
    priority,
  };
};

/**
 * Calculates skill priority based on gap and future importance
 */
export const calculateSkillPriority = (gapPoints = 0, futureImportance = 'Medium') => {
  const gap = typeof gapPoints === 'number' ? gapPoints : parseInt(gapPoints, 10) || 0;
  const isCriticalFuture = futureImportance === 'Critical';
  const isHighFuture = futureImportance === 'High';

  if (gap >= 30 || (gap >= 20 && isCriticalFuture)) return 'Critical';
  if (gap >= 20 || (gap >= 10 && (isCriticalFuture || isHighFuture))) return 'High';
  if (gap >= 10 || isCriticalFuture) return 'Medium';
  return 'Low';
};

/**
 * Calculates future skill priority based on strategic horizons
 */
export const calculateFutureSkillPriority = (futureImportance = 'Medium', horizon = '0–12 Months') => {
  if (futureImportance === 'Critical' || horizon.includes('0–12')) return 'High';
  if (futureImportance === 'High') return 'Medium';
  return 'Emerging';
};

/**
 * Calculates executive KPI metrics from organization onboarding state
 */
export const calculateWorkforceMetrics = (orgData) => {
  if (!orgData) return {};

  const departments = orgData.workforce?.departments || {};
  const totalEmployees = Object.values(departments).reduce(
    (acc, val) => acc + (parseInt(val, 10) || 0),
    0
  );

  const skills = orgData.skills || [];
  const skillsCount = skills.length;

  const totalCoverage = skills.reduce((acc, s) => acc + (parseInt(s.coveragePct, 10) || 0), 0);
  const averageCoverage = skillsCount > 0 ? Math.round(totalCoverage / skillsCount) : 0;

  // Compute gaps
  const skillGaps = skills
    .map((s) => calculateSkillGap(s.name, s.coveragePct))
    .filter((g) => g.gap > 0);

  const priorityGapsCount = skillGaps.filter((g) => g.priority === 'Critical' || g.priority === 'High').length;

  // Future critical skills count
  const futureSkills = orgData.futureSkills || [];
  const futureCriticalCount = futureSkills.filter(
    (fs) => fs.futureImportance === 'Critical' || fs.futureImportance === 'High'
  ).length;

  // Development focus count
  const strategicPriorities = orgData.priorities?.strategicPriorities || [];
  const developmentFocusCount = strategicPriorities.length + priorityGapsCount;

  return {
    totalEmployees,
    skillsCount,
    averageCoverage,
    priorityGapsCount,
    futureCriticalCount,
    developmentFocusCount,
    skillGaps,
  };
};

/**
 * Generates prioritized workforce skill gaps list with business reasoning
 */
export const generateSkillGapsList = (orgData) => {
  if (!orgData || !orgData.skills) return [];

  const strategicPriorities = orgData.priorities?.strategicPriorities || [];
  const futureSkills = orgData.futureSkills || [];

  return orgData.skills.map((s) => {
    const gapData = calculateSkillGap(s.name, s.coveragePct);

    // Check if skill relates to stated future skill requirements
    const isFutureSkill = futureSkills.some(
      (fs) => fs.name.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(fs.name.toLowerCase())
    );

    // Contextual rationale based on organization inputs
    let reason = `Current team coverage (${s.coveragePct}%) is below the operational target (${gapData.targetCoverage}%).`;
    if (s.name === 'AWS' || s.name === 'Docker' || s.name === 'Kubernetes') {
      reason = 'Cloud & containerization capabilities are critical to digital infrastructure modernization priorities.';
    } else if (s.name === 'Java' || s.name === 'Spring Boot') {
      reason = 'Core backend services require continuous depth to support microservice throughput and reliability.';
    } else if (isFutureSkill) {
      reason = 'Identified as an emerging future capability required for upcoming 12-month product milestones.';
    }

    return {
      ...s,
      ...gapData,
      businessImportance: isFutureSkill || gapData.priority === 'Critical' ? 'High' : 'Medium',
      reason,
    };
  }).sort((a, b) => b.gap - a.gap);
};

/**
 * Generates hiring vs upskilling action signals
 */
export const generateActionSignals = (orgData) => {
  if (!orgData || !orgData.skills) return [];

  const gaps = generateSkillGapsList(orgData);
  const futureSkills = orgData.futureSkills || [];
  const defaultStrategy = orgData.preferences?.workforceStrategy || 'Hybrid';

  return gaps.slice(0, 5).map((gap) => {
    const isFutureCritical = futureSkills.some(
      (fs) => fs.name.toLowerCase().includes(gap.name.toLowerCase()) && (fs.futureImportance === 'Critical' || fs.futureImportance === 'High')
    );

    let suggestedAction = 'Upskill';
    let rationale = 'Team possesses intermediate fundamentals; internal cohort upskilling offers the fastest path to bridge the gap.';

    if (gap.gap >= 35 && isFutureCritical) {
      suggestedAction = 'Hybrid (Hire + Upskill)';
      rationale = 'Large coverage deficit combined with high future criticality requires hiring experienced leads while upskilling existing staff.';
    } else if (gap.gap >= 35) {
      suggestedAction = 'Hire / Contract';
      rationale = 'Significant capability deficit may cause release delays if reliance is placed solely on internal reskilling.';
    } else if (gap.coveragePct >= 60) {
      suggestedAction = 'Upskill';
      rationale = 'Strong existing foundation; targeted micro-certifications will close remaining gaps.';
    }

    return {
      skillName: gap.name,
      category: gap.category,
      currentCoverage: gap.currentCoverage,
      targetCoverage: gap.targetCoverage,
      futureImportance: isFutureCritical ? 'Critical' : 'High',
      suggestedAction,
      rationale,
    };
  });
};

/**
 * Generates 4–6 deterministic workforce insights traceable directly to organization inputs
 */
export const generateWorkforceInsights = (orgData) => {
  if (!orgData) return [];

  const insights = [];
  const departments = orgData.workforce?.departments || {};
  const skills = orgData.skills || [];
  const futureSkills = orgData.futureSkills || [];
  const priorities = orgData.priorities?.strategicPriorities || [];

  // 1. Largest department insight
  let largestDept = 'Engineering';
  let maxCount = 0;
  Object.entries(departments).forEach(([d, c]) => {
    const num = parseInt(c, 10) || 0;
    if (num > maxCount) {
      maxCount = num;
      largestDept = d;
    }
  });
  if (maxCount > 0) {
    insights.push({
      id: 'dept-size',
      title: `${largestDept} represents the largest workforce segment (${maxCount} employees).`,
      detail: `Department distribution shows heavy investment in ${largestDept.toLowerCase()}, requiring focused competency calibration.`,
      tag: 'Workforce Composition',
      type: 'info',
    });
  }

  // 2. Cloud & Infrastructure coverage check
  const cloudSkills = skills.filter((s) => s.category === 'Cloud' || s.category === 'DevOps');
  const avgCloudCoverage = cloudSkills.length > 0
    ? Math.round(cloudSkills.reduce((acc, s) => acc + s.coveragePct, 0) / cloudSkills.length)
    : 0;

  if (avgCloudCoverage > 0 && avgCloudCoverage < 50) {
    insights.push({
      id: 'cloud-coverage',
      title: 'Cloud & deployment capabilities currently have developing coverage.',
      detail: `Average coverage across ${cloudSkills.map((s) => s.name).join(', ')} is ${avgCloudCoverage}%, indicating an area for cohort training.`,
      tag: 'Capability Gap',
      type: 'warning',
    });
  }

  // 3. Core backend strength check
  const backendSkills = skills.filter((s) => s.name === 'Java' || s.name === 'SQL' || s.name === 'Spring Boot');
  if (backendSkills.length > 0) {
    insights.push({
      id: 'backend-strength',
      title: 'Core backend and relational database foundations are well established.',
      detail: `High workforce familiarity in ${backendSkills.map((s) => s.name).join(', ')} provides a stable foundation for microservices migration.`,
      tag: 'Core Strength',
      type: 'success',
    });
  }

  // 4. Future skill horizon alert
  if (futureSkills.length > 0) {
    const nearTerm = futureSkills.filter((fs) => fs.horizon === '0–12 months');
    insights.push({
      id: 'future-horizon',
      title: `${nearTerm.length} emerging skill areas have near-term (0–12 month) operational horizons.`,
      detail: `Strategic priorities emphasize early adoption of ${nearTerm.map((fs) => fs.name).join(', ')}.`,
      tag: 'Future Horizon',
      type: 'brand',
    });
  }

  // 5. Strategic priority alignment
  if (priorities.length > 0) {
    insights.push({
      id: 'strategic-priority',
      title: `Workforce development is aligned with: ${priorities.slice(0, 2).join(' & ')}.`,
      detail: 'Organizational preferences emphasize continuous internal capability enhancement and structured learning cohorts.',
      tag: 'Strategic Alignment',
      type: 'info',
    });
  }

  return insights;
};
