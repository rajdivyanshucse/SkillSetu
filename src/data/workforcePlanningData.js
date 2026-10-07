/**
 * SkillSetu Workforce Planning & Future Workforce Intelligence Data (Phase 12)
 * Centralized prototype baseline data, scenario parameters, capability requirements, and roadmap definitions.
 */

export const STORAGE_KEY_WORKFORCE_PLANNING = 'skillsetu_workforce_planning_v1';

export const PLANNING_DISCLAIMER =
  'Workforce planning outputs are illustrative scenario calculations based on configured assumptions and prototype data. They are not forecasts, guarantees, or actual workforce commitments.';

export const TALENT_POOL_DISCLAIMER =
  'Talent pool signals use fictional prototype profiles and should not be interpreted as real candidate availability.';

export const FUTURE_SKILL_DISCLAIMER =
  'Future capability requirements are scenario-based planning estimates, not external market forecasts.';

export const planningHorizons = [
  { id: '12m', label: '12 Months', value: 12, multiplier: 1.0, desc: 'Near-term tactical execution' },
  { id: '24m', label: '24 Months', value: 24, multiplier: 1.15, desc: 'Medium-term capability transformation' },
  { id: '36m', label: '36 Months', value: 36, multiplier: 1.3, desc: 'Strategic long-range readiness' },
];

export const defaultPlanningScenarios = [
  {
    id: 'growth',
    name: 'Growth & Expansion',
    tagline: 'Rapid business scaling and technical headcount expansion',
    description: 'Models aggressive market expansion with high hiring quotas and rapid scaling of core product and engineering squads.',
    horizon: '24 Months',
    horizonMonths: 24,
    workforceGrowth: '+15%',
    growthRate: 0.15,
    skillDemandMultiplier: 1.25,
    attritionAssumption: 'Moderate (12%)',
    attritionRate: 0.12,
    developmentEmphasis: 'Medium',
    hiringEmphasis: 'High (55%)',
    transformationEmphasis: 'Medium',
    defaultActionMix: {
      hiring: 50,
      upskilling: 35,
      reskilling: 5,
      internalMobility: 10,
    },
    keyDrivers: [
      'New product line launches requiring specialized engineering',
      'Geographical team expansion across regional tech hubs',
      'Need for senior lead architects to mentor junior cohorts',
    ],
  },
  {
    id: 'digital-transformation',
    name: 'Digital Transformation',
    tagline: 'Cloud-native migration and enterprise modernization',
    description: 'Focuses on modernizing legacy platforms, migrating to distributed cloud architectures, and adopting automated CI/CD pipelines.',
    horizon: '24 Months',
    horizonMonths: 24,
    workforceGrowth: '+8%',
    growthRate: 0.08,
    skillDemandMultiplier: 1.35,
    attritionAssumption: 'Low (8%)',
    attritionRate: 0.08,
    developmentEmphasis: 'High',
    hiringEmphasis: 'Medium (35%)',
    transformationEmphasis: 'High',
    defaultActionMix: {
      hiring: 35,
      upskilling: 45,
      reskilling: 10,
      internalMobility: 10,
    },
    keyDrivers: [
      'Accelerating cloud infrastructure and containerization transitions',
      'Retiring legacy monoliths in favor of microservices',
      'Implementing Zero-Trust security and compliance frameworks',
    ],
  },
  {
    id: 'skills-modernization',
    name: 'Skills Modernization',
    tagline: 'Internal talent reskilling and AI/ML capability build-out',
    description: 'Prioritizes internal talent mobility, continuous cohort upskilling, and integrating AI/LLM tools into existing developer workflows.',
    horizon: '12 Months',
    horizonMonths: 12,
    workforceGrowth: '+5%',
    growthRate: 0.05,
    skillDemandMultiplier: 1.2,
    attritionAssumption: 'Low (7%)',
    attritionRate: 0.07,
    developmentEmphasis: 'High (60%)',
    hiringEmphasis: 'Low (25%)',
    transformationEmphasis: 'High',
    defaultActionMix: {
      hiring: 25,
      upskilling: 55,
      reskilling: 10,
      internalMobility: 10,
    },
    keyDrivers: [
      'Empowering engineering teams with AI-assisted coding and testing',
      'Upskilling backend engineers into distributed data pipelines',
      'Maximizing talent retention through structured career mobility',
    ],
  },
  {
    id: 'cost-conscious',
    name: 'Cost-Conscious Planning',
    tagline: 'Operational efficiency, internal mobility, and controlled headcount',
    description: 'Emphasizes maximizing ROI on current headcount through cross-skilling, lean squad restructuring, and selective critical hiring only.',
    horizon: '12 Months',
    horizonMonths: 12,
    workforceGrowth: '+2%',
    growthRate: 0.02,
    skillDemandMultiplier: 1.05,
    attritionAssumption: 'Moderate (10%)',
    attritionRate: 0.10,
    developmentEmphasis: 'High',
    hiringEmphasis: 'Low (15%)',
    transformationEmphasis: 'Medium',
    defaultActionMix: {
      hiring: 15,
      upskilling: 60,
      reskilling: 15,
      internalMobility: 10,
    },
    keyDrivers: [
      'Strict control over external headcount additions',
      'Leveraging internal rotations to fill urgent capability gaps',
      'Targeted micro-certifications for existing practitioners',
    ],
  },
];

