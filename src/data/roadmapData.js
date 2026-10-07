/**
 * SkillSetu Career Roadmap & Development Plan Architecture
 * Structured around: LEARN -> PRACTICE -> BUILD -> VALIDATE
 */

export const defaultRoadmapStages = [
  {
    id: 'foundation',
    stageNumber: '01',
    title: 'Foundation',
    subtitle: 'Core programming, relational data modeling & API contracts',
    status: 'Mostly Complete',
    defaultProgress: 80,
    skills: [
      {
        id: 'java',
        name: 'Java Fundamentals',
        category: 'Programming',
        currentLevel: 'Advanced',
        targetLevel: 'Advanced',
        priority: 'Aligned',
        status: 'Completed',
        description: 'Core OOP, multi-threading basics, collections framework, and JVM execution principles.',
        whyItMatters: 'Foundational typed language required for high-throughput enterprise service architectures.',
        learn: 'JVM architecture, memory management, Generics, and modern Java 17/21 language features.',
        practice: 'Implement thread-safe collections and benchmarking micro-operations.',
        build: 'Build a modular CLI utility for data serialization and file processing.',
        validate: 'Pass algorithmic unit tests and demonstrate clean OOP polymorphism.',
        difficulty: 'Advanced',
        activities: [
          { id: 'act-java-1', type: 'learn', title: 'Review Java memory model & garbage collection fundamentals', completed: true },
          { id: 'act-java-2', type: 'practice', title: 'Write concurrency examples with virtual threads and executor services', completed: true },
          { id: 'act-java-3', type: 'build', title: 'Construct a multi-threaded data parser with unit test coverage', completed: true },
          { id: 'act-java-4', type: 'validate', title: 'Benchmark memory allocation against large dataset streams', completed: false },
        ],
      },
      {
        id: 'sql',
        name: 'SQL & Relational Schemas',
        category: 'Databases',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        priority: 'Medium',
        status: 'Completed',
        description: 'Relational data structures, normal forms, indexing strategies, and ACID transaction semantics.',
        whyItMatters: 'Data persistence and fast query plans prevent critical service bottlenecks.',
        learn: 'Query execution plans (EXPLAIN ANALYZE), B-Tree vs Hash indexing, and isolation levels.',
        practice: 'Write complex window functions, CTEs, and recursive hierarchy queries.',
        build: 'Design a normalized 3NF database schema with foreign key constraints & indexes.',
        validate: 'Verify index usage and optimize a slow query from 1.2s to sub-10ms.',
        difficulty: 'Advanced',
        activities: [
          { id: 'act-sql-1', type: 'learn', title: 'Study transaction isolation anomalies (dirty reads, phantom reads)', completed: true },
          { id: 'act-sql-2', type: 'practice', title: 'Write partition queries and window aggregate analytics', completed: true },
          { id: 'act-sql-3', type: 'build', title: 'Implement database migration scripts using Flyway/Liquibase', completed: true },
          { id: 'act-sql-4', type: 'validate', title: 'Profile query execution plans using PostgreSQL EXPLAIN ANALYZE', completed: false },
        ],
      },
      {
        id: 'rest-apis',
        name: 'REST API Design & Standards',
        category: 'Web Services',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
        status: 'In Progress',
        description: 'Idempotency, HTTP verbs, status codes, payload serialization, and OpenAPI contracts.',
        whyItMatters: 'Decoupled API contracts enable frontend-backend interoperability and scalable microservices.',
        learn: 'RFC 7807 problem details, pagination headers, and RESTful resource naming conventions.',
        practice: 'Design OpenAPI 3.0 specification documents with complete request/response schemas.',
        build: 'Implement REST controllers with validation annotations and global exception handlers.',
        validate: 'Validate contract compliance using automated API integration tests.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-rest-1', type: 'learn', title: 'Understand HTTP methods, status code taxonomy, and idempotency guarantees', completed: true },
          { id: 'act-rest-2', type: 'practice', title: 'Design an OpenAPI 3.0 contract for an e-commerce catalog API', completed: false },
          { id: 'act-rest-3', type: 'build', title: 'Implement a RESTful service with query parameter filtering & sorting', completed: false },
          { id: 'act-rest-4', type: 'validate', title: 'Test endpoints with Postman/Newman in automated test runs', completed: false },
        ],
      },
    ],
  },
  {
    id: 'backend-development',
    stageNumber: '02',
    title: 'Backend Development',
    subtitle: 'Microservices, Spring framework, caching & automated testing',
    status: 'In Progress',
    defaultProgress: 45,
    skills: [
      {
        id: 'spring-boot',
        name: 'Spring Boot & Spring Data',
        category: 'Backend',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        priority: 'High',
        status: 'In Progress',
        description: 'Enterprise dependency injection, Spring MVC, Spring Data JPA, and security middleware.',
        whyItMatters: 'Standard framework for modern Java cloud services and microservice ecosystems.',
        learn: 'Spring bean lifecycles, configuration properties, JPA N+1 problem, and Spring Security filters.',
        practice: 'Configure custom authentication filters with JWT tokens and role authorizations.',
        build: 'Build an end-to-end multi-entity CRUD microservice with PostgreSQL persistence.',
        validate: 'Execute integration tests using Testcontainers running an isolated database.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-sb-1', type: 'learn', title: 'Master Spring Boot auto-configuration and component scanning mechanics', completed: true },
          { id: 'act-sb-2', type: 'practice', title: 'Configure Spring Security with JWT token generation and validation', completed: true },
          { id: 'act-sb-3', type: 'build', title: 'Build a resilient payment checkout API service with transaction boundaries', completed: false },
          { id: 'act-sb-4', type: 'validate', title: 'Write Testcontainers integration tests validating rollback behaviour', completed: false },
        ],
      },
      {
        id: 'redis',
        name: 'Redis Caching & Performance',
        category: 'Databases',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
        status: 'Next',
        description: 'In-memory key-value caching, TTL expiration, cache-aside pattern, and rate limiting.',
        whyItMatters: 'Sub-millisecond latency for hot data, session persistence, and distributed locks.',
        learn: 'Redis data structures (strings, hashes, sets, sorted sets) and eviction policies.',
        practice: 'Implement cache-aside pattern with Spring Cache annotations (@Cacheable, @CacheEvict).',
        build: 'Create a distributed API rate limiter using Redis token bucket counters.',
        validate: 'Measure p99 latency reduction with and without caching enabled under load.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-red-1', type: 'learn', title: 'Understand Redis in-memory storage, TTL expiry, and LRU/LFU eviction', completed: false },
          { id: 'act-red-2', type: 'practice', title: 'Implement cache-aside pattern with Spring Data Redis', completed: false },
          { id: 'act-red-3', type: 'build', title: 'Construct a sliding-window rate limiter preventing API abuse', completed: false },
          { id: 'act-red-4', type: 'validate', title: 'Load test API with k6/JMeter to verify sub-5ms cached response times', completed: false },
        ],
      },
      {
        id: 'testing',
        name: 'Automated Testing & QA',
        category: 'Quality Assurance',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
        status: 'Upcoming',
        description: 'Unit testing with JUnit 5, mocking with Mockito, and slice testing with @WebMvcTest.',
        whyItMatters: 'High-confidence refactoring and bug prevention across continuous delivery cycles.',
        learn: 'Testing pyramid, test doubles (mocks, stubs, fakes), and assertions with AssertJ.',
        practice: 'Write parameterized tests for boundary condition validation and edge cases.',
        build: 'Achieve >85% code coverage across service and repository layers.',
        validate: 'Enforce Jacoco code coverage verification in the build lifecycle.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-tst-1', type: 'learn', title: 'Understand unit vs integration vs end-to-end testing boundaries', completed: false },
          { id: 'act-tst-2', type: 'practice', title: 'Mock external HTTP clients with WireMock and Mockito', completed: false },
          { id: 'act-tst-3', type: 'build', title: 'Add full integration test suite for authentication and user workflows', completed: false },
          { id: 'act-tst-4', type: 'validate', title: 'Configure Jacoco threshold failure on pull requests', completed: false },
        ],
      },
    ],
  },
  {
    id: 'cloud-deployment',
    stageNumber: '03',
    title: 'Cloud & Deployment',
    subtitle: 'Containerization, AWS cloud infrastructure & CI/CD automation',
    status: 'Upcoming',
    defaultProgress: 20,
    isCurrentFocusStage: true,
    skills: [
      {
        id: 'aws',
        name: 'AWS Cloud Fundamentals',
        category: 'Cloud',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Critical',
        status: 'Next',
        isCurrentFocus: true,
        description: 'Compute (EC2, ECS, App Runner), storage (S3), relational database services (RDS), and IAM permissions.',
        whyItMatters: 'Cloud infrastructure is the primary deployment environment for modern scalable backend applications.',
        learn: 'VPC subnets, security groups, IAM roles, S3 bucket policies, and managed database provisioning.',
        practice: 'Configure AWS CLI, deploy a containerized service, and generate pre-signed S3 URLs.',
        build: 'Deploy a containerized Spring Boot API connected to an AWS RDS PostgreSQL instance.',
        validate: 'Document cloud architecture diagram and test live public API endpoints.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-aws-1', type: 'learn', title: 'Understand AWS global infrastructure, regions, VPCs, and IAM security models', completed: true },
          { id: 'act-aws-2', type: 'practice', title: 'Provision S3 buckets and configure secure presigned upload URLs', completed: false },
          { id: 'act-aws-3', type: 'build', title: 'Deploy a containerized backend service to AWS App Runner / ECS', completed: false },
          { id: 'act-aws-4', type: 'validate', title: 'Verify health checks, CloudWatch logs, and RDS connection pooling', completed: false },
        ],
      },
      {
        id: 'docker',
        name: 'Docker & Containerization',
        category: 'DevOps',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
        status: 'Upcoming',
        description: 'Multi-stage Dockerfiles, image optimization, container networking, and Docker Compose stacks.',
        whyItMatters: 'Guarantees local development parity with production deployment environments.',
        learn: 'Layer caching, minimal base images (Alpine/Distroless), non-root execution, and compose services.',
        practice: 'Containerize a Java application and reduce image footprint from 500MB to under 150MB.',
        build: 'Create a full Docker Compose stack with API, PostgreSQL, and Redis containers.',
        validate: 'Run `docker compose up` on a fresh machine with zero external dependencies.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-dkr-1', type: 'learn', title: 'Learn Docker architecture, daemon, image layers, and container isolation', completed: true },
          { id: 'act-dkr-2', type: 'practice', title: 'Write multi-stage Dockerfile with multi-platform build support', completed: false },
          { id: 'act-dkr-3', type: 'build', title: 'Compose local multi-container environment with persistent volumes', completed: false },
          { id: 'act-dkr-4', type: 'validate', title: 'Scan container image for vulnerabilities using Trivy / Docker Scout', completed: false },
        ],
      },
      {
        id: 'cicd',
        name: 'CI/CD Automation',
        category: 'DevOps',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
        status: 'Upcoming',
        description: 'GitHub Actions workflows, automated linting, test execution, and container registry publishing.',
        whyItMatters: 'Automates manual deployment friction and catches integration issues immediately.',
        learn: 'YAML workflow syntax, matrix builds, secret variables, and environment approvals.',
        practice: 'Create a pipeline that triggers on pull requests and executes automated Gradle/Maven test suites.',
        build: 'Automate build, test, Docker image creation, and deployment to staging cloud on main branch push.',
        validate: 'Merge a PR and observe fully automated test execution and container deployment.',
        difficulty: 'Intermediate',
        activities: [
          { id: 'act-ci-1', type: 'learn', title: 'Understand CI/CD lifecycle stages: Lint → Test → Build → Deploy', completed: false },
          { id: 'act-ci-2', type: 'practice', title: 'Write GitHub Actions workflow to run JUnit tests on PR creation', completed: false },
          { id: 'act-ci-3', type: 'build', title: 'Build automated pipeline building & pushing images to Amazon ECR / Docker Hub', completed: false },
          { id: 'act-ci-4', type: 'validate', title: 'Verify deployment smoke tests pass before traffic promotion', completed: false },
        ],
      },
    ],
  },
  {
    id: 'system-design',
    stageNumber: '04',
    title: 'System Design',
    subtitle: 'Scalability, distributed caching, messaging queues & partitioning',
    status: 'Upcoming',
    defaultProgress: 0,
    skills: [
      {
        id: 'system-design',
        name: 'System Design & Scalability',
        category: 'Architecture',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
        status: 'Upcoming',
        description: 'Load balancers, horizontal scaling, database sharding, caching tiers, and CAP theorem trade-offs.',
        whyItMatters: 'Enables backend engineers to design systems that maintain performance under millions of requests.',
        learn: 'Consistent hashing, message brokers (Kafka/RabbitMQ), event-driven architectures, and database replication.',
        practice: 'Draw end-to-end architecture diagrams calculating read/write throughput and storage estimates.',
        build: 'Design a scalable URL shortener with distributed Snowflake ID generation and Redis caching.',
        validate: 'Present and justify architectural trade-offs between consistency and availability.',
        difficulty: 'Advanced',
        activities: [
          { id: 'act-sd-1', type: 'learn', title: 'Study load balancing algorithms, forward vs reverse proxies, and CDN caching', completed: false },
          { id: 'act-sd-2', type: 'practice', title: 'Calculate QPS, storage requirements, and bandwidth for a photo-sharing platform', completed: false },
          { id: 'act-sd-3', type: 'build', title: 'Architect a distributed rate-limiting proxy with Redis sliding windows', completed: false },
          { id: 'act-sd-4', type: 'validate', title: 'Defend database choice (SQL vs NoSQL) against specific latency SLAs', completed: false },
        ],
      },
    ],
  },
  {
    id: 'role-readiness',
    stageNumber: '05',
    title: 'Role Readiness',
    subtitle: 'Capstone project, technical review & engineering interview preparation',
    status: 'Upcoming',
    defaultProgress: 0,
    skills: [
      {
        id: 'capstone',
        name: 'End-to-End Backend Capstone',
        category: 'Project Building',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        priority: 'High',
        status: 'Upcoming',
        description: 'Complete production-grade backend system demonstrating all calibrated competencies in code.',
        whyItMatters: 'Provides concrete, verifiable evidence of applied workforce capability.',
        learn: 'Production observability (Prometheus/Grafana), structured JSON logging, and clean documentation.',
        practice: 'Perform code review audits, dependency security scans, and API benchmark load testing.',
        build: 'Deploy a multi-service event-driven application with automated CI/CD and cloud hosting.',
        validate: 'Publish open-source repository with comprehensive README, OpenAPI spec, and live demo link.',
        difficulty: 'Advanced',
        activities: [
          { id: 'act-cap-1', type: 'learn', title: 'Review 12-factor app methodology and cloud-native best practices', completed: false },
          { id: 'act-cap-2', type: 'practice', title: 'Instrument metrics with Micrometer, Prometheus, and health actuator endpoints', completed: false },
          { id: 'act-cap-3', type: 'build', title: 'Deliver complete production-grade repository with automated tests & Docker Compose', completed: false },
          { id: 'act-cap-4', type: 'validate', title: 'Record architectural walkthrough demonstrating database indexing and failover', completed: false },
        ],
      },
    ],
  },
];

