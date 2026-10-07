/**
 * SkillSetu Skill Gap Analysis Mock Data Architecture
 * Deterministic capability comparison, gap prioritization & taxonomy mapping
 */

export const roleRequirementTaxonomy = {
  'Backend Software Engineer': [
    {
      id: 'java',
      name: 'Java',
      category: 'Programming',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Core enterprise language for scalable concurrency, multi-threading, and resilient service backends.',
      skillContext: 'Java powers high-throughput microservices, robust typed APIs, and mission-critical enterprise systems.',
      whatToBuild: [
        'Master OOP, generics, collections framework and Java 17/21 features',
        'Implement thread-safe concurrency with virtual threads & executors',
        'Build structured exception handling and performance benchmarks',
      ],
      difficulty: 'Advanced',
      prerequisites: ['Basic Programming', 'OOP Fundamentals'],
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Databases',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Data persistence, relational schema design, query optimization, and transactional integrity.',
      skillContext: 'Databases form the stateful backbone of backend engineering; indexing and query plans prevent production bottlenecks.',
      whatToBuild: [
        'Design 3NF normalized schemas with composite indexes & constraints',
        'Write complex window functions, CTEs, and query optimization plans',
        'Understand ACID isolation levels, deadlocks, and transaction locks',
      ],
      difficulty: 'Advanced',
      prerequisites: ['Relational Concepts', 'Basic CRUD'],
    },
    {
      id: 'spring-boot',
      name: 'Spring Boot',
      category: 'Backend',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Industry standard for modern Java microservices, dependency injection, and RESTful web services.',
      skillContext: 'Spring Boot accelerates service development with embedded servers, auto-configuration, and robust ecosystem tooling.',
      whatToBuild: [
        'Build production REST APIs with Spring Data JPA and Hibernate',
        'Implement JWT authentication, OAuth2 resource servers, and role RBAC',
        'Integrate distributed caching with Redis and async events',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['Java', 'SQL'],
    },
    {
      id: 'rest-apis',
      name: 'REST APIs',
      category: 'Web Services',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'API contract design, status codes, payload serialization, and client-server decoupling.',
      skillContext: 'Clean REST contracts and OpenAPI documentation enable seamless integration between frontend clients and backend logic.',
      whatToBuild: [
        'Design idempotent HTTP endpoints following RESTful standards',
        'Implement structured error responses with RFC 7807 problem details',
        'Add OpenAPI / Swagger interactive documentation and rate limiting',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['HTTP Protocol', 'JSON'],
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'Cloud',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Cloud infrastructure knowledge commonly appears alongside backend engineering responsibilities.',
      skillContext: 'Modern backends deploy directly to cloud providers where compute, object storage, and managed databases operate at scale.',
      whatToBuild: [
        'Deploy a containerized Spring Boot API to AWS App Runner or ECS',
        'Configure S3 for asset storage with signed upload URLs',
        'Set up RDS PostgreSQL with secure IAM authentication and VPC subnets',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['Networking Basics', 'Linux Basics'],
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'DevOps',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Containerization can strengthen practical deployment and development workflow knowledge.',
      skillContext: 'Containers guarantee runtime consistency across development, staging, and production environments.',
      whatToBuild: [
        'Write multi-stage Dockerfiles optimizing image size and security',
        'Orchestrate local multi-service stacks (API + PostgreSQL + Redis) using Docker Compose',
        'Implement health checks, volume persistence, and non-root users',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['Linux Commands', 'CLI Basics'],
    },
    {
      id: 'system-design',
      name: 'System Design',
      category: 'Architecture',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'System design helps connect individual backend components with scalable application architecture.',
      skillContext: 'Understanding load balancers, caching, message queues, and partitioning is critical for real-world backend reliability.',
      whatToBuild: [
        'Design a scalable URL shortener with distributed ID generation',
        'Model a rate limiter using token bucket and sliding window algorithms',
        'Compare monolithic vs microservices tradeoffs with asynchronous messaging',
      ],
      difficulty: 'Advanced',
      prerequisites: ['Databases', 'Networking', 'Web Services'],
    },
    {
      id: 'testing',
      name: 'Automated Testing',
      category: 'Quality Assurance',
      requiredLevel: 'Intermediate',
      roleImportance: 'Medium',
      marketRelevance: 'High',
      futureRelevance: 'Medium',
      whyItMatters: 'Unit tests, mock objects, and integration tests safeguard business logic during continuous refactoring.',
      skillContext: 'High-coverage test suites prevent regressions and facilitate rapid deployment pipelines.',
      whatToBuild: [
        'Write unit tests with JUnit 5 and Mockito for service layer logic',
        'Implement integration tests using Testcontainers and real PostgreSQL instances',
        'Measure code coverage and establish quality gates',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['Java', 'OOP'],
    },
    {
      id: 'cicd',
      name: 'CI/CD Pipelines',
      category: 'DevOps',
      requiredLevel: 'Intermediate',
      roleImportance: 'Medium',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Automated build, test, and container packaging triggers on every commit.',
      skillContext: 'Continuous integration eliminates manual deployment friction and catches syntax/test failures instantly.',
      whatToBuild: [
        'Create a GitHub Actions workflow to lint, build, and test PRs',
        'Automate Docker image building and publishing to container registries',
        'Implement deployment steps with environment secrets management',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['Git', 'Docker'],
    },
    {
      id: 'redis',
      name: 'Redis',
      category: 'Databases',
      requiredLevel: 'Intermediate',
      roleImportance: 'Medium',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'In-memory key-value caching reduces database read pressure and enables distributed locks.',
      skillContext: 'Redis provides sub-millisecond response times for session stores, leaderboard metrics, and pub/sub messaging.',
      whatToBuild: [
        'Implement cache-aside pattern with TTL expiration for API responses',
        'Build a distributed rate limiter and token bucket in Redis',
        'Use Redis Pub/Sub for lightweight real-time event broadcasting',
      ],
      difficulty: 'Intermediate',
      prerequisites: ['SQL', 'Key-Value Concepts'],
    },
    {
      id: 'git',
      name: 'Git',
      category: 'Programming',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Version control, branch management, merge conflict resolution, and collaborative workflow standard.',
      skillContext: 'Every modern engineering team collaborates via distributed Git workflows and pull request reviews.',
      whatToBuild: [
        'Master interactive rebase, squashing commits, and stash workflows',
        'Manage release branches, semantic tagging, and conventional commits',
        'Resolve complex three-way merge conflicts cleanly',
      ],
      difficulty: 'Beginner',
      prerequisites: ['CLI Basics'],
    },
    {
      id: 'linux',
      name: 'Linux Fundamentals',
      category: 'DevOps',
      requiredLevel: 'Intermediate',
      roleImportance: 'Medium',
      marketRelevance: 'Medium',
      futureRelevance: 'Medium',
      whyItMatters: 'Server environment navigation, process management, shell scripting, and log inspection.',
      skillContext: 'Almost all cloud compute environments and containers run on Linux distributions.',
      whatToBuild: [
        'Master bash commands (grep, awk, sed, curl, journalctl, top)',
        'Configure file permissions, SSH keys, and systemd services',
        'Write bash automation scripts for backup and deployment verification',
      ],
      difficulty: 'Beginner',
      prerequisites: ['Operating System Basics'],
    },
  ],

  'Software Engineer': [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      category: 'Programming',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Algorithmic efficiency, Big-O optimization, trees, graphs, and dynamic programming.',
      skillContext: 'Core algorithmic problem solving underpins software performance across all engineering domains.',
      whatToBuild: ['Solve LeetCode medium/hard patterns', 'Implement custom graphs and tries'],
      difficulty: 'Advanced',
      prerequisites: ['Math', 'Basic Logic'],
    },
    {
      id: 'java',
      name: 'Java',
      category: 'Programming',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Strong typing, concurrency, and enterprise systems baseline.',
      skillContext: 'Foundational language for full-stack, enterprise, and distributed systems engineering.',
      whatToBuild: ['Build structured modular software architectures'],
      difficulty: 'Advanced',
      prerequisites: ['OOP'],
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Programming',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Universal web language for frontends, scripting, and server runtimes.',
      skillContext: 'Event-driven, asynchronous programming model ubiquitous across modern software engineering.',
      whatToBuild: ['Async/await event loop mastery', 'ES6+ modules and promises'],
      difficulty: 'Intermediate',
      prerequisites: ['Basic Programming'],
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Databases',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Relational data query modeling and integrity.',
      skillContext: 'State management and data queries in every software application.',
      whatToBuild: ['Complex joins and index optimization'],
      difficulty: 'Intermediate',
      prerequisites: ['Basic CRUD'],
    },
    {
      id: 'git',
      name: 'Git',
      category: 'Programming',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Collaboration and version control baseline.',
      skillContext: 'Team code collaboration and CI/CD triggers.',
      whatToBuild: ['Git flow and PR review mastery'],
      difficulty: 'Beginner',
      prerequisites: ['CLI'],
    },
  ],

  'Full Stack Developer': [
    {
      id: 'react',
      name: 'React',
      category: 'Frontend',
      requiredLevel: 'Advanced',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Modern component-driven UI architecture, hooks, and virtual DOM reconciliation.',
      skillContext: 'The dominant frontend framework for web applications globally.',
      whatToBuild: ['Custom hooks and state stores', 'Optimized rendering & code-splitting'],
      difficulty: 'Intermediate',
      prerequisites: ['JavaScript', 'HTML/CSS'],
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Programming',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Type safety, autocompletion, and maintainability across large frontends.',
      skillContext: 'Industry standard for enterprise web application development.',
      whatToBuild: ['Generic interfaces and strict type models'],
      difficulty: 'Intermediate',
      prerequisites: ['JavaScript'],
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Backend',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Asynchronous event-driven backend services in JavaScript.',
      skillContext: 'Fast API proxying and lightweight server runtimes.',
      whatToBuild: ['Express/Fastify REST APIs with middleware authentication'],
      difficulty: 'Intermediate',
      prerequisites: ['JavaScript'],
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Databases',
      requiredLevel: 'Intermediate',
      roleImportance: 'High',
      marketRelevance: 'High',
      futureRelevance: 'High',
      whyItMatters: 'Relational data modeling and queries.',
      skillContext: 'Core database operations for full-stack applications.',
      whatToBuild: ['Prisma/TypeORM migrations and schema design'],
      difficulty: 'Intermediate',
      prerequisites: ['Databases'],
    },
  ],
};

/**
 * Level rating to numeric conversion
 */
export const levelToScore = {
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

export const scoreToLevel = {
  0: 'None',
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};

/**
 * Core Prioritization Model Calculation
 * Computes deterministic gap metrics and priority scores
 */
export const calculateSkillGaps = (userSkills = [], targetRoleName = 'Backend Software Engineer') => {
  const requirements =
    roleRequirementTaxonomy[targetRoleName] || roleRequirementTaxonomy['Backend Software Engineer'];

  // Map user skill levels
  const userSkillMap = {};
  userSkills.forEach((s) => {
    userSkillMap[s.name.toLowerCase()] = s.proficiency || 'Intermediate';
  });

  const analyzedSkills = requirements.map((req) => {
    // Find matching user skill
    let userLevel = 'None';
    const foundKey = Object.keys(userSkillMap).find(
      (k) => k === req.name.toLowerCase() || req.name.toLowerCase().includes(k) || k.includes(req.name.toLowerCase())
    );

    if (foundKey) {
      userLevel = userSkillMap[foundKey];
    } else if (req.id === 'git') {
      userLevel = 'Intermediate'; // Standard baseline for technical users
    } else if (req.id === 'linux') {
      userLevel = 'Beginner';
    }

    const userScore = levelToScore[userLevel] || 0;
    const reqScore = levelToScore[req.requiredLevel] || 2;
    const gapDiff = reqScore - userScore;

    let gapIntensity = 'Aligned';
    let gapScore = 0;

    if (gapDiff <= 0) {
      gapIntensity = 'Aligned';
      gapScore = 0;
    } else if (gapDiff === 1) {
      gapIntensity = 'Medium';
      gapScore = 1;
    } else {
      gapIntensity = 'High';
      gapScore = 2;
    }

    // Role, Market, and Future weights
    const roleWeight = req.roleImportance === 'High' ? 3 : req.roleImportance === 'Medium' ? 2 : 1;
    const marketWeight = req.marketRelevance === 'High' ? 3 : req.marketRelevance === 'Medium' ? 2 : 1;
    const futureWeight = req.futureRelevance === 'High' ? 3 : req.futureRelevance === 'Medium' ? 2 : 1;

    // Prioritization Score Formula
    const priorityScore = gapScore * (roleWeight * 3 + marketWeight * 2 + futureWeight * 2);

    let priorityLabel = 'Aligned';
    if (gapIntensity === 'High' && req.roleImportance === 'High') {
      priorityLabel = 'Critical';
    } else if (gapIntensity === 'High' || (gapIntensity === 'Medium' && req.roleImportance === 'High')) {
      priorityLabel = 'High';
    } else if (gapIntensity === 'Medium') {
      priorityLabel = 'Medium';
    }

    return {
      ...req,
      userLevel,
      userScore,
      reqScore,
      gapIntensity,
      gapScore,
      priorityScore,
      priorityLabel,
      isAligned: gapDiff <= 0,
      isPriority: priorityLabel === 'Critical' || priorityLabel === 'High',
      isDeveloping: priorityLabel === 'Medium',
    };
  });

  // Sort by priorityScore descending
  analyzedSkills.sort((a, b) => b.priorityScore - a.priorityScore || b.reqScore - a.reqScore);

  // Groupings
  const alignedSkills = analyzedSkills.filter((s) => s.isAligned);
  const developingSkills = analyzedSkills.filter((s) => s.isDeveloping);
  const priorityGaps = analyzedSkills.filter((s) => s.isPriority);

  // Overall Alignment percentage calculation
  const totalReqPoints = analyzedSkills.reduce((acc, s) => acc + s.reqScore, 0);
  const totalUserPoints = analyzedSkills.reduce((acc, s) => acc + Math.min(s.userScore, s.reqScore), 0);
  const overallAlignment = Math.round((totalUserPoints / (totalReqPoints || 1)) * 100);

  // Average gap classification
  const avgGap =
    priorityGaps.length >= 4 ? 'Moderate-High' : priorityGaps.length >= 2 ? 'Moderate' : 'Low';

  // Curated Focus Areas
  const focusAreas = [
    {
      id: 'focus-cloud',
      title: 'Build Cloud Fundamentals',
      skillArea: 'AWS',
      category: 'Infrastructure',
      reason: 'Cloud infrastructure knowledge is directly relevant to backend deployment workflows.',
      suggestedFirstStep: 'Deploy a containerized API on AWS App Runner with an S3 bucket.',
      difficulty: 'Intermediate',
      priority: 'Critical Gap',
      tag: 'High Market Demand',
    },
    {
      id: 'focus-backend',
      title: 'Strengthen Enterprise Backend Development',
      skillArea: 'Spring Boot + REST APIs',
      category: 'Service Logic',
      reason: 'Deepen transaction management, Spring Security, and clean OpenAPI contract standards.',
      suggestedFirstStep: 'Build a JWT authenticated microservice with Spring Data JPA and automated tests.',
      difficulty: 'Intermediate',
      priority: 'Capability Booster',
      tag: 'Core Requirement',
    },
    {
      id: 'focus-containers',
      title: 'Master Containerization Workflows',
      skillArea: 'Docker',
      category: 'DevOps',
      reason: 'Containerization guarantees environment parity and reproducible microservice delivery.',
      suggestedFirstStep: 'Create multi-stage Dockerfiles and a full local multi-container Docker Compose stack.',
      difficulty: 'Intermediate',
      priority: 'High Priority',
      tag: 'Universal Standard',
    },
    {
      id: 'focus-architecture',
      title: 'Develop System Architecture Thinking',
      skillArea: 'System Design',
      category: 'Software Architecture',
      reason: 'Connect individual service code with distributed scalability, caching, and partitioning.',
      suggestedFirstStep: 'Design a scalable rate-limiting API proxy using Redis and token bucket algorithms.',
      difficulty: 'Advanced',
      priority: 'High Priority',
      tag: 'Career Milestone',
    },
  ];

  return {
    targetRole: targetRoleName,
    skillsAssessedCount: analyzedSkills.length,
    skillsAlignedCount: alignedSkills.length,
    priorityGapsCount: priorityGaps.length,
    developingCount: developingSkills.length,
    overallAlignment: Math.max(45, Math.min(95, overallAlignment)),
    averageGap: avgGap,
    allSkills: analyzedSkills,
    priorityGaps,
    developingSkills,
    alignedSkills,
    focusAreas,
    distribution: {
      aligned: alignedSkills.length,
      developing: developingSkills.length,
      priority: priorityGaps.length,
    },
    methodology: {
      title: 'How SkillSetu identifies skill gaps',
      disclaimer:
        'Skill gap insights are intended to support self-directed career development and should not be interpreted as hiring predictions.',
      formula: 'Priority Score = Gap Size × Role Importance × Market Relevance × Future Relevance',
      stages: [
        {
          step: '01',
          name: 'Understand Your Profile',
          points: ['Self-rated competencies', 'Academic coursework', 'Declared career goals'],
          desc: 'Your declared skills and academic baseline form your verified profile graph.',
        },
        {
          step: '02',
          name: 'Model Target Role',
          points: ['Taxonomy requirement benchmarks', 'Skill co-occurrence links', 'Seniority expectations'],
          desc: 'SkillSetu models target archetypes and maps adjacent skill dependencies.',
        },
        {
          step: '03',
          name: 'Compare Capability',
          points: ['Current level rating', 'Required benchmark level', 'Calculated gap delta'],
          desc: 'Calculates the specific delta between your current proficiency and target standards.',
        },
        {
          step: '04',
          name: 'Prioritize Development',
          points: ['Role importance weight', 'Market demand signals', 'Future relevance trajectory'],
          desc: 'Synthesizes focused priority rankings so you know exactly which competency to build first.',
        },
      ],
    },
  };
};
