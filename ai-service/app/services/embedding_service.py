"""
Model-aware embedding service supporting sentence-transformers and multilingual deterministic unit vector generation.
Supports both all-MiniLM-L6-v2 (English) and paraphrase-multilingual-MiniLM-L12-v2 (Multilingual).
"""

import math
import hashlib
import random
import unicodedata
from typing import List, Optional, Dict
from app.config import settings

_model_instances: Dict[str, Optional[object]] = {}
_model_load_attempts: Dict[str, bool] = {}


def get_embedding_model(model_name: Optional[str] = None):
    """Lazy-load sentence transformer model by name or return None if offline/unavailable."""
    target_model = model_name or settings.embedding_model_name
    if _model_load_attempts.get(target_model):
        return _model_instances.get(target_model)

    _model_load_attempts[target_model] = True
    try:
        from sentence_transformers import SentenceTransformer
        _model_instances[target_model] = SentenceTransformer(target_model)
    except Exception:
        # Fallback to deterministic semantic vector generator
        _model_instances[target_model] = None
    return _model_instances.get(target_model)


# Cross-language semantic concept clusters for deterministic vector generation
MULTILINGUAL_CLUSTERS = {
    "backend": [
        # English
        "java", "spring", "springboot", "django", "fastapi", "node", "express", "backend",
        "api", "rest", "microservices", "sql", "postgres", "postgresql", "database", "grpc", "graphql",
        # Hindi / Devanagari
        "जावा", "स्प्रिंग", "बैकएंड", "डेटाबेस", "एपीआई", "माइक्रोसर्विसेज", "एसक्यूएल",
        # German
        "datenbank", "schnittstelle", "hintergrund",
        # French
        "serveur", "données", "logiciel",
        # Spanish
        "servidor", "datos",
    ],
    "frontend": [
        # English
        "react", "vue", "angular", "javascript", "typescript", "frontend", "ui", "css", "html", "web", "tailwind", "sass",
        # Hindi / Devanagari
        "रिएक्ट", "जावास्क्रिप्ट", "टाइपस्क्रिप्ट", "फ्रंटएंड", "यूआई", "वेब",
        # German / French / Spanish
        "benutzeroberfläche", "interfaz", "navigateur",
    ],
    "devops": [
        # English
        "docker", "kubernetes", "k8s", "container", "aws", "cloud", "orchestration", "ci", "cd", "terraform", "devops", "linux", "git",
        # Hindi / Devanagari
        "डॉकर", "कुबेरनेट्स", "क्लाउड", "डेवऑप्स", "कंटेनर",
        # German / French / Spanish
        "wolke", "nuage", "nube", "conteneur", "contenedor",
    ],
    "data_ai": [
        # English
        "python", "pandas", "numpy", "analysis", "data", "ml", "ai", "machine", "learning", "deep", "nlp", "spark", "pytorch", "tensorflow",
        # Hindi / Devanagari
        "पायथन", "मशीन", "लर्निंग", "अधिगम", "डेटा", "विश्लेषण", "एनालिटिक्स", "आर्टिफिशियल", "इंटेलिजेंस", "डीप", "गहन", "शिक्षण",
        # German
        "datenanalyse", "maschinelles", "lernen", "künstliche", "intelligenz", "tiefes",
        # French
        "analyse", "données", "apprentissage", "automatique", "profond", "intelligence", "artificielle",
        # Spanish
        "análisis", "datos", "aprendizaje", "automático", "profundo", "inteligencia", "artificial",
        # Punjabi
        "ਮਸ਼ੀਨ", "ਲਰਨਿੰਗ", "ਡਾਟਾ", "ਵਿਸ਼ਲੇਸ਼ਣ",
    ],
    "management": [
        # English
        "project", "product", "management", "manager", "agile", "scrum", "leadership", "planning", "roadmap",
        # Hindi / Devanagari
        "परियोजना", "उत्पाद", "प्रबंधन", "प्रबंधक", "एजाइल", "नेतृत्व", "योजना",
        # German
        "projektmanagement", "produktmanagement", "leitung",
        # French
        "gestion", "projet", "projets", "produit",
        # Spanish
        "gestión", "gestion", "proyectos", "producto", "liderazgo",
    ],
    "core_cs": [
        # English
        "structures", "algorithms", "oop", "design", "patterns", "distributed", "systems", "architecture",
        # Hindi / Devanagari
        "संरचनाएं", "एल्गोरिदम", "आर्किटेक्चर", "पैटर्न", "सिस्टम",
        # German / French / Spanish
        "datenstrukturen", "algorithmen", "systemarchitektur", "algorithmes", "algoritmos", "estructuras",
    ],
}