export const projectRecommendations = [
  {
    id: 'proj-1',
    title: 'Deploy a Cloud-Native Spring Boot REST API',
    category: 'Cloud & Backend',
    skillsPracticed: ['Spring Boot', 'REST APIs', 'AWS', 'PostgreSQL'],
    difficulty: 'Intermediate',
    estimatedTime: '2-3 weeks',
    purpose: 'Bridge backend Java development with practical AWS deployment, S3 asset storage, and managed database connections.',
    deliverables: [
      'Spring Boot REST API with Spring Data JPA',
      'AWS S3 presigned URL generation for file attachments',
      'AWS RDS PostgreSQL connection pooling & migrations',
      'Automated health check endpoints and error responses',
    ],
  },
  {
    id: 'proj-2',
    title: 'Containerize a Multi-Service Backend Stack',
    category: 'DevOps & Tooling',
    skillsPracticed: ['Docker', 'Docker Compose', 'Redis', 'CI/CD'],
    difficulty: 'Intermediate',
    estimatedTime: '1-2 weeks',
    purpose: 'Master containerization workflows, multi-stage Dockerfiles, and reproducible local multi-service orchestration.',
    deliverables: [
      'Multi-stage Dockerfile optimizing image size under 150MB',
      'Docker Compose stack with API, PostgreSQL, and Redis',
      'GitHub Actions workflow running automated container builds on PR',
      'Environment secret handling without hardcoded credentials',
    ],
  },
  {
    id: 'proj-3',
    title: 'Architect a Scalable Distributed URL Shortener',
    category: 'System Architecture',
    skillsPracticed: ['System Design', 'Redis', 'SQL', 'Caching'],
    difficulty: 'Advanced',
    estimatedTime: '2-3 weeks',
    purpose: 'Demonstrate scalability principles, sub-millisecond cached lookups, distributed unique ID generation, and rate limiting.',
    deliverables: [
      'Distributed Snowflake/Base62 unique short-code generation',
      'Cache-aside lookup with Redis handling 95%+ read traffic',
      'Sliding window rate limiter per client IP address',
      'Documented architecture diagram with throughput calculations',
    ],
  },
];

