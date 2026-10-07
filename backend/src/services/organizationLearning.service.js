import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export const getLearningOverview = async (organizationId) => {
  const [programs, orgSkills] = await Promise.all([
    prisma.organizationLearningProgram.findMany({
      where: { organizationId },
      include: { targetSkill: true },
    }),
    prisma.organizationSkill.findMany({
      where: { organizationId },
      include: { skill: true },
    }),
  ]);

  const totalEnrolled = programs.reduce((acc, p) => acc + (p.enrolledCount || 0), 0);
  const totalCompleted = programs.reduce((acc, p) => acc + (p.completedCount || 0), 0);
  const overallCompletionRatePct = totalEnrolled > 0 ? Math.min(100, Math.round((totalCompleted / totalEnrolled) * 100)) : 0;

  // Link programs to identified capability gaps
  const skillGapMap = new Map();
  orgSkills.forEach((os) => {
    const gap = Math.max(0, (os.targetCapability || 80) - (os.currentCapability || 0));
    skillGapMap.set(os.skillId, {
      currentCapability: os.currentCapability,
      targetCapability: os.targetCapability,
      gap,
    });
  });

  const formattedPrograms = programs.map((p) => {
    const gapInfo = p.targetSkillId ? skillGapMap.get(p.targetSkillId) : null;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      targetSkillId: p.targetSkillId,
      targetSkillName: p.targetSkill?.name || 'Cross-Functional',
      targetCapability: p.targetCapability,
      enrolledCount: p.enrolledCount,
      completedCount: p.completedCount,
      completionRatePct: p.enrolledCount > 0 ? Math.min(100, Math.round((p.completedCount / p.enrolledCount) * 100)) : 0,
      status: p.status,
      linkedCapabilityGap: gapInfo?.gap || 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  });

  const activeCount = programs.filter((p) => p.status === 'ACTIVE').length;

  return {
    totalActivePrograms: activeCount,
    summary: {
      totalPrograms: programs.length,
      activePrograms: activeCount,
      totalEnrolledLearners: totalEnrolled,
      totalCompletedLearners: totalCompleted,
      overallCompletionRatePct,
    },
    programs: formattedPrograms,
    methodologyNote: 'Organization learning programs mapped directly to address strategic capability gaps.',
  };
};

export const getPrograms = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.status) where.status = query.status.toUpperCase();

  const [total, programs] = await Promise.all([
    prisma.organizationLearningProgram.count({ where }),
    prisma.organizationLearningProgram.findMany({
      where,
      skip,
      take: limit,
      include: { targetSkill: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const items = programs.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    targetSkillId: p.targetSkillId,
    targetSkillName: p.targetSkill?.name || 'Cross-Functional',
    targetCapability: p.targetCapability,
    enrolledCount: p.enrolledCount,
    completedCount: p.completedCount,
    completionRatePct: p.enrolledCount > 0 ? Math.min(100, Math.round((p.completedCount / p.enrolledCount) * 100)) : 0,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return {
    items,
    programs: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getProgramById = async (organizationId, programId) => {
  const p = await prisma.organizationLearningProgram.findUnique({
    where: { id: programId },
    include: { targetSkill: true },
  });

  if (!p || p.organizationId !== organizationId) {
    throw ApiError.notFound('Learning program not found', 'PROGRAM_NOT_FOUND');
  }

  return {
    id: p.id,
    organizationId: p.organizationId,
    title: p.title,
    description: p.description,
    targetSkillId: p.targetSkillId,
    targetSkillName: p.targetSkill?.name || 'Cross-Functional',
    targetCapability: p.targetCapability,
    enrolledCount: p.enrolledCount,
    completedCount: p.completedCount,
    completionRatePct: p.enrolledCount > 0 ? Math.min(100, Math.round((p.completedCount / p.enrolledCount) * 100)) : 0,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

export const createProgram = async (organizationId, data) => {
  const created = await prisma.organizationLearningProgram.create({
    data: {
      organizationId,
      title: data.title,
      description: data.description || null,
      targetSkillId: data.targetSkillId || null,
      targetCapability: data.targetCapability !== undefined ? Number(data.targetCapability) : 80,
      enrolledCount: data.enrolledCount !== undefined ? Number(data.enrolledCount) : 0,
      completedCount: data.completedCount !== undefined ? Number(data.completedCount) : 0,
      status: data.status || 'ACTIVE',
    },
    include: { targetSkill: true },
  });

  return getProgramById(organizationId, created.id);
};

export const updateProgram = async (organizationId, programId, data) => {
  const existing = await prisma.organizationLearningProgram.findUnique({
    where: { id: programId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Learning program not found for update', 'PROGRAM_NOT_FOUND');
  }

  const updated = await prisma.organizationLearningProgram.update({
    where: { id: programId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.targetSkillId !== undefined && { targetSkillId: data.targetSkillId }),
      ...(data.targetCapability !== undefined && { targetCapability: Number(data.targetCapability) }),
      ...(data.enrolledCount !== undefined && { enrolledCount: Number(data.enrolledCount) }),
      ...(data.completedCount !== undefined && { completedCount: Number(data.completedCount) }),
      ...(data.status && { status: data.status }),
    },
    include: { targetSkill: true },
  });

  return getProgramById(organizationId, updated.id);
};

export const deleteProgram = async (organizationId, programId) => {
  const existing = await prisma.organizationLearningProgram.findUnique({
    where: { id: programId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Learning program not found for deletion', 'PROGRAM_NOT_FOUND');
  }

  const deleted = await prisma.organizationLearningProgram.delete({
    where: { id: programId },
  });

  return {
    id: deleted.id,
    message: 'Learning program successfully deleted',
  };
};

export default {
  getLearningOverview,
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
