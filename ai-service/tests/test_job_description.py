import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

AUTH_HEADERS = {"X-AI-Service-Key": settings.ai_service_api_key}


@pytest.mark.asyncio
async def test_analyze_job_description_required_and_preferred():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        jd_text = """
        Job Title: Lead Full Stack Engineer
        
        Requirements and Qualifications:
        - Must have strong experience with React.js, TypeScript, and Node.js.
        - Required proficiency in PostgreSQL and REST APIs.
        
        Nice to have and Preferred:
        - Bonus if you have experience with Kubernetes and Docker.
        - Nice to have experience in Python and AWS Cloud.
        """
        response = await client.post(
            "/ai/v1/job-description/analyze",
            json={"text": jd_text},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        req_names = [s["name"] for s in data["required_skills"]]
        pref_names = [s["name"] for s in data["preferred_skills"]]

        # Verify required classification
        assert "React.js" in req_names
        assert "TypeScript" in req_names
        assert "Node.js" in req_names
        assert "PostgreSQL" in req_names

        # Verify preferred classification
        assert "Kubernetes" in pref_names or "Docker" in pref_names
        assert "Python" in pref_names or "AWS Cloud" in pref_names

        # Verify roles detected
        roles = [r["title"] for r in data["roles"]]
        assert any("Full Stack Engineer" in r for r in roles)
