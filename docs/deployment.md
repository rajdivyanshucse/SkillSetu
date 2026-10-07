# SkillSetu — Production Containerization & Deployment Guide

This document provides complete instructions for orchestrating and deploying the SkillSetu Intelligent Workforce & Career Intelligence Platform in a production-like multi-container environment using Docker Compose.

---

## 1. System Architecture Overview

```
                                [ Web Browser / Client ]
                                           │
                                    (HTTP Port 80)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      frontend (Nginx Reverse Proxy & SPA)    │
                    └──────────────────────┬───────────────────────┘
                                           │
                        (Reverse Proxy: /api/* -> Port 5000)
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │      backend (Node.js Express + Prisma)      │
                    └──────────────┬────────────────┬──────────────┘
                                   │                │
            (Database: Port 5432)  │                │  (Internal API: Port 8001)
                                   ▼                ▼
┌────────────────────────────────────┐    ┌────────────────────────────────────┐
│ postgres (PostgreSQL 16 + pgvector)│    │ ai-service (FastAPI + PyTorch)     │
└────────────────────────────────────┘    └────────────────────────────────────┘
```

### Key Architectural Boundaries
1. **Frontend Isolation**: The React Single-Page Application (SPA) communicates strictly with the Node.js backend (via Nginx reverse proxy `/api/v1/*`). It never connects directly to the Python AI service or PostgreSQL.
2. **AI Microservice Isolation**: The Python AI microservice is a stateless analytical engine. It never connects directly to PostgreSQL and communicates only with the Node.js backend over an internal Docker network authenticated via `X-AI-Service-Key`.
3. **Database Security**: PostgreSQL 16 with `pgvector` operates on an isolated internal network (`backend-net`) with persistent volume storage.

---

## 2. Prerequisites

- **Docker**: Engine 24.0+
- **Docker Compose**: Compose v2.20+
- **Host Ports Available**: `80` (Frontend), `5000` (Backend API), `8001` (AI Service), `5432` (PostgreSQL)

---

## 3. Environment Configuration

1. Copy the Docker environment template:
```bash
cp .env.docker.example .env
```

2. Review and configure the variables in `.env`:
```ini
# Database Settings
POSTGRES_DB=skillsetu_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_database_password
POSTGRES_PORT=5432

# Backend & Security Settings
BACKEND_PORT=5000
JWT_ACCESS_SECRET=your_32_character_minimum_access_secret_key
JWT_REFRESH_SECRET=your_32_character_minimum_refresh_secret_key

# AI Microservice
AI_SERVICE_PORT=8001
AI_SERVICE_API_KEY=your_shared_server_to_server_secret_key

# Frontend Port
FRONTEND_PORT=80
```

> **Security Note**: Never use default secrets in production. Ensure `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `POSTGRES_PASSWORD`, and `AI_SERVICE_API_KEY` are cryptographically randomized strings.

---

## 4. Quick Start: Build & Launch

To build images and launch all services:

```bash
docker compose up --build -d
```

### Automated Startup Sequence
1. **PostgreSQL 16 + pgvector** initializes and performs health checks (`pg_isready`).
2. **Python AI Service** starts and initializes the FastAPI runtime and sentence-transformer embeddings cache.
3. **Node.js Backend** waits for both database and AI service health checks to pass, automatically applies Prisma migrations (`npx prisma migrate deploy`), and begins accepting API requests.
4. **Nginx Frontend** compiles the production React Vite bundle, starts Nginx, and begins serving static assets and proxying API traffic.

---

## 5. Verification & Service URLs

Once containers are running, verify access:

| Service | Container Name | URL | Health Check Endpoint |
|---|---|---|---|
| **Frontend App** | `skillsetu-frontend` | `http://localhost` | `http://localhost/` |
| **Core Backend** | `skillsetu-backend` | `http://localhost:5000` | `http://localhost:5000/health` |
| **Backend Readiness** | `skillsetu-backend` | `http://localhost:5000/ready` | `http://localhost:5000/ready` |
| **AI Microservice** | `skillsetu-ai-service` | `http://localhost:8001` | `http://localhost:8001/health` |

---

## 6. Optional: Seeding Deterministic Demo Data

If you wish to populate the database with deterministic demo profiles ("Demo Backend Engineer" and "Demo Technology Organization"):

```bash
docker compose run --rm backend npm run prisma:seed
```

---

## 7. Operational Commands

### View Service Logs
```bash
# Follow all container logs
docker compose logs -f

# Follow specific service logs
docker compose logs -f backend
docker compose logs -f ai-service
docker compose logs -f frontend
```

### Check Container Health & Status
```bash
docker compose ps
```

### Stop Services (Data Persisted)
```bash
docker compose down
```

### Rebuild Specific Service
```bash
# Rebuild frontend bundle after changes
docker compose up -d --build frontend

# Rebuild backend after changes
docker compose up -d --build backend
```

### Full Clean Reset (Destroys Database Volume)
```bash
# WARNING: This deletes the database volume and all stored data
docker compose down -v
```

---

## 8. Troubleshooting

### 1. Database Connection Timeout
If backend logs show database connectivity retries:
- Check PostgreSQL container status: `docker compose logs postgres`
- Ensure no host port conflict on `5432` if port mapping is enabled.

### 2. Direct SPA Route 404 on Refresh
Nginx is preconfigured with `try_files $uri $uri/ /index.html;`. Direct access to deep routes such as `/dashboard/skill-gaps` or `/admin` will automatically fallback to `index.html`.

### 3. Sentence-Transformer Model Loading
The AI container stores downloaded HuggingFace models in a persistent named Docker volume (`huggingface_cache` at `/root/.cache/huggingface`). The model is downloaded once on initial startup and cached for subsequent restarts.
