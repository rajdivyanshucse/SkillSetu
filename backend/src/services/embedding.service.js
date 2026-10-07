import prisma from '../config/db.js';
import aiClient from './aiClient.service.js';
import env from '../config/env.js';
import ApiError from '../utils/apiError.js';
import logger from '../utils/logger.js';

export const ENGLISH_MODEL = 'all-MiniLM-L6-v2';
export const MULTILINGUAL_MODEL = 'paraphrase-multilingual-MiniLM-L12-v2';
export const EMBEDDING_DIMENSION = 384;

/**
 * Helper to compute cosine similarity between two numeric arrays in JavaScript.
 */
export function computeJsCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) return 0.0;
  let dot = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0.0;
  const cos = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  const clamped = Math.max(-1.0, Math.min(1.0, cos));
  const sim = (clamped + 1.0) / 2.0 < 0 ? 0.0 : clamped;
  return Math.round(sim * 10000) / 10000;
}

export function classifyThreshold(similarity) {
  if (similarity >= 0.85) return 'HIGH';
  if (similarity >= 0.70) return 'MODERATE';
  if (similarity >= 0.60) return 'WEAK';
  return 'NONE';
}

class EmbeddingService {
  constructor() {
    this.mode = env.embedding?.mode || 'MULTILINGUAL';
    this.englishModel = env.embedding?.englishModel || ENGLISH_MODEL;
    this.multilingualModel = env.embedding?.multilingualModel || MULTILINGUAL_MODEL;
    this.modelName = this.mode === 'ENGLISH' ? this.englishModel : this.multilingualModel;
    this.dimension = env.embedding?.dimension || EMBEDDING_DIMENSION;
    this.supportedLanguages = env.embedding?.supportedLanguages || ['en', 'hi', 'de', 'fr', 'es', 'pa'];
    this.testedLanguages = env.embedding?.testedLanguages || ['en', 'hi', 'de', 'fr', 'es'];

    this.reindexState = {
      status: 'IDLE', // IDLE, RUNNING, COMPLETED, FAILED
      lastReindexStartedAt: null,
      lastReindexCompletedAt: null,
      lastReindexStats: null,
      lastError: null,
    };
  }

  /**
   * Sets active embedding mode ('ENGLISH' | 'MULTILINGUAL') with rollback capability.
   */
  async setModelMode(mode) {
    const cleanMode = String(mode).toUpperCase();
    if (cleanMode !== 'ENGLISH' && cleanMode !== 'MULTILINGUAL') {
      throw ApiError.badRequest(`Invalid embedding mode: ${mode}. Supported modes: ENGLISH, MULTILINGUAL`);
    }
    this.mode = cleanMode;
    this.modelName = cleanMode === 'ENGLISH' ? this.englishModel : this.multilingualModel;
    logger.info(`[EmbeddingService] Switched semantic mode to ${cleanMode} (Model: ${this.modelName})`);
    return await this.getModelStatus();
  }

  /**
   * Sets active model directly.
   */
  async setModel(modelName) {
    if (!modelName || typeof modelName !== 'string') {
      throw ApiError.badRequest('Model name must be a non-empty string');
    }
    this.modelName = modelName;
    if (modelName === this.englishModel) {
      this.mode = 'ENGLISH';
    } else {
      this.mode = 'MULTILINGUAL';
    }
    return await this.getModelStatus();
  }

  /**
   * Returns current embedding service status and diagnostics.
   */
  async getModelStatus() {
    let englishIndexedCount = 0;
    let multilingualIndexedCount = 0;

    try {
      englishIndexedCount = await prisma.skillEmbedding.count({
        where: { model: this.englishModel },
      });
      multilingualIndexedCount = await prisma.skillEmbedding.count({
        where: { model: this.multilingualModel },
      });
    } catch {
      // Fallback
    }

    return {
      activeModel: this.modelName,
      mode: this.mode,
      dimension: this.dimension,
      englishModel: this.englishModel,
      multilingualModel: this.multilingualModel,
      supportedLanguages: this.supportedLanguages,
      testedLanguages: this.testedLanguages,
      indexedCounts: {
        englishModel: englishIndexedCount,
        multilingualModel: multilingualIndexedCount,
        activeModel: this.modelName === this.englishModel ? englishIndexedCount : multilingualIndexedCount,
      },
      reindex: this.reindexState,
    };
  }

