from typing import List, Optional
from pydantic import BaseModel, Field


class SkillExtractRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=50000,
        description="Text content to extract skills from",
    )


class ExtractedSkill(BaseModel):
    name: str = Field(..., description="Canonical normalized skill name")
    raw_name: str = Field(..., description="Raw text snippet detected")
    category: str = Field("General", description="Skill category")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    confidence_level: str = Field("HIGH", description="Confidence level: HIGH, MEDIUM, LOW")
    source: str = Field("text", description="Source identifier")
    start_index: Optional[int] = None
    end_index: Optional[int] = None


class SkillExtractResponse(BaseModel):
    success: bool = True
    skills: List[ExtractedSkill]
    total_extracted: int
    processing_ms: Optional[float] = None


class SkillNormalizeRequest(BaseModel):
    skills: List[str] = Field(..., min_length=1, description="List of skill names or variants to normalize")


class NormalizedSkillItem(BaseModel):
    raw_name: str
    canonical_name: str
    category: str
    is_known: bool


class SkillNormalizeResponse(BaseModel):
    success: bool = True
    normalized: List[NormalizedSkillItem]
    total: int
