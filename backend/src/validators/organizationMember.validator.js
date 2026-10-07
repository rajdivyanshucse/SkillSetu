import { z } from 'zod';

export const memberParamSchema = {
  params: z.object({
    memberId: z.string().uuid('Invalid member ID format'),
  }),
};

export const createMemberSchema = {
  body: z.object({
    userId: z.string().uuid('Invalid user ID format').optional(),
    email: z.string().trim().email('Invalid email address format').optional(),
    name: z.string().trim().max(100).optional(),
    fullName: z.string().trim().max(100).optional(),
    department: z.string().trim().max(100).optional(),
    role: z.string().trim().max(50).default('MEMBER'),
    accessLevel: z.enum(['Viewer', 'Editor', 'Admin', 'Owner', 'VIEWER', 'EDITOR', 'ADMIN', 'OWNER']).optional(),
  }).refine((data) => data.userId || data.email, {
    message: 'Either userId or email must be provided to add a member',
  }),
};

export const updateMemberSchema = {
  params: z.object({
    memberId: z.string().uuid('Invalid member ID format'),
  }),
  body: z.object({
    name: z.string().trim().max(100).optional(),
    department: z.string().trim().max(100).optional(),
    role: z.string().trim().max(50).optional(),
    accessLevel: z.enum(['Viewer', 'Editor', 'Admin', 'Owner', 'VIEWER', 'EDITOR', 'ADMIN', 'OWNER']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']).optional(),
  }),
};

export const listMembersQuerySchema = {
  query: z.object({
    role: z.string().optional(),
    accessLevel: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export default {
  memberParamSchema,
  createMemberSchema,
  updateMemberSchema,
  listMembersQuerySchema,
};
