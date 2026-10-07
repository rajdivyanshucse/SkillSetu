/**
 * SkillSetu Settings, Notifications, Support & Account Intelligence Data (Phase 16)
 * Centralized prototype data for individual and organization settings, notifications,
 * members, FAQs, activity logs, privacy options, and disclaimers.
 */

export const STORAGE_KEY_SETTINGS = 'skillsetu_settings_v1';
export const STORAGE_KEY_NOTIFICATION_PREFS = 'skillsetu_notification_preferences_v1';
export const STORAGE_KEY_CAREER_PREFS = 'skillsetu_career_preferences_v1';
export const STORAGE_KEY_LEARNING_PREFS = 'skillsetu_learning_preferences_v1';
export const STORAGE_KEY_OPPORTUNITY_PREFS = 'skillsetu_opportunity_preferences_v1';
export const STORAGE_KEY_APPEARANCE_PREFS = 'skillsetu_appearance_preferences_v1';
export const STORAGE_KEY_PRIVACY_PREFS = 'skillsetu_privacy_preferences_v1';
export const STORAGE_KEY_ACCOUNT_ACTIVITY = 'skillsetu_account_activity_v1';

export const STORAGE_KEY_ORG_SETTINGS = 'skillsetu_organization_settings_v1';
export const STORAGE_KEY_ORG_NOTIFICATION_PREFS = 'skillsetu_organization_notification_preferences_v1';
export const STORAGE_KEY_ORG_WORKFORCE_PREFS = 'skillsetu_organization_workforce_preferences_v1';
export const STORAGE_KEY_ORG_PRIVACY_PREFS = 'skillsetu_organization_privacy_preferences_v1';
export const STORAGE_KEY_ORG_MEMBERS = 'skillsetu_organization_members_v1';
export const STORAGE_KEY_ORG_ACTIVITY = 'skillsetu_organization_activity_v1';

export const SETTINGS_DISCLAIMER = {
  individual:
    'Settings in this prototype control the local SkillSetu interface, recommendation context, and simulated preferences. Backend authentication, live notification delivery, and production data governance are simulated in this frontend implementation.',
  organization:
    'Organization settings manage prototype workforce parameters, member role simulations, and aggregate reporting preferences. Live single sign-on (SSO), real enterprise directory sync, and automated email dispatches are simulated.',
  destructive:
    'Account actions and data clearing in this prototype operate solely on browser LocalStorage and simulated session states.',
};

export const SETTINGS_METHODOLOGY = {
  title: 'SkillSetu Prototype Settings & Preference Architecture',
  equation: 'User Preferences + Calibrated Profile + Development State = Tailored Intelligence Context',
  pipeline: 'Preference Input → Local State → Validation → Local Persistence → Application Context',
  steps: [
    {
      step: 1,
      title: 'Preference Configuration',
      description: 'Capture user-defined career goals, notification thresholds, and privacy boundaries.',
    },
    {
      step: 2,
      title: 'State Synchronization',
      description: 'Validate input against domain constraints and update in-memory application context.',
    },
    {
      step: 3,
      title: 'Deterministic Local Persistence',
      description: 'Persist configuration via browser LocalStorage with schema versioning and corruption fallbacks.',
    },
    {
      step: 4,
      title: 'Cross-Phase Intelligence Calibration',
      description: 'Propagate updated preferences into Skill Gaps, Roadmap, Learning, Opportunities, and Growth algorithms.',
    },
  ],
};

// Default Individual Account Profile
export const defaultAccountProfile = {
  fullName: 'Arjun Mehta',
  email: 'arjun.mehta@example.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka, India',
  accountType: 'Individual Professional',
  memberSince: 'October 2025',
  accountStatus: 'Active',
  lastProfileUpdate: '2 days ago',
  lastActivity: 'Active today',
  sessions: [
    {
      id: 'sess-1',
      device: 'MacBook Pro 16" — Chrome 129',
      location: 'Bengaluru, India',
      ip: '103.21.244.12',
      current: true,
      lastActive: 'Just now',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro — Safari iOS',
      location: 'Bengaluru, India',
      ip: '103.21.244.18',
      current: false,
      lastActive: 'Yesterday at 8:42 PM',
    },
  ],
};

// Default Profile Visibility Settings
export const defaultProfileVisibility = {
  visibilityLevel: 'visible_opportunities', // 'private' | 'limited' | 'visible_opportunities' | 'visible_organizations'
  allowDiscovery: true,
  showSkills: true,
  showExperience: true,
  showTargetRole: true,
  showLearningProgress: true,
  showProjects: true,
  showCompensationExpectations: false,
};

