"""
Resume Text Analysis Service.
Extracts structured skills, role signals, experience signals, and education references.
"""

import re
from typing import List
from app.schemas.resume import (
    ResumeAnalyzeResponse,
    RoleSignal,
    ExperienceSignal,
    EducationSignal,
)
from app.services.skill_extractor import extract_skills_from_text

# Common engineering and tech role patterns
ROLE_PATTERNS = [
    r"\b(?:Senior|Lead|Staff|Principal|Junior|Mid-Level)?\s*(?:Software|Full\s*Stack|Backend|Frontend|DevOps|Cloud|Data|ML|AI|Systems|Platform|Security|QA|Site\s*Reliability)\s*(?:Engineer|Developer|Architect|Specialist|Manager)\b",
    r"\b(?:Data\s*Scientist|Product\s*Manager|Engineering\s*Manager|Tech\s*Lead|Scrum\s*Master)\b",
]
COMPILED_ROLES = [re.compile(p, re.IGNORECASE) for p in ROLE_PATTERNS]

# Degree signals
DEGREE_PATTERNS = [
    r"\b(?:B\.?Tech|B\.?E\.?|B\.?S\.?|Bachelor(?:'s)?(?:\s*of\s*Science)?|M\.?Tech|M\.?S\.?|Master(?:'s)?|Ph\.?D|Diploma)\b[^\n,.]*",
]
COMPILED_DEGREES = [re.compile(p, re.IGNORECASE) for p in DEGREE_PATTERNS]


def analyze_resume_text(text: str) -> ResumeAnalyzeResponse:
    """
    Performs deterministic NLP extraction on raw resume text.
    Extracts skills, role signals, and educational markers.
    """
    if not text or not text.strip():
        return ResumeAnalyzeResponse(
            success=True,
            skills=[],
            roles=[],
            experienceSignals=[],
            educationSignals=[],
            summary={"skillsCount": 0, "rolesCount": 0},
        )

    # 1. Extract Skills
    skills = extract_skills_from_text(text)

    # 2. Extract Role Signals
    detected_roles: List[RoleSignal] = []
    seen_roles = set()

    for pattern in COMPILED_ROLES:
        for match in pattern.finditer(text):
            role_text = match.group(0).strip()
            # Normalize casing
            norm_role = " ".join([w.capitalize() for w in role_text.split()])
            if norm_role.lower() not in seen_roles:
                seen_roles.add(norm_role.lower())
                detected_roles.append(
                    RoleSignal(
                        title=norm_role,
                        confidence=0.90,
                        source="text",
                    )
                )

    # 3. Extract Education Signals
    education_signals: List[EducationSignal] = []
    for pattern in COMPILED_DEGREES:
        for match in pattern.finditer(text):
            deg_text = match.group(0).strip()
            if len(deg_text) > 2:
                education_signals.append(
                    EducationSignal(
                        degree=deg_text,
                        raw_text=deg_text,
                    )
                )

    # 4. Extract Experience Signals (Years of Experience pattern, e.g. "5+ years of experience")
    experience_signals: List[ExperienceSignal] = []
    yoe_match = re.search(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:experience|exp)", text, re.IGNORECASE)
    if yoe_match:
        try:
            years = float(yoe_match.group(1))
            experience_signals.append(
                ExperienceSignal(
                    years_estimate=years,
                    raw_text=yoe_match.group(0),
                )
            )
        except ValueError:
            pass

    summary = {
        "skillsCount": len(skills),
        "rolesCount": len(detected_roles),
        "educationSignalsCount": len(education_signals),
        "experienceSignalsCount": len(experience_signals),
    }

    return ResumeAnalyzeResponse(
        success=True,
        skills=skills,
        roles=detected_roles,
        experienceSignals=experience_signals,
        educationSignals=education_signals,
        summary=summary,
    )
