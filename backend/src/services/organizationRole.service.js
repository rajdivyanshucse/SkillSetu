import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export const formatRole = (role) => {
  const reqSkills = [];
  const prefSkills = [];

  (role.roleSkills || []).forEach((rs) => {
    const item = {
      skillId: rs.skillId,
      name: rs.skill?.name || 'Skill',
      category: rs.skill?.category || 'General',
      requirementType: rs.requirementType,
      importance: rs.importance,
      targetProficiency: rs.targetProficiency,
    };
    if (rs.requirementType === 'REQUIRED') {
      reqSkills.push(item);
    } else {
      prefSkills.push(item);
    }
  });

  return {
    id: role.id,
    organizationId: role.organizationId || null,
    departmentId: role.departmentId || null,
    departmentName: role.department?.name || null,
    name: role.name,
    title: role.name,
    category: role.category,
    description: role.description || null,
    experienceLevel: role.experienceLevel || 'Mid-Senior',
    minExperienceYears: role.minExperienceYears || (parseInt(role.experienceLevel, 10) || 8),
    importance: role.importance || 80,
    isActive: role.isActive,
    requiredSkills: reqSkills,
    preferredSkills: prefSkills,
    totalSkillsCount: reqSkills.length + prefSkills.length,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

export const getRoles = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 50);
  const skip = (page - 1) * limit;

  // Retrieve roles specific to this organization or global active benchmarks
  const where = {
    OR: [
      { organizationId },
      { organizationId: null },
    ],
  };

  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.category) where.category = query.category;

  const [total, roles] = await Promise.all([
    prisma.role.count({ where }),
    prisma.role.findMany({
      where,
      skip,
      take: limit,
      include: {
        department: true,
        roleSkills: { include: { skill: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const items = roles.map(formatRole);

  return {
    items,
    roles: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getRoleById = async (organizationId, roleId) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      department: true,
      roleSkills: { include: { skill: true } },
    },
  });

  if (!role || (role.organizationId && role.organizationId !== organizationId)) {
    throw ApiError.notFound('Role benchmark not found', 'ROLE_NOT_FOUND');
  }

  return formatRole(role);
};

export const createRole = async (organizationId, data) => {
  const roleName = data.name || data.title || 'Specialized Role';
  const norm = roleName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const importanceVal = typeof data.importance === 'string'
    ? (data.importance === 'CRITICAL' ? 95 : data.importance === 'HIGH' ? 80 : 60)
    : (data.importance || 80);

  const createdRole = await prisma.role.create({
    data: {
      organizationId,
      departmentId: data.departmentId || null,
      name: roleName,
      normalizedName: `${norm}-${organizationId.slice(0, 8)}`,
      category: data.category || 'Engineering',
      description: data.description || null,
      experienceLevel: data.experienceLevel || `${data.minExperienceYears || 8}+ Years`,
      importance: importanceVal,
      isActive: true,
    },
  });

  // Attach required & preferred skills
  const skillsToAdd = [
    ...(data.requiredSkills || []).map((s) => ({ ...s, requirementType: 'REQUIRED' })),
    ...(data.preferredSkills || []).map((s) => ({ ...s, requirementType: 'PREFERRED' })),
  ];

  for (const sk of skillsToAdd) {
    let skillId = sk.skillId;
    if (!skillId && sk.skillName) {
      const skNorm = sk.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      let foundSkill = await prisma.skill.findUnique({ where: { normalizedName: skNorm } });
      if (!foundSkill) {
        foundSkill = await prisma.skill.create({
          data: {
            name: sk.skillName,
            normalizedName: skNorm,
            category: data.category || 'General',
            isActive: true,
          },
        });
      }
      skillId = foundSkill.id;
    }

    if (skillId) {
      const impVal = typeof sk.importance === 'string'
        ? (sk.importance === 'CRITICAL' ? 95 : sk.importance === 'HIGH' ? 80 : 60)
        : (sk.importance || 80);
      const targetProf = sk.targetProficiency || (typeof sk.minProficiency === 'number' ? (sk.minProficiency >= 80 ? 'ADVANCED' : 'INTERMEDIATE') : 'INTERMEDIATE');

      await prisma.roleSkill.create({
        data: {
          roleId: createdRole.id,
          skillId,
          requirementType: sk.requirementType,
          importance: impVal,
          targetProficiency: targetProf,
        },
      });
    }
  }

  return getRoleById(organizationId, createdRole.id);
};

export const updateRole = async (organizationId, roleId, data) => {
  const existing = await prisma.role.findUnique({ where: { id: roleId } });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Role not found for update or is a global template', 'ROLE_NOT_FOUND');
  }

  const roleName = data.name || data.title;
  const importanceVal = data.importance !== undefined
    ? (typeof data.importance === 'string' ? (data.importance === 'CRITICAL' ? 95 : data.importance === 'HIGH' ? 80 : 60) : Number(data.importance))
    : undefined;

  const updatedRole = await prisma.role.update({
    where: { id: roleId },
    data: {
      ...(roleName && { name: roleName }),
      ...(data.category && { category: data.category }),
      ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.experienceLevel && { experienceLevel: data.experienceLevel }),
      ...(data.minExperienceYears && { experienceLevel: `${data.minExperienceYears}+ Years` }),
      ...(importanceVal !== undefined && { importance: importanceVal }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  if (data.requiredSkills || data.preferredSkills) {
    await prisma.roleSkill.deleteMany({ where: { roleId } });

    const skillsToAdd = [
      ...(data.requiredSkills || []).map((s) => ({ ...s, requirementType: 'REQUIRED' })),
      ...(data.preferredSkills || []).map((s) => ({ ...s, requirementType: 'PREFERRED' })),
    ];

    for (const sk of skillsToAdd) {
      let skillId = sk.skillId;
      if (!skillId && sk.skillName) {
        const skNorm = sk.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        let foundSkill = await prisma.skill.findUnique({ where: { normalizedName: skNorm } });
        if (!foundSkill) {
          foundSkill = await prisma.skill.create({
            data: {
              name: sk.skillName,
              normalizedName: skNorm,
              category: data.category || 'General',
              isActive: true,
            },
          });
        }
        skillId = foundSkill.id;
      }
      if (skillId) {
        await prisma.roleSkill.create({
          data: {
            roleId,
            skillId,
            requirementType: sk.requirementType,
            importance: sk.importance || 80,
            targetProficiency: sk.targetProficiency || 'INTERMEDIATE',
          },
        });
      }
    }
  }

  return getRoleById(organizationId, updatedRole.id);
};

export const deleteRole = async (organizationId, roleId) => {
  const existing = await prisma.role.findUnique({ where: { id: roleId } });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Role not found for deletion or is a protected global template', 'ROLE_NOT_FOUND');
  }

  const deleted = await prisma.role.delete({ where: { id: roleId } });

  return {
    id: deleted.id,
    message: 'Role successfully deleted',
  };
};

export const getRoleSemanticSkills = async (organizationId, roleId) => {
  const role = await getRoleById(organizationId, roleId);
  const requiredSkills = role.requiredSkills || [];
  const preferredSkills = role.preferredSkills || [];

  // Group required & preferred skills into clusters by category or domain
  const clusterSkills = (skillsList) => {
    const clustersMap = {};
    for (const sk of skillsList) {
      const cat = sk.category || 'General';
      if (!clustersMap[cat]) {
        clustersMap[cat] = { clusterName: cat, skills: [] };
      }
      clustersMap[cat].skills.push({
        skillId: sk.skillId,
        name: sk.name,
        importance: sk.importance,
        targetProficiency: sk.targetProficiency,
      });
    }
    return Object.values(clustersMap);
  };

  const requiredSkillClusters = clusterSkills(requiredSkills);
  const preferredSkillClusters = clusterSkills(preferredSkills);

  // Identify possible normalized duplicates or related skills across the taxonomy
  const allSkills = await prisma.skill.findMany({ where: { isActive: true } });
  const roleSkillNames = new Set([...requiredSkills, ...preferredSkills].map(s => s.name.toLowerCase()));
  const roleSkillNorms = new Set([...requiredSkills, ...preferredSkills].map(s => s.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

  const possibleNormalizedDuplicates = [];
  const relatedTaxonomySkills = [];

  for (const sk of allSkills) {
    const norm = sk.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isExact = roleSkillNames.has(sk.name.toLowerCase());
    
    if (!isExact && roleSkillNorms.has(norm)) {
      possibleNormalizedDuplicates.push({
        taxonomySkillId: sk.id,
        taxonomySkillName: sk.name,
        category: sk.category,
        reason: 'Normalized alphanumeric match with role skill',
      });
    } else if (!isExact) {
      // Check if skill shares category with role category
      if (sk.category === role.category && relatedTaxonomySkills.length < 8) {
        relatedTaxonomySkills.push({
          skillId: sk.id,
          name: sk.name,
          category: sk.category,
          relationType: 'CATEGORY_MATCH',
        });
      }
    }
  }

  return {
    roleId: role.id,
    roleName: role.name,
    category: role.category,
    requiredSkillSemanticClusters: requiredSkillClusters,
    preferredSkillSemanticClusters: preferredSkillClusters,
    relatedTaxonomySkills,
    possibleNormalizedDuplicates,
    analyzedAt: new Date().toISOString(),
    isExplorationSignal: true,
  };
};

export default {
  formatRole,
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleSemanticSkills,
};

