from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.skills import ExtractedSkill


class RoleSignal(BaseModel):
    title: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    source: str = "text"


class ExperienceSignal(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    years_estimate: Optional[float] = None
    raw_text: Optional[str] = None


class EducationSignal(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    field_of_study: Optional[str] = None
    raw_text: Optional[str] = None


class ResumeAnalyzeRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=50000,
        description="Raw resume text to analyze",
    )


class ResumeAnalyzeResponse(BaseModel):
    success: bool = True
    skills: List[ExtractedSkill]
    roles: List[RoleSignal] = []
    experienceSignals: List[ExperienceSignal] = []
    educationSignals: List[EducationSignal] = []
    summary: dict = Field(default_factory=dict)