  /**
   * Builds canonical embedding input text from skill metadata and attached ESCO multilingual mappings.
   */
  generateCanonicalSkillText(skill, mappings = []) {
    if (!skill || !skill.name) return '';
    const parts = [`${skill.name.trim()}.`];
    if (skill.category) {
      parts.push(`Category: ${skill.category.trim()}.`);
    }
    if (skill.description) {
      parts.push(`Description: ${skill.description.trim()}`);
    }

    // Attach official ESCO multilingual alias evidence if available
    if (Array.isArray(mappings) && mappings.length > 0) {
      const labels = [];
      for (const m of mappings) {
        if (m.preferredLabel && m.preferredLabel !== skill.name) labels.push(m.preferredLabel);
        if (Array.isArray(m.altLabels)) {
          for (const al of m.altLabels) {
            if (al && !labels.includes(al)) labels.push(al);
          }
        }
      }
      if (labels.length > 0) {
        parts.push(`Multilingual aliases: ${labels.slice(0, 10).join(', ')}.`);
      }
    }

    return parts.join(' ');
  }

  /**
   * Builds canonical embedding input text for Role matching.
   */
  generateCanonicalRoleText(role, mappings = []) {
    if (!role || !role.name) return '';
    const parts = [`${role.name.trim()}.`];
    if (role.category) {
      parts.push(`Category: ${role.category.trim()}.`);
    }
    if (role.description) {
      parts.push(`Description: ${role.description.trim()}`);
    }

    if (Array.isArray(mappings) && mappings.length > 0) {
      const labels = [];
      for (const m of mappings) {
        if (m.preferredLabel && m.preferredLabel !== role.name) labels.push(m.preferredLabel);
        if (Array.isArray(m.altLabels)) {
          for (const al of m.altLabels) {
            if (al && !labels.includes(al)) labels.push(al);
          }
        }
      }
      if (labels.length > 0) {
        parts.push(`Multilingual titles: ${labels.slice(0, 10).join(', ')}.`);
      }
    }

    return parts.join(' ');
  }

  /**
   * Requests dense vector embeddings from Python AI service and strictly validates outputs.
   */
  async requestEmbeddings(texts, modelName = this.modelName) {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw ApiError.unprocessableEntity('Texts array must be a non-empty list');
    }

    const payload = {
      texts,
      model: modelName,
      normalize: true,
    };

    const response = await aiClient.post('/ai/v1/embeddings/generate', payload);

    if (!response || !response.success || !Array.isArray(response.embeddings)) {
      throw ApiError.badGateway('AI service returned invalid embedding response structure');
    }

