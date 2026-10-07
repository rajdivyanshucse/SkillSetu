import prisma from '../config/db.js';
import { generateAccessToken, generateRandomToken, hashToken } from '../utils/token.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

// Refresh token lifespan (7 days in milliseconds)
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Creates an authenticated session with short-lived access token and hashed refresh token.
 * @param {Object} params
 * @param {Object} params.user - User object (id, email, accountType)
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 * @returns {Promise<{ accessToken: string, refreshToken: string, expiresAt: Date, sessionId: string }>}
 */
export const createAuthSession = async ({ user, ipAddress, userAgent }) => {
  const accessToken = generateAccessToken(user);
  const rawRefreshToken = generateRandomToken(40);
  const refreshTokenHash = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  const session = await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
      userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresAt,
    sessionId: session.id,
  };
};

/**
 * Rotates a refresh token session and issues a new access token + refresh token pair.
 * @param {Object} params
 * @param {string} params.rawRefreshToken
 * @param {string} [params.ipAddress]
 * @param {string} [params.userAgent]
 */
export const rotateRefreshToken = async ({ rawRefreshToken, ipAddress, userAgent }) => {
  if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
    throw ApiError.unauthorized('Refresh token is required', 'REFRESH_TOKEN_REQUIRED');
  }

  const tokenHash = hashToken(rawRefreshToken);

  // Find session by hashed token
  const session = await prisma.authSession.findFirst({
    where: { refreshTokenHash: tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          accountType: true,
          status: true,
        },
      },
    },
  });

  if (!session) {
    throw ApiError.unauthorized('Invalid or unrecognised refresh token session', 'INVALID_SESSION');
  }

  // If session is already revoked, potential token reuse detected
  if (session.revokedAt) {
    // Invalidate all sessions for this user as a security precaution
    await prisma.authSession.updateMany({
      where: { userId: session.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await logAuthEvent({
      userId: session.userId,
      action: 'SECURITY_ALERT_REVOKED_TOKEN_REUSE',
      ipAddress,
      userAgent,
      metadata: { sessionId: session.id },
    });

    throw ApiError.unauthorized('Refresh token has already been revoked. Please log in again.', 'REVOKED_SESSION');
  }

  // Check expiration
  if (new Date() > new Date(session.expiresAt)) {
    throw ApiError.unauthorized('Refresh token has expired. Please log in again.', 'SESSION_EXPIRED');
  }

  // Check user status
  if (!session.user || session.user.status === 'SUSPENDED') {
    throw ApiError.forbidden('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
  }

  // Generate new token pair
  const newAccessToken = generateAccessToken(session.user);
  const newRawRefreshToken = generateRandomToken(40);
  const newRefreshTokenHash = hashToken(newRawRefreshToken);
  const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  // Update existing session with rotated token and timestamp
  await prisma.authSession.update({
    where: { id: session.id },
    data: {
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
      lastUsedAt: new Date(),
      ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : session.ipAddress,
      userAgent: userAgent ? String(userAgent).slice(0, 500) : session.userAgent,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRawRefreshToken,
    expiresAt: newExpiresAt,
    sessionId: session.id,
    user: session.user,
  };
};

/**
 * Revokes a specific auth session by ID or raw refresh token.
 * @param {Object} params
 * @param {string} [params.sessionId]
 * @param {string} [params.rawRefreshToken]
 * @param {string} [params.userId]
 */
export const revokeSession = async ({ sessionId, rawRefreshToken, userId }) => {
  let where = {};

  if (sessionId) {
    where = { id: sessionId, ...(userId && { userId }) };
  } else if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    where = { refreshTokenHash: tokenHash, ...(userId && { userId }) };
  } else {
    throw ApiError.badRequest('Must provide either sessionId or refreshToken to revoke', 'INVALID_REVOCATION_TARGET');
  }

  const session = await prisma.authSession.findFirst({ where });
  if (!session) {
    // Already gone or doesn't exist
    return { success: true, message: 'Session not found or already terminated' };
  }

  await prisma.authSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  return { success: true, message: 'Session successfully revoked' };
};

/**
 * Revokes all active sessions for a user (global logout / security reset).
 * @param {string} userId
 */
export const revokeAllUserSessions = async (userId) => {
  return prisma.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

/**
 * Retrieves safe metadata of active/recent sessions for a user.
 * @param {string} userId
 * @param {string} [currentRefreshToken]
 */
export const getUserSessions = async (userId, currentRefreshToken = null) => {
  const currentTokenHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

  const sessions = await prisma.authSession.findMany({
    where: { userId },
    orderBy: { lastUsedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
      revokedAt: true,
      refreshTokenHash: true,
    },
  });

  return sessions.map((s) => ({
    id: s.id,
    userAgent: s.userAgent || 'Unknown Device',
    ipAddress: s.ipAddress || 'Unknown IP',
    createdAt: s.createdAt,
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isRevoked: s.revokedAt !== null,
    isExpired: new Date() > new Date(s.expiresAt),
    isCurrent: currentTokenHash ? s.refreshTokenHash === currentTokenHash : false,
  }));
};

export default {
  createAuthSession,
  rotateRefreshToken,
  revokeSession,
  revokeAllUserSessions,
  getUserSessions,
};
