import prisma from '../config/db.js';
import env from '../config/env.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { ApiError } from '../utils/apiError.js';
import { createAuthSession } from './token.service.js';
import { createVerificationToken } from './emailVerification.service.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Sanitizes a user object to guarantee no sensitive credentials or internal hash data are exposed.
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  const { passwordHash, failedLoginAttempts, lockedUntil, ...safeUser } = user;
  return safeUser;
};

/**
 * Registers a new user (INDIVIDUAL or ORGANIZATION) and creates the respective data foundations.
 * @param {Object} params
 */
export const register = async ({
  email,
  password,
  accountType,
  fullName,
  firstName,
  lastName,
  organizationName,
  industry,
  companySize,
  size,
  ipAddress = null,
  userAgent = null,
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const effectiveSize = companySize || size;
  const effectiveName =
    fullName?.trim() ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    normalizedEmail.split('@')[0];

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      profile: true,
      organizationMemberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (existingUser && existingUser.passwordHash) {
    throw ApiError.conflict('An account with this email address already exists', 'EMAIL_ALREADY_EXISTS');
  }

  // 2. Hash the password
  const passwordHash = await hashPassword(password);

  let createdUser;

  if (existingUser && !existingUser.passwordHash) {
    // This is an invited user claiming/completing their registration
    createdUser = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          status: 'ACTIVE',
          accountType: accountType || existingUser.accountType || 'ORGANIZATION',
        },
      });

      if (existingUser.profile) {
        await tx.individualProfile.update({
          where: { userId: existingUser.id },
          data: {
            fullName: effectiveName,
          },
        });
      } else {
        await tx.individualProfile.create({
          data: {
            userId: existingUser.id,
            fullName: effectiveName,
            completeness: 20,
          },
        });
      }

      // If user has no organization memberships yet and is registering as ORGANIZATION, create org
      const existingMemberships = existingUser.organizationMemberships || [];
      if (accountType === 'ORGANIZATION' && existingMemberships.length === 0) {
        const orgName = organizationName?.trim() || `${normalizedEmail.split('@')[0]} Org`;
        const org = await tx.organization.create({
          data: {
            name: orgName,
            industry: industry?.trim() || 'Technology',
            companySize: effectiveSize?.trim() || '11-50',
            status: 'ACTIVE',
          },
        });

        await tx.organizationMember.create({
          data: {
            userId: existingUser.id,
            organizationId: org.id,
            role: 'ADMIN',
            accessLevel: 'Admin',
            status: 'ACTIVE',
          },
        });
      }

      return tx.user.findUnique({
        where: { id: existingUser.id },
        include: {
          profile: true,
          organizationMemberships: {
            include: {
              organization: true,
            },
          },
        },
      });
    });
  } else {
    // 3. Create user and foundation entities in a transaction
    createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          accountType,
          status: 'ACTIVE',
          emailVerified: false,
        },
      });

      if (accountType === 'INDIVIDUAL') {
        await tx.individualProfile.create({
          data: {
            userId: user.id,
            fullName: effectiveName,
            completeness: 20,
          },
        });
      } else if (accountType === 'ORGANIZATION') {
        const orgName = organizationName?.trim() || `${normalizedEmail.split('@')[0]} Org`;
        const org = await tx.organization.create({
          data: {
            name: orgName,
            industry: industry?.trim() || 'Technology',
            companySize: effectiveSize?.trim() || '11-50',
            status: 'ACTIVE',
          },
        });

        await tx.organizationMember.create({
          data: {
            userId: user.id,
            organizationId: org.id,
            role: 'ADMIN',
            accessLevel: 'Admin',
            status: 'ACTIVE',
          },
        });
      }

      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          profile: true,
          organizationMemberships: {
            include: {
              organization: true,
            },
          },
        },
      });
    });
  }

  // 4. Generate email verification foundation token
  const verificationInfo = await createVerificationToken(createdUser.id);

  // 5. Create initial authenticated session & tokens
  const sessionData = await createAuthSession({
    user: createdUser,
    ipAddress,
    userAgent,
  });

  // 6. Audit logging
  await logAuthEvent({
    userId: createdUser.id,
    action: 'REGISTER',
    ipAddress,
    userAgent,
    metadata: { accountType: createdUser.accountType },
  });

  return {
    user: sanitizeUser(createdUser),
    tokens: {
      accessToken: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      expiresAt: sessionData.expiresAt,
    },
    sessionId: sessionData.sessionId,
    ...(env.isDevelopment && { devVerificationToken: verificationInfo.rawToken }),
  };
};

