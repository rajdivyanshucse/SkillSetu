# Future Capability Intelligence Engine (Phase 39)
**SkillSetu Platform Technical Specification & Intelligence Architecture**

---

## 1. Executive Summary & Core Principle

SkillSetu’s **Future Capability Intelligence Engine** answers the forward-looking question:

> **"What capabilities is the candidate's target career direction moving toward, and how should development be prioritized based on BOTH role relevance and market trajectory?"**

Traditional platforms either:
1. Match raw keywords on job postings without understanding candidate capability depth, or
2. Churn out ungrounded "AI trend forecasts" claiming guaranteed future obsolescence or fake precision.

SkillSetu adopts a deterministic, explainable, and role-first paradigm:
- **Phase 38 Answered**: *What can this person actually demonstrate today?*
- **Phase 39 Answers**: *What capabilities is their target career direction moving toward, which core capabilities are stable, which are growing, which are emerging, and which future-relevant gaps exist for this candidate?*

---

## 2. Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                            TARGET ROLE BENCHMARK                                  |
|         Canonical RoleSkills: REQUIRED (90%), PREFERRED (75%), SUPPORTING (50%)   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         ROLE-CAPABILITY UNIVERSE                                  |
|   Target RoleSkills + Category-Adjacent Skills (Bounded, Unrelated Filtered Out)  |
+-----------------------------------------------------------------------------------+
                                         |
         +-------------------------------+-------------------------------+
         |                                                               |
         v                                                               v
+----------------------------------+            +----------------------------------+
|    HISTORICAL MARKET DEMAND      |            |      PHASE 38 CAPABILITY STATE   |
|  - SkillDemandObservation series |            |  - DEMONSTRATED                  |
|  - Time-series growth & variance |            |  - DEVELOPING                    |
|  - Holt-Winters / OLS Forecasts  |            |  - SELF_REPORTED                 |
|  - Provenance: IMPORTED / SEEDED |            |  - EVIDENCE_NEEDED               |
+----------------------------------+            +----------------------------------+
         |                                                               |
         +-------------------------------+-------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                 FUTURE CAPABILITY INTELLIGENCE ENGINE                             |
|                                                                                   |
|  1. Market Signal: GROWING | STABLE | DECLINING | VOLATILE | EMERGING             |
|  2. Horizon: CURRENT_CORE | NEAR_TERM_DEVELOPMENT | EMERGING_DIRECTION            |
|  3. Development Priority: HIGH | MEDIUM | MONITOR | LOW                           |
|  4. 5-Point Multi-Dimensional Explainability (No opaque readiness scores)         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           EXPLAINABLE UI & APIS                                   |
|  - Future Capability Horizon Card (Core, Near-Term, Emerging)                     |
|  - Future-Relevant Capability Gaps (Role Req + Market + Candidate Evidence Gap)   |
|  - Workforce Capability Horizon (Organization Coverage & Upskill/Hire Planning)  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Strict Distinctions & Provenance Integrity

### 3.1 Taxonomy vs. Market Demand
- **O\*NET & ESCO**: Standardized occupation definitions, canonical skill taxonomies, and hierarchical relationships. They are **taxonomies**, not live market indicators.
- **Demand Observations (`SkillDemandObservation`)**: Time-series observation counts aggregated from historical job market ingestion datasets and seeded benchmarks.

> [!IMPORTANT]
> SkillSetu **never** fabricates market growth (e.g. "+24% YoY") from the mere presence of an O\*NET or ESCO taxonomy record. All demand trends strictly require time-series observation data.

### 3.2 Signal Provenance
Every market signal exposed by the engine clearly declares its provenance:
- `IMPORTED`: Sourced from structured external labor market observation batches.
- `SEEDED`: Benchmark baseline data initialized in the platform environment.
- `DERIVED`: Computed from platform historical aggregate observations.
- `FORECAST`: Statistical projection derived via time-series models.

---

## 4. Deterministic Market Signal Classification

Demand trends are classified deterministically using the repository's source-of-truth thresholds (`DEMAND_CONFIG`):

