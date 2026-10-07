import { z } from 'zod';

export const experienceSchema = {
  body: z.object({
    company: z.string({ required_error: 'Company name is required' }).trim().min(1).max(150),
    roleTitle: z.string({ required_error: 'Role title is required' }).trim().min(1).max(150),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional().default('FULL_TIME'),
    location: z.string().trim().max(100).optional(),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().trim().max(2000).optional(),
  }),
};

export const updateExperienceSchema = {
  body: z.object({
    company: z.string().trim().min(1).max(150).optional(),
    roleTitle: z.string().trim().min(1).max(150).optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
    location: z.string().trim().max(100).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional(),
    description: z.string().trim().max(2000).optional(),
  }),
};

export default {
  experienceSchema,
  updateExperienceSchema,
};
