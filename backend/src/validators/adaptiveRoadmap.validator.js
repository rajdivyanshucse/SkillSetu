import { z } from 'zod';

export const generateRoadmapSchema = {
  body: z.object({
    targetRoleId: z.string().optional(),
    forceRecalculate: z.boolean().optional().default(false),
    reason: z.string().optional(),
    triggerEntity: z.string().optional().nullable(),
  }).optional(),
  query: z.object({
    targetRoleId: z.string().optional(),
    roleId: z.string().optional(),
    forceRecalculate: z.enum(['true', 'false']).optional(),
  }).optional(),
};

export const completeStageSchema = {
  params: z.object({
    roadmapId: z.string({ required_error: 'Roadmap ID is required' }).min(1),
    stageId: z.string({ required_error: 'Stage ID is required' }).min(1),
  }),
  body: z.object({
    completedEvidenceId: z.string().optional().nullable(),
    notes: z.string().trim().max(1000).optional().nullable(),
  }).optional(),
};

export const reEvaluateRoadmapSchema = {
  params: z.object({
    roadmapId: z.string().optional(),
  }).optional(),
  body: z.object({
    triggerType: z.string().optional().default('MANUAL'),
    triggerEntity: z.string().optional().nullable(),
  }).optional(),
};

export const syncLegacyProgressSchema = {
  body: z.object({
    progress: z.record(z.boolean()).optional(),
    legacyProgress: z.record(z.boolean()).optional(),
  }),
};

export default {
  generateRoadmapSchema,
  completeStageSchema,
  reEvaluateRoadmapSchema,
  syncLegacyProgressSchema,
};
