import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';
import emailVerificationService from '../services/emailVerification.service.js';
import passwordResetService from '../services/passwordReset.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import env from '../config/env.js';

/**
 * Controller handling all Authentication & Account Security Endpoints
 */

/**
 * Helper to set secure refresh token cookie if supported
 */
const setRefreshTokenCookie = (res, refreshToken, expiresAt) => {
  if (!refreshToken) return;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.isProduction || env.authCookieSecure,
    sameSite: env.isProduction ? 'strict' : 'lax',
    expires: new Date(expiresAt),
  });
};

/**
 * Helper to clear refresh token cookie
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.isProduction || env.authCookieSecure,
    sameSite: env.isProduction ? 'strict' : 'lax',
  });
};

/**
 * Helper to extract client IP and user-agent
 */
const getClientMeta = (req) => ({
  ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
  userAgent: req.headers['user-agent'] || 'Unknown',
});

/**
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await authService.register({
      ...req.body,
      ipAddress,
      userAgent,
    });

    setRefreshTokenCookie(res, result.tokens.refreshToken, result.tokens.expiresAt);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account registered successfully',
      data: {
        user: result.user,
        tokens: result.tokens,
        sessionId: result.sessionId,
        ...(result.devVerificationToken && { devVerificationToken: result.devVerificationToken }),
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
      ipAddress,
      userAgent,
    });

    setRefreshTokenCookie(res, result.tokens.refreshToken, result.tokens.expiresAt);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Logged in successfully',
      data: {
        user: result.user,
        tokens: result.tokens,
        sessionId: result.sessionId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const rawRefreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    if (!rawRefreshToken) {
      throw ApiError.unauthorized('Refresh token must be provided in payload or cookie', 'REFRESH_TOKEN_REQUIRED');
    }

    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await tokenService.rotateRefreshToken({
      rawRefreshToken,
      ipAddress,
      userAgent,
    });

    setRefreshTokenCookie(res, result.refreshToken, result.expiresAt);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Token rotated successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
        sessionId: result.sessionId,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const rawRefreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const sessionId = req.body.sessionId;
    const userId = req.user?.id;

    if (rawRefreshToken || sessionId) {
      await tokenService.revokeSession({
        sessionId,
        rawRefreshToken,
        userId,
      });
    }

    clearRefreshTokenCookie(res);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Successfully logged out',
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Authenticated user profile retrieved',
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await authService.changePassword({
      userId: req.user.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      ipAddress,
      userAgent,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/v1/auth/sessions
 */
export const getSessions = async (req, res, next) => {
  try {
    const currentRefreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const sessions = await tokenService.getUserSessions(req.user.id, currentRefreshToken);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Active sessions retrieved',
      data: { sessions },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * DELETE /api/v1/auth/sessions/:sessionId
 */
export const revokeSession = async (req, res, next) => {
  try {
    const result = await tokenService.revokeSession({
      sessionId: req.params.sessionId,
      userId: req.user.id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/verify-email/request
 */
export const requestEmailVerification = async (req, res, next) => {
  try {
    let targetUserId = req.user?.id;

    if (!targetUserId && req.body.email) {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email.toLowerCase().trim() },
        select: { id: true },
      });
      if (user) targetUserId = user.id;
    }

    // Always respond with a generic success message
    const genericResponse = {
      message: 'If an unverified account matches this request, a verification link has been generated.',
    };

    if (!targetUserId) {
      return sendSuccess(res, { statusCode: 200, message: genericResponse.message });
    }

    const tokenInfo = await emailVerificationService.createVerificationToken(targetUserId);

    return sendSuccess(res, {
      statusCode: 200,
      message: genericResponse.message,
      ...(env.isDevelopment && { data: { devVerificationToken: tokenInfo.rawToken } }),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/verify-email/confirm
 */
export const confirmEmailVerification = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await emailVerificationService.confirmVerificationToken(req.body.token, {
      ipAddress,
      userAgent,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { user: result.user },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await passwordResetService.requestPasswordReset(req.body.email, {
      ipAddress,
      userAgent,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      ...(result.devResetToken && { data: { devResetToken: result.devResetToken } }),
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { ipAddress, userAgent } = getClientMeta(req);
    const result = await passwordResetService.resetPasswordWithToken({
      rawToken: req.body.token,
      newPassword: req.body.newPassword,
      ipAddress,
      userAgent,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  getMe,
  changePassword,
  getSessions,
  revokeSession,
  requestEmailVerification,
  confirmEmailVerification,
  forgotPassword,
  resetPassword,
};
