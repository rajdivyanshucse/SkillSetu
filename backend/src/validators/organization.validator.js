import { z } from 'zod';

export const createOrganizationSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Organization name must be at least 2 characters').max(150),
    legalName: z.string().trim().max(150).optional(),
    industry: z.string().trim().min(2, 'Industry is required').max(100),
    companySize: z.string().trim().max(50).optional(),
    size: z.string().trim().max(50).optional(),
    location: z.string().trim().max(100).optional(),
    description: z.string().trim().max(2000).optional(),
    website: z.string().trim().url('Invalid website URL format').optional().or(z.literal('')),
  }).refine((data) => data.companySize || data.size, {
    message: 'Company size is required',
  }),
};

export const updateOrganizationSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Organization name must be at least 2 characters').max(150).optional(),
    legalName: z.string().trim().max(150).optional(),
    industry: z.string().trim().min(2, 'Industry must be at least 2 characters').max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    size: z.string().trim().max(50).optional(),
    location: z.string().trim().max(100).optional(),
    description: z.string().trim().max(2000).optional(),
    website: z.string().trim().url('Invalid website URL format').optional().or(z.literal('')),
    status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  }),
};

export default {
  createOrganizationSchema,
  updateOrganizationSchema,
};
