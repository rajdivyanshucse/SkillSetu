import prisma from '../config/db.js';
import env from '../config/env.js';
import { generateRandomToken, hashToken } from '../utils/token.js';
import { hashPassword } from '../utils/password.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';
import { revokeAllUserSessions } from './token.service.js';

/**
 * Service managing password reset requests, secure token creation, and password updates.
 */

/**
 * Initiates a password reset request.
 * Returns a generic success response to prevent account enumeration.
 * @param {string} email - Plaintext email address
 * @param {Object} [metadata]
 * @returns {Promise<{ message: string, rawToken?: string }>}
 */
export const requestPasswordReset = async (email, { ipAddress = null, userAgent = null } = {}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, status: true },
  });

  // Always return identical success message to prevent user/email enumeration
  const genericResponse = {
    message: 'If an account exists with this email, password reset instructions have been generated.',
  };

  if (!user || user.status === 'SUSPENDED') {
    return genericResponse;
  }

  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + env.passwordResetExpiresMinutes * 60 * 1000);

  // Invalidate any previously active unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Save new hashed reset token
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  await logAuthEvent({
    userId: user.id,
    action: 'PASSWORD_RESET_REQUESTED',
    ipAddress,
    userAgent,
    metadata: { email: user.email },
  });

  // In development, we include the development token helper in the return object
  return {
    ...genericResponse,
    ...(env.isDevelopment && { devResetToken: rawToken }),
  };
};

/**
 * Completes a password reset using a verified reset token.
 * @param {Object} params
 * @param {string} params.rawToken
 * @param {string} params.newPassword
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 */
export const resetPasswordWithToken = async ({ rawToken, newPassword, ipAddress = null, userAgent = null }) => {
  if (!rawToken || typeof rawToken !== 'string') {
    throw ApiError.badRequest('Password reset token is required', 'TOKEN_REQUIRED');
  }

  const tokenHash = hashToken(rawToken);

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
        },
      },
    },
  });

  if (!tokenRecord) {
    throw ApiError.badRequest('Invalid or unrecognized password reset token', 'INVALID_RESET_TOKEN');
  }

  if (tokenRecord.usedAt) {
    throw ApiError.badRequest('This password reset token has already been used', 'TOKEN_ALREADY_USED');
  }

  if (new Date() > new Date(tokenRecord.expiresAt)) {
    throw ApiError.badRequest(
      'This password reset token has expired. Please request a new password reset link.',
      'TOKEN_EXPIRED'
    );
  }

  if (tokenRecord.user.status === 'SUSPENDED') {
    throw ApiError.forbidden('Your account is suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Perform database updates atomically
  await prisma.$transaction(async (tx) => {
    // 1. Mark token as used
    await tx.passwordResetToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    });

    // 2. Update user's password hash and clear any lockouts
    await tx.user.update({
      where: { id: tokenRecord.userId },
      data: {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // 3. Invalidate all existing sessions for security
    await tx.authSession.updateMany({
      where: { userId: tokenRecord.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });

  await logAuthEvent({
    userId: tokenRecord.userId,
    action: 'PASSWORD_RESET_SUCCESS',
    ipAddress,
    userAgent,
  });

  return {
    message: 'Your password has been reset successfully. Please log in with your new credentials.',
  };
};

export default {
  requestPasswordReset,
  resetPasswordWithToken,
};
