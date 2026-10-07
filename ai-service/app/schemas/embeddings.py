"""Embedding generation request and response schemas."""

from typing import List, Optional
from pydantic import BaseModel, Field


class EmbeddingGenerateRequest(BaseModel):
    """Input payload for text embeddings generation."""
    texts: List[str] = Field(
        ...,
        min_length=1,
        max_length=500,
        description="List of text strings to embed (1 to 500 items, each max 50,000 chars)."
    )
    model: Optional[str] = Field(
        default=None,
        description="Identifier of embedding model to use (defaults to server configured model)."
    )
    normalize: bool = Field(
        default=True,
        description="Whether to L2-normalize vectors to unit length."
    )


class EmbeddingVector(BaseModel):
    """Single dense vector representation."""
    dimension: int = Field(default=384, description="Vector dimension")
    vector: List[float] = Field(..., description="Dense float embedding vector")


class EmbeddingGenerateResponse(BaseModel):
    """Output payload containing generated dense vector embeddings."""
    success: bool = True
    model: str = "paraphrase-multilingual-MiniLM-L12-v2"
    dimension: int = 384
    count: int
    embeddings: List[EmbeddingVector]
