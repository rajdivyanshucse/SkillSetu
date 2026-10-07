/**
 * SkillSetu Opportunities & Job Intelligence Centralized Mock Data
 * Realistic, deterministic opportunity architecture linking profile, skill gaps, and career roadmap
 */

export const OPPORTUNITY_DATA_DISCLAIMER =
  'Opportunity listings shown here are illustrative mock data for the SkillSetu prototype and do not represent live job-market listings.';

export const opportunitiesData = [
  {
    id: 'job-001',
    title: 'Backend Software Engineer',
    company: 'TechNova Solutions',
    companyLogo: 'TN',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹8–14 LPA',
    category: 'Backend',
    roleRelevance: 'Direct Target Match',
    compatibility: 84,
    compatibilityBreakdown: {
      roleAlignment: 88,
      skillCoverage: 78,
      requiredSkills: 82,
      developmentAlignment: 70,
    },
    skills: ['Java', 'Spring Boot', 'REST APIs', 'SQL', 'Docker', 'AWS'],
    matchingSkills: ['Java', 'SQL', 'REST APIs', 'Spring Boot'],
    developmentAreas: [
      {
        name: 'AWS',
        skillId: 'aws',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Critical',
      },
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'rest-apis',
        name: 'REST APIs',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'docker',
        name: 'Docker',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'docker',
        priority: 'High',
      },
      {
        id: 'aws',
        name: 'AWS',
        status: 'Gap',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'aws',
        priority: 'Critical',
      },
    ],
    preferredSkills: ['Redis', 'PostgreSQL', 'CI/CD Pipelines', 'Kafka'],
    whyRelevant: [
      'Direct match for your primary target role: Backend Software Engineer.',
      'Leverages 4 of your verified profile competencies: Java, SQL, REST APIs, and Spring Boot.',
      'Includes AWS and Docker, which are prioritized in Stage 03 of your Career Roadmap.',
      'Hybrid role based in Bengaluru aligned with standard backend workforce expectations.',
    ],
    description:
      'TechNova is seeking an enthusiastic Backend Software Engineer to design, build, and optimize scalable enterprise microservices. You will work on distributed data processing architectures, create resilient REST APIs, and collaborate on containerized cloud deployments.',
    responsibilities: [
      'Architect and build high-throughput microservices using Java and Spring Boot.',
      'Design relational schemas, optimize complex SQL queries, and ensure ACID transactional integrity.',
      'Develop clean, documented RESTful API endpoints adhering to enterprise standards.',
      'Participate in containerization workflows with Docker and deployment pipelines on AWS.',
      'Write comprehensive unit and integration tests to ensure software reliability.',
    ],
    requirements: [
      '1–3 years of professional or practical project experience in backend application development.',
      'Strong proficiency in Java 17+ and the Spring Boot ecosystem.',
      'Hands-on experience with relational databases (PostgreSQL/MySQL) and SQL optimization.',
      'Working knowledge of containerization concepts (Docker) and fundamental cloud infrastructure (AWS).',
      'Solid grasp of data structures, algorithms, and modular object-oriented design.',
    ],
    postedDaysAgo: 2,
    tags: ['Backend', 'Java', 'Spring Boot', 'Microservices', 'AWS'],
    isFeatured: true,
  },
  {
    id: 'job-002',
    title: 'Junior Java Developer',
    company: 'FinStack Systems',
    companyLogo: 'FS',
    location: 'Hyderabad, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹7–12 LPA',
    category: 'Backend',
    roleRelevance: 'Direct Target Match',
    compatibility: 89,
    compatibilityBreakdown: {
      roleAlignment: 92,
      skillCoverage: 86,
      requiredSkills: 90,
      developmentAlignment: 76,
    },
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Git', 'JUnit'],
    matchingSkills: ['Java', 'SQL', 'REST APIs', 'Spring Boot'],
    developmentAreas: [
      {
        name: 'Automated Testing',
        skillId: 'testing',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'rest-apis',
        name: 'REST APIs',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'testing',
        name: 'Automated Testing',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'testing',
        priority: 'Medium',
      },
    ],
    preferredSkills: ['Docker', 'Hibernate', 'Maven', 'Redis'],
    whyRelevant: [
      'Exceptionally high alignment with your core Java & Spring Boot background.',
      'Strong fit for early-to-mid career backend trajectory.',
      'Emphasizes core API architecture and transactional database operations.',
    ],
    description:
      'FinStack Systems builds secure, high-availability financial transaction backends. We are looking for a Junior Java Developer to contribute to core settlement services, ledger integrations, and automated testing suites.',
    responsibilities: [
      'Implement robust backend API services handling payment verification workflows.',
      'Maintain database integrity with optimized relational queries and indexing.',
      'Write maintainable unit test suites with JUnit and Mockito.',
      'Collaborate with senior engineers on code reviews and architectural discussions.',
    ],
    requirements: [
      'Demonstrated experience building backend web applications in Java.',
      'Familiarity with Spring Framework and Spring Boot core modules.',
      'Understanding of relational database management systems and transaction isolation.',
      'Familiarity with version control using Git.',
    ],
    postedDaysAgo: 3,
    tags: ['Java', 'FinTech', 'Spring Boot', 'SQL', 'APIs'],
    isFeatured: true,
  },
  {
    id: 'job-003',
    title: 'Full Stack Engineer (Java/React)',
    company: 'OmniFlow Digital',
    companyLogo: 'OF',
    location: 'Remote, India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹10–16 LPA',
    category: 'Full Stack',
    roleRelevance: 'Adjacent Target Match',
    compatibility: 76,
    compatibilityBreakdown: {
      roleAlignment: 75,
      skillCoverage: 74,
      requiredSkills: 78,
      developmentAlignment: 68,
    },
    skills: ['Java', 'Spring Boot', 'React', 'JavaScript', 'SQL', 'Docker'],
    matchingSkills: ['Java', 'Spring Boot', 'SQL', 'JavaScript'],
    developmentAreas: [
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
      {
        name: 'React Ecosystem',
        skillId: 'react',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'react',
        name: 'React',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'docker',
        name: 'Docker',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'docker',
        priority: 'High',
      },
    ],
    preferredSkills: ['Tailwind CSS', 'TypeScript', 'AWS EC2', 'Vite'],
    whyRelevant: [
      'Connects your backend strength in Java/Spring Boot with web application workflows.',
      'Remote flexibility with competitive tier-1 compensation.',
      'Enables progressive cross-functional engineering development.',
    ],
    description:
      'OmniFlow Digital is building intuitive collaboration tools for distributed global engineering teams. As a Full Stack Engineer, you will bridge our Spring Boot backend services with modern responsive frontend interfaces.',
    responsibilities: [
      'Develop end-to-end features spanning database schemas, REST APIs, and React interfaces.',
      'Ensure high performance and responsiveness across both client and server layers.',
      'Participate in agile sprints, design reviews, and automated release cycles.',
    ],
    requirements: [
      'Strong backend foundation in Java/Spring Boot and SQL.',
      'Hands-on proficiency with modern JavaScript (ES6+) and component-driven React.',
      'Knowledge of state management, client-side routing, and API integration.',
    ],
    postedDaysAgo: 1,
    tags: ['Full Stack', 'Java', 'React', 'Remote', 'Spring Boot'],
    isFeatured: false,
  },
  {
    id: 'job-004',
    title: 'Cloud Backend Developer',
    company: 'CloudScale Technologies',
    companyLogo: 'CS',
    location: 'Pune, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹9–15 LPA',
    category: 'Cloud',
    roleRelevance: 'Direct Target Match',
    compatibility: 79,
    compatibilityBreakdown: {
      roleAlignment: 82,
      skillCoverage: 72,
      requiredSkills: 76,
      developmentAlignment: 82,
    },
    skills: ['Java', 'REST APIs', 'AWS', 'Docker', 'Microservices', 'SQL'],
    matchingSkills: ['Java', 'REST APIs', 'SQL'],
    developmentAreas: [
      {
        name: 'AWS',
        skillId: 'aws',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Critical',
      },
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'rest-apis',
        name: 'REST APIs',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'aws',
        name: 'AWS (ECS, S3, RDS)',
        status: 'Gap',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'aws',
        priority: 'Critical',
      },
      {
        id: 'docker',
        name: 'Docker',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'docker',
        priority: 'High',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
    ],
    preferredSkills: ['Terraform', 'Kubernetes', 'CloudWatch', 'CI/CD'],
    whyRelevant: [
      'Accelerates your Cloud & Deployment roadmap stage (AWS + Docker).',
      'Provides hands-on experience in cloud infrastructure automation and container orchestration.',
      'Strong career stepping stone from standard backend to cloud-native architecture.',
    ],
    description:
      'CloudScale helps modern enterprises migrate monoliths to cloud-native microservices. We need a Cloud Backend Developer to build scalable APIs and manage containerized services deployed on AWS.',
    responsibilities: [
      'Develop resilient microservices that integrate with AWS cloud infrastructure (S3, RDS, ECS).',
      'Package and maintain multi-stage Docker container images for microservices.',
      'Implement observability metrics, structured logging, and health endpoints.',
    ],
    requirements: [
      'Solid experience in Java backend development and RESTful web service design.',
      'Foundational understanding of core AWS services (Compute, Storage, Networking, IAM).',
      'Hands-on experience containerizing services using Dockerfiles and Docker Compose.',
    ],
    postedDaysAgo: 5,
    tags: ['Cloud', 'AWS', 'Docker', 'Microservices', 'Java'],
    isFeatured: true,
  },
  {
    id: 'job-005',
    title: 'Software Engineer - Backend Platform',
    company: 'NexaByte Global',
    companyLogo: 'NB',
    location: 'Hyderabad, India',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹8.5–13.5 LPA',
    category: 'Software Engineering',
    roleRelevance: 'Direct Target Match',
    compatibility: 82,
    compatibilityBreakdown: {
      roleAlignment: 85,
      skillCoverage: 76,
      requiredSkills: 80,
      developmentAlignment: 72,
    },
    skills: ['Java', 'Spring Boot', 'SQL', 'System Design', 'Redis', 'REST APIs'],
    matchingSkills: ['Java', 'SQL', 'REST APIs', 'Spring Boot'],
    developmentAreas: [
      {
        name: 'System Design',
        skillId: 'system-design',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
      {
        name: 'Redis Caching',
        skillId: 'redis',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'system-design',
        name: 'System Design & Scalability',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'system-design',
        priority: 'High',
      },
      {
        id: 'redis',
        name: 'Redis',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'redis',
        priority: 'Medium',
      },
    ],
    preferredSkills: ['PostgreSQL', 'Message Queues', 'Distributed Systems'],
    whyRelevant: [
      'Emphasizes distributed architecture and caching concepts from Stage 02 & 04 of your roadmap.',
      'Strong engineering mentorship culture with modern code review practices.',
      'High overlap with your core Java & Spring Boot capabilities.',
    ],
    description:
      'NexaByte develops enterprise identity governance and access control platforms. We are seeking a Backend Platform Engineer to build scalable verification pipelines and integrate distributed caching layers.',
    responsibilities: [
      'Design modular backend components using Spring Boot and Java concurrency.',
      'Implement caching strategies with Redis to minimize database read latencies.',
      'Write clean, well-tested code with comprehensive error handling.',
    ],
    requirements: [
      'B.Tech/BE in Computer Science or equivalent practical experience.',
      'Strong fundamentals in Java programming, data structures, and algorithms.',
      'Working knowledge of caching mechanisms, relational schemas, and API design.',
    ],
    postedDaysAgo: 4,
    tags: ['Backend', 'Spring Boot', 'Redis', 'System Design', 'Java'],
    isFeatured: false,
  },
  {
    id: 'job-006',
    title: 'Data Engineer - Pipeline Infrastructure',
    company: 'DataStream Analytics',
    companyLogo: 'DS',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹9–15 LPA',
    category: 'Data',
    roleRelevance: 'Adjacent Target Match',
    compatibility: 68,
    compatibilityBreakdown: {
      roleAlignment: 65,
      skillCoverage: 66,
      requiredSkills: 70,
      developmentAlignment: 62,
    },
    skills: ['SQL', 'Python', 'Java', 'Data Pipelines', 'Docker', 'AWS'],
    matchingSkills: ['SQL', 'Java'],
    developmentAreas: [
      {
        name: 'Python for Data',
        skillId: 'python',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
      {
        name: 'AWS Data Services',
        skillId: 'aws',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Critical',
      },
    ],
    requiredSkills: [
      {
        id: 'sql',
        name: 'Advanced SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'python',
        name: 'Python',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'java',
        name: 'Java',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'aws',
        name: 'AWS S3 / Redshift',
        status: 'Gap',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'aws',
        priority: 'Critical',
      },
    ],
    preferredSkills: ['Apache Spark', 'Airflow', 'Snowflake', 'dbt'],
    whyRelevant: [
      'Leverages your strong SQL and relational database foundation.',
      'Broadens data engineering opportunities with high industry demand.',
    ],
    description:
      'DataStream Analytics builds real-time intelligence feeds for e-commerce platforms. As a Data Engineer, you will build data ingestion pipelines and maintain relational and analytical warehouses.',
    responsibilities: [
      'Write robust SQL transformations and ETL scripts.',
      'Optimize query execution plans and database storage efficiency.',
      'Assist in building automated data quality verification checks.',
    ],
    requirements: [
      'Expertise in complex SQL querying, indexing, and data modeling.',
      'Familiarity with Java or Python programming.',
      'Understanding of relational databases and data warehouse paradigms.',
    ],
    postedDaysAgo: 6,
    tags: ['Data', 'SQL', 'Data Pipelines', 'ETL', 'AWS'],
    isFeatured: false,
  },
  {
    id: 'job-007',
    title: 'DevOps & CI/CD Engineer',
    company: 'InfraOps Labs',
    companyLogo: 'IO',
    location: 'Remote, India',
    workMode: 'Remote',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹9–14 LPA',
    category: 'DevOps',
    roleRelevance: 'Adjacent Target Match',
    compatibility: 65,
    compatibilityBreakdown: {
      roleAlignment: 62,
      skillCoverage: 60,
      requiredSkills: 64,
      developmentAlignment: 78,
    },
    skills: ['Docker', 'AWS', 'CI/CD Pipelines', 'Linux', 'Git', 'Bash'],
    matchingSkills: ['Git', 'Linux Basics'],
    developmentAreas: [
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
      {
        name: 'AWS Infrastructure',
        skillId: 'aws',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Critical',
      },
      {
        name: 'CI/CD Pipelines',
        skillId: 'cicd',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
    ],
    requiredSkills: [
      {
        id: 'docker',
        name: 'Docker',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Advanced',
        skillId: 'docker',
        priority: 'High',
      },
      {
        id: 'aws',
        name: 'AWS Cloud Services',
        status: 'Gap',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'aws',
        priority: 'Critical',
      },
      {
        id: 'cicd',
        name: 'CI/CD Automation (GitHub Actions)',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'cicd',
        priority: 'High',
      },
    ],
    preferredSkills: ['Kubernetes', 'Terraform', 'Prometheus', 'Grafana'],
    whyRelevant: [
      'Focuses directly on Stage 03 Cloud & Deployment skills.',
      'Helps transition theoretical DevOps knowledge into automated enterprise tooling.',
    ],
    description:
      'InfraOps Labs automates deployment workflows for high-growth tech ventures. You will configure automated build pipelines, manage container registries, and monitor cloud resources.',
    responsibilities: [
      'Build CI/CD pipelines for automated testing and deployment.',
      'Containerize applications and optimize Docker build times.',
      'Configure cloud environments and automate infrastructure tasks.',
    ],
    requirements: [
      'Understanding of Linux system administration and shell scripting.',
      'Hands-on experience with Git workflow and CI/CD concepts.',
      'Familiarity with containerization (Docker) and cloud services.',
    ],
    postedDaysAgo: 7,
    tags: ['DevOps', 'CI/CD', 'Docker', 'AWS', 'Linux'],
    isFeatured: false,
  },
  {
    id: 'job-008',
    title: 'Software Development Intern (Backend)',
    company: 'CodeCraft Studio',
    companyLogo: 'CC',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Internship',
    experience: 'Internship',
    salary: '₹25,000–35,000 / month',
    category: 'Backend',
    roleRelevance: 'Direct Target Match',
    compatibility: 94,
    compatibilityBreakdown: {
      roleAlignment: 96,
      skillCoverage: 92,
      requiredSkills: 95,
      developmentAlignment: 88,
    },
    skills: ['Java', 'SQL', 'REST APIs', 'Git', 'OOP Concepts'],
    matchingSkills: ['Java', 'SQL', 'REST APIs', 'OOP Concepts'],
    developmentAreas: [
      {
        name: 'Spring Boot',
        skillId: 'spring-boot',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Core Java & OOP',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'Relational Databases & SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Beginner',
      },
      {
        id: 'rest-apis',
        name: 'REST API Concepts',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Beginner',
      },
    ],
    preferredSkills: ['Spring Boot', 'Postman', 'Docker Basics'],
    whyRelevant: [
      'Near-perfect match with your foundational backend skills (Java, SQL, REST APIs).',
      'Direct conversion opportunity to a full-time Backend Software Engineer position.',
      'Structured onboarding and direct pair programming with senior engineers.',
    ],
    description:
      'CodeCraft Studio is looking for a talented Backend Engineering Intern to collaborate on customer-facing APIs and backend data models. You will gain hands-on production engineering experience in a high-growth environment.',
    responsibilities: [
      'Assist in developing and testing RESTful API endpoints.',
      'Write database queries and assist in schema migrations.',
      'Participate in daily standups, code reviews, and feature sprint planning.',
    ],
    requirements: [
      'Solid understanding of Java object-oriented principles.',
      'Proficiency in writing relational SQL queries.',
      'Eagerness to learn production backend frameworks like Spring Boot.',
    ],
    postedDaysAgo: 1,
    tags: ['Internship', 'Backend', 'Java', 'SQL', 'REST APIs'],
    isFeatured: true,
  },
  {
    id: 'job-009',
    title: 'Associate Software Engineer - Java',
    company: 'HyperScale Labs',
    companyLogo: 'HL',
    location: 'Delhi NCR, India',
    workMode: 'On-site',
    employmentType: 'Full-time',
    experience: 'Entry Level',
    salary: '₹6.5–11 LPA',
    category: 'Software Engineering',
    roleRelevance: 'Direct Target Match',
    compatibility: 87,
    compatibilityBreakdown: {
      roleAlignment: 90,
      skillCoverage: 84,
      requiredSkills: 88,
      developmentAlignment: 74,
    },
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Data Structures'],
    matchingSkills: ['Java', 'SQL', 'REST APIs', 'Spring Boot'],
    developmentAreas: [
      {
        name: 'Testing & Mocking',
        skillId: 'testing',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java 17+',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'spring-boot',
        name: 'Spring Boot Framework',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'sql',
        name: 'SQL & Database Design',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
    ],
    preferredSkills: ['Git', 'Maven', 'Docker', 'JUnit'],
    whyRelevant: [
      'Ideal entry-level career progression matching your exact target role expectations.',
      'Strong focus on core Spring Boot microservice fundamentals.',
    ],
    description:
      'HyperScale Labs builds digital infrastructure for logistics and supply chain operators. We are hiring Associate Software Engineers to join our platform backend team.',
    responsibilities: [
      'Develop backend service modules and database access layers.',
      'Integrate third-party RESTful APIs and webhook consumers.',
      'Optimize database queries and fix software defects.',
    ],
    requirements: [
      'Degree in Computer Science, Information Technology, or relevant field.',
      'Hands-on experience with Java and Spring Boot during projects or internships.',
      'Strong grasp of relational databases and SQL queries.',
    ],
    postedDaysAgo: 3,
    tags: ['Java', 'Spring Boot', 'Entry Level', 'SQL', 'APIs'],
    isFeatured: false,
  },
  {
    id: 'job-010',
    title: 'AI/ML Platform Backend Engineer',
    company: 'CortexAI Technologies',
    companyLogo: 'CA',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹11–18 LPA',
    category: 'AI/ML',
    roleRelevance: 'Adjacent Target Match',
    compatibility: 72,
    compatibilityBreakdown: {
      roleAlignment: 74,
      skillCoverage: 70,
      requiredSkills: 72,
      developmentAlignment: 68,
    },
    skills: ['Java', 'Python', 'REST APIs', 'Docker', 'Model Serving', 'SQL'],
    matchingSkills: ['Java', 'REST APIs', 'SQL'],
    developmentAreas: [
      {
        name: 'Docker',
        skillId: 'docker',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
      {
        name: 'Model Serving & Inference',
        skillId: 'model-serving',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java (High-throughput services)',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'rest-apis',
        name: 'REST APIs & WebSockets',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
      },
      {
        id: 'docker',
        name: 'Docker',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'docker',
        priority: 'High',
      },
    ],
    preferredSkills: ['FastAPI', 'gRPC', 'AWS SageMaker', 'PyTorch'],
    whyRelevant: [
      'Applies backend engineering to high-growth generative AI and machine learning infrastructure.',
      'High compensation and exposure to inference orchestration pipelines.',
    ],
    description:
      'CortexAI builds scalable model serving infrastructure for enterprise GenAI applications. We are looking for a Backend Engineer to build high-concurrency API gateways and orchestration pipelines.',
    responsibilities: [
      'Build robust API gateways routing requests to distributed model inference clusters.',
      'Implement streaming responses, caching, and rate-limiting middleware.',
      'Containerize inference microservices with Docker.',
    ],
    requirements: [
      'Strong backend foundation in Java or Python with asynchronous API frameworks.',
      'Understanding of microservice architecture and containerization.',
      'Interest in AI/ML model deployment and inference optimization.',
    ],
    postedDaysAgo: 2,
    tags: ['AI/ML', 'Backend', 'Python', 'Java', 'Docker'],
    isFeatured: false,
  },
  {
    id: 'job-011',
    title: 'Junior Distributed Systems Engineer',
    company: 'QuantumWorks Systems',
    companyLogo: 'QW',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    experience: '1–3 years',
    salary: '₹12–20 LPA',
    category: 'Software Engineering',
    roleRelevance: 'Direct Target Match',
    compatibility: 80,
    compatibilityBreakdown: {
      roleAlignment: 84,
      skillCoverage: 76,
      requiredSkills: 78,
      developmentAlignment: 78,
    },
    skills: ['Java', 'Distributed Systems', 'System Design', 'SQL', 'Redis', 'Kafka'],
    matchingSkills: ['Java', 'SQL'],
    developmentAreas: [
      {
        name: 'System Design',
        skillId: 'system-design',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'High',
      },
      {
        name: 'Redis',
        skillId: 'redis',
        currentLevel: 'Beginner',
        targetLevel: 'Intermediate',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java Concurrency & Memory Model',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'sql',
        name: 'Database Internals & SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
      },
      {
        id: 'system-design',
        name: 'System Design & Scalability',
        status: 'Developing',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        skillId: 'system-design',
        priority: 'High',
      },
    ],
    preferredSkills: ['Raft/Paxos', 'gRPC', 'Distributed Storage', 'Netty'],
    whyRelevant: [
      'Directly correlates with Stage 04 System Design in your roadmap.',
      'High engineering rigor with deep exposure to distributed state and consensus.',
    ],
    description:
      'QuantumWorks builds distributed database and messaging engines. We are hiring a Junior Distributed Systems Engineer to work on consensus protocols, replication logs, and storage drivers.',
    responsibilities: [
      'Implement thread-safe Java components for distributed data replication.',
      'Profile performance and eliminate memory allocation bottlenecks.',
      'Participate in architecture reviews for high-throughput messaging pipelines.',
    ],
    requirements: [
      'Strong understanding of operating systems, networking, and memory architectures.',
      'Advanced Java programming proficiency with multithreading experience.',
      'Curiosity for distributed systems, replication, and consensus algorithms.',
    ],
    postedDaysAgo: 4,
    tags: ['Distributed Systems', 'Java', 'System Design', 'High Concurrency'],
    isFeatured: true,
  },
  {
    id: 'job-012',
    title: 'Backend Developer Intern',
    company: 'DevLaunch Technologies',
    companyLogo: 'DL',
    location: 'Remote, India',
    workMode: 'Remote',
    employmentType: 'Internship',
    experience: 'Internship',
    salary: '₹20,000–30,000 / month',
    category: 'Backend',
    roleRelevance: 'Direct Target Match',
    compatibility: 92,
    compatibilityBreakdown: {
      roleAlignment: 94,
      skillCoverage: 90,
      requiredSkills: 92,
      developmentAlignment: 85,
    },
    skills: ['Java', 'REST APIs', 'SQL', 'Git', 'Spring Boot Basics'],
    matchingSkills: ['Java', 'SQL', 'REST APIs'],
    developmentAreas: [
      {
        name: 'Spring Boot',
        skillId: 'spring-boot',
        currentLevel: 'Intermediate',
        targetLevel: 'Advanced',
        priority: 'Medium',
      },
    ],
    requiredSkills: [
      {
        id: 'java',
        name: 'Java Fundamentals',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Beginner',
      },
      {
        id: 'rest-apis',
        name: 'REST APIs',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Beginner',
      },
      {
        id: 'sql',
        name: 'SQL',
        status: 'Aligned',
        currentLevel: 'Intermediate',
        requiredLevel: 'Beginner',
      },
    ],
    preferredSkills: ['Postman', 'Spring Boot', 'GitHub'],
    whyRelevant: [
      'Fully remote internship directly matching your verified Java and SQL competencies.',
      'Practical bridge to accelerate your applied backend portfolio.',
    ],
    description:
      'DevLaunch is a venture studio building SaaS products. We are seeking a Backend Developer Intern to implement clean API endpoints, configure database schemas, and write automated tests.',
    responsibilities: [
      'Build CRUD endpoints and implement validation logic.',
      'Connect backend services with PostgreSQL databases.',
      'Document API endpoints using OpenAPI / Swagger specifications.',
    ],
    requirements: [
      'Working knowledge of Java programming.',
      'Familiarity with relational database queries and API concepts.',
      'Ability to communicate effectively in a remote team environment.',
    ],
    postedDaysAgo: 2,
    tags: ['Internship', 'Remote', 'Java', 'Backend', 'SQL'],
    isFeatured: false,
  },
];

/**
 * Storage keys
 */
export const STORAGE_KEY_SAVED_OPPORTUNITIES = 'skillsetu_saved_opportunities_v1';
export const STORAGE_KEY_APPLICATION_STATUS = 'skillsetu_application_status_v1';

/**
 * Seed initial saved opportunities if localStorage is empty
 */
const INITIAL_SAVED_IDS = ['job-001', 'job-004', 'job-008'];

/**
 * Seed initial applications if localStorage is empty
 */
const INITIAL_APPLICATIONS = {
  'job-001': {
    status: 'Applied',
    appliedDate: '2026-09-28',
    notes: 'Submitted resume and portfolio capstone link.',
    nextAction: 'Await initial talent partner screening review.',
  },
  'job-002': {
    status: 'Interview',
    appliedDate: '2026-09-24',
    notes: 'Passed initial screening; scheduled technical discussion.',
    nextAction: 'Prepare for core Java & Spring Boot architecture interview.',
  },
  'job-004': {
    status: 'Saved',
    appliedDate: '2026-09-30',
    notes: 'Focusing on AWS Stage 03 milestone before submitting.',
    nextAction: 'Complete AWS deploy capstone project.',
  },
};

/**
 * Helper: Retrieve saved opportunity IDs
 */
export const getStoredSavedOpportunities = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_OPPORTUNITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SAVED_OPPORTUNITIES, JSON.stringify(INITIAL_SAVED_IDS));
      return INITIAL_SAVED_IDS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading saved opportunities from localStorage:', e);
    return INITIAL_SAVED_IDS;
  }
};

/**
 * Helper: Save opportunity IDs
 */
export const saveStoredSavedOpportunities = (savedIds) => {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_OPPORTUNITIES, JSON.stringify(savedIds));
  } catch (e) {
    console.warn('Error saving opportunities to localStorage:', e);
  }
};

