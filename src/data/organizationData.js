/**
 * SkillSetu Organization Onboarding & Workforce Profile Centralized Mock Data
 * Realistic architecture for enterprise workforce taxonomy, skills, priorities, and capabilities
 */

export const STORAGE_KEY_ORG_ONBOARDING = 'skillsetu_organization_onboarding_v1';
export const STORAGE_KEY_ORG_COMPLETE = 'skillsetu_organization_onboarding_complete_v1';

export const organizationTypes = [
  'Startup',
  'SME',
  'Enterprise',
  'Non-profit',
  'Government',
  'Educational Institution',
  'Other',
];

export const organizationSizes = [
  '1–10',
  '11–50',
  '51–200',
  '201–500',
  '501–1000',
  '1000+',
];

export const industryOptions = [
  'Information Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Telecommunications',
  'Education',
  'Logistics',
  'Construction',
  'Energy',
  'Government',
  'Professional Services',
  'Other',
];

export const businessFunctionsList = [
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'Finance',
  'HR',
  'Operations',
  'Customer Success',
  'Research',
  'Data & Analytics',
];

export const organizationSkillCategories = {
  Programming: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'Go', 'Rust'],
  Backend: ['Spring Boot', 'Node.js', 'Django', 'FastAPI', 'Microservices', 'REST APIs', 'GraphQL'],
  Frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Mobile (React Native/Flutter)'],
  Databases: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch'],
  Cloud: ['AWS', 'Azure', 'Google Cloud (GCP)', 'Cloud Architecture', 'Serverless'],
  DevOps: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform', 'Linux Administration', 'Monitoring (Prometheus/Grafana)'],
  Data: ['Data Engineering', 'ETL Pipelines', 'Apache Spark', 'Snowflake', 'dbt', 'BigQuery'],
  'AI/ML': ['Machine Learning', 'Deep Learning', 'Generative AI & LLMs', 'NLP', 'Computer Vision', 'PyTorch / TensorFlow'],
  Security: ['Cybersecurity', 'Application Security', 'IAM & Access Control', 'SOC2 / Compliance'],
  Product: ['Product Management', 'System Design', 'Agile / Scrum', 'User Experience (UX)'],
  Management: ['Engineering Leadership', 'Project Management', 'People Management', 'Strategic Planning'],
  Business: ['Business Analytics', 'Digital Transformation', 'Enterprise Sales', 'Customer Retention'],
};

export const workforcePrioritiesList = [
  'Hiring new talent',
  'Upskilling existing employees',
  'Reskilling employees',
  'Reducing skill gaps',
  'Preparing for new technology',
  'Improving productivity',
  'Building leadership capability',
  'Expanding into new markets',
  'Supporting digital transformation',
  'Improving workforce retention',
];

export const workforceChallengesList = [
  'Hard-to-find skills',
  'Emerging technology requirements',
  'Internal skill gaps',
  'Hiring costs',
  'Training effectiveness',
  'Workforce planning',
  'Role redesign',
  'Skill visibility',
];

export const futureSkillCategories = [
  'Cloud Architecture',
  'Generative AI & LLMs',
  'AI/ML Systems',
  'Data Engineering',
  'Cybersecurity & Zero Trust',
  'DevOps Automation',
  'Distributed System Design',
  'Product Management',
  'Advanced Concurrency (Java/Go)',
  'Data Analytics & BI',
  'Leadership & Coaching',
];

export const workforceStrategies = ['Hire', 'Upskill', 'Reskill', 'Hybrid'];

export const learningPreferencesList = [
  'Internal training',
  'External courses',
  'Mentorship',
  'Project-based learning',
  'Certifications',
  'Coaching',
  'Peer learning',
];

export const hiringPreferencesList = [
  'Full-time',
  'Contract',
  'Internship',
  'Hybrid workforce',
];

export const budgetTiers = [
  'Limited',
  'Moderate',
  'Flexible',
  'Enterprise-scale',
];

/**
 * Realistic default fallback organization state
 */
