"""Semantic similarity and skill matching schemas."""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field


class SemanticSimilarityRequest(BaseModel):
    """Input payload for computing cosine similarity against candidate texts."""
    sourceText: str = Field(..., min_length=1, max_length=50000, description="Source reference text")
    candidateTexts: List[str] = Field(..., min_length=1, max_length=500, description="List of candidate texts")
    model: Optional[str] = Field(default=None, description="Optional override of embedding model")


class SemanticSimilarityResult(BaseModel):
    """Similarity result against a single candidate text."""
    candidateText: str
    similarity: float = Field(..., description="Cosine similarity score (0.0 to 1.0)")
    thresholdCategory: Literal["HIGH", "MODERATE", "WEAK", "NONE"]
    isMatch: bool = Field(..., description="True if similarity >= weak threshold (0.60)")
    sourceLanguage: Optional[str] = None
    candidateLanguage: Optional[str] = None


class SemanticSimilarityResponse(BaseModel):
    """Response containing calculated semantic similarities."""
    success: bool = True
    sourceText: str
    sourceLanguage: Optional[str] = "en"
    embeddingModel: str = "paraphrase-multilingual-MiniLM-L12-v2"
    results: List[SemanticSimilarityResult]


class SkillMatchItem(BaseModel):
    """Explainable match result between a source skill and candidate skill."""
    source: str
    candidate: str
    matchType: Literal["EXACT", "NORMALIZED", "CROSS_LANGUAGE_ALIAS", "TAXONOMY_IDENTIFIER", "SEMANTIC"]
    similarity: Optional[float] = None
    thresholdCategory: Literal["HIGH", "MODERATE", "WEAK", "NONE"]
    reason: str
    inputLanguage: Optional[str] = "en"
    canonicalSkill: Optional[str] = None
    evidence: Optional[Dict[str, Any]] = None


class SkillMatchRequest(BaseModel):
    """Input payload for hybrid lexical, taxonomy alias, and multilingual semantic skill matching."""
    sourceSkills: List[str] = Field(..., min_length=1, max_length=200, description="List of source/required skills")
    candidateSkills: List[str] = Field(..., min_length=1, max_length=200, description="List of candidate/possessed skills")
    model: Optional[str] = Field(default=None, description="Optional override of embedding model")


class SkillMatchResponse(BaseModel):
    """Detailed matching response with explainable cross-language signals."""
    success: bool = True
    matches: List[SkillMatchItem]
    unmatchedSourceSkills: List[str]
    unmatchedCandidateSkills: List[str]
    matchRate: float = Field(..., description="Ratio of matched source skills (0.0 to 1.0)")
    modelUsed: Optional[str] = "paraphrase-multilingual-MiniLM-L12-v2"
    embeddingMode: Optional[str] = "MULTILINGUAL"
