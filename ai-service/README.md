# SkillSetu AI Service (FastAPI / NLP / ML Foundation)

The SkillSetu AI Service is an isolated, high-performance Python microservice providing natural language processing, deterministic skill normalization, resume intelligence, and job description parsing for the SkillSetu Intelligent Workforce & Career Intelligence Platform.

---

## 🛠 Technology Stack

- **Language:** Python (v3.11+ / v3.12+ / v3.14+)
- **Framework:** FastAPI
- **Data Validation:** Pydantic v2
- **ASGI Server:** Uvicorn
- **Testing:** Pytest & HTTPX AsyncClient

---

## 🏗 Architecture & Boundary Rules

```
Browser / React Frontend
        │
        ▼ (Never calls Python directly)
Node.js Express Backend
        │
        ├──────────────────────────┐
        ▼                          ▼
PostgreSQL / Prisma Database    Python AI Service (FastAPI)
                                (Port 8001 / Server-to-Server)
```

### Critical Architectural Boundaries
1. **Zero Browser Access:** Browser clients communicate strictly with the Node.js API.
2. **Zero Direct DB Access:** The Python service does not connect to PostgreSQL. Node.js manages all database persistence.
3. **Deterministic First-Layer:** Extraction and normalization utilize deterministic dictionary matching, word boundaries, and taxonomy alias resolution rather than non-deterministic black-box LLMs.
4. **Server-to-Server Security:** All incoming requests must provide the `X-AI-Service-Key` header matching the backend secret.

---

## ⚙ Configuration (`.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `AI_SERVICE_HOST` | `127.0.0.1` | Host interface to bind server |
| `AI_SERVICE_PORT` | `8001` | TCP port for AI microservice |
| `NODE_BACKEND_URL` | `http://localhost:5000` | Node.js backend origin |
| `AI_SERVICE_API_KEY` | `sk-skillsetu-ai-dev-secret-key` | Shared server-to-server security key |
| `ENVIRONMENT` | `development` | Deployment environment |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `MAX_TEXT_LENGTH` | `50000` | Maximum input string length (characters) |

---

## 📡 API Endpoints

### 1. `GET /health`
Verifies microservice operational status, uptime, and configuration.
```json
{
  "success": true,
  "service": "skillsetu-ai",
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 1284,
  "environment": "development"
}
```

### 2. `GET /ready`
Readiness probe verifying taxonomy dictionaries and NLP engines are compiled and ready.
```json
{
  "success": true,
  "service": "skillsetu-ai",
  "status": "ready",
  "models_loaded": {
    "nlp_dictionary": true,
    "embedding_model": true,
    "forecasting_engine": true
  }
}
```

### 3. `POST /ai/v1/skills/extract`
Extracts and normalizes all recognized skills from unstructured text.
- **Headers:** `X-AI-Service-Key: <key>`
- **Input:**
  ```json
  {
    "text": "Senior Engineer experienced in JavaScript, React, Spring Boot, PostgreSQL and Docker."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "skills": [
      {
        "name": "JavaScript",
        "raw_name": "JavaScript",
        "category": "Programming",
        "confidence": 0.98,
        "confidence_level": "HIGH",
        "source": "text",
        "start_index": 35,
        "end_index": 45
      }
    ],
    "total_extracted": 5,
    "processing_ms": 1.2
  }
  ```

### 4. `POST /ai/v1/skills/normalize`
Normalizes a list of skill name variants to their standard canonical representations.
- **Input:**
  ```json
  {
    "skills": ["JS", "NodeJS", "k8s", "Postgres"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "normalized": [
      { "raw_name": "JS", "canonical_name": "JavaScript", "category": "Programming", "is_known": true },
      { "raw_name": "NodeJS", "canonical_name": "Node.js", "category": "Backend", "is_known": true },
      { "raw_name": "k8s", "canonical_name": "Kubernetes", "category": "DevOps", "is_known": true },
      { "raw_name": "Postgres", "canonical_name": "PostgreSQL", "category": "Database", "is_known": true }
    ],
    "total": 4
  }
  ```

### 5. `POST /ai/v1/resume/analyze`
Extracts skills, detected roles, and structured education/experience signals from raw resume text.

