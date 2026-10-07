# ==========================================
# SkillSetu AI Microservice Dockerfile
# FastAPI + PyTorch + Sentence-Transformers runtime
# ==========================================

FROM python:3.11-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment variables for Python & HuggingFace Model Cache
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/root/.cache/huggingface \
    AI_SERVICE_HOST=0.0.0.0 \
    AI_SERVICE_PORT=8001 \
    ENVIRONMENT=production

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app/ ./app/

EXPOSE 8001

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request; res = urllib.request.urlopen('http://localhost:8001/health', timeout=3); exit(0 if res.getcode() == 200 else 1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "1"]
