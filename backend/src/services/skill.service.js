import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { getProfile } from './profile.service.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Skill & Profile Taxonomy / Credential Services
 */

/**
 * Queries the centralized skill taxonomy catalog.
 */
export const getCatalogSkills = async ({ search, category, page = 1, limit = 20, isActive = true }) => {
  const skip = (page - 1) * limit;
  const where = {
    isActive,
    ...(category && { category }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [skills, total] = await Promise.all([
    prisma.skill.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: Math.min(100, limit),
    }),
    prisma.skill.count({ where }),
  ]);

  return {
    skills,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Retrieves a single skill by ID.
 */
export const getSkillById = async (skillId) => {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) throw ApiError.notFound('Skill not found in catalog', 'SKILL_NOT_FOUND');
  return skill;
};

/**
 * Retrieves all skills for the authenticated user.
 */
export const getUserSkills = async (userId) => {
  const profile = await getProfile(userId);
  const userSkills = await prisma.userSkill.findMany({
    where: { profileId: profile.id },
    include: { skill: true },
  });
  return userSkills;
};

/**
 * Associates a skill from the catalog with the user's profile.
 */
export const addUserSkill = async (userId, { skillId, proficiency = 'INTERMEDIATE', yearsOfExperience = 1, isVerified = false }) => {
  const profile = await getProfile(userId);

  // Verify skill exists in catalog
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    throw ApiError.notFound('Skill does not exist in the master catalog', 'SKILL_NOT_FOUND');
  }

  // Check duplicate
  const existing = await prisma.userSkill.findUnique({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('This skill is already attached to your profile', 'SKILL_ALREADY_EXISTS');
  }

  const userSkill = await prisma.userSkill.create({
    data: {
      profileId: profile.id,
      skillId,
      proficiency,
      yearsOfExperience,
      isVerified,
    },
    include: { skill: true },
  });

  await logAuthEvent({
    userId,
    action: 'SKILL_ADDED',
    metadata: { skillName: skill.name, proficiency },
  });

  return userSkill;
};

/**
 * Updates an existing user skill.
 */
export const updateUserSkill = async (userId, skillId, data) => {
  const profile = await getProfile(userId);

  const existing = await prisma.userSkill.findUnique({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });

  if (!existing) {
    throw ApiError.notFound('Skill is not associated with your profile', 'USER_SKILL_NOT_FOUND');
  }

  const updated = await prisma.userSkill.update({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
    data,
    include: { skill: true },
  });

  return updated;
};

/**
 * Removes a skill from the user's profile.
 */
export const removeUserSkill = async (userId, skillId) => {
  const profile = await getProfile(userId);

  const existing = await prisma.userSkill.findUnique({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });

  if (!existing) {
    throw ApiError.notFound('Skill not found in user profile', 'USER_SKILL_NOT_FOUND');
  }

  await prisma.userSkill.delete({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });

  await logAuthEvent({
    userId,
    action: 'SKILL_REMOVED',
    metadata: { skillId },
  });

  return { message: 'Skill removed from profile successfully' };
};

// ==========================================
// EXPERIENCE & EDUCATION MANAGEMENT
// ==========================================

export const getExperiences = async (userId) => {
  const profile = await getProfile(userId);
  return prisma.experience.findMany({
    where: { profileId: profile.id },
    orderBy: { startDate: 'desc' },
  });
};

export const addExperience = async (userId, data) => {
  const profile = await getProfile(userId);
  return prisma.experience.create({
    data: {
      profileId: profile.id,
      ...data,
    },
  });
};

export const updateExperience = async (userId, experienceId, data) => {
  const profile = await getProfile(userId);
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });

  if (!exp || exp.profileId !== profile.id) {
    throw ApiError.notFound('Experience record not found or unauthorized', 'EXPERIENCE_NOT_FOUND');
  }

  return prisma.experience.update({
    where: { id: experienceId },
    data,
  });
};

export const deleteExperience = async (userId, experienceId) => {
  const profile = await getProfile(userId);
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });

  if (!exp || exp.profileId !== profile.id) {
    throw ApiError.notFound('Experience record not found or unauthorized', 'EXPERIENCE_NOT_FOUND');
  }

  await prisma.experience.delete({ where: { id: experienceId } });
  return { message: 'Experience record removed successfully' };
};

export const getEducations = async (userId) => {
  const profile = await getProfile(userId);
  return prisma.education.findMany({
    where: { profileId: profile.id },
    orderBy: { startDate: 'desc' },
  });
};

export const addEducation = async (userId, data) => {
  const profile = await getProfile(userId);
  return prisma.education.create({
    data: {
      profileId: profile.id,
      ...data,
    },
  });
};

export const updateEducation = async (userId, educationId, data) => {
  const profile = await getProfile(userId);
  const edu = await prisma.education.findUnique({ where: { id: educationId } });

  if (!edu || edu.profileId !== profile.id) {
    throw ApiError.notFound('Education record not found or unauthorized', 'EDUCATION_NOT_FOUND');
  }

  return prisma.education.update({
    where: { id: educationId },
    data,
  });
};

export const deleteEducation = async (userId, educationId) => {
  const profile = await getProfile(userId);
  const edu = await prisma.education.findUnique({ where: { id: educationId } });

  if (!edu || edu.profileId !== profile.id) {
    throw ApiError.notFound('Education record not found or unauthorized', 'EDUCATION_NOT_FOUND');
  }

  await prisma.education.delete({ where: { id: educationId } });
  return { message: 'Education record removed successfully' };
};

export default {
  getCatalogSkills,
  getSkillById,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  removeUserSkill,
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
};
