/**
 * SkillSetu Dashboard Mock Data Architecture
 * Centralized mock data structure for Individual Career Intelligence Home
 */

export const defaultDashboardData = {
  profile: {
    fullName: 'Rahul Sharma',
    currentRole: 'Computer Science Student',
    targetRole: 'Backend Software Engineer',
    educationLevel: "Bachelor's",
    degree: 'Computer Science & Engineering',
    institution: 'National Institute of Technology',
    graduationYear: '2026',
    location: 'Bengaluru, India',
    statusType: 'student',
    completeness: 92,
    avatarInitials: 'RS',
  },

  kpiStats: [
    {
      id: 'kpi-completeness',
      title: 'PROFILE COMPLETENESS',
      value: '92%',
      subtext: 'Ready for intelligence',
      status: 'success',
      trend: 'Calibrated',
    },
    {
      id: 'kpi-coverage',
      title: 'SKILL COVERAGE',
      value: '72%',
      subtext: 'Across target role requirements',
      status: 'neutral',
      trend: '7 of 10 mapped',
    },
    {
      id: 'kpi-compatibility',
      title: 'ROLE COMPATIBILITY',
      value: '84%',
      subtext: 'Backend Software Engineer',
      status: 'brand',
      trend: 'High alignment',
    },
    {
      id: 'kpi-gaps',
      title: 'PRIORITY GAPS',
      value: '4',
      subtext: 'Skills worth focusing on',
      status: 'warning',
      trend: '2 high-impact',
    },
  ],

  careerFit: {
    targetRole: 'Backend Software Engineer',
    primaryCompatibility: 84,
    disclaimer:
      'Compatibility reflects profile alignment with role requirements. It does not represent hiring probability.',
    roles: [
      {
        id: 'role-backend',
        title: 'Backend Software Engineer',
        compatibility: 84,
        matchLevel: 'Strong Fit',
        description: 'Strong foundation in Java, relational databases (SQL), and web services architecture.',
        isTarget: true,
        alignedSkills: ['Java', 'SQL', 'Spring Boot', 'REST APIs'],
        gapSkills: ['AWS', 'Docker', 'System Design'],
      },
      {
        id: 'role-swe',
        title: 'Software Engineer',
        compatibility: 81,
        matchLevel: 'Strong Fit',
        description: 'Solid core computer science fundamentals, algorithmic problem-solving, and general software development.',
        isTarget: false,
        alignedSkills: ['Java', 'JavaScript', 'Data Structures', 'Git'],
        gapSkills: ['Distributed Systems', 'CI/CD Pipelines'],
      },
      {
        id: 'role-fullstack',
        title: 'Full Stack Developer',
        compatibility: 69,
        matchLevel: 'Moderate Fit',
        description: 'Requires deepening client-side state management, CSS architecture, and advanced React patterns.',
        isTarget: false,
        alignedSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
        gapSkills: ['TypeScript', 'Next.js', 'State Stores'],
      },
      {
        id: 'role-dataeng',
        title: 'Data Engineer',
        compatibility: 63,
        matchLevel: 'Moderate Fit',
        description: 'Good SQL base, but requires big data orchestration frameworks and distributed computation pipelines.',
        isTarget: false,
        alignedSkills: ['SQL', 'Python', 'Relational Modeling'],
        gapSkills: ['Apache Spark', 'Kafka', 'ETL Pipelines'],
      },
      {
        id: 'role-devops',
        title: 'DevOps Engineer',
        compatibility: 52,
        matchLevel: 'Developing',
        description: 'Requires extensive infrastructure-as-code, Linux administration, and cluster orchestration.',
        isTarget: false,
        alignedSkills: ['Linux Basics', 'Git'],
        gapSkills: ['Kubernetes', 'Terraform', 'CI/CD Pipelines'],
      },
    ],
  },

  skillCoverage: {
    overallPercentage: 72,
    strongestCategory: 'Programming (88%)',
    developmentCategory: 'Cloud & DevOps (38%)',
    categories: [
      { name: 'Programming', percentage: 88, status: 'Advanced', description: 'Core languages & syntax proficiency' },
      { name: 'Backend', percentage: 82, status: 'Proficient', description: 'Frameworks, APIs & service logic' },
      { name: 'Databases', percentage: 76, status: 'Proficient', description: 'SQL querying, relational schemas' },
      { name: 'Frontend', percentage: 58, status: 'Developing', description: 'UI components & web styling' },
      { name: 'Cloud', percentage: 42, status: 'Emerging', description: 'Cloud infrastructure & compute fundamentals' },
      { name: 'DevOps', percentage: 35, status: 'Foundational', description: 'Containerization & deployment pipelines' },
      { name: 'System Design', percentage: 28, status: 'Foundational', description: 'Scalability, caching & partitioning' },
    ],
  },

  skills: [
    { name: 'Java', category: 'Programming', proficiency: 'Advanced', levelScore: 90 },
    { name: 'SQL', category: 'Databases', proficiency: 'Intermediate', levelScore: 75 },
    { name: 'Spring Boot', category: 'Backend', proficiency: 'Intermediate', levelScore: 70 },
    { name: 'JavaScript', category: 'Programming', proficiency: 'Intermediate', levelScore: 65 },
    { name: 'React', category: 'Frontend', proficiency: 'Beginner', levelScore: 40 },
    { name: 'AWS', category: 'Cloud', proficiency: 'Beginner', levelScore: 35 },
    { name: 'Docker', category: 'DevOps', proficiency: 'Beginner', levelScore: 30 },
  ],

  skillGaps: [
    {
      id: 'gap-aws',
      skill: 'AWS',
      category: 'Cloud & Infrastructure',
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      gapIntensity: 'High',
      marketRelevance: 'High',
      recommendation: 'Master S3, EC2, RDS and basic IAM permissions for cloud service orchestration.',
    },
    {
      id: 'gap-docker',
      skill: 'Docker',
      category: 'Containerization',
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      gapIntensity: 'High',
      marketRelevance: 'High',
      recommendation: 'Learn multi-stage Dockerfiles, compose networking, and container volume management.',
    },
    {
      id: 'gap-sysdesign',
      skill: 'System Design',
      category: 'Software Architecture',
      currentLevel: 'Foundational',
      targetLevel: 'Intermediate',
      gapIntensity: 'Medium',
      marketRelevance: 'High',
      recommendation: 'Understand load balancers, caching strategies (Redis), and horizontal database scaling.',
    },
    {
      id: 'gap-springboot',
      skill: 'Spring Boot',
      category: 'Backend Frameworks',
      currentLevel: 'Intermediate',
      targetLevel: 'Advanced',
      gapIntensity: 'Medium',
      marketRelevance: 'High',
      recommendation: 'Deepen Spring Security, asynchronous processing, and transaction management.',
    },
  ],

  marketSignals: [
    { skill: 'Cloud Computing', demand: 'High', direction: 'Rising', trajectory: '+28% YoY', category: 'Infrastructure' },
    { skill: 'Docker', demand: 'High', direction: 'Rising', trajectory: '+24% YoY', category: 'Containerization' },
    { skill: 'Spring Boot', demand: 'High', direction: 'Stable', trajectory: '+15% YoY', category: 'Backend' },
    { skill: 'Kubernetes', demand: 'Medium', direction: 'Rising', trajectory: '+31% YoY', category: 'Orchestration' },
    { skill: 'React', demand: 'High', direction: 'Stable', trajectory: '+12% YoY', category: 'Web UI' },
  ],

  recommendations: [
    {
      id: 'rec-1',
      title: 'Strengthen AWS fundamentals',
      reason: 'Cloud skills are directly relevant to your selected backend path.',
      actionText: 'Explore Skill',
      type: 'skill',
      target: 'AWS',
      tag: 'Priority Skill Gap',
    },
    {
      id: 'rec-2',
      title: 'Build a Spring Boot project',
      reason: 'Increase practical backend experience with end-to-end API design and DB indexing.',
      actionText: 'View Roadmap',
      type: 'roadmap',
      target: 'Spring Boot',
      tag: 'Capability Booster',
    },
    {
      id: 'rec-3',
      title: 'Practice System Design',
      reason: 'Useful for progressing toward backend engineering roles and distributed architecture.',
      actionText: 'Explore Topic',
      type: 'topic',
      target: 'System Design',
      tag: 'Architecture Topic',
    },
    {
      id: 'rec-4',
      title: 'Complete your profile calibration',
      reason: 'Additional project detail provides higher-resolution skill gap modeling.',
      actionText: 'Complete Profile',
      type: 'profile',
      target: '/onboarding/profile',
      tag: 'Profile Calibration',
    },
  ],

  recentActivity: [
    { id: 'act-1', event: 'Profile calibration updated', time: '2 hours ago', icon: 'UserCheck' },
    { id: 'act-2', event: 'Added AWS to skill inventory', time: 'Yesterday', icon: 'PlusCircle' },
    { id: 'act-3', event: 'Selected Backend Software Engineer archetype', time: '2 days ago', icon: 'Compass' },
    { id: 'act-4', event: 'Completed onboarding calibration', time: '3 days ago', icon: 'CheckCircle2' },
  ],

  intelligenceExplainer: {
    title: 'How SkillSetu reads your profile',
    subtitle: 'Transparent, structured capability mapping without black-box hype.',
    steps: [
      {
        stepNumber: '01',
        name: 'YOUR PROFILE',
        points: ['Self-rated competencies', 'Education & coursework', 'Declared career goals'],
        description: 'Your declared skills and academic background form your baseline profile graph.',
      },
      {
        stepNumber: '02',
        name: 'SKILL INTELLIGENCE',
        points: ['Role requirement models', 'Skill dependency links', 'Illustrative market signals'],
        description: 'SkillSetu calculates coverage across the competencies needed for target archetypes.',
      },
      {
        stepNumber: '03',
        name: 'CAREER INSIGHTS',
        points: ['Role compatibility scores', 'High-impact gap prioritization', 'Recommended learning steps'],
        description: 'Synthesizes clear next actions so you know exactly which capability to build next.',
      },
    ],
  },
};

