# SkillSetu — Demo Preflight Checklist

## BEFORE PRESENTATION CHECKLIST

- [x] **PostgreSQL / Data Layer**: Database or resilient in-memory store active and responsive.
- [x] **Python AI Microservice**: FastAPI server listening on `http://127.0.0.1:8001` with `paraphrase-multilingual-MiniLM-L12-v2` loaded (384 dimensions).
- [x] **Node.js Core Backend**: Express server listening on `http://localhost:5000` with `/api/v1` routes and AI service client connected.
- [x] **React Frontend**: Vite development server running on `http://localhost:5173`.
- [x] **Health Checks Verified**:
  - Backend: `GET http://localhost:5000/api/v1/health` -> `status: "healthy"`
  - AI Microservice: `GET http://127.0.0.1:8001/ai/v1/health` -> `status: "healthy"`
- [x] **Demo Data Available**:
  - Individual profile: `candidate@skillsetu.com` (Backend Engineer target role, skill gaps, learning paths, recommendations).
  - Organization account: `orgadmin@skillsetu.com` (Workforce capability, scenario planning, skill clusters).
  - Admin account: `admin@skillsetu.com` (Data quality, provenance, O*NET/ESCO mappings).
- [x] **Official O*NET / ESCO Records Available**: 522 taxonomy mappings, official URIs, and cross-language concepts.
- [x] **Multilingual Semantic Model Ready**: Hindi (Devanagari), German, French, Spanish, and Punjabi query resolution.
- [x] **Individual Demo Path Confirmed**: Dashboard -> Skill Gap -> Compatibility -> Roadmap -> Learning -> Recommendations.
- [x] **Organization Demo Path Confirmed**: Dashboard -> Workforce Intelligence -> Scenario Planning -> Talent Discovery.
- [x] **Admin Data Quality Confirmed**: Ingestion sources, quarantine records, dataset versions, provenance audit.
- [x] **Internet-Independent Execution Confirmed**: All embedding models and deterministic intelligence run 100% locally.

---

## EXACT STARTUP COMMANDS

### Terminal 1: Python FastAPI AI Microservice
```bash
cd ai-service
.venv/Scripts/python -m uvicorn app.main:app --port 8001 --host 127.0.0.1
```

### Terminal 2: Node.js Backend API
```bash
cd backend
node src/server.js
```

### Terminal 3: React Frontend Application
```bash
npm run dev
```

---

## PREFLIGHT VERIFICATION SCRIPT

Run this one-line command to verify the complete running stack before taking the stage:

```bash
node -e "
async function verify() {
  const ai = await fetch('http://127.0.0.1:8001/ai/v1/health').then(r => r.json());
  const be = await fetch('http://localhost:5000/api/v1/health').then(r => r.json());
  console.log('AI Service:', ai.status === 'healthy' ? 'READY' : 'OFFLINE');
  console.log('Backend API:', be.data?.status === 'healthy' ? 'READY' : 'OFFLINE');
  console.log('Model:', ai.model?.name);
  console.log('Dimensions:', ai.model?.dimension);
}
verify();
"
```