export const baselineCapabilities = [
  {
    id: 'cloud-architecture',
    name: 'Cloud & Infrastructure Architecture',
    category: 'Cloud',
    currentCapacity: 34,
    currentCoveragePct: 40,
    importance: 'Critical',
    horizon: '0–12 Months',
    roleAlignmentId: 'cloud-devops-engineer',
    talentPoolSignalCount: 6,
    defaultAction: 'Upskill + Hire',
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering & Pipelines',
    category: 'Data',
    currentCapacity: 28,
    currentCoveragePct: 52,
    importance: 'High',
    horizon: '0–12 Months',
    roleAlignmentId: 'data-engineer',
    talentPoolSignalCount: 5,
    defaultAction: 'Upskill',
  },
  {
    id: 'ai-ml-llm',
    name: 'Generative AI & LLM Systems',
    category: 'AI/ML',
    currentCapacity: 18,
    currentCoveragePct: 35,
    importance: 'Critical',
    horizon: '0–12 Months',
    roleAlignmentId: 'ai-ml-engineer',
    talentPoolSignalCount: 4,
    defaultAction: 'Hire + Upskill',
  },
  {
    id: 'backend-microservices',
    name: 'Backend Microservices & Distributed APIs',
    category: 'Backend',
    currentCapacity: 65,
    currentCoveragePct: 68,
    importance: 'High',
    horizon: '1–2 Years',
    roleAlignmentId: 'backend-engineer',
    talentPoolSignalCount: 8,
    defaultAction: 'Upskill Focus',
  },
  {
    id: 'frontend-react',
    name: 'Modern Frontend & Design Systems',
    category: 'Frontend',
    currentCapacity: 45,
    currentCoveragePct: 62,
    importance: 'Medium',
    horizon: '1–2 Years',
    roleAlignmentId: 'frontend-engineer',
    talentPoolSignalCount: 6,
    defaultAction: 'Upskill',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Zero Trust',
    category: 'Security',
    currentCapacity: 21,
    currentCoveragePct: 45,
    importance: 'High',
    horizon: '1–2 Years',
    roleAlignmentId: 'cloud-devops-engineer',
    talentPoolSignalCount: 3,
    defaultAction: 'Upskill + Specialist Hire',
  },
  {
    id: 'product-management',
    name: 'Technical Product Management',
    category: 'Product',
    currentCapacity: 16,
    currentCoveragePct: 58,
    importance: 'Medium',
    horizon: '1–2 Years',
    roleAlignmentId: 'product-manager',
    talentPoolSignalCount: 4,
    defaultAction: 'Internal Mobility',
  },
  {
    id: 'devops-automation',
    name: 'CI/CD & DevOps Automation',
    category: 'DevOps',
    currentCapacity: 29,
    currentCoveragePct: 55,
    importance: 'High',
    horizon: '0–12 Months',
    roleAlignmentId: 'cloud-devops-engineer',
    talentPoolSignalCount: 5,
    defaultAction: 'Upskill',
  },
];

