import { Router } from 'express';
import * as profileController from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createProfileSchema,
  updateProfileSchema,
  targetRoleSchema,
} from '../validators/profile.validator.js';
import {
  addUserSkillSchema,
  updateUserSkillSchema,
} from '../validators/skill.validator.js';
import {
  experienceSchema,
  updateExperienceSchema,
} from '../validators/experience.validator.js';
import {
  educationSchema,
  updateEducationSchema,
} from '../validators/education.validator.js';

const router = Router();

// All profile endpoints require authentication and INDIVIDUAL account type
router.use(authenticate);
router.use(requireAccountType('INDIVIDUAL'));

/**
 * Core Profile Endpoints
 */
router.get('/', profileController.getProfile);
router.post('/', validate(createProfileSchema), profileController.createProfile);
router.patch('/', validate(updateProfileSchema), profileController.updateProfile);
router.delete('/', profileController.deleteProfile);
router.get('/snapshot', profileController.getProfileSnapshot);

/**
 * Target Roles
 */
router.get('/target-roles', profileController.getTargetRole);
router.put('/target-roles', validate(targetRoleSchema), profileController.setTargetRole);

/**
 * User Skills
 */
router.get('/skills', profileController.getUserSkills);
router.post('/skills', validate(addUserSkillSchema), profileController.addUserSkill);
router.patch('/skills/:skillId', validate(updateUserSkillSchema), profileController.updateUserSkill);
router.delete('/skills/:skillId', profileController.removeUserSkill);

/**
 * Work Experience
 */
router.get('/experience', profileController.getExperiences);
router.post('/experience', validate(experienceSchema), profileController.addExperience);
router.patch('/experience/:experienceId', validate(updateExperienceSchema), profileController.updateExperience);
router.delete('/experience/:experienceId', profileController.deleteExperience);

/**
 * Education & Academic Credentials
 */
router.get('/education', profileController.getEducations);
router.post('/education', validate(educationSchema), profileController.addEducation);
router.patch('/education/:educationId', validate(updateEducationSchema), profileController.updateEducation);
router.delete('/education/:educationId', profileController.deleteEducation);

export default router;
