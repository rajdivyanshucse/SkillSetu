import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Calculates a deterministic completeness score (0-100) based on actual stored profile components.
 * Weight Distribution:
 * - Basic Identity & Headline: 20 pts
 * - Target Role & Industry: 15 pts
 * - Skills (at least 3 skills): 20 pts
 * - Work Experience (at least 1 experience): 20 pts
 * - Education (at least 1 credential): 15 pts
 * - Goals & Preferences: 10 pts
 */
export const calculateProfileCompleteness = (profile, skillsCount = 0, experienceCount = 0, educationCount = 0) => {
  if (!profile) return 0;
  let score = 0;

  // 1. Basic Identity & Location (20 pts)
  if (profile.fullName && profile.fullName.trim().length > 0) score += 10;
  if (profile.headline && profile.headline.trim().length > 0) score += 5;
  if (profile.location && profile.location.trim().length > 0) score += 5;

  // 2. Target Role & Industry (15 pts)
  if (profile.targetRoleId) score += 10;
  if (profile.targetIndustry) score += 5;

  // 3. Skills (20 pts)
  if (skillsCount >= 5) score += 20;
  else if (skillsCount >= 3) score += 15;
  else if (skillsCount >= 1) score += 10;

  // 4. Experience (20 pts)
  if (experienceCount >= 2) score += 20;
  else if (experienceCount >= 1) score += 15;

  // 5. Education (15 pts)
  if (educationCount >= 1) score += 15;

  // 6. Career Goals & Summary (10 pts)
  if (profile.experienceSummary && profile.experienceSummary.length > 20) score += 5;
  if (profile.careerGoals && profile.careerGoals.length > 0) score += 5;

  return Math.min(100, score);
};

/**
 * Retrieves the full individual profile for the authenticated user.
 * @param {string} userId
 */
export const getProfile = async (userId) => {
  let profile = await prisma.individualProfile.findUnique({
    where: { userId },
    include: {
      targetRole: true,
      skills: {
        include: { skill: true },
      },
      experiences: {
        orderBy: { startDate: 'desc' },
      },
      educations: {
        orderBy: { startDate: 'desc' },
      },
      milestones: true,
      projects: true,
    },
  });

  if (!profile) {
    // Auto-create foundation profile if not exists yet
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
    const defaultName = user.email.split('@')[0];
    profile = await prisma.individualProfile.create({
      data: {
        userId,
        fullName: defaultName,
        completeness: 20,
      },
      include: {
        targetRole: true,
        skills: { include: { skill: true } },
        experiences: true,
        educations: true,
      },
    });
  }

  // Recalculate completeness
  const completeness = calculateProfileCompleteness(
    profile,
    profile.skills?.length || 0,
    profile.experiences?.length || 0,
    profile.educations?.length || 0
  );

  if (profile.completeness !== completeness) {
    await prisma.individualProfile.update({
      where: { userId },
      data: { completeness },
    });
    profile.completeness = completeness;
  }

  return profile;
};

/**
 * Creates or updates an individual profile.
 * @param {string} userId
 * @param {Object} data
 */
export const updateProfile = async (userId, data) => {
  const existing = await prisma.individualProfile.findUnique({
    where: { userId },
    include: {
      skills: true,
      experiences: true,
      educations: true,
    },
  });

  const skillsCount = existing?.skills?.length || 0;
  const expCount = existing?.experiences?.length || 0;
  const eduCount = existing?.educations?.length || 0;

  const completeness = calculateProfileCompleteness(
    { ...(existing || {}), ...data },
    skillsCount,
    expCount,
    eduCount
  );

  let updated;
  if (existing) {
    updated = await prisma.individualProfile.update({
      where: { userId },
      data: {
        ...data,
        completeness,
      },
      include: {
        targetRole: true,
        skills: { include: { skill: true } },
        experiences: true,
        educations: true,
      },
    });
  } else {
    updated = await prisma.individualProfile.create({
      data: {
        userId,
        fullName: data.fullName || 'Individual User',
        ...data,
        completeness,
      },
      include: {
        targetRole: true,
        skills: { include: { skill: true } },
        experiences: true,
        educations: true,
      },
    });
  }

  await logAuthEvent({
    userId,
    action: 'PROFILE_UPDATED',
    metadata: { completeness },
  });

  return updated;
};

/**
 * Deletes/resets an individual profile.
 * @param {string} userId
 */
export const deleteProfile = async (userId) => {
  const profile = await prisma.individualProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw ApiError.notFound('Profile not found', 'PROFILE_NOT_FOUND');
  }

  await prisma.individualProfile.delete({ where: { userId } });
  return { message: 'Profile reset successfully' };
};

/**
 * Sets the primary target role for the individual profile.
 * @param {string} userId
 * @param {string} targetRoleId
 */
export const setTargetRole = async (userId, targetRoleId) => {
  const role = await prisma.role.findUnique({ where: { id: targetRoleId } });
  if (!role) {
    throw ApiError.notFound('Target role not found in system catalog', 'ROLE_NOT_FOUND');
  }

  const updated = await updateProfile(userId, { targetRoleId });
  return {
    targetRole: role,
    profile: updated,
  };
};

/**
 * Retrieves a compact snapshot summary for dashboard widgets.
 * @param {string} userId
 */
export const getProfileSnapshot = async (userId) => {
  const profile = await getProfile(userId);
  const savedCount = await prisma.savedOpportunity.count({ where: { userId } });
  const appCount = await prisma.application.count({ where: { userId } });
  const skillCount = profile.skills?.length || 0;

  return {
    fullName: profile.fullName,
    headline: profile.headline,
    location: profile.location,
    completeness: profile.completeness,
    targetRole: profile.targetRole ? { id: profile.targetRole.id, name: profile.targetRole.name, category: profile.targetRole.category } : null,
    skillCount,
    savedOpportunityCount: savedCount,
    applicationCount: appCount,
    updatedAt: profile.updatedAt,
  };
};

export default {
  calculateProfileCompleteness,
  getProfile,
  updateProfile,
  deleteProfile,
  setTargetRole,
  getProfileSnapshot,
};
