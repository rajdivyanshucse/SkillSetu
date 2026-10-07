import prisma from '../config/db.js';
import aiClient from './aiClient.service.js';
import { DemandIntelligenceService, DEMAND_CONFIG } from './demandIntelligence.service.js';
import { ApiError } from '../utils/apiError.js';

export class DemandForecastService {
  /**
   * Generates a demand forecast for a skill or role via Python AI microservice,
   * falling back to local deterministic calculation if offline.
   */
  static async getForecast({ skillId, roleId, horizon = 3, model = 'AUTO', confidenceLevel = 0.95, persist = false }) {
    if (!skillId && !roleId) {
      throw ApiError.badRequest('Either skillId or roleId must be provided for forecasting', 'INVALID_FORECAST_TARGET');
    }

    let targetEntity = null;
    let timeSeries = [];
    let entityType = 'SKILL';

    if (skillId) {
      const summary = await DemandIntelligenceService.getSkillDemand(skillId);
      targetEntity = summary.skill;
      timeSeries = summary.timeSeries;
      entityType = 'SKILL';
    } else {
      const summary = await DemandIntelligenceService.getRoleDemand(roleId);
      targetEntity = summary.role;
      timeSeries = summary.timeSeries;
      entityType = 'ROLE';
    }

    if (!timeSeries || timeSeries.length < DEMAND_CONFIG.MIN_OBSERVATIONS_FOR_FORECAST) {
      return {
        target: targetEntity,
        entityType,
        forecastStatus: 'INSUFFICIENT_DATA',
        modelUsed: 'NONE',
        confidenceLevel: 'INSUFFICIENT_DATA',
        confidenceScore: 0.0,
        historicalObservations: timeSeries?.length || 0,
        requiredObservations: DEMAND_CONFIG.MIN_OBSERVATIONS_FOR_FORECAST,
        forecasts: [],
        diagnostics: { reason: 'Insufficient historical time-series observation depth.' },
        disclaimer: DEMAND_CONFIG.DISCLAIMER,
      };
    }

    // Attempt Python AI Microservice call
    let aiResponse = null;
    try {
      aiResponse = await aiClient.forecastDemand(timeSeries, horizon, model, confidenceLevel);
    } catch (err) {
      // Local fallback if AI service is offline
      aiResponse = this._computeLocalForecast(timeSeries, horizon, model);
    }

    const formattedForecasts = (aiResponse.forecast || []).map((f) => ({
      period: f.period,
      predictedDemand: f.predictedDemand,
      lowerBound: f.lowerBound,
      upperBound: f.upperBound,
      confidence: f.confidence,
    }));

    // Optional persistence
    if (persist && formattedForecasts.length > 0) {
      for (const fc of formattedForecasts) {
        await prisma.demandForecast.create({
          data: {
            skillId: skillId || null,
            roleId: roleId || null,
            forecastPeriod: fc.period,
            predictedDemand: fc.predictedDemand,
            lowerBound: fc.lowerBound,
            upperBound: fc.upperBound,
            confidenceScore: aiResponse.confidenceScore || 0.75,
            confidenceLevel: aiResponse.confidenceLevel || 'MEDIUM',
            model: aiResponse.model || 'LINEAR_TREND',
          },
        });
      }
    }

    return {
      target: targetEntity,
      entityType,
      forecastStatus: aiResponse.forecastStatus || 'SUCCESS',
      modelUsed: aiResponse.model || 'LINEAR_TREND',
      confidenceLevel: aiResponse.confidenceLevel || 'MEDIUM',
      confidenceScore: aiResponse.confidenceScore || 0.75,
      historicalObservations: timeSeries.length,
      forecastHorizon: horizon,
      forecasts: formattedForecasts,
      validation: aiResponse.validation || null,
      diagnostics: aiResponse.diagnostics || {},
      disclaimer: DEMAND_CONFIG.DISCLAIMER,
    };
  }

