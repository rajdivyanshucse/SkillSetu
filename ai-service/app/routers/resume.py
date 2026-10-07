from fastapi import APIRouter, Depends, HTTPException, status
from app.config import settings
from app.schemas.resume import ResumeAnalyzeRequest, ResumeAnalyzeResponse
from app.services.resume_analyzer import analyze_resume_text
from app.utils.security import verify_ai_service_key

router = APIRouter(
    prefix="/ai/v1/resume",
    tags=["Resume Intelligence"],
    dependencies=[Depends(verify_ai_service_key)],
)


@router.post("/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume(payload: ResumeAnalyzeRequest):
    """
    Analyzes resume text to extract skills, role history, education, and experience markers.
    """
    if len(payload.text) > settings.max_text_length:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Input text exceeds maximum allowed length of {settings.max_text_length} characters",
        )

    return analyze_resume_text(payload.text)
