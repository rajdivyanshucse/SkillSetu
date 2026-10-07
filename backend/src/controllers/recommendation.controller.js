import recommendationService from '../services/recommendation.service.js';
import { ApiError } from '../utils/apiError.js';

export class RecommendationController {
  /**
   * Generates or refreshes recommendations for the authenticated user.
   */
  async generateRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw ApiError.unauthorized('Authentication required', 'AUTH_REQUIRED');
      }

      const result = await recommendationService.generateIndividualRecommendations(
        userId,
        req.body || {}
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves active recommendations for the authenticated user.
   */
  async getRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw ApiError.unauthorized('Authentication required', 'AUTH_REQUIRED');
      }

      const result = await recommendationService.getIndividualRecommendations(
        userId,
        req.query || {}
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves single recommendation by ID.
   */
  async getRecommendationById(req, res, next) {
    try {
      const userId = req.user?.id;
      const { recommendationId } = req.params;

      if (!userId) {
        throw ApiError.unauthorized('Authentication required', 'AUTH_REQUIRED');
      }

      const result = await recommendationService.getRecommendationById(
        userId,
        recommendationId
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates recommendation status.
   */
  async updateStatus(req, res, next) {
    try {
      const userId = req.user?.id;
      const { recommendationId } = req.params;
      const { status, notes } = req.body;

      if (!userId) {
        throw ApiError.unauthorized('Authentication required', 'AUTH_REQUIRED');
      }

      const result = await recommendationService.updateRecommendationStatus(
        userId,
        recommendationId,
        status,
        notes
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Dismisses a recommendation with reason.
   */
  async dismiss(req, res, next) {
    try {
      const userId = req.user?.id;
      const { recommendationId } = req.params;
      const { reason, notes } = req.body;

      if (!userId) {
        throw ApiError.unauthorized('Authentication required', 'AUTH_REQUIRED');
      }

      const result = await recommendationService.dismissRecommendation(
        userId,
        recommendationId,
        reason,
        notes
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Category specific endpoints
   */
  async getSkillRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('Authentication required');
      const result = await recommendationService.getSkillRecommendations(userId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCareerRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('Authentication required');
      const result = await recommendationService.getCareerRecommendations(userId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLearningRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('Authentication required');
      const result = await recommendationService.getLearningRecommendations(userId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProjectRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('Authentication required');
      const result = await recommendationService.getProjectRecommendations(userId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOpportunityRecommendations(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) throw ApiError.unauthorized('Authentication required');
      const result = await recommendationService.getOpportunityRecommendations(userId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const recommendationController = new RecommendationController();
export default recommendationController;
