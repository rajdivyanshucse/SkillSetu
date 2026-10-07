"""
Recommendation Feature Service (Phase 26)
Computes transparent, explainable feature weighting and priority classification for recommendations.
"""

from typing import List, Dict, Any
from app.schemas.recommendations import (
    RecommendationFeatureInput,
    RecommendationFeatureResult,
    FeatureWeightBreakdown,
)


class RecommendationFeatureService:
    # Baseline engineering weights (sum = 1.00)
    W_SKILL_GAP = 0.30
    W_ROLE_IMPORTANCE = 0.20
    W_DEMAND_SIGNAL = 0.15
    W_SEMANTIC_RELEVANCE = 0.10
    W_EMERGING_SIGNAL = 0.10
    W_LEARNING_RELEVANCE = 0.10
    W_CURRENT_PROGRESS = 0.05

    def compute_features(self, items: List[RecommendationFeatureInput]) -> List[RecommendationFeatureResult]:
        results: List[RecommendationFeatureResult] = []

        for item in items:
            # 1. Normalize Skill Gap (0 - 100)
            norm_gap = min(max(item.skill_gap_score, 0.0), 100.0)

            # 2. Normalize Role Importance (0 - 100)
            norm_role = min(max(item.target_role_importance, 0.0), 100.0)

            # 3. Demand Signal Score (0 - 100) based on growth rate & trend
            demand_score = 50.0  # baseline for STABLE
            if item.demand_trend_category == "GROWING" or item.demand_growth_rate >= 10.0:
                demand_score = min(75.0 + (item.demand_growth_rate * 0.5), 100.0)
            elif item.demand_trend_category == "DECLINING" or item.demand_growth_rate <= -10.0:
                demand_score = max(20.0 + (item.demand_growth_rate * 0.5), 0.0)
            elif item.demand_trend_category == "VOLATILE":
                demand_score = 45.0
            elif item.demand_trend_category == "INSUFFICIENT_DATA":
                demand_score = 30.0

            # 4. Semantic Relevance (0 - 100) from cosine similarity (0.0 - 1.0)
            semantic_score = min(max(item.semantic_similarity * 100.0, 0.0), 100.0)

            # 5. Emerging Signal Score (0 - 100)
            emerging_score = 20.0
            if item.is_emerging or item.emerging_velocity > 0:
                emerging_score = min(70.0 + (item.emerging_velocity * 10.0), 100.0)

            # 6. Learning Relevance Score (0 - 100)
            # High gap with low progress means high learning relevance
            learning_relevance = max(norm_gap - (item.learning_progress_pct * 0.5), 20.0)

            # 7. Progress Score (0 - 100) - inverted so unfinished modules receive active priority
            progress_score = max(100.0 - item.learning_progress_pct, 10.0)

            # Contributions
            c_gap = round(norm_gap * self.W_SKILL_GAP, 2)
            c_role = round(norm_role * self.W_ROLE_IMPORTANCE, 2)
            c_demand = round(demand_score * self.W_DEMAND_SIGNAL, 2)
            c_semantic = round(semantic_score * self.W_SEMANTIC_RELEVANCE, 2)
            c_emerging = round(emerging_score * self.W_EMERGING_SIGNAL, 2)
            c_learning = round(learning_relevance * self.W_LEARNING_RELEVANCE, 2)
            c_progress = round(progress_score * self.W_CURRENT_PROGRESS, 2)

            composite_score = round(
                c_gap + c_role + c_demand + c_semantic + c_emerging + c_learning + c_progress,
                2
            )

            # Priority classification
            if composite_score >= 70.0:
                priority = "HIGH" if composite_score < 85.0 else "CRITICAL"
            elif composite_score >= 45.0:
                priority = "MEDIUM"
            else:
                priority = "LOW"

            # Recommended Action determination
            if norm_gap >= 50.0 and item.learning_progress_pct < 30.0:
                recommended_action = "LEARN"
            elif norm_gap >= 25.0:
                recommended_action = "PRACTICE"
            elif item.proficiency_level in ["ADVANCED", "EXPERT"] or item.learning_progress_pct >= 80.0:
                recommended_action = "BUILD"
            elif item.demand_trend_category == "GROWING" or item.is_emerging:
                recommended_action = "VALIDATE"
            else:
                recommended_action = "MONITOR"

            # Confidence determination based on data presence
            if item.demand_trend_category == "INSUFFICIENT_DATA" and norm_gap == 0.0:
                confidence = "INSUFFICIENT_DATA"
            elif norm_gap > 0 and (item.demand_growth_rate != 0 or item.semantic_similarity > 0):
                confidence = "HIGH"
            else:
                confidence = "MEDIUM"

            # Feature vector representation (normalized 0.0 - 1.0)
            feature_vector = [
                round(norm_gap / 100.0, 3),
                round(norm_role / 100.0, 3),
                round(demand_score / 100.0, 3),
                round(semantic_score / 100.0, 3),
                round(emerging_score / 100.0, 3),
                round(learning_relevance / 100.0, 3),
                round(progress_score / 100.0, 3),
            ]

            # Structured evidence summary
            evidence_summary: List[Dict[str, Any]] = [
                {
                    "signal": "SKILL_GAP",
                    "value": round(norm_gap, 1),
                    "contribution": c_gap,
                    "explanation": f"Skill deficit evaluated at {round(norm_gap, 1)}% against target requirements.",
                },
                {
                    "signal": "ROLE_IMPORTANCE",
                    "value": round(norm_role, 1),
                    "contribution": c_role,
                    "explanation": f"Target role requirement factor weighted at {round(norm_role, 1)}%.",
                },
                {
                    "signal": "DEMAND_TREND",
                    "value": item.demand_trend_category,
                    "contribution": c_demand,
                    "explanation": f"Market demand trend is {item.demand_trend_category} (growth: {round(item.demand_growth_rate, 1)}%).",
                },
            ]
            if item.semantic_similarity > 0:
                evidence_summary.append({
                    "signal": "SEMANTIC_SIMILARITY",
                    "value": round(item.semantic_similarity, 3),
                    "contribution": c_semantic,
                    "explanation": f"Dense vector semantic relatedness score is {round(item.semantic_similarity, 3)}.",
                })
            if item.is_emerging:
                evidence_summary.append({
                    "signal": "EMERGING_MOMENTUM",
                    "value": round(item.emerging_velocity, 2),
                    "contribution": c_emerging,
                    "explanation": "Skill displays accelerated multi-period demand velocity.",
                })

            weight_breakdown = FeatureWeightBreakdown(
                skill_gap_contribution=c_gap,
                role_importance_contribution=c_role,
                demand_signal_contribution=c_demand,
                semantic_relevance_contribution=c_semantic,
                emerging_signal_contribution=c_emerging,
                learning_relevance_contribution=c_learning,
                progress_contribution=c_progress,
            )

            results.append(
                RecommendationFeatureResult(
                    entity_id=item.entity_id,
                    entity_name=item.entity_name,
                    entity_type=item.entity_type,
                    composite_score=composite_score,
                    priority=priority,
                    confidence=confidence,
                    recommended_action=recommended_action,
                    weight_breakdown=weight_breakdown,
                    feature_vector=feature_vector,
                    evidence_summary=evidence_summary,
                )
            )

        return results


recommendation_feature_service = RecommendationFeatureService()
