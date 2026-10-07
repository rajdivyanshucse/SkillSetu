import { z } from 'zod';

export const recommendationQuerySchema = {
  query: z.object({
    type: z.string().optional(),
    status: z.enum(['NEW', 'VIEWED', 'ACCEPTED', 'DISMISSED', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .refine((n) => n >= 1 && n <= 100, { message: 'limit must be between 1 and 100' })
      .optional(),
    skip: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .optional(),
  }),
};

export const recommendationStatusUpdateSchema = {
  body: z.object({
    status: z.enum(['NEW', 'VIEWED', 'ACCEPTED', 'DISMISSED', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED']),
    notes: z.string().max(1000).optional().nullable(),
  }),
  params: z.object({
    recommendationId: z.string().uuid().or(z.string().min(1)),
  }),
};

export const recommendationDismissSchema = {
  body: z.object({
    reason: z.enum(['NOT_RELEVANT', 'ALREADY_KNOW', 'NOT_INTERESTED', 'COMPLETED_ELSEWHERE']).default('NOT_RELEVANT'),
    notes: z.string().max(1000).optional().nullable(),
  }),
  params: z.object({
    recommendationId: z.string().uuid().or(z.string().min(1)),
  }),
};

export const recommendationGenerateSchema = {
  body: z
    .object({
      forceRefresh: z.boolean().optional(),
      horizon: z.number().min(1).max(36).optional(),
    })
    .optional(),
};

export default {
  recommendationQuerySchema,
  recommendationStatusUpdateSchema,
  recommendationDismissSchema,
  recommendationGenerateSchema,
};
