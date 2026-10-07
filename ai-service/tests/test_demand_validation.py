import pytest
from app.schemas.forecasting import TimePoint
from app.services.demand_forecasting_service import DemandForecastingService


def test_validation_backtesting():
    training = [
        TimePoint(period="2025-Q1", value=100.0),
        TimePoint(period="2025-Q2", value=120.0),
        TimePoint(period="2025-Q3", value=140.0),
    ]
    actual_future = [
        TimePoint(period="2025-Q4", value=160.0),
    ]

    res = DemandForecastingService.validate_forecast(
        training_series=training,
        actual_future=actual_future,
        model="LINEAR_TREND",
    )

    assert res.isValid is True
    assert res.observationCount == 4
    assert res.metrics is not None
    assert res.metrics.mae is not None
    assert res.metrics.rmse is not None
    assert res.metrics.mae == 0.0
    assert res.metrics.rmse == 0.0
    assert res.metrics.mape == 0.0


def test_validation_empty_inputs():
    res = DemandForecastingService.validate_forecast(
        training_series=[],
        actual_future=[],
        model="LINEAR_TREND",
    )
    assert res.isValid is False
    assert res.observationCount == 0
    assert res.metrics is None
    assert len(res.dataWarnings) > 0
