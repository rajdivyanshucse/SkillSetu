import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { getCapabilityStatus } from './workforce.service.js';

export const calculateGapPriority = (gap, explicitPriority = 'MEDIUM') => {
  if (gap >= 30 || explicitPriority === 'CRITICAL') return 'CRITICAL';
  if (gap >= 20 || explicitPriority === 'HIGH') return 'HIGH';
  if (gap >= 10 || explicitPriority === 'MEDIUM') return 'MEDIUM';
  return 'LOW';
};

export const getDevelopmentRecommendation = (gap, priority, skillName) => {
  if (gap >= 30 || priority === 'CRITICAL') {
    return `Initiate immediate targeted talent acquisition and high-intensity bootcamp reskilling for ${skillName}.`;
  }
  if (gap >= 20 || priority === 'HIGH') {
    return `Launch structured internal ${skillName} development cohort and intermediate-to-advanced learning tracks.`;
  }
  if (gap >= 10 || priority === 'MEDIUM') {
    return `Conduct focused sprint workshops, peer code reviews, and hands-on modular projects in ${skillName}.`;
  }
  return `Maintain capability through self-paced learning paths and knowledge sharing sessions in ${skillName}.`;
};

export const formatSkillGap = (os, departments = []) => {
  const currentCapability = os.currentCapability || 0;
  const targetCapability = os.targetCapability || 80;
  const gap = Math.max(0, targetCapability - currentCapability);
  const gapPriority = calculateGapPriority(gap, os.priority);
  const skillName = os.skill?.name || 'Unknown Skill';
  const category = os.skill?.category || 'General';

  // Map affected department heuristically by category
  let affectedDepartments = [];
  if (category.toLowerCase().includes('frontend') || category.toLowerCase().includes('backend') || category.toLowerCase().includes('programming')) {
    const eng = departments.find((d) => d.name.toLowerCase().includes('engineering'));
    if (eng) affectedDepartments.push(eng.name);
  }
  if (category.toLowerCase().includes('devops') || category.toLowerCase().includes('cloud') || category.toLowerCase().includes('architecture')) {
    const cloud = departments.find((d) => d.name.toLowerCase().includes('cloud') || d.name.toLowerCase().includes('devops') || d.name.toLowerCase().includes('engineering'));
    if (cloud && !affectedDepartments.includes(cloud.name)) affectedDepartments.push(cloud.name);
  }
  if (affectedDepartments.length === 0 && departments.length > 0) {
    affectedDepartments.push(departments[0].name);
  }

  return {
    id: os.id,
    skillId: os.skillId,
    name: skillName,
    category,
    currentCapability,
    targetCapability,
    gap,
    gapPriority,
    priority: gapPriority,
    currentStatus: getCapabilityStatus(currentCapability),
    workforceCount: os.workforceCount || 0,
    affectedDepartments,
    affectedDepartment: affectedDepartments[0] || 'General',
    recommendedDevelopmentAction: getDevelopmentRecommendation(gap, gapPriority, skillName),
  };
};

export const getSkillGaps = async (organizationId, query = {}) => {
  const [orgSkills, departments] = await Promise.all([
    prisma.organizationSkill.findMany({
      where: { organizationId },
      include: { skill: true },
    }),
    prisma.department.findMany({
      where: { organizationId },
    }),
  ]);

  let gaps = orgSkills.map((os) => formatSkillGap(os, departments));

  if (query.priority) {
    const targetPri = query.priority.toUpperCase();
    gaps = gaps.filter((g) => g.gapPriority === targetPri);
  }

  if (query.category) {
    const cat = query.category.toLowerCase();
    gaps = gaps.filter((g) => g.category.toLowerCase() === cat);
  }

  // Sort by gap descending
  gaps.sort((a, b) => b.gap - a.gap);

  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;
  const total = gaps.length;
  const paginatedItems = gaps.slice(skip, skip + limit);

  const criticalCount = gaps.filter((g) => g.gapPriority === 'CRITICAL').length;
  const highCount = gaps.filter((g) => g.gapPriority === 'HIGH').length;
  const mediumCount = gaps.filter((g) => g.gapPriority === 'MEDIUM').length;
  const lowCount = gaps.filter((g) => g.gapPriority === 'LOW').length;

  return {
    items: paginatedItems,
    gaps: paginatedItems,
    summary: {
      totalGaps: total,
      criticalGaps: criticalCount,
      highGaps: highCount,
      mediumGaps: mediumCount,
      lowGaps: lowCount,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    methodologyNote: 'Deterministic organizational capability gap analysis. Not an employee performance assessment.',
  };
};

export const getSkillGapBySkillId = async (organizationId, skillId) => {
  let orgSkill = await prisma.organizationSkill.findFirst({
    where: {
      organizationId,
      skillId,
    },
    include: { skill: true },
  });

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
    throw ApiError.notFound('Tracked skill gap not found', 'SKILL_GAP_NOT_FOUND');
  }

  const departments = await prisma.department.findMany({
    where: { organizationId },
  });

  return formatSkillGap(orgSkill, departments);
};

export default {
  calculateGapPriority,
  getDevelopmentRecommendation,
  formatSkillGap,
  getSkillGaps,
  getSkillGapBySkillId,
};
