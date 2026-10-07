import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings

AUTH_HEADERS = {"X-AI-Service-Key": settings.ai_service_api_key}


@pytest.mark.asyncio
async def test_normalize_common_variants():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        variants = ["JS", "Javascript", "Node", "NodeJS", "node.js", "React", "ReactJS", "Postgres", "PostgreSQL", "K8s", "kubernetes"]
        response = await client.post(
            "/ai/v1/skills/normalize",
            json={"skills": variants},
            headers=AUTH_HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        norm_map = {item["raw_name"]: item["canonical_name"] for item in data["normalized"]}

        assert norm_map["JS"] == "JavaScript"
        assert norm_map["Javascript"] == "JavaScript"
        assert norm_map["Node"] == "Node.js"
        assert norm_map["NodeJS"] == "Node.js"
        assert norm_map["node.js"] == "Node.js"
        assert norm_map["React"] == "React.js"
        assert norm_map["ReactJS"] == "React.js"
        assert norm_map["Postgres"] == "PostgreSQL"
        assert norm_map["PostgreSQL"] == "PostgreSQL"
        assert norm_map["K8s"] == "Kubernetes"
        assert norm_map["kubernetes"] == "Kubernetes"
