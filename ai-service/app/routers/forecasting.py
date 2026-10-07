from fastapi import APIRouter, Depends, HTTPException, Security
from app.schemas.forecasting import (
    DemandForecastRequest,
    DemandForecastResponse,
    DemandTrendRequest,
    DemandTrendResponse,
    DemandValidationRequest,
    DemandValidationResponse,
)
import logging
from app.services.demand_forecasting_service import DemandForecastingService
from app.utils.security import verify_api_key

logger = logging.getLogger("skillsetu-ai")

router = APIRouter(
    prefix="/ai/v1/demand",
    tags=["Demand Forecasting & Intelligence"],
    dependencies=[Depends(verify_api_key)],
)


@router.post(
    "/forecast",
    response_model=DemandForecastResponse,
    summary="Forecast Demand Time-Series",
    description="Calculates time-series demand projections (moving average, linear trend, naive, exponential smoothing) with confidence bounds and reliability metrics.",
)
async def forecast_demand(request: DemandForecastRequest) -> DemandForecastResponse:
    try:
        response = DemandForecastingService.forecast(
            series=request.series,
            horizon=request.horizon,
            model_preference=request.model,
            confidence_level_pct=request.confidenceLevel,
        )
        return response
    except Exception as e:
        logger.error(f"Demand forecasting error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Demand forecasting failed: {str(e)}")


@router.post(
    "/trend",
    response_model=DemandTrendResponse,
    summary="Classify Demand Trend",
    description="Determines trend category (GROWING, STABLE, DECLINING, VOLATILE, INSUFFICIENT_DATA) and calculates growth rate and volatility.",
)
async def analyze_trend(request: DemandTrendRequest) -> DemandTrendResponse:
    try:
        response = DemandForecastingService.classify_trend(series=request.series)
        return response
    except Exception as e:
        logger.error(f"Demand trend analysis error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Demand trend classification failed: {str(e)}")


@router.post(
    "/validate",
    response_model=DemandValidationResponse,
    summary="Validate / Backtest Forecast Model",
    description="Backtests forecasting models against held-out actual observations, returning MAE, RMSE, and MAPE.",
)
async def validate_demand_model(request: DemandValidationRequest) -> DemandValidationResponse:
    try:
        if len(request.series) <= request.testPeriods:
            training = request.series
            actual = []
        else:
            training = request.series[:-request.testPeriods]
            actual = request.series[-request.testPeriods:]

        response = DemandForecastingService.validate_forecast(
            training_series=training,
            actual_future=actual,
            model=request.model,
        )
        return response
    except Exception as e:
        logger.error(f"Demand model validation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Demand validation failed: {str(e)}")

