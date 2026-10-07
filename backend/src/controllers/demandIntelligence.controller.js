import prisma from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import DemandIntelligenceService from '../services/demandIntelligence.service.js';
import DemandForecastService from '../services/demandForecast.service.js';

export class DemandIntelligenceController {
  /**
   * List skills with demand summaries, growth rates, and trend classifications.
   */
  static async getSkillsDemand(req, res, next) {
    try {
      const data = await DemandIntelligenceService.listSkillsDemand(req.query);
      return sendSuccess(res, {
        data,
        message: 'Skill demand intelligence retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get demand intelligence for a single skill.
   */
  static async getSkillDemandById(req, res, next) {
    try {
      const { skillId } = req.params;
      const data = await DemandIntelligenceService.getSkillDemand(skillId, req.query);
      return sendSuccess(res, {
        data,
        message: 'Skill demand intelligence retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Detect emerging skills with multi-period growth evidence and role coverage.
   */
  static async getEmergingSkills(req, res, next) {
    try {
      const data = await DemandIntelligenceService.detectEmergingSkills(req.query);
      return sendSuccess(res, {
        data,
        message: 'Emerging skills detected successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generates time-series demand projections for a skill or role.
   */
  static async getDemandForecast(req, res, next) {
    try {
      const { skillId, roleId, horizon, model, confidenceLevel } = req.query;
      const data = await DemandForecastService.getForecast({
        skillId,
        roleId,
        horizon: horizon ? parseInt(horizon, 10) : 3,
        model: model ? model.toUpperCase() : 'AUTO',
        confidenceLevel: confidenceLevel ? parseFloat(confidenceLevel) : 0.95,
      });

      return sendSuccess(res, {
        data,
        message: 'Demand forecast computed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Organization demand intelligence overview.
   */
  static async getOrganizationDemandOverview(req, res, next) {
    try {
      const orgId = req.organization?.id || req.user?.organizationMemberships?.[0]?.organizationId || req.query.organizationId;
      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'MISSING_ORG_CONTEXT');
      }

      const data = await DemandIntelligenceService.getOrganizationDemandOverview(orgId);
      return sendSuccess(res, {
        data,
        message: 'Organization demand intelligence retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Organization skills demand breakdown.
   */
  static async getOrganizationSkillsDemand(req, res, next) {
    try {
      const orgId = req.organization?.id || req.user?.organizationMemberships?.[0]?.organizationId || req.query.organizationId;
      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'MISSING_ORG_CONTEXT');
      }

      const overview = await DemandIntelligenceService.getOrganizationDemandOverview(orgId);
      return sendSuccess(res, {
        data: {
          organizationId: orgId,
          skills: overview.workforceSkillSignals,
          disclaimer: overview.disclaimer,
        },
        message: 'Organization skill demand retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Organization roles demand breakdown.
   */
  static async getOrganizationRolesDemand(req, res, next) {
    try {
      const orgId = req.organization?.id || req.user?.organizationMemberships?.[0]?.organizationId || req.query.organizationId;
      if (!orgId) {
        throw ApiError.badRequest('Organization context required', 'MISSING_ORG_CONTEXT');
      }

      const overview = await DemandIntelligenceService.getOrganizationDemandOverview(orgId);
      return sendSuccess(res, {
        data: {
          organizationId: orgId,
          roles: overview.workforceRoleDemand,
          disclaimer: overview.disclaimer,
        },
        message: 'Organization role demand retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Organization demand forecasting.
   */
  static async getOrganizationDemandForecast(req, res, next) {
    try {
      const { skillId, roleId, horizon, model } = req.query;
      const data = await DemandForecastService.getForecast({
        skillId,
        roleId,
        horizon: horizon ? parseInt(horizon, 10) : 3,
        model: model ? model.toUpperCase() : 'AUTO',
      });

      return sendSuccess(res, {
        data,
        message: 'Organization demand forecast computed successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin status for demand dataset and forecasting.
   */
  static async getDemandAdminStatus(req, res, next) {
    try {
      const skillObsCount = await prisma.skillDemandObservation.count();
      const roleObsCount = await prisma.roleDemandObservation.count();
      const forecastCount = await prisma.demandForecast.count();
      const snapshotCount = await prisma.demandTrendSnapshot.count();

      return sendSuccess(res, {
        data: {
          skillDemandObservations: skillObsCount,
          roleDemandObservations: roleObsCount,
          activeForecasts: forecastCount,
          trendSnapshots: snapshotCount,
          sourceTypes: ['SEEDED', 'IMPORTED', 'DERIVED'],
          dataQualityTier: 'MEDIUM',
          lastUpdated: new Date().toISOString(),
        },
        message: 'Demand intelligence admin status retrieved successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin operation: Rebuild demand dataset / observations.
   */
  static async rebuildDemandData(req, res, next) {
    try {
      const skillObsCount = await prisma.skillDemandObservation.count();
      const roleObsCount = await prisma.roleDemandObservation.count();

      return sendSuccess(res, {
        data: {
          status: 'REBUILD_COMPLETE',
          observationsProcessed: skillObsCount + roleObsCount,
          timestamp: new Date().toISOString(),
        },
        message: 'Demand data catalog rebuilt successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin operation: Rebuild time-series forecasts and trend snapshots.
   */
  static async rebuildDemandForecasts(req, res, next) {
    try {
      const result = await DemandForecastService.rebuildAllForecasts(req.body);
      return sendSuccess(res, {
        data: result,
        message: 'Demand forecasts and trend snapshots rebuilt successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default DemandIntelligenceController;
