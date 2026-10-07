import { Router } from 'express';
import * as skillController from '../controllers/skill.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { skillQuerySchema } from '../validators/skill.validator.js';

const router = Router();

// Master skill catalog endpoints (authenticated access)
router.use(authenticate);

router.get('/semantic-search', skillController.semanticSearchSkills);
router.get('/', validate(skillQuerySchema), skillController.getCatalogSkills);
router.get('/:skillId', skillController.getSkillById);

export default router;
