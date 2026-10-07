import { z } from 'zod';

export const extractSkillsSchema = {
  body: z.object({
    text: z
      .string({ required_error: 'Text content is required for skill extraction' })
      .trim()
      .min(1, 'Text content must not be empty')
      .max(50000, 'Text content exceeds maximum allowed length of 50,000 characters'),
  }),
};

export const analyzeResumeSchema = {
  body: z.object({
    text: z
      .string({ required_error: 'Resume text is required for analysis' })
      .trim()
      .min(1, 'Resume text must not be empty')
      .max(50000, 'Resume text exceeds maximum allowed length of 50,000 characters'),
  }),
};

export const analyzeJobDescriptionSchema = {
  body: z.object({
    text: z
      .string({ required_error: 'Job description text is required for analysis' })
      .trim()
      .min(1, 'Job description text must not be empty')
      .max(50000, 'Job description text exceeds maximum allowed length of 50,000 characters'),
  }),
};

export default {
  extractSkillsSchema,
  analyzeResumeSchema,
  analyzeJobDescriptionSchema,
};
