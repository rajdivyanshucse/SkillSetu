"""Tests for embedding generation endpoint and service."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import settings


@pytest.mark.asyncio
async def test_embeddings_generate_valid():
    """Verify embedding generation produces 384-dimensional normalized vectors."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/embeddings/generate",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={"texts": ["Java backend engineering", "React frontend development"]},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["dimension"] == 384
        assert data["count"] == 2
        assert len(data["embeddings"]) == 2
        for emb in data["embeddings"]:
            assert emb["dimension"] == 384
            assert len(emb["vector"]) == 384
            # Check for no NaN or Inf
            assert all(isinstance(v, float) and not (v != v) for v in emb["vector"])


@pytest.mark.asyncio
async def test_embeddings_unauthorized():
    """Verify request without valid API key is rejected with 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/embeddings/generate",
            headers={"X-AI-Service-Key": "invalid-key"},
            json={"texts": ["Python programming"]},
        )
        assert response.status_code == 401


@pytest.mark.asyncio
async def test_embeddings_empty_text_rejected():
    """Verify empty texts payload is rejected with 422."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/ai/v1/embeddings/generate",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={"texts": []},
        )
        assert response.status_code == 422


@pytest.mark.asyncio
async def test_embeddings_oversized_text_rejected():
    """Verify oversized text (>50,000 chars) is rejected with 422."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        huge = "test " * 15000  # ~75,000 chars
        response = await client.post(
            "/ai/v1/embeddings/generate",
            headers={"X-AI-Service-Key": settings.ai_service_api_key},
            json={"texts": [huge]},
        )
        assert response.status_code == 422