/**
 * Merge onboarding context data with the mock baseline data
 * Ensures seamless dynamic behavior after onboarding or with direct URL visits.
 */
export const getMergedDashboardData = (onboardingState, completenessScore) => {
  if (!onboardingState || !onboardingState.profile) {
    return defaultDashboardData;
  }

  const { profile, skills, interests, goals } = onboardingState;

  const hasName = Boolean(profile.fullName && profile.fullName.trim());
  const fullName = hasName ? profile.fullName.trim() : defaultDashboardData.profile.fullName;
  const currentRole = profile.currentRole || defaultDashboardData.profile.currentRole;
  const targetRole = goals?.targetRole || interests?.roles?.[0] || defaultDashboardData.profile.targetRole;
  const location = profile.location || defaultDashboardData.profile.location;
  const completeness = typeof completenessScore === 'number' ? completenessScore : (hasName ? 92 : 80);

  // Derive initials
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SK';

  // Merge user's skills if any exist in onboarding
  const mergedSkills = skills && skills.length > 0
    ? skills.map((s) => ({
        name: s.name,
        category: s.category || 'General',
        proficiency: s.proficiency || 'Intermediate',
        levelScore:
          s.proficiency === 'Expert' ? 95 :
          s.proficiency === 'Advanced' ? 85 :
          s.proficiency === 'Intermediate' ? 65 : 40,
      }))
    : defaultDashboardData.skills;

  // Derive dynamic activity if skills or target role were added
  const dynamicActivity = [
    { id: 'act-dyn-1', event: `Profile calibrated for ${targetRole}`, time: 'Just now', icon: 'Compass' },
    { id: 'act-dyn-2', event: `Skill graph mapped with ${mergedSkills.length} competencies`, time: '1 hour ago', icon: 'UserCheck' },
    ...defaultDashboardData.recentActivity.slice(2),
  ];

  // Dynamic KPI stats
  const dynamicKpis = [
    {
      id: 'kpi-completeness',
      title: 'PROFILE COMPLETENESS',
      value: `${completeness}%`,
      subtext: completeness >= 90 ? 'Ready for intelligence' : 'Calibration in progress',
      status: 'success',
      trend: `${completeness}% Score`,
    },
    {
      id: 'kpi-coverage',
      title: 'SKILL COVERAGE',
      value: '72%',
      subtext: `Across ${targetRole} requirements`,
      status: 'neutral',
      trend: `${mergedSkills.length} mapped`,
    },
    {
      id: 'kpi-compatibility',
      title: 'ROLE COMPATIBILITY',
      value: '84%',
      subtext: targetRole,
      status: 'brand',
      trend: 'High alignment',
    },
    {
      id: 'kpi-gaps',
      title: 'PRIORITY GAPS',
      value: '4',
      subtext: 'Skills worth focusing on',
      status: 'warning',
      trend: '2 high-impact',
    },
  ];

  // Update target role in career fit
  const dynamicCareerFit = {
    ...defaultDashboardData.careerFit,
    targetRole,
    roles: defaultDashboardData.careerFit.roles.map((r, idx) => {
      if (idx === 0) {
        return { ...r, title: targetRole, isTarget: true };
      }
      return r;
    }),
  };

  return {
    ...defaultDashboardData,
    profile: {
      ...defaultDashboardData.profile,
      fullName,
      currentRole,
      targetRole,
      location,
      completeness,
      avatarInitials: initials,
      educationLevel: profile.educationLevel || defaultDashboardData.profile.educationLevel,
      degree: profile.degree || defaultDashboardData.profile.degree,
      institution: profile.institution || defaultDashboardData.profile.institution,
      statusType: profile.statusType || defaultDashboardData.profile.statusType,
    },
    kpiStats: dynamicKpis,
    skills: mergedSkills,
    careerFit: dynamicCareerFit,
    recentActivity: dynamicActivity,
  };
};
