from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.resume import RoleSignal


class JobDescriptionSkill(BaseModel):
    name: str
    raw_name: str
    category: str
    confidence: float
    confidence_level: str
    requirement_type: str = Field(
        ...,
        description="Requirement classification: REQUIRED, PREFERRED, MENTIONED, UNKNOWN",
    )
    source: str = "text"
    context_snippet: Optional[str] = None


class JobDescriptionAnalyzeRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=50000,
        description="Job description text to analyze",
    )


class JobDescriptionAnalyzeResponse(BaseModel):
    success: bool = True
    skills: List[JobDescriptionSkill]
    required_skills: List[JobDescriptionSkill] = []
    preferred_skills: List[JobDescriptionSkill] = []
    mentioned_skills: List[JobDescriptionSkill] = []
    roles: List[RoleSignal] = []
    summary: dict = Field(default_factory=dict)
