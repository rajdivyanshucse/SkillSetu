import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  extractSkillsSchema,
  analyzeResumeSchema,
  analyzeJobDescriptionSchema,
} from '../validators/ai.validator.js';
import aiController from '../controllers/ai.controller.js';

const router = Router();

/**
 * All AI routes require user authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/v1/ai/status
 * @desc    Check AI service connection and health
 * @access  Authenticated
 */
router.get('/status', aiController.getAiStatus);

/**
 * @route   POST /api/v1/ai/skills/extract
 * @desc    Extract and normalize skills from free-form text
 * @access  Individual or Organization
 */
router.post(
  '/skills/extract',
  requireAccountType('INDIVIDUAL', 'ORGANIZATION'),
  validate(extractSkillsSchema),
  aiController.extractSkills
);

/**
 * @route   POST /api/v1/ai/resume/analyze
 * @desc    Analyze raw resume text for individual career intelligence
 * @access  Individual
 */
router.post(
  '/resume/analyze',
  requireAccountType('INDIVIDUAL'),
  validate(analyzeResumeSchema),
  aiController.analyzeResume
);

/**
 * @route   POST /api/v1/ai/job-description/analyze
 * @desc    Analyze job description text for organization workforce requirements
 * @access  Organization (Viewer+)
 */
router.post(
  '/job-description/analyze',
  requireAccountType('ORGANIZATION'),
  requireOrganizationAccess('Viewer'),
  validate(analyzeJobDescriptionSchema),
  aiController.analyzeJobDescription
);

export default router;
