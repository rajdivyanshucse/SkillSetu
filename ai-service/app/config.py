import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """AI Service Configuration Settings."""

    app_name: str = "SkillSetu AI Service"
    app_version: str = "1.0.0"
    environment: str = "development"
    log_level: str = "INFO"

    ai_service_host: str = "127.0.0.1"
    ai_service_port: int = 8001
    node_backend_url: str = "http://localhost:5000"

    # Server-to-server security key
    ai_service_api_key: str = "sk-skillsetu-ai-dev-secret-key"

    # Input constraints
    max_text_length: int = 50000

    # Embedding model configuration (Phase 34)
    embedding_mode: str = "MULTILINGUAL"  # "ENGLISH" | "MULTILINGUAL"
    english_model_name: str = "all-MiniLM-L6-v2"
    multilingual_model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"
    embedding_model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"
    embedding_dimension: int = 384

    # Language support & testing matrix
    supported_languages: List[str] = ["en", "hi", "de", "fr", "es", "pa"]
    tested_languages: List[str] = ["en", "hi", "de", "fr", "es"]

    # Centralized engineering similarity thresholds (Section 7 & Phase 34)
    similarity_threshold_high: float = 0.85
    similarity_threshold_moderate: float = 0.70
    similarity_threshold_weak: float = 0.60

    # Demand trend and forecasting configuration (Phase 25)
    trend_growth_threshold: float = 10.0  # percentage >= +10% is GROWING
    trend_decline_threshold: float = -10.0  # percentage <= -10% is DECLINING
    trend_volatility_threshold: float = 0.30  # relative std dev >= 0.30 is VOLATILE
    min_observations_for_forecast: int = 3

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
