import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { requireAccountType, requireOrganizationAccess } from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import talentController from '../controllers/talent.controller.js';
import {
  candidateParamSchema,
  listTalentQuerySchema,
  compareTalentQuerySchema,
  candidateCompatibilityQuerySchema,
  shortlistBodySchema,
  listShortlistQuerySchema,
} from '../validators/talent.validator.js';

const router = Router();

router.use(authenticate);
router.use(requireAccountType('ORGANIZATION'));

// 1. Talent Pool & Search
router.get(
  '/',
  requireOrganizationAccess('Viewer'),
  validate(listTalentQuerySchema),
  talentController.getTalentPool
);

// 2. Candidate Comparison
router.get(
  '/compare',
  requireOrganizationAccess('Viewer'),
  validate(compareTalentQuerySchema),
  talentController.compareCandidates
);

// 3. Shortlist Management
router.get(
  '/shortlist',
  requireOrganizationAccess('Viewer'),
  validate(listShortlistQuerySchema),
  talentController.getShortlist
);

// 4. Candidate Details & Compatibility
router.get(
  '/:candidateId',
  requireOrganizationAccess('Viewer'),
  validate(candidateParamSchema),
  talentController.getCandidateById
);

router.get(
  '/:candidateId/compatibility',
  requireOrganizationAccess('Viewer'),
  validate(candidateCompatibilityQuerySchema),
  talentController.getCandidateCompatibility
);

router.get(
  '/:candidateId/semantic-compatibility',
  requireOrganizationAccess('Viewer'),
  validate(candidateCompatibilityQuerySchema),
  talentController.getCandidateSemanticCompatibility
);

router.post(
  '/:candidateId/shortlist',
  requireOrganizationAccess('Editor'),
  validate(shortlistBodySchema),
  talentController.addToShortlist
);

router.delete(
  '/:candidateId/shortlist',
  requireOrganizationAccess('Editor'),
  validate(candidateParamSchema),
  talentController.removeFromShortlist
);

export default router;
