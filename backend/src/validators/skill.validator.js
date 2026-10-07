import { z } from 'zod';

export const skillQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
    isActive: z.string().transform((v) => v === 'true').optional(),
  }),
};

export const addUserSkillSchema = {
  body: z.object({
    skillId: z.string({ required_error: 'skillId is required' }).uuid('Invalid skill ID'),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
      required_error: 'Proficiency must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT',
    }),
    yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative').max(50).optional().default(1),
    isVerified: z.boolean().optional().default(false),
  }),
};

export const updateUserSkillSchema = {
  body: z.object({
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    yearsOfExperience: z.number().min(0).max(50).optional(),
    isVerified: z.boolean().optional(),
  }),
};

export default {
  skillQuerySchema,
  addUserSkillSchema,
  updateUserSkillSchema,
};
