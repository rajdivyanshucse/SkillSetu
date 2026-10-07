"""
Lightweight, deterministic language and script detector for SkillSetu semantic intelligence.
Identifies language codes (en, hi, de, fr, es, pa, unknown) for normalization and explainability.
"""

import re
import unicodedata
from typing import Dict, Any, Optional

# Unicode script ranges
RE_DEVANAGARI = re.compile(r'[\u0900-\u097F]')
RE_GURMUKHI = re.compile(r'[\u0A00-\u0A7F]')
RE_LATIN = re.compile(r'[a-zA-Z\u00C0-\u024F]')

# Common stopwords / signature terms per language for Latin scripts
LANGUAGE_INDICATORS = {
    "de": {
        "chars": set("äöüßÄÖÜ"),
        "words": {
            "und", "der", "die", "das", "mit", "von", "für", "ein", "eine", "einer", "eines",
            "ist", "im", "in", "den", "dem", "des", "zu", "auf", "nicht", "softwareentwicklung",
            "datenanalyse", "projektmanagement", "maschinelles", "lernen", "datenbank", "beruf"
        },
    },
    "fr": {
        "chars": set("éèêëàâçîïôùûÉÈÊËÀÂÇÎÏÔÙÛ"),
        "words": {
            "et", "de", "la", "le", "les", "des", "du", "en", "pour", "avec", "dans", "un", "une",
            "est", "sur", "par", "développement", "données", "gestion", "projet", "analyse",
            "apprentissage", "automatique", "compétence", "logiciel"
        },
    },
    "es": {
        "chars": set("ñáéíóúüÑÁÉÍÓÚÜ¿¡"),
        "words": {
            "y", "de", "el", "la", "los", "las", "en", "para", "con", "por", "del", "un", "una",
            "es", "al", "desarrollo", "datos", "análisis", "gestión", "proyectos", "aprendizaje",
            "automático", "software", "competencia", "programación"
        },
    },
    "hi_hinglish": {
        "chars": set(),
        "words": {
            "mujhe", "aata", "aati", "hai", "hain", "karna", "aur", "ke", "liye", "seekhna",
            "chahiye", "hota", "hoti", "ka", "ki", "ko", "se", "mein", "par", "bhi", "karo",
            "kaise", "kya", "mera", "meri", "hum", "aap", "karta", "karti"
        },
    },
    "en": {
        "chars": set(),
        "words": {
            "the", "and", "of", "in", "for", "with", "on", "at", "to", "is", "a", "an", "by",
            "as", "from", "that", "this", "are", "be", "or", "development", "data", "analysis",
            "learning", "management", "engineering", "software"
        },
    },
}


def detect_language(text: str) -> Dict[str, Any]:
    """
    Detects the primary language and script of an input text string.

    Returns:
        Dict with keys:
            - language: "en" | "hi" | "de" | "fr" | "es" | "pa" | "unknown"
            - script: "Devanagari" | "Gurmukhi" | "Latin" | "Mixed" | "Unknown"
            - confidence: float (0.0 to 1.0)
            - isMultilingual: bool (True if non-English or mixed)
    """
    if not text or not text.strip():
        return {
            "language": "unknown",
            "script": "Unknown",
            "confidence": 0.0,
            "isMultilingual": False,
        }

    normalized = unicodedata.normalize("NFKC", text.strip())

    total_chars = len([c for c in normalized if not c.isspace() and not c.isdigit()])
    if total_chars == 0:
        return {
            "language": "unknown",
            "script": "Unknown",
            "confidence": 0.0,
            "isMultilingual": False,
        }

    devanagari_count = len(RE_DEVANAGARI.findall(normalized))
    gurmukhi_count = len(RE_GURMUKHI.findall(normalized))
    latin_count = len(RE_LATIN.findall(normalized))

    # 1. Devanagari script detection (Hindi)
    if devanagari_count / total_chars > 0.30:
        conf = round(min(1.0, devanagari_count / total_chars + 0.3), 2)
        return {
            "language": "hi",
            "script": "Devanagari",
            "confidence": conf,
            "isMultilingual": True,
        }

    # 2. Gurmukhi script detection (Punjabi)
    if gurmukhi_count / total_chars > 0.30:
        conf = round(min(1.0, gurmukhi_count / total_chars + 0.3), 2)
        return {
            "language": "pa",
            "script": "Gurmukhi",
            "confidence": conf,
            "isMultilingual": True,
        }

    # 3. Latin script analysis (English, German, French, Spanish, Hinglish)
    if latin_count > 0:
        clean_lower = normalized.lower()
        words = set(re.findall(r'\b\w+\b', clean_lower, re.UNICODE))

        # Check for Hinglish signature words
        hinglish_matches = words.intersection(LANGUAGE_INDICATORS["hi_hinglish"]["words"])
        if len(hinglish_matches) >= 2 or (len(words) <= 5 and len(hinglish_matches) >= 1):
            return {
                "language": "hi",
                "script": "Latin",
                "confidence": 0.85,
                "isMultilingual": True,
                "subType": "Hinglish",
            }

        # Check for characteristic diacritics
        text_chars = set(normalized)
        de_char_hits = len(text_chars.intersection(LANGUAGE_INDICATORS["de"]["chars"]))
        fr_char_hits = len(text_chars.intersection(LANGUAGE_INDICATORS["fr"]["chars"]))
        es_char_hits = len(text_chars.intersection(LANGUAGE_INDICATORS["es"]["chars"]))

        de_word_hits = len(words.intersection(LANGUAGE_INDICATORS["de"]["words"]))
        fr_word_hits = len(words.intersection(LANGUAGE_INDICATORS["fr"]["words"]))
        es_word_hits = len(words.intersection(LANGUAGE_INDICATORS["es"]["words"]))
        en_word_hits = len(words.intersection(LANGUAGE_INDICATORS["en"]["words"]))

        scores = {
            "de": de_char_hits * 3 + de_word_hits * 2,
            "fr": fr_char_hits * 3 + fr_word_hits * 2,
            "es": es_char_hits * 3 + es_word_hits * 2,
            "en": en_word_hits * 2,
        }

        best_lang = max(scores, key=scores.get)
        best_score = scores[best_lang]

        if best_score > 0 and best_lang != "en":
            return {
                "language": best_lang,
                "script": "Latin",
                "confidence": min(0.95, round(0.5 + best_score * 0.1, 2)),
                "isMultilingual": True,
            }

        # Default to English for Latin text with baseline confidence
        conf = 0.90 if en_word_hits > 0 else 0.75
        return {
            "language": "en",
            "script": "Latin",
            "confidence": conf,
            "isMultilingual": False,
        }

    return {
        "language": "unknown",
        "script": "Unknown",
        "confidence": 0.50,
        "isMultilingual": False,
    }
