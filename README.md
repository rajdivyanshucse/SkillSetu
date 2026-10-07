# SkillSetu — Intelligent Workforce & Career Intelligence Platform

SkillSetu is a modern, data-driven workforce and career intelligence platform bridging industry demand, canonical skill taxonomies, talent capabilities, skill gap analysis, and explainable decision-support recommendations.

---

## 🌟 Key Capabilities

- **Executive Intelligence Synthesis** (`/intelligence`): High-level market trends, emerging technology velocity, individual skill coverage, and workforce scenario signals.
- **Explainable Recommendations** (`/dashboard/recommendations`): Deterministic multi-signal recommendation engine operating on verified mathematical weights ($30\%$ Gap, $20\%$ Role, $15\%$ Market, $10\%$ Semantic, $10\%$ Velocity, $10\%$ Learning, $5\%$ Progress).
- **Interactive Demo Mode** (`/demo`): Zero-friction evaluator sandboxes for "Demo Backend Engineer" and "Demo Technology Organization" operating on deterministic benchmark fixtures.
- **Official O*NET & ESCO Integration** (`/admin/data-quality`): Direct connectors for official U.S. DOL O*NET and European Commission ESCO taxonomies with SOC code & URI preservation, anti-SSRF download protection, and zero market demand contamination.
- **Data Quality & Provenance** (`/admin/data-quality`): Ingestion quality scoring, quarantine review queue, and provenance classification (`SEEDED`, `IMPORTED`, `DERIVED`, `FORECAST`).
- **Semantic Skill Intelligence**: 384-dimensional vector embeddings with pgvector cosine distance and HNSW indexing.
- **Statistical Demand Forecasting**: Multi-horizon exponential smoothing with explicit statistical disclaimers.

---

## 🏗️ Architecture & Technology Stack

```
[ Frontend: React + Vite + Tailwind CSS + Framer Motion ]
                          │
                   (REST / JSON)
                          ▼
       [ Core Backend: Node.js Express ESM ]
          │                           │
  (Prisma ORM)                (HTTP / Embeddings)
          ▼                           ▼
[ PostgreSQL + pgvector ]    [ AI Microservice: Python FastAPI + PyTorch ]
```

- **Frontend**: React 18, pure JavaScript ESM + JSX, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js 20+, Express ESM, Prisma ORM, JSON Web Tokens (JWT), Winston logging.
- **Database**: PostgreSQL 16 with `pgvector` vector similarity extension.
- **AI Microservice**: Python 3.11+, FastAPI, PyTorch, `sentence-transformers` (`all-MiniLM-L6-v2`), scikit-learn.

---

## 🐳 Production-like Docker Deployment

Orchestrate the entire platform (PostgreSQL 16 + pgvector, Node.js Backend with Prisma migrations, FastAPI AI service, and Nginx SPA) in a single command:

```bash
# 1. Copy environment configuration
cp .env.docker.example .env

# 2. Build and start all containers
docker compose up --build -d

# 3. (Optional) Populate deterministic demo dataset
docker compose run --rm backend npm run prisma:seed
```

See [docs/deployment.md](docs/deployment.md) for full architecture and operational instructions.

---

## 🚀 Local Development Workflow

### 1. Backend Core Service
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000/api/v1
```

### 2. AI Microservice
```bash
cd ai-service
.\.venv\Scripts\activate
uvicorn app.main:app --port 8001
# Running on http://127.0.0.1:8001
```

### 3. Frontend Web Application
```bash
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🧪 Verification & Automated Testing

SkillSetu is covered by 582 automated regression tests:
```bash
# Run Phase 33 O*NET + ESCO Taxonomy Ingestion test suite:
node backend/src/test-phase33-onet-esco-ingestion.js

# Run all backend regression suites (Phase 20 - 30):
node backend/src/test-phase30-demo-product.js

# Run Python AI service tests:
cd ai-service && .\.venv\Scripts\pytest

# Run Frontend production build:
npm run build
```

See [docs/data-sources.md](docs/data-sources.md) for external taxonomy architecture and [docs/deployment.md](docs/deployment.md) for deployment specifications.

---

## 📜 Standard Platform Disclaimers

- **Statistical Demand Forecasts**: Statistical forecast based on historical observations. Does not guarantee future market demand.
- **Semantic Matching**: Semantic similarity indicates relatedness between skills or requirements. It is not a hiring probability or candidate ranking.
- **Compensation Patterns**: Advertised compensation patterns reflect observed job-posting data and do not predict individual salary.
- **Recommendations**: Recommendations are decision-support signals generated from available profile, market, learning, and workforce data.
- **Evaluation Baseline**: Demonstration and automated evaluation utilize deterministic seeded datasets.
