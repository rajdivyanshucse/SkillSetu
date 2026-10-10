# Adaptive Gap-to-Growth Engine & Dynamic Roadmaps

## 1. Executive Summary & Core Product Vision

The **SkillSetu Adaptive Gap-to-Growth Engine** establishes a continuous, evidence-grounded capability development loop. Traditional career platforms stop after computing static gap lists ("You lack Docker"). In contrast, SkillSetu transforms capability intelligence into an actionable, evolving development journey answering:

1. **What can I demonstrate today?** (Phase 38 Evidence-Based Capability Intelligence)
2. **What does my target role benchmark require?** (Role Taxonomy & RoleSkill Specifications)
3. **What capabilities are growing or emerging in the market?** (Phase 39 Future Capability Intelligence)
4. **What is my exact development need?** (`KNOWLEDGE_GAP`, `PRACTICE_GAP`, `APPLICATION_GAP`, `EVIDENCE_GAP`, `TARGET_PROFICIENCY_GAP`, `FUTURE_RELEVANCE_GAP`)
5. **What should I work on first?** (Deterministic Priority Scoring & Next Best Action)
6. **What should I Learn, Practice, Build, and Validate?** (Adaptive Stage Generation)
7. **What evidence should I attach?** (Project / Experience Artifacts)
8. **What changed when work was completed?** (Closed-Loop Capability & Roadmap Re-evaluation)

```
EVIDENCE
    ↓
CURRENT CAPABILITY STATE (Phase 38)
    ↓
TARGET ROLE REQUIREMENTS (Role Benchmark)
    ↓
FUTURE MARKET SIGNALS (Phase 39)
    ↓
DEVELOPMENT NEED & PRIORITY
    ↓
ADAPTIVE ROADMAP
    ↓
LEARN → PRACTICE → BUILD → VALIDATE
    ↓
NEW EVIDENCE ATTACHMENT
    ↓
CAPABILITY RE-EVALUATION (Phase 38)
    ↓
ROADMAP RE-EVALUATION & PROGRESS PRESERVATION (Phase 40)
```

---

## 2. Deterministic Development Need Classification

Rather than assuming all skill gaps require starting from fundamentals, the engine inspects candidate capability states, declared proficiencies, and evidence depth:

| Development Need Type | Candidate Capability State | Declared Proficiency vs Target | Evidence Gap | Generated Stages | Description & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`KNOWLEDGE_GAP`** | `EVIDENCE_NEEDED` / None | No proficiency (`NONE`) | High / Moderate | `LEARN`, `PRACTICE`, `BUILD`, `VALIDATE`, `RE_EVALUATE` | Candidate lacks foundational knowledge. Must progress through foundational concepts, guided sandbox exercises, and portfolio deliverables. |
| **`EVIDENCE_GAP`** | `SELF_REPORTED` / `EVIDENCE_NEEDED` | Declared meets or exceeds target | High / Moderate | `BUILD`, `VALIDATE`, `RE_EVALUATE` | **Skips `LEARN` & beginner exercises.** Candidate understands syntax/concepts but lacks verified proof. Directs focus to project artifact creation and evidence attachment. |
| **`PRACTICE_GAP`** | `DEVELOPING` | Declared < Target | Moderate | `PRACTICE`, `BUILD`, `VALIDATE`, `RE_EVALUATE` | Candidate has learning exposure or partial project work. Emphasizes guided labs, integration scripts, and deliverables. |
| **`APPLICATION_GAP`** | `SELF_REPORTED` | Declared < Target | Moderate | `PRACTICE`, `BUILD`, `VALIDATE`, `RE_EVALUATE` | Candidate has theoretical familiarity but no applied portfolio evidence. |
| **`TARGET_PROFICIENCY_GAP`** | `DEVELOPING` / `DEMONSTRATED` | Intermediate → Advanced | Low / Moderate | `PRACTICE` (Advanced), `BUILD` (Capstone), `VALIDATE`, `RE_EVALUATE` | Candidate meets baseline but requires senior architectural patterns, distributed scalability, and high-concurrency capstones. |
| **`FUTURE_RELEVANCE_GAP`** | `EVIDENCE_NEEDED` / None | Supporting / Not Required | High | `LEARN`, `PRACTICE`, `BUILD`, `VALIDATE`, `RE_EVALUATE` (Priority: `MONITOR`) | Emerging capability adjacent to target role. Placed in secondary development backlog without disrupting core role requirements. |

---

## 3. Deterministic Roadmap Prioritization

Roadmap prioritization is an orchestration layer that consumes Phase 38 capability states and Phase 39 market classifications without modifying underlying recommendation formulas:

