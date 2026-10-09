import { z } from 'zod';

export const roleFutureCapabilitiesSchema = {
  params: z.object({
    roleId: z.string({ required_error: 'Role ID is required' }).min(1),
  }),
  query: z.object({
    forecastHorizon: z.coerce.number().int().min(1).max(12).optional().default(3),
    includeAdjacent: z.coerce.boolean().optional().default(true),
  }).optional(),
};

export const skillFutureCapabilitySchema = {
  params: z.object({
    skillId: z.string({ required_error: 'Skill ID is required' }).min(1),
  }),
  query: z.object({
    roleId: z.string().optional(),
    forecastHorizon: z.coerce.number().int().min(1).max(12).optional().default(3),
  }).optional(),
};

export const workforceFutureCapabilitiesSchema = {
  query: z.object({
    departmentId: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }).optional(),
};

export default {
  roleFutureCapabilitiesSchema,
  skillFutureCapabilitySchema,
  workforceFutureCapabilitiesSchema,
};
