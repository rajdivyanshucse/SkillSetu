import { z } from 'zod';

export const skillParamSchema = {
  params: z.object({
    skillId: z.string().uuid('Invalid skill ID format'),
  }),
};

export const createOrgSkillSchema = {
  body: z.object({
    skillId: z.string().uuid('Invalid skill ID format').optional(),
    skillName: z.string().trim().min(2, 'Skill name must be at least 2 characters').max(100).optional(),
    category: z.string().trim().max(100).optional(),
    currentCapability: z.coerce.number().min(0).max(100).optional(),
    coveragePercentage: z.coerce.number().min(0).max(100).optional(),
    targetCapability: z.coerce.number().min(0).max(100).optional(),
    targetRequirement: z.coerce.number().min(0).max(100).optional(),
    workforceCount: z.coerce.number().int().min(0, 'Workforce count cannot be negative').default(0),
    department: z.string().trim().max(100).optional(),
    importance: z.string().trim().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  }).refine((data) => data.skillId || data.skillName, {
    message: 'Either skillId or skillName must be provided',
  }),
};

export const updateOrgSkillSchema = {
  params: z.object({
    skillId: z.string().uuid('Invalid skill ID format'),
  }),
  body: z.object({
    currentCapability: z.coerce.number().min(0).max(100).optional(),
    coveragePercentage: z.coerce.number().min(0).max(100).optional(),
    targetCapability: z.coerce.number().min(0).max(100).optional(),
    targetRequirement: z.coerce.number().min(0).max(100).optional(),
    workforceCount: z.coerce.number().int().min(0, 'Workforce count cannot be negative').optional(),
    department: z.string().trim().max(100).optional(),
    importance: z.string().trim().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  }),
};

export const listWorkforceQuerySchema = {
  query: z.object({
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['Strong', 'Moderate', 'Developing', 'Limited', 'STRONG', 'MODERATE', 'DEVELOPING', 'LIMITED']).optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  skillParamSchema,
  createOrgSkillSchema,
  updateOrgSkillSchema,
  listWorkforceQuerySchema,
};
