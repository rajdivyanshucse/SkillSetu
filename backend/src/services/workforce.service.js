import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Maps capability score (0-100) to deterministic status terminology:
 * Strong: 75+
 * Moderate: 50–74
 * Developing: 25–49
 * Limited: 0–24
 */
export const getCapabilityStatus = (capability) => {
  const score = Number(capability) || 0;
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Moderate';
  if (score >= 25) return 'Developing';
  return 'Limited';
};

export const formatOrgSkill = (os) => {
  const currentCapability = os.currentCapability || 0;
  const targetCapability = os.targetCapability || 80;
  const gap = Math.max(0, targetCapability - currentCapability);
  const coveragePct = targetCapability > 0 ? Math.min(100, Math.round((currentCapability / targetCapability) * 100)) : 100;
  const status = getCapabilityStatus(currentCapability);

  return {
    id: os.id,
    skillId: os.skillId,
    name: os.skill?.name || 'Unknown Skill',
    category: os.skill?.category || 'General',
    description: os.skill?.description || null,
    currentCapability,
    targetCapability,
    targetRequirement: targetCapability,
    workforceCount: os.workforceCount || 0,
    gap,
    coveragePct,
    coveragePercentage: currentCapability,
    status,
    priority: os.priority || 'MEDIUM',
    createdAt: os.createdAt,
    updatedAt: os.updatedAt,
  };
};

export const getWorkforce = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.priority) where.priority = query.priority.toUpperCase();
  if (query.skillId) where.skillId = query.skillId;

  const [total, orgSkills] = await Promise.all([
    prisma.organizationSkill.count({ where }),
    prisma.organizationSkill.findMany({
      where,
      skip,
      take: limit,
      include: {
        skill: true,
      },
    }),
  ]);

  let formatted = orgSkills.map(formatOrgSkill);

  if (query.status) {
    const targetStatus = query.status.toLowerCase();
    formatted = formatted.filter((item) => item.status.toLowerCase() === targetStatus);
  }

  if (query.category) {
    const cat = query.category.toLowerCase();
    formatted = formatted.filter((item) => item.category.toLowerCase() === cat);
  }

  const totalTracked = formatted.length;
  const averageCapability = totalTracked > 0
    ? Math.round(formatted.reduce((sum, s) => sum + s.currentCapability, 0) / totalTracked)
    : 0;

  return {
    items: formatted,
    skills: formatted,
    summary: {
      totalSkillsTracked: total,
      averageCapability,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getWorkforceSkillById = async (organizationId, skillId) => {
  let orgSkill = await prisma.organizationSkill.findFirst({
    where: {
      organizationId,
      skillId,
    },
    include: {
      skill: true,
    },
  });

  // Fallback: check by ID if skillId was the organizationSkill record ID
  if (!orgSkill) {
    orgSkill = await prisma.organizationSkill.findUnique({
      where: { id: skillId },
      include: { skill: true },
    });
    if (orgSkill && orgSkill.organizationId !== organizationId) {
      orgSkill = null;
    }
  }

  if (!orgSkill) {
    throw ApiError.notFound('Tracked workforce skill not found', 'WORKFORCE_SKILL_NOT_FOUND');
  }

  return formatOrgSkill(orgSkill);
};

export const createWorkforceSkill = async (organizationId, data) => {
  let targetSkillId = data.skillId;

  // Resolve skillId by name if only skillName was provided
  if (!targetSkillId && data.skillName) {
    const norm = data.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let skill = await prisma.skill.findUnique({
      where: { normalizedName: norm },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: data.skillName,
          normalizedName: norm,
          category: data.category || 'Specialized',
          description: `Workforce skill for ${data.skillName}`,
          isActive: true,
        },
      });
    }
    targetSkillId = skill.id;
  }

  // Check if skill is already tracked in this organization
  const existing = await prisma.organizationSkill.findFirst({
    where: {
      organizationId,
      skillId: targetSkillId,
    },
  });

  if (existing) {
    throw ApiError.conflict('This skill is already tracked in the workforce inventory', 'SKILL_ALREADY_TRACKED');
  }

  const currentCap = data.currentCapability !== undefined ? Number(data.currentCapability) : (data.coveragePercentage !== undefined ? Number(data.coveragePercentage) : 50);
  const targetCap = data.targetCapability !== undefined ? Number(data.targetCapability) : (data.targetRequirement !== undefined ? Number(data.targetRequirement) : 80);

  const created = await prisma.organizationSkill.create({
    data: {
      organizationId,
      skillId: targetSkillId,
      currentCapability: currentCap,
      targetCapability: targetCap,
      workforceCount: data.workforceCount !== undefined ? Number(data.workforceCount) : 0,
      priority: data.priority ? data.priority.toUpperCase() : (data.importance ? data.importance.toUpperCase() : 'MEDIUM'),
    },
    include: {
      skill: true,
    },
  });

  return formatOrgSkill(created);
};

export const updateWorkforceSkill = async (organizationId, skillId, data) => {
  let target = await prisma.organizationSkill.findFirst({
    where: {
      organizationId,
      skillId,
    },
  });

  if (!target) {
    target = await prisma.organizationSkill.findUnique({
      where: { id: skillId },
    });
    if (!target || target.organizationId !== organizationId) {
      throw ApiError.notFound('Tracked workforce skill not found for update', 'WORKFORCE_SKILL_NOT_FOUND');
    }
  }

  const currentCap = data.currentCapability !== undefined ? Number(data.currentCapability) : (data.coveragePercentage !== undefined ? Number(data.coveragePercentage) : undefined);
  const targetCap = data.targetCapability !== undefined ? Number(data.targetCapability) : (data.targetRequirement !== undefined ? Number(data.targetRequirement) : undefined);

  const updated = await prisma.organizationSkill.update({
    where: { id: target.id },
    data: {
      ...(currentCap !== undefined && { currentCapability: currentCap }),
      ...(targetCap !== undefined && { targetCapability: targetCap }),
      ...(data.workforceCount !== undefined && { workforceCount: Number(data.workforceCount) }),
      ...(data.priority && { priority: data.priority.toUpperCase() }),
    },
    include: {
      skill: true,
    },
  });

  return formatOrgSkill(updated);
};

export const deleteWorkforceSkill = async (organizationId, skillId) => {
  let target = await prisma.organizationSkill.findFirst({
    where: {
      organizationId,
      skillId,
    },
  });

  if (!target) {
    target = await prisma.organizationSkill.findUnique({
      where: { id: skillId },
    });
    if (!target || target.organizationId !== organizationId) {
      throw ApiError.notFound('Tracked workforce skill not found for deletion', 'WORKFORCE_SKILL_NOT_FOUND');
    }
  }

  const deleted = await prisma.organizationSkill.delete({
    where: { id: target.id },
  });

  return {
    id: deleted.id,
    message: 'Skill successfully removed from workforce inventory',
  };
};

export default {
  getCapabilityStatus,
  formatOrgSkill,
  getWorkforce,
  getWorkforceSkillById,
  createWorkforceSkill,
  updateWorkforceSkill,
  deleteWorkforceSkill,
};
