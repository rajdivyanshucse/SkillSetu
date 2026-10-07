import { z } from 'zod';

/**
 * Health Query Validator Schema (Example demonstration of Zod validation foundation)
 */
export const healthQuerySchema = {
  query: z.object({
    verbose: z.enum(['true', 'false', '1', '0']).optional(),
  }),
};

export default {
  healthQuerySchema,
};