| Priority Tier | Role Requirement | Capability State | Market Signal | Score Range | Rationale & Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CRITICAL`** | `REQUIRED` | `EVIDENCE_NEEDED` / `SELF_REPORTED` | `GROWING` / `EMERGING` | 90 – 95 | Core competency with expanding industry demand and unproven candidate state. |
| **`HIGH`** | `REQUIRED` | `EVIDENCE_NEEDED` / `SELF_REPORTED` | `STABLE` / `VOLATILE` | 80 – 89 | Non-negotiable role benchmark requirement with evidence gap. |
| **`MEDIUM`** | `PREFERRED` | `DEVELOPING` / `EVIDENCE_NEEDED` | Any | 60 – 79 | Secondary role differentiator; builds competitive advantage. |
| **`MONITOR`** | `SUPPORTING` | None / Incomplete | `EMERGING` | 40 – 59 | Next-generation market capability; monitored without trend-chasing. |
| **`LOW`** | Any | `DEMONSTRATED` | Any | 10 – 25 | Capability target fully satisfied with verified project/experience evidence. Maintenance mode. |

---

## 4. Stage Progression & Validation Integrity Guard

Each capability development plan generates discrete, verifiable milestones:

1. **`LEARN`**: Conceptual mastery, design patterns, and architecture contracts. Skipped if claimed proficiency already satisfies target level.
2. **`PRACTICE`**: Hands-on coding exercises, unit tests, and isolated algorithm sandbox modules.
3. **`BUILD`**: Production-grade application repository, microservice deliverable, or container manifest.
4. **`VALIDATE`**: Formal evidence attachment connecting platform-verified projects or professional workplace tenure.
   - **Validation Integrity Guard**: The backend strictly forbids completing a `VALIDATE` stage unless a legitimate, verified `CapabilityEvidence` record exists for the candidate and skill (`EVIDENCE_ATTACHMENT_REQUIRED`). Stage completion alone cannot fake capability promotion.
5. **`RE_EVALUATE`**: Closed-loop recalculation event evaluating newly attached evidence against Phase 38 criteria and updating roadmap priorities.

---

## 5. Next Best Action Engine

The Next Best Action provides an immediate, explainable recommendation answering *"What should I do right now?"*:

- **Selection Rule**: Identifies the highest-priority active capability plan (`CRITICAL` → `HIGH` → `MEDIUM`) and selects its first incomplete milestone stage.
- **Explainability**: Outputs explicit rationale citing role requirement, evidence gap, and market signal:
  > *Why: Required for Backend Software Engineer • High evidence gap • Growing market signal (+34% trend).*
- **Actionable Call-to-Action**: Directs user to the exact execution step (`Build Project Artifact`, `Attach Project Evidence`, or `Continue Development Path`).

---

## 6. Versioning, History Preservation & Change Tracking

Roadmap adaptations are auditable and non-destructive:

- **Version Incrementing**: Triggered upon milestone stage completions, target role modifications, or new capability evidence links.
- **Zero Progress Loss**: When a new roadmap version is generated, previously completed stages are mapped by `${skillId}_${stageType}` and preserved as `COMPLETED`.
- **Change Traceability**: Each recalculation logs a `RoadmapReevaluation` record with `previousSnapshot`, `newSnapshot`, `changeReason`, and human-readable `changeSummary`.
- **Legacy Migration**: Frontend progress stored under `skillsetu_roadmap_progress_v1` is automatically mapped and synchronized to backend milestones on authenticated initial load.

---

## 7. API Reference

| Endpoint | Method | Authentication & Role | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/roadmaps/active` | `GET` | Authenticated `INDIVIDUAL` | Retrieves current active development roadmap with Next Best Action. |
| `/api/v1/roadmaps/generate` | `POST` | Authenticated `INDIVIDUAL` | Generates a new roadmap version for a specified target role. |
| `/api/v1/roadmaps/re-evaluate` | `POST` | Authenticated `INDIVIDUAL` | Triggers closed-loop re-evaluation against latest capability evidence. |
| `/api/v1/roadmaps/:roadmapId/stages/:stageId/complete` | `PATCH` / `POST` | Authenticated `INDIVIDUAL` | Marks a stage complete with validation guard enforcement. |
| `/api/v1/roadmaps/:roadmapId/history` | `GET` | Authenticated `INDIVIDUAL` | Retrieves full versioning and re-evaluation audit trail. |
| `/api/v1/roadmaps/sync-legacy` | `POST` | Authenticated `INDIVIDUAL` | Migrates legacy localStorage progress into backend models. |

---

## 8. Resilience, Security & Ethical Boundaries

- **Database Offline Resilience**: Full in-memory fallback store (`MemoryStore`) mirrors all Prisma roadmap models and query shapes for offline operation and automated testing.
- **AI Service Degraded Operation**: Roadmap core generation remains 100% deterministic and functional without external AI APIs using canonical taxonomy benchmarks.
- **Tenant Isolation & Security**: Roadmaps and stage milestones are scoped strictly to `req.user.id`. Cross-user stage mutations and evidence attachments are blocked with `ApiError.forbidden`.
- **Organization Privacy Boundary**: Individual development roadmaps and private milestone activities are never exposed to organizational dashboards. Organizations view only aggregated workforce capability horizons.
- **Honest Claims & Disclaimers**: Every roadmap response includes the formal disclaimer:
  > *Adaptive development roadmaps are deterministic planning guides based on your current capability evidence, role requirements, and historical market observations. They do not constitute employment guarantees or formal certifications.*
