import skillService from '../services/skill.service.js';
import embeddingService from '../services/embedding.service.js';
import ApiError from '../utils/apiError.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getCatalogSkills = async (req, res, next) => {
  try {
    const result = await skillService.getCatalogSkills(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skills catalog retrieved',
      data: { skills: result.skills },
      meta: { pagination: result.pagination },
    });
  } catch (error) {
    return next(error);
  }
};

export const getSkillById = async (req, res, next) => {
  try {
    const skill = await skillService.getSkillById(req.params.skillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill detail retrieved',
      data: { skill },
    });
  } catch (error) {
    return next(error);
  }
};

export const semanticSearchSkills = async (req, res, next) => {
  try {
    const q = req.query.q || req.query.query || '';
    const limit = Number.parseInt(req.query.limit || '10', 10);
    const minSimilarity = Number.parseFloat(req.query.minSimilarity || '0.60');
    const model = req.query.model || embeddingService.modelName;

    if (!q || !q.trim()) {
      return next(ApiError.unprocessableEntity('Search query parameter (q) is required'));
    }

    const results = await embeddingService.searchSimilarSkills(q, { limit, minSimilarity, model });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Semantic skills search completed',
      data: {
        query: q,
        modelUsed: model,
        mode: embeddingService.mode,
        results,
        count: results.length,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getCatalogSkills,
  getSkillById,
  semanticSearchSkills,
};
