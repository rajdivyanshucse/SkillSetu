/**
 * SkillSetu Professional Growth Intelligence Utilities (Phase 14)
 * Deterministic calculation engine for career progression, skill advancement, and aggregate workforce development.
 * 
 * Model Name: SkillSetu Professional Growth Model
 */

import {
  initialSkillGrowthRecords,
  initialLearningCourses,
  initialProjectsPortfolio,
  initialCareerMilestones,
  initialGrowthTimeline,
  prototypeGrowthInsights,
  organizationCapabilityDevelopment,
  organizationDevelopmentPrograms,
  organizationGrowthInsights,
  STORAGE_KEY_GROWTH,
  STORAGE_KEY_GROWTH_PROJECTS,
  STORAGE_KEY_GROWTH_MILESTONES,
} from '../data/growthData';

/**
 * Calculates average skill progress across tracked competencies.
 */
export const calculateSkillProgress = (skills = initialSkillGrowthRecords) => {
  const skillList = Array.isArray(skills) ? skills : skills?.skills || initialSkillGrowthRecords;
  if (!skillList || skillList.length === 0) return 0;
  const sum = skillList.reduce((acc, s) => acc + (s.progressPct ?? s.progress ?? 0), 0);
  return Math.round(sum / skillList.length);
};

/**
 * Calculates average learning module completion percentage.
 */
export const calculateLearningProgress = (courses = initialLearningCourses) => {
  const courseList = Array.isArray(courses) ? courses : courses?.learningCourses || courses?.courses || initialLearningCourses;
  if (!courseList || courseList.length === 0) return 0;
  const sum = courseList.reduce((acc, c) => acc + (c.progressPct ?? c.progress ?? 0), 0);
  return Math.round(sum / courseList.length);
};

/**
 * Calculates project evidence metrics.
 */
export const calculateProjectEvidence = (projects = initialProjectsPortfolio) => {
  const projList = Array.isArray(projects) ? projects : projects?.projects || initialProjectsPortfolio;
  if (!projList) return { total: 0, completed: 0, inProgress: 0, planning: 0, completedProjects: 0 };
  const completed = projList.filter((p) => p.status === 'Completed' || p.status === 'completed').length;
  const inProgress = projList.filter((p) => p.status === 'In Progress' || p.status === 'in_progress').length;
  const planning = projList.filter((p) => p.status === 'Planning' || p.status === 'planning').length;

  return {
    total: projList.length,
    completed,
    completedProjects: completed,
    inProgress,
    planning,
  };
};

/**
 * Calculates milestone completion status.
 */
export const calculateMilestoneProgress = (milestones = initialCareerMilestones) => {
  const mileList = Array.isArray(milestones) ? milestones : milestones?.milestones || initialCareerMilestones;
  if (!mileList || mileList.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const completed = mileList.filter((m) => m.status === 'Completed' || m.status === 'completed').length;
  const percentage = Math.round((completed / mileList.length) * 100);

  return {
    completed,
    total: mileList.length,
    percentage,
  };
};

/**
 * Calculates weighted overall development progress.
 * Formula: Skills (40%) + Learning (25%) + Projects (20%) + Milestones (15%)
 */
export const calculateDevelopmentProgress = (arg1, arg2, arg3, arg4) => {
  let skills = initialSkillGrowthRecords;
  let learning = initialLearningCourses;
  let projects = initialProjectsPortfolio;
  let milestones = initialCareerMilestones;

  if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)) {
    skills = arg1.skills || skills;
    learning = arg1.learningCourses || arg1.learning || learning;
    projects = arg1.projects || projects;
    milestones = arg1.milestones || milestones;
  } else {
    if (arg1) skills = arg1;
    if (arg2) learning = arg2;
    if (arg3) projects = arg3;
    if (arg4) milestones = arg4;
  }

  const skillPct = calculateSkillProgress(skills);
  const learnPct = calculateLearningProgress(learning);
  const projEvidence = calculateProjectEvidence(projects);
  const projPct = projEvidence.total > 0 ? Math.round((projEvidence.completed / projEvidence.total) * 100) : 50;
  const mileProgress = calculateMilestoneProgress(milestones);

  const weighted =
    skillPct * 0.4 +
    learnPct * 0.25 +
    projPct * 0.2 +
    mileProgress.percentage * 0.15;

  return Math.round(weighted);
};

