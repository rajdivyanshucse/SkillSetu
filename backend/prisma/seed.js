import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillSetu Database Seeding (Demo & Development Dataset)...');

  // 1. Clean up existing data in reverse dependency order
  console.log('🧹 Cleaning up previous records...');
  await prisma.learningProgress.deleteMany();
  await prisma.growthProject.deleteMany();
  await prisma.growthMilestone.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedOpportunity.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.learningModule.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.advertisedCompensation.deleteMany();
  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.futureSkill.deleteMany();
  await prisma.organizationSkill.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.roleSkill.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.individualProfile.deleteMany();
  await prisma.role.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Skills
  console.log('📦 Seeding Skill Taxonomies...');
  const skillsData = [
    { name: 'Java', normalizedName: 'java', category: 'Programming', description: 'Enterprise object-oriented programming language' },
    { name: 'Spring Boot', normalizedName: 'spring-boot', category: 'Backend', description: 'Modern enterprise microservices framework for Java' },
    { name: 'React', normalizedName: 'react', category: 'Frontend', description: 'Component-based UI library' },
    { name: 'Node.js', normalizedName: 'nodejs', category: 'Backend', description: 'JavaScript runtime for scalable backend services' },
    { name: 'PostgreSQL', normalizedName: 'postgresql', category: 'Databases', description: 'Advanced open-source relational database' },
    { name: 'Redis', normalizedName: 'redis', category: 'Databases', description: 'In-memory data structure store used for caching' },
    { name: 'AWS', normalizedName: 'aws', category: 'Cloud', description: 'Amazon Web Services cloud computing platform' },
    { name: 'Docker', normalizedName: 'docker', category: 'DevOps', description: 'Containerization platform for application packaging' },
    { name: 'Kubernetes', normalizedName: 'kubernetes', category: 'DevOps', description: 'Automated container orchestration and management' },
    { name: 'System Design', normalizedName: 'system-design', category: 'System Design', description: 'High-availability architecture and distributed systems design' },
    { name: 'REST APIs', normalizedName: 'rest-apis', category: 'Backend', description: 'Representational State Transfer API architecture' },
    { name: 'GraphQL', normalizedName: 'graphql', category: 'Backend', description: 'Query language and runtime for APIs' },
    { name: 'Microservices Architecture', normalizedName: 'microservices', category: 'System Design', description: 'Decoupled service design and event-driven patterns' },
    { name: 'Machine Learning', normalizedName: 'machine-learning', category: 'AI / ML', description: 'Statistical learning models and predictive analytics' },
    { name: 'Generative AI & LLMs', normalizedName: 'generative-ai', category: 'AI / ML', description: 'Large language models and vector search integration' },
  ];

  const createdSkills = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    createdSkills[s.normalizedName] = created;
  }

  // 3. Seed Roles & Role Skills
  console.log('👔 Seeding Role Archetypes & Benchmark Requirements...');
  const backendRole = await prisma.role.create({
    data: {
      name: 'Backend Software Engineer',
      normalizedName: 'backend-software-engineer',
      category: 'Engineering',
      description: 'Designs, develops, and maintains scalable server-side systems, microservices, and databases.',
    },
  });

  const fullStackRole = await prisma.role.create({
    data: {
      name: 'Full Stack Engineer',
      normalizedName: 'full-stack-engineer',
      category: 'Engineering',
      description: 'Builds end-to-end web applications with modern frontend frameworks and robust backend APIs.',
    },
  });

  const devopsRole = await prisma.role.create({
    data: {
      name: 'DevOps & Cloud Engineer',
      normalizedName: 'devops-cloud-engineer',
      category: 'Infrastructure',
      description: 'Automates CI/CD pipelines, container orchestration, and cloud infrastructure reliability.',
    },
  });

  // Role Skills for Backend Software Engineer
  await prisma.roleSkill.createMany({
    data: [
      { roleId: backendRole.id, skillId: createdSkills['java'].id, requirementType: 'REQUIRED', importance: 95, targetProficiency: 'ADVANCED' },
      { roleId: backendRole.id, skillId: createdSkills['spring-boot'].id, requirementType: 'REQUIRED', importance: 90, targetProficiency: 'ADVANCED' },
      { roleId: backendRole.id, skillId: createdSkills['postgresql'].id, requirementType: 'REQUIRED', importance: 85, targetProficiency: 'INTERMEDIATE' },
      { roleId: backendRole.id, skillId: createdSkills['system-design'].id, requirementType: 'REQUIRED', importance: 80, targetProficiency: 'ADVANCED' },
      { roleId: backendRole.id, skillId: createdSkills['aws'].id, requirementType: 'PREFERRED', importance: 75, targetProficiency: 'INTERMEDIATE' },
      { roleId: backendRole.id, skillId: createdSkills['docker'].id, requirementType: 'PREFERRED', importance: 70, targetProficiency: 'INTERMEDIATE' },
    ],
  });

  // 4. Seed Individual Demo Users & Profiles
  console.log('👤 Seeding Individual Profiles...');
  const individualUser = await prisma.user.create({
    data: {
      email: 'rahul.sharma@skillsetu.demo',
      accountType: 'INDIVIDUAL',
      status: 'ACTIVE',
    },
  });

  const rahulProfile = await prisma.individualProfile.create({
    data: {
      userId: individualUser.id,
      fullName: 'Rahul Sharma',
      headline: 'Aspiring Backend Software Engineer | Java & Cloud Enthusiast',
      location: 'Bangalore, India',
      education: 'B.Tech in Computer Science',
      currentStatus: 'Fresher / Entry-Level Engineer',
      targetRoleId: backendRole.id,
      targetIndustry: 'Enterprise Software & Cloud Platforms',
      experienceSummary: 'Hands-on experience building REST APIs with Java Spring Boot and relational database design.',
      careerGoals: ['Master enterprise microservices', 'Attain AWS Solutions Architect certification', 'Transition to Tier-1 product company'],
      learningPreferences: { weeklyHours: 12, mode: 'Project-Based', focus: 'Backend Systems' },
      workPreferences: { workMode: 'HYBRID', noticePeriodDays: 0, preferredLocations: ['Bangalore', 'Hyderabad', 'Remote'] },
      completeness: 92,
    },
  });

  // User Skills
  await prisma.userSkill.createMany({
    data: [
      { profileId: rahulProfile.id, skillId: createdSkills['java'].id, proficiency: 'ADVANCED', yearsOfExperience: 2.0, isVerified: true },
      { profileId: rahulProfile.id, skillId: createdSkills['spring-boot'].id, proficiency: 'INTERMEDIATE', yearsOfExperience: 1.5, isVerified: true },
      { profileId: rahulProfile.id, skillId: createdSkills['postgresql'].id, proficiency: 'INTERMEDIATE', yearsOfExperience: 1.5, isVerified: false },
      { profileId: rahulProfile.id, skillId: createdSkills['docker'].id, proficiency: 'BEGINNER', yearsOfExperience: 0.5, isVerified: false },
    ],
  });

  // Experience
  await prisma.experience.create({
    data: {
      profileId: rahulProfile.id,
      company: 'Apex Technologies (Demo)',
      roleTitle: 'Software Engineering Intern',
      employmentType: 'INTERNSHIP',
      location: 'Bangalore, India',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
      isCurrent: false,
      description: 'Assisted in modularizing monolithic REST endpoints into containerized Spring Boot microservices.',
    },
  });

  // Education
  await prisma.education.create({
    data: {
      profileId: rahulProfile.id,
      institution: 'National Institute of Technology (Demo)',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science and Engineering',
      startDate: new Date('2021-08-01'),
      endDate: new Date('2025-05-30'),
      isCurrent: false,
      description: 'Specialized in Algorithms, Distributed Databases, and Operating Systems with 8.6 CGPA.',
    },
  });

  // 5. Seed Organization & Workforce Ecosystem
  console.log('🏢 Seeding Organization & Workforce Intelligence...');
  const orgUser = await prisma.user.create({
    data: {
      email: 'devina.sharma@technova.demo',
      accountType: 'ORGANIZATION',
      status: 'ACTIVE',
    },
  });

  const organization = await prisma.organization.create({
    data: {
      name: 'TechNova Solutions',
      legalName: 'TechNova Global Systems Private Limited (Demo)',
      industry: 'Enterprise Software & Cloud Platforms',
      companySize: '201–500',
      location: 'Bangalore, India',
      description: 'Next-generation cloud transformation and enterprise microservices engineering provider.',
      website: 'https://technova-solutions.demo',
      status: 'ACTIVE',
    },
  });

  await prisma.organizationMember.create({
    data: {
      userId: orgUser.id,
      organizationId: organization.id,
      role: 'ADMIN',
      accessLevel: 'Owner',
      status: 'ACTIVE',
    },
  });

  // Departments
  const engDept = await prisma.department.create({
    data: {
      organizationId: organization.id,
      name: 'Core Engineering',
      headcount: 140,
      description: 'Product development and distributed microservices infrastructure teams.',
    },
  });

  await prisma.department.create({
    data: {
      organizationId: organization.id,
      name: 'Cloud & SRE Operations',
      headcount: 45,
      description: 'Multi-region Kubernetes deployment, telemetry, and observability monitoring.',
    },
  });

  // Organization Skills Capability
  await prisma.organizationSkill.createMany({
    data: [
      { organizationId: organization.id, skillId: createdSkills['java'].id, currentCapability: 82, targetCapability: 90, workforceCount: 75, priority: 'HIGH' },
      { organizationId: organization.id, skillId: createdSkills['spring-boot'].id, currentCapability: 78, targetCapability: 88, workforceCount: 68, priority: 'HIGH' },
      { organizationId: organization.id, skillId: createdSkills['aws'].id, currentCapability: 62, targetCapability: 85, workforceCount: 42, priority: 'CRITICAL' },
      { organizationId: organization.id, skillId: createdSkills['kubernetes'].id, currentCapability: 55, targetCapability: 80, workforceCount: 28, priority: 'HIGH' },
    ],
  });

  // Strategic Future Skills Requirements
  await prisma.futureSkill.createMany({
    data: [
      { organizationId: organization.id, skillId: createdSkills['generative-ai'].id, planningHorizon: 'MONTHS_12', priority: 'CRITICAL', requiredCapability: 85, currentCapability: 25, notes: 'Needed for internal intelligence automation pipelines.' },
      { organizationId: organization.id, skillId: createdSkills['kubernetes'].id, planningHorizon: 'MONTHS_6', priority: 'HIGH', requiredCapability: 80, currentCapability: 55, notes: 'Multi-cluster migration planned for Q3.' },
    ],
  });

  // 6. Seed Opportunities & Compensations
  console.log('💼 Seeding Opportunities & Advertised Compensation Patterns...');
  const opp1 = await prisma.opportunity.create({
    data: {
      organizationId: organization.id,
      roleId: backendRole.id,
      title: 'Associate Backend Engineer (Spring Boot / Java)',
      companyName: 'TechNova Solutions (Demo)',
      location: 'Bangalore, India',
      workMode: 'HYBRID',
      employmentType: 'FULL_TIME',
      experienceLevel: 'Entry to Mid',
      description: 'Join our Core Platform team to build resilient microservices in Java 21, Spring Boot 3, and PostgreSQL.',
      source: 'SkillSetu Verified Match',
      status: 'ACTIVE',
    },
  });

  await prisma.opportunitySkill.createMany({
    data: [
      { opportunityId: opp1.id, skillId: createdSkills['java'].id, requirementType: 'REQUIRED', importance: 95, targetProficiency: 'ADVANCED' },
      { opportunityId: opp1.id, skillId: createdSkills['spring-boot'].id, requirementType: 'REQUIRED', importance: 90, targetProficiency: 'INTERMEDIATE' },
      { opportunityId: opp1.id, skillId: createdSkills['postgresql'].id, requirementType: 'REQUIRED', importance: 80, targetProficiency: 'INTERMEDIATE' },
      { opportunityId: opp1.id, skillId: createdSkills['aws'].id, requirementType: 'PREFERRED', importance: 65, targetProficiency: 'BEGINNER' },
    ],
  });

  await prisma.advertisedCompensation.create({
    data: {
      opportunityId: opp1.id,
      roleId: backendRole.id,
      location: 'Bangalore, India',
      minCompensation: 850000,
      maxCompensation: 1400000,
      currency: 'INR',
      period: 'ANNUAL',
      source: 'TechNova Advertised Pattern (Demo Dataset)',
    },
  });

  // 7. Seed Learning Paths, Modules & Resources
  console.log('📚 Seeding Learning Intelligence Catalog...');
  const learningPath = await prisma.learningPath.create({
    data: {
      title: 'Backend Microservices with Spring Boot & PostgreSQL',
      description: 'Comprehensive guided curriculum for transitioning from monolithic code to production-grade distributed architectures.',
      targetRoleId: backendRole.id,
      level: 'Intermediate',
      estimatedHours: 48,
      isActive: true,
    },
  });

  const module1 = await prisma.learningModule.create({
    data: {
      pathId: learningPath.id,
      title: 'Module 1: High-Performance Relational Schema Design',
      description: 'Indexing strategies, connection pooling, and ACID transaction boundaries in PostgreSQL.',
      order: 1,
      estimatedHours: 12,
    },
  });

  await prisma.learningResource.create({
    data: {
      moduleId: module1.id,
      skillId: createdSkills['postgresql'].id,
      title: 'Mastering PostgreSQL: Query Optimization & Indexing',
      provider: 'SkillSetu Intelligence Library (Demo)',
      resourceType: 'Interactive Course',
      difficulty: 'Intermediate',
      estimatedDuration: '6 hours',
    },
  });

  // 8. Seed Growth Milestones
  console.log('🎯 Seeding Professional Growth Milestones...');
  await prisma.growthMilestone.create({
    data: {
      profileId: rahulProfile.id,
      skillId: createdSkills['aws'].id,
      title: 'Complete AWS Cloud Practitioner Certification',
      description: 'Master core cloud concepts, VPC networking, and IAM security boundaries.',
      targetDate: new Date('2026-11-30'),
      status: 'IN_PROGRESS',
    },
  });

  console.log('\n✅ SkillSetu Database Seeding Completed Successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
