# SkillSetu Backend — API, Database, Security, Individual, Organization, Ingestion, Intelligence & Demo Suite (Phase 30)

SkillSetu is an Intelligent Workforce & Career Intelligence Platform connecting industry demand with human capabilities through deterministic, transparent, and explainable computational frameworks. Phase 30 delivers demo intelligence, executive synthesis dashboards, explainable recommendations, provenance validation, and complete regression verification.

---

## 🛠 Technology Stack

- **Runtime:** Node.js (v18+ / v20+ / v22+)
- **Framework:** Express.js (v4)
- **Database:** PostgreSQL (v14+ / v15+ / v16+)
- **ORM / Query Engine:** Prisma ORM (v6.4.1)
- **Module System:** ECMAScript Modules (ESM)
- **AI Microservice:** Python 3.11+ (FastAPI + Pydantic + Uvicorn)
- **Authentication & Security:**
  - `bcryptjs` (Cost factor 12 password hashing)
  - `jsonwebtoken` (Short-lived JWT Access Tokens)
  - Cryptographically secure SHA-256 hashed Refresh Tokens with session rotation
  - `cookie-parser` (Secure HttpOnly cookie support)
  - `helmet` (Security HTTP response headers)
  - `cors` (Configurable Cross-Origin Resource Sharing)
  - `express-rate-limit` (Global and strict authentication rate limiting)
  - Strict payload size limits (`1mb` max text / payload)
- **Validation:** `zod` (Node.js request validation) & `pydantic` (Python AI validation)
- **Frontend Client:** `src/services/api.js` (Unified HTTP Client abstraction)

---

## 🤖 Phase 23: AI/ML Intelligence Foundation & Python Microservice Integration

### 1. Architecture Overview
SkillSetu uses a decoupled microservices architecture for AI/ML capabilities while keeping Node.js + Express as the primary application and database orchestrator:

```
React.js / JavaScript Frontend
              │
              ▼
Node.js + Express Gateway (Port 5000)
              │
      ┌───────┴────────────────────────┐
      ▼                                ▼
PostgreSQL (Prisma ORM)    Python AI Service (FastAPI, Port 8001)
                           - NLP Skill Extraction & Normalization
                           - Resume Text Analysis
                           - Job Description Requirement Signals
```

- **Node.js Responsibilities:** Authentication, multi-tenant RBAC, input validation (Zod), database persistence (Prisma), catalog correlation, audit logging, and exposing authenticated proxy endpoints.
- **Python Service Responsibilities:** NLP processing, regex/phrase tokenization, deterministic skill normalization, and requirement signal extraction. Python never connects directly to PostgreSQL.
- **Direct Browser Prohibition:** The browser never calls the Python AI service directly. All client requests flow through authenticated Node.js endpoints.

### 2. Node → Python AI Client (`backend/src/services/aiClient.service.js`)
- **Server-to-Server Authentication:** Uses `X-AI-Service-Key` header with pre-shared key stored in environment variables.
- **Timeout Management:** Strict 5000ms AbortController timeout to prevent hanging connections.
- **Controlled Error Translation:**
  - Connection refused / offline $\rightarrow$ `503 Service Unavailable` (`AI_SERVICE_UNAVAILABLE`)
  - Request timeout $\rightarrow$ `504 Gateway Timeout` (`AI_SERVICE_TIMEOUT`)
  - Unauthorized key $\rightarrow$ `500 Internal Server Error` (`AI_SERVICE_AUTH_FAILED`)
  - Invalid schema $\rightarrow$ `502 Bad Gateway` (`AI_SERVICE_INVALID_RESPONSE`)

### 3. AI Proxy Endpoints (`/api/v1/ai`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/ai/status` | Public / Monitoring | Proxy health and readiness status of the AI microservice |
| `POST` | `/api/v1/ai/skills/extract` | Authenticated (Individual / Organization) | NLP skill extraction & normalization with catalog correlation |
| `POST` | `/api/v1/ai/resume/analyze` | Authenticated (`INDIVIDUAL` only) | Structured resume skill extraction, role signals, and experience signals |
| `POST` | `/api/v1/ai/job-description/analyze` | Authenticated (`ORGANIZATION` only) | Job description analysis classifying required, preferred, and mentioned skills |

### 4. Privacy, Security & Input Limits
- **Input Limits:** Max 50,000 characters per text payload. Enforced via Zod in Node.js and Pydantic in Python. Empty/whitespace strings rejected with `422 Unprocessable Entity`.
- **Privacy Rules:** Raw resume texts, job description texts, and API keys are strictly excluded from audit logs and application log messages.
- **User Confirmation Model:** AI extractions are treated purely as suggestions and never overwrite user profile skills or organization skill records automatically.

---

## 🏢 Phase 22: Organization & Workforce Intelligence Architecture

### 1. Role-Based Access Control (RBAC) & Hierarchy
Every organization resource is protected by multi-tenant isolation and strict hierarchical authorization:
- **`ADMIN` / `Owner`:** Full administrative control, member invitations, profile mutations, department creation/deletion, workforce inventory, roadmap updates, and scenario planning.
- **`EDITOR`:** Operational workforce management, updating capability scores, configuring roles, managing learning programs, creating planning scenarios, and shortlisting candidates. Blocked from administrative actions such as member removal and organization profile deletion.
- **`VIEWER`:** Read-only access across workforce dashboards, talent candidates, gap analyses, scenario projections, compensation patterns, and learning programs. Blocked from all state mutations.

### 2. Deterministic Organization Calculation Methodologies

