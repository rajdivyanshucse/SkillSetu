import { z } from 'zod';

export const roleParamSchema = {
  params: z.object({
    roleId: z.string().uuid('Invalid role ID format'),
  }),
};

const skillRequirementSchema = z.object({
  skillId: z.string().uuid('Invalid skill ID').optional(),
  skillName: z.string().trim().min(1, 'Skill name is required').optional(),
  requirementType: z.enum(['REQUIRED', 'PREFERRED']).optional(),
  importance: z.union([z.coerce.number(), z.string()]).optional(),
  targetProficiency: z.string().optional(),
  minProficiency: z.union([z.coerce.number(), z.string()]).optional(),
});

export const createOrgRoleSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    title: z.string().trim().min(2).max(100).optional(),
    category: z.string().trim().max(100).default('Engineering'),
    department: z.string().trim().max(100).optional(),
    departmentId: z.string().uuid('Invalid department ID').optional().nullable(),
    description: z.string().trim().max(2000).optional(),
    experienceLevel: z.string().trim().max(50).optional(),
    minExperienceYears: z.coerce.number().min(0).max(50).optional(),
    importance: z.union([z.coerce.number(), z.string()]).optional(),
    requiredSkills: z.array(skillRequirementSchema).optional().default([]),
    preferredSkills: z.array(skillRequirementSchema).optional().default([]),
  }),
};

export const updateOrgRoleSchema = {
  params: z.object({
    roleId: z.string().uuid('Invalid role ID format'),
  }),
  body: z.object({
    name: z.string().trim().min(2).max(100).optional(),
    title: z.string().trim().min(2).max(100).optional(),
    category: z.string().trim().max(100).optional(),
    department: z.string().trim().max(100).optional(),
    departmentId: z.string().uuid('Invalid department ID').optional().nullable(),
    description: z.string().trim().max(2000).optional(),
    experienceLevel: z.string().trim().max(50).optional(),
    minExperienceYears: z.coerce.number().min(0).max(50).optional(),
    importance: z.union([z.coerce.number(), z.string()]).optional(),
    requiredSkills: z.array(skillRequirementSchema).optional(),
    preferredSkills: z.array(skillRequirementSchema).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const listOrgRolesQuerySchema = {
  query: z.object({
    departmentId: z.string().uuid('Invalid department ID').optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
};

export default {
  roleParamSchema,
  createOrgRoleSchema,
  updateOrgRoleSchema,
  listOrgRolesQuerySchema,
};
