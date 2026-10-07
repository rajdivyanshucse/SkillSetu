import { Router } from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAccountType } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../validators/application.validator.js';

const router = Router();

// Individual Applications management
router.use(authenticate);
router.use(requireAccountType('INDIVIDUAL'));

router.get('/', applicationController.getUserApplications);
router.post('/', validate(createApplicationSchema), applicationController.createApplication);
router.patch('/:applicationId', validate(updateApplicationSchema), applicationController.updateApplication);
router.delete('/:applicationId', applicationController.deleteApplication);

export default router;
