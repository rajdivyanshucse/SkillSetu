"""Unit and integration tests for multilingual semantic intelligence (Phase 34)."""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.embedding_service import embedding_service
from app.services.semantic_skill_matcher import semantic_skill_matcher
from app.services.skill_normalizer import normalize_skill_name

AUTH_HEADERS = {"X-AI-Service-Key": "sk-skillsetu-ai-dev-secret-key"}


@pytest.mark.asyncio
async def test_supported_languages_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/ai/v1/semantic/languages", headers=AUTH_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "en" in data["supportedLanguages"]
        assert "hi" in data["supportedLanguages"]
        assert "de" in data["supportedLanguages"]
        assert "fr" in data["supportedLanguages"]
        assert "es" in data["supportedLanguages"]
        assert data["dimension"] == 384


@pytest.mark.asyncio
async def test_multilingual_embedding_generation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "texts": [
                "Machine Learning",
                "मशीन लर्निंग",
                "Softwareentwicklung",
                "Analyse de données",
                "Gestión de proyectos",
            ],
            "model": "paraphrase-multilingual-MiniLM-L12-v2",
        }
        response = await client.post("/ai/v1/embeddings/generate", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["count"] == 5
        assert data["dimension"] == 384
        for emb in data["embeddings"]:
            assert len(emb["vector"]) == 384


@pytest.mark.asyncio
async def test_cross_language_semantic_similarity():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Hindi Devanagari test
        payload_hi = {
            "sourceText": "Machine Learning",
            "candidateTexts": ["मशीन लर्निंग", "पायथन", "डाटाबेस"],
        }
        res_hi = await client.post("/ai/v1/semantic/similarity", json=payload_hi, headers=AUTH_HEADERS)
        assert res_hi.status_code == 200
        data_hi = res_hi.json()
        assert data_hi["results"][0]["similarity"] >= 0.70
        assert data_hi["results"][0]["thresholdCategory"] in ["HIGH", "MODERATE"]

        # German test
        payload_de = {
            "sourceText": "Software Development",
            "candidateTexts": ["Softwareentwicklung", "Projektmanagement"],
        }
        res_de = await client.post("/ai/v1/semantic/similarity", json=payload_de, headers=AUTH_HEADERS)
        assert res_de.status_code == 200
        data_de = res_de.json()
        assert data_de["results"][0]["similarity"] >= 0.70

        # French test
        payload_fr = {
            "sourceText": "Data Analysis",
            "candidateTexts": ["Analyse de données", "Gestion de projet"],
        }
        res_fr = await client.post("/ai/v1/semantic/similarity", json=payload_fr, headers=AUTH_HEADERS)
        assert res_fr.status_code == 200
        data_fr = res_fr.json()
        assert data_fr["results"][0]["similarity"] >= 0.70

        # Spanish test
        payload_es = {
            "sourceText": "Project Management",
            "candidateTexts": ["Gestión de proyectos", "Desarrollo de software"],
        }
        res_es = await client.post("/ai/v1/semantic/similarity", json=payload_es, headers=AUTH_HEADERS)
        assert res_es.status_code == 200
        data_es = res_es.json()
        assert data_es["results"][0]["similarity"] >= 0.70


@pytest.mark.asyncio
async def test_hard_negatives_separation():
    """Verify that hard negatives (Java/JavaScript, React/React Native, etc.) are separated."""
    # 1. Java vs JavaScript
    norm_java = normalize_skill_name("Java")[0]
    norm_js = normalize_skill_name("JavaScript")[0]
    assert norm_java != norm_js
    assert norm_java == "Java"
    assert norm_js == "JavaScript"

    # 2. React vs React Native
    norm_react = normalize_skill_name("React")[0]
    norm_rn = normalize_skill_name("React Native")[0]
    assert norm_react != norm_rn
    assert norm_react == "React.js"
    assert norm_rn == "React Native"

    # 3. SQL vs SQL Server
    norm_sql = normalize_skill_name("SQL")[0]
    norm_sql_server = normalize_skill_name("SQL Server")[0]
    assert norm_sql != norm_sql_server

    # 4. Data Analysis vs Data Engineering
    norm_da = normalize_skill_name("Data Analysis")[0]
    norm_de = normalize_skill_name("Data Engineering")[0]
    assert norm_da != norm_de

    # 5. Project Management vs Product Management
    norm_pjm = normalize_skill_name("Project Management")[0]
    norm_pdm = normalize_skill_name("Product Management")[0]
    assert norm_pjm != norm_pdm


@pytest.mark.asyncio
async def test_cross_language_hybrid_skill_matching():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "sourceSkills": ["Machine Learning", "Software Development", "Data Analysis"],
            "candidateSkills": ["मशीन लर्निंग", "Softwareentwicklung", "Analyse de données"],
        }
        response = await client.post("/ai/v1/semantic/skills/match", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["matches"]) == 3
        assert data["matchRate"] == 1.0

        for match in data["matches"]:
            assert match["thresholdCategory"] in ["HIGH", "MODERATE"]
            assert match["matchType"] in ["CROSS_LANGUAGE_ALIAS", "SEMANTIC"]
            assert match["canonicalSkill"] is not None