#### A. Profile Completeness (0–100%)
- Evaluates 7 core structural fields:
  - Name (20%)
  - Industry (20%)
  - Company Size (15%)
  - Location (15%)
  - Legal Name (10%)
  - Description (10%)
  - Website (10%)

#### B. Workforce Capability & Coverage Thresholds
- Aggregates organization-wide skill proficiency against organizational requirements:
  - **`STRONG`:** Current Capability Score $\ge 75$
  - **`DEVELOPING`:** Current Capability Score $25 \le \text{Score} < 75$ (or standard threshold $25 - 49$)
  - **`CRITICAL GAP`:** Current Capability Score $< 25$
- **Workforce Coverage Percentage:**
  $$\text{Coverage} = \left(\frac{\text{Workforce Possessing Skill}}{\text{Total Workforce Count}}\right) \times 100$$

#### C. Skill Gap Priority Ranking
- Evaluates organizational capability deficits against target capability benchmarks:
  $$\text{Gap Score} = (\text{Target Capability} - \text{Current Capability}) \times \left(\frac{\text{Workforce Weight}}{100}\right) \times \text{Priority Factor}$$
  - $\ge 35$: `CRITICAL`
  - $\ge 20$: `HIGH`
  - $\ge 10$: `MEDIUM`
  - $< 10$: `LOW`

#### D. Future Skills Readiness Gaps
- Measures current organizational capability against projected requirements across planning horizons (`MONTHS_6`, `MONTHS_12`, `MONTHS_24`):
  $$\text{Readiness Gap} = \text{Required Future Capability} - \text{Current Capability}$$

#### E. Talent Candidate Compatibility Breakdown (Transparent 45/20/20/15 Rule)
- Transparently computes candidate fit against organizational target roles:
  - **Required Skills Alignment:** 45%
  - **Preferred Skills Alignment:** 20%
  - **Experience Relevance:** 20%
  - **Role & Domain Synergy:** 15%
- *Neutrality Guarantee:* Side-by-side comparisons present raw, verified competencies and historical credentials without subjective evaluations, black-box algorithms, or automated hiring decisions.

#### F. Scenario Planning & Projections
- Models future headcount requirements, capability improvement targets, and estimated hiring/upskilling timeframes based on deterministic growth parameters:
  $$\text{New Headcount Needed} = \text{Current Headcount} \times \left(\frac{\text{Growth Percentage}}{100}\right)$$
  $$\text{Internal Upskilling Candidates} = \text{Total Workforce Count} \times \left(\frac{\text{Skill Demand Change Percentage}}{100}\right)$$

#### G. Advertised Compensation Intelligence Rules
- Computes empirical 25th, 50th (median), and 75th percentile salary ranges across roles and locations based on database records.
- *Legal & Compliance Disclaimer:* Adheres strictly to Advertised Compensation Patterns. Data reflects advertised market data points and does not constitute guaranteed compensation, formal offers, or wage predictions.

---

## 📡 API Endpoints Overview

### 🏢 Organization Profile & Snapshot (`/api/v1/organization/profile`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/profile` | Org (Viewer) | Retrieve organization profile & completeness |
| `POST` | `/api/v1/organization/profile` | Org (Admin) | Create/initialize organization profile |
| `PATCH` | `/api/v1/organization/profile` | Org (Admin) | Update organization profile details |
| `DELETE` | `/api/v1/organization/profile` | Org (Admin) | Reset optional organization profile fields |
| `GET` | `/api/v1/organization/profile/snapshot` | Org (Viewer) | Compact organization telemetry for widgets |

### 👥 Organization Members (`/api/v1/organization/members`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/members` | Org (Viewer) | List members with pagination & filtering |
| `GET` | `/api/v1/organization/members/:memberId` | Org (Viewer) | Retrieve single member details |
| `POST` | `/api/v1/organization/members` | Org (Admin) | Invite/add member (with auto-provisioning) |
| `PATCH` | `/api/v1/organization/members/:memberId` | Org (Admin) | Update member role & access level |
| `DELETE` | `/api/v1/organization/members/:memberId` | Org (Admin) | Remove member from organization |

### 🏛 Departments (`/api/v1/organization/departments`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/departments` | Org (Viewer) | List departments & headcount distribution |
| `GET` | `/api/v1/organization/departments/:departmentId` | Org (Viewer) | Retrieve department details |
| `POST` | `/api/v1/organization/departments` | Org (Editor) | Create new department |
| `PATCH` | `/api/v1/organization/departments/:departmentId` | Org (Editor) | Update department details & headcount |
| `DELETE` | `/api/v1/organization/departments/:departmentId` | Org (Admin) | Delete department |

### 🛠 Workforce Inventory & Skills (`/api/v1/organization/workforce`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/workforce` | Org (Viewer) | List workforce skills inventory |
| `GET` | `/api/v1/organization/workforce/:skillId` | Org (Viewer) | Retrieve workforce skill details |
| `POST` | `/api/v1/organization/workforce/skills` | Org (Editor) | Add skill to workforce inventory |
| `PATCH` | `/api/v1/organization/workforce/skills/:skillId` | Org (Editor) | Update skill capabilities & workforce count |
| `DELETE` | `/api/v1/organization/workforce/skills/:skillId` | Org (Admin) | Remove skill from workforce inventory |

### 🔍 Skill Intelligence & Gaps (`/api/v1/organization/intelligence`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/intelligence/skills` | Org (Viewer) | Aggregated skill intelligence distribution |
| `GET` | `/api/v1/organization/intelligence/skill-gaps` | Org (Viewer) | Deterministic skill gap analysis & priority ranking |
| `GET` | `/api/v1/organization/intelligence/skill-gaps/:skillId` | Org (Viewer) | Detailed gap breakdown & affected departments |

