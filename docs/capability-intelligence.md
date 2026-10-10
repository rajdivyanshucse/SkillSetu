# Phase 38 — Evidence-Based Capability Intelligence Engine

## 1. Purpose & Product Principle

SkillSetu is designed from the ground up to **reject traditional resume keyword-matching**.

Traditional platforms ask:
> *"Does this candidate mention Docker on their resume?"*

SkillSetu's Capability Intelligence Engine answers:
1. **What can this candidate actually demonstrate?**
2. **What verifiable evidence supports that capability?**
3. **How strong, recent, and multi-sourced is that evidence?**
4. **What remains purely self-reported?**
5. **What capabilities does the target role require?**
6. **What exactly is missing (proficiency gap vs evidence gap)?**
7. **What concrete project or workplace artifact must be built next?**

SkillSetu rigorously distinguishes between:
- **SKILL MENTION**: An unverified string token or resume keyword claim.
- **CAPABILITY EVIDENCE**: Concrete, traceable project implementation, professional experience responsibility, or verified learning artifact.
- **CAPABILITY STATE**: Deterministic, explainable status indicating whether the capability is Demonstrated, Developing, Self-Reported, or Evidence Needed.

---

## 2. Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                           CANDIDATE PROFILE DATA                                  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | UserSkills         |  | GrowthProjects       |  | Experiences               |  |
|  | (Claimed skills &  |  | (Applied tech stack, |  | (Tenure, company, role,   |  |
|  |  proficiencies)    |  |  deliverables)       |  |  responsibilities)        |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | LearningProgress   |  | CapabilityEvidence   |  | External Taxonomy         |  |
|  | (Modules, courses) |  | (Manual/linked rows) |  | (O*NET, ESCO mappings)   |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|               EVIDENCE HARVESTING & NORMALIZATION ENGINE                          |
|  1. Harvest from CapabilityEvidence table                                         |
|  2. Extract applied skills from GrowthProjects                                    |
|  3. Match role responsibilities from Experiences                                 |
|  4. Ingest completed coursework from LearningProgress                             |
|  5. Deduplicate by (sourceEntityType, sourceEntityId, skillId)                   |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|              DETERMINISTIC CAPABILITY INTELLIGENCE SERVICE                        |
|  - Derive Evidence State (NONE / DECLARED_ONLY / ATTACHED / MULTI_SOURCE)         |
|  - Derive Evidence Strength (NONE / LIMITED / MODERATE / STRONG)                  |
|  - Compare Target Role Benchmark (REQUIRED / PREFERRED / SUPPORTING)              |
|  - Derive Capability State (DEMONSTRATED / DEVELOPING / SELF_REPORTED / NEEDED)    |
|  - Compute Separate Skill Gap Steps & Evidence Gap Classification                 |
|  - Generate Human-Readable Telemetry Explanations & Evidence Coverage             |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       CAPABILITY API ENDPOINTS (/api/v1)                          |
|  GET /capabilities                                                                |
|  GET /capabilities/summary                                                        |
|  GET /capabilities/:skillId                                                       |
|  GET /capabilities/evidence                                                       |
|  POST /capabilities/evidence                                                      |
|  DELETE /capabilities/evidence/:evidenceId                                        |
|  GET /capabilities/roles/:roleId/readiness                                        |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                           CAPABILITY-FIRST FRONTEND UI                            |
|  - CapabilityReadinessHero                                                        |
|  - CapabilitySnapshot (Counts & Filtering)                                        |
|  - CapabilityCard (State Badges, Strength & Gap Indicators)                       |
|  - CapabilityDetailDrawer (Traceable Evidence, Signals, Next Steps)               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Database Schema: CapabilityEvidence Model

```prisma
model CapabilityEvidence {
  id                 String    @id @default(uuid()) @db.Uuid
  profileId          String    @db.Uuid
  skillId            String    @db.Uuid
  evidenceType       String    // PROJECT, EXPERIENCE, ASSESSMENT, LEARNING, PORTFOLIO, CERTIFICATION
  sourceEntityType   String    // GrowthProject, Experience, LearningProgress, ExternalPortfolio
  sourceEntityId     String?   // UUID of source project or experience
  title              String
  description        String?   @db.Text
  evidenceStrength   String    @default("MODERATE") // LIMITED, MODERATE, STRONG
  evidenceDepth      String    @default("USED") // MENTIONED, USED, BUILT_WITH, CORE_TO_PROJECT
  verificationStatus String    @default("PLATFORM_ATTACHED") // NONE, DECLARED_ONLY, ATTACHED, MULTI_SOURCE, VALIDATED
  occurredAt         DateTime?
  provenance         String    @default("USER_ATTACHED")
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  profile IndividualProfile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  skill   Skill             @relation(fields: [skillId], references: [id], onDelete: Cascade)

  @@index([profileId])
  @@index([skillId])
  @@index([evidenceType])
  @@map("capability_evidences")
}
```

---

## 4. Evidence States

| Evidence State | Criteria | Interpretation |
| :--- | :--- | :--- |
| `NONE` | No declaration on profile and 0 attached artifacts. | Complete absence of signal. |
| `DECLARED_ONLY` | Skill is claimed on user profile (`UserSkill`), but 0 project or experience artifacts are attached. | Unverified candidate claim. |
| `ATTACHED` | Exactly 1 verifiable project, work experience, or learning module is linked. | Single-source foundation. |
| `MULTI_SOURCE` | 2 or more distinct, independent evidence sources (e.g. Project + Work Experience, or multiple completed projects). | Corroborated implementation proof. |
| `VALIDATED` | External formal assessment or accredited certification with verified validation status. | Formally benchmarked verification. |

---

## 5. Evidence Strength

