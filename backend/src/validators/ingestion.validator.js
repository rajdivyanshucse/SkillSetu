import { z } from 'zod';

export const createSourceSchema = {
  body: z.object({
    name: z.string().min(1, 'Source name is required').max(100),
    type: z
      .enum([
        'JOB_POSTINGS',
        'SKILL_TAXONOMY',
        'ROLE_TAXONOMY',
        'SALARY_DATA',
        'WORKFORCE_DATA',
        'EDUCATION_DATA',
        'GOVERNMENT_DATA',
        'ORGANIZATION_DATA',
        'OTHER',
      ])
      .default('JOB_POSTINGS'),
    provider: z.string().min(1, 'Provider is required').max(100),
    description: z.string().max(1000).optional().nullable(),
    url: z.string().url().optional().nullable().or(z.literal('')),
    license: z.string().max(200).optional().nullable(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DEPRECATED']).default('ACTIVE'),
    metadata: z.record(z.any()).optional().nullable(),
  }),
};

export const createDatasetSchema = {
  body: z.object({
    sourceId: z.string().uuid().or(z.string().min(1)),
    name: z.string().min(1, 'Dataset name is required').max(150),
    category: z
      .enum([
        'JOB_POSTINGS',
        'SKILL_TAXONOMY',
        'ROLE_TAXONOMY',
        'SALARY_DATA',
        'WORKFORCE_DATA',
        'EDUCATION_DATA',
        'GOVERNMENT_DATA',
        'ORGANIZATION_DATA',
        'OTHER',
      ])
      .default('JOB_POSTINGS'),
    description: z.string().max(2000).optional().nullable(),
    metadata: z.record(z.any()).optional().nullable(),
  }),
};

export const createDatasetVersionSchema = {
  body: z.object({
    datasetId: z.string().uuid().or(z.string().min(1)),
    versionTag: z.string().min(1, 'Version tag is required').max(50),
    effectiveStartDate: z.string().optional().nullable(),
    effectiveEndDate: z.string().optional().nullable(),
    schemaVersion: z.string().default('1.0'),
    format: z.enum(['JSON', 'CSV', 'json', 'csv']).default('JSON'),
    metadata: z.record(z.any()).optional().nullable(),
  }),
};

export const importDatasetSchema = {
  params: z.object({
    datasetId: z.string().uuid().or(z.string().min(1)),
  }),
  body: z.object({
    versionTag: z.string().min(1).optional(),
    format: z.enum(['JSON', 'CSV', 'json', 'csv']).default('JSON').optional(),
    records: z.array(z.record(z.any())).optional(),
    content: z.string().optional(),
    async: z.boolean().default(false).optional(),
    force: z.boolean().default(false).optional(),
  }),
};

export const quarantineReviewSchema = {
  params: z.object({
    recordId: z.string().uuid().or(z.string().min(1)),
  }),
  body: z.object({
    status: z.enum(['QUARANTINED', 'REVIEWED', 'APPROVED', 'DISCARDED']),
    notes: z.string().max(1000).optional().nullable(),
  }),
};

export const importOnetSchema = {
  body: z.object({
    versionTag: z.string().min(1).optional(),
    format: z.enum(['JSON', 'CSV', 'TSV', 'json', 'csv', 'tsv']).default('CSV').optional(),
    occupations: z.any().optional(),
    skills: z.any().optional(),
    technologySkills: z.any().optional(),
    occupationSkills: z.any().optional(),
    alternateTitles: z.any().optional(),
    content: z.string().optional(),
    async: z.boolean().default(false).optional(),
    force: z.boolean().default(false).optional(),
  }),
};

export const importEscoSchema = {
  body: z.object({
    versionTag: z.string().min(1).optional(),
    format: z.enum(['JSON', 'CSV', 'json', 'csv']).default('CSV').optional(),
    occupations: z.any().optional(),
    skills: z.any().optional(),
    occupationSkillRelations: z.any().optional(),
    content: z.string().optional(),
    async: z.boolean().default(false).optional(),
    force: z.boolean().default(false).optional(),
  }),
};

export default {
  createSourceSchema,
  createDatasetSchema,
  createDatasetVersionSchema,
  importDatasetSchema,
  importOnetSchema,
  importEscoSchema,
  quarantineReviewSchema,
};

