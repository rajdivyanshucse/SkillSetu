"""
NLP-based Multilingual Skill Extraction Service.
Extracts and normalizes skills from free-form text using phrase/token boundaries and multilingual taxonomy dictionary matching.
"""

import re
import unicodedata
from typing import List, Dict, Any, Set
from app.schemas.skills import ExtractedSkill
from app.services.skill_normalizer import (
    CANONICAL_SKILLS,
    SYNONYM_MAP,
    normalize_skill_name,
)

# Build regex search patterns for all canonical and synonym terms
# Sorting longer phrases first ensures "React Native" matches before "React"
ALL_SEARCH_TERMS = sorted(
    list(set(list(CANONICAL_SKILLS.keys()) + list(SYNONYM_MAP.keys()))),
    key=lambda s: len(s),
    reverse=True,
)


def _build_regex_pattern(term: str) -> re.Pattern:
    """Builds a Unicode boundary-aware regex pattern for a skill term."""
    escaped = re.escape(term)
    # Handle C++, C#, .NET special boundaries
    if term.lower() in ["c++", "cpp"]:
        return re.compile(r"(?:\b|(?<=\s))c\+\+(?:\b|(?=[\s,;.\/\)]))", re.IGNORECASE)
    if term.lower() in ["c#", "csharp"]:
        return re.compile(r"(?:\b|(?<=\s))c\#(?:\b|(?=[\s,;.\/\)]))", re.IGNORECASE)
    if term.lower() in [".net", "dotnet"]:
        return re.compile(r"(?:\b|(?<=\s))\.(?:net|NET)(?:\b|(?=[\s,;.\/\)]))|\bdotnet\b", re.IGNORECASE)
    if term.lower() == "c":
        # Match 'C' when in lists like "C, C++, Java" or "C / C++"
        return re.compile(r"(?<=[,\/\s])C(?=[,\/\s;\)])", re.ASCII)
    if term.lower() == "r":
        # Match 'R' language in lists like "Python, R, SQL"
        return re.compile(r"(?<=[,\/\s])R(?=[,\/\s;\)])", re.ASCII)
    if term.lower() == "go":
        # Prefer "Golang" or "Go language" or isolated in skill listings
        return re.compile(r"\b(?:golang|go language)\b|(?<=[,\/\(\[])\s*Go\s*(?=[,\/\)\];])", re.IGNORECASE)

    # General Unicode boundary pattern (handles Latin, Devanagari, Gurmukhi, diacritics)
    return re.compile(rf"(?<![\w]){escaped}(?![\w])", re.IGNORECASE | re.UNICODE)


COMPILED_PATTERNS = [(term, _build_regex_pattern(term)) for term in ALL_SEARCH_TERMS]


def extract_skills_from_text(text: str) -> List[ExtractedSkill]:
    """
    Extracts all recognized skills from unstructured multilingual text and normalizes them.

    Args:
        text: Free-form input text.

    Returns:
        List[ExtractedSkill]: Deduplicated list of extracted canonical skills.
    """
    if not text or not text.strip():
        return []

    normalized_text = unicodedata.normalize("NFKC", text)
    found_skills: Dict[str, ExtractedSkill] = {}

    for term, pattern in COMPILED_PATTERNS:
        matches = list(pattern.finditer(normalized_text))
        if not matches:
            continue

        canonical_name, category, is_known = normalize_skill_name(term)
        if not canonical_name:
            continue

        # Confidence calculation
        first_match = matches[0]
        matched_str = first_match.group(0).strip()
        term_len = len(term)

        if term_len >= 6 or " " in term or term.lower() == canonical_name.lower():
            confidence = 0.98
            confidence_level = "HIGH"
        elif term_len >= 3:
            confidence = 0.92
            confidence_level = "HIGH"
        else:
            confidence = 0.85
            confidence_level = "MEDIUM"

        skill_obj = ExtractedSkill(
            name=canonical_name,
            raw_name=matched_str,
            category=category,
            confidence=confidence,
            confidence_level=confidence_level,
            source="text",
            start_index=first_match.start(),
            end_index=first_match.end(),
        )

        # Retain highest confidence if already detected under another alias
        if canonical_name in found_skills:
            if confidence > found_skills[canonical_name].confidence:
                found_skills[canonical_name] = skill_obj
        else:
            found_skills[canonical_name] = skill_obj

    # Sort results by confidence descending then name ascending
    results = sorted(found_skills.values(), key=lambda s: (-s.confidence, s.name))
    return results
