"""
Tests for Recommendation Feature Analytics API & Service (Phase 26)
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

AUTH_HEADERS = {"X-AI-Service-Key": settings.ai_service_api_key}


@pytest.mark.asyncio
async def test_compute_recommendation_features_success():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "items": [
                {
                    "entity_id": "skill-1",
                    "entity_name": "Docker",
                    "entity_type": "SKILL",
                    "skill_gap_score": 50.0,
                    "target_role_importance": 90.0,
                    "demand_growth_rate": 15.0,
                    "demand_trend_category": "GROWING",
                    "semantic_similarity": 0.85,
                    "is_emerging": True,
                    "emerging_velocity": 1.5,
                    "learning_progress_pct": 20.0,
                    "proficiency_level": "BEGINNER",
                },
                {
                    "entity_id": "skill-2",
                    "entity_name": "COBOL",
                    "entity_type": "SKILL",
                    "skill_gap_score": 0.0,
                    "target_role_importance": 10.0,
                    "demand_growth_rate": -20.0,
                    "demand_trend_category": "DECLINING",
                    "semantic_similarity": 0.1,
                    "is_emerging": False,
                    "emerging_velocity": 0.0,
                    "learning_progress_pct": 0.0,
                    "proficiency_level": "BEGINNER",
                },
            ]
        }

        response = await client.post("/ai/v1/recommendations/features", headers=AUTH_HEADERS, json=payload)
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True
        assert data["total_processed"] == 2
        assert len(data["results"]) == 2

        # Verify high-priority item (Docker)
        docker_res = data["results"][0]
        assert docker_res["entity_name"] == "Docker"
        assert docker_res["priority"] in ["HIGH", "CRITICAL"]
        assert docker_res["composite_score"] >= 65.0
        assert docker_res["recommended_action"] == "LEARN"
        assert len(docker_res["evidence_summary"]) >= 3
        assert "disclaimer" in data

        # Verify low-priority item (COBOL)
        cobol_res = data["results"][1]
        assert cobol_res["entity_name"] == "COBOL"
        assert cobol_res["priority"] == "LOW"
        assert cobol_res["composite_score"] < 40.0


@pytest.mark.asyncio
async def test_recommendation_features_auth_required():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "items": [
                {
                    "entity_name": "Python",
                    "skill_gap_score": 30.0,
                }
            ]
        }
        response = await client.post("/ai/v1/recommendations/features", json=payload)
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_recommendation_features_validation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Empty items list
        payload = {"items": []}
        response = await client.post("/ai/v1/recommendations/features", headers=AUTH_HEADERS, json=payload)
        assert response.status_code == 422