/**
 * Helper: Retrieve application statuses map
 */
export const getStoredApplicationStatuses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPLICATION_STATUS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_APPLICATION_STATUS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading application statuses from localStorage:', e);
    return INITIAL_APPLICATIONS;
  }
};

/**
 * Helper: Save application statuses map
 */
export const saveStoredApplicationStatuses = (statusesMap) => {
  try {
    localStorage.setItem(STORAGE_KEY_APPLICATION_STATUS, JSON.stringify(statusesMap));
  } catch (e) {
    console.warn('Error saving application statuses to localStorage:', e);
  }
};

/**
 * Helper: Get single opportunity by ID
 */
export const getOpportunityById = (id) => {
  if (!id) return null;
  return opportunitiesData.find((job) => job.id === id) || null;
};

/**
 * Helper: Filter opportunities
 */
export const filterOpportunities = (opportunities, filters = {}) => {
  const {
    searchQuery = '',
    roleCategory = 'all',
    location = 'all',
    workMode = 'all',
    experience = 'all',
    employmentType = 'all',
    skill = 'all',
  } = filters;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  return opportunities.filter((job) => {
    // Search query across title, company, skills, location, tags
    if (normalizedQuery) {
      const matchTitle = job.title.toLowerCase().includes(normalizedQuery);
      const matchCompany = job.company.toLowerCase().includes(normalizedQuery);
      const matchLocation = job.location.toLowerCase().includes(normalizedQuery);
      const matchSkills = job.skills.some((s) => s.toLowerCase().includes(normalizedQuery));
      const matchTags = job.tags.some((t) => t.toLowerCase().includes(normalizedQuery));

      if (!matchTitle && !matchCompany && !matchLocation && !matchSkills && !matchTags) {
        return false;
      }
    }

    // Role Category filter
    if (roleCategory !== 'all' && job.category !== roleCategory) {
      return false;
    }

    // Location filter
    if (location !== 'all' && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }

    // Work Mode filter
    if (workMode !== 'all' && job.workMode.toLowerCase() !== workMode.toLowerCase()) {
      return false;
    }

    // Experience filter
    if (experience !== 'all') {
      if (experience === 'Internship' && job.experience !== 'Internship') return false;
      if (experience === 'Entry Level' && job.experience !== 'Entry Level') return false;
      if (experience === '1–3 years' && job.experience !== '1–3 years') return false;
      if (experience === '3–5 years' && job.experience !== '3–5 years') return false;
    }

    // Employment Type filter
    if (employmentType !== 'all' && job.employmentType.toLowerCase() !== employmentType.toLowerCase()) {
      return false;
    }

    // Specific Skill filter
    if (skill !== 'all' && !job.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      return false;
    }

    return true;
  });
};

