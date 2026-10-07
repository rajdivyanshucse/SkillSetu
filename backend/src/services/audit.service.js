import prisma from '../config/db.js';

/**
 * Audit Logging Service for Security & Authentication Events
 */

/**
 * Log an authentication/authorization audit event safely.
 * @param {Object} params
 * @param {string} [params.userId] - The user ID if available
 * @param {string} params.action - Action identifier (e.g. "LOGIN_SUCCESS", "LOGIN_FAILED", "REGISTER")
 * @param {string} [params.ipAddress] - Client IP address
 * @param {string} [params.userAgent] - Client User-Agent string
 * @param {Object} [params.metadata] - Non-sensitive contextual metadata
 */
export const logAuthEvent = async ({
  userId = null,
  action,
  ipAddress = null,
  userAgent = null,
  metadata = null,
}) => {
  try {
    // Sanitize metadata to guarantee no passwords, hashes, or raw tokens are stored
    const cleanMetadata = metadata ? { ...metadata } : {};
    delete cleanMetadata.password;
    delete cleanMetadata.newPassword;
    delete cleanMetadata.currentPassword;
    delete cleanMetadata.token;
    delete cleanMetadata.refreshToken;
    delete cleanMetadata.passwordHash;

    await prisma.authAuditLog.create({
      data: {
        userId,
        action,
        ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
        userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
        metadata: Object.keys(cleanMetadata).length > 0 ? cleanMetadata : undefined,
      },
    });
  } catch (error) {
    // Audit log failure should never crash the main application flow
    console.error('[AuditService] Failed to write audit log:', error.message);
  }
};

export default {
  logAuthEvent,
};
