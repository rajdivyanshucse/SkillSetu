# SkillSetu — Live Demo Recovery Guide

This guide provides instant, practical recovery actions during presentations or jury evaluations.

---

## 1. Scenario: Frontend Fails / Blank Page
**Symptom**: Browser shows connection error or blank screen.
**Action**:
1. Check if Vite dev server is running on port 5173.
2. In frontend terminal, press `Ctrl+C` and restart:
   ```bash
   npm run dev
   ```
3. Hard refresh browser: `Ctrl + Shift + R` (or `Cmd + Shift + R`).
4. Ensure browser is pointed to `http://localhost:5173`.

---

## 2. Scenario: Backend API Fails / 500 Network Errors
**Symptom**: Frontend shows error toasts or failed API requests.
**Action**:
1. Check Node backend terminal.
2. Restart Node backend:
   ```bash
   cd backend
   node src/server.js
   ```
3. Verify backend health endpoint:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```

---

## 3. Scenario: AI Service Fails / Semantic Matches Degraded
**Symptom**: Semantic matching falls back to deterministic/lexical mode.
**Action**:
1. SkillSetu features **graceful deterministic degradation** — core career, skill gaps, learning, and planning flows continue operating without crashing.
2. To restore AI semantic vector inference:
   ```bash
   cd ai-service
   .venv/Scripts/python -m uvicorn app.main:app --port 8001 --host 127.0.0.1
   ```
3. AI health check:
   ```bash
   curl http://127.0.0.1:8001/ai/v1/health
   ```

---

## 4. Scenario: Database Connection Lost
**Symptom**: PostgreSQL server at `localhost:5432` unavailable.
**Action**:
- SkillSetu includes an integrated **in-memory seed repository (`MemoryStore`)** that automatically activates when PostgreSQL is offline.
- All Prisma CRUD operations, pgvector cosine similarities, O*NET/ESCO taxonomy mappings, and tenant isolation continue functioning seamlessly for demo presentation.

---

## 5. Scenario: Demo Data Missing or Reset Needed
**Symptom**: User deleted demo records during interactive testing.
**Action**:
1. Restart Node backend (`node src/server.js`) to re-seed demo catalog, individual profiles, organization scenarios, and taxonomy mappings instantly.
2. Default demo credentials:
   - **Candidate**: `candidate@skillsetu.com` / `Password123!`
   - **Organization Admin**: `orgadmin@skillsetu.com` / `Password123!`
   - **Platform Admin**: `admin@skillsetu.com` / `Password123!`

---

## 6. Scenario: Model Loading Delay
**Symptom**: First semantic search request takes > 1 second.
**Action**:
- The sentence-transformers multilingual model (`paraphrase-multilingual-MiniLM-L12-v2`) is eagerly pre-loaded in memory on AI service startup. Warm-up is complete upon service start. Subsequent vector embeddings resolve in < 15ms.
