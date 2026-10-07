import { z } from 'zod';

export const opportunityQuerySchema = {
  query: z.object({
    search: z.string().trim().optional(),
    role: z.string().trim().optional(),
    location: z.string().trim().optional(),
    workMode: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).optional(),
    employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
    experienceLevel: z.string().trim().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
    sort: z.enum(['newest', 'oldest', 'title']).optional().default('newest'),
  }),
};

export const createApplicationSchema = {
  body: z.object({
    opportunityId: z.string({ required_error: 'opportunityId is required' }).uuid('Invalid opportunity ID'),
    status: z.enum(['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'CLOSED']).optional().default('APPLIED'),
    notes: z.string().trim().max(1000).optional(),
  }),
};

export const updateApplicationSchema = {
  body: z.object({
    status: z.enum(['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'CLOSED']).optional(),
    notes: z.string().trim().max(1000).optional(),
  }),
};

export const roadmapProgressSchema = {
  body: z.object({
    milestoneId: z.string().uuid('Invalid milestone ID').optional(),
    pathId: z.string().uuid('Invalid learning path ID').optional(),
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).optional(),
    progressPct: z.number().min(0).max(100).optional(),
  }),
};

export default {
  opportunityQuerySchema,
  createApplicationSchema,
  updateApplicationSchema,
  roadmapProgressSchema,
};