// Default Career Preferences
export const defaultCareerPreferences = {
  primaryTargetRole: 'Backend Software Engineer',
  secondaryRoles: ['Full Stack Developer', 'Cloud Platform Engineer'],
  careerDirection: 'Technical Specialist & Distributed Systems Lead',
  industries: ['Software', 'FinTech', 'SaaS', 'E-commerce'],
  experienceLevel: 'Mid Level (3-5 years)',
  workMode: 'Hybrid', // 'Remote' | 'Hybrid' | 'On-site'
  currentLocation: 'Bengaluru',
  preferredCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Remote'],
  remoteOnly: false,
  careerTimeline: 'Actively developing', // 'Exploring' | 'Preparing' | 'Actively developing' | 'Opportunity focused'
  salaryExpectationMin: '₹14 LPA',
  salaryExpectationMax: '₹24 LPA',
};

// Default Notification Preferences
export const defaultNotificationPreferences = {
  channels: {
    email: true,
    inApp: true,
  },
  careerIntelligence: {
    careerInsights: true,
    skillGapUpdates: true,
    roleCompatibilityUpdates: true,
    emergingSkillAlerts: false,
  },
  learning: {
    learningReminders: true,
    courseProgressUpdates: true,
    validationReminders: true,
    roadmapMilestones: true,
  },
  opportunities: {
    newMatchingOpportunities: true,
    savedOpportunityUpdates: true,
    applicationStatusReminders: true,
  },
  product: {
    productUpdates: true,
    featureAnnouncements: false,
    platformMessages: true,
  },
};

// Default Learning Preferences
export const defaultLearningPreferences = {
  learningGoal: 'Skill improvement', // 'Skill improvement' | 'Career transition' | 'Interview preparation' | 'Project development' | 'General exploration'
  learningStyle: 'Structured curriculum', // 'Structured curriculum' | 'Project-based' | 'Practice-first' | 'Mixed'
  dailyTimeCommitment: '30 min/day', // '15 min/day' | '30 min/day' | '1 hour/day' | 'Flexible'
  modality: 'Mixed', // 'Self-paced' | 'Guided' | 'Mixed'
  reminderFrequency: 'Daily', // 'Daily' | 'Weekly' | 'None'
  primaryFocusSkill: 'Spring Boot & Microservices',
  secondaryFocusSkill: 'AWS Cloud Architecture',
};

// Default Opportunity Preferences
export const defaultOpportunityPreferences = {
  opportunityTypes: ['Full-time', 'Contract'],
  workModes: ['Remote', 'Hybrid'],
  targetLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
  minCompensationLPA: 14,
  maxCompensationLPA: 26,
  skillAlertsEnabled: true,
  alertFrequency: 'Weekly digest', // 'Instant' | 'Daily digest' | 'Weekly digest'
  preferredCompanyStages: ['Growth Stage (Series B-D)', 'Established Enterprise'],
};

// Default Privacy & Data Preferences
export const defaultPrivacyPreferences = {
  personalizationEnabled: true,
  useLearningDataForRecommendations: true,
  shareAggregatedStatsAnonymously: true,
  allowOrganizationRecruiterSearch: true,
  retentionPeriod: '24 Months',
};

// Default Appearance Preferences
export const defaultAppearancePreferences = {
  theme: 'Light (Warm Editorial)', // 'Light (Warm Editorial)' | 'Dark (Studio)' | 'System'
  density: 'Comfortable', // 'Comfortable' | 'Compact'
  motion: 'Full motion', // 'Full motion' | 'Reduced motion'
  sidebarState: 'Expanded', // 'Expanded' | 'Collapsed'
  defaultDashboard: 'Learning', // 'Career Intelligence' | 'Skill Intelligence' | 'Learning' | 'Growth' | 'Overview'
};

// Mock Individual Account Activity Log
export const initialIndividualActivity = [
  {
    id: 'act-1',
    type: 'learning',
    title: 'Completed Module: Spring Boot REST Architecture',
    description: 'Finished 4 of 6 units in Backend Engineering Foundations path.',
    timestamp: 'Today at 10:15 AM',
    source: 'Learning Intelligence (Phase 15)',
  },
  {
    id: 'act-2',
    type: 'growth',
    title: 'Updated Milestone: System Design Blueprint',
    description: 'Submitted architecture documentation to Growth portfolio.',
    timestamp: 'Yesterday at 4:30 PM',
    source: 'Professional Growth (Phase 14)',
  },
  {
    id: 'act-3',
    type: 'opportunity',
    title: 'Saved Opportunity: Senior Java Engineer',
    description: 'Bookmarked opening at FinTech Solutions (92% compatibility match).',
    timestamp: 'Oct 01, 2026 at 2:10 PM',
    source: 'Job Intelligence (Phase 8)',
  },
  {
    id: 'act-4',
    type: 'skill_gap',
    title: 'Recalibrated Skill Profile',
    description: 'Adjusted AWS proficiency from 2/10 to 3/10 based on completed sandbox lab.',
    timestamp: 'Sep 29, 2026 at 6:45 PM',
    source: 'Skill Gap Analysis (Phase 6)',
  },
  {
    id: 'act-5',
    type: 'settings',
    title: 'Updated Career Preferences',
    description: 'Changed preferred work mode to Hybrid and added Pune to target cities.',
    timestamp: 'Sep 28, 2026 at 11:20 AM',
    source: 'Account Settings',
  },
  {
    id: 'act-6',
    type: 'security',
    title: 'Active Session Verified',
    description: 'Signed in from Chrome on macOS in Bengaluru, India.',
    timestamp: 'Sep 27, 2026 at 9:00 AM',
    source: 'Account Access',
  },
];