| Classification | Deterministic Mathematical Rule | Explainability Description |
| :--- | :--- | :--- |
| **`GROWING`** | `growthRate >= +10.0%` AND `volatility < 0.30` | Sustained positive growth in historical observations with low-to-moderate variance. |
| **`STABLE`** | `-10.0% <= growthRate < +10.0%` AND `volatility < 0.30` | Established baseline capability with consistent demand in observed dataset. |
| **`DECLINING`** | `growthRate <= -10.0%` AND `volatility < 0.30` | Decreasing demand volume in recent historical observation periods. |
| **`VOLATILE`** | `volatility >= 0.30` | Significant fluctuations across observation periods; requires cautious interpretation. |
| **`EMERGING`** | `growthRate >= +15.0%` AND `volatility < 0.30` AND non-core role requirement / low baseline | High-growth forward-looking capability gaining traction across modern job benchmarks. |
| **`INSUFFICIENT_DATA`** | Observation periods < 2 | Inadequate historical observations to compute a statistically sound trend. |

---

## 5. Role Relevance & Trend-Chasing Prevention

> [!CAUTION]
> A skill trending globally across unrelated industries (e.g. "Clinical Nursing" or "Generative Prompting") must **never** be injected into a software engineer's target horizon as a core requirement.

1. **Role-First Universe**: Future capability analysis begins with the target role's canonical `RoleSkill` mappings.
2. **Conservative Adjacency**: Non-required skills are only evaluated if they share direct domain category adjacency with the target role.
3. **Requirement Types**:
   - `REQUIRED`: Primary benchmark requirement.
   - `PREFERRED`: Secondary advantage.
   - `SUPPORTING`: Contextual or complementary capability.

---

## 6. Exact Decision Table — Future Capability Horizons & Priorities

### 6.1 Future Capability Horizon Segmentation

| Horizon Bucket | Role Relevance | Market Signal | Candidate Capability State | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`CURRENT_CORE`** | `REQUIRED` | `STABLE` or `GROWING` | `DEMONSTRATED` | Foundational competency for target role with established evidence. |
| **`NEAR_TERM_DEVELOPMENT`** | `REQUIRED` or `PREFERRED` | `GROWING` or `STABLE` | `EVIDENCE_NEEDED`, `SELF_REPORTED`, `DEVELOPING` | High-priority capability required by role benchmark with growing market signal and active candidate gap. |
| **`EMERGING_DIRECTION`** | `SUPPORTING` or `PREFERRED` or Category-Adjacent | `EMERGING` or `GROWING` | Any State | Forward-looking capability to monitor and explore as candidate advances. |

### 6.2 Development Priority Decision Matrix

| Role Relevance | Market Signal | Candidate Capability State | Evidence Gap | Development Priority | Priority Badge |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`REQUIRED`** | `GROWING` / `EMERGING` | `EVIDENCE_NEEDED` / `SELF_REPORTED` | `HIGH` | **`HIGH`** | `danger` |
| **`REQUIRED`** | `GROWING` | `DEVELOPING` (In-Progress) | `MODERATE` | **`HIGH`** | `danger` |
| **`REQUIRED`** | `STABLE` | `EVIDENCE_NEEDED` / `SELF_REPORTED` | `HIGH` | **`MEDIUM`** | `warning` |
| **`PREFERRED`** | `GROWING` / `EMERGING` | `EVIDENCE_NEEDED` / `SELF_REPORTED` | `HIGH` / `MODERATE` | **`MEDIUM`** | `warning` |
| **`SUPPORTING`** | `EMERGING` / `GROWING` | Any State | `MODERATE` / `NONE` | **`MONITOR`** | `brand` |
| **`REQUIRED`** | `STABLE` / `GROWING` | `DEMONSTRATED` | `NONE` | **`LOW`** | `neutral` |
| **`SUPPORTING`** | `STABLE` / `DECLINING` | Any State | `LOW` / `NONE` | **`LOW`** | `neutral` |

---

## 7. Future-Relevant Capability Gaps & 5-Point Traceability

Every future-relevant gap exposes 5 transparent, verifiable dimensions:

