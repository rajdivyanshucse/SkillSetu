import { z } from 'zod';

export const scenarioParamSchema = {
  params: z.object({
    scenarioId: z.string().trim().min(1, 'Invalid scenario ID'),
  }),
};

export const createScenarioSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Scenario name must be at least 2 characters').max(150),
    description: z.string().trim().max(1000).optional(),
    planningHorizon: z.enum(['MONTHS_6', 'MONTHS_12', 'MONTHS_24', 'MONTHS_36']).default('MONTHS_12'),
    workforceGrowthPct: z.coerce.number().min(-100).max(500).default(0),
    skillDemandChangePct: z.coerce.number().min(-100).max(500).default(0),
    hiringCapacity: z.coerce.number().int().min(0).default(0),
    developmentCapacity: z.coerce.number().int().min(0).default(0),
    targetTimeline: z.string().trim().max(50).default('12 Months'),
  }),
};

export const updateScenarioSchema = {
  params: z.object({
    scenarioId: z.string().trim().min(1, 'Invalid scenario ID'),
  }),
  body: z.object({
    name: z.string().trim().min(2, 'Scenario name must be at least 2 characters').max(150).optional(),
    description: z.string().trim().max(1000).optional(),
    planningHorizon: z.string().optional(),
    workforceGrowthPct: z.coerce.number().min(-100).max(500).optional(),
    skillDemandChangePct: z.coerce.number().min(-100).max(500).optional(),
    hiringCapacity: z.coerce.number().int().min(0).optional(),
    developmentCapacity: z.coerce.number().int().min(0).optional(),
    targetTimeline: z.string().trim().max(50).optional(),
    status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  }),
};

export const listScenariosQuerySchema = {
  query: z.object({
    status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const updateRoadmapProgressSchema = {
  body: z.object({
    actionId: z.string().trim().min(1, 'Invalid action ID format'),
    completedCount: z.coerce.number().int().min(0).optional(),
    progressPct: z.coerce.number().min(0).max(100).optional(),
    progress: z.coerce.number().min(0).max(100).optional(),
    status: z.enum(['IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED']).optional(),
  }),
};

export default {
  scenarioParamSchema,
  createScenarioSchema,
  updateScenarioSchema,
  listScenariosQuerySchema,
  updateRoadmapProgressSchema,
};