/**
 * Authenticates a user with email and password, verifying account state and issuing tokens.
 * @param {Object} params
 */
export const login = async ({ email, password, ipAddress = null, userAgent = null }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Fetch user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      profile: true,
      organizationMemberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  // Generic authentication error helper to prevent user enumeration
  const invalidCredentialsError = () =>
    ApiError.unauthorized('Invalid email or password provided', 'INVALID_CREDENTIALS');

  if (!user || !user.passwordHash) {
    await logAuthEvent({
      action: 'LOGIN_FAILED',
      ipAddress,
      userAgent,
      metadata: { attemptedEmail: normalizedEmail },
    });
    throw invalidCredentialsError();
  }

  // 2. Account Status Check
  if (user.status === 'SUSPENDED') {
    await logAuthEvent({
      userId: user.id,
      action: 'LOGIN_SUSPENDED',
      ipAddress,
      userAgent,
    });
    throw ApiError.forbidden('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
  }

  // 3. Check temporary lockout
  if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
    throw ApiError.tooManyRequests(
      'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
      'ACCOUNT_LOCKED'
    );
  }

  // 4. Verify password
  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    const failedAttempts = user.failedLoginAttempts + 1;
    const shouldLock = failedAttempts >= 5;
    const lockedUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: failedAttempts,
        lockedUntil,
      },
    });

    await logAuthEvent({
      userId: user.id,
      action: 'LOGIN_FAILED',
      ipAddress,
      userAgent,
      metadata: { failedAttempts },
    });

    throw invalidCredentialsError();
  }

  // 5. Successful login — reset failed attempts & update last login
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    include: {
      profile: true,
      organizationMemberships: {
        include: {
          organization: true,
        },
      },
    },
  });

  // 6. Generate authenticated session and tokens
  const sessionData = await createAuthSession({
    user: updatedUser,
    ipAddress,
    userAgent,
  });

  // 7. Audit log
  await logAuthEvent({
    userId: updatedUser.id,
    action: 'LOGIN_SUCCESS',
    ipAddress,
    userAgent,
    metadata: { accountType: updatedUser.accountType },
  });

  return {
    user: sanitizeUser(updatedUser),
    tokens: {
      accessToken: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      expiresAt: sessionData.expiresAt,
    },
    sessionId: sessionData.sessionId,
  };
};

/**
 * Retrieves the full sanitized profile of the currently authenticated user.
 * @param {string} userId
 */
export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          targetRole: true,
        },
      },
      organizationMemberships: {
        where: { status: 'ACTIVE' },
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  }

  return sanitizeUser(user);
};

/**
 * Changes an authenticated user's password after verifying their current password.
 * @param {Object} params
 */
export const changePassword = async ({ userId, currentPassword, newPassword, ipAddress = null, userAgent = null }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.passwordHash) {
    throw ApiError.badRequest('User does not have an active password configured', 'NO_PASSWORD_SET');
  }

  // Verify current password
  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw ApiError.badRequest('The current password provided is incorrect', 'INVALID_CURRENT_PASSWORD');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password and revoke all active sessions for security
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Invalidate sessions except will issue new ones upon re-login or keep active
    await tx.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });

  await logAuthEvent({
    userId,
    action: 'PASSWORD_CHANGE',
    ipAddress,
    userAgent,
  });

  return {
    message: 'Password successfully updated. All other active sessions have been signed out for security.',
  };
};

export default {
  register,
  login,
  getCurrentUser,
  changePassword,
};
