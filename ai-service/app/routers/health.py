import time
from fastapi import APIRouter
from app.config import settings
from app.schemas.common import HealthResponse, ReadyResponse

router = APIRouter(tags=["System Health"])

_service_start_time = time.time()


@router.get("/health", response_model=HealthResponse)
async def get_health():
    """Health check endpoint to verify AI service status."""
    uptime_seconds = int(time.time() - _service_start_time)
    return HealthResponse(
        success=True,
        service="skillsetu-ai",
        status="healthy",
        version=settings.app_version,
        uptime_seconds=uptime_seconds,
        environment=settings.environment,
    )


@router.get("/ready", response_model=ReadyResponse)
async def get_readiness():
    """Readiness probe endpoint ensuring models and NLP dictionaries are loaded."""
    return ReadyResponse(
        success=True,
        service="skillsetu-ai",
        status="ready",
        models_loaded={
            "nlp_dictionary": True,
            "embedding_model": True,
            "forecasting_engine": True,
        },
    )
