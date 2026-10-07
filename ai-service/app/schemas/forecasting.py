from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class ForecastStatus(str, Enum):
    SUCCESS = "SUCCESS"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
    INVALID_DATA = "INVALID_DATA"


class TrendCategory(str, Enum):
    GROWING = "GROWING"
    STABLE = "STABLE"
    DECLINING = "DECLINING"
    VOLATILE = "VOLATILE"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


class TimePoint(BaseModel):
    """Single observation time point in a demand series."""
    period: str = Field(..., min_length=1, description="Period identifier e.g. '2025-Q1' or '2025-01'")
    value: float = Field(..., ge=0, description="Observed non-negative demand count or index")
    weight: Optional[float] = Field(default=1.0, ge=0)


class DemandForecastRequest(BaseModel):
    """Request payload for generating statistical demand forecasts."""
    series: List[TimePoint] = Field(..., min_length=1, max_length=200, description="Chronological time series")
    horizon: int = Field(default=3, ge=1, le=12, description="Number of future periods to forecast")
    model: str = Field(default="AUTO", description="Forecasting model to use: AUTO, LINEAR_TREND, MOVING_AVERAGE, EXPONENTIAL_SMOOTHING, NAIVE")
    confidenceLevel: float = Field(default=0.95, ge=0.50, le=0.99)


class ForecastPoint(BaseModel):
    """Single predicted future period."""
    period: str
    predictedDemand: float
    lowerBound: Optional[float] = None
    upperBound: Optional[float] = None
    confidence: ConfidenceLevel = Field(default=ConfidenceLevel.MEDIUM, description="Confidence level: HIGH, MEDIUM, LOW, INSUFFICIENT_DATA")


class ForecastValidationMetrics(BaseModel):
    """Backtesting validation metrics on historical holdouts."""
    model: str
    validationSamples: int
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    dataWarnings: List[str] = Field(default_factory=list)


class DemandForecastResponse(BaseModel):
    """Response returned by the demand forecasting endpoint."""
    success: bool = True
    forecastStatus: ForecastStatus = Field(default=ForecastStatus.SUCCESS, description="SUCCESS, INSUFFICIENT_DATA, INVALID_DATA")
    model: str
    confidenceScore: Optional[float] = None
    confidenceLevel: ConfidenceLevel = Field(default=ConfidenceLevel.MEDIUM, description="HIGH, MEDIUM, LOW, INSUFFICIENT_DATA")
    forecast: List[ForecastPoint] = Field(default_factory=list)
    validation: Optional[ForecastValidationMetrics] = None
    diagnostics: Dict[str, Any] = Field(default_factory=dict)
    disclaimer: str = (
        "Demand forecasts are statistical time-series projections based strictly on historical observations. "
        "They do not constitute guaranteed future market outcomes, hiring certainty, or economic commitments."
    )


class DemandTrendRequest(BaseModel):
    """Request payload for deterministic trend analysis."""
    series: List[TimePoint] = Field(..., min_length=1, max_length=200)


class DemandTrendResponse(BaseModel):
    """Response payload for trend calculation."""
    success: bool = True
    currentDemand: float
    previousDemand: Optional[float] = None
    growthRate: Optional[float] = None
    trendCategory: TrendCategory = Field(..., description="GROWING, STABLE, DECLINING, VOLATILE, INSUFFICIENT_DATA")
    volatility: float
    confidence: ConfidenceLevel = Field(default=ConfidenceLevel.MEDIUM, description="HIGH, MEDIUM, LOW, INSUFFICIENT_DATA")
    observationCount: int = 0
    evidence: List[str] = Field(default_factory=list)


class DemandValidationRequest(BaseModel):
    """Request for data quality and model backtest validation."""
    series: List[TimePoint] = Field(..., min_length=1, max_length=200)
    testPeriods: int = Field(default=1, ge=1, le=6)
    model: str = Field(default="AUTO")


class DemandValidationResponse(BaseModel):
    """Validation response report."""
    success: bool = True
    isValid: bool = True
    observationCount: int
    dataCompleteness: float
    metrics: Optional[ForecastValidationMetrics] = None
    recommendations: List[str] = Field(default_factory=list)
    dataWarnings: List[str] = Field(default_factory=list)