### 🔮 Future Skills Planning (`/api/v1/organization/future-skills`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/future-skills` | Org (Viewer) | List projected future skills requirements |
| `POST` | `/api/v1/organization/future-skills` | Org (Editor) | Add future skill requirement |
| `PATCH` | `/api/v1/organization/future-skills/:id` | Org (Editor) | Update future skill projection |
| `DELETE` | `/api/v1/organization/future-skills/:id` | Org (Admin) | Remove future skill projection |

### 🎯 Talent Matching & Candidate Shortlist (`/api/v1/organization/talent`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/talent` | Org (Viewer) | Search verified candidate pool |
| `GET` | `/api/v1/organization/talent/:candidateId` | Org (Viewer) | Candidate profile & credentials |
| `GET` | `/api/v1/organization/talent/:candidateId/compatibility` | Org (Viewer) | Deterministic 45/20/20/15 compatibility match |
| `GET` | `/api/v1/organization/talent/compare` | Org (Viewer) | Neutral side-by-side candidate comparison |
| `POST` | `/api/v1/organization/talent/:candidateId/shortlist` | Org (Editor) | Shortlist candidate |
| `DELETE` | `/api/v1/organization/talent/:candidateId/shortlist` | Org (Editor) | Remove candidate from shortlist |

### 📐 Organization Roles (`/api/v1/organization/roles`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/roles` | Org (Viewer) | List organizational role definitions |
| `GET` | `/api/v1/organization/roles/:roleId` | Org (Viewer) | Retrieve role details with skill requirements |
| `POST` | `/api/v1/organization/roles` | Org (Editor) | Create organizational role with required/preferred skills |
| `PATCH` | `/api/v1/organization/roles/:roleId` | Org (Editor) | Update role specifications & skills |
| `DELETE` | `/api/v1/organization/roles/:roleId` | Org (Admin) | Delete organization role |

### 📈 Planning Scenarios & Roadmap (`/api/v1/organization/planning`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/planning` | Org (Viewer) | Strategic planning overview & action mix |
| `GET` | `/api/v1/organization/planning/scenarios` | Org (Viewer) | List workforce planning scenarios |
| `GET` | `/api/v1/organization/planning/scenarios/:scenarioId` | Org (Viewer) | Scenario details & projected metrics |
| `POST` | `/api/v1/organization/planning/scenarios` | Org (Editor) | Create planning scenario |
| `PATCH` | `/api/v1/organization/planning/scenarios/:scenarioId` | Org (Editor) | Update planning scenario parameters |
| `DELETE` | `/api/v1/organization/planning/scenarios/:scenarioId` | Org (Admin) | Delete planning scenario |
| `GET` | `/api/v1/organization/planning/roadmap` | Org (Viewer) | Planning roadmap actions with rationale |
| `PATCH` | `/api/v1/organization/planning/roadmap/progress` | Org (Editor) | Update roadmap action milestone progress |

### 💵 Advertised Compensation Intelligence (`/api/v1/organization/compensation`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/compensation` | Org (Viewer) | Advertised compensation patterns overview |
| `GET` | `/api/v1/organization/compensation/roles/:roleId` | Org (Viewer) | Role-specific advertised percentiles |
| `GET` | `/api/v1/organization/compensation/locations` | Org (Viewer) | Location-based advertised compensation metrics |

### 🌱 Growth & Learning Intelligence (`/api/v1/organization/growth` & `learning`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/growth` | Org (Viewer) | Organization workforce growth overview |
| `GET` | `/api/v1/organization/growth/milestones` | Org (Viewer) | Workforce growth milestones |
| `GET` | `/api/v1/organization/growth/projects` | Org (Viewer) | Applied engineering projects |
| `GET` | `/api/v1/organization/learning` | Org (Viewer) | Learning programs overview & enrollment metrics |
| `GET` | `/api/v1/organization/learning/programs` | Org (Viewer) | List organizational learning programs |
| `GET` | `/api/v1/organization/learning/programs/:programId` | Org (Viewer) | Retrieve learning program details |
| `POST` | `/api/v1/organization/learning/programs` | Org (Editor) | Create organizational learning program |
| `PATCH` | `/api/v1/organization/learning/programs/:programId` | Org (Editor) | Update learning program |
| `DELETE` | `/api/v1/organization/learning/programs/:programId` | Org (Admin) | Delete learning program |

### 📊 Aggregated Organization Dashboard (`/api/v1/dashboard/organization`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/organization` | Org (Viewer) | Single-call unified intelligence payload for the organization workspace dashboard |

---

## 🚀 Running & Verification Commands

### Run Backend Server
```bash
cd backend
npm start
```
*Or with auto-reload during development:*
```bash
cd backend
npm run dev
```