```json
{
  "id": "gap-docker",
  "skill": {
    "id": "skill-docker-1",
    "name": "Docker",
    "category": "Containerization"
  },
  "targetRole": {
    "id": "role-backend-1",
    "name": "Backend Software Engineer"
  },
  "roleRelevance": "REQUIRED",
  "marketSignal": "GROWING",
  "growthRate": 24.0,
  "trajectory": "+24% observed trend",
  "forecast": {
    "direction": "GROWING",
    "model": "LINEAR_TREND",
    "confidenceLevel": "MEDIUM",
    "confidenceScore": 0.75,
    "provenance": "FORECAST"
  },
  "candidateState": {
    "capabilityState": "EVIDENCE_NEEDED",
    "evidenceStrength": "NONE",
    "evidenceGap": "HIGH",
    "evidenceCount": 0
  },
  "developmentPriority": "HIGH",
  "priorityBadge": "danger",
  "nextAction": "Build and attach a verifiable project implementation artifact demonstrating Docker.",
  "reasons": [
    "REQUIRED competency for target Backend Software Engineer benchmark.",
    "Observed market demand growth (+24% in historical observation dataset).",
    "No verifiable project or experience evidence currently attached."
  ],
  "provenance": "SEEDED"
}
```

---

## 8. Statistical Forecasting Integration

SkillSetu utilizes statistical time-series forecasting models evaluated deterministically via MAE, RMSE, and MAPE:
- **Models Supported**:
  - `HOLT_WINTERS` (Additive / Multiplicative Exponential Smoothing)
  - `OLS` (Ordinary Least Squares Linear Trend)
  - `MOVING_AVERAGE` (Windowed Rolling Average)
  - `LINEAR_TREND` (Local Deterministic Projection)
- **Data Sufficiency Rule**: Minimum 3 historical time-series observation periods required.
- **Insufficient Data Behavior**: Emits `forecastStatus: 'INSUFFICIENT_DATA'` with 0 fabricated predictions.

---

## 9. Organization Workforce Future Capabilities

Workforce future capability intelligence aggregates capability coverage across organizational roles to inform strategic planning:

- **Workforce Coverage %**: Percentage of active members with demonstrated or developing proficiency.
- **Strategic Interventions**:
  - `UPSKILL`: High-growth capability with moderate existing coverage (>= 40%).
  - `HIRE_UPSKILL`: High-growth capability with severe internal coverage deficit (< 25%).
  - `UPSKILL_HIRE`: Growing capability with emerging internal cohort (< 40%).
  - `REDISTRIBUTE`: Stable capability with high internal coverage (>= 60%) to be shared across pods.
- **Strict Invariant**: **Zero employee ranking or individual obsolescence scoring.**

---

## 10. API Specification

### 10.1 Individual Future Capability Endpoints
- `GET /api/v1/future-capabilities/roles/:roleId`
  - Returns complete future capability intelligence, summary, horizons, gaps, and statistical metadata.
- `GET /api/v1/future-capabilities/roles/:roleId/horizon`
  - Lightweight endpoint returning segmented horizon buckets (`CURRENT_CORE`, `NEAR_TERM`, `EMERGING_DIRECTION`).
- `GET /api/v1/future-capabilities/roles/:roleId/gaps`
  - Returns prioritized future-relevant capability gaps with multi-point explanations.
- `GET /api/v1/future-capabilities/skills/:skillId?roleId=:roleId`
  - Granular single-skill telemetry including historical time-series, forecast projection, and candidate gap status.

### 10.2 Organization Workforce Endpoint
- `GET /api/v1/future-capabilities/workforce?departmentId=:deptId`
  - Aggregated workforce capability distribution and calibrated HR interventions.

---

## 11. Statistical Honesty & Compliance

All future intelligence API responses and UI presentations include the standardized platform disclaimer:

> *"Future capability intelligence and trend indicators are derived strictly from historical demand observations and statistical forecast models in the repository. They do not constitute economic guarantees, market certainties, or employment assurances."*

### Prohibited vs. Approved Language
| Prohibited Marketing Claims | Mandatory Statistical Terminology |
| :--- | :--- |
| "Real-time job market demand" | "Historical observation dataset" |
| "Live hiring trends" | "Observed demand trends" |
| "AI predicts you will be obsolete" | "Emerging capability to monitor" |
| "Future-proof skill" | "Growing relevance in target role benchmark" |
| "Guaranteed future demand" | "Statistical time-series forecast" |

---

## 12. Verification & Test Suite Summary

- **Backend Test Suite**: `backend/tests/future-capability-intelligence.test.js` (9/9 tests pass).
- **Regression Suites**:
  - `backend/tests/capability-intelligence.test.js` (13/13 tests pass).
- **Frontend Production Build**: `npm run build` completed with 0 errors.
