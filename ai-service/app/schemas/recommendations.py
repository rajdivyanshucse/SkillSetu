"""
Pydantic Schemas for Recommendation Feature Analytics (Phase 26)
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RecommendationFeatureInput(BaseModel):
    entity_id: Optional[str] = Field(None, description="Identifier of the skill, role, or entity")
    entity_name: str = Field(..., description="Name of the entity (e.g. Python, Docker)")
    entity_type: str = Field("SKILL", description="Type of entity: SKILL, ROLE, LEARNING_PATH, PROJECT, OPPORTUNITY")
    skill_gap_score: float = Field(0.0, ge=0.0, le=100.0, description="Magnitude of skill deficit (0-100)")
    target_role_importance: float = Field(50.0, ge=0.0, le=100.0, description="Target role requirement weight (0-100)")
    demand_growth_rate: float = Field(0.0, description="Historical demand growth percentage")
    demand_trend_category: str = Field("STABLE", description="GROWING, STABLE, DECLINING, VOLATILE, INSUFFICIENT_DATA")
    semantic_similarity: float = Field(0.0, ge=0.0, le=1.0, description="Cosine semantic similarity score (0.0 - 1.0)")
    is_emerging: bool = Field(False, description="Whether entity exhibits emerging velocity")
    emerging_velocity: float = Field(0.0, ge=0.0, description="Emerging momentum factor")
    learning_progress_pct: float = Field(0.0, ge=0.0, le=100.0, description="Existing learning completion percentage (0-100)")
    proficiency_level: Optional[str] = Field("BEGINNER", description="BEGINNER, INTERMEDIATE, ADVANCED, EXPERT")


class FeatureWeightBreakdown(BaseModel):
    skill_gap_contribution: float
    role_importance_contribution: float
    demand_signal_contribution: float
    semantic_relevance_contribution: float
    emerging_signal_contribution: float
    learning_relevance_contribution: float
    progress_contribution: float


class RecommendationFeatureResult(BaseModel):
    entity_id: Optional[str] = None
    entity_name: str
    entity_type: str
    composite_score: float = Field(..., description="Transparent analytical priority score (0-100)")
    priority: str = Field(..., description="HIGH, MEDIUM, LOW, CRITICAL")
    confidence: str = Field("MEDIUM", description="HIGH, MEDIUM, LOW, INSUFFICIENT_DATA")
    recommended_action: str = Field("LEARN", description="LEARN, PRACTICE, BUILD, VALIDATE, MONITOR, UPSKILL, HIRE")
    weight_breakdown: FeatureWeightBreakdown
    feature_vector: List[float] = Field(default_factory=list, description="Normalized feature vector")
    evidence_summary: List[Dict[str, Any]] = Field(default_factory=list)


class RecommendationFeatureRequest(BaseModel):
    items: List[RecommendationFeatureInput] = Field(..., min_length=1, max_length=100)
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)


class RecommendationFeatureResponse(BaseModel):
    success: bool = True
    total_processed: int
    results: List[RecommendationFeatureResult]
    disclaimer: str = (
        "Recommendation feature scores are analytical decision-support calculations and do not "
        "represent hiring certainty, employment probability, or guaranteed career outcomes."
    )