### Run Python AI Microservice
```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Run Phase 23 AI/ML Integration Test Suite
```bash
cd backend
node src/test-ai-service.js
```

### Run Python AI Service Tests
```bash
cd ai-service
pytest
```

### Run Phase 22 Organization & Workforce Intelligence Test Suite
```bash
cd backend
node src/test-organization-intelligence.js
```

### Run Phase 21 Core Individual Intelligence Test Suite
```bash
cd backend
node src/test-individual-intelligence.js
```

### Run Phase 20 Authentication Test Suite
```bash
cd backend
node src/test-auth.js
```

---

## 🧠 Phase 24: Semantic Skill Matching + Embeddings + pgvector

### 1. Overview & Architecture
Phase 24 establishes the semantic intelligence layer for SkillSetu:
- **Embedding Generation:** Locally executed 384-dimensional dense vectors generated via `all-MiniLM-L6-v2`.
- **pgvector Persistence:** Stored in PostgreSQL `skill_embeddings` table (`vector(384)`) with unique constraint on `(skillId, model)` for model evolution.
- **Hybrid Matching Engine:** Seamlessly combines Exact Match, Normalized Alias Match, and Dense Semantic Similarity into explainable signals.
- **Authoritative Baseline Preservation:** Deterministic compatibility scores, gap calculations, and workforce models from Phases 21 & 22 remain the primary baseline; semantic intelligence provides supplemental, explainable capability signals.

### 2. pgvector Schema & Migration
- **PostgreSQL Extension:** `CREATE EXTENSION IF NOT EXISTS vector;`
- **Table Definition:** `skill_embeddings`
  - `id` (UUID Primary Key)
  - `skillId` (Foreign Key referencing `skills.id` ON DELETE CASCADE)
  - `model` (String, e.g. `'all-MiniLM-L6-v2'`)
  - `dimension` (Integer, 384)
  - `embedding` (`vector(384)`)
  - `createdAt` / `updatedAt` (Timestamps)
  - Unique Constraint: `@@unique([skillId, model])`

### 3. Semantic & Admin Endpoints

| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/skills/semantic-search?q=...` | Authenticated | Vector similarity search across catalog skills with cosine similarity |
| `GET` | `/api/v1/intelligence/career/semantic` | Authenticated (`INDIVIDUAL`) | Compares user skills with target role requirements returning exact, normalized, and semantic matches |
| `GET` | `/api/v1/organization/talent/:candidateId/semantic-compatibility` | Org (`Viewer`) | Computes semantic skill overlap between candidate and organization benchmark role |
| `GET` | `/api/v1/organization/roles/:roleId/semantic-skills` | Org (`Viewer`) | Analyzes role requirements into semantic clusters and taxonomy relationships |
| `GET` | `/api/v1/organization/intelligence/skill-clusters` | Org (`Viewer`) | Groups tracked workforce skills into representative capability clusters |
| `GET` | `/api/v1/admin/ai/status` | `ADMIN` only | Health, embedding model, dimension, and total indexed skills count |
| `POST` | `/api/v1/admin/ai/skills/reindex` | `ADMIN` only | Batch generates and persists skill embeddings across the taxonomy |

### 4. Similarity Thresholds & Explainability
Centralized engineering thresholds categorize match strength:
- **$\ge 0.85$ (HIGH):** Strong semantic alignment.
- **$0.70 - 0.849$ (MODERATE):** Moderate relatedness.
- **$0.60 - 0.699$ (WEAK):** Contextual association.
- **$< 0.60$ (NONE):** No semantic match.

Every semantic match provides structured, human-interpretable reasoning (e.g. `matchType`, `similarity`, `reason`) rather than opaque scores.

## 📈 Phase 25: Demand Intelligence, Skill Trends & Demand Forecasting

### 1. Overview & Architecture
Phase 25 introduces data-driven demand intelligence and skill trend forecasting on top of the Phase 24 semantic layer:
- **Historical Job-Market Dataset:** Seeded quarterly demand observations (2024-Q1 through 2026-Q3) with transparent data source provenance (`SEEDED`, `IMPORTED`, `DERIVED`) and quality flags (`HIGH`, `MEDIUM`, `LOW`).
- **Deterministic Aggregations:** Growth rates, rolling averages, demand volatility (CV), and location/experience distribution.
- **Trend Classification:**
  - `GROWING`: Growth $\ge +10\%$
  - `DECLINING`: Growth $\le -10\%$
  - `STABLE`: Growth between $[-10\%, +10\%]$
  - `VOLATILE`: Volatility (CV) $\ge 0.30$
  - `INSUFFICIENT_DATA`: Fewer than 2 observations
- **Emerging Skill Detection:** Multi-period acceleration, low baseline with rapid growth, and explainable signal breakdown.
- **Statistical Time-Series Forecasting:** Decoupled Python AI microservice models (Linear Trend OLS, Moving Average, Exponential Smoothing, Naive) with rolling-origin backtesting (MAE, RMSE, MAPE) and local deterministic fallbacks.
- **Non-Destructive Intelligence Enhancements:** Enriches Career Intelligence, Skill Gaps, and Learning Recommendations with contextual market signals (`HIRE_SIGNAL`, `UPSKILL_SIGNAL`, `MONITOR_SIGNAL`) while keeping deterministic compatibility scores 100% intact.

### 2. Additive Database Models (`schema.prisma`)
- `SkillDemandObservation`: Tracks quarterly skill demand index, job posting counts, salary ranges, location, experience levels, and data source metadata.
- `RoleDemandObservation`: Tracks quarterly role demand index, posting counts, average compensation, growth, and data quality metadata.
- `DemandForecast`: Persists multi-period projections, upper/lower confidence bounds, model types, validation metrics (MAE/RMSE/MAPE), and status.
- `DemandTrendSnapshot`: Persists snapshot growth rates, momentum, volatility, and trend directions.

### 3. API Endpoints

#### Individual & General Demand Endpoints (`/api/v1/intelligence/demand`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/intelligence/demand/skills` | Authenticated | List aggregated skill demand metrics, trend directions, and volatility |
| `GET` | `/api/v1/intelligence/demand/skills/:skillId` | Authenticated | Retrieve single skill historical demand series, location/experience breakdown, and active forecast |
| `GET` | `/api/v1/intelligence/demand/emerging-skills` | Authenticated | Detect emerging skills with growth velocity and explainable signals |
| `POST` | `/api/v1/intelligence/demand/forecast` | Authenticated | Generate or retrieve statistical time-series demand forecast |

