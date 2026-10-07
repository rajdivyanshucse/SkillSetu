"""Tests for semantic similarity calculation and threshold classification."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings


@pytest.mark.asyncio
async def test_semantic_similarity_valid():
    """Verify semantic similarity returns scored comparisons with threshold categories."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/semantic/similarity",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={
                "sourceText": "Spring Boot API development",
                "candidateTexts": [
                    "Java Spring Boot REST APIs",
                    "React UI components",
                ],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["results"]) == 2

        # Check results structure
        for res in data["results"]:
            assert "candidateText" in res
            assert isinstance(res["similarity"], float)
            assert res["thresholdCategory"] in ["HIGH", "MODERATE", "WEAK", "NONE"]
            assert isinstance(res["isMatch"], bool)

        # Related text should have higher similarity than unrelated text
        res_related = next(r for r in data["results"] if "Spring" in r["candidateText"])
        res_unrelated = next(r for r in data["results"] if "React" in r["candidateText"])
        assert res_related["similarity"] >= res_unrelated["similarity"]


@pytest.mark.asyncio
async def test_semantic_similarity_empty_source():
    """Verify empty source text is rejected with 422."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/semantic/similarity",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={
                "sourceText": "   ",
                "candidateTexts": ["React"],
            },
        )
        assert response.status_code == 422
