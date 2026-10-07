import { z } from 'zod';

export const createProfileSchema = {
  body: z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
    headline: z.string().trim().max(200).optional(),
    location: z.string().trim().max(100).optional(),
    education: z.string().trim().max(200).optional(),
    currentStatus: z.string().trim().max(100).optional(),
    targetRoleId: z.string().uuid('Invalid role ID').optional().nullable(),
    targetIndustry: z.string().trim().max(100).optional(),
    experienceSummary: z.string().trim().max(2000).optional(),
    careerGoals: z.array(z.string().trim()).optional(),
    learningPreferences: z.record(z.any()).optional(),
    workPreferences: z.record(z.any()).optional(),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100).optional(),
    headline: z.string().trim().max(200).optional(),
    location: z.string().trim().max(100).optional(),
    education: z.string().trim().max(200).optional(),
    currentStatus: z.string().trim().max(100).optional(),
    targetRoleId: z.string().uuid('Invalid role ID').optional().nullable(),
    targetIndustry: z.string().trim().max(100).optional(),
    experienceSummary: z.string().trim().max(2000).optional(),
    careerGoals: z.array(z.string().trim()).optional(),
    learningPreferences: z.record(z.any()).optional(),
    workPreferences: z.record(z.any()).optional(),
  }),
};

export const targetRoleSchema = {
  body: z.object({
    targetRoleId: z.string({ required_error: 'targetRoleId is required' }).uuid('Invalid target role ID format'),
  }),
};

export default {
  createProfileSchema,
  updateProfileSchema,
  targetRoleSchema,
};
