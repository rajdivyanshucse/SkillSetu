import prisma from '../config/db.js';
import { verifyAccessToken } from '../utils/token.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Middleware to authenticate requests using JWT Bearer token in the Authorization header.
 * Attaches the authenticated user object and token payload to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authentication token is required', 'AUTH_TOKEN_REQUIRED'));
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return next(ApiError.unauthorized('Authentication token is required', 'AUTH_TOKEN_REQUIRED'));
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Authentication token has expired', 'TOKEN_EXPIRED'));
      }
      return next(ApiError.unauthorized('Invalid authentication token', 'INVALID_AUTH_TOKEN'));
    }

    if (!decoded || !decoded.sub) {
      return next(ApiError.unauthorized('Malformed authentication token', 'INVALID_AUTH_TOKEN'));
    }

    // Load user and current state
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        accountType: true,
        role: true,
        status: true,
        emailVerified: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            headline: true,
            completeness: true,
          },
        },
        organizationMemberships: {
          select: {
            id: true,
            organizationId: true,
            role: true,
            accessLevel: true,
            status: true,
            organization: {
              select: {
                id: true,
                name: true,
                industry: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return next(ApiError.unauthorized('User associated with this token was not found', 'USER_NOT_FOUND'));
    }

    if (user.status === 'SUSPENDED') {
      return next(ApiError.forbidden('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED'));
    }

    // Attach user and decoded payload to request
    req.user = user;
    req.tokenPayload = decoded;

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticate;
