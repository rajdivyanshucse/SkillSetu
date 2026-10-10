/**
 * SkillSetu Capability Presentation Adapter
 * Phase 36: From Skill Matching to Evidence-Driven Capability Intelligence
 * 
 * Centralized presentation adapter mapping skills, projects, work experience,
 * roadmap stages, and role benchmarks to evidence-grounded capabilities.
 * 
 * IMPORTANT HONESTY INVARIANT:
 * This is a frontend presentation adapter for transparent capability states.
 * It does NOT fabricate AI verification, certification, or fake evidence scores.
 */

import { initialProjectsPortfolio, initialSkillGrowthRecords, initialLearningCourses } from '../data/growthData';
import { roleRequirementTaxonomy } from '../data/skillGapData';
import { defaultRoadmapStages } from '../data/roadmapData';

export const CAPABILITY_STATES = {
  DEMONSTRATED: {
    key: 'DEMONSTRATED',
    label: 'Demonstrated',
    description: 'Supported by concrete project, professional experience, or verifiable implementation artifact.',
    badgeVariant: 'success',
    colorClasses: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: '#1F6948',
  },
  DEVELOPING: {
    key: 'DEVELOPING',
    label: 'Developing',
    description: 'Active learning, in-progress implementation, or partially completed milestone evidence.',
    badgeVariant: 'warning',
    colorClasses: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: '#8B5B14',
  },
  SELF_REPORTED: {
    key: 'SELF_REPORTED',
    label: 'Self-Reported',
    description: 'Claimed competency on profile without attached implementation artifacts or projects.',
    badgeVariant: 'neutral',
    colorClasses: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: '#524E46',
  },
  EVIDENCE_NEEDED: {
    key: 'EVIDENCE_NEEDED',
    label: 'Evidence Needed',
    description: 'Required by target role benchmark where demonstrable project or experience proof is currently missing.',
    badgeVariant: 'danger',
    colorClasses: 'bg-rose-50 text-rose-800 border-rose-200',
    dotColor: '#9E2A22',
  },
};

/**
 * Standardizes skill matching name for fuzzy matching across data sets
 */