### 6. `POST /ai/v1/job-description/analyze`
Extracts skills classified into `REQUIRED`, `PREFERRED`, or `MENTIONED` based on contextual indicators.

### 7. `POST /ai/v1/embeddings/generate` (Phase 24)
Generates dense vector embeddings (384-dimensional) for an array of input texts using normalized inference.
- **Headers:** `X-AI-Service-Key: <key>`
- **Input:**
  ```json
  {
    "texts": ["Java backend development", "Spring Boot REST API"],
    "model": "all-MiniLM-L6-v2",
    "normalize": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "model": "all-MiniLM-L6-v2",
    "dimension": 384,
    "embeddings": [
      { "dimension": 384, "vector": [0.042, -0.015, "...384 items..."] }
    ]
  }
  ```

### 8. `POST /ai/v1/semantic/similarity` (Phase 24)
Computes cosine similarity between a source query text and multiple candidate texts with threshold categorization.
- **Input:**
  ```json
  {
    "sourceText": "Java backend development",
    "candidateTexts": ["Spring Boot API development", "Frontend React development", "Data analysis with Python"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "sourceText": "Java backend development",
    "results": [
      {
        "candidate": "Spring Boot API development",
        "similarity": 0.88,
        "normalizedScore": 88,
        "thresholdCategory": "HIGH",
        "isMatch": true
      }
    ]
  }
  ```