/**
 * Helper: Sort opportunities
 */
export const sortOpportunities = (opportunities, sortBy = 'recommended') => {
  const list = [...opportunities];

  switch (sortBy) {
    case 'compatibility':
      return list.sort((a, b) => b.compatibility - a.compatibility);
    case 'recent':
      return list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    case 'relevance':
      return list.sort((a, b) => {
        if (a.roleRelevance === 'Direct Target Match' && b.roleRelevance !== 'Direct Target Match') return -1;
        if (b.roleRelevance === 'Direct Target Match' && a.roleRelevance !== 'Direct Target Match') return 1;
        return b.compatibility - a.compatibility;
      });
    case 'salary':
      return list.sort((a, b) => {
        // extract approximate upper bound from salary string
        const getUpperBound = (str) => {
          const match = str.match(/₹(\d+)–(\d+)\s*LPA/);
          if (match) return parseInt(match[2], 10);
          return 0;
        };
        return getUpperBound(b.salary) - getUpperBound(a.salary);
      });
    case 'recommended':
    default:
      return list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.compatibility - a.compatibility;
      });
  }
};

/**
 * Opportunity Market Signals (Mock Prototype Data)
 */
export const opportunityMarketSignals = {
  topRoleCategories: [
    { name: 'Backend Engineering', count: 142, share: '38%' },
    { name: 'Full Stack Engineering', count: 98, share: '26%' },
    { name: 'Cloud & DevOps', count: 64, share: '17%' },
    { name: 'Data Engineering', count: 42, share: '11%' },
    { name: 'AI/ML Systems', count: 30, share: '8%' },
  ],
  commonSkillSignals: [
    { name: 'Java', demand: 'Very High', frequency: '78%' },
    { name: 'Spring Boot', demand: 'High', frequency: '65%' },
    { name: 'SQL', demand: 'Very High', frequency: '84%' },
    { name: 'REST APIs', demand: 'High', frequency: '72%' },
    { name: 'AWS', demand: 'High', frequency: '58%' },
    { name: 'Docker', demand: 'Medium-High', frequency: '52%' },
  ],
  locationSignals: [
    { city: 'Bengaluru', share: '44%', type: 'Tech Hub' },
    { city: 'Hyderabad', share: '22%', type: 'Enterprise / Cloud' },
    { city: 'Pune', share: '14%', type: 'Services & SaaS' },
    { city: 'Delhi NCR', share: '12%', type: 'Growth Startups' },
    { city: 'Remote', share: '8%', type: 'Distributed Teams' },
  ],
};
