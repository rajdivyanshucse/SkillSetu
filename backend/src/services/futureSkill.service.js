import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { getCapabilityStatus } from './workforce.service.js';

export const formatFutureSkill = (fs, departments = []) => {
  const currentCapability = fs.currentCapability || 0;
  const requiredCapability = fs.requiredCapability || 80;
  const readinessGap = Math.max(0, requiredCapability - currentCapability);
  const skillName = fs.skill?.name || 'Unknown Skill';
  const category = fs.skill?.category || 'General';

  // Map affected department heuristically by category
  let affectedDepartments = [];
  if (category.toLowerCase().includes('cloud') || category.toLowerCase().includes('devops') || category.toLowerCase().includes('architecture')) {
    const cloudDept = departments.find((d) => d.name.toLowerCase().includes('cloud') || d.name.toLowerCase().includes('devops') || d.name.toLowerCase().includes('engineering'));
    if (cloudDept) affectedDepartments.push(cloudDept.name);
  }
  if (category.toLowerCase().includes('engineering') || category.toLowerCase().includes('programming') || category.toLowerCase().includes('backend')) {
    const engDept = departments.find((d) => d.name.toLowerCase().includes('engineering'));
    if (engDept && !affectedDepartments.includes(engDept.name)) affectedDepartments.push(engDept.name);
  }
  if (affectedDepartments.length === 0 && departments.length > 0) {
    affectedDepartments.push(departments[0].name);
  }

  let horizonLabel = '12 Months';
  if (fs.planningHorizon === 'MONTHS_6') horizonLabel = '6 Months';
  else if (fs.planningHorizon === 'MONTHS_24') horizonLabel = '24 Months';
  else if (fs.planningHorizon === 'MONTHS_36') horizonLabel = '36 Months';

  return {
    id: fs.id,
    skillId: fs.skillId,
    skillName,
    category,
    planningHorizon: fs.planningHorizon,
    planningHorizonLabel: horizonLabel,
    expectedDemandHorizon: horizonLabel === '24 Months' ? '2-3 Years' : horizonLabel,
    priority: fs.priority || 'HIGH',
    currentCapability,
    currentCapabilityScore: currentCapability,
    requiredCapability,
    futureRequirementScore: requiredCapability,
    readinessGap,
    readinessStatus: getCapabilityStatus(currentCapability),
    affectedDepartments,
    affectedDepartment: affectedDepartments[0] || 'General',
    notes: fs.notes || 'Planning Assumption: strategic roadmap projection',
    planningAssumption: fs.notes || 'Planning Assumption: strategic roadmap projection',
    type: 'Planning Assumption',
    createdAt: fs.createdAt,
    updatedAt: fs.updatedAt,
  };
};

export const getFutureSkills = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.horizon) where.planningHorizon = query.horizon;
  if (query.priority) where.priority = query.priority.toUpperCase();

  const [total, futureSkills, departments] = await Promise.all([
    prisma.futureSkill.count({ where }),
    prisma.futureSkill.findMany({
      where,
      skip,
      take: limit,
      include: { skill: true },
    }),
    prisma.department.findMany({ where: { organizationId } }),
  ]);

  const items = futureSkills.map((fs) => formatFutureSkill(fs, departments));

  return {
    items,
    futureSkills: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    methodologyNote: 'Planning Assumptions provided by organizational workforce strategy. Not live external market telemetry.',
  };
};

export const getFutureSkillById = async (organizationId, futureSkillId) => {
  const [fs, departments] = await Promise.all([
    prisma.futureSkill.findUnique({
      where: { id: futureSkillId },
      include: { skill: true },
    }),
    prisma.department.findMany({ where: { organizationId } }),
  ]);

  if (!fs || fs.organizationId !== organizationId) {
    throw ApiError.notFound('Future skill requirement not found', 'FUTURE_SKILL_NOT_FOUND');
  }

  return formatFutureSkill(fs, departments);
};

