import { z } from 'zod';

export const growthQuerySchema = {
  query: z.object({
    departmentId: z.string().uuid('Invalid department ID format').optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  growthQuerySchema,
};