// Organization Settings & Members Data
export const defaultOrganizationSettings = {
  companyName: 'Nexora Technologies Inc.',
  industry: 'Enterprise Software & Cloud Platforms',
  companySize: '250–500 employees',
  location: 'Bengaluru, India (HQ) + Hyderabad, India',
  website: 'https://nexora.example.com',
  description: 'Building next-generation distributed data pipelines and AI-enabled enterprise workflow engines.',
  planningHorizon: '12 months',
  defaultPlanningScenario: 'Growth & Cloud Acceleration',
  primaryIntelligenceAreas: ['Skill gaps', 'Future skills', 'Talent matching', 'Workforce planning', 'Learning development'],
};

export const defaultOrganizationMembers = [
  {
    id: 'mem-1',
    name: 'Priya Sundaram',
    email: 'priya.s@nexora.example.com',
    role: 'Administrator',
    access: 'Full Workspace & Planning Access',
    status: 'Active',
    lastActive: 'Just now',
    avatar: 'PS',
  },
  {
    id: 'mem-2',
    name: 'Vikram Joshi',
    email: 'vikram.j@nexora.example.com',
    role: 'Workforce Planner',
    access: 'Planning & Skill Intelligence',
    status: 'Active',
    lastActive: '1 hour ago',
    avatar: 'VJ',
  },
  {
    id: 'mem-3',
    name: 'Ananya Roy',
    email: 'ananya.r@nexora.example.com',
    role: 'HR / Talent Lead',
    access: 'Talent Discovery & Shortlists',
    status: 'Active',
    lastActive: 'Yesterday',
    avatar: 'AR',
  },
  {
    id: 'mem-4',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@nexora.example.com',
    role: 'Technical Recruiter',
    access: 'Candidate Pipeline Viewer',
    status: 'Active',
    lastActive: '3 days ago',
    avatar: 'RD',
  },
  {
    id: 'mem-5',
    name: 'Kavita Menon',
    email: 'kavita.m@nexora.example.com',
    role: 'Viewer',
    access: 'Read-only Dashboards',
    status: 'Invited',
    lastActive: 'Pending Invite',
    avatar: 'KM',
  },
];

export const defaultOrganizationNotifications = {
  channels: {
    email: true,
    inApp: true,
  },
  workforce: {
    skillGapAlerts: true,
    futureSkillSignals: true,
    planningScenarioUpdates: true,
  },
  talent: {
    candidateShortlistActivity: true,
    newMatchingTalentAlerts: true,
    rolePipelineUpdates: false,
  },
  learning: {
    cohortMilestones: true,
    capabilityCoverageMilestones: true,
    programCompletionAlerts: true,
  },
  compensation: {
    marketPatternShifts: true,
    roleBenchmarkUpdates: false,
  },
  system: {
    productUpdates: true,
    governanceAnnouncements: true,
  },
};

export const initialOrganizationActivity = [
  {
    id: 'org-act-1',
    type: 'planning',
    title: 'Workforce Planning Scenario Calibrated',
    description: 'Updated 12-Month Cloud Acceleration scenario parameters (+18 FTE target).',
    timestamp: 'Today at 9:30 AM',
    source: 'Workforce Planning (Phase 12)',
  },
  {
    id: 'org-act-2',
    type: 'learning',
    title: 'Enterprise Cohort Progress: Cloud Engineering',
    description: 'Cohort achieved 64% progress milestone across 38 enrolled engineers.',
    timestamp: 'Yesterday at 3:15 PM',
    source: 'Learning Intelligence (Phase 15)',
  },
  {
    id: 'org-act-3',
    type: 'talent',
    title: 'Candidate Shortlisted: Lead Data Architect',
    description: 'Added 2 senior candidates to Q4 Data Modernization pipeline.',
    timestamp: 'Oct 01, 2026 at 11:40 AM',
    source: 'Talent Discovery (Phase 11)',
  },
  {
    id: 'org-act-4',
    type: 'workforce',
    title: 'Updated Department Headcount Baseline',
    description: 'Synchronized engineering headcount to 164 FTE across 4 squads.',
    timestamp: 'Sep 29, 2026 at 5:00 PM',
    source: 'Workforce Baseline (Phase 10)',
  },
  {
    id: 'org-act-5',
    type: 'settings',
    title: 'Invited New Member: Kavita Menon',
    description: 'Sent workspace invitation with Viewer role permissions.',
    timestamp: 'Sep 28, 2026 at 2:30 PM',
    source: 'Organization Members',
  },
];