const normalizeHorizon = (h) => {
  if (!h) return 'MONTHS_12';
  const str = String(h).toUpperCase();
  if (str.includes('6') || str.includes('HALF')) return 'MONTHS_6';
  if (str.includes('2') || str.includes('3') || str.includes('24') || str.includes('YEARS')) return 'MONTHS_24';
  if (str.includes('36')) return 'MONTHS_36';
  if (str.includes('12') || str.includes('1') || str.includes('YEAR')) return 'MONTHS_12';
  return 'MONTHS_12';
};

export const createFutureSkill = async (organizationId, data) => {
  let targetSkillId = data.skillId;

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
          category: data.category || 'Strategic',
          description: `Future strategic skill: ${data.skillName}`,
          isActive: true,
        },
      });
    }
    targetSkillId = skill.id;
  }

  const rawHorizon = data.planningHorizon || data.expectedDemandHorizon || 'MONTHS_12';
  const planningHorizon = normalizeHorizon(rawHorizon);

  // Check if unique constraint exists
  const existing = await prisma.futureSkill.findUnique({
    where: {
      organizationId_skillId_planningHorizon: {
        organizationId,
        skillId: targetSkillId,
        planningHorizon,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('A future skill projection already exists for this skill and planning horizon', 'FUTURE_SKILL_EXISTS');
  }

  const reqCap = data.requiredCapability !== undefined ? data.requiredCapability : data.futureRequirementScore;
  const curCap = data.currentCapability !== undefined ? data.currentCapability : data.currentCapabilityScore;
  const notesText = data.notes || data.planningAssumption || data.developmentRecommendation || 'Planning Assumption: strategic roadmap projection';

  const created = await prisma.futureSkill.create({
    data: {
      organizationId,
      skillId: targetSkillId,
      planningHorizon,
      priority: data.priority ? data.priority.toUpperCase() : 'HIGH',
      requiredCapability: reqCap !== undefined ? Number(reqCap) : 80,
      currentCapability: curCap !== undefined ? Number(curCap) : 30,
      notes: notesText,
    },
    include: { skill: true },
  });

  const departments = await prisma.department.findMany({ where: { organizationId } });
  return formatFutureSkill(created, departments);
};

export const updateFutureSkill = async (organizationId, futureSkillId, data) => {
  const existing = await prisma.futureSkill.findUnique({
    where: { id: futureSkillId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Future skill projection not found for update', 'FUTURE_SKILL_NOT_FOUND');
  }

  const rawHorizon = data.planningHorizon || data.expectedDemandHorizon;
  const planningHorizon = rawHorizon ? normalizeHorizon(rawHorizon) : undefined;
  const reqCap = data.requiredCapability !== undefined ? data.requiredCapability : data.futureRequirementScore;
  const curCap = data.currentCapability !== undefined ? data.currentCapability : data.currentCapabilityScore;
  const notesText = data.notes || data.planningAssumption || data.developmentRecommendation;

  const updated = await prisma.futureSkill.update({
    where: { id: futureSkillId },
    data: {
      ...(planningHorizon && { planningHorizon }),
      ...(data.priority && { priority: data.priority.toUpperCase() }),
      ...(reqCap !== undefined && { requiredCapability: Number(reqCap) }),
      ...(curCap !== undefined && { currentCapability: Number(curCap) }),
      ...(notesText !== undefined && { notes: notesText }),
    },
    include: { skill: true },
  });

  const departments = await prisma.department.findMany({ where: { organizationId } });
  return formatFutureSkill(updated, departments);
};

export const deleteFutureSkill = async (organizationId, futureSkillId) => {
  const existing = await prisma.futureSkill.findUnique({
    where: { id: futureSkillId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Future skill projection not found for deletion', 'FUTURE_SKILL_NOT_FOUND');
  }

  const deleted = await prisma.futureSkill.delete({
    where: { id: futureSkillId },
  });

  return {
    id: deleted.id,
    message: 'Future skill projection successfully removed',
  };
};

export default {
  formatFutureSkill,
  getFutureSkills,
  getFutureSkillById,
  createFutureSkill,
  updateFutureSkill,
  deleteFutureSkill,
};
