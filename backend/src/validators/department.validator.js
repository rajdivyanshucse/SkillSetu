import { z } from 'zod';

export const departmentParamSchema = {
  params: z.object({
    departmentId: z.string().uuid('Invalid department ID format'),
  }),
};

export const createDepartmentSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Department name must be at least 2 characters').max(100),
    code: z.string().trim().max(20).optional(),
    headcount: z.coerce.number().int().min(0, 'Headcount cannot be negative').optional(),
    headCount: z.coerce.number().int().min(0, 'Headcount cannot be negative').optional(),
    description: z.string().trim().max(1000).optional(),
  }),
};

export const updateDepartmentSchema = {
  params: z.object({
    departmentId: z.string().uuid('Invalid department ID format'),
  }),
  body: z.object({
    name: z.string().trim().min(2, 'Department name must be at least 2 characters').max(100).optional(),
    code: z.string().trim().max(20).optional(),
    headcount: z.coerce.number().int().min(0, 'Headcount cannot be negative').optional(),
    headCount: z.coerce.number().int().min(0, 'Headcount cannot be negative').optional(),
    description: z.string().trim().max(1000).optional(),
  }),
};

export const listDepartmentsQuerySchema = {
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
};

export default {
  departmentParamSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  listDepartmentsQuerySchema,
};