#### Organization Demand Endpoints (`/api/v1/organization/intelligence/demand`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/organization/intelligence/demand` | Org (`Viewer`) | Organization-wide workforce demand matrix and internal vs. external gap signals |
| `GET` | `/api/v1/organization/intelligence/demand/skills` | Org (`Viewer`) | External market demand overlay across organization workforce inventory |
| `GET` | `/api/v1/organization/intelligence/demand/roles` | Org (`Viewer`) | Benchmark role demand trends, growth rates, and hiring velocity |
| `POST` | `/api/v1/organization/intelligence/demand/forecast` | Org (`Editor`) | Generate organization-context demand forecasts |

## 🧠 Phase 26: Advanced Recommendation Engine & Personalized Career Intelligence

### 1. Architecture Overview
SkillSetu Phase 26 introduces a centralized, explainable Recommendation Engine that translates multi-signal individual, market, and organizational data into structured, evidence-backed recommendations:

```
Individual Signals                          Organization Signals
- Profile & Skills                          - Workforce Capability Matrix
- Deterministic Skill Gaps (Phase 21)        - Critical Gaps & Coverage
- Career Compatibility (Phase 21)           - Future Skill Requirements
- Semantic Relevance (Phase 24)             - Market Demand & Growth Trends
- Demand & Emerging Signals (Phase 25)      - Scenario Planning Gaps
- Learning & Roadmap Progress
- Growth Projects & Opportunity Alignment
             │                                          │
             └──────────────────┬───────────────────────┘
                                │
                                ▼
         Central Recommendation Service (`recommendation.service.js` / `organizationRecommendation.service.js`)
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
         Node Deterministic Engine     Python Analytical ML
         - Deduplication               - Feature Weighting
         - Evidence Assembly           - Normalization
         - Lifecycle Management        - Quality Scoring
                   │
                   ▼
         PostgreSQL Storage (`Recommendation`, `RecommendationFeedback`)
                   │
                   ▼
         Transparent Explainable JSON Outputs (Zero Black-Box Scores)
```

### 2. Recommendation Taxonomy
#### Individual Recommendation Types:
- `SKILL_PRIORITY`: High-relevance skill developments based on gaps, role importance, and growth momentum.
- `CAREER_ROLE`: Role exploration recommendations based on skill coverage, gaps, and market signals.
- `LEARNING_PATH`: Structured learning recommendations addressing prerequisite skills and high-demand gaps.
- `PROJECT`: Hands-on project recommendations to practice missing skills and build portfolio evidence.
- `OPPORTUNITY`: Career opportunities matching profile capabilities and target roles.
- `SKILL_GAP`: Immediate capability gap warnings for target positions.
- `EMERGING_SKILL`: Early signals for rapidly accelerating market skills.

#### Organization Recommendation Types:
- `UPSKILL`: Upskilling programs addressing internal capability deficits.
- `HIRE`: Targeted hiring recommendations for critical capacity gaps.
- `REDISTRIBUTE`: Internal talent reallocation recommendations.
- `LEARNING_PROGRAM`: Strategic enterprise training and cohort development programs.
- `FUTURE_SKILL`: Proactive skill building for emerging technology requirements.
- `WORKFORCE_CAPABILITY`: Department-level capability enhancement initiatives.
- `ROLE_DEVELOPMENT`: Role evolution and career-pathing frameworks.

### 3. Transparent Evidence Model
Every recommendation returned to the user or organization includes structured evidence items explaining *why* it was generated:

```json
{
  "id": "rec-12345",
  "type": "SKILL_PRIORITY",
  "title": "Prioritize Docker Development",
  "summary": "Docker addresses a 42-point gap for Backend Engineer and shows GROWING market demand.",
  "priority": "HIGH",
  "confidence": "HIGH",
  "dataQuality": "HIGH",
  "recommendedAction": "LEARN",
  "evidence": [
    {
      "signal": "SKILL_GAP",
      "value": 42,
      "source": "Phase21SkillGapAnalysis",
      "explanation": "Target role requires Docker proficiency (80) above current profile level (38)."
    },
    {
      "signal": "DEMAND_TREND",
      "value": "GROWING",
      "source": "Phase25DemandIntelligence",
      "explanation": "Observed market demand for Docker grew +24.5% across recent periods."
    },
    {
      "signal": "ROLE_IMPORTANCE",
      "value": "TARGET_ROLE",
      "source": "TargetRoleAlignment",
      "explanation": "Docker is a core requirement for your active target role Backend Engineer."
    }
  ],
  "disclaimer": "Recommendations are decision-support outputs generated from available profile, skill, semantic, demand, learning, opportunity, and workforce signals. They do not guarantee employment, hiring, compensation, or future market outcomes."
}
```

### 4. Transparent Prioritization Weights
Engineering baselines applied for multi-signal weighting:
- **Skill Gap Relevance:** 30%
- **Target Role Importance:** 20%
- **Demand Signal & Trend:** 15%
- **Semantic Relevance:** 10%
- **Emerging Skill Signal:** 10%
- **Learning Relevance:** 10%
- **Current Progress & Portfolio:** 5%

### 5. Recommendation Lifecycle & Feedback
- **Lifecycle States:** `NEW` $\rightarrow$ `VIEWED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` / `DISMISSED` / `EXPIRED`.
- **User Feedback Capture:** Dismissals and interactions record reason categories (`NOT_RELEVANT`, `ALREADY_KNOW`, `NOT_INTERESTED`, `COMPLETED_ELSEWHERE`) to inform future relevance without treating dismissals as negative user performance.

### 6. API Endpoints