  /**
   * Deterministic local fallback forecasting method.
   */
  static _computeLocalForecast(series, horizon = 3, model = 'AUTO') {
    const values = series.map((s) => s.value);
    const n = values.length;
    const lastPeriod = series[series.length - 1].period;

    // Linear regression
    const xVals = Array.from({ length: n }, (_, i) => i);
    const xMean = xVals.reduce((a, b) => a + b, 0) / n;
    const yMean = values.reduce((a, b) => a + b, 0) / n;

    const num = xVals.reduce((sum, x, i) => sum + (x - xMean) * (values[i] - yMean), 0);
    const den = xVals.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    const slope = den !== 0 ? num / den : 0;
    const intercept = yMean - slope * xMean;

    const forecasts = [];
    for (let h = 1; h <= horizon; h++) {
      const pred = Math.max(0, Number((intercept + slope * (n - 1 + h)).toFixed(2)));
      forecasts.push({
        period: `Forecast+${h}`,
        predictedDemand: pred,
        lowerBound: Math.max(0, Number((pred * 0.85).toFixed(2))),
        upperBound: Number((pred * 1.15).toFixed(2)),
        confidence: 'MEDIUM',
      });
    }

    return {
      success: true,
      forecastStatus: 'SUCCESS',
      model: 'DETERMINISTIC_LOCAL_FALLBACK',
      confidenceScore: 0.70,
      confidenceLevel: 'MEDIUM',
      forecast: forecasts,
      diagnostics: { note: 'Generated via Node.js deterministic fallback engine.' },
    };
  }

  /**
   * Admin operation: Rebuilds forecasts and snapshots across all skills and roles.
   */
  static async rebuildAllForecasts({ horizon = 3, model = 'AUTO' } = {}) {
    const skills = await prisma.skill.findMany({ where: { isActive: true } });
    const roles = await prisma.role.findMany({ where: { isActive: true } });

    // Clean existing forecasts
    await prisma.demandForecast.deleteMany({});
    await prisma.demandTrendSnapshot.deleteMany({});

    let skillSuccessCount = 0;
    for (const skill of skills) {
      try {
        const fc = await this.getForecast({ skillId: skill.id, horizon, model, persist: true });
        const summary = await DemandIntelligenceService.getSkillDemand(skill.id);
        await prisma.demandTrendSnapshot.create({
          data: {
            skillId: skill.id,
            currentDemand: summary.currentDemand,
            previousDemand: summary.previousDemand,
            growthRate: summary.growthRate,
            trendCategory: summary.trendCategory,
            volatility: summary.volatility,
            confidence: summary.confidence,
            period: summary.timeSeries[summary.timeSeries.length - 1]?.period || 'CURRENT',
          },
        });
        skillSuccessCount++;
      } catch (err) {
        // Skip failed single item
      }
    }

    let roleSuccessCount = 0;
    for (const role of roles) {
      try {
        const fc = await this.getForecast({ roleId: role.id, horizon, model, persist: true });
        const summary = await DemandIntelligenceService.getRoleDemand(role.id);
        await prisma.demandTrendSnapshot.create({
          data: {
            roleId: role.id,
            currentDemand: summary.currentDemand,
            previousDemand: summary.previousDemand,
            growthRate: summary.growthRate,
            trendCategory: summary.trendCategory,
            volatility: summary.volatility,
            confidence: summary.confidence,
            period: summary.timeSeries[summary.timeSeries.length - 1]?.period || 'CURRENT',
          },
        });
        roleSuccessCount++;
      } catch (err) {
        // Skip failed single item
      }
    }

    return {
      status: 'REBUILD_COMPLETE',
      skillsProcessed: skillSuccessCount,
      rolesProcessed: roleSuccessCount,
      totalForecastsCreated: await prisma.demandForecast.count(),
      totalSnapshotsCreated: await prisma.demandTrendSnapshot.count(),
      timestamp: new Date().toISOString(),
    };
  }
}

export default DemandForecastService;
