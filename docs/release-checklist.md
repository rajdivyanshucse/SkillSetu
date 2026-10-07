# SkillSetu Release Candidate Checklist (v1.0.0-rc.1)

## 1. Environment & Prerequisites
- [x] **Node.js**: v22.15.1+ (ESM modules)
- [x] **Python**: 3.12+ with virtual environment (`ai-service/.venv`)
- [x] **PostgreSQL**: 16+ with `pgvector` extension configured
- [x] **Model Binaries**: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` and `all-MiniLM-L6-v2` cached in HuggingFace cache

---

## 2. Startup Sequence
- [x] **Step 1 — Start Python AI Service**:
  ```bash
  cd ai-service
  .venv/Scripts/python -m uvicorn app.main:app --port 8001 --host 127.0.0.1
  ```
- [x] **Step 2 — Verify AI Health**:
  ```bash
  GET http://127.0.0.1:8001/health
  # Expected: {"status": "healthy"}
  ```
- [x] **Step 3 — Start Node.js Backend**:
  ```bash
  cd backend
  node src/server.js
  # Expected: Listening on port 5000 (or configured port)
  ```
- [x] **Step 4 — Start Frontend Development Server (or Serve Build)**:
  ```bash
  npm run dev
  # Expected: Local Vite server at http://localhost:5173
  ```

---

## 3. Database & Ingestion Initialization
- [x] **Prisma Migration**: Run `npx prisma migrate deploy` in `backend/`
- [x] **Taxonomy Ingestion**: Official O\*NET 29.1 and ESCO v1.2.0 mappings imported and verified
- [x] **Vector Embeddings**: Model-aware 384-dimensional embeddings indexed under `paraphrase-multilingual-MiniLM-L12-v2`
- [x] **Non-Contamination Invariant**: Zero synthetic demand observations or compensation records in database

---

## 4. Subsystem & Security Verification
- [x] **Authentication & RBAC**: JWT access tokens, refresh rotation, role protection (`INDIVIDUAL`, `ORGANIZATION`, `ADMIN`)
- [x] **Multi-Tenant Isolation**: Verified complete data segregation between Organization A and Organization B
- [x] **Circuit Breaker**: 5-failure threshold, 15s cooldown, graceful fallback to local deterministic matching
- [x] **Zero Raw Vectors**: Raw floating point arrays strictly stripped from all browser-facing API responses
- [x] **Sanitization & Unicode**: Full Unicode NFKC normalization on all multilingual queries and resume text

---

## 5. Automated Test Pass Verification
- [x] **Python Pytest Suite**: 48 / 48 Passed (100%)
- [x] **Phase 34 Multilingual Semantic Suite**: 33 / 33 Passed (100%)
- [x] **Phase 33 O\*NET & ESCO Ingestion Suite**: 52 / 52 Passed (100%)
- [x] **Phase 28 / 24 Semantic Intelligence Suite**: 22 / 22 Passed (100%)
- [x] **Phase 26 Recommendation Engine Suite**: 33 / 33 Passed (100%)
- [x] **Phase 25 Demand Intelligence Suite**: 43 / 43 Passed (100%)
- [x] **Phase 30 Demo & Product Polish Suite**: 10 / 10 Passed (100%)
- [x] **Core Architecture Server Suite**: 5 / 5 Passed (100%)
- [x] **Frontend Production Build**: `npm run build` compiled with 0 errors (9.39s)

---

## 6. Release Verdict
**READY FOR DEMO / SUBMISSION** as a fully functional, verified Release Candidate (`v1.0.0-rc.1`).