export const defaultOrganizationState = {
  company: {
    name: 'TechNova Solutions',
    type: 'Enterprise',
    foundedYear: '2018',
    website: 'https://technova.example.com',
    primaryLocation: 'Bengaluru, India',
    additionalLocations: 'Hyderabad, Pune, Remote',
    description: 'Builds enterprise software products, distributed backend platforms, and cloud-native services.',
    size: '201–500',
  },
  industry: {
    primaryIndustry: 'Information Technology',
    businessFunctions: ['Engineering', 'Product', 'Data & Analytics', 'Operations', 'HR', 'Sales'],
    primaryBusinessAreas: 'Enterprise Software & Cloud Platforms',
    shortDescription: 'Provides scalable software products, data processing pipelines, and enterprise automation.',
  },
  workforce: {
    departments: {
      Engineering: 120,
      Product: 30,
      Sales: 45,
      Marketing: 20,
      Finance: 15,
      HR: 12,
      Operations: 60,
      'Data & Analytics': 20,
      Other: 10,
    },
    experienceDistribution: {
      '0–2 years': '25%',
      '3–5 years': '40%',
      '6–10 years': '25%',
      '10+ years': '10%',
    },
    workforceNotes: 'Rapidly scaling cloud engineering and AI/ML data processing capabilities.',
  },
  skills: [
    { name: 'Java', category: 'Programming', capabilityLevel: 'Advanced', coveragePct: 65 },
    { name: 'Spring Boot', category: 'Backend', capabilityLevel: 'Advanced', coveragePct: 55 },
    { name: 'JavaScript', category: 'Programming', capabilityLevel: 'Advanced', coveragePct: 70 },
    { name: 'React', category: 'Frontend', capabilityLevel: 'Intermediate', coveragePct: 60 },
    { name: 'SQL', category: 'Databases', capabilityLevel: 'Advanced', coveragePct: 75 },
    { name: 'AWS', category: 'Cloud', capabilityLevel: 'Intermediate', coveragePct: 40 },
    { name: 'Docker', category: 'DevOps', capabilityLevel: 'Intermediate', coveragePct: 45 },
    { name: 'Kubernetes', category: 'DevOps', capabilityLevel: 'Beginner', coveragePct: 25 },
  ],
  priorities: {
    strategicPriorities: [
      'Upskilling existing employees',
      'Reducing skill gaps',
      'Preparing for new technology',
      'Building leadership capability',
    ],
    workforceChallenges: [
      'Hard-to-find skills',
      'Emerging technology requirements',
      'Internal skill gaps',
      'Workforce planning',
    ],
    additionalNotes: 'Need structured learning paths to transition intermediate engineers into cloud-native and distributed architecture roles.',
  },
  futureSkills: [
    {
      name: 'Generative AI & LLMs',
      category: 'AI/ML',
      currentImportance: 'Medium',
      futureImportance: 'Critical',
      horizon: '0–12 months',
    },
    {
      name: 'Cloud Architecture',
      category: 'Cloud',
      currentImportance: 'Medium',
      futureImportance: 'High',
      horizon: '1–2 years',
    },
    {
      name: 'Data Engineering',
      category: 'Data',
      currentImportance: 'Medium',
      futureImportance: 'High',
      horizon: '0–12 months',
    },
    {
      name: 'Cybersecurity & Zero Trust',
      category: 'Security',
      currentImportance: 'Low',
      futureImportance: 'High',
      horizon: '2–3 years',
    },
    {
      name: 'DevOps Automation',
      category: 'DevOps',
      currentImportance: 'Medium',
      futureImportance: 'High',
      horizon: '1–2 years',
    },
  ],
  preferences: {
    workforceStrategy: 'Hybrid',
    learningPreferences: [
      'Internal training',
      'Project-based learning',
      'Certifications',
      'Mentorship',
    ],
    hiringPreferences: ['Full-time', 'Internship', 'Hybrid workforce'],
    operatingLocations: 'Bengaluru, Hyderabad, Pune, Remote',
    remoteSupport: 'Hybrid',
    budgetTier: 'Enterprise-scale',
  },
};

export const mockOrganizationProfile = defaultOrganizationState;

/**
 * Calculates dynamic organization profile completeness % based on actual inputs
 */
export const calculateOrgCompleteness = (state) => {
  if (!state) return 20;
  let score = 0;

  // 1. Company info (20 pts)
  if (state.company?.name) score += 8;
  if (state.company?.type) score += 4;
  if (state.company?.primaryLocation) score += 4;
  if (state.company?.size) score += 4;

  // 2. Industry & Business (15 pts)
  if (state.industry?.primaryIndustry) score += 8;
  if (state.industry?.businessFunctions?.length > 0) score += 7;

  // 3. Workforce Profile (15 pts)
  const totalEmployees = Object.values(state.workforce?.departments || {}).reduce(
    (acc, val) => acc + (parseInt(val, 10) || 0),
    0
  );
  if (totalEmployees > 0) score += 15;

  // 4. Skills Inventory (20 pts)
  if (state.skills?.length >= 1) score += 10;
  if (state.skills?.length >= 4) score += 10;

  // 5. Priorities & Challenges (10 pts)
  if (state.priorities?.strategicPriorities?.length > 0) score += 5;
  if (state.priorities?.workforceChallenges?.length > 0) score += 5;

  // 6. Future Skills (10 pts)
  if (state.futureSkills?.length > 0) score += 10;

  // 7. Preferences (10 pts)
  if (state.preferences?.workforceStrategy) score += 5;
  if (state.preferences?.learningPreferences?.length > 0) score += 5;

  return Math.min(100, Math.max(15, score));
};

/**
 * Helper: Retrieve stored organization state from localStorage
 */
export const getStoredOrgOnboarding = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORG_ONBOARDING);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load organization onboarding state from localStorage:', e);
  }
  return defaultOrganizationState;
};

/**
 * Helper: Save organization state to localStorage
 */
export const saveStoredOrgOnboarding = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY_ORG_ONBOARDING, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save organization onboarding state to localStorage:', e);
  }
};
