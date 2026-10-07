import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generates a short-lived JWT access token for an authenticated user.
 * Payload contains only essential security claims.
 * @param {Object} user - Sanitized user object containing id, email, accountType.
 * @returns {string} - Signed JWT string.
 */
export const generateAccessToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    accountType: user.accountType,
    ...(user.role ? { role: user.role } : {}),
  };

  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
    issuer: 'skillsetu-auth-service',
    audience: 'skillsetu-client',
  });
};

/**
 * Verifies and decodes a JWT access token.
 * @param {string} token - The raw JWT token string.
 * @returns {Object} - Decoded token payload.
 * @throws {Error} - If token is invalid or expired.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.accessSecret, {
    issuer: 'skillsetu-auth-service',
    audience: 'skillsetu-client',
  });
};

/**
 * Generates a cryptographically secure random hex string.
 * Used for refresh tokens, email verification tokens, and password reset tokens.
 * @param {number} [bytes=40] - Number of random bytes.
 * @returns {string} - Random hex string.
 */
export const generateRandomToken = (bytes = 40) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hashes a token using SHA-256 for secure database storage.
 * @param {string} rawToken - The raw token string.
 * @returns {string} - Hex-encoded SHA-256 hash.
 */
export const hashToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') {
    throw new Error('Token to hash must be a non-empty string');
  }
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export default {
  generateAccessToken,
  verifyAccessToken,
  generateRandomToken,
  hashToken,
};