export const roleReadinessAreas = [
  { name: 'Programming', percentage: 88, status: 'Advanced', color: 'brand' },
  { name: 'Backend Frameworks', percentage: 82, status: 'Proficient', color: 'brand' },
  { name: 'Databases & SQL', percentage: 76, status: 'Proficient', color: 'brand' },
  { name: 'Cloud Infrastructure', percentage: 42, status: 'Emerging', color: 'amber' },
  { name: 'DevOps & Containers', percentage: 35, status: 'Foundational', color: 'amber' },
  { name: 'System Design', percentage: 28, status: 'Foundational', color: 'charcoal' },
];

export const completedMilestonesInferred = [
  { title: 'Java Fundamentals & OOP', detail: 'Advanced rating declared · Verified in baseline profile', date: 'Calibrated' },
  { title: 'SQL Querying & Normalization', detail: 'Intermediate rating declared · Relational databases mapped', date: 'Calibrated' },
  { title: 'JavaScript Syntax & Web Basics', detail: 'Intermediate rating declared · Frontend baseline mapped', date: 'Calibrated' },
  { title: 'Profile Calibration & Taxonomy Sync', detail: 'Completed 100% individual profile calibration', date: 'Completed' },
];

/**
 * Local Storage Persistence Manager for Roadmap Progress
 */
