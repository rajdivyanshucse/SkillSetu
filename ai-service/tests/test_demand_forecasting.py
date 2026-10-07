import pytest
from app.schemas.forecasting import TimePoint, ForecastStatus, ConfidenceLevel
from app.services.demand_forecasting_service import DemandForecastingService


def test_forecast_insufficient_data():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=3)
    assert res.forecastStatus == ForecastStatus.INSUFFICIENT_DATA
    assert res.confidenceLevel == ConfidenceLevel.INSUFFICIENT_DATA
    assert len(res.forecast) == 0


def test_forecast_negative_value():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=0.0),
        TimePoint(period="2025-Q3", value=120.0),
    ]
    # Zero is allowed, let's test invalid format
    res = DemandForecastingService.forecast(series, horizon=3)
    assert res.forecastStatus == ForecastStatus.SUCCESS


def test_forecast_duplicate_period():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q1", value=110.0),
        TimePoint(period="2025-Q3", value=120.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=3)
    assert res.forecastStatus == ForecastStatus.INVALID_DATA
    assert "Duplicate period" in res.diagnostics["error"]


def test_forecast_linear_trend():
    # Strict upward linear trend: 100, 120, 140, 160
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=120.0),
        TimePoint(period="2025-Q3", value=140.0),
        TimePoint(period="2025-Q4", value=160.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=2, model_preference="LINEAR_TREND")
    assert res.forecastStatus == ForecastStatus.SUCCESS
    assert res.model == "LINEAR_TREND"
    assert len(res.forecast) == 2
    # Predicted next points should be 180 and 200
    assert pytest.approx(res.forecast[0].predictedDemand, rel=1e-2) == 180.0
    assert pytest.approx(res.forecast[1].predictedDemand, rel=1e-2) == 200.0
    assert res.forecast[0].lowerBound is not None
    assert res.forecast[0].upperBound is not None
    assert res.forecast[0].lowerBound <= res.forecast[0].predictedDemand <= res.forecast[0].upperBound


def test_forecast_moving_average():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=110.0),
        TimePoint(period="2025-Q3", value=120.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=2, model_preference="MOVING_AVERAGE")
    assert res.forecastStatus == ForecastStatus.SUCCESS
    assert res.model == "MOVING_AVERAGE"
    assert len(res.forecast) == 2
    assert pytest.approx(res.forecast[0].predictedDemand, rel=1e-2) == 110.0


def test_forecast_naive():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=110.0),
        TimePoint(period="2025-Q3", value=125.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=2, model_preference="NAIVE")
    assert res.forecastStatus == ForecastStatus.SUCCESS
    assert res.model == "NAIVE"
    assert res.forecast[0].predictedDemand == 125.0


def test_forecast_exponential_smoothing():
    series = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=110.0),
        TimePoint(period="2025-Q3", value=120.0),
        TimePoint(period="2025-Q4", value=130.0),
    ]
    res = DemandForecastingService.forecast(series, horizon=2, model_preference="EXPONENTIAL_SMOOTHING")
    assert res.forecastStatus == ForecastStatus.SUCCESS
    assert res.model == "EXPONENTIAL_SMOOTHING"
    assert len(res.forecast) == 2