#### Individual Recommendation Endpoints (`/api/v1/recommendations`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/recommendations/generate` | `INDIVIDUAL` | Generate, prioritize, deduplicate, and persist individual recommendations |
| `GET` | `/api/v1/recommendations` | `INDIVIDUAL` | List stored recommendations with filtering by type, status, and priority |
| `GET` | `/api/v1/recommendations/:recommendationId` | `INDIVIDUAL` | Get full recommendation details, evidence items, and source signals |
| `PATCH` | `/api/v1/recommendations/:recommendationId/status` | `INDIVIDUAL` | Update lifecycle status (`ACCEPTED`, `IN_PROGRESS`, `COMPLETED`) |
| `POST` | `/api/v1/recommendations/:recommendationId/dismiss` | `INDIVIDUAL` | Dismiss recommendation with structured feedback reason and optional notes |
| `GET` | `/api/v1/recommendations/skills` | `INDIVIDUAL` | Quick access to filtered skill priority and emerging skill recommendations |
| `GET` | `/api/v1/recommendations/career` | `INDIVIDUAL` | Quick access to filtered career exploration recommendations |
| `GET` | `/api/v1/recommendations/learning` | `INDIVIDUAL` | Quick access to learning path recommendations |
| `GET` | `/api/v1/recommendations/projects` | `INDIVIDUAL` | Quick access to portfolio project recommendations |
| `GET` | `/api/v1/recommendations/opportunities` | `INDIVIDUAL` | Quick access to compatible opportunity recommendations |

#### Organization Recommendation Endpoints (`/api/v1/organization/recommendations`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/organization/recommendations/generate` | `ADMIN`, `EDITOR` | Generate organization-wide upskilling, hiring, and future skill recommendations |
| `GET` | `/api/v1/organization/recommendations` | `ADMIN`, `EDITOR`, `VIEWER` | List organization recommendations with filtering |
| `GET` | `/api/v1/organization/recommendations/:id` | `ADMIN`, `EDITOR`, `VIEWER` | Get single organization recommendation details |
| `PATCH` | `/api/v1/organization/recommendations/:id/status` | `ADMIN`, `EDITOR` | Update organization recommendation status |
| `GET` | `/api/v1/organization/recommendations/workforce` | `ADMIN`, `EDITOR`, `VIEWER` | Get workforce redistribution and hiring signals |
| `GET` | `/api/v1/organization/recommendations/skills` | `ADMIN`, `EDITOR`, `VIEWER` | Get workforce upskilling recommendations |
| `GET` | `/api/v1/organization/recommendations/learning` | `ADMIN`, `EDITOR`, `VIEWER` | Get organizational learning program recommendations |
| `GET` | `/api/v1/organization/recommendations/future-skills` | `ADMIN`, `EDITOR`, `VIEWER` | Get strategic future skills recommendations |

---

## 🛡 Phase 27: Production Hardening, Observability & Performance

### 1. Architecture & Hardening Overview
Phase 27 elevates the SkillSetu platform to production-grade resilience, observability, and operational stability across all subsystems:

```
Clients (Browser / Mobile / Agents)
                 │
                 ▼
         X-Request-Id Correlation Middleware (`requestId.js`)
                 │
                 ▼
         Hardened Rate Limiters (Global, Auth, Reset, AI, Recommendation, Admin)
                 │
                 ▼
         Structured Request Logger & High-Res Performance Tracker (`requestLogger.js`)
                 │
                 ├──────────────────────────┐
                 ▼                          ▼
    Core Routes & Services         Process-Local Memory Cache (`cache.js`)
                 │                 - TTL + Prefix Invalidation
                 │                 - Static Taxonomies & Snapshots
                 ├──────────────────────────┐
                 ▼                          ▼
    PostgreSQL + pgvector          AI Client Circuit Breaker (`aiClient.service.js`)
    - Indexed Queries              - States: CLOSED -> OPEN -> HALF_OPEN
    - Graceful Disconnect          - Fast Failover & Deterministic Fallbacks
                 │
                 ▼
    Background Job Manager (`job.service.js`)
    - Dedup Locks (`DEMAND_REBUILD`, `FORECAST_REBUILD`, `SKILL_REINDEX`)
    - States: QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
                 │
                 ▼
    Centralized Observability Metrics (`metrics.service.js` / `/api/v1/admin/metrics`)
```

### 2. Standardized Error Taxonomy
All API error responses adhere to a consistent, secure structure:
```json
{
  "success": false,
  "message": "The requested resource was not found.",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found.",
    "requestId": "6943248b-8793-4e32-8146-535a3717be11",
    "details": null
  }
}
```

#### Core Error Codes:
- `VALIDATION_ERROR`: Input schema validation failures (Zod/Pydantic)
- `AUTH_TOKEN_REQUIRED` / `UNAUTHENTICATED`: Missing or invalid Bearer token
- `FORBIDDEN_ADMIN_ACCESS` / `FORBIDDEN_ACCOUNT_TYPE`: RBAC and tenant authorization barriers
- `RESOURCE_NOT_FOUND` / `RECORD_NOT_FOUND`: Target entity not found
- `RATE_LIMIT_EXCEEDED`: General or route-specific rate limit tripped
- `DATABASE_UNAVAILABLE`: Graceful database connection failures
- `AI_SERVICE_UNAVAILABLE`: Python AI service offline or circuit breaker tripped
- `AI_SERVICE_TIMEOUT`: AI operation exceeded timeout window
- `FILE_TOO_LARGE` / `INVALID_FILE_EXTENSION`: Upload safety rejections

