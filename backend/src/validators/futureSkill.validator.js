import { z } from 'zod';

export const futureSkillParamSchema = {
  params: z.object({
    futureSkillId: z.string().uuid('Invalid future skill ID format'),
  }),
};

export const createFutureSkillSchema = {
  body: z.object({
    skillId: z.string().uuid('Invalid skill ID format').optional(),
    skillName: z.string().trim().min(2, 'Skill name must be at least 2 characters').max(100).optional(),
    category: z.string().trim().max(100).optional(),
    planningHorizon: z.string().optional(),
    expectedDemandHorizon: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('HIGH'),
    requiredCapability: z.coerce.number().min(0).max(100).optional(),
    futureRequirementScore: z.coerce.number().min(0).max(100).optional(),
    currentCapability: z.coerce.number().min(0).max(100).optional(),
    currentCapabilityScore: z.coerce.number().min(0).max(100).optional(),
    notes: z.string().trim().max(1000).optional(),
    planningAssumption: z.string().trim().max(1000).optional(),
    affectedDepartment: z.string().trim().max(100).optional(),
    developmentRecommendation: z.string().trim().max(1000).optional(),
  }).refine((data) => data.skillId || data.skillName, {
    message: 'Either skillId or skillName must be provided',
  }),
};

export const updateFutureSkillSchema = {
  params: z.object({
    futureSkillId: z.string().uuid('Invalid future skill ID format'),
  }),
  body: z.object({
    planningHorizon: z.string().optional(),
    expectedDemandHorizon: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    requiredCapability: z.coerce.number().min(0).max(100).optional(),
    futureRequirementScore: z.coerce.number().min(0).max(100).optional(),
    currentCapability: z.coerce.number().min(0).max(100).optional(),
    currentCapabilityScore: z.coerce.number().min(0).max(100).optional(),
    notes: z.string().trim().max(1000).optional(),
    planningAssumption: z.string().trim().max(1000).optional(),
    affectedDepartment: z.string().trim().max(100).optional(),
    developmentRecommendation: z.string().trim().max(1000).optional(),
  }),
};

export const listFutureSkillsQuerySchema = {
  query: z.object({
    horizon: z.enum(['MONTHS_6', 'MONTHS_12', 'MONTHS_24', 'MONTHS_36']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  futureSkillParamSchema,
  createFutureSkillSchema,
  updateFutureSkillSchema,
  listFutureSkillsQuerySchema,
};