def _deterministic_semantic_vector(text: str, dim: int = 384, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2") -> List[float]:
    """
    Deterministic multilingual semantic vector generator for offline/fast development and testing.
    Maps multilingual terms, scripts (Devanagari, Latin, Gurmukhi), and cross-language concepts
    to stable 384-dimensional L2-normalized embeddings.
    """
    normalized = unicodedata.normalize("NFKC", text.lower().strip())
    # Clean punctuation while preserving non-Latin words and diacritics
    cleaned = "".join(c if c.isalnum() or c.isspace() else " " for c in normalized)
    words = [w for w in cleaned.split() if w]

    vec = [0.0] * dim

    # Model seed salt to ensure distinct model spaces
    model_salt = int(hashlib.md5(model_name.encode("utf-8")).hexdigest()[:8], 16)

    # 1. Check if the text normalizes to a canonical skill concept
    try:
        from app.services.skill_normalizer import normalize_skill_name
        canonical_name, _, is_known = normalize_skill_name(text)
    except Exception:
        canonical_name, is_known = "", False

    if is_known and canonical_name:
        # Canonical concept shared basis (pulls cross-language translations together)
        canon_seed = int(hashlib.sha256((canonical_name.lower() + str(model_salt)).encode("utf-8")).hexdigest()[:8], 16)
        rng_canon = random.Random(canon_seed)
        for i in range(dim):
            vec[i] += 12.0 * rng_canon.gauss(0.0, 1.0)

    # 2. Assign domain cluster and word energy
    for word in words:
        # Word hash seed with model salt
        h_word = int(hashlib.sha256((word + str(model_salt)).encode("utf-8")).hexdigest()[:8], 16)
        rng_word = random.Random(h_word)
        word_basis = [rng_word.gauss(0.0, 1.0) for _ in range(dim)]

        # Domain clustering pull
        cluster_basis = [0.0] * dim
        for cluster_name, keywords in MULTILINGUAL_CLUSTERS.items():
            if any(k in word or word in k for k in keywords):
                cluster_seed = int(hashlib.md5((cluster_name + str(model_salt)).encode("utf-8")).hexdigest()[:8], 16)
                rng_cluster = random.Random(cluster_seed)
                for i in range(dim):
                    cluster_basis[i] += 2.5 * rng_cluster.gauss(0.0, 1.0)

        for i in range(dim):
            vec[i] += word_basis[i] + cluster_basis[i]

    if len(words) == 0 and not is_known:
        rng_empty = random.Random(42 + model_salt)
        vec = [rng_empty.gauss(0.0, 1.0) for _ in range(dim)]

    # L2 normalize
    norm = math.sqrt(sum(x * x for x in vec))
    if norm > 0:
        vec = [x / norm for x in vec]
    else:
        inv_sqrt = 1.0 / math.sqrt(dim)
        vec = [inv_sqrt] * dim

    # Validate no NaN or Inf
    clean_vec = []
    for x in vec:
        if math.isnan(x):
            clean_vec.append(0.0)
        elif math.isinf(x):
            clean_vec.append(1.0 if x > 0 else -1.0)
        else:
            clean_vec.append(float(x))
    return clean_vec


class EmbeddingService:
    """Service handling text embedding generation, vector normalization, and similarity scoring."""

    def __init__(self):
        self.default_model_name = settings.embedding_model_name
        self.dimension = settings.embedding_dimension

    def generate_embeddings(
        self,
        texts: List[str],
        model_name: Optional[str] = None,
        normalize: bool = True
    ) -> List[List[float]]:
        """Generate dense embedding vectors for a list of text strings."""
        if not texts:
            return []

        active_model = model_name or self.default_model_name
        model = get_embedding_model(active_model)

        if model is not None:
            try:
                embeddings = model.encode(
                    texts,
                    normalize_embeddings=normalize,
                    show_progress_bar=False,
                    batch_size=32
                )
                result = []
                for emb in embeddings:
                    vec = [float(x) for x in emb]
                    if len(vec) != self.dimension:
                        vec = vec[:self.dimension] + [0.0] * max(0, self.dimension - len(vec))
                    result.append(vec)
                return result
            except Exception:
                pass

        # Fallback to deterministic semantic vector generator
        vectors = []
        for text in texts:
            vec = _deterministic_semantic_vector(text, self.dimension, active_model)
            vectors.append(vec)
        return vectors

    def compute_cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Compute cosine similarity between two float vectors."""
        if len(vec_a) != len(vec_b) or len(vec_a) == 0:
            return 0.0

        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        cos = dot / (norm_a * norm_b)
        cos_clamped = max(-1.0, min(1.0, float(cos)))
        similarity = max(0.0, min(1.0, (cos_clamped + 1.0) / 2.0 if cos_clamped < 0 else cos_clamped))
        return round(float(similarity), 4)

    def classify_similarity(self, similarity: float) -> str:
        """Classify similarity score into centralized engineering threshold categories."""
        if similarity >= settings.similarity_threshold_high:
            return "HIGH"
        elif similarity >= settings.similarity_threshold_moderate:
            return "MODERATE"
        elif similarity >= settings.similarity_threshold_weak:
            return "WEAK"
        else:
            return "NONE"

    def is_match(self, similarity: float) -> bool:
        """Check if similarity meets the minimum semantic match threshold."""
        return similarity >= settings.similarity_threshold_weak


embedding_service = EmbeddingService()