// FAQ Knowledge Base for Help & Support
export const supportFaqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: 'Sparkles',
    questions: [
      {
        q: 'What is SkillSetu and how does it work?',
        a: 'SkillSetu is a deterministic career and workforce intelligence platform. It bridges personal skill profiles, market opportunity signals, structured learning paths, and career roadmaps into actionable development intelligence.',
      },
      {
        q: 'How do I complete my profile calibration?',
        a: 'Navigate to Profile Calibration or Onboarding Review to calibrate your current technical skills, experience tier, target engineering roles, and preferred working modalities.',
      },
      {
        q: 'Is my personal data shared with employers?',
        a: 'You have granular control over your profile visibility in Settings > Profile & Visibility. By default, contact details are private and only anonymized capability matrices are discoverable.',
      },
    ],
  },
  {
    id: 'skill-gaps',
    name: 'Skill Gaps & Calibration',
    icon: 'GitBranch',
    questions: [
      {
        q: 'How are skill gaps calculated?',
        a: 'Skill gaps represent the mathematical delta between your self-reported proficiency levels (0–10 scale) and benchmark competency requirements configured for your target role in the active market dataset.',
      },
      {
        q: 'What does "Calibrated" mean on a skill card?',
        a: 'A calibrated skill indicates that your self-assessment has been cross-referenced with your verified projects, completed learning modules, or validation tests in Phase 14 Professional Growth.',
      },
    ],
  },
  {
    id: 'learning',
    name: 'Learning Intelligence',
    icon: 'BookOpen',
    questions: [
      {
        q: 'How are learning recommendations generated?',
        a: 'Recommendations are prioritized transparently using: Skill Gap Severity × Target Role Relevance × Development Velocity × Opportunity Signal Frequency. We do not use black-box AI algorithms.',
      },
      {
        q: 'Is SkillSetu an LMS or course seller?',
        a: 'No. SkillSetu is a developmental intelligence and curriculum planning platform. It sequences conceptual modules, documentation, and practice labs rather than hosting video courses or selling certificates.',
      },
    ],
  },
  {
    id: 'opportunities',
    name: 'Opportunities & Matching',
    icon: 'Briefcase',
    questions: [
      {
        q: 'What does compatibility score mean?',
        a: 'The compatibility score calculates the overlap between your current technical skills and the required and preferred competencies specified in prototype job listings.',
      },
      {
        q: 'Does SkillSetu guarantee job placement?',
        a: 'No. SkillSetu provides developmental planning insights and prototype opportunity matching. We never guarantee employment, interviews, or hiring outcomes.',
      },
    ],
  },
  {
    id: 'growth',
    name: 'Professional Growth',
    icon: 'TrendingUp',
    questions: [
      {
        q: 'How does Professional Growth differ from Learning?',
        a: 'Learning Intelligence focuses on curriculum sequencing and study modules. Professional Growth serves as your longitudinal record of verified repository projects, architecture milestones, and capability validation.',
      },
    ],
  },
  {
    id: 'organization',
    name: 'Organization Features',
    icon: 'Building2',
    questions: [
      {
        q: 'How does workforce planning calculate capacity gaps?',
        a: 'Workforce planning models future talent demand across configured business scenarios (e.g. +15% expansion), compares it against current baseline headcount, and calculates net capability deficits.',
      },
      {
        q: 'Are individual employee reviews visible to planners?',
        a: 'No. Organization dashboards present aggregate capability metrics and cohort progress to support workforce capacity planning rather than individual performance appraisals.',
      },
    ],
  },
  {
    id: 'privacy',
    name: 'Account & Privacy',
    icon: 'ShieldCheck',
    questions: [
      {
        q: 'How can I export or delete my data?',
        a: 'Go to Settings > Privacy & Data Controls. You can trigger a simulated data export or initiate a complete account closure and LocalStorage wipe.',
      },
      {
        q: 'Where is my settings data stored?',
        a: 'In this frontend prototype, all preferences, saved items, and progress states are stored locally in your browser’s LocalStorage.',
      },
    ],
  },
];
