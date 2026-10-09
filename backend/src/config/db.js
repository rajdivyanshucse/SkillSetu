import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import env from './env.js';

// Global singleton pattern for Prisma Client across ES Modules
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.isDevelopment ? ['error'] : ['error'],
  });
};

const globalForPrisma = globalThis;
const rawPrisma = globalForPrisma.rawPrisma ?? prismaClientSingleton();

if (!env.isProduction) {
  globalForPrisma.rawPrisma = rawPrisma;
}

// =========================================================================
// IN-MEMORY FALLBACK REPOSITORY & SEED STORE
// Ensures complete functionality & testing even when local Postgres is offline
// =========================================================================

class MemoryStore {
  constructor() {
    this.users = new Map();
    this.individualProfiles = new Map();
    this.skills = new Map();
    this.userSkills = new Map();
    this.roles = new Map();
    this.roleSkills = new Map();
    this.experiences = new Map();
    this.educations = new Map();
    this.organizations = new Map();
    this.organizationMembers = new Map();
    this.departments = new Map();
    this.organizationSkills = new Map();
    this.futureSkills = new Map();
    this.talentShortlists = new Map();
    this.planningScenarios = new Map();
    this.planningRoadmapActions = new Map();
    this.organizationLearningPrograms = new Map();
    this.opportunities = new Map();
    this.opportunitySkills = new Map();
    this.advertisedCompensations = new Map();
    this.savedOpportunities = new Map();
    this.applications = new Map();
    this.growthMilestones = new Map();
    this.growthProjects = new Map();
    this.learningPaths = new Map();
    this.learningModules = new Map();
    this.learningResources = new Map();
    this.learningProgress = new Map();
    this.authSessions = new Map();
    this.emailVerificationTokens = new Map();
    this.passwordResetTokens = new Map();
    this.authAuditLogs = [];
    this.skillEmbeddings = new Map();
    this.skillDemandObservations = new Map();
    this.roleDemandObservations = new Map();
    this.demandForecasts = new Map();
    this.demandTrendSnapshots = new Map();
    this.recommendations = new Map();
    this.recommendationFeedback = new Map();
    this.dataSources = new Map();
    this.datasets = new Map();
    this.datasetVersions = new Map();
    this.ingestionJobRecords = new Map();
    this.ingestionRecords = new Map();
    this.dataQualityReports = new Map();
    this.quarantinedRecords = new Map();
    this.externalTaxonomyMappings = new Map();
    this.capabilityEvidences = new Map();
    this.developmentRoadmaps = new Map();
    this.capabilityDevelopmentPlans = new Map();
    this.roadmapStageProgresses = new Map();
    this.roadmapReevaluations = new Map();

    this._seedInitialCatalog();
  }

  uuid() {
    return crypto.randomUUID();
  }

