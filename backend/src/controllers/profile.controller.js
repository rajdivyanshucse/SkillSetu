import profileService from '../services/profile.service.js';
import skillService from '../services/skill.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Individual profile retrieved',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const createProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Individual profile created successfully',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Individual profile updated successfully',
      data: { profile },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const result = await profileService.deleteProfile(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export const getProfileSnapshot = async (req, res, next) => {
  try {
    const snapshot = await profileService.getProfileSnapshot(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Profile snapshot retrieved',
      data: { snapshot },
    });
  } catch (error) {
    return next(error);
  }
};

export const getTargetRole = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Target role retrieved',
      data: { targetRole: profile.targetRole },
    });
  } catch (error) {
    return next(error);
  }
};

export const setTargetRole = async (req, res, next) => {
  try {
    const result = await profileService.setTargetRole(req.user.id, req.body.targetRoleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Target role updated successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

// User Skills Endpoints under /profile/skills
export const getUserSkills = async (req, res, next) => {
  try {
    const skills = await skillService.getUserSkills(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'User skills retrieved',
      data: { skills },
    });
  } catch (error) {
    return next(error);
  }
};

export const addUserSkill = async (req, res, next) => {
  try {
    const userSkill = await skillService.addUserSkill(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Skill added to profile successfully',
      data: { userSkill },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserSkill = async (req, res, next) => {
  try {
    const userSkill = await skillService.updateUserSkill(req.user.id, req.params.skillId, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skill updated successfully',
      data: { userSkill },
    });
  } catch (error) {
    return next(error);
  }
};

export const removeUserSkill = async (req, res, next) => {
  try {
    const result = await skillService.removeUserSkill(req.user.id, req.params.skillId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

// Experience Endpoints under /profile/experience
export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await skillService.getExperiences(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Experience records retrieved',
      data: { experiences },
    });
  } catch (error) {
    return next(error);
  }
};

export const addExperience = async (req, res, next) => {
  try {
    const experience = await skillService.addExperience(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Experience record added successfully',
      data: { experience },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const experience = await skillService.updateExperience(req.user.id, req.params.experienceId, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Experience record updated successfully',
      data: { experience },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const result = await skillService.deleteExperience(req.user.id, req.params.experienceId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

// Education Endpoints under /profile/education
export const getEducations = async (req, res, next) => {
  try {
    const educations = await skillService.getEducations(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Education credentials retrieved',
      data: { educations },
    });
  } catch (error) {
    return next(error);
  }
};

export const addEducation = async (req, res, next) => {
  try {
    const education = await skillService.addEducation(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Education credential added successfully',
      data: { education },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateEducation = async (req, res, next) => {
  try {
    const education = await skillService.updateEducation(req.user.id, req.params.educationId, req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Education credential updated successfully',
      data: { education },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteEducation = async (req, res, next) => {
  try {
    const result = await skillService.deleteEducation(req.user.id, req.params.educationId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProfileSnapshot,
  getTargetRole,
  setTargetRole,
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
