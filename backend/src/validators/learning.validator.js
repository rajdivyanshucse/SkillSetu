import { z } from 'zod';

export const programParamSchema = {
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
};

export const createProgramSchema = {
  body: z.object({
    title: z.string().trim().min(2, 'Program title must be at least 2 characters').max(150),
    description: z.string().trim().max(1000).optional(),
    targetSkillId: z.string().uuid('Invalid target skill ID').optional().nullable(),
    targetCapability: z.coerce.number().min(0).max(100).default(80),
    enrolledCount: z.coerce.number().int().min(0).default(0),
    completedCount: z.coerce.number().int().min(0).default(0),
    status: z.enum(['ACTIVE', 'PLANNED', 'COMPLETED', 'ARCHIVED']).default('ACTIVE'),
  }),
};

export const updateProgramSchema = {
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
  body: z.object({
    title: z.string().trim().min(2, 'Program title must be at least 2 characters').max(150).optional(),
    description: z.string().trim().max(1000).optional(),
    targetSkillId: z.string().uuid('Invalid target skill ID').optional().nullable(),
    targetCapability: z.coerce.number().min(0).max(100).optional(),
    enrolledCount: z.coerce.number().int().min(0).optional(),
    completedCount: z.coerce.number().int().min(0).optional(),
    status: z.enum(['ACTIVE', 'PLANNED', 'COMPLETED', 'ARCHIVED']).optional(),
  }),
};

export const listProgramsQuerySchema = {
  query: z.object({
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  programParamSchema,
  createProgramSchema,
  updateProgramSchema,
  listProgramsQuerySchema,
};
