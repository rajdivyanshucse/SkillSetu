/**
 * SkillSetu Workforce Intelligence Baseline Targets & Benchmarks
 * Deterministic target thresholds and domain benchmarks for organization capability modeling
 */

export const WORKFORCE_INTELLIGENCE_DISCLAIMER =
  'Workforce intelligence shown here is based on organization-provided prototype data and deterministic SkillSetu rules. It is not connected to live HR systems or external workforce datasets.';

export const defaultTargetCoverage = {
  // Programming
  Java: 80,
  Python: 65,
  JavaScript: 75,
  TypeScript: 60,
  'C++': 40,
  Go: 50,
  Rust: 30,

  // Backend
  'Spring Boot': 75,
  'Node.js': 60,
  Django: 40,
  FastAPI: 45,
  Microservices: 70,
  'REST APIs': 85,
  GraphQL: 40,

  // Frontend
  React: 70,
  'Next.js': 50,
  'Vue.js': 30,
  Angular: 30,
  'Tailwind CSS': 65,

  // Databases
  SQL: 85,
  PostgreSQL: 75,
  MySQL: 65,
  MongoDB: 50,
  Redis: 60,
  Cassandra: 35,
  Elasticsearch: 45,

  // Cloud & DevOps
  AWS: 75,
  Azure: 50,
  'Google Cloud (GCP)': 40,
  'Cloud Architecture': 60,
  Docker: 70,
  Kubernetes: 60,
  'CI/CD Pipelines': 75,
  Terraform: 50,
  'Linux Administration': 65,

  // Data & AI
  'Data Engineering': 60,
  'ETL Pipelines': 65,
  'Apache Spark': 45,
  'Machine Learning': 50,
  'Generative AI & LLMs': 60,
  'Deep Learning': 40,
  'PyTorch / TensorFlow': 45,

  // Security & Product
  Cybersecurity: 55,
  'Application Security': 60,
  'System Design': 70,
  'Product Management': 50,
  'Agile / Scrum': 80,
};

export const coverageStatusThresholds = [
  { min: 75, label: 'Strong Coverage', status: 'strong', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { min: 50, label: 'Moderate Coverage', status: 'moderate', color: 'text-brand-700 bg-brand-50 border-brand-200' },
  { min: 25, label: 'Developing', status: 'developing', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { min: 0, label: 'Limited Coverage', status: 'limited', color: 'text-rose-700 bg-rose-50 border-rose-200' },
];

export const DEFAULT_TARGET_BENCHMARKS = defaultTargetCoverage;
export const COVERAGE_STATUS_THRESHOLDS = coverageStatusThresholds;

