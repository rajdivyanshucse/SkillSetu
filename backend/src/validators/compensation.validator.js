import { z } from 'zod';

export const roleCompParamSchema = {
  params: z.object({
    roleId: z.string().uuid('Invalid role ID format'),
  }),
};

export const compQuerySchema = {
  query: z.object({
    location: z.string().optional(),
    roleId: z.string().uuid('Invalid role ID format').optional(),
    experienceLevel: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
};

export default {
  roleCompParamSchema,
  compQuerySchema,
};