### 9. `POST /ai/v1/semantic/skills/match` (Phase 24)
Performs explainable hybrid matching across source and candidate skill lists.
- **Input:**
  ```json
  {
    "sourceSkills": ["Java", "Spring Boot", "REST APIs"],
    "candidateSkills": ["Java backend", "Spring", "API development", "React"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "totalSourceSkills": 3,
    "totalCandidateSkills": 4,
    "matchRate": 100,
    "matches": [
### 10. `POST /ai/v1/demand/forecast` (Phase 25)
Generates time-series statistical demand forecasts (Moving Average, Linear Trend, Exponential Smoothing, Naive) for skills or roles over specified future periods.
- **Headers:** `X-AI-Service-Key: <key>`
- **Input:**
  ```json
  {
    "skill_id": "skill-1",
    "entity_name": "Python",
    "entity_type": "SKILL",
    "historical_data": [
      { "period": "2024-Q1", "value": 75.0 },
      { "period": "2024-Q2", "value": 80.0 },
      { "period": "2024-Q3", "value": 84.0 },
      { "period": "2024-Q4", "value": 88.0 },
      { "period": "2025-Q1", "value": 92.0 }
    ],
    "forecast_periods": 3,
    "model": "LINEAR_TREND"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "entity_name": "Python",
    "entity_type": "SKILL",
    "model_used": "LINEAR_TREND",
    "forecast_points": [
      { "period": "2025-Q2", "forecast_value": 96.2, "lower_bound": 92.0, "upper_bound": 100.4, "confidence_level": "HIGH" }
    ],
    "status": "COMPLETED",
    "volatility": 0.03,
    "trend_direction": "GROWING",
    "disclaimer": "Demand forecasts are statistical time-series projections based on historical observations and do not guarantee future outcomes or hiring certainty."
  }
  ```

### 11. `POST /ai/v1/demand/trend` (Phase 25)
Analyzes historical time-series observations to compute growth rates, volatility, and trend classification.
- **Input:**
  ```json
  {
    "entity_name": "React",
    "entity_type": "SKILL",
    "observations": [
      { "period": "2024-Q1", "value": 60.0 },
      { "period": "2025-Q1", "value": 72.0 }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "entity_name": "React",
    "entity_type": "SKILL",
    "growth_rate_pct": 20.0,
    "trend_direction": "GROWING",
    "volatility": 0.04,
    "is_emerging": true,
    "status": "COMPLETED"
  }
  ```

### 13. `POST /ai/v1/recommendations/features` (Phase 26)
Calculates transparent analytical feature scores, priority classifications, and explainable evidence breakdowns across multi-signal recommendation candidates.
- **Headers:** `X-AI-Service-Key: <key>`
- **Input:**
  ```json
  {
    "features": [
      {
        "candidate_id": "cand-docker",
        "entity_type": "SKILL",
        "entity_name": "Docker",
        "skill_gap_value": 42.0,
        "role_importance_score": 85.0,
        "demand_trend_score": 80.0,
        "semantic_relevance_score": 75.0,
        "emerging_score": 60.0,
        "learning_relevance_score": 90.0,
        "progress_score": 20.0
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "total_candidates": 1,
    "results": [
      {
        "candidate_id": "cand-docker",
        "entity_type": "SKILL",
        "entity_name": "Docker",
        "weighted_score": 69.1,
        "priority": "HIGH",
        "confidence": "HIGH",
        "data_quality": "HIGH",
        "recommended_action": "LEARN",
        "weights_used": {
          "skill_gap": 0.30,
          "role_importance": 0.20,
          "demand": 0.15,
          "semantic": 0.10,
          "emerging": 0.10,
          "learning": 0.10,
          "progress": 0.05
        },
        "evidence_summary": [
          "Target role requires Docker proficiency above current profile level (gap: 42.0).",
          "High alignment with target career requirements (score: 85.0).",
          "Strong observed market demand and positive growth trends (score: 80.0)."
        ]
      }
    ],
    "disclaimer": "Feature scores and priority classifications are analytical decision-support signals. They do not represent employment or hiring probabilities."
  }
  ```

---

## 📈 Demand Forecasting & Trend Classification Rules (Phase 25)

### 1. Centralized Trend Thresholds
- **`GROWING`:** Growth rate $\ge +10\%$
- **`DECLINING`:** Growth rate $\le -10\%$
- **`STABLE`:** Growth rate within $[-10\%, +10\%]$
- **`VOLATILE`:** Coefficient of variation (volatility) $\ge 0.30$ (30%)
- **`INSUFFICIENT_DATA`:** Fewer than 2 observations

### 2. Supported Forecasting Models
- **`LINEAR_TREND`:** Ordinary Least Squares (OLS) linear trend projection with bounded prediction intervals.
- **`MOVING_AVERAGE`:** Configurable rolling-window simple moving average.
- **`EXPONENTIAL_SMOOTHING`:** Single exponential smoothing with adaptive smoothing constant $\alpha$.
- **`NAIVE`:** Last-known observation persistence baseline.

### 3. Backtesting Validation Metrics
- **Mean Absolute Error (MAE):** $\text{MAE} = \frac{1}{n} \sum |y_t - \hat{y}_t|$
- **Root Mean Squared Error (RMSE):** $\text{RMSE} = \sqrt{\frac{1}{n} \sum (y_t - \hat{y}_t)^2}$
- **Mean Absolute Percentage Error (MAPE):** $\text{MAPE} = \frac{100\%}{n} \sum \left|\frac{y_t - \hat{y}_t}{y_t}\right|$

---

## 🎯 Similarity Thresholds & Hybrid Matching

Thresholds represent centralized, configurable engineering baselines:

| Cosine Similarity | Category | Classification |
| :--- | :--- | :--- |
| $\ge 0.85$ | **HIGH** | High semantic similarity / capability match |
| $0.70 - 0.849$ | **MODERATE** | Moderate semantic similarity |
| $0.60 - 0.699$ | **WEAK** | Weak semantic relation |
| $< 0.60$ | **NONE** | No semantic match |

*Note: Similarity reflects semantic relatedness, NOT hiring probability or candidate selection guarantees.*

---

## 🔒 Privacy & Security Protections

1. **No Sensitive Logging:** Raw resumes, job descriptions, and API keys are never written to disk or stdout.
2. **Strict Payload Limits:** Texts $> 50,000$ characters are rejected with `422 Unprocessable Entity`.
3. **Transient Embeddings:** Embeddings derived from user-specific text remain transient and are not persisted directly.
4. **Sanitized Errors:** Internal stack traces and exception internals are masked behind generic error structures.
5. **Statistical Forecasting & Recommendation Neutrality:** All forecast and recommendation endpoints output explicit disclaimers affirming that projections and recommendations are analytical estimations and not guarantees.

---

## 🚀 Development & Test Commands

### 1. Setup Virtual Environment
```bash
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
```

### 2. Run Test Suite
```bash
.\.venv\Scripts\pytest -v
```

### 3. Run Microservice
```bash
.\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```



