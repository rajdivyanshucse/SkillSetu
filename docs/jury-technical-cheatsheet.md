# SkillSetu — Presenter Technical Cheat Sheet (Quick-Recall Reference)

Use this document for rapid, high-confidence recall during jury questioning and technical defense.

---

## 🔢 Verified Platform Metrics (Quick Recall)

| Parameter | Verified Value / Fact |
| :--- | :--- |
| **Release Candidate** | `v1.0.0-rc.1` |
| **Embedding Dimensions** | `384` dimensions (`paraphrase-multilingual-MiniLM-L12-v2`) |
| **Official Taxonomies** | `O*NET 29.1` (U.S. DOL) + `ESCO v1.2.0` (European Commission) |
| **Canonical Mappings** | `522+` official mapped concepts |
| **Recommendation Formula** | $30\%$ Gap + $20\%$ Role + $15\%$ Market + $10\%$ Semantic + $10\%$ Velocity + $10\%$ Learning + $5\%$ Progress |
| **Roadmap Stages** | 5 Stages: `LEARN` $\rightarrow$ `PRACTICE` $\rightarrow$ `BUILD` $\rightarrow$ `VALIDATE` $\rightarrow$ `RE_EVALUATE` |
| **Python Pytest Suite** | `48 / 48 Passed` across 14 test files in 3.77s |
| **Backend Intelligence Suite** | `30 / 30 Passed` across 3 test suites in 0.52s |
| **Frontend Automated Tests** | `NO FRONTEND AUTOMATED TEST SUITE FOUND` (Honest status; build & linter passed) |
| **Frontend Production Build** | `11.15s` with `0 errors` |
| **Frontend Linter (`oxlint`)** | `0 errors` across 570 files |
| **Roadmap Generation Latency**| `323ms` local freeze measurement (30 milestone stage actions) |
| **Semantic Extraction Latency**| `39ms` (tokenization + PyTorch vector inference) |
| **Semantic Search Latency** | `11ms` (pgvector cosine similarity with HNSW index) |
| **Docker Validation Status** | `NOT EXECUTED — DOCKER UNAVAILABLE` (Config present; daemon was unavailable) |

---

## 🏛️ Subsystem Architecture Summary

```
[ Frontend: React 19 + Vite + Tailwind CSS ]
                      │ (REST API / JSON)
                      ▼
[ Core Gateway: Node.js 22 + Express ESM (Prisma ORM) ]
          │                                  │ (X-AI-Service-Key)
          ▼                                  ▼
[ PostgreSQL 16 + pgvector ]   [ Python 3.12 FastAPI AI Service ]
```

1. **Frontend Layer**:
   - React 19, JavaScript JSX, Vite bundler, Tailwind CSS, Lucide icons, Framer Motion transitions.
   - Strictly isolated: Never communicates directly with PostgreSQL or the Python AI microservice.

2. **Core Backend Layer**:
   - Node.js 22, Express ESM, Prisma ORM, JSON Web Tokens (JWT), Winston logging.
   - Owns authentication, RBAC, tenant isolation, business logic orchestration, and roadmap state machines.

3. **AI / NLP Microservice**:
   - Python 3.12, FastAPI, PyTorch, `sentence-transformers`, `scikit-learn`.
   - 100% stateless: Computes embeddings, language detection, Hinglish extraction, and time-series forecasts.

4. **Data & Vector Layer**:
   - PostgreSQL 16 with `pgvector` extension and HNSW cosine distance indexing.
   - Resilient in-memory repository (`MemoryStore`) provides evaluation baseline if PostgreSQL is offline.

---

## 🛡️ Core Defensible Rules & Distinctions

1. **Claimed Skill vs. Demonstrated Capability**:
   - Claimed Skill = Self-reported profile entry.
   - Demonstrated Capability = Evidence-backed with verified code artifact or active enterprise experience.

2. **Skill Gap vs. Evidence Gap**:
   - Skill Gap = Theoretical or proficiency deficit ($P_{\text{target}} > P_{\text{current}}$).
   - Evidence Gap = Target proficiency met or claimed, but zero application artifacts exist ($E = 0$).

3. **Adaptive Roadmap Skipping**:
   - Evidence Gap triggers automatic skip of `LEARN` $\rightarrow$ activates `BUILD` & `VALIDATE`.

4. **Hard-Negative Anti-Merge**:
   - Explicit boundary matrix prevents false merges (Java $\neq$ JavaScript, React $\neq$ React Native, SQL $\neq$ SQL Server).

5. **Future Capabilities vs. Trend-Chasing**:
   - Role relevance acts as a hard filter. Globally trending skills in unrelated fields never pollute priorities.

---

## ⚠️ Top 3 Honest Limitations

1. **Statistical Forecasts**: Market trends are statistical time-series projections based on historical data, not guaranteed hiring outcomes.
2. **Practical Evidence Scope**: Project evidence demonstrates applied effort and technical implementation, not complete subject mastery.
3. **Episodic Market Observations**: Current release uses historical observation snapshots rather than a live commercial streaming API.