/**
 * Calculates target-role readiness development indicator.
 * Combines core skill alignment, project evidence, and milestone tiers.
 */
export const calculateRoleReadiness = (arg1, arg2, arg3, arg4) => {
  let targetRole = 'Backend Software Engineer';
  let skills = initialSkillGrowthRecords;
  let projects = initialProjectsPortfolio;
  let milestones = initialCareerMilestones;

  if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)) {
    targetRole = arg1.targetRole || targetRole;
    skills = arg1.skills || skills;
    projects = arg1.projects || projects;
    milestones = arg1.milestones || milestones;
  } else {
    if (arg1) targetRole = arg1;
    if (arg2) skills = arg2;
    if (arg3) projects = arg3;
    if (arg4) milestones = arg4;
  }

  const skillPct = calculateSkillProgress(skills);
  const projCompleted = calculateProjectEvidence(projects).completed;
  const projFactor = Math.min(100, projCompleted * 35);
  const mileProgress = calculateMilestoneProgress(milestones);

  // Weighted alignment index (non-hiring score)
  const readiness = Math.round(skillPct * 0.5 + projFactor * 0.3 + mileProgress.percentage * 0.2);
  const priorityGaps = (Array.isArray(skills) ? skills : []).filter((s) => s.developmentArea || s.priority === 'High').length;

  return {
    targetRole,
    readinessScore: Math.min(95, Math.max(40, readiness)),
    roleRequirementCoverage: 84,
    developmentProgress: calculateDevelopmentProgress(skills, initialLearningCourses, projects, milestones),
    relevantProjectsCount: Array.isArray(projects) ? projects.length : 4,
    completedProjectsCount: projCompleted,
    priorityGapsCount: priorityGaps || 4,
    disclaimer: 'Role readiness is a development alignment indicator and not a hiring guarantee or interview prediction.',
  };
};

/**
 * Generates deterministic growth insights tailored to individual progress.
 */
export const generateGrowthInsights = (arg1, arg2, arg3, arg4) => {
  let skills = initialSkillGrowthRecords;
  let learning = initialLearningCourses;
  let projects = initialProjectsPortfolio;
  let milestones = initialCareerMilestones;

  if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1)) {
    skills = arg1.skills || skills;
    learning = arg1.learningCourses || arg1.learning || learning;
    projects = arg1.projects || projects;
    milestones = arg1.milestones || milestones;
  } else {
    if (arg1) skills = arg1;
    if (arg2) learning = arg2;
    if (arg3) projects = arg3;
    if (arg4) milestones = arg4;
  }

  const insights = [...prototypeGrowthInsights];

  const highPriorityGaps = (Array.isArray(skills) ? skills : []).filter((s) => s.developmentArea && s.priority === 'High');
  if (highPriorityGaps.length > 0) {
    const topGap = highPriorityGaps[0];
    insights.unshift({
      id: `gap-insight-${topGap.id}`,
      title: `Priority Growth Focus: ${topGap.name}`,
      observation: `${topGap.name} is currently at level ${topGap.currentLevel || 6}/10 (${topGap.progressPct || topGap.progress || 60}% progress toward target level ${topGap.targetLevel || 8}/10).`,
      supportingMetric: topGap.reason || 'High priority capability gap for target role',
      context: `Recommended next activity: ${topGap.nextAction || 'Complete hands-on project'}`,
      interpretation: 'Focusing development effort on this competency directly addresses the primary role gap.',
      category: 'Active Focus',
    });
  }

  return insights.slice(0, 5);
};

/**
 * Generates chronological timeline stream.
 */
