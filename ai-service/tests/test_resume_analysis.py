import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

AUTH_HEADERS = {"X-AI-Service-Key": settings.ai_service_api_key}


@pytest.mark.asyncio
async def test_analyze_resume():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resume_text = """
        John Doe
        Senior Backend Engineer with 6+ years of experience in distributed systems.
        Education: B.Tech in Computer Science from National Institute of Technology.
        Skills:
        - Python, FastAPI, Django, REST APIs
        - PostgreSQL, Redis, Docker, Kubernetes
        - AWS Cloud, CI/CD Pipelines, Microservices
        """
        response = await client.post(
            "/ai/v1/resume/analyze",
            json={"text": resume_text},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        skills = [s["name"] for s in data["skills"]]
        assert "Python" in skills
        assert "FastAPI" in skills
        assert "PostgreSQL" in skills
        assert "Docker" in skills
        assert "Kubernetes" in skills

        roles = [r["title"] for r in data["roles"]]
        assert any("Backend Engineer" in r for r in roles)

        assert len(data["educationSignals"]) >= 1
        assert len(data["experienceSignals"]) >= 1
        assert data["experienceSignals"][0]["years_estimate"] == 6.0