export const baselineDepartmentPlanning = [
  {
    department: 'Engineering',
    currentHeadcount: 120,
    growthRate: 0.12,
    priorityCapability: 'Cloud Architecture & Microservices',
    potentialAction: 'Hybrid (Upskill 60% + Hire 40%)',
  },
  {
    department: 'Product',
    currentHeadcount: 30,
    growthRate: 0.10,
    priorityCapability: 'Technical Product Strategy & Telemetry',
    potentialAction: 'Internal Mobility & Upskilling',
  },
  {
    department: 'Data & Analytics',
    currentHeadcount: 20,
    growthRate: 0.25,
    priorityCapability: 'Generative AI & Data Lakehouse',
    potentialAction: 'Targeted Hiring + Specialist Cohorts',
  },
  {
    department: 'Operations',
    currentHeadcount: 60,
    growthRate: 0.05,
    priorityCapability: 'Process Automation & Site Reliability',
    potentialAction: 'Reskilling & Upskilling',
  },
  {
    department: 'Sales & Customer Success',
    currentHeadcount: 45,
    growthRate: 0.08,
    priorityCapability: 'Technical Solutions Consulting',
    potentialAction: 'Selective Hiring',
  },
  {
    department: 'HR & People Operations',
    currentHeadcount: 12,
    growthRate: 0.08,
    priorityCapability: 'Talent Calibration & Internal Mobility',
    potentialAction: 'Upskilling',
  },
];

export const roadmapMilestones = [
  {
    stage: '0–3 Months',
    title: 'Baseline Calibration & Inventory',
    objective: 'Validate workforce capability baseline and map role requirements.',
    status: 'In Progress',
    actions: [
      'Complete departmental skill inventory and calibrate proficiency benchmarks',
      'Identify high-divergence capability gaps across Cloud and AI domains',
      'Confirm target role specifications with engineering leadership',
    ],
    dependencies: 'Executive alignment on target scenario and planning horizon',
  },
  {
    stage: '3–6 Months',
    title: 'Priority Upskilling & Internal Cohorts',
    objective: 'Launch structured learning cohorts to address immediate internal gaps.',
    status: 'Planned',
    actions: [
      'Initiate Cloud Architecture and Kubernetes hands-on learning cohorts',
      'Establish internal developer mobility pathways for backend engineers',
      'Conduct midpoint skill growth calibrations',
    ],
    dependencies: 'Baseline inventory completion and learning budget approval',
  },
  {
    stage: '6–12 Months',
    title: 'Targeted Talent Acquisition & Mentorship',
    objective: 'Bridge remaining specialist capacity gaps via external talent discovery.',
    status: 'Planned',
    actions: [
      'Execute targeted hiring for Senior Cloud & Generative AI leads',
      'Pair incoming specialist hires with internal squads for knowledge transfer',
      'Assess squad throughput after initial upskilling iterations',
    ],
    dependencies: 'Internal cohort ramp-up and calibrated shortlist readiness',
  },
  {
    stage: '12–24 Months',
    title: 'Capability Expansion & Reskilling',
    objective: 'Scale modern architectures and transition support personnel.',
    status: 'Planned',
    actions: [
      'Transition legacy maintenance staff toward modern data engineering roles',
      'Expand cross-functional AI tooling adoption across all developer pods',
      'Establish continuous internal talent marketplace',
    ],
    dependencies: 'Core platform modernization milestones',
  },
  {
    stage: '24–36 Months',
    title: 'Strategic Horizon & Long-Range Readiness',
    objective: 'Sustain workforce capability leadership and autonomous agility.',
    status: 'Future Vision',
    actions: [
      'Evaluate emerging technology horizons (Quantum, Edge AI, Zero Trust)',
      'Institutionalize automated talent calibration pipelines',
      'Refine multi-year workforce capacity assumptions',
    ],
    dependencies: 'Annual strategic roadmap recalibration',
  },
];

export const getPlanningScenarioById = (id) => {
  return defaultPlanningScenarios.find((s) => s.id === id) || defaultPlanningScenarios[0];
};
