"""
Job Description Analysis Service.
Analyzes job descriptions, classifying extracted skills into REQUIRED, PREFERRED, and MENTIONED/UNKNOWN.
"""

import re
from typing import List, Dict, Tuple
from app.schemas.job_description import (
    JobDescriptionAnalyzeResponse,
    JobDescriptionSkill,
)
from app.schemas.resume import RoleSignal
from app.services.skill_extractor import extract_skills_from_text
from app.services.resume_analyzer import COMPILED_ROLES
from app.utils.text_processing import split_sentences

# Contextual signals for requirement classification
REQUIRED_INDICATORS = [
    r"\brequired\b",
    r"\brequirements?\b",
    r"\bmust\s*have\b",
    r"\bessential\b",
    r"\bcore\s*requirements?\b",
    r"\bqualifications?\b",
    r"\bminimum\b",
    r"\bstrong\s*experience\s*with\b",
    r"\bproficiency\s*in\b",
    r"\bproven\s*experience\b",
]
COMPILED_REQUIRED = [re.compile(p, re.IGNORECASE) for p in REQUIRED_INDICATORS]

PREFERRED_INDICATORS = [
    r"\bpreferred\b",
    r"\bnice\s*to\s*have\b",
    r"\bplus\b",
    r"\bbonus\b",
    r"\bdesirable\b",
    r"\bgood\s*to\s*have\b",
    r"\boptional\b",
    r"\badvantageous\b",
]
COMPILED_PREFERRED = [re.compile(p, re.IGNORECASE) for p in PREFERRED_INDICATORS]


def _classify_skill_context(skill_name: str, raw_name: str, sentences: List[str]) -> Tuple[str, str]:
    """
    Classifies a skill as REQUIRED, PREFERRED, MENTIONED, or UNKNOWN based on surrounding sentence context.
    """
    escaped_raw = re.escape(raw_name)
    pattern = re.compile(rf"\b{escaped_raw}\b", re.IGNORECASE)

    for sentence in sentences:
        if pattern.search(sentence):
            # Check if sentence contains preferred indicators
            if any(p.search(sentence) for p in COMPILED_PREFERRED):
                return ("PREFERRED", sentence[:150])

            # Check if sentence contains required indicators
            if any(r.search(sentence) for r in COMPILED_REQUIRED):
                return ("REQUIRED", sentence[:150])

    # Default to MENTIONED when found in body without clear requirement headers
    return ("MENTIONED", "")


def analyze_job_description_text(text: str) -> JobDescriptionAnalyzeResponse:
    """
    Analyzes job description text to extract skills and classify requirement type.
    """
    if not text or not text.strip():
        return JobDescriptionAnalyzeResponse(
            success=True,
            skills=[],
            required_skills=[],
            preferred_skills=[],
            mentioned_skills=[],
            roles=[],
            summary={"skillsCount": 0, "requiredCount": 0, "preferredCount": 0},
        )

    # 1. Extract raw skills
    extracted_skills = extract_skills_from_text(text)
    sentences = split_sentences(text)

    jd_skills: List[JobDescriptionSkill] = []
    required_skills: List[JobDescriptionSkill] = []
    preferred_skills: List[JobDescriptionSkill] = []
    mentioned_skills: List[JobDescriptionSkill] = []

    for s in extracted_skills:
        req_type, context = _classify_skill_context(s.name, s.raw_name, sentences)

        item = JobDescriptionSkill(
            name=s.name,
            raw_name=s.raw_name,
            category=s.category,
            confidence=s.confidence,
            confidence_level=s.confidence_level,
            requirement_type=req_type,
            source="text",
            context_snippet=context if context else None,
        )

        jd_skills.append(item)
        if req_type == "REQUIRED":
            required_skills.append(item)
        elif req_type == "PREFERRED":
            preferred_skills.append(item)
        else:
            mentioned_skills.append(item)

    # 2. Extract Role Signals
    detected_roles: List[RoleSignal] = []
    seen_roles = set()

    for pattern in COMPILED_ROLES:
        for match in pattern.finditer(text):
            role_text = match.group(0).strip()
            norm_role = " ".join([w.capitalize() for w in role_text.split()])
            if norm_role.lower() not in seen_roles:
                seen_roles.add(norm_role.lower())
                detected_roles.append(
                    RoleSignal(
                        title=norm_role,
                        confidence=0.92,
                        source="text",
                    )
                )

    summary = {
        "skillsCount": len(jd_skills),
        "requiredCount": len(required_skills),
        "preferredCount": len(preferred_skills),
        "mentionedCount": len(mentioned_skills),
        "rolesCount": len(detected_roles),
    }

    return JobDescriptionAnalyzeResponse(
        success=True,
        skills=jd_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        mentioned_skills=mentioned_skills,
        roles=detected_roles,
        summary=summary,
    )
