import math
from typing import List, Tuple, Optional, Dict, Any
from app.schemas.forecasting import (
    TimePoint,
    ForecastPoint,
    ForecastValidationMetrics,
    DemandForecastResponse,
    DemandTrendResponse,
    DemandValidationResponse,
    ForecastStatus,
    TrendCategory,
    ConfidenceLevel,
)
import logging
from app.config import settings

logger = logging.getLogger("skillsetu-ai")


class DemandForecastingService:
    """
    Demand Forecasting & Trend Analysis Service.
    Stateless mathematical time-series forecasting, trend classification, and validation.
    """

    @staticmethod
    def _validate_series(series: List[TimePoint]) -> Tuple[bool, Optional[str], Optional[int]]:
        """
        Validates time-series data for minimum length, ordering, duplicate periods, and non-negative values.
        """
        if not series:
            return False, "Time-series observations cannot be empty.", 0

        if len(series) < settings.min_observations_for_forecast:
            return False, f"Insufficient observations. At least {settings.min_observations_for_forecast} periods required.", len(series)

        seen_periods = set()
        for idx, pt in enumerate(series):
            if pt.value < 0:
                return False, f"Negative demand value encountered at index {idx} ({pt.period}): {pt.value}", len(series)
            if pt.period in seen_periods:
                return False, f"Duplicate period detected: {pt.period}", len(series)
            seen_periods.add(pt.period)

        return True, None, len(series)

    @staticmethod
    def _compute_growth_and_volatility(values: List[float]) -> Tuple[float, float]:
        """
        Computes period-over-period growth rate (%) and coefficient of variation (volatility).
        """
        if len(values) < 2:
            return 0.0, 0.0

        prev = values[-2]
        curr = values[-1]

        if prev == 0:
            growth_rate = 100.0 if curr > 0 else 0.0
        else:
            growth_rate = round(((curr - prev) / prev) * 100.0, 2)

        mean_val = sum(values) / len(values)
        if mean_val == 0:
            volatility = 0.0
        else:
            variance = sum((x - mean_val) ** 2 for x in values) / len(values)
            std_dev = math.sqrt(variance)
            volatility = round(std_dev / mean_val, 4)

        return growth_rate, volatility

    @classmethod
    def classify_trend(cls, series: List[TimePoint]) -> DemandTrendResponse:
        """
        Classifies historical demand into GROWING, STABLE, DECLINING, VOLATILE, or INSUFFICIENT_DATA.
        """
        if not series or len(series) < 2:
            return DemandTrendResponse(
                currentDemand=series[-1].value if series else 0.0,
                previousDemand=0.0,
                growthRate=0.0,
                trendCategory=TrendCategory.INSUFFICIENT_DATA,
                volatility=0.0,
                confidence=ConfidenceLevel.INSUFFICIENT_DATA,
                observationCount=len(series) if series else 0,
                evidence=["Insufficient observation history (at least 2 periods required)."],
            )

        values = [pt.value for pt in series]
        current_demand = values[-1]
        previous_demand = values[-2]
        growth_rate, volatility = cls._compute_growth_and_volatility(values)
        obs_count = len(values)

        evidence: List[str] = []
        evidence.append(f"Observed demand changed from {previous_demand} to {current_demand} ({growth_rate:+.1f}%).")

        # Volatility check
        if volatility >= settings.trend_volatility_threshold:
            category = TrendCategory.VOLATILE
            evidence.append(f"Demand volatility ({volatility:.2f}) exceeds threshold ({settings.trend_volatility_threshold:.2f}).")
        elif growth_rate >= settings.trend_growth_threshold:
            category = TrendCategory.GROWING
            evidence.append(f"Growth rate ({growth_rate:+.1f}%) meets growing threshold (>= +{settings.trend_growth_threshold:.1f}%).")
        elif growth_rate <= settings.trend_decline_threshold:
            category = TrendCategory.DECLINING
            evidence.append(f"Growth rate ({growth_rate:+.1f}%) meets declining threshold (<= {settings.trend_decline_threshold:.1f}%).")
        else:
            category = TrendCategory.STABLE
            evidence.append(f"Growth rate ({growth_rate:+.1f}%) is within stable bounds ({settings.trend_decline_threshold:.1f}% to +{settings.trend_growth_threshold:.1f}%).")

        # Confidence based on observation depth and volatility
        if obs_count >= 6 and volatility < 0.20:
            confidence = ConfidenceLevel.HIGH
        elif obs_count >= 3 and volatility < 0.40:
            confidence = ConfidenceLevel.MEDIUM
        else:
            confidence = ConfidenceLevel.LOW

        return DemandTrendResponse(
            currentDemand=current_demand,
            previousDemand=previous_demand,
            growthRate=growth_rate,
            trendCategory=category,
            volatility=volatility,
            confidence=confidence,
            observationCount=obs_count,
            evidence=evidence,
        )

    @classmethod
    def forecast(
        cls,
        series: List[TimePoint],
        horizon: int = 3,
        model_preference: str = "AUTO",
        confidence_level_pct: float = 0.95,
    ) -> DemandForecastResponse:
        """
        Generates deterministic time-series forecasts using linear trend, moving average, or naive projection.
        """
        is_valid, err_msg, obs_count = cls._validate_series(series)
        if not is_valid:
            return DemandForecastResponse(
                forecastStatus=ForecastStatus.INSUFFICIENT_DATA if "Insufficient" in (err_msg or "") else ForecastStatus.INVALID_DATA,
                model="NONE",
                confidenceScore=0.0,
                confidenceLevel=ConfidenceLevel.INSUFFICIENT_DATA,
                forecast=[],
                validation=None,
                diagnostics={"error": err_msg or "Validation failed", "historical_observations": obs_count or 0},
            )

        values = [pt.value for pt in series]
        n = len(values)
        model_key = model_preference.upper()

        if model_key == "AUTO":
            model = "LINEAR_TREND" if n >= 4 else "MOVING_AVERAGE"
        else:
            model = model_key

        forecasts: List[ForecastPoint] = []

        mean_val = sum(values) / n
        variance = sum((x - mean_val) ** 2 for x in values) / (n - 1) if n > 1 else 0.0
        std_err = math.sqrt(variance)
        z_multiplier = 1.96 if confidence_level_pct >= 0.95 else (1.645 if confidence_level_pct >= 0.90 else 1.28)

        # Generate future period labels
        last_period = series[-1].period

        def next_period_label(last_p: str, step: int) -> str:
            # Handle format like 2025-Q1 or 2025-01
            if "-Q" in last_p:
                parts = last_p.split("-Q")
                try:
                    yr = int(parts[0])
                    q = int(parts[1])
                    total_q = (yr * 4 + q - 1) + step
                    new_yr = total_q // 4
                    new_q = (total_q % 4) + 1
                    return f"{new_yr}-Q{new_q}"
                except Exception:
                    return f"Period+{step}"
            return f"Period+{step}"

        if model == "LINEAR_TREND":
            x_vals = list(range(n))
            x_mean = sum(x_vals) / n
            y_mean = sum(values) / n
            numerator = sum((x_vals[i] - x_mean) * (values[i] - y_mean) for i in range(n))
            denominator = sum((x_vals[i] - x_mean) ** 2 for i in range(n))
            slope = numerator / denominator if denominator != 0 else 0.0
            intercept = y_mean - slope * x_mean

            for h in range(1, horizon + 1):
                t_future = n - 1 + h
                pred = max(0.0, round(intercept + slope * t_future, 2))
                uncertainty = round(z_multiplier * std_err * math.sqrt(1 + (1 / n) + ((t_future - x_mean) ** 2) / (denominator or 1)), 2)
                lower = max(0.0, round(pred - uncertainty, 2))
                upper = round(pred + uncertainty, 2)
                forecasts.append(
                    ForecastPoint(
                        period=next_period_label(last_period, h),
                        predictedDemand=pred,
                        lowerBound=lower,
                        upperBound=upper,
                        confidence=ConfidenceLevel.HIGH if n >= 6 else ConfidenceLevel.MEDIUM,
                    )
                )

        elif model == "MOVING_AVERAGE":
            window = min(3, n)
            ma_val = sum(values[-window:]) / window
            for h in range(1, horizon + 1):
                pred = max(0.0, round(ma_val, 2))
                uncertainty = round(z_multiplier * std_err * math.sqrt(h), 2)
                forecasts.append(
                    ForecastPoint(
                        period=next_period_label(last_period, h),
                        predictedDemand=pred,
                        lowerBound=max(0.0, round(pred - uncertainty, 2)),
                        upperBound=round(pred + uncertainty, 2),
                        confidence=ConfidenceLevel.MEDIUM,
                    )
                )

        elif model == "EXPONENTIAL_SMOOTHING":
            alpha = 0.3
            smoothed = values[0]
            for v in values[1:]:
                smoothed = alpha * v + (1 - alpha) * smoothed
            for h in range(1, horizon + 1):
                pred = max(0.0, round(smoothed, 2))
                uncertainty = round(z_multiplier * std_err * math.sqrt(h), 2)
                forecasts.append(
                    ForecastPoint(
                        period=next_period_label(last_period, h),
                        predictedDemand=pred,
                        lowerBound=max(0.0, round(pred - uncertainty, 2)),
                        upperBound=round(pred + uncertainty, 2),
                        confidence=ConfidenceLevel.MEDIUM,
                    )
                )

        else:  # NAIVE
            model = "NAIVE"
            last_val = values[-1]
            for h in range(1, horizon + 1):
                pred = max(0.0, round(last_val, 2))
                uncertainty = round(z_multiplier * std_err * math.sqrt(h), 2)
                forecasts.append(
                    ForecastPoint(
                        period=next_period_label(last_period, h),
                        predictedDemand=pred,
                        lowerBound=max(0.0, round(pred - uncertainty, 2)),
                        upperBound=round(pred + uncertainty, 2),
                        confidence=ConfidenceLevel.LOW,
                    )
                )

        # Backtesting validation if n >= 4
        validation_metrics = None
        if n >= 4:
            val_res = cls.validate_forecast(series[:-1], actual_future=[series[-1]], model=model)
            if val_res.metrics:
                validation_metrics = val_res.metrics

        # Determine confidence level & score
        if n >= 8 and (not validation_metrics or (validation_metrics.mape and validation_metrics.mape < 25.0)):
            confidence_level = ConfidenceLevel.HIGH
            confidence_score = 0.90
        elif n >= 4:
            confidence_level = ConfidenceLevel.MEDIUM
            confidence_score = 0.75
        else:
            confidence_level = ConfidenceLevel.LOW
            confidence_score = 0.50

        return DemandForecastResponse(
            success=True,
            forecastStatus=ForecastStatus.SUCCESS,
            model=model,
            confidenceScore=confidence_score,
            confidenceLevel=confidence_level,
            forecast=forecasts,
            validation=validation_metrics,
            diagnostics={
                "historical_observations": n,
                "mean_demand": round(mean_val, 2),
                "std_error": round(std_err, 2),
                "model_used": model,
            },
        )

    @classmethod
    def validate_forecast(
        cls,
        training_series: List[TimePoint],
        actual_future: List[TimePoint],
        model: str = "AUTO",
    ) -> DemandValidationResponse:
        """
        Backtests time-series model against ground-truth held-out actual points.
        Calculates MAE, RMSE, and MAPE.
        """
        if not training_series or not actual_future:
            return DemandValidationResponse(
                isValid=False,
                observationCount=len(training_series) + len(actual_future),
                dataCompleteness=0.0,
                metrics=None,
                dataWarnings=["Insufficient data for backtesting validation."],
                recommendations=["Provide at least 4 historical periods and 1 holdout period."],
            )

        horizon = len(actual_future)
        fc_res = cls.forecast(training_series, horizon=horizon, model_preference=model)
        if fc_res.forecastStatus != ForecastStatus.SUCCESS or not fc_res.forecast:
            return DemandValidationResponse(
                isValid=False,
                observationCount=len(training_series) + len(actual_future),
                dataCompleteness=0.5,
                metrics=None,
                dataWarnings=["Forecast model could not generate predictions on training split."],
            )

        actuals = [pt.value for pt in actual_future]
        preds = [f.predictedDemand for f in fc_res.forecast]

        n = min(len(actuals), len(preds))
        if n == 0:
            return DemandValidationResponse(
                isValid=False,
                observationCount=len(training_series) + len(actual_future),
                dataCompleteness=0.5,
                metrics=None,
                dataWarnings=["No matching forecast/actual pairs."],
            )

        errors = [actuals[i] - preds[i] for i in range(n)]
        abs_errors = [abs(e) for e in errors]
        sq_errors = [e ** 2 for e in errors]

        mae = round(sum(abs_errors) / n, 2)
        rmse = round(math.sqrt(sum(sq_errors) / n), 2)

        valid_percentage_errors = [
            abs(actuals[i] - preds[i]) / actuals[i]
            for i in range(n)
            if actuals[i] > 0
        ]
        mape = (
            round((sum(valid_percentage_errors) / len(valid_percentage_errors)) * 100.0, 2)
            if valid_percentage_errors
            else None
        )

        warnings = []
        if any(a == 0 for a in actuals):
            warnings.append("Zero actual values present; MAPE calculated only on non-zero periods.")

        return DemandValidationResponse(
            isValid=True,
            observationCount=len(training_series) + len(actual_future),
            dataCompleteness=1.0,
            metrics=ForecastValidationMetrics(
                model=fc_res.model,
                validationSamples=n,
                mae=mae,
                rmse=rmse,
                mape=mape,
                dataWarnings=warnings,
            ),
            recommendations=[
                f"Validation MAE is {mae:.2f} across {n} holdout period(s)."
            ],
            dataWarnings=warnings,
        )