| Strength | Deterministic Rule |
| :--- | :--- |
| `NONE` | 0 independent sources attached. |
| `LIMITED` | 1 in-progress project, active learning module, or general keyword mention. |
| `MODERATE` | 1 completed project implementation OR 1 relevant professional work experience tenure. |
| `STRONG` | Multi-source evidence (>= 2 independent sources) combining completed project and professional workplace application. |

---

## 6. Capability States & Deterministic Decision Table

| Declared on Profile? | Independent Evidence Sources | Role Requirement Type | Current vs Target Proficiency | Derived Capability State | Derived Evidence Gap |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Yes** | >= 1 Completed Project or Experience | Any | User meets or exceeds benchmark | `DEMONSTRATED` | `NONE` (if Strong) / `LOW` (if Moderate) |
| **Yes** | >= 1 In-Progress or Learning Progress | Required / Preferred | Progressing towards benchmark | `DEVELOPING` | `MEDIUM` (if Required) / `LOW` |
| **Yes** | 0 Sources | Supporting / Unspecified | Claimed on profile | `SELF_REPORTED` | `LOW` |
| **Yes** | 0 Sources | `REQUIRED` | Claimed on profile | `EVIDENCE_NEEDED` | `HIGH` |
| **No** | 0 Sources | `REQUIRED` | Missing from profile | `EVIDENCE_NEEDED` | `HIGH` |
| **No** | 0 Sources | `PREFERRED` | Missing from profile | `EVIDENCE_NEEDED` | `MEDIUM` |

---

## 7. Proficiency vs Capability State Separation

SkillSetu treats **Proficiency** and **Capability State** as orthogonal, independent dimensions:

| Candidate Example | Claimed Proficiency | Attached Evidence | Capability State | System Handling |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate 1** | Expert | None | `SELF_REPORTED` (or `EVIDENCE_NEEDED` if required) | Does NOT display as Demonstrated. Prompts user to attach project evidence. |
| **Candidate 2** | Intermediate | Completed Project + Internship | `DEMONSTRATED` | Displays as Demonstrated Intermediate Capability. |
| **Candidate 3** | Beginner | Active Coursework (80%) | `DEVELOPING` | Displays as Developing Capability with active learning progression. |

---

## 8. Skill Gap vs Evidence Gap Separation

SkillSetu does **not** collapse skill gaps and evidence gaps into a single opaque number.

1. **Skill Gap (Proficiency Benchmark Differential)**:
   $$\text{Skill Gap Steps} = \max(0, \text{Target Proficiency Weight} - \text{User Proficiency Weight})$$
   Existing formula: $\text{Priority Score} = \text{Gap Steps} \times \left(\frac{\text{Importance}}{100}\right) \times \text{Requirement Multiplier}$.

2. **Evidence Gap**:
   Determines whether claimed or required competencies have verifiable implementation artifacts attached.
   - `NONE`: Strong multi-source evidence exists.
   - `LOW`: Moderate evidence exists or non-critical self-reported skill.
   - `MEDIUM`: Developing skill or preferred requirement without attached proof.
   - `HIGH`: Target role required prerequisite with zero attached project or workplace evidence.

---

## 9. Evidence Coverage Metric

Evidence Coverage measures the ratio of target role required capabilities backed by meaningful evidence:

$$\text{Evidence Coverage} = \frac{\text{Count of Required Capabilities with Demonstrated or Developing Evidence}}{\text{Total Required Target Capabilities}}$$

*Example Response*:
```json
{
  "evidenceCoverage": {
    "ratio": "6 / 9",
    "percentage": 67,
    "coveredCount": 6,
    "totalRequired": 9,
    "interpretation": "6 / 9 target capabilities supported by verifiable project or experience evidence."
  }
}
```

---

## 10. Semantic Matching & Taxonomy Boundaries

### What Semantic Matching DOES:
- Identifies related skill aliases and taxonomy synonyms (e.g. `JS` $\rightarrow$ `JavaScript`, `Postgres` $\rightarrow$ `PostgreSQL`).
- Discovers contextual relatedness between adjacent technologies in the same domain.
- Maps unstructured project descriptions to canonical catalog skills.

### What Semantic Matching DOES NOT DO:
- **It does NOT prove proficiency.**
- **It does NOT verify candidate execution ability.**
- **It does NOT calculate hiring probability or employment likelihood.**
- **It does NOT replace concrete project or workplace evidence.**

### O*NET & ESCO Role:
- Normalizes occupations, task frameworks, and skill taxonomy codes.
- It does **not** grant candidate capability credits or verify competency.

---

## 11. Security, Tenant Isolation & Privacy

- **Strict Resource Ownership**: User A can only link, view, and unlink projects and experiences belonging to their authenticated profile ID. Cross-tenant linking attempts are rejected with `403 Forbidden`.
- **Zero Raw PII / Resume Content Logging**: Audit logs record sanitized metadata and action counts; resume texts and private project descriptions are never logged.
- **Organization Talent Privacy**: Organization views consume candidate capability distribution and evidence coverage summaries without exposing private unshared project repositories or personal notes unless authorized.

---

## 12. Known Limitations

1. **Project Evidence Demonstrates Application, Not Human Mastery**: A completed project confirms the skill was applied in a working codebase; code quality review is supplementary.
2. **Self-Reported Proficiency Remains User-Supplied**: User proficiency is candidate-reported unless benchmarked against formal assessments.
3. **External Repository Live Code Execution**: Phase 38 relies on platform project deliverables; real-time external Git commit parsing is extensible in future phases.
4. **Diagnostic Purpose**: Capability intelligence is an educational diagnostic tool for career development and does not constitute an employment hiring guarantee.
