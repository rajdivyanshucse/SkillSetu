/**
 * SkillSetu Education, Learning & Skill Development Intelligence Utilities (Phase 15)
 * Deterministic calculations for learning priorities, paths, recommendation scoring, and progress tracking.
 * 
 * Model: SkillSetu Prototype Learning Intelligence Model
 */

import {
  initialLearningPaths,
  initialLearningCatalog,
  initialLearningProjects,
  initialValidationActivities,
  prototypeLearningInsights,
  organizationLearningPrograms,
  organizationLearningCapabilities,
  organizationLearningInsights,
  STORAGE_KEY_LEARNING,
  STORAGE_KEY_SAVED_LEARNING,
} from '../data/learningData';

/**
 * Calculates priority score for learning a specific skill based on:
 * Skill Gap (40%) + Role Importance (30%) + Opportunity Relevance (30%)
 */
export const calculateLearningPriority = ({
  skillGap = 4, // on scale of 1-10
  roleImportance = 9, // on scale of 1-10
  opportunityRelevance = 8, // on scale of 1-10
}) => {
  const gapScore = Math.min(10, Math.max(1, skillGap)) * 10;
  const roleScore = Math.min(10, Math.max(1, roleImportance)) * 10;
  const oppScore = Math.min(10, Math.max(1, opportunityRelevance)) * 10;

  const weighted = gapScore * 0.4 + roleScore * 0.3 + oppScore * 0.3;
  return Math.round(weighted);
};

/**
 * Calculates specific skill learning need level (High, Medium, Low).
 */
export const calculateSkillLearningNeed = (priorityScore = 70) => {
  if (priorityScore >= 75) return 'High';
  if (priorityScore >= 50) return 'Medium';
  return 'Standard';
};

/**
 * Calculates overall learning progress across paths and modules.
 */
export const calculateLearningProgress = (paths = initialLearningPaths) => {
  if (!paths || paths.length === 0) return 0;
  const total = paths.reduce((acc, p) => acc + (p.progressPct || 0), 0);
  return Math.round(total / paths.length);
};

/**
 * Calculates progress for an individual learning path.
 */
export const calculatePathProgress = (path) => {
  if (!path || !path.modules || path.modules.length === 0) return 0;
  const total = path.modules.reduce((acc, m) => acc + (m.progressPct || 0), 0);
  return Math.round(total / path.modules.length);
};

/**
 * Generates tailored learning recommendations combining skill gaps, target roles, and opportunities.
 */
export const generateLearningRecommendations = (targetRole = 'Backend Software Engineer') => {
  return [
    {
      id: 'rec-1',
      activity: 'Spring Boot 3 Enterprise Microservices in Action',
      relatedSkill: 'Spring Boot',
      skillGap: 'Level 3/10 → 8/10 (Gap: 5)',
      targetRole,
      whyItMatters: 'Addresses an active backend engineering development gap with strong demand across enterprise services.',
      estimatedEffort: '18 Hours',
      format: 'Course + Labs + Project',
      priority: 'High',
      nextAction: 'Start Learning Path',
      pathId: 'path-backend-foundations',
      opportunityPresence: '14 Prototype Opportunities',
      compensationContext: 'Advertised: ₹12–24 LPA',
    },
    {
      id: 'rec-2',
      activity: 'AWS Cloud Architecture & Multi-AZ VPC Networking',
      relatedSkill: 'AWS',
      skillGap: 'Level 1/10 → 7/10 (Gap: 6)',
      targetRole,
      whyItMatters: 'Cloud infrastructure is your largest capability delta relative to the target role requirements.',
      estimatedEffort: '16 Hours',
      format: 'Sandbox Lab + Terraform',
      priority: 'High',
      nextAction: 'Launch VPC Sandbox',
      pathId: 'path-cloud-engineering',
      opportunityPresence: '11 Prototype Opportunities',
      compensationContext: 'Advertised: ₹14–26 LPA',
    },
    {
      id: 'rec-3',
      activity: 'Distributed System Design: Caching & Message Queues',
      relatedSkill: 'System Design',
      skillGap: 'Level 2/10 → 8/10 (Gap: 6)',
      targetRole,
      whyItMatters: 'Essential architectural mastery for senior backend and distributed systems engineering.',
      estimatedEffort: '14 Hours',
      format: 'Architecture Case Studies',
      priority: 'Medium',
      nextAction: 'Review Rate Limiter Design',
      pathId: 'path-system-design',
      opportunityPresence: '16 Prototype Opportunities',
      compensationContext: 'Advertised: ₹18–32 LPA',
    },
    {
      id: 'rec-4',
      activity: 'PostgreSQL Advanced Indexing & EXPLAIN Profiling',
      relatedSkill: 'SQL',
      skillGap: 'Level 5/10 → 8/10 (Gap: 3)',
      targetRole,
      whyItMatters: 'Crucial for optimizing high-throughput database latency and tuning execution plans.',
      estimatedEffort: '8 Hours',
      format: 'Tutorial + SQL Exercises',
      priority: 'Medium',
      nextAction: 'Practice Query Profiling',
      pathId: 'path-backend-foundations',
      opportunityPresence: '15 Prototype Opportunities',
      compensationContext: 'Advertised: ₹10–20 LPA',
    },
  ];
};

