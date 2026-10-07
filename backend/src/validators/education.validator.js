import { z } from 'zod';

export const educationSchema = {
  body: z.object({
    institution: z.string({ required_error: 'Institution name is required' }).trim().min(1).max(150),
    degree: z.string({ required_error: 'Degree is required' }).trim().min(1).max(100),
    fieldOfStudy: z.string({ required_error: 'Field of study is required' }).trim().min(1).max(150),
    startDate: z.string({ required_error: 'Start date is required' }),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().trim().max(1000).optional(),
  }),
};

export const updateEducationSchema = {
  body: z.object({
    institution: z.string().trim().min(1).max(150).optional(),
    degree: z.string().trim().min(1).max(100).optional(),
    fieldOfStudy: z.string().trim().min(1).max(150).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional(),
    description: z.string().trim().max(1000).optional(),
  }),
};

export default {
  educationSchema,
  updateEducationSchema,
};
