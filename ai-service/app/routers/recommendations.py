import logging
from fastapi import APIRouter, Depends, status
from app.utils.security import verify_api_key
from app.schemas.recommendations import (
    RecommendationFeatureRequest,
    RecommendationFeatureResponse,
)
from app.services.recommendation_feature_service import recommendation_feature_service

logger = logging.getLogger("skillsetu-ai.recommendations")

router = APIRouter(
    prefix="/ai/v1/recommendations",
    tags=["recommendations"],
    dependencies=[Depends(verify_api_key)],
)


@router.post(
    "/features",
    response_model=RecommendationFeatureResponse,
    status_code=status.HTTP_200_OK,
    summary="Compute recommendation feature weighting and priority classification",
)
async def compute_recommendation_features(request: RecommendationFeatureRequest):
    logger.info("Processing recommendation feature analytics for %d items", len(request.items))
    results = recommendation_feature_service.compute_features(request.items)
    return RecommendationFeatureResponse(
        success=True,
        total_processed=len(results),
        results=results,
    )
