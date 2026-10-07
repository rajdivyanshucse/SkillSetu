from typing import Optional, Dict, Any
from pydantic import BaseModel


class HealthResponse(BaseModel):
    success: bool = True
    service: str = "skillsetu-ai"
    status: str = "healthy"
    version: str = "1.0.0"
    uptime_seconds: Optional[int] = None
    environment: Optional[str] = "development"


class ReadyResponse(BaseModel):
    success: bool = True
    service: str = "skillsetu-ai"
    status: str = "ready"
    models_loaded: Dict[str, bool] = {
        "nlp_dictionary": True,
        "embedding_model": True,
        "forecasting_engine": True,
    }


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    message: str
    details: Optional[Any] = None
