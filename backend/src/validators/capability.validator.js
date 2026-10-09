import { z } from 'zod';

export const linkEvidenceSchema = {
  body: z.object({
    skillId: z.string({ required_error: 'Skill ID is required' }).min(1),
    evidenceType: z.enum(['PROJECT', 'EXPERIENCE', 'ASSESSMENT', 'LEARNING', 'PORTFOLIO', 'CERTIFICATION'], {
      required_error: 'Valid evidence type is required',
    }),
    sourceEntityType: z.string({ required_error: 'Source entity type is required' }).min(1).max(100),
    sourceEntityId: z.string().optional().nullable(),
    title: z.string({ required_error: 'Evidence title is required' }).trim().min(1).max(200),
    description: z.string().trim().max(2000).optional().nullable(),
    evidenceStrength: z.enum(['LIMITED', 'MODERATE', 'STRONG']).optional().default('MODERATE'),
    evidenceDepth: z.enum(['MENTIONED', 'USED', 'BUILT_WITH', 'CORE_TO_PROJECT']).optional().default('USED'),
    occurredAt: z.string().optional().nullable(),
  }),
};

export const capabilityQuerySchema = {
  query: z.object({
    targetRoleId: z.string().optional(),
    category: z.string().optional(),
    state: z.enum(['DEMONSTRATED', 'DEVELOPING', 'SELF_REPORTED', 'EVIDENCE_NEEDED']).optional(),
  }),
};

export default {
  linkEvidenceSchema,
  capabilityQuerySchema,
};