  _seedInitialCatalog() {
    const getSkillId = (name) => {
      for (const s of this.skills.values()) {
        if (s.name.toLowerCase() === name.toLowerCase()) return s.id;
      }
      return null;
    };
    const getRoleId = (name) => {
      for (const r of this.roles.values()) {
        if (r.name.toLowerCase() === name.toLowerCase()) return r.id;
      }
      return null;
    };

    // 1. Seed Core Skills
    const seedSkillsData = [
      { name: 'JavaScript', category: 'Programming', description: 'Core web scripting language' },
      { name: 'TypeScript', category: 'Programming', description: 'Typed JavaScript superset' },
      { name: 'React.js', category: 'Frontend', description: 'Component-based UI library' },
      { name: 'Node.js', category: 'Backend', description: 'JavaScript server runtime' },
      { name: 'PostgreSQL', category: 'Database', description: 'Relational SQL database engine' },
      { name: 'Python', category: 'Programming', description: 'Versatile backend & data language' },
      { name: 'System Architecture', category: 'Architecture', description: 'Distributed systems design' },
      { name: 'Docker', category: 'DevOps', description: 'Containerization technology' },
      { name: 'REST APIs', category: 'Backend', description: 'HTTP API architecture and design' },
      { name: 'GraphQL', category: 'Backend', description: 'Query language for APIs' },
      { name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration' },
      { name: 'AWS Cloud', category: 'Cloud', description: 'Cloud infrastructure services' },
      { name: 'CI/CD Pipelines', category: 'DevOps', description: 'Automated testing & delivery' },
      { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS framework' },
      { name: 'Data Structures', category: 'Core CS', description: 'Fundamental data modeling algorithms' },
      { name: 'Data Analysis', category: 'Data & AI', description: 'Extracting actionable insights from structured data' },
      { name: 'Machine Learning', category: 'Data & AI', description: 'Building predictive statistical and learning models' },
      { name: 'Deep Learning', category: 'Data & AI', description: 'Neural network architectures and deep representations' },
      { name: 'Java', category: 'Programming', description: 'Object-oriented programming language and runtime' },
      { name: 'Spring Boot', category: 'Backend', description: 'Java framework for microservices and enterprise backends' },
      { name: 'SQL', category: 'Database', description: 'Structured query language for relational databases' },
    ];

    seedSkillsData.forEach((s) => {
      const id = this.uuid();
      const norm = s.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      this.skills.set(id, {
        id,
        name: s.name,
        normalizedName: norm,
        category: s.category,
        description: s.description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 2. Seed Normalized Roles
    const seedRolesData = [
      {
        name: 'Backend Software Engineer',
        category: 'Software Engineering',
        description: 'Designs, implements, and maintains scalable server-side systems and data pipelines.',
        skills: [
          { skillName: 'Node.js', reqType: 'REQUIRED', importance: 90, prof: 'ADVANCED' },
          { skillName: 'PostgreSQL', reqType: 'REQUIRED', importance: 85, prof: 'ADVANCED' },
          { skillName: 'REST APIs', reqType: 'REQUIRED', importance: 90, prof: 'ADVANCED' },
          { skillName: 'System Architecture', reqType: 'REQUIRED', importance: 80, prof: 'INTERMEDIATE' },
          { skillName: 'Docker', reqType: 'PREFERRED', importance: 70, prof: 'INTERMEDIATE' },
          { skillName: 'Python', reqType: 'PREFERRED', importance: 65, prof: 'INTERMEDIATE' },
        ],
      },
      {
        name: 'Full Stack Engineer',
        category: 'Software Engineering',
        description: 'Builds end-to-end user interfaces, APIs, and integrated database workflows.',
        skills: [
          { skillName: 'React.js', reqType: 'REQUIRED', importance: 90, prof: 'ADVANCED' },
          { skillName: 'Node.js', reqType: 'REQUIRED', importance: 85, prof: 'ADVANCED' },
          { skillName: 'JavaScript', reqType: 'REQUIRED', importance: 95, prof: 'EXPERT' },
          { skillName: 'PostgreSQL', reqType: 'REQUIRED', importance: 80, prof: 'INTERMEDIATE' },
          { skillName: 'Tailwind CSS', reqType: 'PREFERRED', importance: 75, prof: 'INTERMEDIATE' },
        ],
      },
      {
        name: 'Cloud & DevOps Architect',
        category: 'Infrastructure',
        description: 'Manages cloud infrastructure, CI/CD pipelines, and high availability systems.',
        skills: [
          { skillName: 'Docker', reqType: 'REQUIRED', importance: 95, prof: 'ADVANCED' },
          { skillName: 'Kubernetes', reqType: 'REQUIRED', importance: 90, prof: 'ADVANCED' },
          { skillName: 'AWS Cloud', reqType: 'REQUIRED', importance: 90, prof: 'ADVANCED' },
          { skillName: 'CI/CD Pipelines', reqType: 'REQUIRED', importance: 85, prof: 'ADVANCED' },
        ],
      },
    ];

    seedRolesData.forEach((r) => {
      const roleId = this.uuid();
      const normRole = r.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      this.roles.set(roleId, {
        id: roleId,
        name: r.name,
        normalizedName: normRole,
        category: r.category,
        description: r.description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      r.skills.forEach((rs) => {
        let skillId = null;
        for (const s of this.skills.values()) {
          if (s.name.toLowerCase() === rs.skillName.toLowerCase()) {
            skillId = s.id;
            break;
          }
        }
        if (skillId) {
          const rsId = this.uuid();
          this.roleSkills.set(rsId, {
            id: rsId,
            roleId,
            skillId,
            requirementType: rs.reqType,
            importance: rs.importance,
            targetProficiency: rs.prof,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });
    });

    // 3. Seed Seed Opportunities
    const seedOpportunities = [
      {
        title: 'Senior Backend Engineer',
        companyName: 'Starlight Fintech',
        location: 'Bengaluru, India',
        workMode: 'HYBRID',
        employmentType: 'FULL_TIME',
        experienceLevel: 'Senior',
        description: 'Scale financial transaction pipelines with low latency and high availability.',
        minComp: 2800000,
        maxComp: 4200000,
      },
      {
        title: 'Full Stack Platform Developer',
        companyName: 'CloudScale Technologies',
        location: 'Remote, Global',
        workMode: 'REMOTE',
        employmentType: 'FULL_TIME',
        experienceLevel: 'Mid-Senior',
        description: 'Build enterprise workflow intelligence dashboards and real-time visualization portals.',
        minComp: 2000000,
        maxComp: 3200000,
      },
      {
        title: 'DevOps & Systems Specialist',
        companyName: 'Nexus Infrastructure',
        location: 'Hyderabad, India',
        workMode: 'ON_SITE',
        employmentType: 'FULL_TIME',
        experienceLevel: 'Mid-Senior',
        description: 'Maintain high availability multi-region Kubernetes clusters and CI/CD pipelines.',
        minComp: 2200000,
        maxComp: 3500000,
      },
    ];

    seedOpportunities.forEach((opp) => {
      const oppId = this.uuid();
      this.opportunities.set(oppId, {
        id: oppId,
        organizationId: null,
        roleId: null,
        title: opp.title,
        companyName: opp.companyName,
        location: opp.location,
        workMode: opp.workMode,
        employmentType: opp.employmentType,
        experienceLevel: opp.experienceLevel,
        description: opp.description,
        source: 'SkillSetu Intelligence',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Compensation
      const compId = this.uuid();
      this.advertisedCompensations.set(compId, {
        id: compId,
        opportunityId: oppId,
        roleId: null,
        location: opp.location,
        minCompensation: opp.minComp,
        maxCompensation: opp.maxComp,
        currency: 'INR',
        period: 'ANNUAL',
        source: 'Advertised Opportunity Data',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // 4. Seed Curated Learning Paths
    const seedLearningPaths = [
      {
        title: 'Advanced Backend Engineering & System Scalability',
        description: 'Master distributed backend patterns, PostgreSQL optimization, and high-concurrency microservices.',
        level: 'Intermediate',
        estimatedHours: 48,
        resources: [
          { title: 'Designing Data-Intensive Applications Core Concepts', provider: 'SkillSetu Learning', resourceType: 'Course', difficulty: 'Advanced', estimatedDuration: '12 hours' },
          { title: 'PostgreSQL Indexing & Query Tuning Masterclass', provider: 'Database Insights', resourceType: 'Workshop', difficulty: 'Advanced', estimatedDuration: '8 hours' },
          { title: 'Building Resilient Microservices with Node.js', provider: 'SkillSetu Labs', resourceType: 'Project', difficulty: 'Intermediate', estimatedDuration: '16 hours' },
        ],
      },
      {
        title: 'Production Full-Stack Architecture Masterclass',
        description: 'End-to-end modern web applications with state synchronization and performance tuning.',
        level: 'Intermediate',
        estimatedHours: 36,
        resources: [
          { title: 'React 19 Server Components & State Patterns', provider: 'Modern Web Academy', resourceType: 'Course', difficulty: 'Intermediate', estimatedDuration: '10 hours' },
          { title: 'Full-Stack Security & JWT Rotation Architecture', provider: 'SkillSetu Security', resourceType: 'Guide', difficulty: 'Advanced', estimatedDuration: '6 hours' },
        ],
      },
    ];

    seedLearningPaths.forEach((lp) => {
      const pathId = this.uuid();
      this.learningPaths.set(pathId, {
        id: pathId,
        title: lp.title,
        description: lp.description,
        targetRoleId: null,
        level: lp.level,
        estimatedHours: lp.estimatedHours,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      lp.resources.forEach((r, idx) => {
        const resId = this.uuid();
        this.learningResources.set(resId, {
          id: resId,
          moduleId: null,
          skillId: null,
          title: r.title,
          provider: r.provider,
          url: 'https://skillsetu.com/learning/' + resId,
          resourceType: r.resourceType,
          difficulty: r.difficulty,
          estimatedDuration: r.estimatedDuration,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // 5. Seed Core Organization: Apex Global Technologies
    const orgId = 'org-apex-001';
    this.organizations.set(orgId, {
      id: orgId,
      name: 'Apex Global Technologies',
      legalName: 'Apex Global Technologies Pvt Ltd',
      industry: 'Software & Enterprise Cloud',
      companySize: '250-500',
      location: 'Bengaluru, India',
      description: 'Leading enterprise provider of cloud architectures, distributed backend pipelines, and workflow intelligence systems.',
      website: 'https://apextech.example.com',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed Departments
    const deptEngineering = { id: 'dept-eng-001', organizationId: orgId, name: 'Engineering', headcount: 85, description: 'Core product engineering, frontend, backend and platforms', createdAt: new Date(), updatedAt: new Date() };
    const deptCloud = { id: 'dept-cloud-002', organizationId: orgId, name: 'Cloud Infrastructure & DevOps', headcount: 24, description: 'Cloud infrastructure, reliability, and continuous deployment', createdAt: new Date(), updatedAt: new Date() };
    const deptProduct = { id: 'dept-prod-003', organizationId: orgId, name: 'Product & Design', headcount: 18, description: 'Product management and design systems', createdAt: new Date(), updatedAt: new Date() };
    const deptData = { id: 'dept-data-004', organizationId: orgId, name: 'Data & Intelligence', headcount: 15, description: 'Analytics and intelligent automation', createdAt: new Date(), updatedAt: new Date() };

    this.departments.set(deptEngineering.id, deptEngineering);
    this.departments.set(deptCloud.id, deptCloud);
    this.departments.set(deptProduct.id, deptProduct);
    this.departments.set(deptData.id, deptData);

    // Map skill names to skill IDs for organization skills & future skills

    const orgSkillsSeed = [
      { skillName: 'React.js', currentCapability: 82, targetCapability: 88, workforceCount: 42, priority: 'HIGH' },
      { skillName: 'Node.js', currentCapability: 78, targetCapability: 88, workforceCount: 38, priority: 'HIGH' },
      { skillName: 'JavaScript', currentCapability: 86, targetCapability: 90, workforceCount: 48, priority: 'HIGH' },
      { skillName: 'PostgreSQL', currentCapability: 70, targetCapability: 85, workforceCount: 28, priority: 'HIGH' },
      { skillName: 'Docker', currentCapability: 66, targetCapability: 80, workforceCount: 24, priority: 'MEDIUM' },
      { skillName: 'Kubernetes', currentCapability: 42, targetCapability: 80, workforceCount: 12, priority: 'CRITICAL' },
      { skillName: 'AWS Cloud', currentCapability: 54, targetCapability: 80, workforceCount: 16, priority: 'HIGH' },
      { skillName: 'CI/CD Pipelines', currentCapability: 64, targetCapability: 80, workforceCount: 20, priority: 'MEDIUM' },
      { skillName: 'Python', currentCapability: 38, targetCapability: 70, workforceCount: 10, priority: 'HIGH' },
      { skillName: 'System Architecture', currentCapability: 52, targetCapability: 80, workforceCount: 14, priority: 'HIGH' },
      { skillName: 'Tailwind CSS', currentCapability: 76, targetCapability: 80, workforceCount: 30, priority: 'LOW' },
      { skillName: 'REST APIs', currentCapability: 84, targetCapability: 90, workforceCount: 44, priority: 'HIGH' },
    ];

    orgSkillsSeed.forEach((item) => {
      const sId = getSkillId(item.skillName);
      if (sId) {
        const id = this.uuid();
        this.organizationSkills.set(`${orgId}_${sId}`, {
          id,
          organizationId: orgId,
          skillId: sId,
          currentCapability: item.currentCapability,
          targetCapability: item.targetCapability,
          workforceCount: item.workforceCount,
          priority: item.priority,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Seed Future Skills
    const futureSkillsSeed = [
      { skillName: 'Kubernetes', planningHorizon: 'MONTHS_12', priority: 'CRITICAL', requiredCapability: 85, currentCapability: 42, notes: 'Planning Assumption: Migration to microservices mesh' },
      { skillName: 'Python', planningHorizon: 'MONTHS_24', priority: 'HIGH', requiredCapability: 80, currentCapability: 38, notes: 'Planning Assumption: Expansion of internal automation' },
      { skillName: 'AWS Cloud', planningHorizon: 'MONTHS_12', priority: 'HIGH', requiredCapability: 85, currentCapability: 54, notes: 'Planning Assumption: Multi-region cloud resilience' },
      { skillName: 'System Architecture', planningHorizon: 'MONTHS_24', priority: 'HIGH', requiredCapability: 85, currentCapability: 52, notes: 'Planning Assumption: Enterprise tier architecture scale' },
    ];

    futureSkillsSeed.forEach((item) => {
      const sId = getSkillId(item.skillName);
      if (sId) {
        const id = this.uuid();
        this.futureSkills.set(`${orgId}_${sId}_${item.planningHorizon}`, {
          id,
          organizationId: orgId,
          skillId: sId,
          planningHorizon: item.planningHorizon,
          priority: item.priority,
          requiredCapability: item.requiredCapability,
          currentCapability: item.currentCapability,
          notes: item.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // Seed Planning Scenarios
    const scenario1 = {
      id: 'scen-apex-001',
      organizationId: orgId,
      name: 'Q3-Q4 Cloud Scale Expansion',
      description: 'Strategic planning scenario modeling cloud migration and microservices expansion.',
      planningHorizon: 'MONTHS_12',
      workforceGrowthPct: 15.0,
      skillDemandChangePct: 25.0,
      hiringCapacity: 12,
      developmentCapacity: 25,
      targetTimeline: '12 Months',
      metrics: {
        totalNewHeadcountNeeded: 12,
        internalUpskillingCandidates: 25,
        estimatedHiringWeeks: 8,
        capabilityImprovementTarget: '+28%',
      },
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.planningScenarios.set(scenario1.id, scenario1);

    // Seed Planning Roadmap Actions
    const k8sSkillId = getSkillId('Kubernetes');
    const pgSkillId = getSkillId('PostgreSQL');

    const roadmap1 = {
      id: 'act-apex-001',
      organizationId: orgId,
      title: 'Hire Senior Cloud Infrastructure Specialist',
      actionType: 'HIRE',
      skillId: k8sSkillId,
      departmentId: deptCloud.id,
      targetCount: 2,
      completedCount: 1,
      progressPct: 50,
      priority: 'HIGH',
      timeframe: 'Q1-Q2',
      rationale: 'Address critical Kubernetes and AWS infrastructure gap in Cloud team',
      status: 'IN_PROGRESS',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const roadmap2 = {
      id: 'act-apex-002',
      organizationId: orgId,
      title: 'PostgreSQL Advanced Query & Tuning Upskilling Program',
      actionType: 'UPSKILL',
      skillId: pgSkillId,
      departmentId: deptEngineering.id,
      targetCount: 15,
      completedCount: 8,
      progressPct: 53,
      priority: 'MEDIUM',
      timeframe: 'Q2',
      rationale: 'Boost database capability from 70 to 85 across core backend engineers',
      status: 'IN_PROGRESS',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.planningRoadmapActions.set(roadmap1.id, roadmap1);
    this.planningRoadmapActions.set(roadmap2.id, roadmap2);

    // Seed Organization Learning Programs
    const prog1 = {
      id: 'prog-apex-001',
      organizationId: orgId,
      title: 'Enterprise Cloud & Kubernetes Acceleration',
      description: 'Hands-on intensive development program for production container orchestration.',
      targetSkillId: k8sSkillId,
      targetCapability: 80,
      enrolledCount: 18,
      completedCount: 9,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const prog2 = {
      id: 'prog-apex-002',
      organizationId: orgId,
      title: 'Modern Distributed Microservices in Node.js',
      description: 'Advanced architecture patterns, asynchronous messaging, and resilience.',
      targetSkillId: getSkillId('Node.js'),
      targetCapability: 85,
      enrolledCount: 24,
      completedCount: 14,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.organizationLearningPrograms.set(prog1.id, prog1);
    this.organizationLearningPrograms.set(prog2.id, prog2);

    // Seed Realistic Candidates for Talent Matching & Comparison
    const seedCandidateData = [
      {
        fullName: 'Alex Morgan',
        headline: 'Lead Full Stack Platform Engineer',
        location: 'Bengaluru, India',
        education: 'B.Tech in Computer Science, NIT Trichy',
        currentStatus: 'Ready for opportunities',
        skills: [
          { name: 'JavaScript', prof: 'EXPERT', yoe: 6 },
          { name: 'React.js', prof: 'EXPERT', yoe: 5 },
          { name: 'Node.js', prof: 'ADVANCED', yoe: 5 },
          { name: 'PostgreSQL', prof: 'ADVANCED', yoe: 4 },
          { name: 'Tailwind CSS', prof: 'ADVANCED', yoe: 4 },
          { name: 'REST APIs', prof: 'ADVANCED', yoe: 5 },
        ],
        experiences: [
          { company: 'Nova Labs', roleTitle: 'Senior Full Stack Engineer', location: 'Bengaluru, India', startDate: new Date('2021-03-01'), isCurrent: true, description: 'Led architecture of real-time web platform.' },
        ],
      },
      {
        fullName: 'Priya Sharma',
        headline: 'Senior Distributed Backend & Systems Engineer',
        location: 'Bengaluru, India',
        education: 'M.Tech Software Engineering, BITS Pilani',
        currentStatus: 'Exploring senior roles',
        skills: [
          { name: 'Node.js', prof: 'EXPERT', yoe: 6 },
          { name: 'PostgreSQL', prof: 'ADVANCED', yoe: 5 },
          { name: 'REST APIs', prof: 'EXPERT', yoe: 6 },
          { name: 'System Architecture', prof: 'ADVANCED', yoe: 4 },
          { name: 'Docker', prof: 'ADVANCED', yoe: 3 },
          { name: 'Python', prof: 'INTERMEDIATE', yoe: 3 },
        ],
        experiences: [
          { company: 'FinScale Tech', roleTitle: 'Lead Backend Engineer', location: 'Bengaluru, India', startDate: new Date('2020-07-01'), isCurrent: true, description: 'Architected high-throughput payment pipelines handling 50k req/min.' },
        ],
      },
      {
        fullName: 'David Chen',
        headline: 'Senior Cloud & DevOps Architect',
        location: 'Hyderabad, India',
        education: 'B.Tech Information Technology, IIIT Hyderabad',
        currentStatus: 'Actively interviewing',
        skills: [
          { name: 'Docker', prof: 'EXPERT', yoe: 6 },
          { name: 'Kubernetes', prof: 'ADVANCED', yoe: 5 },
          { name: 'AWS Cloud', prof: 'ADVANCED', yoe: 5 },
          { name: 'CI/CD Pipelines', prof: 'ADVANCED', yoe: 4 },
          { name: 'Node.js', prof: 'INTERMEDIATE', yoe: 2 },
        ],
        experiences: [
          { company: 'SkyInfra Systems', roleTitle: 'Staff DevOps Specialist', location: 'Hyderabad, India', startDate: new Date('2021-01-01'), isCurrent: true, description: 'Architected multi-region Kubernetes deployments and CI/CD pipelines.' },
        ],
      },
    ];

    seedCandidateData.forEach((cand) => {
      const uId = this.uuid();
      const pId = this.uuid();
      const email = `${cand.fullName.toLowerCase().replace(/\s+/g, '.')}@candidate.example.com`;

      this.users.set(uId, {
        id: uId,
        email,
        passwordHash: '$2b$10$fakeseedhashforpasswords',
        accountType: 'INDIVIDUAL',
        status: 'ACTIVE',
        emailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.individualProfiles.set(uId, {
        id: pId,
        userId: uId,
        fullName: cand.fullName,
        headline: cand.headline,
        location: cand.location,
        education: cand.education,
        currentStatus: cand.currentStatus,
        targetRoleId: null,
        targetIndustry: 'Technology',
        experienceSummary: `${cand.fullName} has extensive experience in engineering scalable solutions.`,
        careerGoals: ['Lead engineering initiatives', 'Deliver high availability platforms'],
        completeness: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      cand.skills.forEach((sk) => {
        const sId = getSkillId(sk.name);
        if (sId) {
          const usId = this.uuid();
          this.userSkills.set(`${pId}_${sId}`, {
            id: usId,
            profileId: pId,
            skillId: sId,
            proficiency: sk.prof,
            yearsOfExperience: sk.yoe,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      cand.experiences.forEach((exp) => {
        const expId = this.uuid();
        this.experiences.set(expId, {
          id: expId,
          profileId: pId,
          company: exp.company,
          roleTitle: exp.roleTitle,
          employmentType: 'FULL_TIME',
          location: exp.location,
          startDate: exp.startDate,
          endDate: null,
          isCurrent: exp.isCurrent,
          description: exp.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // 6. Seed Historical Demand Observations (Phase 25)
    const demandQuarters = [
      '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4',
      '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4',
      '2026-Q1', '2026-Q2', '2026-Q3'
    ];

    const skillDemandCurves = {
      'React.js': [60, 68, 75, 82, 90, 100, 112, 125, 138, 152, 170],
      'Node.js': [55, 62, 70, 78, 85, 95, 105, 118, 130, 144, 160],
      'TypeScript': [40, 48, 58, 70, 85, 102, 120, 140, 165, 192, 220],
      'Python': [70, 78, 85, 92, 102, 115, 128, 142, 158, 175, 195],
      'Docker': [45, 52, 60, 68, 76, 86, 96, 108, 120, 134, 150],
      'Kubernetes': [30, 35, 42, 50, 60, 72, 85, 100, 115, 132, 152],
      'AWS Cloud': [50, 58, 66, 74, 82, 92, 102, 114, 126, 140, 156],
      'PostgreSQL': [50, 55, 60, 65, 70, 76, 82, 89, 96, 104, 112],
      'REST APIs': [80, 81, 82, 80, 83, 82, 84, 83, 85, 84, 85],
      'GraphQL': [40, 42, 45, 44, 43, 41, 39, 36, 34, 32, 30],
      'System Architecture': [35, 38, 42, 45, 48, 52, 56, 60, 64, 68, 72],
      'Tailwind CSS': [25, 32, 40, 50, 62, 75, 90, 105, 122, 140, 160],
      'Data Structures': [50, 50, 49, 51, 50, 50, 51, 49, 50, 50, 50],
      'CI/CD Pipelines': [40, 46, 52, 58, 65, 73, 82, 92, 102, 113, 125],
      'JavaScript': [90, 92, 95, 96, 98, 100, 102, 104, 105, 106, 108]
    };

    const roleDemandCurves = {
      'Backend Software Engineer': [80, 88, 98, 108, 120, 132, 145, 160, 175, 192, 210],
      'Full Stack Engineer': [75, 84, 94, 104, 115, 128, 142, 158, 174, 190, 208],
      'Cloud & DevOps Architect': [50, 58, 68, 78, 90, 102, 116, 130, 145, 162, 180]
    };

    const locations = ['Bengaluru, India', 'Delhi NCR, India', 'Hyderabad, India', 'Remote, India'];
    const experienceLevels = ['Entry', 'Mid', 'Senior'];

    // Seed Skill Demand Observations
    for (const [skillName, counts] of Object.entries(skillDemandCurves)) {
      const skillId = getSkillId(skillName);
      if (!skillId) continue;

      demandQuarters.forEach((period, idx) => {
        const baseCount = counts[idx] || 50;
        const obsId = this.uuid();
        this.skillDemandObservations.set(obsId, {
          id: obsId,
          skillId,
          roleId: null,
          location: locations[idx % locations.length],
          experienceLevel: experienceLevels[idx % experienceLevels.length],
          period,
          demandCount: baseCount,
          sourceType: 'SEEDED',
          sourceCount: Math.round(baseCount * 1.5),
          dataQuality: 'MEDIUM',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Seed Role Demand Observations
    for (const [roleName, counts] of Object.entries(roleDemandCurves)) {
      const roleId = getRoleId(roleName);
      if (!roleId) continue;

      demandQuarters.forEach((period, idx) => {
        const baseCount = counts[idx] || 60;
        const obsId = this.uuid();
        this.roleDemandObservations.set(obsId, {
          id: obsId,
          roleId,
          location: locations[idx % locations.length],
          experienceLevel: experienceLevels[idx % experienceLevels.length],
          period,
          demandCount: baseCount,
          sourceType: 'SEEDED',
          sourceCount: Math.round(baseCount * 1.4),
          dataQuality: 'MEDIUM',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }
  }

  // Model: User
  user = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        email: data.email,
        passwordHash: data.passwordHash || null,
        accountType: data.accountType || 'INDIVIDUAL',
        status: data.status || 'ACTIVE',
        emailVerified: data.emailVerified || false,
        emailVerifiedAt: data.emailVerifiedAt || null,
        lastLoginAt: data.lastLoginAt || null,
        failedLoginAttempts: data.failedLoginAttempts || 0,
        lockedUntil: data.lockedUntil || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(id, record);
      return this._formatUser(record);
    },
    findUnique: async ({ where, include, select }) => {
      let found = null;
      if (where.id) {
        found = this.users.get(where.id);
      } else if (where.email) {
        for (const u of this.users.values()) {
          if (u.email.toLowerCase() === where.email.toLowerCase()) {
            found = u;
            break;
          }
        }
      }
      if (!found) return null;
      return this._formatUser(found, include, select);
    },
    update: async ({ where, data, include, select }) => {
      const user = await this.user.findUnique({ where });
      if (!user) throw new Error('User not found for update');
      const updated = {
        ...this.users.get(user.id),
        ...data,
        updatedAt: new Date(),
      };
      this.users.set(user.id, updated);
      return this._formatUser(updated, include, select);
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      for (const [id, u] of this.users.entries()) {
        if (where.id && u.id !== where.id) continue;
        if (where.email && u.email !== where.email) continue;
        this.users.set(id, { ...u, ...data, updatedAt: new Date() });
        count++;
      }
      return { count };
    },
    count: async () => this.users.size,
  };

  _formatUser(u, include = {}, select = null) {
    const clone = { ...u };
    if (include?.profile || select?.profile) {
      clone.profile = this._formatProfile(this.individualProfiles.get(u.id) || null, include?.profile?.include || select?.profile?.select || select?.profile?.include);
    }
    if (include?.organizationMemberships || select?.organizationMemberships) {
      const memberships = [];
      for (const m of this.organizationMembers.values()) {
        if (m.userId === u.id) {
          const mClone = { ...m };
          if (include?.organizationMemberships?.include?.organization || select?.organizationMemberships?.select?.organization || select?.organizationMemberships?.include?.organization) {
            mClone.organization = this.organizations.get(m.organizationId) || null;
          }
          memberships.push(mClone);
        }
      }
      clone.organizationMemberships = memberships;
    }
    if (select) {
      const filtered = {};
      for (const k of Object.keys(select)) {
        if (select[k]) {
          filtered[k] = clone[k];
        }
      }
      return filtered;
    }
    return clone;
  }

  // Model: IndividualProfile
  individualProfile = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        fullName: data.fullName,
        headline: data.headline || null,
        location: data.location || null,
        education: data.education || null,
        currentStatus: data.currentStatus || null,
        targetRoleId: data.targetRoleId || null,
        targetIndustry: data.targetIndustry || null,
        experienceSummary: data.experienceSummary || null,
        careerGoals: data.careerGoals || [],
        learningPreferences: data.learningPreferences || null,
        workPreferences: data.workPreferences || null,
        completeness: data.completeness || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.individualProfiles.set(data.userId, record);
      return this._formatProfile(record);
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.userId) {
        record = this.individualProfiles.get(where.userId) || null;
      } else if (where.id) {
        for (const p of this.individualProfiles.values()) {
          if (p.id === where.id) {
            record = p;
            break;
          }
        }
      }
      return this._formatProfile(record, include);
    },
    update: async ({ where, data, include }) => {
      let targetUserId = where.userId;
      if (!targetUserId && where.id) {
        for (const [uid, p] of this.individualProfiles.entries()) {
          if (p.id === where.id) {
            targetUserId = uid;
            break;
          }
        }
      }
      const existing = this.individualProfiles.get(targetUserId);
      if (!existing) throw new Error('Individual profile not found for update');
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.individualProfiles.set(targetUserId, updated);
      return this._formatProfile(updated, include);
    },
    delete: async ({ where }) => {
      let targetUserId = where.userId;
      if (!targetUserId && where.id) {
        for (const [uid, p] of this.individualProfiles.entries()) {
          if (p.id === where.id) {
            targetUserId = uid;
            break;
          }
        }
      }
      const existing = this.individualProfiles.get(targetUserId);
      if (existing) {
        this.individualProfiles.delete(targetUserId);
      }
      return existing;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.individualProfiles.values());
      if (where.targetRoleId) {
        list = list.filter((p) => p.targetRoleId === where.targetRoleId);
      }
      if (where.fullName?.contains) {
        const q = where.fullName.contains.toLowerCase();
        list = list.filter((p) => p.fullName.toLowerCase().includes(q) || (p.headline && p.headline.toLowerCase().includes(q)));
      }
      return list.slice(skip, skip + take).map((p) => this._formatProfile(p, include));
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.individualProfiles.values());
      if (where.targetRoleId) list = list.filter((p) => p.targetRoleId === where.targetRoleId);
      return list.length;
    },
  };

  _formatProfile(p, include = {}) {
    if (!p) return null;
    const clone = { ...p };
    if (include?.targetRole && p.targetRoleId) {
      clone.targetRole = this.roles.get(p.targetRoleId) || null;
    }
    if (include?.skills) {
      const skills = [];
      for (const us of this.userSkills.values()) {
        if (us.profileId === p.id) {
          const usClone = { ...us };
          if (include.skills?.include?.skill) {
            usClone.skill = this.skills.get(us.skillId) || null;
          }
          skills.push(usClone);
        }
      }
      clone.skills = skills;
    }
    if (include?.experiences) {
      clone.experiences = Array.from(this.experiences.values()).filter((e) => e.profileId === p.id);
    }
    if (include?.educations) {
      clone.educations = Array.from(this.educations.values()).filter((e) => e.profileId === p.id);
    }
    if (include?.milestones) {
      clone.milestones = Array.from(this.growthMilestones.values()).filter((m) => m.profileId === p.id);
    }
    if (include?.projects) {
      clone.projects = Array.from(this.growthProjects.values()).filter((pr) => pr.profileId === p.id);
    }
    if (include?.capabilityEvidences) {
      clone.capabilityEvidences = Array.from(this.capabilityEvidences.values())
        .filter((ce) => ce.profileId === p.id)
        .map((ce) => {
          const ceClone = { ...ce };
          if (include.capabilityEvidences?.include?.skill) {
            ceClone.skill = this.skills.get(ce.skillId) || null;
          }
          return ceClone;
        });
    }
    return clone;
  }

  // Model: Skill
  skill = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const norm = data.normalizedName || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const record = {
        id,
        name: data.name,
        normalizedName: norm,
        category: data.category,
        description: data.description || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.skills.set(id, record);
      return record;
    },
    findUnique: async ({ where }) => {
      if (where.id) return this.skills.get(where.id) || null;
      if (where.normalizedName) {
        for (const s of this.skills.values()) {
          if (s.normalizedName === where.normalizedName) return s;
        }
      }
      if (where.name) {
        for (const s of this.skills.values()) {
          if (s.name.toLowerCase() === where.name.toLowerCase()) return s;
        }
      }
      return null;
    },
    findFirst: async ({ where = {}, orderBy } = {}) => {
      const list = await this.skill.findMany({ where, orderBy, take: 1 });
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.skills.values());
      if (where.isActive !== undefined) {
        list = list.filter((s) => s.isActive === where.isActive);
      }
      if (where.category) {
        list = list.filter((s) => s.category.toLowerCase() === where.category.toLowerCase());
      }
      if (typeof where.name === 'string') {
        list = list.filter((s) => s.name.toLowerCase() === where.name.toLowerCase());
      } else if (where.name?.contains) {
        const query = where.name.contains.toLowerCase();
        list = list.filter((s) => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query));
      }
      if (where.normalizedName) {
        list = list.filter((s) => s.normalizedName === where.normalizedName);
      }
      if (Array.isArray(where.OR) && where.OR.length > 0) {
        list = list.filter((s) =>
          where.OR.some((cond) => {
            if (cond.name && typeof cond.name === 'string' && s.name.toLowerCase() === cond.name.toLowerCase()) return true;
            if (cond.normalizedName && s.normalizedName === cond.normalizedName) return true;
            if (cond.name?.contains && s.name.toLowerCase().includes(cond.name.contains.toLowerCase())) return true;
            if (cond.category?.contains && s.category.toLowerCase().includes(cond.category.contains.toLowerCase())) return true;
            return false;
          })
        );
      }
      if (orderBy?.name === 'asc') list.sort((a, b) => a.name.localeCompare(b.name));
      return list.slice(skip, skip + take);
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.skills.values());
      if (where.isActive !== undefined) list = list.filter((s) => s.isActive === where.isActive);
      if (where.category) list = list.filter((s) => s.category.toLowerCase() === where.category.toLowerCase());
      if (typeof where.name === 'string') list = list.filter((s) => s.name.toLowerCase() === where.name.toLowerCase());
      if (where.name?.contains) list = list.filter((s) => s.name.toLowerCase().includes(where.name.contains.toLowerCase()));
      return list.length;
    },
  };

  // Model: SkillEmbedding (Phase 24 & Phase 34)
  skillEmbedding = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        skillId: data.skillId,
        model: data.model || 'paraphrase-multilingual-MiniLM-L12-v2',
        dimension: data.dimension || 384,
        embedding: data.embedding || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.skillEmbeddings.set(`${data.skillId}_${record.model}`, record);
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findUnique: async ({ where = {}, include } = {}) => {
      let record = null;
      if (where.skillId_model) {
        const key = `${where.skillId_model.skillId}_${where.skillId_model.model}`;
        record = this.skillEmbeddings.get(key) || null;
      } else if (where.id) {
        for (const se of this.skillEmbeddings.values()) {
          if (se.id === where.id) {
            record = se;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findFirst: async (params = {}) => {
      const list = await this.skillEmbedding.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.skillEmbeddings.values());
      if (where.skillId) list = list.filter((se) => se.skillId === where.skillId);
      if (where.model) list = list.filter((se) => se.model === where.model);
      if (where.dimension) list = list.filter((se) => se.dimension === where.dimension);
      return list.map((se) => {
        const clone = { ...se };
        if (include?.skill) clone.skill = this.skills.get(se.skillId) || null;
        return clone;
      });
    },
    update: async ({ where = {}, data = {}, include } = {}) => {
      let existing = null;
      let key = null;
      if (where.skillId_model) {
        key = `${where.skillId_model.skillId}_${where.skillId_model.model}`;
        existing = this.skillEmbeddings.get(key);
      } else if (where.id) {
        for (const [k, se] of this.skillEmbeddings.entries()) {
          if (se.id === where.id) {
            existing = se;
            key = k;
            break;
          }
        }
      }
      if (!existing) throw new Error('SkillEmbedding not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.skillEmbeddings.set(key, updated);
      const clone = { ...updated };
      if (include?.skill) clone.skill = this.skills.get(updated.skillId) || null;
      return clone;
    },
    upsert: async ({ where = {}, create = {}, update = {}, include } = {}) => {
      const existing = await this.skillEmbedding.findUnique({ where });
      if (existing) {
        return this.skillEmbedding.update({ where, data: update, include });
      }
      return this.skillEmbedding.create({ data: create, include });
    },
    delete: async ({ where = {} } = {}) => {
      let key = null;
      let existing = null;
      if (where.skillId_model) {
        key = `${where.skillId_model.skillId}_${where.skillId_model.model}`;
        existing = this.skillEmbeddings.get(key);
      } else if (where.id) {
        for (const [k, se] of this.skillEmbeddings.entries()) {
          if (se.id === where.id) {
            existing = se;
            key = k;
            break;
          }
        }
      }
      if (key) this.skillEmbeddings.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.skillEmbeddings.values());
      if (where.model) list = list.filter((se) => se.model === where.model);
      if (where.skillId) list = list.filter((se) => se.skillId === where.skillId);
      return list.length;
    },
  };

  // Model: UserSkill
  userSkill = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        skillId: data.skillId,
        proficiency: data.proficiency || 'INTERMEDIATE',
        yearsOfExperience: data.yearsOfExperience || 0,
        isVerified: data.isVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userSkills.set(`${data.profileId}_${data.skillId}`, record);
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.profileId_skillId) {
        const key = `${where.profileId_skillId.profileId}_${where.profileId_skillId.skillId}`;
        record = this.userSkills.get(key) || null;
      } else if (where.id) {
        for (const us of this.userSkills.values()) {
          if (us.id === where.id) {
            record = us;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.userSkills.values());
      if (where.profileId) list = list.filter((us) => us.profileId === where.profileId);
      return list.map((us) => {
        const clone = { ...us };
        if (include?.skill) clone.skill = this.skills.get(us.skillId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      let existing = null;
      let key = null;
      if (where.profileId_skillId) {
        key = `${where.profileId_skillId.profileId}_${where.profileId_skillId.skillId}`;
        existing = this.userSkills.get(key);
      } else if (where.id) {
        for (const [k, us] of this.userSkills.entries()) {
          if (us.id === where.id) {
            existing = us;
            key = k;
            break;
          }
        }
      }
      if (!existing) throw new Error('UserSkill not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.userSkills.set(key, updated);
      const clone = { ...updated };
      if (include?.skill) clone.skill = this.skills.get(updated.skillId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      let key = null;
      let existing = null;
      if (where.profileId_skillId) {
        key = `${where.profileId_skillId.profileId}_${where.profileId_skillId.skillId}`;
        existing = this.userSkills.get(key);
      } else if (where.id) {
        for (const [k, us] of this.userSkills.entries()) {
          if (us.id === where.id) {
            existing = us;
            key = k;
            break;
          }
        }
      }
      if (key) this.userSkills.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.userSkills.values());
      if (where.profileId) list = list.filter((us) => us.profileId === where.profileId);
      return list.length;
    },
  };

  // Model: Role
  role = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const norm = data.normalizedName || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const record = {
        id,
        organizationId: data.organizationId || null,
        departmentId: data.departmentId || null,
        name: data.name,
        normalizedName: norm,
        category: data.category,
        description: data.description || null,
        experienceLevel: data.experienceLevel || 'Mid-Senior',
        importance: data.importance || 80,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.roles.set(id, record);
      const clone = { ...record };
      if (include?.department && record.departmentId) {
        clone.department = this.departments.get(record.departmentId) || null;
      }
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let r = null;
      if (where.id) r = this.roles.get(where.id) || null;
      if (!r && where.normalizedName) {
        for (const item of this.roles.values()) {
          if (item.normalizedName === where.normalizedName) {
            r = item;
            break;
          }
        }
      }
      if (!r && where.name) {
        for (const item of this.roles.values()) {
          if (item.name.toLowerCase() === where.name.toLowerCase()) {
            r = item;
            break;
          }
        }
      }
      if (!r) return null;
      const clone = { ...r };
      if (include?.department && r.departmentId) {
        clone.department = this.departments.get(r.departmentId) || null;
      }
      if (include?.roleSkills) {
        const skills = [];
        for (const rs of this.roleSkills.values()) {
          if (rs.roleId === r.id) {
            const rsClone = { ...rs };
            if (include.roleSkills?.include?.skill) {
              rsClone.skill = this.skills.get(rs.skillId) || null;
            }
            skills.push(rsClone);
          }
        }
        clone.roleSkills = skills;
      }
      return clone;
    },
    findFirst: async ({ where = {}, include } = {}) => {
      const list = await this.role.findMany({ where, include, take: 1 });
      return list[0] || null;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.roles.values());
      if (where.id) list = list.filter((r) => r.id === where.id);
      if (where.isActive !== undefined) list = list.filter((r) => r.isActive === where.isActive);
      if (where.organizationId !== undefined) {
        list = list.filter((r) => r.organizationId === where.organizationId || (!where.organizationId && !r.organizationId));
      }
      if (where.departmentId) list = list.filter((r) => r.departmentId === where.departmentId);
      if (where.category) list = list.filter((r) => r.category.toLowerCase() === where.category.toLowerCase());
      if (typeof where.name === 'string') {
        list = list.filter((r) => r.name.toLowerCase() === where.name.toLowerCase());
      } else if (where.name?.contains) {
        const q = where.name.contains.toLowerCase();
        list = list.filter((r) => r.name.toLowerCase().includes(q));
      }
      if (where.normalizedName) {
        list = list.filter((r) => r.normalizedName === where.normalizedName);
      }
      if (Array.isArray(where.OR) && where.OR.length > 0) {
        list = list.filter((r) => {
          return where.OR.some((cond) => {
            if (cond.name && typeof cond.name === 'string' && r.name.toLowerCase() === cond.name.toLowerCase()) return true;
            if (cond.normalizedName && r.normalizedName === cond.normalizedName) return true;
            if (cond.id && r.id === cond.id) return true;
            return false;
          });
        });
      }
      return list.slice(skip, skip + take).map((r) => {
        const clone = { ...r };
        if (include?.department && r.departmentId) clone.department = this.departments.get(r.departmentId) || null;
        if (include?.roleSkills) {
          clone.roleSkills = Array.from(this.roleSkills.values())
            .filter((rs) => rs.roleId === r.id)
            .map((rs) => ({
              ...rs,
              ...(include.roleSkills?.include?.skill && { skill: this.skills.get(rs.skillId) || null }),
            }));
        }
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      const existing = this.roles.get(where.id);
      if (!existing) throw new Error('Role not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.roles.set(where.id, updated);
      const clone = { ...updated };
      if (include?.department && updated.departmentId) clone.department = this.departments.get(updated.departmentId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      const existing = this.roles.get(where.id);
      if (existing) this.roles.delete(where.id);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.roles.values());
      if (where.organizationId !== undefined) {
        list = list.filter((r) => r.organizationId === where.organizationId);
      }
      return list.length;
    },
  };

  // Model: RoleSkill
  roleSkill = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        roleId: data.roleId,
        skillId: data.skillId,
        requirementType: data.requirementType || 'REQUIRED',
        importance: data.importance || 80,
        targetProficiency: data.targetProficiency || 'INTERMEDIATE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.roleSkills.set(id, record);
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.roleSkills.values());
      if (where.roleId) list = list.filter((rs) => rs.roleId === where.roleId);
      return list.map((rs) => {
        const clone = { ...rs };
        if (include?.skill) clone.skill = this.skills.get(rs.skillId) || null;
        if (include?.role) clone.role = this.roles.get(rs.roleId) || null;
        return clone;
      });
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, rs] of this.roleSkills.entries()) {
        if (where.roleId && rs.roleId === where.roleId) {
          this.roleSkills.delete(id);
          count++;
        }
      }
      return { count };
    },
  };

  // Model: Experience
  experience = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        company: data.company,
        roleTitle: data.roleTitle,
        employmentType: data.employmentType || 'FULL_TIME',
        location: data.location || null,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent || false,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.experiences.set(id, record);
      return record;
    },
    findUnique: async ({ where }) => this.experiences.get(where.id) || null,
    findMany: async ({ where = {}, orderBy } = {}) => {
      let list = Array.from(this.experiences.values());
      if (where.profileId) list = list.filter((e) => e.profileId === where.profileId);
      if (orderBy?.startDate === 'desc') list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      return list;
    },
    update: async ({ where, data }) => {
      const existing = this.experiences.get(where.id);
      if (!existing) throw new Error('Experience record not found');
      const updated = {
        ...existing,
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        updatedAt: new Date(),
      };
      this.experiences.set(where.id, updated);
      return updated;
    },
    delete: async ({ where }) => {
      const existing = this.experiences.get(where.id);
      if (existing) this.experiences.delete(where.id);
      return existing;
    },
  };

  // Model: Education
  education = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        institution: data.institution,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent || false,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.educations.set(id, record);
      return record;
    },
    findUnique: async ({ where }) => this.educations.get(where.id) || null,
    findMany: async ({ where = {}, orderBy } = {}) => {
      let list = Array.from(this.educations.values());
      if (where.profileId) list = list.filter((ed) => ed.profileId === where.profileId);
      if (orderBy?.startDate === 'desc') list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      return list;
    },
    update: async ({ where, data }) => {
      const existing = this.educations.get(where.id);
      if (!existing) throw new Error('Education record not found');
      const updated = {
        ...existing,
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        updatedAt: new Date(),
      };
      this.educations.set(where.id, updated);
      return updated;
    },
    delete: async ({ where }) => {
      const existing = this.educations.get(where.id);
      if (existing) this.educations.delete(where.id);
      return existing;
    },
  };

  // Model: Opportunity
  opportunity = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId || null,
        roleId: data.roleId || null,
        title: data.title,
        companyName: data.companyName,
        location: data.location || null,
        workMode: data.workMode || 'REMOTE',
        employmentType: data.employmentType || 'FULL_TIME',
        experienceLevel: data.experienceLevel || 'Mid-Senior',
        description: data.description || null,
        source: data.source || 'SkillSetu Intelligence',
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.opportunities.set(id, record);
      return record;
    },
    findUnique: async ({ where, include }) => {
      const opp = this.opportunities.get(where.id);
      if (!opp) return null;
      const clone = { ...opp };
      if (include?.skills) {
        clone.skills = Array.from(this.opportunitySkills.values())
          .filter((os) => os.opportunityId === opp.id)
          .map((os) => ({
            ...os,
            ...(include.skills?.include?.skill && { skill: this.skills.get(os.skillId) || null }),
          }));
      }
      if (include?.advertisedCompensations) {
        clone.advertisedCompensations = Array.from(this.advertisedCompensations.values()).filter(
          (c) => c.opportunityId === opp.id
        );
      }
      return clone;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 20 } = {}) => {
      let list = Array.from(this.opportunities.values());
      if (where.status) list = list.filter((o) => o.status === where.status);
      if (where.workMode) list = list.filter((o) => o.workMode === where.workMode);
      if (where.employmentType) list = list.filter((o) => o.employmentType === where.employmentType);
      if (where.title?.contains) {
        const q = where.title.contains.toLowerCase();
        list = list.filter((o) => o.title.toLowerCase().includes(q) || o.companyName.toLowerCase().includes(q));
      }
      const pageSlice = list.slice(skip, skip + take);
      return pageSlice.map((o) => {
        const clone = { ...o };
        if (include?.advertisedCompensations) {
          clone.advertisedCompensations = Array.from(this.advertisedCompensations.values()).filter(
            (c) => c.opportunityId === o.id
          );
        }
        return clone;
      });
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.opportunities.values());
      if (where.status) list = list.filter((o) => o.status === where.status);
      return list.length;
    },
  };

  // Model: SavedOpportunity
  savedOpportunity = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        opportunityId: data.opportunityId,
        notes: data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.savedOpportunities.set(`${data.userId}_${data.opportunityId}`, record);
      const clone = { ...record };
      if (include?.opportunity) clone.opportunity = this.opportunities.get(record.opportunityId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.userId_opportunityId) {
        const key = `${where.userId_opportunityId.userId}_${where.userId_opportunityId.opportunityId}`;
        record = this.savedOpportunities.get(key) || null;
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.opportunity) clone.opportunity = this.opportunities.get(record.opportunityId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.savedOpportunities.values());
      if (where.userId) list = list.filter((s) => s.userId === where.userId);
      return list.map((s) => {
        const clone = { ...s };
        if (include?.opportunity) {
          clone.opportunity = this.opportunities.get(s.opportunityId) || null;
        }
        return clone;
      });
    },
    delete: async ({ where }) => {
      const key = `${where.userId_opportunityId.userId}_${where.userId_opportunityId.opportunityId}`;
      const existing = this.savedOpportunities.get(key);
      if (existing) this.savedOpportunities.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.savedOpportunities.values());
      if (where.userId) list = list.filter((s) => s.userId === where.userId);
      return list.length;
    },
  };

  // Model: Application
  application = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        opportunityId: data.opportunityId,
        status: data.status || 'SAVED',
        appliedDate: new Date(),
        notes: data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.applications.set(`${data.userId}_${data.opportunityId}`, record);
      const clone = { ...record };
      if (include?.opportunity) clone.opportunity = this.opportunities.get(record.opportunityId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.userId_opportunityId) {
        const key = `${where.userId_opportunityId.userId}_${where.userId_opportunityId.opportunityId}`;
        record = this.applications.get(key) || null;
      } else if (where.id) {
        for (const app of this.applications.values()) {
          if (app.id === where.id) {
            record = app;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.opportunity) clone.opportunity = this.opportunities.get(record.opportunityId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.applications.values());
      if (where.userId) list = list.filter((a) => a.userId === where.userId);
      if (where.status) list = list.filter((a) => a.status === where.status);
      return list.map((a) => {
        const clone = { ...a };
        if (include?.opportunity) clone.opportunity = this.opportunities.get(a.opportunityId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      let existing = null;
      let key = null;
      if (where.id) {
        for (const [k, app] of this.applications.entries()) {
          if (app.id === where.id) {
            existing = app;
            key = k;
            break;
          }
        }
      }
      if (!existing) throw new Error('Application not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.applications.set(key, updated);
      const clone = { ...updated };
      if (include?.opportunity) clone.opportunity = this.opportunities.get(updated.opportunityId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      let key = null;
      let existing = null;
      if (where.id) {
        for (const [k, app] of this.applications.entries()) {
          if (app.id === where.id) {
            existing = app;
            key = k;
            break;
          }
        }
      }
      if (key) this.applications.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.applications.values());
      if (where.userId) list = list.filter((a) => a.userId === where.userId);
      return list.length;
    },
  };

  // Model: LearningPath & Resource
  learningPath = {
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.learningPaths.values());
      if (where.isActive !== undefined) list = list.filter((lp) => lp.isActive === where.isActive);
      return list.map((lp) => {
        const clone = { ...lp };
        if (include?.resources) {
          clone.resources = Array.from(this.learningResources.values()).filter((r) => r.pathId === lp.id);
        }
        return clone;
      });
    },
    findUnique: async ({ where, include }) => {
      const lp = this.learningPaths.get(where.id);
      if (!lp) return null;
      const clone = { ...lp };
      if (include?.resources) {
        clone.resources = Array.from(this.learningResources.values()).filter((r) => r.pathId === lp.id);
      }
      return clone;
    },
    count: async () => this.learningPaths.size,
  };

  learningResource = {
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.learningResources.values());
      if (where.skillId) list = list.filter((r) => r.skillId === where.skillId);
      return list;
    },
  };

  // Model: GrowthMilestone
  growthMilestone = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        skillId: data.skillId || null,
        title: data.title,
        description: data.description || null,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        status: data.status || 'IN_PROGRESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.growthMilestones.set(id, record);
      return record;
    },
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.growthMilestones.values());
      if (where.profileId) list = list.filter((m) => m.profileId === where.profileId);
      return list;
    },
    update: async ({ where, data }) => {
      const m = this.growthMilestones.get(where.id);
      if (!m) throw new Error('Milestone not found for update');
      const updated = { ...m, ...data, updatedAt: new Date() };
      this.growthMilestones.set(where.id, updated);
      return updated;
    },
  };

  // Model: GrowthProject
  growthProject = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        title: data.title,
        description: data.description,
        skills: data.skills || [],
        repositoryUrl: data.repositoryUrl || null,
        status: data.status || 'IN_PROGRESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.growthProjects.set(id, record);
      return record;
    },
    findUnique: async ({ where }) => {
      const p = this.growthProjects.get(where.id);
      return p ? { ...p } : null;
    },
    findFirst: async ({ where = {} } = {}) => {
      for (const p of this.growthProjects.values()) {
        if (where.id && p.id !== where.id) continue;
        if (where.profileId && p.profileId !== where.profileId) continue;
        return { ...p };
      }
      return null;
    },
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.growthProjects.values());
      if (where.id) list = list.filter((p) => p.id === where.id);
      if (where.profileId) list = list.filter((p) => p.profileId === where.profileId);
      return list.map((p) => ({ ...p }));
    },
    update: async ({ where, data }) => {
      const existing = this.growthProjects.get(where.id);
      if (!existing) throw new Error('Growth project not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.growthProjects.set(where.id, updated);
      return { ...updated };
    },
    delete: async ({ where }) => {
      const existing = this.growthProjects.get(where.id);
      if (existing) this.growthProjects.delete(where.id);
      return existing;
    },
  };

  // Model: LearningProgress
  learningProgress = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        pathId: data.pathId || null,
        resourceId: data.resourceId || null,
        status: data.status || 'IN_PROGRESS',
        progressPct: data.progressPct || 0,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.learningProgress.set(id, record);
      const clone = { ...record };
      if (include?.resource && record.resourceId) {
        const res = this.learningResources.get(record.resourceId);
        clone.resource = res ? { ...res, skill: res.skillId ? this.skills.get(res.skillId) || null : null } : null;
      }
      return clone;
    },
    findFirst: async ({ where = {}, include } = {}) => {
      for (const lp of this.learningProgress.values()) {
        if (where.id && lp.id !== where.id) continue;
        if (where.userId && lp.userId !== where.userId) continue;
        if (where.resourceId && lp.resourceId !== where.resourceId) continue;
        const clone = { ...lp };
        if (include?.resource && lp.resourceId) {
          const res = this.learningResources.get(lp.resourceId);
          clone.resource = res ? { ...res, skill: res.skillId ? this.skills.get(res.skillId) || null : null } : null;
        }
        return clone;
      }
      return null;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.learningProgress.values());
      if (where.userId) list = list.filter((lp) => lp.userId === where.userId);
      if (where.pathId) list = list.filter((lp) => lp.pathId === where.pathId);
      if (where.resourceId) list = list.filter((lp) => lp.resourceId === where.resourceId);
      return list.map((lp) => {
        const clone = { ...lp };
        if (include?.resource && lp.resourceId) {
          const res = this.learningResources.get(lp.resourceId);
          clone.resource = res ? { ...res, skill: res.skillId ? this.skills.get(res.skillId) || null : null } : null;
        }
        return clone;
      });
    },
  };

  // Model: Organization
  organization = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        name: data.name,
        legalName: data.legalName || null,
        industry: data.industry,
        companySize: data.companySize,
        location: data.location || null,
        description: data.description || null,
        website: data.website || null,
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.organizations.set(id, record);
      return record;
    },
    findUnique: async ({ where, include }) => {
      const org = this.organizations.get(where.id);
      if (!org) return null;
      const clone = { ...org };
      if (include?.members) {
        clone.members = Array.from(this.organizationMembers.values()).filter((m) => m.organizationId === org.id);
      }
      if (include?.departments) {
        clone.departments = Array.from(this.departments.values()).filter((d) => d.organizationId === org.id);
      }
      if (include?.skills) {
        clone.skills = Array.from(this.organizationSkills.values())
          .filter((s) => s.organizationId === org.id)
          .map((os) => ({
            ...os,
            skill: this.skills.get(os.skillId) || null,
          }));
      }
      if (include?.futureSkills) {
        clone.futureSkills = Array.from(this.futureSkills.values())
          .filter((fs) => fs.organizationId === org.id)
          .map((fs) => ({
            ...fs,
            skill: this.skills.get(fs.skillId) || null,
          }));
      }
      return clone;
    },
    findFirst: async ({ where }) => {
      for (const org of this.organizations.values()) {
        if (where.id && org.id !== where.id) continue;
        if (where.name && org.name.toLowerCase() !== where.name.toLowerCase()) continue;
        return { ...org };
      }
      return null;
    },
    findMany: async () => Array.from(this.organizations.values()).map((o) => ({ ...o })),
    update: async ({ where, data }) => {
      const existing = this.organizations.get(where.id);
      if (!existing) throw new Error('Organization not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.organizations.set(where.id, updated);
      return { ...updated };
    },
    delete: async ({ where }) => {
      const existing = this.organizations.get(where.id);
      if (existing) this.organizations.delete(where.id);
      return existing;
    },
    count: async () => this.organizations.size,
  };

  // Model: OrganizationMember
  organizationMember = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        organizationId: data.organizationId,
        role: data.role || 'MEMBER',
        accessLevel: data.accessLevel || 'Viewer',
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.organizationMembers.set(`${data.userId}_${data.organizationId}`, record);
      const clone = { ...record };
      if (include?.user) {
        clone.user = this._formatUser(this.users.get(record.userId) || null);
      }
      if (include?.organization) {
        clone.organization = this.organizations.get(record.organizationId) || null;
      }
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.userId_organizationId) {
        const key = `${where.userId_organizationId.userId}_${where.userId_organizationId.organizationId}`;
        record = this.organizationMembers.get(key) || null;
      } else if (where.id) {
        for (const m of this.organizationMembers.values()) {
          if (m.id === where.id) {
            record = m;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.user) {
        clone.user = this._formatUser(this.users.get(record.userId) || null);
      }
      if (include?.organization) {
        clone.organization = this.organizations.get(record.organizationId) || null;
      }
      return clone;
    },
    findFirst: async ({ where, include }) => {
      for (const m of this.organizationMembers.values()) {
        if (where.id && m.id !== where.id) continue;
        if (where.userId && m.userId !== where.userId) continue;
        if (where.organizationId && m.organizationId !== where.organizationId) continue;
        if (where.status && m.status !== where.status) continue;
        const clone = { ...m };
        if (include?.user) clone.user = this._formatUser(this.users.get(m.userId) || null);
        if (include?.organization) clone.organization = this.organizations.get(m.organizationId) || null;
        return clone;
      }
      return null;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.organizationMembers.values());
      if (where.organizationId) list = list.filter((m) => m.organizationId === where.organizationId);
      if (where.userId) list = list.filter((m) => m.userId === where.userId);
      if (where.status) list = list.filter((m) => m.status === where.status);
      if (where.role) list = list.filter((m) => m.role.toUpperCase() === where.role.toUpperCase());
      if (where.accessLevel) list = list.filter((m) => m.accessLevel.toLowerCase() === where.accessLevel.toLowerCase());
      return list.slice(skip, skip + take).map((m) => {
        const clone = { ...m };
        if (include?.user) clone.user = this._formatUser(this.users.get(m.userId) || null);
        if (include?.organization) clone.organization = this.organizations.get(m.organizationId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      let existing = null;
      let key = null;
      if (where.id) {
        for (const [k, m] of this.organizationMembers.entries()) {
          if (m.id === where.id) {
            existing = m;
            key = k;
            break;
          }
        }
      } else if (where.userId_organizationId) {
        key = `${where.userId_organizationId.userId}_${where.userId_organizationId.organizationId}`;
        existing = this.organizationMembers.get(key) || null;
      }
      if (!existing) throw new Error('Organization member not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.organizationMembers.set(key, updated);
      const clone = { ...updated };
      if (include?.user) clone.user = this._formatUser(this.users.get(updated.userId) || null);
      if (include?.organization) clone.organization = this.organizations.get(updated.organizationId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      let existing = null;
      let key = null;
      if (where.id) {
        for (const [k, m] of this.organizationMembers.entries()) {
          if (m.id === where.id) {
            existing = m;
            key = k;
            break;
          }
        }
      } else if (where.userId_organizationId) {
        key = `${where.userId_organizationId.userId}_${where.userId_organizationId.organizationId}`;
        existing = this.organizationMembers.get(key) || null;
      }
      if (key) this.organizationMembers.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.organizationMembers.values());
      if (where.organizationId) list = list.filter((m) => m.organizationId === where.organizationId);
      if (where.status) list = list.filter((m) => m.status === where.status);
      return list.length;
    },
  };

  // Model: Department
  department = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        name: data.name,
        headcount: data.headcount || 0,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.departments.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where }) => {
      if (where.id) return this.departments.get(where.id) || null;
      if (where.organizationId_name) {
        for (const d of this.departments.values()) {
          if (
            d.organizationId === where.organizationId_name.organizationId &&
            d.name.toLowerCase() === where.organizationId_name.name.toLowerCase()
          ) {
            return { ...d };
          }
        }
      }
      return null;
    },
    findFirst: async ({ where }) => {
      for (const d of this.departments.values()) {
        if (where.organizationId && d.organizationId !== where.organizationId) continue;
        if (where.name && d.name.toLowerCase() !== where.name.toLowerCase()) continue;
        if (where.id && d.id !== where.id) continue;
        return { ...d };
      }
      return null;
    },
    findMany: async ({ where = {}, orderBy, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.departments.values());
      if (where.organizationId) list = list.filter((d) => d.organizationId === where.organizationId);
      if (where.name?.contains) {
        const q = where.name.contains.toLowerCase();
        list = list.filter((d) => d.name.toLowerCase().includes(q));
      }
      if (orderBy?.name === 'asc') list.sort((a, b) => a.name.localeCompare(b.name));
      return list.slice(skip, skip + take).map((d) => ({ ...d }));
    },
    update: async ({ where, data }) => {
      const existing = this.departments.get(where.id);
      if (!existing) throw new Error('Department not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.departments.set(where.id, updated);
      return { ...updated };
    },
    delete: async ({ where }) => {
      const existing = this.departments.get(where.id);
      if (existing) this.departments.delete(where.id);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.departments.values());
      if (where.organizationId) list = list.filter((d) => d.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: OrganizationSkill
  organizationSkill = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        skillId: data.skillId,
        currentCapability: data.currentCapability || 50,
        targetCapability: data.targetCapability || 80,
        workforceCount: data.workforceCount || 0,
        priority: data.priority || 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.organizationSkills.set(`${data.organizationId}_${data.skillId}`, record);
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.organizationId_skillId) {
        const key = `${where.organizationId_skillId.organizationId}_${where.organizationId_skillId.skillId}`;
        record = this.organizationSkills.get(key) || null;
      } else if (where.id) {
        for (const s of this.organizationSkills.values()) {
          if (s.id === where.id) {
            record = s;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findFirst: async ({ where, include }) => {
      for (const s of this.organizationSkills.values()) {
        if (where.organizationId && s.organizationId !== where.organizationId) continue;
        if (where.skillId && s.skillId !== where.skillId) continue;
        if (where.id && s.id !== where.id) continue;
        const clone = { ...s };
        if (include?.skill) clone.skill = this.skills.get(s.skillId) || null;
        return clone;
      }
      return null;
    },
    findMany: async ({ where = {}, include, orderBy, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.organizationSkills.values());
      if (where.organizationId) list = list.filter((s) => s.organizationId === where.organizationId);
      if (where.priority) list = list.filter((s) => s.priority === where.priority);
      if (where.skillId) list = list.filter((s) => s.skillId === where.skillId);
      return list.slice(skip, skip + take).map((s) => {
        const clone = { ...s };
        if (include?.skill) clone.skill = this.skills.get(s.skillId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      let existing = null;
      let key = null;
      if (where.organizationId_skillId) {
        key = `${where.organizationId_skillId.organizationId}_${where.organizationId_skillId.skillId}`;
        existing = this.organizationSkills.get(key) || null;
      } else if (where.id) {
        for (const [k, s] of this.organizationSkills.entries()) {
          if (s.id === where.id) {
            existing = s;
            key = k;
            break;
          }
        }
      }
      if (!existing) throw new Error('Organization skill not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.organizationSkills.set(key, updated);
      const clone = { ...updated };
      if (include?.skill) clone.skill = this.skills.get(updated.skillId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      let existing = null;
      let key = null;
      if (where.organizationId_skillId) {
        key = `${where.organizationId_skillId.organizationId}_${where.organizationId_skillId.skillId}`;
        existing = this.organizationSkills.get(key) || null;
      } else if (where.id) {
        for (const [k, s] of this.organizationSkills.entries()) {
          if (s.id === where.id) {
            existing = s;
            key = k;
            break;
          }
        }
      }
      if (key) this.organizationSkills.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.organizationSkills.values());
      if (where.organizationId) list = list.filter((s) => s.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: FutureSkill
  futureSkill = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        skillId: data.skillId,
        planningHorizon: data.planningHorizon || 'MONTHS_12',
        priority: data.priority || 'HIGH',
        requiredCapability: data.requiredCapability || 80,
        currentCapability: data.currentCapability || 30,
        notes: data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.futureSkills.set(`${data.organizationId}_${data.skillId}_${record.planningHorizon}`, record);
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.organizationId_skillId_planningHorizon) {
        const key = `${where.organizationId_skillId_planningHorizon.organizationId}_${where.organizationId_skillId_planningHorizon.skillId}_${where.organizationId_skillId_planningHorizon.planningHorizon}`;
        record = this.futureSkills.get(key) || null;
      } else if (where.id) {
        for (const fs of this.futureSkills.values()) {
          if (fs.id === where.id) {
            record = fs;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.skill) clone.skill = this.skills.get(record.skillId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.futureSkills.values());
      if (where.organizationId) list = list.filter((fs) => fs.organizationId === where.organizationId);
      if (where.planningHorizon) list = list.filter((fs) => fs.planningHorizon === where.planningHorizon);
      if (where.priority) list = list.filter((fs) => fs.priority === where.priority);
      return list.slice(skip, skip + take).map((fs) => {
        const clone = { ...fs };
        if (include?.skill) clone.skill = this.skills.get(fs.skillId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      let existing = null;
      let key = null;
      if (where.id) {
        for (const [k, fs] of this.futureSkills.entries()) {
          if (fs.id === where.id) {
            existing = fs;
            key = k;
            break;
          }
        }
      }
      if (!existing) throw new Error('Future skill not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.futureSkills.set(key, updated);
      const clone = { ...updated };
      if (include?.skill) clone.skill = this.skills.get(updated.skillId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      let existing = null;
      let key = null;
      if (where.id) {
        for (const [k, fs] of this.futureSkills.entries()) {
          if (fs.id === where.id) {
            existing = fs;
            key = k;
            break;
          }
        }
      }
      if (key) this.futureSkills.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.futureSkills.values());
      if (where.organizationId) list = list.filter((fs) => fs.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: TalentShortlist
  talentShortlist = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        candidateId: data.candidateId,
        notes: data.notes || null,
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.talentShortlists.set(`${data.organizationId}_${data.candidateId}`, record);
      const clone = { ...record };
      if (include?.candidate) {
        clone.candidate = this._findCandidateProfile(record.candidateId);
      }
      return clone;
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.organizationId_candidateId) {
        const key = `${where.organizationId_candidateId.organizationId}_${where.organizationId_candidateId.candidateId}`;
        record = this.talentShortlists.get(key) || null;
      } else if (where.id) {
        for (const ts of this.talentShortlists.values()) {
          if (ts.id === where.id) {
            record = ts;
            break;
          }
        }
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.candidate) clone.candidate = this._findCandidateProfile(record.candidateId);
      return clone;
    },
    findFirst: async ({ where = {}, include } = {}) => {
      for (const ts of this.talentShortlists.values()) {
        if (where.organizationId && ts.organizationId !== where.organizationId) continue;
        if (where.candidateId && ts.candidateId !== where.candidateId) continue;
        if (where.OR) {
          const matched = where.OR.some((cond) => {
            if (cond.candidateId && ts.candidateId === cond.candidateId) return true;
            return false;
          });
          if (!matched) continue;
        }
        const clone = { ...ts };
        if (include?.candidate) clone.candidate = this._findCandidateProfile(ts.candidateId);
        return clone;
      }
      return null;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.talentShortlists.values());
      if (where.organizationId) list = list.filter((ts) => ts.organizationId === where.organizationId);
      if (where.status) list = list.filter((ts) => ts.status === where.status);
      return list.slice(skip, skip + take).map((ts) => {
        const clone = { ...ts };
        if (include?.candidate) clone.candidate = this._findCandidateProfile(ts.candidateId);
        return clone;
      });
    },
    delete: async ({ where }) => {
      let key = null;
      let existing = null;
      if (where.organizationId_candidateId) {
        key = `${where.organizationId_candidateId.organizationId}_${where.organizationId_candidateId.candidateId}`;
        existing = this.talentShortlists.get(key) || null;
      } else if (where.id) {
        for (const [k, ts] of this.talentShortlists.entries()) {
          if (ts.id === where.id) {
            existing = ts;
            key = k;
            break;
          }
        }
      }
      if (key) this.talentShortlists.delete(key);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.talentShortlists.values());
      if (where.organizationId) list = list.filter((ts) => ts.organizationId === where.organizationId);
      return list.length;
    },
  };

  _findCandidateProfile(candidateId) {
    let p = null;
    for (const prof of this.individualProfiles.values()) {
      if (prof.id === candidateId || prof.userId === candidateId) {
        p = prof;
        break;
      }
    }
    if (!p) return null;
    return this._formatProfile(p, {
      skills: { include: { skill: true } },
      experiences: true,
      educations: true,
    });
  }

  // Model: PlanningScenario
  planningScenario = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        name: data.name,
        description: data.description || null,
        planningHorizon: data.planningHorizon || 'MONTHS_12',
        workforceGrowthPct: data.workforceGrowthPct || 0,
        skillDemandChangePct: data.skillDemandChangePct || 0,
        hiringCapacity: data.hiringCapacity || 0,
        developmentCapacity: data.developmentCapacity || 0,
        targetTimeline: data.targetTimeline || '12 Months',
        metrics: data.metrics || null,
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.planningScenarios.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where }) => this.planningScenarios.get(where.id) || null,
    findFirst: async ({ where }) => {
      for (const sc of this.planningScenarios.values()) {
        if (where.id && sc.id !== where.id) continue;
        if (where.organizationId && sc.organizationId !== where.organizationId) continue;
        return { ...sc };
      }
      return null;
    },
    findMany: async ({ where = {}, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.planningScenarios.values());
      if (where.organizationId) list = list.filter((sc) => sc.organizationId === where.organizationId);
      if (where.status) list = list.filter((sc) => sc.status === where.status);
      return list.slice(skip, skip + take).map((sc) => ({ ...sc }));
    },
    update: async ({ where, data }) => {
      const existing = this.planningScenarios.get(where.id);
      if (!existing) throw new Error('Planning scenario not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.planningScenarios.set(where.id, updated);
      return { ...updated };
    },
    delete: async ({ where }) => {
      const existing = this.planningScenarios.get(where.id);
      if (existing) this.planningScenarios.delete(where.id);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.planningScenarios.values());
      if (where.organizationId) list = list.filter((sc) => sc.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: PlanningRoadmapAction
  planningRoadmapAction = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        title: data.title,
        actionType: data.actionType || 'HIRE',
        skillId: data.skillId || null,
        departmentId: data.departmentId || null,
        targetCount: data.targetCount || 1,
        completedCount: data.completedCount || 0,
        progressPct: data.progressPct || 0,
        priority: data.priority || 'HIGH',
        timeframe: data.timeframe || 'Q1-Q2',
        rationale: data.rationale || null,
        status: data.status || 'IN_PROGRESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.planningRoadmapActions.set(id, record);
      const clone = { ...record };
      if (include?.skill && record.skillId) clone.skill = this.skills.get(record.skillId) || null;
      if (include?.department && record.departmentId) clone.department = this.departments.get(record.departmentId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      const act = this.planningRoadmapActions.get(where.id);
      if (!act) return null;
      const clone = { ...act };
      if (include?.skill && act.skillId) clone.skill = this.skills.get(act.skillId) || null;
      if (include?.department && act.departmentId) clone.department = this.departments.get(act.departmentId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.planningRoadmapActions.values());
      if (where.organizationId) list = list.filter((act) => act.organizationId === where.organizationId);
      if (where.actionType) list = list.filter((act) => act.actionType === where.actionType);
      if (where.status) list = list.filter((act) => act.status === where.status);
      return list.slice(skip, skip + take).map((act) => {
        const clone = { ...act };
        if (include?.skill && act.skillId) clone.skill = this.skills.get(act.skillId) || null;
        if (include?.department && act.departmentId) clone.department = this.departments.get(act.departmentId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      const existing = this.planningRoadmapActions.get(where.id);
      if (!existing) throw new Error('Roadmap action not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.planningRoadmapActions.set(where.id, updated);
      const clone = { ...updated };
      if (include?.skill && updated.skillId) clone.skill = this.skills.get(updated.skillId) || null;
      if (include?.department && updated.departmentId) clone.department = this.departments.get(updated.departmentId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      const existing = this.planningRoadmapActions.get(where.id);
      if (existing) this.planningRoadmapActions.delete(where.id);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.planningRoadmapActions.values());
      if (where.organizationId) list = list.filter((act) => act.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: OrganizationLearningProgram
  organizationLearningProgram = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        organizationId: data.organizationId,
        title: data.title,
        description: data.description || null,
        targetSkillId: data.targetSkillId || null,
        targetCapability: data.targetCapability || 80,
        enrolledCount: data.enrolledCount || 0,
        completedCount: data.completedCount || 0,
        status: data.status || 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.organizationLearningPrograms.set(id, record);
      const clone = { ...record };
      if (include?.targetSkill && record.targetSkillId) clone.targetSkill = this.skills.get(record.targetSkillId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      const prog = this.organizationLearningPrograms.get(where.id);
      if (!prog) return null;
      const clone = { ...prog };
      if (include?.targetSkill && prog.targetSkillId) clone.targetSkill = this.skills.get(prog.targetSkillId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.organizationLearningPrograms.values());
      if (where.organizationId) list = list.filter((p) => p.organizationId === where.organizationId);
      if (where.status) list = list.filter((p) => p.status === where.status);
      return list.slice(skip, skip + take).map((p) => {
        const clone = { ...p };
        if (include?.targetSkill && p.targetSkillId) clone.targetSkill = this.skills.get(p.targetSkillId) || null;
        return clone;
      });
    },
    update: async ({ where, data, include }) => {
      const existing = this.organizationLearningPrograms.get(where.id);
      if (!existing) throw new Error('Learning program not found for update');
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.organizationLearningPrograms.set(where.id, updated);
      const clone = { ...updated };
      if (include?.targetSkill && updated.targetSkillId) clone.targetSkill = this.skills.get(updated.targetSkillId) || null;
      return clone;
    },
    delete: async ({ where }) => {
      const existing = this.organizationLearningPrograms.get(where.id);
      if (existing) this.organizationLearningPrograms.delete(where.id);
      return existing;
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.organizationLearningPrograms.values());
      if (where.organizationId) list = list.filter((p) => p.organizationId === where.organizationId);
      return list.length;
    },
  };

  // Model: AuthSession
  authSession = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        expiresAt: data.expiresAt,
        revokedAt: data.revokedAt || null,
        lastUsedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.authSessions.set(id, record);
      return record;
    },
    findFirst: async ({ where, include }) => {
      for (const s of this.authSessions.values()) {
        if (where.id && s.id !== where.id) continue;
        if (where.refreshTokenHash && s.refreshTokenHash !== where.refreshTokenHash) continue;
        if (where.userId && s.userId !== where.userId) continue;
        
        const clone = { ...s };
        if (include?.user) {
          clone.user = this._formatUser(this.users.get(s.userId));
        }
        return clone;
      }
      return null;
    },
    findMany: async ({ where, orderBy, take, select }) => {
      const results = [];
      for (const s of this.authSessions.values()) {
        if (where.userId && s.userId !== where.userId) continue;
        if (where.revokedAt === null && s.revokedAt !== null) continue;
        results.push({ ...s });
      }
      if (orderBy?.lastUsedAt === 'desc') {
        results.sort((a, b) => b.lastUsedAt - a.lastUsedAt);
      }
      const sliced = take ? results.slice(0, take) : results;
      if (select) {
        return sliced.map((item) => {
          const res = {};
          for (const k of Object.keys(select)) {
            if (select[k]) res[k] = item[k];
          }
          return res;
        });
      }
      return sliced;
    },
    update: async ({ where, data }) => {
      const s = this.authSessions.get(where.id);
      if (!s) throw new Error('Session not found for update');
      const updated = { ...s, ...data, updatedAt: new Date() };
      this.authSessions.set(where.id, updated);
      return updated;
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      for (const [id, s] of this.authSessions.entries()) {
        if (where.userId && s.userId !== where.userId) continue;
        if (where.revokedAt === null && s.revokedAt !== null) continue;
        this.authSessions.set(id, { ...s, ...data, updatedAt: new Date() });
        count++;
      }
      return { count };
    },
    count: async () => this.authSessions.size,
  };

  // Model: EmailVerificationToken
  emailVerificationToken = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        usedAt: data.usedAt || null,
        createdAt: new Date(),
      };
      this.emailVerificationTokens.set(data.tokenHash, record);
      return record;
    },
    findUnique: async ({ where, include }) => {
      const record = this.emailVerificationTokens.get(where.tokenHash);
      if (!record) return null;
      const clone = { ...record };
      if (include?.user) {
        clone.user = this._formatUser(this.users.get(record.userId));
      }
      return clone;
    },
    update: async ({ where, data }) => {
      let target = null;
      for (const [hash, t] of this.emailVerificationTokens.entries()) {
        if (where.id && t.id === where.id) {
          target = { hash, ...t };
          break;
        }
      }
      if (!target) throw new Error('Token not found for update');
      const updated = { ...target, ...data };
      this.emailVerificationTokens.set(target.hash, updated);
      return updated;
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      for (const [hash, t] of this.emailVerificationTokens.entries()) {
        if (where.userId && t.userId !== where.userId) continue;
        if (where.usedAt === null && t.usedAt !== null) continue;
        this.emailVerificationTokens.set(hash, { ...t, ...data });
        count++;
      }
      return { count };
    },
  };

  // Model: PasswordResetToken
  passwordResetToken = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
        usedAt: data.usedAt || null,
        createdAt: new Date(),
      };
      this.passwordResetTokens.set(data.tokenHash, record);
      return record;
    },
    findUnique: async ({ where, include }) => {
      const record = this.passwordResetTokens.get(where.tokenHash);
      if (!record) return null;
      const clone = { ...record };
      if (include?.user) {
        clone.user = this._formatUser(this.users.get(record.userId));
      }
      return clone;
    },
    update: async ({ where, data }) => {
      let target = null;
      for (const [hash, t] of this.passwordResetTokens.entries()) {
        if (where.id && t.id === where.id) {
          target = { hash, ...t };
          break;
        }
      }
      if (!target) throw new Error('Password reset token not found for update');
      const updated = { ...target, ...data };
      this.passwordResetTokens.set(target.hash, updated);
      return updated;
    },
    updateMany: async ({ where, data }) => {
      let count = 0;
      for (const [hash, t] of this.passwordResetTokens.entries()) {
        if (where.userId && t.userId !== where.userId) continue;
        if (where.usedAt === null && t.usedAt !== null) continue;
        this.passwordResetTokens.set(hash, { ...t, ...data });
        count++;
      }
      return { count };
    },
  };

  // Model: AuthAuditLog
  authAuditLog = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId || null,
        action: data.action,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        metadata: data.metadata || null,
        createdAt: new Date(),
      };
      this.authAuditLogs.push(record);
      return record;
    },
  };

  // Model: AdvertisedCompensation
  advertisedCompensation = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        opportunityId: data.opportunityId || null,
        roleId: data.roleId || null,
        location: data.location || 'Bengaluru, India',
        minCompensation: data.minCompensation || 1800000,
        maxCompensation: data.maxCompensation || 3200000,
        currency: data.currency || 'INR',
        period: data.period || 'ANNUAL',
        source: data.source || 'Advertised Opportunity Data',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.advertisedCompensations.set(id, record);
      const clone = { ...record };
      if (include?.opportunity && record.opportunityId) clone.opportunity = this.opportunities.get(record.opportunityId) || null;
      if (include?.role && record.roleId) clone.role = this.roles.get(record.roleId) || null;
      return clone;
    },
    findUnique: async ({ where, include }) => {
      const c = this.advertisedCompensations.get(where.id);
      if (!c) return null;
      const clone = { ...c };
      if (include?.opportunity && c.opportunityId) clone.opportunity = this.opportunities.get(c.opportunityId) || null;
      if (include?.role && c.roleId) clone.role = this.roles.get(c.roleId) || null;
      return clone;
    },
    findMany: async ({ where = {}, include, skip = 0, take = 50 } = {}) => {
      let list = Array.from(this.advertisedCompensations.values());
      if (where.opportunityId) list = list.filter((c) => c.opportunityId === where.opportunityId);
      if (where.roleId) list = list.filter((c) => c.roleId === where.roleId);
      if (where.location) list = list.filter((c) => c.location === where.location);
      if (where.source) {
        if (typeof where.source === 'object' && Array.isArray(where.source.in)) {
          list = list.filter((c) => where.source.in.includes(c.source));
        } else {
          list = list.filter((c) => c.source === where.source);
        }
      }
      return list.slice(skip, skip + take).map((c) => {
        const clone = { ...c };
        if (include?.opportunity && c.opportunityId) clone.opportunity = this.opportunities.get(c.opportunityId) || null;
        if (include?.role && c.roleId) clone.role = this.roles.get(c.roleId) || null;
        return clone;
      });
    },
    count: async (args = {}) => {
      if (!args?.where) return this.advertisedCompensations.size;
      const list = await this.advertisedCompensation.findMany({ where: args.where, take: 999999 });
      return list.length;
    },
  };

  // Model: OpportunitySkill
  opportunitySkill = {
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.opportunitySkills.values());
      if (where.opportunityId) list = list.filter((os) => os.opportunityId === where.opportunityId);
      if (where.skillId) list = list.filter((os) => os.skillId === where.skillId);
      return list.map((os) => {
        const clone = { ...os };
        if (include?.skill) clone.skill = this.skills.get(os.skillId) || null;
        return clone;
      });
    },
  };

  // Model: LearningModule
  learningModule = {
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.learningModules.values());
      if (where.pathId) list = list.filter((m) => m.pathId === where.pathId);
      return list;
    },
  };

  // Model: LearningProgress
  learningProgress = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        pathId: data.pathId || null,
        moduleId: data.moduleId || null,
        progressPct: data.progressPct || 0,
        status: data.status || 'IN_PROGRESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.learningProgress.set(`${data.userId}_${data.pathId || data.moduleId}`, record);
      return record;
    },
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.learningProgress.values());
      if (where.userId) list = list.filter((lp) => lp.userId === where.userId);
      return list;
    },
  };

  // Model: AuthAuditLog
  authAuditLog = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId || null,
        action: data.action,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
        metadata: data.metadata || null,
        createdAt: new Date(),
      };
      this.authAuditLogs.push(record);
      return record;
    },
    findMany: async ({ where = {} } = {}) => {
      let list = [...this.authAuditLogs];
      if (where.userId) list = list.filter((l) => l.userId === where.userId);
      if (where.action) list = list.filter((l) => l.action === where.action);
      return list;
    },
  };

  // Model: SkillEmbedding
  skillEmbedding = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        skillId: data.skillId,
        model: data.model || 'all-MiniLM-L6-v2',
        dimension: data.dimension || 384,
        embedding: data.embedding || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.skillEmbeddings.set(`${data.skillId}_${record.model}`, record);
      return record;
    },
    upsert: async ({ where, update, create }) => {
      const key = where.skillId_model ? `${where.skillId_model.skillId}_${where.skillId_model.model}` : (where.id || `${create.skillId}_${create.model}`);
      const existing = this.skillEmbeddings.get(key);
      if (existing) {
        const updated = {
          ...existing,
          ...update,
          updatedAt: new Date(),
        };
        this.skillEmbeddings.set(key, updated);
        return updated;
      }
      return this.skillEmbedding.create({ data: create });
    },
    findUnique: async ({ where, include }) => {
      let record = null;
      if (where.id) {
        for (const emb of this.skillEmbeddings.values()) {
          if (emb.id === where.id) {
            record = emb;
            break;
          }
        }
      } else if (where.skillId_model) {
        record = this.skillEmbeddings.get(`${where.skillId_model.skillId}_${where.skillId_model.model}`) || null;
      }
      if (!record) return null;
      const clone = { ...record };
      if (include?.skill) {
        clone.skill = this.skills.get(record.skillId) || null;
      }
      return clone;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.skillEmbeddings.values());
      if (where.skillId) list = list.filter((e) => e.skillId === where.skillId);
      if (where.model) list = list.filter((e) => e.model === where.model);
      return list.map((e) => {
        const clone = { ...e };
        if (include?.skill) {
          clone.skill = this.skills.get(e.skillId) || null;
        }
        return clone;
      });
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.skillEmbeddings.values());
      if (where.model) list = list.filter((e) => e.model === where.model);
      return list.length;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [key, e] of this.skillEmbeddings.entries()) {
        if (where.model && e.model !== where.model) continue;
        if (where.skillId && e.skillId !== where.skillId) continue;
        this.skillEmbeddings.delete(key);
        count++;
      }
      return { count };
    },
  };

  // Model: SkillDemandObservation
  skillDemandObservation = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        skillId: data.skillId,
        roleId: data.roleId || null,
        location: data.location || null,
        experienceLevel: data.experienceLevel || null,
        period: data.period,
        demandCount: typeof data.demandCount === 'number' ? data.demandCount : 0,
        sourceType: data.sourceType || 'SEEDED',
        sourceCount: data.sourceCount || 1,
        dataQuality: data.dataQuality || 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.skillDemandObservations.set(id, record);
      return { ...record };
    },
    createMany: async ({ data }) => {
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        await this.skillDemandObservation.create({ data: item });
      }
      return { count: items.length };
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = Array.from(this.skillDemandObservations.values());
      if (where.skillId) list = list.filter((o) => o.skillId === where.skillId);
      if (where.roleId) list = list.filter((o) => o.roleId === where.roleId);
      if (where.period) list = list.filter((o) => o.period === where.period);
      if (where.location) list = list.filter((o) => o.location === where.location);
      if (where.experienceLevel) list = list.filter((o) => o.experienceLevel === where.experienceLevel);
      if (where.sourceType) list = list.filter((o) => o.sourceType === where.sourceType);

      if (orderBy?.period) {
        list.sort((a, b) => orderBy.period === 'desc' ? b.period.localeCompare(a.period) : a.period.localeCompare(b.period));
      }

      return list.map((o) => {
        const clone = { ...o };
        if (include?.skill) clone.skill = this.skills.get(o.skillId) || null;
        if (include?.role && o.roleId) clone.role = this.roles.get(o.roleId) || null;
        return clone;
      });
    },
    findFirst: async (params) => {
      const list = await this.skillDemandObservation.findMany(params);
      return list[0] || null;
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.skillDemandObservation.findMany({ where });
      return list.length;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, o] of this.skillDemandObservations.entries()) {
        if (where.skillId && o.skillId !== where.skillId) continue;
        if (where.roleId && o.roleId !== where.roleId) continue;
        if (where.period && o.period !== where.period) continue;
        this.skillDemandObservations.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: RoleDemandObservation
  roleDemandObservation = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        roleId: data.roleId,
        location: data.location || null,
        experienceLevel: data.experienceLevel || null,
        period: data.period,
        demandCount: typeof data.demandCount === 'number' ? data.demandCount : 0,
        sourceType: data.sourceType || 'SEEDED',
        sourceCount: data.sourceCount || 1,
        dataQuality: data.dataQuality || 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.roleDemandObservations.set(id, record);
      return { ...record };
    },
    createMany: async ({ data }) => {
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        await this.roleDemandObservation.create({ data: item });
      }
      return { count: items.length };
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = Array.from(this.roleDemandObservations.values());
      if (where.roleId) list = list.filter((o) => o.roleId === where.roleId);
      if (where.period) list = list.filter((o) => o.period === where.period);
      if (where.location) list = list.filter((o) => o.location === where.location);
      if (where.experienceLevel) list = list.filter((o) => o.experienceLevel === where.experienceLevel);
      if (where.sourceType) list = list.filter((o) => o.sourceType === where.sourceType);

      if (orderBy?.period) {
        list.sort((a, b) => orderBy.period === 'desc' ? b.period.localeCompare(a.period) : a.period.localeCompare(b.period));
      }

      return list.map((o) => {
        const clone = { ...o };
        if (include?.role) clone.role = this.roles.get(o.roleId) || null;
        return clone;
      });
    },
    findFirst: async (params) => {
      const list = await this.roleDemandObservation.findMany(params);
      return list[0] || null;
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.roleDemandObservation.findMany({ where });
      return list.length;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, o] of this.roleDemandObservations.entries()) {
        if (where.roleId && o.roleId !== where.roleId) continue;
        if (where.period && o.period !== where.period) continue;
        this.roleDemandObservations.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: DemandForecast
  demandForecast = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        skillId: data.skillId || null,
        roleId: data.roleId || null,
        forecastPeriod: data.forecastPeriod,
        predictedDemand: typeof data.predictedDemand === 'number' ? data.predictedDemand : 0,
        lowerBound: data.lowerBound !== undefined ? data.lowerBound : null,
        upperBound: data.upperBound !== undefined ? data.upperBound : null,
        confidenceScore: data.confidenceScore !== undefined ? data.confidenceScore : null,
        confidenceLevel: data.confidenceLevel || 'MEDIUM',
        model: data.model || 'LINEAR_TREND',
        generatedAt: new Date(),
        updatedAt: new Date(),
      };
      this.demandForecasts.set(id, record);
      return { ...record };
    },
    createMany: async ({ data }) => {
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        await this.demandForecast.create({ data: item });
      }
      return { count: items.length };
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = Array.from(this.demandForecasts.values());
      if (where.skillId) list = list.filter((f) => f.skillId === where.skillId);
      if (where.roleId) list = list.filter((f) => f.roleId === where.roleId);
      if (where.forecastPeriod) list = list.filter((f) => f.forecastPeriod === where.forecastPeriod);
      if (where.model) list = list.filter((f) => f.model === where.model);

      if (orderBy?.forecastPeriod) {
        list.sort((a, b) => orderBy.forecastPeriod === 'desc' ? b.forecastPeriod.localeCompare(a.forecastPeriod) : a.forecastPeriod.localeCompare(b.forecastPeriod));
      }

      return list.map((f) => {
        const clone = { ...f };
        if (include?.skill && f.skillId) clone.skill = this.skills.get(f.skillId) || null;
        if (include?.role && f.roleId) clone.role = this.roles.get(f.roleId) || null;
        return clone;
      });
    },
    findFirst: async (params) => {
      const list = await this.demandForecast.findMany(params);
      return list[0] || null;
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.demandForecast.findMany({ where });
      return list.length;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, f] of this.demandForecasts.entries()) {
        if (where.skillId && f.skillId !== where.skillId) continue;
        if (where.roleId && f.roleId !== where.roleId) continue;
        this.demandForecasts.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: DemandTrendSnapshot
  demandTrendSnapshot = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        skillId: data.skillId || null,
        roleId: data.roleId || null,
        currentDemand: typeof data.currentDemand === 'number' ? data.currentDemand : 0,
        previousDemand: typeof data.previousDemand === 'number' ? data.previousDemand : 0,
        growthRate: typeof data.growthRate === 'number' ? data.growthRate : 0,
        trendCategory: data.trendCategory || 'STABLE',
        volatility: typeof data.volatility === 'number' ? data.volatility : 0,
        confidence: data.confidence || 'MEDIUM',
        period: data.period || 'CURRENT',
        generatedAt: new Date(),
      };
      this.demandTrendSnapshots.set(id, record);
      return { ...record };
    },
    findMany: async ({ where = {}, include, orderBy } = {}) => {
      let list = Array.from(this.demandTrendSnapshots.values());
      if (where.skillId) list = list.filter((s) => s.skillId === where.skillId);
      if (where.roleId) list = list.filter((s) => s.roleId === where.roleId);
      if (where.trendCategory) list = list.filter((s) => s.trendCategory === where.trendCategory);
      if (where.period) list = list.filter((s) => s.period === where.period);

      return list.map((s) => {
        const clone = { ...s };
        if (include?.skill && s.skillId) clone.skill = this.skills.get(s.skillId) || null;
        if (include?.role && s.roleId) clone.role = this.roles.get(s.roleId) || null;
        return clone;
      });
    },
    findFirst: async (params) => {
      const list = await this.demandTrendSnapshot.findMany(params);
      return list[0] || null;
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.demandTrendSnapshot.findMany({ where });
      return list.length;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, s] of this.demandTrendSnapshots.entries()) {
        if (where.skillId && s.skillId !== where.skillId) continue;
        if (where.roleId && s.roleId !== where.roleId) continue;
        this.demandTrendSnapshots.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: Recommendation (Phase 26)
  recommendation = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId || null,
        organizationId: data.organizationId || null,
        type: data.type || 'SKILL_PRIORITY',
        entityType: data.entityType || null,
        entityId: data.entityId || null,
        title: data.title || 'Recommendation',
        summary: data.summary || '',
        priority: data.priority || 'MEDIUM',
        confidence: data.confidence || 'MEDIUM',
        dataQuality: data.dataQuality || 'MEDIUM',
        status: data.status || 'NEW',
        recommendedAction: data.recommendedAction || null,
        evidence: data.evidence || [],
        sourceSignals: data.sourceSignals || [],
        dismissReason: data.dismissReason || null,
        dismissNotes: data.dismissNotes || null,
        generatedAt: data.generatedAt ? new Date(data.generatedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.recommendations.set(id, record);
      return { ...record };
    },
    createMany: async ({ data = [] }) => {
      const records = [];
      for (const item of data) {
        const created = await this.recommendation.create({ data: item });
        records.push(created);
      }
      return { count: records.length };
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.recommendations.values());
      if (where.userId !== undefined) {
        if (where.userId === null) {
          list = list.filter((r) => r.userId === null);
        } else {
          list = list.filter((r) => r.userId === where.userId);
        }
      }
      if (where.organizationId !== undefined) {
        if (where.organizationId === null) {
          list = list.filter((r) => r.organizationId === null);
        } else {
          list = list.filter((r) => r.organizationId === where.organizationId);
        }
      }
      if (where.type) {
        if (where.type.in && Array.isArray(where.type.in)) {
          list = list.filter((r) => where.type.in.includes(r.type));
        } else {
          list = list.filter((r) => r.type === where.type);
        }
      }
      if (where.status) {
        if (where.status.in && Array.isArray(where.status.in)) {
          list = list.filter((r) => where.status.in.includes(r.status));
        } else if (where.status.not) {
          list = list.filter((r) => r.status !== where.status.not);
        } else {
          list = list.filter((r) => r.status === where.status);
        }
      }
      if (where.priority) {
        list = list.filter((r) => r.priority === where.priority);
      }
      if (where.entityType) {
        list = list.filter((r) => r.entityType === where.entityType);
      }
      if (where.entityId) {
        list = list.filter((r) => r.entityId === where.entityId);
      }

      // Sort by generatedAt desc by default
      list.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());

      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);

      return list.map((r) => ({ ...r }));
    },
    findFirst: async (params) => {
      const list = await this.recommendation.findMany(params);
      return list[0] || null;
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.recommendations.has(where.id)) {
        return { ...this.recommendations.get(where.id) };
      }
      return null;
    },
    update: async ({ where = {}, data = {} }) => {
      if (!where.id || !this.recommendations.has(where.id)) {
        throw new Error(`Recommendation not found with id: ${where.id}`);
      }
      const existing = this.recommendations.get(where.id);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.recommendations.set(where.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      if (!where.id || !this.recommendations.has(where.id)) {
        throw new Error(`Recommendation not found with id: ${where.id}`);
      }
      const existing = this.recommendations.get(where.id);
      this.recommendations.delete(where.id);
      return { ...existing };
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, r] of this.recommendations.entries()) {
        if (where.userId !== undefined && r.userId !== where.userId) continue;
        if (where.organizationId !== undefined && r.organizationId !== where.organizationId) continue;
        if (where.type && r.type !== where.type) continue;
        if (where.status && r.status !== where.status) continue;
        this.recommendations.delete(id);
        count++;
      }
      return { count };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.recommendation.findMany({ where });
      return list.length;
    },
  };

  // Model: RecommendationFeedback (Phase 26)
  recommendationFeedback = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        recommendationId: data.recommendationId,
        userId: data.userId || null,
        action: data.action || 'FEEDBACK_SUBMITTED',
        reason: data.reason || null,
        notes: data.notes || null,
        metadata: data.metadata || null,
        createdAt: new Date(),
      };
      this.recommendationFeedback.set(id, record);
      return { ...record };
    },
    findMany: async ({ where = {} } = {}) => {
      let list = Array.from(this.recommendationFeedback.values());
      if (where.recommendationId) {
        list = list.filter((f) => f.recommendationId === where.recommendationId);
      }
      if (where.userId) {
        list = list.filter((f) => f.userId === where.userId);
      }
      if (where.action) {
        list = list.filter((f) => f.action === where.action);
      }
      return list.map((f) => ({ ...f }));
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.recommendationFeedback.findMany({ where });
      return list.length;
    },
  };

  // Model: DataSource (Phase 28)
  dataSource = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        name: data.name,
        type: data.type || 'JOB_POSTINGS',
        provider: data.provider || 'UNKNOWN',
        description: data.description || null,
        url: data.url || null,
        license: data.license || null,
        status: data.status || 'ACTIVE',
        metadata: data.metadata || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.dataSources.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.dataSources.has(where.id)) {
        return { ...this.dataSources.get(where.id) };
      }
      if (where.name) {
        for (const s of this.dataSources.values()) {
          if (s.name.toLowerCase() === where.name.toLowerCase()) return { ...s };
        }
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.dataSource.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.dataSources.values());
      if (where.type) {
        list = list.filter((s) => s.type === where.type);
      }
      if (where.status) {
        list = list.filter((s) => s.status === where.status);
      }
      if (where.name) {
        list = list.filter((s) => s.name === where.name);
      }
      if (where.provider) {
        list = list.filter((s) => s.provider === where.provider);
      }
      if (Array.isArray(where.OR) && where.OR.length > 0) {
        list = list.filter((s) => {
          return where.OR.some((cond) => {
            if (cond.name && s.name === cond.name) return true;
            if (cond.provider && s.provider === cond.provider) return true;
            return false;
          });
        });
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((s) => ({ ...s }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.dataSource.findUnique({ where });
      if (!existing) throw new Error(`DataSource not found with id: ${where.id || where.name}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.dataSources.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.dataSource.findUnique({ where });
      if (!existing) throw new Error(`DataSource not found`);
      this.dataSources.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.dataSource.findMany({ where });
      return list.length;
    },
  };

  // Model: Dataset (Phase 28)
  dataset = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        sourceId: data.sourceId,
        name: data.name,
        category: data.category || 'JOB_POSTINGS',
        description: data.description || null,
        currentVersionId: data.currentVersionId || null,
        metadata: data.metadata || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.datasets.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.datasets.has(where.id)) {
        return { ...this.datasets.get(where.id) };
      }
      if (where.sourceId_name) {
        for (const d of this.datasets.values()) {
          if (
            d.sourceId === where.sourceId_name.sourceId &&
            d.name.toLowerCase() === where.sourceId_name.name.toLowerCase()
          ) {
            return { ...d };
          }
        }
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.dataset.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.datasets.values());
      if (where.sourceId) {
        list = list.filter((d) => d.sourceId === where.sourceId);
      }
      if (where.name) {
        list = list.filter((d) => d.name === where.name);
      }
      if (where.category) {
        list = list.filter((d) => d.category === where.category);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((d) => ({ ...d }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.dataset.findUnique({ where });
      if (!existing) throw new Error(`Dataset not found with id: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.datasets.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.dataset.findUnique({ where });
      if (!existing) throw new Error(`Dataset not found`);
      this.datasets.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.dataset.findMany({ where });
      return list.length;
    },
  };

  // Model: DatasetVersion (Phase 28)
  datasetVersion = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        datasetId: data.datasetId,
        versionTag: data.versionTag,
        effectiveStartDate: data.effectiveStartDate ? new Date(data.effectiveStartDate) : null,
        effectiveEndDate: data.effectiveEndDate ? new Date(data.effectiveEndDate) : null,
        schemaVersion: data.schemaVersion || '1.0',
        format: data.format || 'JSON',
        fileHash: data.fileHash || null,
        recordCount: data.recordCount || 0,
        validRecordCount: data.validRecordCount || 0,
        rejectedRecordCount: data.rejectedRecordCount || 0,
        duplicateCount: data.duplicateCount || 0,
        quarantinedCount: data.quarantinedCount || 0,
        qualityScore: data.qualityScore || null,
        status: data.status || 'DRAFT',
        metadata: data.metadata || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.datasetVersions.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.datasetVersions.has(where.id)) {
        return { ...this.datasetVersions.get(where.id) };
      }
      if (where.datasetId_versionTag) {
        for (const v of this.datasetVersions.values()) {
          if (
            v.datasetId === where.datasetId_versionTag.datasetId &&
            v.versionTag === where.datasetId_versionTag.versionTag
          ) {
            return { ...v };
          }
        }
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.datasetVersion.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.datasetVersions.values());
      if (where.datasetId) {
        if (typeof where.datasetId === 'object' && Array.isArray(where.datasetId.in)) {
          list = list.filter((v) => where.datasetId.in.includes(v.datasetId));
        } else {
          list = list.filter((v) => v.datasetId === where.datasetId);
        }
      }
      if (where.versionTag) {
        list = list.filter((v) => v.versionTag === where.versionTag);
      }
      if (where.status) {
        list = list.filter((v) => v.status === where.status);
      }
      if (where.fileHash) {
        list = list.filter((v) => v.fileHash === where.fileHash);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((v) => ({ ...v }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.datasetVersion.findUnique({ where });
      if (!existing) throw new Error(`DatasetVersion not found with id: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.datasetVersions.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.datasetVersion.findUnique({ where });
      if (!existing) throw new Error(`DatasetVersion not found`);
      this.datasetVersions.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.datasetVersion.findMany({ where });
      return list.length;
    },
  };

  // Model: IngestionJobRecord (Phase 28)
  ingestionJobRecord = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        datasetVersionId: data.datasetVersionId,
        stage: data.stage || 'QUEUED',
        status: data.status || 'PENDING',
        progressPercent: data.progressPercent || 0,
        processedCount: data.processedCount || 0,
        successCount: data.successCount || 0,
        failureCount: data.failureCount || 0,
        duplicateCount: data.duplicateCount || 0,
        quarantinedCount: data.quarantinedCount || 0,
        errorLog: data.errorLog || null,
        metadata: data.metadata || null,
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.ingestionJobRecords.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.ingestionJobRecords.has(where.id)) {
        return { ...this.ingestionJobRecords.get(where.id) };
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.ingestionJobRecord.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.ingestionJobRecords.values());
      if (where.datasetVersionId) {
        list = list.filter((j) => j.datasetVersionId === where.datasetVersionId);
      }
      if (where.status) {
        list = list.filter((j) => j.status === where.status);
      }
      if (where.stage) {
        list = list.filter((j) => j.stage === where.stage);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((j) => ({ ...j }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.ingestionJobRecord.findUnique({ where });
      if (!existing) throw new Error(`IngestionJobRecord not found with id: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.ingestionJobRecords.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.ingestionJobRecord.findUnique({ where });
      if (!existing) throw new Error(`IngestionJobRecord not found`);
      this.ingestionJobRecords.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.ingestionJobRecord.findMany({ where });
      return list.length;
    },
  };

  // Model: IngestionRecord (Phase 28)
  ingestionRecord = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        datasetVersionId: data.datasetVersionId,
        ingestionJobId: data.ingestionJobId || null,
        externalId: data.externalId || null,
        recordFingerprint: data.recordFingerprint,
        rawData: data.rawData,
        normalizedData: data.normalizedData || null,
        validationStatus: data.validationStatus || 'PENDING',
        normalizationStatus: data.normalizationStatus || 'PENDING',
        qualityScore: data.qualityScore || null,
        duplicateOf: data.duplicateOf || null,
        duplicateReason: data.duplicateReason || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.ingestionRecords.set(id, record);
      return { ...record };
    },
    createMany: async ({ data = [] }) => {
      let count = 0;
      for (const item of data) {
        await this.ingestionRecord.create({ data: item });
        count++;
      }
      return { count };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.ingestionRecords.has(where.id)) {
        return { ...this.ingestionRecords.get(where.id) };
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.ingestionRecord.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.ingestionRecords.values());
      if (where.datasetVersionId) {
        list = list.filter((r) => r.datasetVersionId === where.datasetVersionId);
      }
      if (where.ingestionJobId) {
        list = list.filter((r) => r.ingestionJobId === where.ingestionJobId);
      }
      if (where.recordFingerprint) {
        list = list.filter((r) => r.recordFingerprint === where.recordFingerprint);
      }
      if (where.validationStatus) {
        list = list.filter((r) => r.validationStatus === where.validationStatus);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((r) => ({ ...r }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.ingestionRecord.findUnique({ where });
      if (!existing) throw new Error(`IngestionRecord not found with id: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.ingestionRecords.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.ingestionRecord.findUnique({ where });
      if (!existing) throw new Error(`IngestionRecord not found`);
      this.ingestionRecords.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.ingestionRecord.findMany({ where });
      return list.length;
    },
  };

  // Model: DataQualityReport (Phase 28)
  dataQualityReport = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        datasetVersionId: data.datasetVersionId,
        overallScore: data.overallScore,
        completenessScore: data.completenessScore,
        validityScore: data.validityScore,
        consistencyScore: data.consistencyScore,
        uniquenessScore: data.uniquenessScore,
        normalizationCoverage: data.normalizationCoverage,
        provenanceCompleteness: data.provenanceCompleteness,
        freshnessScore: data.freshnessScore || null,
        totalRecords: data.totalRecords || 0,
        validRecords: data.validRecords || 0,
        rejectedRecords: data.rejectedRecords || 0,
        duplicateRecords: data.duplicateRecords || 0,
        quarantinedRecords: data.quarantinedRecords || 0,
        warningCount: data.warningCount || 0,
        errorCount: data.errorCount || 0,
        fieldMetrics: data.fieldMetrics || null,
        issuesSummary: data.issuesSummary || null,
        evaluatedAt: data.evaluatedAt ? new Date(data.evaluatedAt) : new Date(),
      };
      this.dataQualityReports.set(id, record);
      return { ...record };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.dataQualityReports.has(where.id)) {
        return { ...this.dataQualityReports.get(where.id) };
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.dataQualityReport.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.dataQualityReports.values());
      if (where.datasetVersionId) {
        list = list.filter((q) => q.datasetVersionId === where.datasetVersionId);
      }
      list.sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((q) => ({ ...q }));
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.dataQualityReport.findMany({ where });
      return list.length;
    },
  };

  // Model: QuarantinedRecord (Phase 28)
  quarantinedRecord = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        datasetVersionId: data.datasetVersionId,
        ingestionJobId: data.ingestionJobId || null,
        externalId: data.externalId || null,
        reason: data.reason,
        validationErrors: data.validationErrors || [],
        rawRecord: data.rawRecord || {},
        status: data.status || 'QUARANTINED',
        reviewedBy: data.reviewedBy || null,
        reviewNotes: data.reviewNotes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.quarantinedRecords.set(id, record);
      return { ...record };
    },
    createMany: async ({ data = [] }) => {
      let count = 0;
      for (const item of data) {
        await this.quarantinedRecord.create({ data: item });
        count++;
      }
      return { count };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.quarantinedRecords.has(where.id)) {
        return { ...this.quarantinedRecords.get(where.id) };
      }
      return null;
    },
    findFirst: async (params) => {
      const list = await this.quarantinedRecord.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.quarantinedRecords.values());
      if (where.datasetVersionId) {
        list = list.filter((q) => q.datasetVersionId === where.datasetVersionId);
      }
      if (where.ingestionJobId) {
        list = list.filter((q) => q.ingestionJobId === where.ingestionJobId);
      }
      if (where.status) {
        list = list.filter((q) => q.status === where.status);
      }
      if (where.reason) {
        list = list.filter((q) => q.reason === where.reason);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((q) => ({ ...q }));
    },
    update: async ({ where = {}, data = {} }) => {
      const existing = await this.quarantinedRecord.findUnique({ where });
      if (!existing) throw new Error(`QuarantinedRecord not found with id: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.quarantinedRecords.set(existing.id, updated);
      return { ...updated };
    },
    delete: async ({ where = {} }) => {
      const existing = await this.quarantinedRecord.findUnique({ where });
      if (!existing) throw new Error(`QuarantinedRecord not found`);
      this.quarantinedRecords.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.quarantinedRecord.findMany({ where });
      return list.length;
    },
  };

  // Model: ExternalTaxonomyMapping (Phase 33)
  externalTaxonomyMapping = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        source: data.source,
        datasetVersionId: data.datasetVersionId || null,
        entityType: data.entityType,
        externalId: data.externalId,
        externalUri: data.externalUri || null,
        internalEntityType: data.internalEntityType,
        internalEntityId: data.internalEntityId,
        preferredLabel: data.preferredLabel,
        altLabels: Array.isArray(data.altLabels) ? data.altLabels : [],
        mappingConfidence: data.mappingConfidence !== undefined ? data.mappingConfidence : 1.0,
        mappingType: data.mappingType || 'EXACT',
        sourceMetadata: data.sourceMetadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.externalTaxonomyMappings.set(id, record);
      return { ...record };
    },
    createMany: async ({ data = [] }) => {
      let count = 0;
      for (const item of data) {
        await this.externalTaxonomyMapping.create({ data: item });
        count++;
      }
      return { count };
    },
    findUnique: async ({ where = {} } = {}) => {
      if (where.id && this.externalTaxonomyMappings.has(where.id)) {
        return { ...this.externalTaxonomyMappings.get(where.id) };
      }
      if (where.source_externalId_internalEntityType) {
        const { source, externalId, internalEntityType } = where.source_externalId_internalEntityType;
        for (const m of this.externalTaxonomyMappings.values()) {
          if (
            m.source === source &&
            m.externalId === externalId &&
            m.internalEntityType === internalEntityType
          ) {
            return { ...m };
          }
        }
      }
      return null;
    },
    findFirst: async (params = {}) => {
      const list = await this.externalTaxonomyMapping.findMany(params);
      return list[0] || null;
    },
    findMany: async ({ where = {}, orderBy, take, skip } = {}) => {
      let list = Array.from(this.externalTaxonomyMappings.values());
      if (where.source) {
        list = list.filter((m) => m.source === where.source);
      }
      if (where.externalId) {
        list = list.filter((m) => m.externalId === where.externalId);
      }
      if (where.externalUri) {
        list = list.filter((m) => m.externalUri === where.externalUri);
      }
      if (where.internalEntityType) {
        list = list.filter((m) => m.internalEntityType === where.internalEntityType);
      }
      if (where.internalEntityId) {
        list = list.filter((m) => m.internalEntityId === where.internalEntityId);
      }
      if (where.datasetVersionId) {
        list = list.filter((m) => m.datasetVersionId === where.datasetVersionId);
      }
      if (where.entityType) {
        list = list.filter((m) => m.entityType === where.entityType);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list.map((m) => ({ ...m }));
    },
    update: async ({ where = {}, data = {} }) => {
      let target = null;
      if (where.id) {
        target = this.externalTaxonomyMappings.get(where.id);
      } else if (where.source_externalId_internalEntityType) {
        const { source, externalId, internalEntityType } = where.source_externalId_internalEntityType;
        for (const m of this.externalTaxonomyMappings.values()) {
          if (
            m.source === source &&
            m.externalId === externalId &&
            m.internalEntityType === internalEntityType
          ) {
            target = m;
            break;
          }
        }
      }
      if (!target) throw new Error('ExternalTaxonomyMapping not found for update');
      const updated = {
        ...target,
        ...data,
        updatedAt: new Date(),
      };
      this.externalTaxonomyMappings.set(target.id, updated);
      return { ...updated };
    },
    upsert: async ({ where = {}, create = {}, update = {} }) => {
      const existing = await this.externalTaxonomyMapping.findUnique({ where });
      if (existing) {
        return this.externalTaxonomyMapping.update({ where: { id: existing.id }, data: update });
      }
      return this.externalTaxonomyMapping.create({ data: create });
    },
    delete: async ({ where = {} }) => {
      const existing = await this.externalTaxonomyMapping.findUnique({ where });
      if (!existing) throw new Error('ExternalTaxonomyMapping not found');
      this.externalTaxonomyMappings.delete(existing.id);
      return { ...existing };
    },
    count: async ({ where = {} } = {}) => {
      const list = await this.externalTaxonomyMapping.findMany({ where });
      return list.length;
    },
  };

  _formatCapabilityEvidence(ce, include = {}) {
    if (!ce) return null;
    const clone = { ...ce };
    if (include?.skill) {
      clone.skill = this.skills.get(ce.skillId) || null;
    }
    if (include?.profile) {
      for (const p of this.individualProfiles.values()) {
        if (p.id === ce.profileId) {
          clone.profile = this._formatProfile(p);
          break;
        }
      }
    }
    return clone;
  }

  // Model: CapabilityEvidence (Phase 38)
  capabilityEvidence = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        profileId: data.profileId,
        skillId: data.skillId,
        evidenceType: data.evidenceType || 'PROJECT',
        sourceEntityType: data.sourceEntityType || 'GrowthProject',
        sourceEntityId: data.sourceEntityId || null,
        title: data.title,
        description: data.description || null,
        evidenceStrength: data.evidenceStrength || 'MODERATE',
        evidenceDepth: data.evidenceDepth || 'USED',
        verificationStatus: data.verificationStatus || 'PLATFORM_ATTACHED',
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
        provenance: data.provenance || 'USER_ATTACHED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.capabilityEvidences.set(id, record);
      return this._formatCapabilityEvidence(record, include);
    },
    findUnique: async ({ where, include }) => {
      const ce = this.capabilityEvidences.get(where.id);
      if (!ce) return null;
      return this._formatCapabilityEvidence(ce, include);
    },
    findFirst: async ({ where = {}, include } = {}) => {
      for (const ce of this.capabilityEvidences.values()) {
        if (where.id && ce.id !== where.id) continue;
        if (where.profileId && ce.profileId !== where.profileId) continue;
        if (where.skillId && ce.skillId !== where.skillId) continue;
        if (where.evidenceType && ce.evidenceType !== where.evidenceType) continue;
        if (where.sourceEntityId && ce.sourceEntityId !== where.sourceEntityId) continue;
        return this._formatCapabilityEvidence(ce, include);
      }
      return null;
    },
    findMany: async ({ where = {}, include, orderBy, skip = 0, take = 100 } = {}) => {
      let list = Array.from(this.capabilityEvidences.values());
      if (where.profileId) list = list.filter((ce) => ce.profileId === where.profileId);
      if (where.skillId) list = list.filter((ce) => ce.skillId === where.skillId);
      if (where.evidenceType) list = list.filter((ce) => ce.evidenceType === where.evidenceType);
      if (where.sourceEntityType) list = list.filter((ce) => ce.sourceEntityType === where.sourceEntityType);
      if (where.sourceEntityId) list = list.filter((ce) => ce.sourceEntityId === where.sourceEntityId);
      if (where.verificationStatus) list = list.filter((ce) => ce.verificationStatus === where.verificationStatus);
      if (orderBy?.createdAt === 'desc') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list.slice(skip, skip + take).map((ce) => this._formatCapabilityEvidence(ce, include));
    },
    update: async ({ where, data, include }) => {
      const existing = this.capabilityEvidences.get(where.id);
      if (!existing) throw new Error('Capability evidence not found for update');
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      this.capabilityEvidences.set(where.id, updated);
      return this._formatCapabilityEvidence(updated, include);
    },
    delete: async ({ where }) => {
      const existing = this.capabilityEvidences.get(where.id);
      if (existing) this.capabilityEvidences.delete(where.id);
      return existing;
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, ce] of this.capabilityEvidences.entries()) {
        if (where.profileId && ce.profileId !== where.profileId) continue;
        if (where.skillId && ce.skillId !== where.skillId) continue;
        if (where.sourceEntityId && ce.sourceEntityId !== where.sourceEntityId) continue;
        this.capabilityEvidences.delete(id);
        count++;
      }
      return { count };
    },
    count: async ({ where = {} } = {}) => {
      let list = Array.from(this.capabilityEvidences.values());
      if (where.profileId) list = list.filter((ce) => ce.profileId === where.profileId);
      if (where.skillId) list = list.filter((ce) => ce.skillId === where.skillId);
      return list.length;
    },
  };

