import time
from fastapi import APIRouter, Depends, HTTPException, status
from app.config import settings
from app.schemas.skills import (
    SkillExtractRequest,
    SkillExtractResponse,
    SkillNormalizeRequest,
    SkillNormalizeResponse,
    NormalizedSkillItem,
)
from app.services.skill_extractor import extract_skills_from_text
from app.services.skill_normalizer import normalize_skill_name
from app.utils.security import verify_ai_service_key

router = APIRouter(
    prefix="/ai/v1/skills",
    tags=["Skill Intelligence"],
    dependencies=[Depends(verify_ai_service_key)],
)


@router.post("/extract", response_model=SkillExtractResponse)
async def extract_skills(payload: SkillExtractRequest):
    """
    Extracts and normalizes skills from free-form unstructured text.
    """
    if len(payload.text) > settings.max_text_length:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Input text exceeds maximum allowed length of {settings.max_text_length} characters",
        )

    start_time = time.time()
    skills = extract_skills_from_text(payload.text)
    duration_ms = round((time.time() - start_time) * 1000, 2)

    return SkillExtractResponse(
        success=True,
        skills=skills,
        total_extracted=len(skills),
        processing_ms=duration_ms,
    )


@router.post("/normalize", response_model=SkillNormalizeResponse)
async def normalize_skills(payload: SkillNormalizeRequest):
    """
    Normalizes a list of skill name variants to their canonical representations.
    """
    results = []
    for raw in payload.skills:
        canonical, category, is_known = normalize_skill_name(raw)
        results.append(
            NormalizedSkillItem(
                raw_name=raw,
                canonical_name=canonical,
                category=category,
                is_known=is_known,
            )
        )

    return SkillNormalizeResponse(
        success=True,
        normalized=results,
        total=len(results),
    )