### 3. Health & Readiness Probes
- **`GET /health` / `GET /api/v1/health`**: Liveness probe reporting process uptime, memory usage (RSS/heap), database connectivity, pgvector dimension (384), AI service connectivity, and operational metrics summary.
- **`GET /ready` / `GET /api/v1/health/ready`**: Readiness probe returning `200` when dependencies are ready to accept traffic, or `503` if critical storage is unavailable.

### 4. Observability & Background Jobs
- **Admin Metrics (`GET /api/v1/admin/metrics`)**: Returns live throughput, status code distribution (2xx/3xx/4xx/5xx), route latencies (avg, min, max), latency classification (`NORMAL` <500ms, `SLOW` 500–1500ms, `VERY_SLOW` >1500ms), AI failure/timeout counters, and cache hit rates.
- **Background Jobs (`/api/v1/admin/jobs`)**:
  - `GET /api/v1/admin/jobs`: List all queued/running/completed background jobs.
  - `GET /api/v1/admin/jobs/:jobId`: Real-time job progress and results.
  - `POST /api/v1/admin/jobs/:jobId/cancel`: Cancel active background tasks.

### 5. Security & Privacy Protections
- **Sensitive Log Sanitization**: Centralized logger automatically redacts passwords, tokens, hashes, API keys, raw resume texts, job descriptions, and embedding vectors.
- **File Upload Protection**: Validates file size (max 5MB), MIME types, blocks dangerous executable extensions (`.exe`, `.sh`, `.bat`, `.js`, etc.), and sanitizes filenames against path traversal (`../`).
- **Graceful Shutdown**: Traps `SIGTERM` and `SIGINT`, drains active connections, closes PostgreSQL connections cleanly, and exits without leaving corrupted state.

---

## 📥 Phase 28: Data Ingestion, Data Quality & Real-World Data Pipeline

### 1. Ingestion Lifecycle & Modular Architecture
Phase 28 establishes an enterprise data ingestion and data quality pipeline to safely import external workforce and job-market datasets without compromising platform determinism or polluting domain tables:

```
SOURCE (Source Registry & Metadata)
  │
  ▼
RAW IMPORT (CSV/JSON Parser with 5MB Limit & Security Controls)
  │
  ▼
VALIDATION (Schema, Required Fields, Types, Bounds)
  │
  ▼
NORMALIZATION (Skills, Roles, Experience, Locations, Compensation, Dates)
  │
  ▼
DEDUPLICATION (Deterministic SHA-256 Fingerprints & Duplicate-of Tracking)
  │
  ▼
QUALITY CHECK & SCORING (Completeness, Validity, Consistency, Uniqueness, Freshness)
  │
  ├────────────────────────────┬────────────────────────────┐
  ▼                            ▼                            ▼
APPROVAL (Valid Records)   QUARANTINE (Quarantined Records)  REJECTED (Malformed Records)
  │                            │
  ▼                            ▼
DOMAIN UPSERT (Idempotent)   Admin Quarantine Inspection
  │
  ▼
ANALYTICAL REBUILD (Background Job Queue: DEMAND_REBUILD, FORECAST_REBUILD)
```

### 2. Modular Services Architecture (`backend/src/services/ingestion/`)
- **`sourceRegistry.service.js`**: Registers and manages data sources (`DataSource`), datasets (`Dataset`), and immutable versions (`DatasetVersion`).
- **`import.service.js`**: Parses CSV and JSON files in memory-bounded chunks with safe filename handling and Phase 27 file upload security.
- **`validation.service.js`**: Enforces strict schema constraints, required fields, and boundary validations; identifies quarantine triggers.
- **`normalization.service.js`**: Deterministic normalizers for skills (Exact, Alias, Semantic), roles (catalog matching), experience ranges (`minYears`, `maxYears`), locations (`city`, `state`, `country`, `workMode`), compensation ("Advertised Compensation Pattern"), and quarterly observation periods (`2026-Q1`).
- **`deduplication.service.js`**: Computes deterministic SHA-256 content hashes and composite fingerprint keys to detect intra-batch and cross-version duplicates idempotently.
- **`quality.service.js`**: Computes transparent, deterministic data-quality scores (0–100) across completeness, validity, consistency, uniqueness, normalization coverage, provenance completeness, and freshness.
- **`quarantine.service.js`**: Isolates invalid or suspicious records into `QuarantinedRecord` for administrator inspection and manual review without contaminating production tables.
- **`provenance.service.js`**: Enforces strict provenance tracking (`SEEDED`, `IMPORTED`, `DERIVED`, `FORECAST`) and converts valid imported job records into `SkillDemandObservation` and `RoleDemandObservation` without altering forecasting formulas.
- **`ingestion.service.js`**: Master pipeline orchestrator integrating background jobs (`DATASET_IMPORT`), progress counters, cancellation, and idempotent re-import handling.

### 3. Additive Database Models (`schema.prisma`)
- `DataSource`: Tracks source provider, category (`JOB_POSTINGS`, `SKILL_TAXONOMY`, `SALARY_DATA`, etc.), URL, license, and trust rating.
- `Dataset`: Represents a dataset container under a data source with domain category and active version pointer.
- `DatasetVersion`: Immutable dataset snapshots with schema version, effective date range, status (`DRAFT`, `VALIDATING`, `READY`, `IMPORTED`, `FAILED`, `QUARANTINED`, `ARCHIVED`), quality score, and checksum.
- `IngestionJobRecord`: Tracks asynchronous background ingestion tasks, stage progress, processed counts, valid/quarantined/rejected tallies, and execution duration.
- `IngestionRecord`: Granular audit of every record processed, storing deterministic fingerprint, normalization status, and duplicate pointers.
- `DataQualityReport`: Deterministic dimension-level quality scoring and issue tallies.
- `QuarantinedRecord`: Quarantined record payloads, specific validation error messages, severity, and resolution status (`QUARANTINED`, `APPROVED`, `DISCARDED`, `RESOLVED`).