  _formatDevelopmentRoadmap(rm, include = {}) {
    if (!rm) return null;
    const clone = { ...rm };
    if (include?.targetRole) {
      clone.targetRole = this.roles.get(rm.targetRoleId) || null;
    }
    if (include?.plans) {
      clone.plans = Array.from(this.capabilityDevelopmentPlans.values())
        .filter((p) => p.roadmapId === rm.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => this._formatCapabilityDevelopmentPlan(p, include.plans?.include));
    }
    if (include?.stages) {
      clone.stages = Array.from(this.roadmapStageProgresses.values())
        .filter((s) => s.roadmapId === rm.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s) => this._formatRoadmapStageProgress(s, include.stages?.include));
    }
    if (include?.reevaluations) {
      clone.reevaluations = Array.from(this.roadmapReevaluations.values())
        .filter((r) => r.roadmapId === rm.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return clone;
  }

  _formatCapabilityDevelopmentPlan(plan, include = {}) {
    if (!plan) return null;
    const clone = { ...plan };
    if (include?.skill) {
      clone.skill = this.skills.get(plan.skillId) || null;
    }
    if (include?.stages) {
      clone.stages = Array.from(this.roadmapStageProgresses.values())
        .filter((s) => s.planId === plan.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return clone;
  }

  _formatRoadmapStageProgress(stage, include = {}) {
    if (!stage) return null;
    const clone = { ...stage };
    if (include?.skill) {
      clone.skill = this.skills.get(stage.skillId) || null;
    }
    if (include?.plan) {
      clone.plan = this.capabilityDevelopmentPlans.get(stage.planId) || null;
    }
    return clone;
  }

  // Model: DevelopmentRoadmap (Phase 40)
  developmentRoadmap = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        targetRoleId: data.targetRoleId,
        version: data.version || 1,
        status: data.status || 'ACTIVE',
        alignmentPct: data.alignmentPct || 0,
        evidenceCoverageRatio: data.evidenceCoverageRatio || '0 / 0',
        currentFocusSkillId: data.currentFocusSkillId || null,
        changeReason: data.changeReason || 'INITIAL_GENERATION',
        changeSummary: data.changeSummary || null,
        metadata: data.metadata || null,
        generatedAt: data.generatedAt ? new Date(data.generatedAt) : new Date(),
        updatedAt: new Date(),
      };
      this.developmentRoadmaps.set(id, record);
      return this._formatDevelopmentRoadmap(record, include);
    },
    findUnique: async ({ where, include }) => {
      const rm = this.developmentRoadmaps.get(where.id);
      if (!rm) return null;
      return this._formatDevelopmentRoadmap(rm, include);
    },
    findFirst: async ({ where = {}, include } = {}) => {
      for (const rm of this.developmentRoadmaps.values()) {
        if (where.id && rm.id !== where.id) continue;
        if (where.userId && rm.userId !== where.userId) continue;
        if (where.targetRoleId && rm.targetRoleId !== where.targetRoleId) continue;
        if (where.status && rm.status !== where.status) continue;
        return this._formatDevelopmentRoadmap(rm, include);
      }
      return null;
    },
    findMany: async ({ where = {}, include, orderBy, take } = {}) => {
      let list = Array.from(this.developmentRoadmaps.values());
      if (where.userId) list = list.filter((rm) => rm.userId === where.userId);
      if (where.targetRoleId) list = list.filter((rm) => rm.targetRoleId === where.targetRoleId);
      if (where.status) list = list.filter((rm) => rm.status === where.status);
      if (orderBy?.version === 'desc') {
        list.sort((a, b) => (b.version || 0) - (a.version || 0));
      } else if (orderBy?.generatedAt === 'desc') {
        list.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));
      }
      if (take) list = list.slice(0, take);
      return list.map((rm) => this._formatDevelopmentRoadmap(rm, include));
    },
    update: async ({ where, data, include }) => {
      const existing = this.developmentRoadmaps.get(where.id);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.developmentRoadmaps.set(where.id, updated);
      return this._formatDevelopmentRoadmap(updated, include);
    },
    updateMany: async ({ where = {}, data }) => {
      let count = 0;
      for (const [id, rm] of this.developmentRoadmaps.entries()) {
        if (where.userId && rm.userId !== where.userId) continue;
        if (where.targetRoleId && rm.targetRoleId !== where.targetRoleId) continue;
        if (where.status && rm.status !== where.status) continue;
        const updated = { ...rm, ...data, updatedAt: new Date() };
        this.developmentRoadmaps.set(id, updated);
        count++;
      }
      return { count };
    },
    delete: async ({ where }) => {
      const existing = this.developmentRoadmaps.get(where.id);
      if (existing) this.developmentRoadmaps.delete(where.id);
      return existing;
    },
  };

  // Model: CapabilityDevelopmentPlan (Phase 40)
  capabilityDevelopmentPlan = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        roadmapId: data.roadmapId,
        skillId: data.skillId,
        developmentNeed: data.developmentNeed || 'KNOWLEDGE_GAP',
        priority: data.priority || 'HIGH',
        priorityScore: data.priorityScore || 0,
        currentCapabilityState: data.currentCapabilityState || 'EVIDENCE_NEEDED',
        targetProficiency: data.targetProficiency || 'INTERMEDIATE',
        currentProficiency: data.currentProficiency || 'NONE',
        evidenceGap: data.evidenceGap || 'HIGH',
        marketSignal: data.marketSignal || 'STABLE',
        status: data.status || 'NOT_STARTED',
        reasons: data.reasons || [],
        nextAction: data.nextAction || null,
        order: data.order || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.capabilityDevelopmentPlans.set(id, record);
      return this._formatCapabilityDevelopmentPlan(record, include);
    },
    findUnique: async ({ where, include }) => {
      const p = this.capabilityDevelopmentPlans.get(where.id);
      if (!p) return null;
      return this._formatCapabilityDevelopmentPlan(p, include);
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.capabilityDevelopmentPlans.values());
      if (where.roadmapId) list = list.filter((p) => p.roadmapId === where.roadmapId);
      if (where.skillId) list = list.filter((p) => p.skillId === where.skillId);
      if (where.status) list = list.filter((p) => p.status === where.status);
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list.map((p) => this._formatCapabilityDevelopmentPlan(p, include));
    },
    update: async ({ where, data, include }) => {
      const existing = this.capabilityDevelopmentPlans.get(where.id);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.capabilityDevelopmentPlans.set(where.id, updated);
      return this._formatCapabilityDevelopmentPlan(updated, include);
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, p] of this.capabilityDevelopmentPlans.entries()) {
        if (where.roadmapId && p.roadmapId !== where.roadmapId) continue;
        this.capabilityDevelopmentPlans.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: RoadmapStageProgress (Phase 40)
  roadmapStageProgress = {
    create: async ({ data, include }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        roadmapId: data.roadmapId,
        planId: data.planId,
        skillId: data.skillId,
        stageType: data.stageType || 'LEARN',
        title: data.title,
        objective: data.objective,
        expectedOutput: data.expectedOutput || null,
        evidenceRequirement: data.evidenceRequirement || null,
        resourceId: data.resourceId || null,
        status: data.status || 'NOT_STARTED',
        completedAt: data.completedAt ? new Date(data.completedAt) : null,
        completedEvidenceId: data.completedEvidenceId || null,
        order: data.order || 1,
        metadata: data.metadata || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.roadmapStageProgresses.set(id, record);
      return this._formatRoadmapStageProgress(record, include);
    },
    findUnique: async ({ where, include }) => {
      const st = this.roadmapStageProgresses.get(where.id);
      if (!st) return null;
      return this._formatRoadmapStageProgress(st, include);
    },
    findFirst: async ({ where = {}, include } = {}) => {
      for (const st of this.roadmapStageProgresses.values()) {
        if (where.id && st.id !== where.id) continue;
        if (where.roadmapId && st.roadmapId !== where.roadmapId) continue;
        if (where.planId && st.planId !== where.planId) continue;
        if (where.skillId && st.skillId !== where.skillId) continue;
        if (where.stageType && st.stageType !== where.stageType) continue;
        return this._formatRoadmapStageProgress(st, include);
      }
      return null;
    },
    findMany: async ({ where = {}, include } = {}) => {
      let list = Array.from(this.roadmapStageProgresses.values());
      if (where.roadmapId) list = list.filter((s) => s.roadmapId === where.roadmapId);
      if (where.planId) list = list.filter((s) => s.planId === where.planId);
      if (where.skillId) list = list.filter((s) => s.skillId === where.skillId);
      if (where.stageType) list = list.filter((s) => s.stageType === where.stageType);
      if (where.status) list = list.filter((s) => s.status === where.status);
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list.map((s) => this._formatRoadmapStageProgress(s, include));
    },
    update: async ({ where, data, include }) => {
      const existing = this.roadmapStageProgresses.get(where.id);
      if (!existing) return null;
      const updated = { ...existing, ...data, updatedAt: new Date() };
      this.roadmapStageProgresses.set(where.id, updated);
      return this._formatRoadmapStageProgress(updated, include);
    },
    deleteMany: async ({ where = {} } = {}) => {
      let count = 0;
      for (const [id, s] of this.roadmapStageProgresses.entries()) {
        if (where.roadmapId && s.roadmapId !== where.roadmapId) continue;
        this.roadmapStageProgresses.delete(id);
        count++;
      }
      return { count };
    },
  };

  // Model: RoadmapReevaluation (Phase 40)
  roadmapReevaluation = {
    create: async ({ data }) => {
      const id = data.id || this.uuid();
      const record = {
        id,
        userId: data.userId,
        roadmapId: data.roadmapId,
        triggerType: data.triggerType || 'MANUAL',
        triggerEntity: data.triggerEntity || null,
        previousSnapshot: data.previousSnapshot || null,
        newSnapshot: data.newSnapshot || null,
        changes: data.changes || [],
        status: data.status || 'APPLIED',
        createdAt: new Date(),
      };
      this.roadmapReevaluations.set(id, record);
      return record;
    },
    findMany: async ({ where = {}, orderBy, take } = {}) => {
      let list = Array.from(this.roadmapReevaluations.values());
      if (where.userId) list = list.filter((r) => r.userId === where.userId);
      if (where.roadmapId) list = list.filter((r) => r.roadmapId === where.roadmapId);
      if (orderBy?.createdAt === 'desc') {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      if (take) list = list.slice(0, take);
      return list;
    },
  };

  $transaction = async (fn) => {
    if (typeof fn === 'function') {
      return fn(this);
    }
    if (Array.isArray(fn)) {
      return Promise.all(fn);
    }
    return fn;
  };
}

const memoryStore = new MemoryStore();

/**
 * Creates a smart hybrid client that delegates to Prisma when Postgres is reachable,
 * and falls back gracefully to in-memory store when local Postgres is unreachable.
 */
function createSmartDbClient(realClient, fallbackStore) {
  let isPostgresAvailable = null;

  const wrapModelMethod = (modelName, methodName) => {
    return async (...args) => {
      const invokeFallback = async () => {
        if (fallbackStore[modelName]?.[methodName]) {
          return fallbackStore[modelName][methodName](...args);
        }
        if (methodName === 'findFirst' && fallbackStore[modelName]?.findMany) {
          const list = await fallbackStore[modelName].findMany({ ...args[0], take: 1 });
          return list[0] || null;
        }
        return null;
      };

      if (isPostgresAvailable === false) {
        return invokeFallback();
      }

      try {
        const result = await realClient[modelName][methodName](...args);
        isPostgresAvailable = true;
        return result;
      } catch (err) {
        if (
          err.name === 'PrismaClientInitializationError' ||
          err.message?.includes("Can't reach database server") ||
          err.code === 'P1001'
        ) {
          isPostgresAvailable = false;
          return invokeFallback();
        }
        throw err;
      }
    };
  };

  const proxy = {
    $transaction: async (fn) => {
      if (isPostgresAvailable === false) {
        return fallbackStore.$transaction(fn);
      }
      try {
        return await realClient.$transaction(async (tx) => {
          return typeof fn === 'function' ? fn(tx) : Promise.all(fn);
        });
      } catch (err) {
        if (
          err.name === 'PrismaClientInitializationError' ||
          err.message?.includes("Can't reach database server") ||
          err.code === 'P1001'
        ) {
          isPostgresAvailable = false;
          return fallbackStore.$transaction(fn);
        }
        throw err;
      }
    },
    $queryRaw: async (...args) => {
      return realClient.$queryRaw(...args);
    },
  };

  const models = [
    'user',
    'individualProfile',
    'skill',
    'skillEmbedding',
    'userSkill',
    'capabilityEvidence',
    'developmentRoadmap',
    'capabilityDevelopmentPlan',
    'roadmapStageProgress',
    'roadmapReevaluation',
    'role',
    'roleSkill',
    'experience',
    'education',
    'opportunity',
    'opportunitySkill',
    'advertisedCompensation',
    'savedOpportunity',
    'application',
    'growthMilestone',
    'growthProject',
    'learningPath',
    'learningModule',
    'learningResource',
    'learningProgress',
    'organization',
    'organizationMember',
    'department',
    'organizationSkill',
    'futureSkill',
    'talentShortlist',
    'planningScenario',
    'planningRoadmapAction',
    'organizationLearningProgram',
    'authSession',
    'emailVerificationToken',
    'passwordResetToken',
    'authAuditLog',
    'skillDemandObservation',
    'roleDemandObservation',
    'demandForecast',
    'demandTrendSnapshot',
    'recommendation',
    'recommendationFeedback',
    'dataSource',
    'dataset',
    'datasetVersion',
    'ingestionJobRecord',
    'ingestionRecord',
    'dataQualityReport',
    'quarantinedRecord',
    'externalTaxonomyMapping',
  ];

  for (const model of models) {
    proxy[model] = new Proxy(
      {},
      {
        get(_, method) {
          return wrapModelMethod(model, method);
        },
      }
    );
  }

  return proxy;
}

export const prisma = createSmartDbClient(rawPrisma, memoryStore);

/**
 * Checks database connectivity safely without throwing unhandled exceptions.
 * @returns {Promise<{ status: string, latencyMs?: number, error?: string }>}
 */
export const checkDbConnection = async () => {
  if (!env.databaseUrl) {
    return {
      status: 'unconfigured',
      message: 'DATABASE_URL is not configured in environment',
    };
  }

  const start = Date.now();
  try {
    // Basic connectivity probe
    await rawPrisma.$queryRaw`SELECT 1 as health_check`;
    const latencyMs = Date.now() - start;

    return {
      status: 'connected',
      latencyMs,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      error: error.message || 'Unable to establish database connection',
    };
  }
};

export default prisma;
