# SkillSetu — Final Product Overview & Intelligence Architecture

**SkillSetu** is an intelligent workforce and career intelligence platform designed to bridge industry demand, canonical skill taxonomy, talent capability, skill gap analysis, and explainable decision-support recommendations.

---

## 1. Core Platform Capabilities

### Individual Intelligence Continuum
1. **Understand My Skills**: Verified skill inventory with calibrated proficiency levels (Beginner, Intermediate, Advanced) and canonical taxonomy identity.
2. **Identify Skill Gaps**: Deterministic gap calculation comparing current capability against target role requirements with effort estimation.
3. **Understand Target-Role Compatibility**: Role compatibility scoring based on mandatory (70%) and preferred (30%) skill coverage.
4. **Understand Market Demand**: Demand status, observation counts, and 12-month statistical forecasts with standardized disclaimers.
5. **Discover Relevant Opportunities**: Curated role matching based on skill alignment.
6. **Learn What to Develop**: Targeted learning modules and practical microservice project recommendations.
7. **Follow a Milestone Roadmap**: Stage-by-stage progression from baseline to target role mastery.
8. **Receive Explainable Recommendations**: Multi-signal prioritization with full mathematical transparency.

### Organization Intelligence Continuum
1. **Workforce Capability Inventory**: Multi-department skill distribution, bench strength metrics, and seniority breakdown.
2. **Workforce Skill Gaps**: Aggregate gap modeling across engineering and product teams.
3. **Strategic Future Skills**: Long-horizon emerging technology tracking (e.g., Vector DBs, LLM Orchestration).
4. **Talent Discovery & Role Matching**: Non-ranking candidate compatibility evaluation grounded in evidence.
5. **Workforce Scenario Planning**: Headcount and capability growth modeling with optimal action distribution (Hire vs. Upskill vs. Redistribute).
6. **Development & Upskilling Programs**: Cohort-based learning tracks for internal mobility.
7. **Explainable Workforce Recommendations**: Evidence-backed recommendations for organizational talent strategy.

---

## 2. Multi-Signal Recommendation Engine

SkillSetu’s recommendation engine operates deterministically using exact mathematical signal weights:

$$\text{Score} = 0.30(\text{Skill Gap}) + 0.20(\text{Role Importance}) + 0.15(\text{Market Demand}) + 0.10(\text{Semantic Similarity}) + 0.10(\text{Emerging Velocity}) + 0.10(\text{Learning Priority}) + 0.05(\text{User Progress})$$

| Signal Dimension | Weight | Description |
|---|:---:|---|
| **Skill Gap Criticality** | **30%** | Criticality and effort required to close identified skill gaps |
| **Target Role Importance** | **20%** | Taxonomy weight of the skill in target role archetypes |
| **Market Demand Index** | **15%** | Verified market demand intensity and hiring frequency |
| **Semantic Similarity** | **10%** | Semantic closeness in 384-dimensional vector space |
| **Emerging Skill Velocity** | **10%** | Historical growth acceleration and technology horizon |
| **Learning Prerequisites** | **10%** | Readiness based on completed prerequisite modules |
| **User Progress Telemetry** | **5%** | User activity and ongoing milestone momentum |

---

## 3. Data Quality & Ingestion Scoring

All ingested datasets pass through strict schema validation, deduplication, normalization, and quality scoring:

$$\text{Quality Score} = 0.25C + 0.20V + 0.15S + 0.15U + 0.10N + 0.10P + 0.05F$$

- **Completeness ($C$)**: 25%
- **Validity ($V$)**: 20%
- **Schema Compliance ($S$)**: 15%
- **Uniqueness ($U$)**: 15%
- **Normalization ($N$)**: 10%
- **Provenance ($P$)**: 10%
- **Freshness ($F$)**: 5%

Any records violating validation rules are isolated in the **Quarantine Queue** for review without polluting the active knowledge base.

---

## 4. Provenance Categorization

SkillSetu enforces strict data provenance transparency:
- `SEEDED`: Deterministic test and benchmark data used for automated validation and repeatable evaluation.
- `IMPORTED`: Legitimately ingested external datasets from recognized standards and taxonomies.
- `DERIVED`: Analytics derived statistically from historical observations.
- `FORECAST`: Statistical projections based on historical time-series data.

---

## 5. Standardized Platform Disclaimers

1. **Demand Forecasting**: *"Statistical forecast based on historical observations. Does not guarantee future market demand."*
2. **Semantic Matching**: *"Semantic similarity indicates relatedness between skills or requirements. It is not a hiring probability or candidate ranking."*
3. **Compensation Patterns**: *"Advertised compensation patterns reflect observed job-posting data and do not predict individual salary."*
4. **Decision-Support Recommendations**: *"Recommendations are decision-support signals generated from available profile, market, learning, and workforce data."*
5. **Real-Data Limitation**: *"Market intelligence depends on the availability and quality of verified datasets. Demonstration and automated evaluation utilize deterministic seeded datasets."*

---

## 6. Demo Mode & Sandbox Profiles

SkillSetu includes an interactive **Demo Mode** (`/demo`):
- **Demo Individual**: "Demo Backend Engineer" (Java, DSA, SQL, Spring Boot, React, AWS, Docker, System Design targeting Backend Software Engineer).
- **Demo Organization**: "Demo Technology Organization" (48 Engineers, 3 Divisions, 12-month Cloud & AI expansion scenario).
