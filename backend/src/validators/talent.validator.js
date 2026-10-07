import { z } from 'zod';

export const candidateParamSchema = {
  params: z.object({
    candidateId: z.string().uuid('Invalid candidate ID format'),
  }),
};

export const listTalentQuerySchema = {
  query: z.object({
    roleId: z.string().uuid('Invalid role ID').optional(),
    skill: z.string().optional(),
    query: z.string().optional(),
    minExperience: z.coerce.number().min(0).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const compareTalentQuerySchema = {
  query: z.object({
    candidateIds: z.string().min(1, 'candidateIds query parameter is required'),
    roleId: z.string().uuid('Invalid role ID format').optional(),
  }),
};

export const candidateCompatibilityQuerySchema = {
  params: z.object({
    candidateId: z.string().uuid('Invalid candidate ID format'),
  }),
  query: z.object({
    roleId: z.string().uuid('Invalid role ID format').optional(),
  }),
};

export const shortlistBodySchema = {
  params: z.object({
    candidateId: z.string().uuid('Invalid candidate ID format'),
  }),
  body: z.object({
    notes: z.string().trim().max(1000).optional(),
    status: z.enum(['ACTIVE', 'REVIEWING', 'INTERVIEWING', 'ARCHIVED']).default('ACTIVE'),
  }),
};

export const listShortlistQuerySchema = {
  query: z.object({
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  candidateParamSchema,
  listTalentQuerySchema,
  compareTalentQuerySchema,
  candidateCompatibilityQuerySchema,
  shortlistBodySchema,
  listShortlistQuerySchema,
};
