import prisma from '../config/db.js';
import env from '../config/env.js';
import { generateRandomToken, hashToken } from '../utils/token.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Service handling email verification tokens and confirmation logic.
 */

/**
 * Generates an email verification token for a given user.
 * Invalidates any previous pending tokens for this user.
 * @param {string} userId - Target user ID
 * @returns {Promise<{ rawToken: string, expiresAt: Date }>}
 */
export const createVerificationToken = async (userId) => {
  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + env.emailVerificationExpiresMinutes * 60 * 1000);

  // Invalidate any existing unused tokens for this user
  await prisma.emailVerificationToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Store new hashed token
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return {
    rawToken,
    expiresAt,
  };
};

/**
 * Confirms email verification using a raw token.
 * @param {string} rawToken - Plaintext verification token from user request/link
 * @param {Object} [metadata] - Context metadata (ipAddress, userAgent)
 */
export const confirmVerificationToken = async (rawToken, { ipAddress = null, userAgent = null } = {}) => {
  if (!rawToken || typeof rawToken !== 'string') {
    throw ApiError.badRequest('Verification token is required', 'TOKEN_REQUIRED');
  }

  const tokenHash = hashToken(rawToken);

  const tokenRecord = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
          emailVerified: true,
        },
      },
    },
  });

  if (!tokenRecord) {
    throw ApiError.badRequest('Invalid or unrecognized email verification token', 'INVALID_VERIFICATION_TOKEN');
  }

  if (tokenRecord.usedAt) {
    throw ApiError.badRequest('This email verification token has already been used', 'TOKEN_ALREADY_USED');
  }

  if (new Date() > new Date(tokenRecord.expiresAt)) {
    throw ApiError.badRequest(
      'This email verification token has expired. Please request a new verification link.',
      'TOKEN_EXPIRED'
    );
  }

  // Update user and mark token as used in a transaction
  const updatedUser = await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date() },
    });

    const userUpdateData = {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    };

    if (tokenRecord.user.status === 'PENDING_VERIFICATION') {
      userUpdateData.status = 'ACTIVE';
    }

    return tx.user.update({
      where: { id: tokenRecord.userId },
      data: userUpdateData,
      select: {
        id: true,
        email: true,
        accountType: true,
        status: true,
        emailVerified: true,
        emailVerifiedAt: true,
      },
    });
  });

  await logAuthEvent({
    userId: updatedUser.id,
    action: 'EMAIL_VERIFIED',
    ipAddress,
    userAgent,
    metadata: { email: updatedUser.email },
  });

  return {
    user: updatedUser,
    message: 'Email address has been successfully verified.',
  };
};

export default {
  createVerificationToken,
  confirmVerificationToken,
};