export const generateGrowthTimeline = (arg1) => {
  let activities = initialGrowthTimeline;
  if (arg1) {
    if (Array.isArray(arg1)) {
      activities = arg1;
    } else if (arg1.activities) {
      activities = arg1.activities;
    }
  }
  return [...activities].sort((a, b) => new Date(b.date || '2026-09-01') - new Date(a.date || '2026-09-01'));
};

/**
 * Calculates organization aggregate capability development metrics.
 */
export const calculateOrganizationDevelopmentMetrics = (
  capabilities = organizationCapabilityDevelopment,
  programs = organizationDevelopmentPrograms
) => {
  const totalCapabilities = capabilities.length;
  const avgCoverage = Math.round(
    capabilities.reduce((acc, c) => acc + c.currentCoverage, 0) / (totalCapabilities || 1)
  );
  const avgTarget = Math.round(
    capabilities.reduce((acc, c) => acc + c.targetCoverage, 0) / (totalCapabilities || 1)
  );
  const avgProgress = Math.round(
    capabilities.reduce((acc, c) => acc + c.developmentProgress, 0) / (totalCapabilities || 1)
  );

  const totalParticipants = programs.reduce((acc, p) => acc + (p.participants || 0), 0);
  const avgProgramProgress = Math.round(
    programs.reduce((acc, p) => acc + (p.averageProgress || 0), 0) / (programs.length || 1)
  );
  const highPriorityCount = capabilities.filter((c) => c.priority === 'High').length;

  return {
    workforceCoverage: avgCoverage,
    targetCoverage: avgTarget,
    skillsInDevelopment: capabilities.length,
    learningParticipation: totalParticipants,
    activeProgramsCount: programs.length,
    developmentPrioritiesCount: highPriorityCount,
    capabilityProgress: avgProgress,
    roadmapAlignment: 74,
    averageProgramProgress: avgProgramProgress,
  };
};

/**
 * Generates aggregate organization development insights.
 */
export const generateOrganizationGrowthInsights = (
  capabilities = organizationCapabilityDevelopment,
  programs = organizationDevelopmentPrograms
) => {
  return [...organizationGrowthInsights];
};

/**
 * LocalStorage Persistence Helpers
 */
export const getStoredGrowthState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROWTH);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to parse growth localStorage state:', e);
    return null;
  }
};

export const saveStoredGrowthState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY_GROWTH, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save growth localStorage state:', e);
  }
};

export const getStoredGrowthProjects = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROWTH_PROJECTS);
    return raw ? JSON.parse(raw) : initialProjectsPortfolio;
  } catch (e) {
    console.warn('Failed to parse growth projects localStorage:', e);
    return initialProjectsPortfolio;
  }
};

export const saveStoredGrowthProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEY_GROWTH_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.warn('Failed to save growth projects localStorage:', e);
  }
};

export const getStoredGrowthMilestones = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GROWTH_MILESTONES);
    return raw ? JSON.parse(raw) : initialCareerMilestones;
  } catch (e) {
    console.warn('Failed to parse growth milestones localStorage:', e);
    return initialCareerMilestones;
  }
};

export const saveStoredGrowthMilestones = (milestones) => {
  try {
    localStorage.setItem(STORAGE_KEY_GROWTH_MILESTONES, JSON.stringify(milestones));
  } catch (e) {
    console.warn('Failed to save growth milestones localStorage:', e);
  }
};

// Aliases for clean cross-module integration
export const loadGrowthData = () => {
  const stored = getStoredGrowthState();
  if (stored) return stored;
  return {
    targetRole: 'Backend Software Engineer',
    skills: initialSkillGrowthRecords,
    learningCourses: initialLearningCourses,
    activities: initialGrowthTimeline,
  };
};

export const saveGrowthData = (state) => saveStoredGrowthState(state);
export const loadProjects = () => getStoredGrowthProjects();
export const saveProjects = (projects) => saveStoredGrowthProjects(projects);
export const loadMilestones = () => getStoredGrowthMilestones();
export const saveMilestones = (milestones) => saveStoredGrowthMilestones(milestones);
