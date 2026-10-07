import pytest
from app.schemas.forecasting import TimePoint, TrendCategory, ConfidenceLevel
from app.services.demand_forecasting_service import DemandForecastingService


def test_trend_growing():
    # 100 -> 125 (+25% > +10%)
    series = [
        TimePoint(period="2025-Q1", value=80.0),
        TimePoint(period="2025-Q2", value=90.0),
        TimePoint(period="2025-Q3", value=100.0),
        TimePoint(period="2025-Q4", value=125.0),
    ]
    res = DemandForecastingService.classify_trend(series)
    assert res.trendCategory == TrendCategory.GROWING
    assert res.growthRate == 25.0
    assert res.currentDemand == 125.0
    assert res.previousDemand == 100.0
    assert len(res.evidence) > 0


def test_trend_stable():
    # 100 -> 103 (+3% within [-10%, +10%])
    series = [
        TimePoint(period="2025-Q1", value=98.0),
        TimePoint(period="2025-Q2", value=100.0),
        TimePoint(period="2025-Q3", value=100.0),
        TimePoint(period="2025-Q4", value=103.0),
    ]
    res = DemandForecastingService.classify_trend(series)
    assert res.trendCategory == TrendCategory.STABLE
    assert res.growthRate == 3.0


def test_trend_declining():
    # 100 -> 80 (-20% < -10%)
    series = [
        TimePoint(period="2025-Q1", value=110.0),
        TimePoint(period="2025-Q2", value=105.0),
        TimePoint(period="2025-Q3", value=100.0),
        TimePoint(period="2025-Q4", value=80.0),
    ]
    res = DemandForecastingService.classify_trend(series)
    assert res.trendCategory == TrendCategory.DECLINING
    assert res.growthRate == -20.0


def test_trend_volatile():
    # High variance swings: 10, 200, 15, 220
    series = [
        TimePoint(period="2025-Q1", value=10.0),
        TimePoint(period="2025-Q2", value=200.0),
        TimePoint(period="2025-Q3", value=15.0),
        TimePoint(period="2025-Q4", value=220.0),
    ]
    res = DemandForecastingService.classify_trend(series)
    assert res.trendCategory == TrendCategory.VOLATILE
    assert res.volatility >= 0.30


def test_trend_insufficient_data():
    series = [TimePoint(period="2025-Q1", value=100.0)]
    res = DemandForecastingService.classify_trend(series)
    assert res.trendCategory == TrendCategory.INSUFFICIENT_DATA
    assert res.confidence == ConfidenceLevel.INSUFFICIENT_DATA
