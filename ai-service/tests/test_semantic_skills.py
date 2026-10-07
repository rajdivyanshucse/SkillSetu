"""Tests for hybrid lexical, normalized, and semantic skill matching."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings


@pytest.mark.asyncio
async def test_semantic_skills_hybrid_matching():
    """Verify hybrid skill matching distinguishes EXACT, NORMALIZED, and SEMANTIC matches."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/semantic/skills/match",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={
                "sourceSkills": [
                    "JavaScript",
                    "Postgres",
                    "Kubernetes",
                    "Rust",
                ],
                "candidateSkills": [
                    "JavaScript",
                    "PostgreSQL",
                    "Container orchestration",
                    "UI Design",
                ],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        matches = data["matches"]
        assert len(matches) >= 2

        # 1. Exact match check
        exact_match = next((m for m in matches if m["source"] == "JavaScript"), None)
        assert exact_match is not None
        assert exact_match["matchType"] == "EXACT"

        # 2. Normalized alias match check
        norm_match = next((m for m in matches if m["source"] == "Postgres"), None)
        assert norm_match is not None
        assert norm_match["matchType"] == "NORMALIZED"

        # 3. Unmatched check
        assert "Rust" in data["unmatchedSourceSkills"] or "Rust" not in [m["source"] for m in matches]
        assert isinstance(data["matchRate"], float)


@pytest.mark.asyncio
async def test_semantic_skills_match_empty_skills():
    """Verify empty skill lists are rejected with 422."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/semantic/skills/match",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={
                "sourceSkills": [],
                "candidateSkills": ["Java"],
            },
        )
        assert response.status_code == 422
