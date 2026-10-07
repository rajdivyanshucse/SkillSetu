import { Router } from 'express';
import { checkHealth, checkReadiness } from '../controllers/health.controller.js';
import { validate } from '../middleware/validate.js';
import { healthQuerySchema } from '../validators/health.validator.js';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    API health check & system availability
 * @access  Public
 */
router.get('/', validate(healthQuerySchema), checkHealth);

/**
 * @route   GET /api/v1/health/ready
 * @desc    Readiness probe for dependency health
 * @access  Public
 */
router.get('/ready', checkReadiness);

export default router;
