import re
from typing import List


def clean_text(text: str) -> str:
    """Normalize whitespace and control characters without corrupting meaningful punctuation."""
    if not text:
        return ""
    # Replace multiple whitespace/newlines with single space
    cleaned = re.sub(r"[\r\n\t]+", " ", text)
    cleaned = re.sub(r" +", " ", cleaned)
    return cleaned.strip()


def split_sentences(text: str) -> List[str]:
    """Split text into sentences or bullet points for granular context analysis."""
    if not text:
        return []
    # Split on line breaks, bullet points, and sentence terminators
    raw_segments = re.split(r"[\n\r•\-\*]+|(?<=[.!?])\s+", text)
    return [s.strip() for s in raw_segments if s and len(s.strip()) > 1]


def escape_skill_regex(skill: str) -> str:
    """Escape special characters in skill name while maintaining boundary rules for symbols like +, #, ."""
    # Special care for C++, C#, .NET, Node.js, React.js
    escaped = re.escape(skill)
    return escaped
