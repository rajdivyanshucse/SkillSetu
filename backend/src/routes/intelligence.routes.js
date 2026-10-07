import { Router } from 'express';
import * as intelligenceController from '../controllers/intelligence.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { roadmapProgressSchema } from '../validators/application.validator.js';

const router = Router();

// All individual intelligence routes require authentication and INDIVIDUAL account type
router.use(authenticate);
router.use(requireAccountType('INDIVIDUAL'));

/**
 * Skill Intelligence & Capability Coverage
 */
router.get('/skills', intelligenceController.getSkillIntelligence);
router.get('/skills/coverage', intelligenceController.getSkillCoverage);

/**
 * Skill Gap Analysis
 */
router.get('/skill-gaps', intelligenceController.getSkillGaps);
router.get('/skill-gaps/:skillId', intelligenceController.getSkillGapDetail);

/**
 * Career Intelligence
 */
router.get('/career', intelligenceController.getCareerIntelligence);
router.get('/career/semantic', intelligenceController.getCareerSemanticIntelligence);

/**
 * Career Roadmap & Learning Recommendations
 */
router.get('/roadmap', intelligenceController.getCareerRoadmap);
router.get('/roadmap/:roadmapId', intelligenceController.getRoadmapById);
router.patch('/roadmap/progress', validate(roadmapProgressSchema), intelligenceController.updateRoadmapProgress);
router.get('/learning/recommendations', intelligenceController.getLearningRecommendations);

export default router;
