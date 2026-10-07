import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} - The hashed password string.
 */
export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text password against a bcrypt hash.
 * @param {string} password - Plain-text password.
 * @param {string} hash - Stored bcrypt hash.
 * @returns {Promise<boolean>} - True if password matches the hash, false otherwise.
 */
export const comparePassword = async (password, hash) => {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
};

export default {
  hashPassword,
  comparePassword,
};