### 4. Admin Ingestion API Endpoints (`/api/v1/admin/ingestion`)
| Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/admin/ingestion/sources` | `ADMIN` only | Register a new external data source with licensing and category |
| `GET` | `/api/v1/admin/ingestion/sources` | `ADMIN` only | List registered data sources |
| `POST` | `/api/v1/admin/ingestion/datasets` | `ADMIN` only | Create a new dataset container under a source |
| `GET` | `/api/v1/admin/ingestion/datasets` | `ADMIN` only | List datasets with source and version summaries |
| `GET` | `/api/v1/admin/ingestion/datasets/:datasetId` | `ADMIN` only | Retrieve single dataset details |
| `POST` | `/api/v1/admin/ingestion/datasets/:datasetId/versions` | `ADMIN` only | Create a new dataset version snapshot |
| `GET` | `/api/v1/admin/ingestion/datasets/:datasetId/versions` | `ADMIN` only | List version history for a dataset |
| `POST` | `/api/v1/admin/ingestion/datasets/:datasetId/import` | `ADMIN` only | Upload and execute dataset file import (CSV/JSON) |
| `GET` | `/api/v1/admin/ingestion/jobs` | `ADMIN` only | List ingestion background jobs and progress |
| `GET` | `/api/v1/admin/ingestion/jobs/:jobId` | `ADMIN` only | Get real-time ingestion job status and metrics |
| `POST` | `/api/v1/admin/ingestion/jobs/:jobId/cancel` | `ADMIN` only | Cancel an active ingestion job |
| `GET` | `/api/v1/admin/ingestion/quality/:versionId` | `ADMIN` only | Retrieve deterministic data quality report for a dataset version |
| `GET` | `/api/v1/admin/ingestion/quarantine` | `ADMIN` only | List quarantined records pending review |
| `GET` | `/api/v1/admin/ingestion/quarantine/:recordId` | `ADMIN` only | Retrieve quarantined record payload and validation errors |
| `PATCH` | `/api/v1/admin/ingestion/quarantine/:recordId` | `ADMIN` only | Review quarantined record (Approve, Discard, Resolve) |

---

## 🚀 Running & Verification Commands

### Run Backend Server
```bash
cd backend
npm start
```

### Run Python AI Microservice
```bash
cd ai-service
.\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Run Phase 28 Data Ingestion & Data Quality Test Suite
```bash
cd backend
node src/test-data-ingestion.js
```

### Run Phase 27 Production Hardening & Observability Test Suite
```bash
cd backend
node src/test-production-hardening.js
```

### Run Phase 26 Recommendation Engine Test Suite
```bash
cd backend
node src/test-recommendation-engine.js
```

### Run Phase 25 Demand Intelligence Test Suite
```bash
cd backend
node src/test-demand-intelligence.js
```

### Run Phase 24 Semantic Intelligence Test Suite
```bash
cd backend
node src/test-semantic-intelligence.js
```

### Run Phase 23 AI/ML Integration Test Suite
```bash
cd backend
node src/test-ai-service.js
```

### Run Phase 29 End-to-End Platform Integration & Evaluation Test Suite
```bash
cd backend
node src/test-end-to-end-platform.js
```

### Run Phase 28 Data Ingestion & Data Quality Pipeline Test Suite
```bash
cd backend
node src/test-data-ingestion.js
```

### Run Phase 27 Production Hardening & Observability Test Suite
```bash
cd backend
node src/test-production-hardening.js
```

### Run Phase 26 Advanced Recommendation Engine Test Suite
```bash
cd backend
node src/test-recommendation-engine.js
```

### Run Phase 25 Demand Intelligence & Forecasting Test Suite
```bash
cd backend
node src/test-demand-intelligence.js
```

### Run Phase 24 Semantic Skill Intelligence Test Suite
```bash
cd backend
node src/test-semantic-intelligence.js
```

### Run Phase 23 AI Microservice Test Suite
```bash
cd backend
node src/test-ai-service.js
```

### Run Python AI Service Unit Tests
```bash
cd ai-service
.\.venv\Scripts\pytest
```

### Run Phase 22 Organization & Workforce Intelligence Test Suite
```bash
cd backend
node src/test-organization-intelligence.js
```

### Run Phase 21 Core Individual Intelligence Test Suite
```bash
cd backend
node src/test-individual-intelligence.js
```

### Run Phase 20 Authentication Test Suite
```bash
cd backend
node src/test-auth.js
```

### Build Frontend
```bash
npm run build
```

---

## 🗺 Platform Roadmap

- **Phase 20:** Authentication, Authorization & User Account Security (COMPLETED)
- **Phase 21:** Core Individual Intelligence APIs (COMPLETED)
- **Phase 22:** Organization & Workforce Intelligence APIs (COMPLETED)
- **Phase 23:** AI/ML Intelligence Foundation + Python Service Integration (COMPLETED)
- **Phase 24:** Semantic Matching + Embeddings + pgvector (COMPLETED)
- **Phase 25:** Demand Analysis + Forecasting (COMPLETED)
- **Phase 26:** AI Recommendation Engine (COMPLETED)
- **Phase 27:** Node/AI Security + Production Hardening (COMPLETED)
- **Phase 28:** Data Ingestion, Data Quality & Real-World Data Pipeline (COMPLETED)
- **Phase 29:** End-to-End Platform Integration, Real-Data Validation & System Evaluation (COMPLETED)






