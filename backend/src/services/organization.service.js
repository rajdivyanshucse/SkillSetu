import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Deterministically calculate organization profile completeness score (0-100%).
 * Evaluates core operational profile dimensions.
 */
export const calculateProfileCompleteness = (org) => {
  if (!org) return 0;
  const fields = [
    { key: 'name', weight: 20 },
    { key: 'legalName', weight: 10 },
    { key: 'industry', weight: 20 },
    { key: 'companySize', weight: 15 },
    { key: 'location', weight: 15 },
    { key: 'description', weight: 10 },
    { key: 'website', weight: 10 },
  ];

  let score = 0;
  for (const f of fields) {
    if (org[f.key] && String(org[f.key]).trim().length > 0) {
      score += f.weight;
    }
  }
  return Math.min(100, score);
};

export const getProfile = async (organizationId) => {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      members: {
        select: {
          id: true,
          userId: true,
          role: true,
          accessLevel: true,
          status: true,
        },
      },
      departments: {
        select: {
          id: true,
          name: true,
          headcount: true,
        },
      },
    },
  });

  if (!org) {
    throw ApiError.notFound('Organization profile not found', 'ORG_NOT_FOUND');
  }

  const completeness = calculateProfileCompleteness(org);

  return {
    id: org.id,
    name: org.name,
    organizationName: org.name,
    legalName: org.legalName,
    industry: org.industry,
    companySize: org.companySize,
    size: org.companySize,
    location: org.location,
    description: org.description,
    website: org.website,
    status: org.status,
    completeness,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    membersCount: org.members?.length || 0,
    departmentsCount: org.departments?.length || 0,
  };
};

export const createProfile = async (userId, data) => {
  const compSize = data.companySize || data.size || '11-50';
  // Check if organization with same name exists or if user already has an organization
  const existingOrg = await prisma.organization.findFirst({
    where: { name: data.name },
  });

  if (existingOrg) {
    throw ApiError.conflict('An organization with this name already exists', 'ORG_NAME_EXISTS');
  }

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      legalName: data.legalName || null,
      industry: data.industry,
      companySize: compSize,
      location: data.location || null,
      description: data.description || null,
      website: data.website || null,
      status: 'ACTIVE',
    },
  });

  // Assign user as OWNER / ADMIN of the newly created organization
  await prisma.organizationMember.create({
    data: {
      userId,
      organizationId: org.id,
      role: 'ADMIN',
      accessLevel: 'Owner',
      status: 'ACTIVE',
    },
  });

  await logAuthEvent({
    userId,
    action: 'ORGANIZATION_CREATED',
    metadata: { organizationId: org.id, name: org.name },
  });

  return getProfile(org.id);
};

export const updateProfile = async (organizationId, data, userId = null) => {
  const existing = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!existing) {
    throw ApiError.notFound('Organization not found for update', 'ORG_NOT_FOUND');
  }

  const compSize = data.companySize || data.size;

  const updated = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.legalName !== undefined && { legalName: data.legalName }),
      ...(data.industry && { industry: data.industry }),
      ...(compSize && { companySize: compSize }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.status && { status: data.status }),
    },
  });

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'ORGANIZATION_UPDATED',
      metadata: { organizationId, updatedFields: Object.keys(data) },
    });
  }

  return getProfile(updated.id);
};

export const resetProfile = async (organizationId, userId = null) => {
  const existing = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!existing) {
    throw ApiError.notFound('Organization not found', 'ORG_NOT_FOUND');
  }

  const reset = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      legalName: null,
      location: null,
      description: null,
      website: null,
    },
  });

  if (userId) {
    await logAuthEvent({
      userId,
      action: 'ORGANIZATION_RESET',
      metadata: { organizationId },
    });
  }

  return getProfile(reset.id);
};

export const getSnapshot = async (organizationId) => {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!org) {
    throw ApiError.notFound('Organization not found', 'ORG_NOT_FOUND');
  }

  const [membersCount, departments, skills] = await Promise.all([
    prisma.organizationMember.count({ where: { organizationId, status: 'ACTIVE' } }),
    prisma.department.findMany({ where: { organizationId } }),
    prisma.organizationSkill.findMany({ where: { organizationId } }),
  ]);

  const totalWorkforceCount = departments.reduce((acc, d) => acc + (d.headcount || 0), 0) || membersCount;
  const completeness = calculateProfileCompleteness(org);

  return {
    id: org.id,
    name: org.name,
    organizationId: org.id,
    organizationName: org.name,
    legalName: org.legalName,
    industry: org.industry,
    companySize: org.companySize,
    size: org.companySize,
    location: org.location || 'Not Specified',
    workforceCount: totalWorkforceCount,
    activeMembersCount: membersCount,
    departmentCount: departments.length,
    skillInventoryCount: skills.length,
    profileCompleteness: completeness,
    status: org.status,
  };
};

export default {
  calculateProfileCompleteness,
  getProfile,
  createProfile,
  updateProfile,
  resetProfile,
  getSnapshot,
};