    // Validate vector dimensions, numericality, and no NaN/Infinity
    const validatedVectors = [];
    for (const item of response.embeddings) {
      if (!item || !Array.isArray(item.vector)) {
        throw ApiError.badGateway('Malformed vector received from AI service');
      }
      if (item.vector.length !== this.dimension) {
        throw ApiError.badGateway(
          `AI service returned vector dimension ${item.vector.length}, expected ${this.dimension}`
        );
      }
      for (const val of item.vector) {
        if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
          throw ApiError.badGateway('Vector contains invalid non-numeric or NaN/Infinity values');
        }
      }
      validatedVectors.push(item.vector);
    }

    return validatedVectors;
  }

  /**
   * Reindexes skill taxonomy embeddings in batches. Zero-downtime and model-isolated.
   */
  async reindexAllSkills({ force = false, batchSize = 32, model = this.modelName } = {}) {
    if (this.reindexState.status === 'RUNNING') {
      throw ApiError.conflict('A skill embedding reindex job is already currently running');
    }

    this.reindexState = {
      status: 'RUNNING',
      lastReindexStartedAt: new Date().toISOString(),
      lastReindexCompletedAt: null,
      lastReindexStats: null,
      lastError: null,
    };

    try {
      const allSkills = await prisma.skill.findMany({
        where: { isActive: true },
      });

      // Fetch any attached taxonomy mappings for enrichment
      const taxonomyMappings = await prisma.externalTaxonomyMapping.findMany({
        where: { internalEntityType: 'SKILL' },
      });

      const mappingBySkillId = new Map();
      for (const m of taxonomyMappings) {
        if (!mappingBySkillId.has(m.internalEntityId)) {
          mappingBySkillId.set(m.internalEntityId, []);
        }
        mappingBySkillId.get(m.internalEntityId).push(m);
      }

      let processed = 0;
      let created = 0;
      let updated = 0;
      let skipped = 0;
      let failed = 0;

      // Determine which skills need embedding
      const skillsToProcess = [];
      for (const skill of allSkills) {
        if (force) {
          skillsToProcess.push(skill);
        } else {
          const existing = await prisma.skillEmbedding.findUnique({
            where: {
              skillId_model: {
                skillId: skill.id,
                model,
              },
            },
          });
          if (existing && Array.isArray(existing.embedding) && existing.embedding.length === this.dimension) {
            skipped++;
          } else {
            skillsToProcess.push(skill);
          }
        }
      }

      // Process in batches
      for (let i = 0; i < skillsToProcess.length; i += batchSize) {
        const batch = skillsToProcess.slice(i, i + batchSize);
        const batchTexts = batch.map((s) =>
          this.generateCanonicalSkillText(s, mappingBySkillId.get(s.id) || [])
        );

        try {
          const vectors = await this.requestEmbeddings(batchTexts, model);

          for (let j = 0; j < batch.length; j++) {
            const skill = batch[j];
            const vector = vectors[j];

            const existing = await prisma.skillEmbedding.findUnique({
              where: {
                skillId_model: {
                  skillId: skill.id,
                  model,
                },
              },
            });

            await prisma.skillEmbedding.upsert({
              where: {
                skillId_model: {
                  skillId: skill.id,
                  model,
                },
              },
              update: {
                dimension: this.dimension,
                embedding: vector,
              },
              create: {
                skillId: skill.id,
                model,
                dimension: this.dimension,
                embedding: vector,
              },
            });

            if (existing) {
              updated++;
            } else {
              created++;
            }
            processed++;
          }
        } catch (err) {
          logger.error(`Failed to embed batch of skills: ${err.message}`);
          failed += batch.length;
        }
      }

      const totalIndexed = await prisma.skillEmbedding.count({
        where: { model },
      });

      const stats = {
        processed,
        created,
        updated,
        skipped,
        failed,
        totalSkills: allSkills.length,
        totalIndexed,
        model,
        dimension: this.dimension,
      };

      this.reindexState = {
        status: 'COMPLETED',
        lastReindexStartedAt: this.reindexState.lastReindexStartedAt,
        lastReindexCompletedAt: new Date().toISOString(),
        lastReindexStats: stats,
        lastError: null,
      };

      return stats;
    } catch (error) {
      this.reindexState = {
        status: 'FAILED',
        lastReindexStartedAt: this.reindexState.lastReindexStartedAt,
        lastReindexCompletedAt: new Date().toISOString(),
        lastReindexStats: null,
        lastError: error.message,
      };
      throw error;
    }
  }

  /**
   * Validates a vector for correct dimension and no NaN/Infinity values.
   */
  validateVector(vector, expectedDim = this.dimension) {
    if (!Array.isArray(vector) || vector.length !== expectedDim) {
      return false;
    }
    for (const val of vector) {
      if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Upserts a single skill embedding.
   */
  async upsertSkillEmbedding(skillId, vector, model = this.modelName, dimension = this.dimension) {
    if (!this.validateVector(vector, dimension)) {
      throw ApiError.badGateway('Cannot persist invalid vector');
    }

    return prisma.skillEmbedding.upsert({
      where: {
        skillId_model: {
          skillId,
          model,
        },
      },
      update: {
        dimension,
        embedding: vector,
      },
      create: {
        skillId,
        model,
        dimension,
        embedding: vector,
      },
    });
  }

  /**
   * Executes semantic skill search against stored skill embeddings for the active model space.
   */
  async searchSimilarSkills(queryText, { limit = 10, minSimilarity = 0.60, model = this.modelName } = {}) {
    if (!queryText || !queryText.trim()) {
      throw ApiError.unprocessableEntity('Search query cannot be empty');
    }

    const cleanQuery = queryText.trim();

    // 1. Generate embedding for search query in the active model space
    const [queryVector] = await this.requestEmbeddings([cleanQuery], model);

    // 2. Fetch all stored embeddings for target model
    const storedEmbeddings = await prisma.skillEmbedding.findMany({
      where: { model },
      include: { skill: true },
    });

    const results = [];

    // 3. Compute cosine similarity against stored catalog embeddings if available
    if (storedEmbeddings.length > 0) {
      for (const item of storedEmbeddings) {
        if (!item.skill || !item.embedding || !Array.isArray(item.embedding)) continue;
        const sim = computeJsCosineSimilarity(queryVector, item.embedding);
        if (sim >= minSimilarity) {
          results.push({
            skillId: item.skill.id,
            name: item.skill.name,
            category: item.skill.category,
            description: item.skill.description,
            similarity: sim,
            thresholdCategory: classifyThreshold(sim),
            matchType: sim >= 0.99 ? 'EXACT' : 'SEMANTIC',
            modelUsed: model,
          });
        }
      }
    } else {
      // Dynamic fallback against active catalog skills
      const allSkills = await prisma.skill.findMany({ where: { isActive: true } });
      if (allSkills.length > 0) {
        try {
          const matchResponse = await this.matchSemanticSkills(
            [cleanQuery],
            allSkills.map((s) => s.name),
            { model }
          );

          if (matchResponse?.matches && matchResponse.matches.length > 0) {
            for (const match of matchResponse.matches) {
              const matchedSkill = allSkills.find(
                (s) => s.name.toLowerCase() === match.candidate.toLowerCase()
              );
              if (matchedSkill && match.similarity >= minSimilarity) {
                results.push({
                  skillId: matchedSkill.id,
                  name: matchedSkill.name,
                  category: matchedSkill.category,
                  description: matchedSkill.description,
                  similarity: match.similarity,
                  thresholdCategory: match.thresholdCategory || classifyThreshold(match.similarity),
                  matchType: match.matchType || 'SEMANTIC',
                  inputLanguage: match.inputLanguage,
                  evidence: match.evidence,
                  modelUsed: model,
                });
              }
            }
          }
        } catch {
          // Fallback to text matching
          const lowerQ = cleanQuery.toLowerCase();
          for (const s of allSkills) {
            if (s.name.toLowerCase().includes(lowerQ)) {
              results.push({
                skillId: s.id,
                name: s.name,
                category: s.category,
                description: s.description,
                similarity: 1.0,
                thresholdCategory: 'HIGH',
                matchType: 'EXACT',
                modelUsed: model,
              });
            }
          }
        }
      }
    }

    // Sort descending by similarity
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  /**
   * Executes semantic role search against catalog roles.
   */
  async searchSimilarRoles(queryText, { limit = 10, minSimilarity = 0.60, model = this.modelName } = {}) {
    if (!queryText || !queryText.trim()) {
      throw ApiError.unprocessableEntity('Search query cannot be empty');
    }

    const cleanQuery = queryText.trim();
    const [queryVector] = await this.requestEmbeddings([cleanQuery], model);

    const roles = await prisma.role.findMany({
      where: { isActive: true },
    });

    const roleTexts = roles.map((r) => this.generateCanonicalRoleText(r));
    if (roleTexts.length === 0) return [];

    const roleVectors = await this.requestEmbeddings(roleTexts, model);

    const results = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const vec = roleVectors[i];
      const sim = computeJsCosineSimilarity(queryVector, vec);
      if (sim >= minSimilarity) {
        results.push({
          roleId: role.id,
          name: role.name,
          category: role.category,
          description: role.description,
          experienceLevel: role.experienceLevel,
          similarity: sim,
          thresholdCategory: classifyThreshold(sim),
          matchType: sim >= 0.99 ? 'EXACT' : 'SEMANTIC',
        });
      }
    }

    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  /**
   * Hybrid skill matching between source requirements and candidate skills.
   */
  async matchSkillSets(sourceSkills, candidateSkills, { model = this.modelName } = {}) {
    if (!Array.isArray(sourceSkills) || !Array.isArray(candidateSkills)) {
      throw ApiError.unprocessableEntity('sourceSkills and candidateSkills must be arrays');
    }

    const payload = {
      sourceSkills,
      candidateSkills,
      model,
    };

    const response = await aiClient.post('/ai/v1/semantic/skills/match', payload);
    return response;
  }

  /**
   * Alias for matchSkillSets
   */
  async matchSemanticSkills(sourceSkills, candidateSkills, options = {}) {
    return this.matchSkillSets(sourceSkills, candidateSkills, options);
  }

  /**
   * Semantic similarity comparison between a source text and multiple candidate texts.
   */
  async compareSemanticSimilarity(sourceText, candidateTexts, { model = this.modelName } = {}) {
    if (!sourceText || !Array.isArray(candidateTexts)) {
      throw ApiError.unprocessableEntity('sourceText and candidateTexts are required');
    }

    const payload = {
      sourceText,
      candidateTexts,
      model,
    };

    const response = await aiClient.post('/ai/v1/semantic/similarity', payload);
    return response;
  }
}

export const embeddingService = new EmbeddingService();
export default embeddingService;
