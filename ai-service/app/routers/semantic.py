"""Semantic similarity, matching, and search router."""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.semantic import (
    SemanticSimilarityRequest,
    SemanticSimilarityResponse,
    SemanticSimilarityResult,
    SkillMatchRequest,
    SkillMatchResponse,
)
from app.services.embedding_service import embedding_service
from app.services.semantic_skill_matcher import semantic_skill_matcher
from app.services.language_detector import detect_language
from app.utils.security import verify_api_key
from app.config import settings

router = APIRouter(
    prefix="/ai/v1/semantic",
    tags=["Semantic Intelligence"],
    dependencies=[Depends(verify_api_key)],
)


@router.get("/languages", status_code=status.HTTP_200_OK)
async def get_supported_languages():
    """Returns matrix of supported and benchmarked semantic languages."""
    return {
        "success": True,
        "supportedLanguages": settings.supported_languages,
        "testedLanguages": settings.tested_languages,
        "activeModel": settings.embedding_model_name,
        "embeddingMode": settings.embedding_mode,
        "dimension": settings.embedding_dimension,
    }


@router.post("/similarity", response_model=SemanticSimilarityResponse, status_code=status.HTTP_200_OK)
async def compute_similarity(payload: SemanticSimilarityRequest):
    """Compute cosine semantic similarity between source text and candidate texts with language detection."""
    source_clean = payload.sourceText.strip()
    if not source_clean:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Source text cannot be empty."
        )
    if len(payload.sourceText) > settings.max_text_length:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Source text exceeds maximum limit of {settings.max_text_length} characters."
        )

    if not payload.candidateTexts:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Candidate texts array cannot be empty."
        )

    for cand in payload.candidateTexts:
        if not isinstance(cand, str) or not cand.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="All candidate texts must be non-empty strings."
            )
        if len(cand) > settings.max_text_length:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Candidate text exceeds maximum limit of {settings.max_text_length} characters."
            )

    active_model = payload.model or settings.embedding_model_name
    source_lang = detect_language(source_clean)["language"]

    # Embed source and candidates
    source_vec = embedding_service.generate_embeddings([source_clean], model_name=active_model)[0]
    cand_vecs = embedding_service.generate_embeddings(payload.candidateTexts, model_name=active_model)

    results = []
    for cand_text, cand_vec in zip(payload.candidateTexts, cand_vecs):
        cand_lang = detect_language(cand_text)["language"]
        sim = embedding_service.compute_cosine_similarity(source_vec, cand_vec)
        category = embedding_service.classify_similarity(sim)
        is_match = embedding_service.is_match(sim)
        results.append(SemanticSimilarityResult(
            candidateText=cand_text,
            similarity=sim,
            thresholdCategory=category,
            isMatch=is_match,
            sourceLanguage=source_lang,
            candidateLanguage=cand_lang,
        ))

    return SemanticSimilarityResponse(
        success=True,
        sourceText=payload.sourceText,
        sourceLanguage=source_lang,
        embeddingModel=active_model,
        results=results
    )


@router.post("/skills/match", response_model=SkillMatchResponse, status_code=status.HTTP_200_OK)
async def match_skills(payload: SkillMatchRequest):
    """Execute hybrid lexical, normalized, and dense multilingual semantic skill matching."""
    if not payload.sourceSkills:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="sourceSkills array cannot be empty."
        )
    if not payload.candidateSkills:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="candidateSkills array cannot be empty."
        )

    for skill in payload.sourceSkills + payload.candidateSkills:
        if not isinstance(skill, str) or not skill.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Skill names must be non-empty strings."
            )
        if len(skill) > settings.max_text_length:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Skill name exceeds maximum limit of {settings.max_text_length} characters."
            )

    return semantic_skill_matcher.match_skills(
        payload.sourceSkills,
        payload.candidateSkills,
        model_name=payload.model
    )