/**
 * Generates individual learning insights.
 */
export const generateLearningInsights = () => {
  return [...prototypeLearningInsights];
};

/**
 * Calculates learning readiness summary metrics.
 */
export const calculateLearningReadiness = (paths = initialLearningPaths, projects = initialLearningProjects, validation = initialValidationActivities) => {
  const overallProgress = calculateLearningProgress(paths);
  const totalModules = paths.reduce((acc, p) => acc + (p.modulesCount || p.modules?.length || 0), 0);
  const completedModules = paths.reduce((acc, p) => acc + (p.completedModules || (p.modules?.filter(m => m.status === 'Completed').length) || 0), 0);
  const completedValidation = validation.filter(v => v.status === 'Completed').length;

  return {
    overallProgress,
    prioritySkillsCount: 4,
    activePathsCount: paths.filter(p => p.progressPct > 0 && p.progressPct < 100).length || 3,
    totalModules,
    completedModules,
    projectsLinkedCount: projects.length,
    validationActivitiesCount: validation.length,
    completedValidationCount: completedValidation,
    targetRoleAlignment: 78,
  };
};

/**
 * LocalStorage Persistence for Learning State
 */
export const getStoredLearningState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEARNING);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to read learning localStorage state:', e);
    return null;
  }
};

export const saveStoredLearningState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY_LEARNING, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save learning localStorage state:', e);
  }
};

export const loadLearningState = () => {
  const stored = getStoredLearningState();
  if (stored) return stored;
  return {
    paths: initialLearningPaths,
    catalog: initialLearningCatalog,
    projects: initialLearningProjects,
    validation: initialValidationActivities,
    activePathId: 'path-backend-foundations',
  };
};

export const saveLearningState = (state) => saveStoredLearningState(state);

/**
 * LocalStorage Persistence for Saved Learning Resources
 */
export const getStoredSavedLearning = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_LEARNING);
    return raw ? JSON.parse(raw) : ['res-spring-microservices', 'res-aws-solutions-architect', 'res-system-design-case-studies', 'res-rag-vector-search-guide'];
  } catch (e) {
    console.warn('Failed to read saved learning localStorage:', e);
    return [];
  }
};

export const saveStoredSavedLearning = (savedIds) => {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_LEARNING, JSON.stringify(savedIds));
  } catch (e) {
    console.warn('Failed to save saved learning localStorage:', e);
  }
};

export const toggleSaveLearningResource = (resourceId) => {
  const current = getStoredSavedLearning();
  let updated;
  if (current.includes(resourceId)) {
    updated = current.filter(id => id !== resourceId);
  } else {
    updated = [...current, resourceId];
  }
  saveStoredSavedLearning(updated);
  return updated;
};