const STORAGE_KEY = 'skillsetu_roadmap_progress_v1';

export const getStoredRoadmapProgress = () => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load roadmap progress from localStorage:', e);
  }
  return {};
};

export const saveRoadmapProgress = (progressState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
  } catch (e) {
    console.warn('Failed to save roadmap progress to localStorage:', e);
  }
};

/**
 * Recalculate stages and overall roadmap percentage using stored activity completions
 */
export const calculateRoadmapMetrics = (stages = defaultRoadmapStages, storedState = {}) => {
  let totalActivities = 0;
  let completedActivities = 0;

  const updatedStages = stages.map((stage) => {
    let stageTotalActs = 0;
    let stageCompletedActs = 0;

    const updatedSkills = (stage.skills || []).map((skill) => {
      const updatedActs = (skill.activities || []).map((act) => {
        // If user toggled in localStorage, use it, else default
        const isCompleted =
          storedState[act.id] !== undefined ? storedState[act.id] : act.completed;
        return { ...act, completed: Boolean(isCompleted) };
      });

      const skillDone = updatedActs.filter((a) => a.completed).length;
      stageTotalActs += updatedActs.length;
      stageCompletedActs += skillDone;

      const skillStatus =
        skillDone === updatedActs.length
          ? 'Completed'
          : skillDone > 0
          ? 'In Progress'
          : skill.status || 'Upcoming';

      return {
        ...skill,
        activities: updatedActs,
        status: skillStatus,
        completedActivitiesCount: skillDone,
        totalActivitiesCount: updatedActs.length,
      };
    });

    totalActivities += stageTotalActs;
    completedActivities += stageCompletedActs;

    const stagePct =
      stageTotalActs > 0 ? Math.round((stageCompletedActs / stageTotalActs) * 100) : stage.defaultProgress;

    const stageStatus =
      stagePct >= 100
        ? 'Completed'
        : stagePct > 0
        ? 'In Progress'
        : stage.status || 'Upcoming';

    return {
      ...stage,
      skills: updatedSkills,
      progress: stagePct,
      status: stageStatus,
      completedActivitiesCount: stageCompletedActs,
      totalActivitiesCount: stageTotalActs,
    };
  });

  const overallRoadmapProgress =
    totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 18;

  return {
    stages: updatedStages,
    overallRoadmapProgress: Math.max(12, overallRoadmapProgress),
    totalActivities,
    completedActivities,
    currentFocusSkill: updatedStages
      .flatMap((s) => s.skills)
      .find((s) => s.isCurrentFocus || s.priority === 'Critical') || updatedStages[2]?.skills[0],
  };
};
