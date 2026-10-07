"""
Hybrid lexical, multilingual taxonomy alias, and dense vector semantic skill matching service.
Preserves explainability, language detection, and strict priority order.
"""

from typing import List, Dict, Any, Set, Optional
from app.services.skill_normalizer import skill_normalizer, CANONICAL_SKILLS, SYNONYM_MAP
from app.services.embedding_service import embedding_service
from app.services.language_detector import detect_language
from app.schemas.semantic import SkillMatchItem, SkillMatchResponse
from app.config import settings


class SemanticSkillMatcher:
    """Service providing hybrid lexical, normalized multilingual taxonomy, and vector semantic skill matching."""

    def __init__(self):
        self.normalizer = skill_normalizer
        self.embedding_service = embedding_service

    def match_skills(
        self,
        source_skills: List[str],
        candidate_skills: List[str],
        model_name: Optional[str] = None
    ) -> SkillMatchResponse:
        """
        Execute hybrid skill matching in strict priority order:
        1. Exact character matches
        2. Normalized canonical alias matches
        3. Cross-language official alias matches (Hindi, German, French, Spanish, ESCO)
        4. Dense multilingual semantic embedding similarity matches
        """
        matches: List[SkillMatchItem] = []
        matched_source_indices: Set[int] = set()
        matched_candidate_indices: Set[int] = set()

        active_model = model_name or settings.embedding_model_name

        # Pre-detect languages
        source_lang_meta = [detect_language(s) for s in source_skills]
        cand_lang_meta = [detect_language(c) for c in candidate_skills]

        # Step 1: Check Exact Matches
        for s_idx, s_skill in enumerate(source_skills):
            s_clean = s_skill.strip().lower()
            s_lang = source_lang_meta[s_idx]["language"]

            for c_idx, c_skill in enumerate(candidate_skills):
                if c_idx in matched_candidate_indices:
                    continue
                c_clean = c_skill.strip().lower()
                if s_clean == c_clean:
                    canonical, _, _ = self.normalizer.normalize_with_metadata(s_skill)
                    matches.append(SkillMatchItem(
                        source=s_skill,
                        candidate=c_skill,
                        matchType="EXACT",
                        similarity=1.0,
                        thresholdCategory="HIGH",
                        reason="Exact character match",
                        inputLanguage=s_lang,
                        canonicalSkill=canonical or s_skill,
                        evidence={
                            "matchLayer": "EXACT_STRING",
                            "source": "DIRECT_INPUT",
                            "language": s_lang,
                        }
                    ))
                    matched_source_indices.add(s_idx)
                    matched_candidate_indices.add(c_idx)
                    break

        # Step 2: Check Normalized & Cross-Language Alias Matches
        for s_idx, s_skill in enumerate(source_skills):
            if s_idx in matched_source_indices:
                continue

            s_norm, s_cat, s_known = self.normalizer.normalize_with_metadata(s_skill)
            s_norm_lower = s_norm.lower()
            s_lang = source_lang_meta[s_idx]["language"]

            for c_idx, c_skill in enumerate(candidate_skills):
                if c_idx in matched_candidate_indices:
                    continue

                c_norm, _, _ = self.normalizer.normalize_with_metadata(c_skill)
                c_norm_lower = c_norm.lower()
                c_lang = cand_lang_meta[c_idx]["language"]

                if s_norm_lower == c_norm_lower and s_known:
                    is_cross_lang = (
                        source_lang_meta[s_idx]["isMultilingual"]
                        or cand_lang_meta[c_idx]["isMultilingual"]
                        or s_lang != "en"
                        or c_lang != "en"
                        or s_lang != c_lang
                    )
                    match_type = "CROSS_LANGUAGE_ALIAS" if is_cross_lang else "NORMALIZED"
                    lang_label = s_lang if s_lang != "en" else c_lang
                    reason = (
                        f"Cross-language official alias ({lang_label} -> {s_norm})"
                        if is_cross_lang
                        else "Canonical taxonomy alias"
                    )

                    matches.append(SkillMatchItem(
                        source=s_skill,
                        candidate=c_skill,
                        matchType=match_type,
                        similarity=1.0,
                        thresholdCategory="HIGH",
                        reason=reason,
                        inputLanguage=s_lang,
                        canonicalSkill=s_norm,
                        evidence={
                            "matchLayer": match_type,
                            "source": "ESCO_TAXONOMY_ALIAS" if is_cross_lang else "CANONICAL_SYNONYM",
                            "matchedLabel": s_norm,
                            "sourceLanguage": s_lang,
                            "candidateLanguage": c_lang,
                        }
                    ))
                    matched_source_indices.add(s_idx)
                    matched_candidate_indices.add(c_idx)
                    break

        # Step 3: Check Dense Multilingual Semantic Similarity for Remaining Skills
        unmatched_source_pairs = [(idx, skill) for idx, skill in enumerate(source_skills) if idx not in matched_source_indices]
        unmatched_cand_pairs = [(idx, skill) for idx, skill in enumerate(candidate_skills) if idx not in matched_candidate_indices]

        if unmatched_source_pairs and unmatched_cand_pairs:
            source_texts = [p[1] for p in unmatched_source_pairs]
            cand_texts = [p[1] for p in unmatched_cand_pairs]

            source_vectors = self.embedding_service.generate_embeddings(source_texts, model_name=active_model)
            cand_vectors = self.embedding_service.generate_embeddings(cand_texts, model_name=active_model)

            for s_local_idx, (s_orig_idx, s_skill) in enumerate(unmatched_source_pairs):
                s_vec = source_vectors[s_local_idx]
                s_lang = source_lang_meta[s_orig_idx]["language"]
                best_sim = 0.0
                best_cand_local_idx = -1

                for c_local_idx, (c_orig_idx, c_skill) in enumerate(unmatched_cand_pairs):
                    if c_orig_idx in matched_candidate_indices:
                        continue
                    c_vec = cand_vectors[c_local_idx]
                    sim = self.embedding_service.compute_cosine_similarity(s_vec, c_vec)
                    if sim > best_sim:
                        best_sim = sim
                        best_cand_local_idx = c_local_idx

                if best_cand_local_idx != -1 and self.embedding_service.is_match(best_sim):
                    c_orig_idx, c_skill = unmatched_cand_pairs[best_cand_local_idx]
                    c_lang = cand_lang_meta[c_orig_idx]["language"]
                    category = self.embedding_service.classify_similarity(best_sim)
                    canonical, _, _ = self.normalizer.normalize_with_metadata(c_skill)

                    matches.append(SkillMatchItem(
                        source=s_skill,
                        candidate=c_skill,
                        matchType="SEMANTIC",
                        similarity=best_sim,
                        thresholdCategory=category,
                        reason=f"Multilingual semantic similarity ({best_sim}) above threshold (0.60)",
                        inputLanguage=s_lang,
                        canonicalSkill=canonical or c_skill,
                        evidence={
                            "matchLayer": "SEMANTIC_VECTOR",
                            "source": "MULTILINGUAL_EMBEDDING",
                            "model": active_model,
                            "similarityScore": best_sim,
                            "sourceLanguage": s_lang,
                            "candidateLanguage": c_lang,
                        }
                    ))
                    matched_source_indices.add(s_orig_idx)
                    matched_candidate_indices.add(c_orig_idx)

        # Collect unmatched skills
        unmatched_sources = [s for idx, s in enumerate(source_skills) if idx not in matched_source_indices]
        unmatched_cands = [c for idx, c in enumerate(candidate_skills) if idx not in matched_candidate_indices]

        match_rate = len(matched_source_indices) / len(source_skills) if source_skills else 0.0

        return SkillMatchResponse(
            success=True,
            matches=matches,
            unmatchedSourceSkills=unmatched_sources,
            unmatchedCandidateSkills=unmatched_cands,
            matchRate=round(match_rate, 4),
            modelUsed=active_model,
            embeddingMode=settings.embedding_mode,
        )


semantic_skill_matcher = SemanticSkillMatcher()
