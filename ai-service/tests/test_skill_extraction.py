import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

AUTH_HEADERS = {"X-AI-Service-Key": settings.ai_service_api_key}


@pytest.mark.asyncio
async def test_extract_skills_valid():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        text = "Experienced Java developer with Spring Boot, PostgreSQL, Docker and AWS."
        response = await client.post(
            "/ai/v1/skills/extract",
            json={"text": text},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["skills"]) >= 4

        skill_names = [s["name"] for s in data["skills"]]
        assert "Java" in skill_names
        assert "Spring Boot" in skill_names
        assert "PostgreSQL" in skill_names
        assert "Docker" in skill_names
        assert "AWS Cloud" in skill_names


@pytest.mark.asyncio
async def test_extract_skills_unauthorized():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/skills/extract",
            json={"text": "React.js developer"},
        )
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_extract_skills_empty_text():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/skills/extract",
            json={"text": ""},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_extract_skills_oversized_text():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        huge_text = "Java " * 15000  # > 50000 characters
        response = await client.post(
            "/ai/v1/skills/extract",
            json={"text": huge_text},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_extract_skills_confidence_and_deduplication():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        text = "Proficient in JavaScript, JS, React, and React.js."
        response = await client.post(
            "/ai/v1/skills/extract",
            json={"text": text},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        skill_names = [s["name"] for s in data["skills"]]

        # Both 'JavaScript' & 'JS' normalize to 'JavaScript' and should be deduplicated
        assert skill_names.count("JavaScript") == 1
        assert skill_names.count("React.js") == 1

        for s in data["skills"]:
            assert 0.0 <= s["confidence"] <= 1.0
            assert s["confidence_level"] in ["HIGH", "MEDIUM", "LOW"]
