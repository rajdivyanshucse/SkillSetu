import organizationRecommendationService from '../services/organizationRecommendation.service.js';
import { ApiError } from '../utils/apiError.js';

export class OrganizationRecommendationController {
  /**
   * Generates or refreshes recommendations for the authenticated organization.
   */
  async generateRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'ORG_CONTEXT_REQUIRED');
      }

      const result = await organizationRecommendationService.generateOrganizationRecommendations(
        orgId,
        req.body || {}
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves active recommendations for the organization.
   */
  async getRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'ORG_CONTEXT_REQUIRED');
      }

      const result = await organizationRecommendationService.getOrganizationRecommendations(
        orgId,
        req.query || {}
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves single organization recommendation by ID.
   */
  async getRecommendationById(req, res, next) {
    try {
      const orgId = req.organization?.id;
      const { id } = req.params;

      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'ORG_CONTEXT_REQUIRED');
      }

      const result = await organizationRecommendationService.getOrganizationRecommendationById(
        orgId,
        id
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
      const orgId = req.organization?.id;
      const { id } = req.params;
      const { status, notes } = req.body;

      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'ORG_CONTEXT_REQUIRED');
      }

      const result = await organizationRecommendationService.updateOrganizationRecommendationStatus(
        orgId,
        id,
        status,
        notes,
        req.user?.id
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Category specific organization getters
   */
  async getWorkforceRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) throw ApiError.badRequest('Organization context required');
      const result = await organizationRecommendationService.getOrganizationWorkforceRecommendations(orgId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSkillRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) throw ApiError.badRequest('Organization context required');
      const result = await organizationRecommendationService.getOrganizationSkillRecommendations(orgId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLearningRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) throw ApiError.badRequest('Organization context required');
      const result = await organizationRecommendationService.getOrganizationLearningRecommendations(orgId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFutureSkillRecommendations(req, res, next) {
    try {
      const orgId = req.organization?.id;
      if (!orgId) throw ApiError.badRequest('Organization context required');
      const result = await organizationRecommendationService.getOrganizationFutureSkillRecommendations(orgId, req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const organizationRecommendationController = new OrganizationRecommendationController();
export default organizationRecommendationController;
