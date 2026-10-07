import prisma from '../config/db.js';
import aiClient from './aiClient.service.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Correlates extracted skills with existing catalog Skill records in the database.
 * Does NOT mutate database records; only decorates response with catalog IDs.
 *
 * @param {Array<Object>} skills - List of extracted skill objects
 * @returns {Promise<Array<Object>>} Enriched skills with catalog IDs if present
 */
const enrichSkillsWithCatalog = async (skills = []) => {
  if (!skills || skills.length === 0) return [];

  // Fetch all active skills from catalog for lookup
  const catalogSkills = await prisma.skill.findMany({
    where: { isActive: true },
  });

  const catalogMap = new Map();
  for (const s of catalogSkills) {
    catalogMap.set(s.name.toLowerCase(), s);
    if (s.normalizedName) {
      catalogMap.set(s.normalizedName.toLowerCase(), s);
    }
  }

  return skills.map((s) => {
    const lookupKey = (s.name || '').toLowerCase();
    const matched = catalogMap.get(lookupKey);

    return {
      name: s.name,
      rawName: s.raw_name || s.rawName || s.name,
      category: matched?.category || s.category || 'General',
      confidence: s.confidence,
      confidenceLevel: s.confidence_level || s.confidenceLevel || 'HIGH',
      requirementType: s.requirement_type || s.requirementType || 'UNKNOWN',
      existsInCatalog: Boolean(matched),
      catalogSkillId: matched ? matched.id : null,
      source: s.source || 'text',
      contextSnippet: s.context_snippet || s.contextSnippet || null,
    };
  });
};

/**
 * Extracts and normalizes skills from free-form text.
 */
export const extractSkills = async ({ text, userId = null, accountType = null }) => {
  const result = await aiClient.post('/ai/v1/skills/extract', { text });
  const enrichedSkills = await enrichSkillsWithCatalog(result.skills || []);

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'AI_SKILL_EXTRACTION_REQUESTED',
      metadata: {
        totalExtracted: enrichedSkills.length,
        accountType,
      },
    });
  }

  return {
    skills: enrichedSkills,
    totalExtracted: enrichedSkills.length,
    processingMs: result.processing_ms || 0,
  };
};

/**
 * Analyzes resume text to extract skills, detected roles, and credentials signals.
 */
export const analyzeResume = async ({ text, userId = null }) => {
  const result = await aiClient.post('/ai/v1/resume/analyze', { text });
  const enrichedSkills = await enrichSkillsWithCatalog(result.skills || []);

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'AI_RESUME_ANALYSIS_REQUESTED',
      metadata: {
        totalExtractedSkills: enrichedSkills.length,
        totalRoles: (result.roles || []).length,
      },
    });
  }

  return {
    skills: enrichedSkills,
    roles: result.roles || [],
    experienceSignals: result.experienceSignals || [],
    educationSignals: result.educationSignals || [],
    summary: {
      skillsCount: enrichedSkills.length,
      rolesCount: (result.roles || []).length,
      experienceSignalsCount: (result.experienceSignals || []).length,
      educationSignalsCount: (result.educationSignals || []).length,
    },
  };
};

/**
 * Analyzes job description text to extract and categorize skills.
 */
export const analyzeJobDescription = async ({ text, organizationId = null, userId = null }) => {
  const result = await aiClient.post('/ai/v1/job-description/analyze', { text });

  const allSkills = await enrichSkillsWithCatalog(result.skills || []);
  const requiredSkills = allSkills.filter((s) => s.requirementType === 'REQUIRED');
  const preferredSkills = allSkills.filter((s) => s.requirementType === 'PREFERRED');
  const mentionedSkills = allSkills.filter(
    (s) => s.requirementType !== 'REQUIRED' && s.requirementType !== 'PREFERRED'
  );

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'AI_JOB_DESCRIPTION_ANALYSIS_REQUESTED',
      metadata: {
        organizationId,
        totalExtractedSkills: allSkills.length,
        requiredCount: requiredSkills.length,
        preferredCount: preferredSkills.length,
      },
    });
  }

  return {
    skills: allSkills,
    requiredSkills,
    preferredSkills,
    mentionedSkills,
    roles: result.roles || [],
    summary: {
      skillsCount: allSkills.length,
      requiredCount: requiredSkills.length,
      preferredCount: preferredSkills.length,
      mentionedCount: mentionedSkills.length,
      rolesCount: (result.roles || []).length,
    },
  };
};

/**
 * Checks AI microservice health status.
 */
export const getAiStatus = async () => {
  try {
    const health = await aiClient.checkHealth();
    return {
      isAvailable: true,
      service: health.service || 'skillsetu-ai',
      status: health.status || 'healthy',
      version: health.version || '1.0.0',
    };
  } catch (error) {
    return {
      isAvailable: false,
      service: 'skillsetu-ai',
      status: 'offline',
      error: error.message,
    };
  }
};

export default {
  extractSkills,
  analyzeResume,
  analyzeJobDescription,
  getAiStatus,
};
