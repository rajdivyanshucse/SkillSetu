from app.routers.health import router as health_router
from app.routers.skills import router as skills_router
from app.routers.resume import router as resume_router
from app.routers.job_description import router as job_description_router
from app.routers.embeddings import router as embeddings_router
from app.routers.semantic import router as semantic_router
from app.routers.forecasting import router as forecasting_router
from app.routers.recommendations import router as recommendations_router

__all__ = [
    "health_router",
    "skills_router",
    "resume_router",
    "job_description_router",
    "embeddings_router",
    "semantic_router",
    "forecasting_router",
    "recommendations_router",
]