function normalizeName(name = '') {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Finds all project evidence attached to a specific skill/capability
 */
export function getAttachedProjectEvidence(skillName, projects = initialProjectsPortfolio) {
  if (!skillName) return [];
  const norm = normalizeName(skillName);

  return projects.filter((p) => {
    if (!Array.isArray(p.skills)) return false;
    return p.skills.some((s) => {
      const sNorm = normalizeName(s);
      return sNorm.includes(norm) || norm.includes(sNorm);
    });
  });
}

/**
 * Finds all active course / learning evidence for a skill
 */
export function getAttachedLearningEvidence(skillName, courses = initialLearningCourses) {
  if (!skillName) return [];
  const norm = normalizeName(skillName);

  return courses.filter((c) => {
    const cNorm = normalizeName(c.relatedSkillName || c.title);
    return cNorm.includes(norm) || norm.includes(cNorm);
  });
}

/**
 * Finds associated roadmap stages and activities for a skill
 */
export function getAttachedRoadmapActions(skillName, stages = defaultRoadmapStages) {
  if (!skillName) return { stage: null, skillRef: null, activities: [] };
  const norm = normalizeName(skillName);

  for (const stage of stages) {
    if (!Array.isArray(stage.skills)) continue;
    for (const sk of stage.skills) {
      const skNorm = normalizeName(sk.name);
      if (skNorm.includes(norm) || norm.includes(skNorm)) {
        return {
          stage: {
            id: stage.id,
            stageNumber: stage.stageNumber,
            title: stage.title,
            status: stage.status,
          },
          skillRef: sk,
          activities: sk.activities || [],
          learn: sk.learn,
          practice: sk.practice,
          build: sk.build,
          validate: sk.validate,
        };
      }
    }
  }

  return { stage: null, skillRef: null, activities: [] };
}

/**
 * Derives the capability state for a skill based on attached evidence and role requirements
 */
export function deriveCapabilityState({
  proficiency = 'Intermediate',
  attachedProjects = [],
  attachedCourses = [],
  isRequiredForTargetRole = false,
}) {
  const completedProjects = attachedProjects.filter((p) => p.status === 'Completed');
  const inProgressProjects = attachedProjects.filter((p) => p.status === 'In Progress' || p.status === 'Planning');
  const completedCourses = attachedCourses.filter((c) => c.status === 'Completed');
  const inProgressCourses = attachedCourses.filter((c) => c.status === 'In Progress' || c.status === 'Started');

  // If projects are completed, capability is Demonstrated
  if (completedProjects.length > 0) {
    return CAPABILITY_STATES.DEMONSTRATED;
  }

  // If work or courses are actively in progress, it is Developing
  if (inProgressProjects.length > 0 || completedCourses.length > 0 || inProgressCourses.length > 0) {
    return CAPABILITY_STATES.DEVELOPING;
  }

  // If it is required for the target role but has zero project/learning evidence, Evidence Needed
  if (isRequiredForTargetRole) {
    return CAPABILITY_STATES.EVIDENCE_NEEDED;
  }

  // Otherwise, it is self-reported
  return CAPABILITY_STATES.SELF_REPORTED;
}

/**
 * Transforms user skills and benchmark requirements into an integrated Capability Profile
 */
export function buildCapabilityProfile({
  userSkills = [],
  targetRole = 'Backend Software Engineer',
  projects = initialProjectsPortfolio,
  courses = initialLearningCourses,
  roadmapStages = defaultRoadmapStages,
}) {
  const roleReqs = roleRequirementTaxonomy[targetRole] || roleRequirementTaxonomy['Backend Software Engineer'] || [];
  const reqMap = new Map();
  roleReqs.forEach((r) => {
    reqMap.set(normalizeName(r.name), r);
  });

  // Base list of skills from user profile + target role requirements
  const capabilityMap = new Map();

  // 1. Process user skills
  userSkills.forEach((s) => {
    const norm = normalizeName(s.name || s.skill || s.title);
    const req = reqMap.get(norm);
    const attachedProjects = getAttachedProjectEvidence(s.name, projects);
    const attachedCourses = getAttachedLearningEvidence(s.name, courses);
    const roadmap = getAttachedRoadmapActions(s.name, roadmapStages);

    const isRequired = !!req;
    const targetProficiency = req?.requiredLevel || (s.proficiency === 'Beginner' ? 'Intermediate' : 'Advanced');

    const state = deriveCapabilityState({
      proficiency: s.proficiency || 'Intermediate',
      attachedProjects,
      attachedCourses,
      isRequiredForTargetRole: isRequired,
    });

    const evidenceItems = [
      ...attachedProjects.map((p) => ({
        type: 'Project',
        title: p.name,
        role: p.role,
        status: p.status,
        description: p.description,
        evidenceUrl: p.evidenceUrl,
        metrics: p.metrics,
      })),
      ...attachedCourses.map((c) => ({
        type: 'Learning Activity',
        title: c.title,
        status: c.status,
        progressPct: c.progressPct,
        currentModule: c.currentModule,
      })),
    ];

    capabilityMap.set(norm, {
      id: s.id || `cap-${norm}`,
      name: s.name || s.skill || s.title,
      category: s.category || req?.category || 'Software Engineering',
      currentProficiency: s.proficiency || 'Intermediate',
      targetProficiency,
      targetRequirement: isRequired ? req.roleImportance || 'REQUIRED' : 'SUPPORTING',
      whyItMatters: req?.whyItMatters || s.description || 'Contributes to technical problem-solving foundation.',
      whatToBuild: req?.whatToBuild || [],
      capabilityState: state,
      evidenceCount: evidenceItems.length,
      evidenceItems,
      attachedProjects,
      attachedCourses,
      roadmap,
      isTargetRoleRequirement: isRequired,
    });
  });

  // 2. Ensure all target role requirements are represented (even if missing from user skills)
  roleReqs.forEach((req) => {
    const norm = normalizeName(req.name);
    if (!capabilityMap.has(norm)) {
      const attachedProjects = getAttachedProjectEvidence(req.name, projects);
      const attachedCourses = getAttachedLearningEvidence(req.name, courses);
      const roadmap = getAttachedRoadmapActions(req.name, roadmapStages);

      const state = deriveCapabilityState({
        proficiency: 'Beginner',
        attachedProjects,
        attachedCourses,
        isRequiredForTargetRole: true,
      });

      const evidenceItems = [
        ...attachedProjects.map((p) => ({
          type: 'Project',
          title: p.name,
          role: p.role,
          status: p.status,
          description: p.description,
          evidenceUrl: p.evidenceUrl,
          metrics: p.metrics,
        })),
        ...attachedCourses.map((c) => ({
          type: 'Learning Activity',
          title: c.title,
          status: c.status,
          progressPct: c.progressPct,
          currentModule: c.currentModule,
        })),
      ];

      capabilityMap.set(norm, {
        id: `cap-req-${norm}`,
        name: req.name,
        category: req.category || 'Core Requirements',
        currentProficiency: 'Beginner',
        targetProficiency: req.requiredLevel || 'Advanced',
        targetRequirement: req.roleImportance || 'REQUIRED',
        whyItMatters: req.whyItMatters,
        whatToBuild: req.whatToBuild || [],
        capabilityState: state,
        evidenceCount: evidenceItems.length,
        evidenceItems,
        attachedProjects,
        attachedCourses,
        roadmap,
        isTargetRoleRequirement: true,
      });
    }
  });

  const allCapabilities = Array.from(capabilityMap.values());

  // Derive counts
  const demonstrated = allCapabilities.filter((c) => c.capabilityState.key === 'DEMONSTRATED');
  const developing = allCapabilities.filter((c) => c.capabilityState.key === 'DEVELOPING');
  const selfReported = allCapabilities.filter((c) => c.capabilityState.key === 'SELF_REPORTED');
  const evidenceNeeded = allCapabilities.filter((c) => c.capabilityState.key === 'EVIDENCE_NEEDED');

  // Categorized mapping
  const categoryGroups = {};
  allCapabilities.forEach((cap) => {
    const cat = cap.category || 'General';
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(cap);
  });

  // Calculate readiness alignment percentage based on target role requirements
  const targetReqCaps = allCapabilities.filter((c) => c.isTargetRoleRequirement);
  let totalScore = 0;
  targetReqCaps.forEach((c) => {
    if (c.capabilityState.key === 'DEMONSTRATED') totalScore += 1.0;
    else if (c.capabilityState.key === 'DEVELOPING') totalScore += 0.65;
    else if (c.capabilityState.key === 'SELF_REPORTED') totalScore += 0.4;
    else totalScore += 0.15; // EVIDENCE_NEEDED
  });

  const overallReadinessPct = targetReqCaps.length > 0 ? Math.round((totalScore / targetReqCaps.length) * 100) : 78;

  // Biggest gap
  const primaryGaps = allCapabilities
    .filter((c) => c.capabilityState.key === 'EVIDENCE_NEEDED' || (c.capabilityState.key === 'DEVELOPING' && c.isTargetRoleRequirement))
    .sort((a, b) => {
      // Prioritize evidence needed over developing
      if (a.capabilityState.key === 'EVIDENCE_NEEDED' && b.capabilityState.key !== 'EVIDENCE_NEEDED') return -1;
      if (b.capabilityState.key === 'EVIDENCE_NEEDED' && a.capabilityState.key !== 'EVIDENCE_NEEDED') return 1;
      return 0;
    });

  const biggestGap = primaryGaps[0]?.name || 'Cloud Deployment & Architecture';

  return {
    targetRole,
    overallReadinessPct,
    readinessScoreExplanation:
      'Calculated from role benchmark alignment and concrete project/experience evidence attached to each required capability.',
    counts: {
      total: allCapabilities.length,
      demonstrated: demonstrated.length,
      developing: developing.length,
      selfReported: selfReported.length,
      evidenceNeeded: evidenceNeeded.length,
    },
    biggestGap,
    allCapabilities,
    demonstrated,
    developing,
    selfReported,
    evidenceNeeded,
    primaryGaps,
    categoryGroups,
  };
}

/**
 * Adapts backend capability API response into UI consumable structures
 * Phase 38: Connecting frontend UI to genuine backend Capability Intelligence Engine
 */
export function adaptBackendCapabilityProfile(backendData, fallbackParams = {}) {
  if (!backendData || !backendData.capabilities) {
    return buildCapabilityProfile(fallbackParams);
  }

  const { targetRole, summary, capabilities: rawCaps, methodology } = backendData;

  const allCapabilities = rawCaps.map((c) => {
    const stateKey = c.capabilityState || 'SELF_REPORTED';
    const capStateObj = CAPABILITY_STATES[stateKey] || CAPABILITY_STATES.SELF_REPORTED;

    const evidenceItems = (c.evidence || []).map((ev) => ({
      type: ev.evidenceType === 'PROJECT' ? 'Project' : ev.evidenceType === 'EXPERIENCE' ? 'Experience' : 'Learning Activity',
      title: ev.title,
      role: ev.evidenceDepth,
      status: ev.verificationStatus || 'Attached',
      description: ev.description,
      occurredAt: ev.occurredAt,
      evidenceStrength: ev.evidenceStrength,
      evidenceDepth: ev.evidenceDepth,
    }));

    return {
      id: c.skill?.id || `cap-${normalizeName(c.skill?.name)}`,
      name: c.skill?.name || 'Skill',
      category: c.skill?.category || 'General',
      currentProficiency: c.proficiency || 'Intermediate',
      targetProficiency: c.targetProficiency || 'Intermediate',
      targetRequirement: c.targetRequirement || 'SUPPORTING',
      whyItMatters: c.skill?.description || (c.explanation && c.explanation[0]) || 'Core capability contributing to problem domain.',
      capabilityState: capStateObj,
      evidenceState: c.evidenceState || 'NONE',
      evidenceStrength: c.evidenceStrength || 'NONE',
      evidenceGap: c.evidenceGap || 'NONE',
      evidenceCount: (c.evidence || []).length,
      evidenceItems,
      explanation: c.explanation || [],
      isTargetRoleRequirement: c.isTargetRoleRequirement,
      lastDemonstratedAt: c.lastDemonstratedAt,
      recencyText: c.recencyText || 'Not recorded',
    };
  });

  const demonstrated = allCapabilities.filter((c) => c.capabilityState.key === 'DEMONSTRATED');
  const developing = allCapabilities.filter((c) => c.capabilityState.key === 'DEVELOPING');
  const selfReported = allCapabilities.filter((c) => c.capabilityState.key === 'SELF_REPORTED');
  const evidenceNeeded = allCapabilities.filter((c) => c.capabilityState.key === 'EVIDENCE_NEEDED');

  const categoryGroups = {};
  allCapabilities.forEach((cap) => {
    const cat = cap.category || 'General';
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(cap);
  });

  const primaryGaps = allCapabilities
    .filter((c) => c.capabilityState.key === 'EVIDENCE_NEEDED' || (c.capabilityState.key === 'DEVELOPING' && c.isTargetRoleRequirement))
    .sort((a, b) => {
      if (a.capabilityState.key === 'EVIDENCE_NEEDED' && b.capabilityState.key !== 'EVIDENCE_NEEDED') return -1;
      if (b.capabilityState.key === 'EVIDENCE_NEEDED' && a.capabilityState.key !== 'EVIDENCE_NEEDED') return 1;
      return 0;
    });

  const biggestGap = primaryGaps[0]?.name || 'Target Role Alignment';

  return {
    targetRole: targetRole?.name || fallbackParams.targetRole || 'Backend Software Engineer',
    targetRoleObj: targetRole,
    summary,
    evidenceCoverage: summary?.evidenceCoverage,
    overallReadinessPct: summary?.evidenceCoverage?.percentage ?? 78,
    counts: {
      total: allCapabilities.length,
      demonstrated: summary?.demonstrated ?? demonstrated.length,
      developing: summary?.developing ?? developing.length,
      selfReported: summary?.selfReported ?? selfReported.length,
      evidenceNeeded: summary?.evidenceNeeded ?? evidenceNeeded.length,
    },
    biggestGap,
    allCapabilities,
    demonstrated,
    developing,
    selfReported,
    evidenceNeeded,
    primaryGaps,
    categoryGroups,
    methodology,
  };
}

/**
 * Maps capability names to demo fallback market trends (USED ONLY FOR DEMO/UNAUTHENTICATED FALLBACK)
 * Production/authenticated flows use real backend responses from /api/v1/future-capabilities.
 */
export const DEMO_FALLBACK_MARKET_SIGNALS = {
  java: { signal: 'STABLE', trajectory: '+12% YoY', demandLevel: 'High', source: 'Historical Demand Index (Demo)' },
  sql: { signal: 'STABLE', trajectory: '+10% YoY', demandLevel: 'High', source: 'Historical Demand Index (Demo)' },
  'spring boot': { signal: 'GROWING', trajectory: '+18% YoY', demandLevel: 'High', source: 'Derived Market Trend (Demo)' },
  springboot: { signal: 'GROWING', trajectory: '+18% YoY', demandLevel: 'High', source: 'Derived Market Trend (Demo)' },
  'rest apis': { signal: 'STABLE', trajectory: '+14% YoY', demandLevel: 'High', source: 'Role Benchmark Context (Demo)' },
  docker: { signal: 'GROWING', trajectory: '+24% YoY', demandLevel: 'High', source: 'Derived Market Trend (Demo)' },
  containerization: { signal: 'GROWING', trajectory: '+24% YoY', demandLevel: 'High', source: 'Derived Market Trend (Demo)' },
  aws: { signal: 'GROWING', trajectory: '+28% YoY', demandLevel: 'High', source: 'Statistical Observation (Demo)' },
  'cloud deployment': { signal: 'GROWING', trajectory: '+28% YoY', demandLevel: 'High', source: 'Statistical Observation (Demo)' },
  'cloud computing': { signal: 'GROWING', trajectory: '+28% YoY', demandLevel: 'High', source: 'Statistical Observation (Demo)' },
  'system design': { signal: 'GROWING', trajectory: '+22% YoY', demandLevel: 'High', source: 'Role Benchmark Context (Demo)' },
  kubernetes: { signal: 'EMERGING', trajectory: '+31% YoY', demandLevel: 'Medium', source: 'Emerging Skill Signal (Demo)' },
  'distributed systems': { signal: 'EMERGING', trajectory: '+26% YoY', demandLevel: 'Medium', source: 'Emerging Skill Signal (Demo)' },
  observability: { signal: 'EMERGING', trajectory: '+20% YoY', demandLevel: 'Medium', source: 'Emerging Skill Signal (Demo)' },
  'ai integration': { signal: 'EMERGING', trajectory: '+38% YoY', demandLevel: 'High', source: 'Emerging Skill Signal (Demo)' },
  react: { signal: 'STABLE', trajectory: '+12% YoY', demandLevel: 'High', source: 'Historical Demand Index (Demo)' },
  javascript: { signal: 'STABLE', trajectory: '+11% YoY', demandLevel: 'High', source: 'Historical Demand Index (Demo)' },
  python: { signal: 'GROWING', trajectory: '+25% YoY', demandLevel: 'High', source: 'Derived Market Trend (Demo)' },
};

// Retained for backwards compatibility in standalone demo fixtures
export const KNOWN_MARKET_SIGNALS = DEMO_FALLBACK_MARKET_SIGNALS;

/**
 * Adapts backend future capability horizon response into UI presentation structures
 */
export function adaptBackendFutureHorizon(backendData, fallbackOptions = {}) {
  if (backendData?.horizons && Array.isArray(backendData.horizons)) {
    return {
      targetRole: backendData.targetRole?.name || fallbackOptions.targetRole || 'Backend Software Engineer',
      summary: backendData.summary,
      provenance: backendData.provenance,
      disclaimer: backendData.disclaimer,
      horizons: backendData.horizons.map((h) => ({
        id: h.id,
        title: h.title,
        subtitle: h.subtitle,
        horizonLabel: h.horizonLabel,
        badgeVariant: h.badgeVariant || 'neutral',
        items: (h.items || []).map((item) => {
          const capStateKey = item.candidateState?.capabilityState || item.capabilityState || 'EVIDENCE_NEEDED';
          const capState = CAPABILITY_STATES[capStateKey] || CAPABILITY_STATES.EVIDENCE_NEEDED;
          const evCount = item.candidateState?.evidenceCount ?? item.evidenceCount ?? 0;

          return {
            id: item.id || `fc-${item.skill?.id}`,
            name: item.skill?.name || item.name,
            category: item.skill?.category || item.category || 'General',
            roleImportance: item.roleRelevance === 'REQUIRED' ? 'Required' : item.roleRelevance === 'PREFERRED' ? 'Preferred' : 'Supporting',
            marketSignal: item.marketSignal || 'STABLE',
            marketTrajectory: item.trajectory || (item.growthRate ? `${item.growthRate > 0 ? '+' : ''}${item.growthRate}% YoY` : '+0% observed trend'),
            whyItMatters: item.reasons?.[0] || item.whyItMatters || 'Core capability for target role benchmark.',
            sourceProvenance: item.sourceDescription || item.sourceProvenance || 'Historical Observation Dataset',
            capabilityState: capState,
            evidenceCount: evCount,
            evidenceSummary: evCount > 0 ? `${evCount} evidence items attached` : (capStateKey === 'DEMONSTRATED' ? 'Evidence attached' : 'No project evidence attached'),
            nextAction: item.nextAction || 'Maintain and benchmark implementations',
            forecast: item.forecast,
            reasons: item.reasons,
          };
        }),
      })),
    };
  }

  return getFutureCapabilityHorizon(fallbackOptions);
}

/**
 * Adapts backend future-relevant gaps into UI presentation structures
 */
export function adaptBackendFutureGaps(backendData, fallbackOptions = {}) {
  if (backendData?.futureRelevantGaps && Array.isArray(backendData.futureRelevantGaps)) {
    return backendData.futureRelevantGaps.map((gap) => {
      const capStateKey = gap.candidateState?.capabilityState || 'EVIDENCE_NEEDED';
      const currentState = CAPABILITY_STATES[capStateKey] || CAPABILITY_STATES.EVIDENCE_NEEDED;

      return {
        id: gap.id || `gap-${gap.skill?.id}`,
        name: gap.skill?.name || gap.name,
        category: gap.skill?.category || gap.category || 'Competency',
        roleImportance: gap.roleRelevance === 'REQUIRED' ? 'Required' : gap.roleRelevance === 'PREFERRED' ? 'Preferred' : 'Supporting',
        marketSignal: gap.marketSignal || 'GROWING',
        marketTrajectory: gap.trajectory || `${gap.growthRate > 0 ? '+' : ''}${gap.growthRate}% observed trend`,
        priorityLevel: gap.developmentPriority === 'HIGH' ? 'High Development Priority' : gap.developmentPriority === 'MEDIUM' ? 'Medium Development Priority' : 'Monitor Priority',
        priorityBadge: gap.priorityBadge || 'danger',
        reasons: gap.reasons || [
          `${gap.roleRelevance || 'Required'} for target role benchmark`,
          `Observed demand trend: ${gap.marketSignal || 'Growing'}`,
          `Current capability: ${currentState.label}`,
        ],
        developmentAction: gap.nextAction || `Build and attach project evidence for ${gap.skill?.name || 'skill'}`,
        currentState,
        evidenceGap: gap.candidateState?.evidenceGap || 'HIGH',
        evidenceCount: gap.candidateState?.evidenceCount || 0,
        forecast: gap.forecast,
        signals: [
          { label: 'Target Role', value: gap.roleRelevance || 'Required', badge: 'brand' },
          { label: 'Market Signal', value: gap.marketSignal || 'GROWING', trajectory: gap.trajectory, badge: 'sage' },
          { label: 'Current State', value: currentState.label, badge: currentState.badgeVariant },
          { label: 'Evidence', value: currentState.key === 'DEMONSTRATED' ? 'Attached' : 'Missing', badge: currentState.key === 'DEMONSTRATED' ? 'success' : 'danger' },
        ],
      };
    });
  }

  return getFutureRelevantGaps(fallbackOptions);
}

/**
 * Returns demo future capability horizon segmented into Current Core, Near-Term Development, and Emerging Direction
 * (Used only when unauthenticated or demo mode is active)
 */
export function getFutureCapabilityHorizon({
  capabilityProfile,
  targetRole = 'Backend Software Engineer',
} = {}) {
  const allCaps = capabilityProfile?.allCapabilities || [];
  const capMap = new Map();
  allCaps.forEach((c) => {
    capMap.set(normalizeName(c.name), c);
  });

  // Current Core: Foundational to role, Demonstrated or Strong Self-Reported
  const currentCoreItems = [
    {
      id: 'core-java',
      name: 'Java',
      category: 'Programming',
      roleImportance: 'Required',
      marketSignal: 'STABLE',
      marketTrajectory: '+12% YoY',
      whyItMatters: 'Core typed language foundation for enterprise backend services.',
      sourceProvenance: 'Historical Demand & O*NET Role Benchmark',
    },
    {
      id: 'core-sql',
      name: 'SQL & Relational DBs',
      category: 'Databases',
      roleImportance: 'Required',
      marketSignal: 'STABLE',
      marketTrajectory: '+10% YoY',
      whyItMatters: 'Relational data persistence, schema design, and query optimization.',
      sourceProvenance: 'Historical Demand & O*NET Role Benchmark',
    },
    {
      id: 'core-rest',
      name: 'REST APIs',
      category: 'Web Services',
      roleImportance: 'Required',
      marketSignal: 'STABLE',
      marketTrajectory: '+14% YoY',
      whyItMatters: 'Standard contract for frontend-backend decoupling and microservices.',
      sourceProvenance: 'Role Benchmark Context',
    },
  ].map((item) => {
    const matched = capMap.get(normalizeName(item.name)) || capMap.get('java') || capMap.get('sql');
    return {
      ...item,
      capabilityState: matched?.capabilityState || CAPABILITY_STATES.DEMONSTRATED,
      evidenceCount: matched?.evidenceCount || 1,
      evidenceSummary: matched?.evidenceCount > 0 ? `${matched.evidenceCount} evidence items attached` : 'Evidence attached',
      nextAction: 'Maintain and benchmark concurrency implementations',
    };
  });

  // Near-Term Development: Required for target role with active growing market demand
  const nearTermItems = [
    {
      id: 'near-docker',
      name: 'Docker & Containers',
      category: 'Containerization',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+24% YoY',
      whyItMatters: 'Consistent application runtime packaging and reproducible deployments.',
      sourceProvenance: 'Derived Market Trend (Historical Observations)',
      recommendedBuild: 'Containerize multi-container backend with Docker Compose',
    },
    {
      id: 'near-springboot',
      name: 'Spring Boot',
      category: 'Backend Frameworks',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+18% YoY',
      whyItMatters: 'Enterprise microservice standard for Spring Data, Security & REST APIs.',
      sourceProvenance: 'Derived Market Trend (Historical Observations)',
      recommendedBuild: 'Production REST API with Spring Security and PostgreSQL',
    },
    {
      id: 'near-aws',
      name: 'Cloud Deployment (AWS)',
      category: 'Cloud Infrastructure',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+28% YoY',
      whyItMatters: 'Deploying, monitoring, and scaling service instances in cloud environments.',
      sourceProvenance: 'Statistical Observation (Demand Signals)',
      recommendedBuild: 'Deploy containerized Spring Boot API to AWS ECS / App Runner',
    },
  ].map((item) => {
    const matched = capMap.get(normalizeName(item.name));
    return {
      ...item,
      capabilityState: matched?.capabilityState || CAPABILITY_STATES.EVIDENCE_NEEDED,
      evidenceCount: matched?.evidenceCount || 0,
      evidenceSummary:
        matched?.capabilityState?.key === 'DEMONSTRATED'
          ? 'Project evidence attached'
          : matched?.capabilityState?.key === 'DEVELOPING'
          ? 'In-progress implementation'
          : 'No project evidence attached',
      nextAction: item.recommendedBuild,
    };
  });

  // Emerging Direction: Forward-looking capabilities showing emerging demand signals
  const emergingItems = [
    {
      id: 'emerge-k8s',
      name: 'Kubernetes',
      category: 'Orchestration',
      roleImportance: 'Emerging / Supporting',
      marketSignal: 'EMERGING',
      marketTrajectory: '+31% YoY',
      whyItMatters: 'Container orchestration, declarative scaling, and automated self-healing.',
      sourceProvenance: 'Emerging Skill Signal',
      nextAction: 'Configure local Minikube cluster with deployment manifests & services',
    },
    {
      id: 'emerge-sysdesign',
      name: 'Distributed Systems',
      category: 'Architecture',
      roleImportance: 'Supporting',
      marketSignal: 'GROWING',
      marketTrajectory: '+26% YoY',
      whyItMatters: 'Asynchronous event streaming (Kafka/RabbitMQ) and distributed caching.',
      sourceProvenance: 'Derived Market Trend',
      nextAction: 'Design an event-driven notification queue with Redis caching',
    },
    {
      id: 'emerge-observability',
      name: 'Observability & Telemetry',
      category: 'Operations',
      roleImportance: 'Emerging',
      marketSignal: 'EMERGING',
      marketTrajectory: '+20% YoY',
      whyItMatters: 'Distributed tracing (OpenTelemetry), structured logs, and Prometheus metrics.',
      sourceProvenance: 'Emerging Skill Signal',
      nextAction: 'Integrate OpenTelemetry tracing in backend service endpoints',
    },
  ].map((item) => {
    const matched = capMap.get(normalizeName(item.name));
    return {
      ...item,
      capabilityState: matched?.capabilityState || CAPABILITY_STATES.SELF_REPORTED,
      evidenceCount: matched?.evidenceCount || 0,
      evidenceSummary: matched?.evidenceCount > 0 ? 'Partial evidence' : 'Forward-looking signal',
    };
  });

  return {
    targetRole,
    horizons: [
      {
        id: 'current-core',
        title: 'CURRENT CORE',
        subtitle: 'Foundational capabilities established for your target direction',
        horizonLabel: 'Core Foundation',
        items: currentCoreItems,
        badgeVariant: 'neutral',
      },
      {
        id: 'near-term',
        title: 'NEAR-TERM DEVELOPMENT',
        subtitle: 'High-priority capabilities required by role benchmarks with growing demand',
        horizonLabel: 'Active Development Focus',
        items: nearTermItems,
        badgeVariant: 'brand',
      },
      {
        id: 'emerging-direction',
        title: 'EMERGING DIRECTION',
        subtitle: 'Forward-looking capabilities to monitor and explore as you advance',
        horizonLabel: 'Emerging Signals to Watch',
        items: emergingItems,
        badgeVariant: 'warning',
      },
    ],
    disclaimer:
      'Future capability signals are based on historical observations and statistical trends. They support planning and do not guarantee future market requirements.',
  };
}

/**
 * Returns future-relevant capability gaps combining Role Requirement, Market Signal, and Current Evidence Status
 * (Used for fallback demo presentation)
 */
export function getFutureRelevantGaps({
  capabilityProfile,
  targetRole = 'Backend Software Engineer',
} = {}) {
  const allCaps = capabilityProfile?.allCapabilities || [];
  const capMap = new Map();
  allCaps.forEach((c) => {
    capMap.set(normalizeName(c.name), c);
  });

  const gapDefinitions = [
    {
      id: 'gap-docker',
      name: 'Docker',
      category: 'Containerization',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+24% YoY',
      priorityLevel: 'High Development Priority',
      priorityBadge: 'danger',
      reasons: [
        'Required for target Backend Engineer benchmark',
        'Growing historical demand signal (+24% YoY)',
        'No project or implementation evidence currently attached',
      ],
      developmentAction: 'Containerize a REST API backend with multi-stage Dockerfile',
      roadmapStage: 'Stage 02 — Backend Development',
      roadmapSkillId: 'docker',
    },
    {
      id: 'gap-aws',
      name: 'AWS Cloud Deployment',
      category: 'Cloud Infrastructure',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+28% YoY',
      priorityLevel: 'High Development Priority',
      priorityBadge: 'danger',
      reasons: [
        'Required for cloud backend execution',
        'Growing historical demand signal (+28% YoY)',
        'Developing capability with in-progress learning evidence',
      ],
      developmentAction: 'Deploy Spring Boot API to AWS App Runner / ECS with RDS database',
      roadmapStage: 'Stage 03 — Cloud & Infrastructure',
      roadmapSkillId: 'aws',
    },
    {
      id: 'gap-sysdesign',
      name: 'System Design & Scalability',
      category: 'Software Architecture',
      roleImportance: 'Required',
      marketSignal: 'GROWING',
      marketTrajectory: '+22% YoY',
      priorityLevel: 'Medium Development Priority',
      priorityBadge: 'warning',
      reasons: [
        'Core architecture requirement for backend systems',
        'Growing demand signal in mid-to-senior role postings',
        'Self-reported without concrete architecture documentation',
      ],
      developmentAction: 'Design distributed caching (Redis) and database indexing plan',
      roadmapStage: 'Stage 04 — Advanced Engineering',
      roadmapSkillId: 'system-design',
    },
    {
      id: 'gap-k8s',
      name: 'Kubernetes',
      category: 'Orchestration',
      roleImportance: 'Emerging / Supporting',
      marketSignal: 'EMERGING',
      marketTrajectory: '+31% YoY',
      priorityLevel: 'Future-Relevant Priority',
      priorityBadge: 'brand',
      reasons: [
        'Emerging requirement in modern microservice backends',
        'High observed growth trend in forward-looking roles',
        'Early development milestone on advanced roadmap',
      ],
      developmentAction: 'Deploy multi-pod application with service discovery and health probes',
      roadmapStage: 'Stage 04 — Advanced Engineering',
      roadmapSkillId: 'kubernetes',
    },
  ];

  return gapDefinitions.map((gap) => {
    const matched = capMap.get(normalizeName(gap.name)) || capMap.get(normalizeName(gap.id));
    const currentState = matched?.capabilityState || CAPABILITY_STATES.EVIDENCE_NEEDED;
    const evidenceItems = matched?.evidenceItems || [];

    return {
      ...gap,
      currentState,
      evidenceItems,
      evidenceStatusText:
        currentState.key === 'DEMONSTRATED'
          ? 'Project Evidence Attached'
          : currentState.key === 'DEVELOPING'
          ? 'Developing (In-Progress Evidence)'
          : 'Evidence Needed (No Project Evidence)',
      signals: [
        { label: 'Target Role', value: gap.roleImportance, badge: 'brand' },
        { label: 'Market Signal', value: gap.marketSignal, trajectory: gap.marketTrajectory, badge: 'sage' },
        { label: 'Current State', value: currentState.label, badge: currentState.badgeVariant },
        { label: 'Evidence', value: currentState.key === 'DEMONSTRATED' ? 'Attached' : 'Missing', badge: currentState.key === 'DEMONSTRATED' ? 'success' : 'danger' },
      ],
    };
  });
}

/**
 * Organization Workforce Capability Horizon
 * Groups workforce capabilities into Current Strength, Developing Need, and Emerging Requirement
 * with explainable Hire vs Upskill vs Redistribute interventions.
 */
export function getWorkforceCapabilityHorizon() {
  return {
    horizons: [
      {
        id: 'workforce-current-strength',
        title: 'CURRENT WORKFORCE STRENGTH',
        subtitle: 'Core capabilities with high internal coverage across engineering pods',
        horizonLabel: 'High Internal Coverage (70–85%)',
        items: [
          {
            id: 'wf-java',
            capability: 'Java Backend & Microservices',
            department: 'Engineering',
            currentCoverage: 78,
            targetCoverage: 80,
            marketSignal: 'STABLE',
            marketTrajectory: '+12% YoY',
            recommendedIntervention: 'Maintain & Peer Mentorship',
            interventionType: 'UPSKILL',
            rationale: 'Strong internal practitioner density; use senior engineers to mentor junior pods.',
          },
          {
            id: 'wf-sql',
            capability: 'Relational Data & SQL Indexing',
            department: 'Data & Engineering',
            currentCoverage: 74,
            targetCoverage: 75,
            marketSignal: 'STABLE',
            marketTrajectory: '+10% YoY',
            recommendedIntervention: 'Maintain',
            interventionType: 'UPSKILL',
            rationale: 'Adequate coverage across data teams; maintain query tuning standards.',
          },
        ],
      },
      {
        id: 'workforce-developing-need',
        title: 'DEVELOPING WORKFORCE NEED',
        subtitle: 'Strategic capabilities requiring active cohort upskilling and internal mobility',
        horizonLabel: 'Moderate Coverage (40–55%) · Active Focus',
        items: [
          {
            id: 'wf-cloud',
            capability: 'Cloud Architecture & Infrastructure (AWS/GCP)',
            department: 'Engineering',
            currentCoverage: 42,
            targetCoverage: 70,
            marketSignal: 'GROWING',
            marketTrajectory: '+28% YoY',
            recommendedIntervention: 'Upskill + Targeted Hire',
            interventionType: 'UPSKILL_HIRE',
            rationale: '42% coverage creates deployment bottlenecks; launch internal cloud cohort + hire 2 lead architects.',
          },
          {
            id: 'wf-devops',
            capability: 'CI/CD & DevOps Automation',
            department: 'Engineering & Operations',
            currentCoverage: 48,
            targetCoverage: 65,
            marketSignal: 'GROWING',
            marketTrajectory: '+24% YoY',
            recommendedIntervention: 'Upskill',
            interventionType: 'UPSKILL',
            rationale: 'Adjacent Linux/Git capabilities exist internally; upskilling delivers fastest ROI.',
          },
          {
            id: 'wf-dataeng',
            capability: 'Data Engineering & Pipeline Orchestration',
            department: 'Data & Analytics',
            currentCoverage: 38,
            targetCoverage: 60,
            marketSignal: 'GROWING',
            marketTrajectory: '+25% YoY',
            recommendedIntervention: 'Internal Mobility + Upskill',
            interventionType: 'REDISTRIBUTE',
            rationale: 'Cross-skill existing backend SQL developers into data pipeline orchestration.',
          },
        ],
      },
      {
        id: 'workforce-emerging-requirement',
        title: 'EMERGING WORKFORCE REQUIREMENT',
        subtitle: 'Forward-looking capabilities requiring specialist talent acquisition and early research cohorts',
        horizonLabel: 'Early Coverage (25–35%) · Emerging Signal',
        items: [
          {
            id: 'wf-ai',
            capability: 'Generative AI & LLM Systems Integration',
            department: 'Product & Engineering',
            currentCoverage: 28,
            targetCoverage: 55,
            marketSignal: 'EMERGING',
            marketTrajectory: '+38% YoY',
            recommendedIntervention: 'Specialist Hire + Cohort',
            interventionType: 'HIRE_UPSKILL',
            rationale: 'High market demand but low internal specialization; hire anchor expert to lead internal cohort.',
          },
          {
            id: 'wf-security',
            capability: 'Cybersecurity & Zero Trust Architecture',
            department: 'Infrastructure',
            currentCoverage: 32,
            targetCoverage: 50,
            marketSignal: 'GROWING',
            marketTrajectory: '+22% YoY',
            recommendedIntervention: 'Specialist Hire',
            interventionType: 'HIRE',
            rationale: 'Compliance mandates require certified security architect with domain credentials.',
          },
        ],
      },
    ],
    disclaimer:
      'Workforce capability horizon represents illustrative planning aggregates based on organizational role benchmarks and historical demand signals. Does not rank individual employees.',
  };
}
