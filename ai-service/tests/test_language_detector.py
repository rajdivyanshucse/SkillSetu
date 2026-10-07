"""Unit tests for lightweight language detection."""

import pytest
from app.services.language_detector import detect_language


def test_detect_english():
    res = detect_language("Software development and cloud architecture")
    assert res["language"] == "en"
    assert res["script"] == "Latin"
    assert res["isMultilingual"] is False


def test_detect_hindi_devanagari():
    res = detect_language("मशीन लर्निंग और सॉफ्टवेयर विकास")
    assert res["language"] == "hi"
    assert res["script"] == "Devanagari"
    assert res["isMultilingual"] is True


def test_detect_punjabi_gurmukhi():
    res = detect_language("ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਅਤੇ ਡਾਟਾ ਵਿਸ਼ਲੇਸ਼ਣ")
    assert res["language"] == "pa"
    assert res["script"] == "Gurmukhi"
    assert res["isMultilingual"] is True


def test_detect_german():
    res = detect_language("Softwareentwicklung und Datenanalyse für Maschinelles Lernen")
    assert res["language"] == "de"
    assert res["isMultilingual"] is True


def test_detect_french():
    res = detect_language("Développement logiciel et analyse de données")
    assert res["language"] == "fr"
    assert res["isMultilingual"] is True


def test_detect_spanish():
    res = detect_language("Desarrollo de software y análisis de datos")
    assert res["language"] == "es"
    assert res["isMultilingual"] is True


def test_detect_hinglish():
    res = detect_language("mujhe backend development aur database design seekhna hai")
    assert res["language"] == "hi"
    assert res.get("subType") == "Hinglish" or res["script"] == "Latin"
    assert res["isMultilingual"] is True


def test_detect_empty_unknown():
    res = detect_language("")
    assert res["language"] == "unknown"
    assert res["confidence"] == 0.0
