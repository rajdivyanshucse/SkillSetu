import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authRateLimiter } from '../middleware/authRateLimiter.js';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailRequestSchema,
  verifyEmailConfirmSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  sessionIdParamSchema,
} from '../validators/auth.validator.js';

const router = Router();

/**
 * Public Authentication Endpoints
 */
router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  validate(refreshSchema),
  authController.refresh
);

router.post(
  '/logout',
  authController.logout
);

/**
 * Email Verification Flow
 */
router.post(
  '/verify-email/request',
  authRateLimiter,
  validate(verifyEmailRequestSchema),
  authController.requestEmailVerification
);

router.post(
  '/verify-email/confirm',
  validate(verifyEmailConfirmSchema),
  authController.confirmEmailVerification
);

/**
 * Password Reset Flow
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * Authenticated User Endpoints (Protected by JWT)
 */
router.get(
  '/me',
  authenticate,
  authController.getMe
);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get(
  '/sessions',
  authenticate,
  authController.getSessions
);

router.delete(
  '/sessions/:sessionId',
  authenticate,
  validate(sessionIdParamSchema),
  authController.revokeSession
);

export default router;
