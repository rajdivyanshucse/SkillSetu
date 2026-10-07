"""Embeddings generation router."""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.embeddings import EmbeddingGenerateRequest, EmbeddingGenerateResponse, EmbeddingVector
from app.services.embedding_service import embedding_service
from app.utils.security import verify_api_key
from app.config import settings

router = APIRouter(
    prefix="/ai/v1/embeddings",
    tags=["Embeddings"],
    dependencies=[Depends(verify_api_key)],
)


@router.post("/generate", response_model=EmbeddingGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_embeddings(payload: EmbeddingGenerateRequest):
    """Generate dense vector embeddings for input text strings."""
    if not payload.texts or len(payload.texts) == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Texts array cannot be empty."
        )

    for text in payload.texts:
        if not isinstance(text, str) or not text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="All texts must be non-empty strings."
            )
        if len(text) > settings.max_text_length:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Text exceeds maximum permitted limit of {settings.max_text_length} characters."
            )

    active_model = payload.model or settings.embedding_model_name
    vectors = embedding_service.generate_embeddings(
        payload.texts,
        model_name=active_model,
        normalize=payload.normalize
    )
    embedding_items = [
        EmbeddingVector(dimension=len(vec), vector=vec)
        for vec in vectors
    ]

    return EmbeddingGenerateResponse(
        success=True,
        model=active_model,
        dimension=settings.embedding_dimension,
        count=len(embedding_items),
        embeddings=embedding_items
    )
