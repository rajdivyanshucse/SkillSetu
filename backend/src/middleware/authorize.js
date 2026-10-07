import { ApiError } from '../utils/apiError.js';
import prisma from '../config/db.js';

// Access level hierarchy weight mapping
const ACCESS_LEVEL_WEIGHTS = {
  viewer: 1,
  editor: 2,
  admin: 3,
  owner: 4,
};

/**
 * Restrict access based on User AccountType (e.g. 'INDIVIDUAL' or 'ORGANIZATION').
 * @param  {...string} allowedAccountTypes
 */
export const requireAccountType = (...allowedAccountTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication is required', 'UNAUTHENTICATED'));
    }

    if (!allowedAccountTypes.includes(req.user.accountType)) {
      return next(
        ApiError.forbidden(
          `Access denied. Requires one of the following account types: ${allowedAccountTypes.join(', ')}`,
          'FORBIDDEN_ACCOUNT_TYPE'
        )
      );
    }

    return next();
  };
};

/**
 * Restrict access based on user role or membership role.
 * @param  {...string} allowedRoles
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication is required', 'UNAUTHENTICATED'));
    }

    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    // Check user role field
    if (req.user.role && normalizedAllowed.includes(req.user.role.toUpperCase())) {
      return next();
    }

    // Check JWT payload role
    if (req.tokenPayload?.role && normalizedAllowed.includes(req.tokenPayload.role.toUpperCase())) {
      return next();
    }

    // Check if user's account type matches
    if (normalizedAllowed.includes(req.user.accountType.toUpperCase())) {
      return next();
    }

    // Check organization membership roles
    const hasOrgRole = req.user.organizationMemberships?.some(
      (m) => m.status === 'ACTIVE' && normalizedAllowed.includes(m.role.toUpperCase())
    );

    if (hasOrgRole) {
      return next();
    }

    return next(
      ApiError.forbidden(
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        'FORBIDDEN_ROLE'
      )
    );
  };
};

/**
 * Enforce organization-level boundary and membership access.
 * Verifies that the authenticated user is an active member of the organization
 * and possesses at least the minimum required access level.
 *
 * Supports both signatures:
 *   requireOrganizationAccess('Admin')
 *   requireOrganizationAccess('organizationId', 'Admin')
 *
 * @param {string} [arg1='Viewer'] - Access level or paramName
 * @param {string} [arg2=null] - Access level if arg1 was paramName, or vice-versa
 */
export const requireOrganizationAccess = (arg1 = 'Viewer', arg2 = null) => {
  let minAccessLevel = 'Viewer';
  let paramName = 'organizationId';

  const knownLevels = ['viewer', 'editor', 'admin', 'owner'];
  if (knownLevels.includes(String(arg1).toLowerCase())) {
    minAccessLevel = arg1;
    if (arg2) paramName = arg2;
  } else {
    paramName = arg1;
    if (arg2) minAccessLevel = arg2;
  }

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized('Authentication is required', 'UNAUTHENTICATED'));
      }

      let orgId = req.params[paramName] || req.body[paramName] || req.query[paramName] || req.headers['x-organization-id'];

      // If orgId wasn't explicitly passed, derive from user's active organization membership
      if (!orgId) {
        const primaryMembership = req.user.organizationMemberships?.find((m) => m.status === 'ACTIVE');
        if (primaryMembership) {
          orgId = primaryMembership.organizationId;
        }
      }

      if (!orgId) {
        return next(
          ApiError.forbidden(
            'Organization context could not be determined for this account',
            'FORBIDDEN_ORGANIZATION_ACCESS'
          )
        );
      }

      // Find membership in database
      const membership = await prisma.organizationMember.findUnique({
        where: {
          userId_organizationId: {
            userId: req.user.id,
            organizationId: orgId,
          },
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              legalName: true,
              industry: true,
              companySize: true,
              location: true,
              description: true,
              website: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (!membership || membership.status !== 'ACTIVE' || !membership.organization || membership.organization.status !== 'ACTIVE') {
        return next(
          ApiError.forbidden(
            'You do not have active membership access to this organization',
            'FORBIDDEN_ORGANIZATION_ACCESS'
          )
        );
      }

      // Verify access level hierarchy (Admin > Editor > Viewer)
      const requiredWeight = ACCESS_LEVEL_WEIGHTS[minAccessLevel.toLowerCase()] || 1;
      const userLevelWeight =
        ACCESS_LEVEL_WEIGHTS[membership.accessLevel?.toLowerCase()] ||
        ACCESS_LEVEL_WEIGHTS[membership.role?.toLowerCase()] ||
        (membership.role?.toUpperCase() === 'ADMIN' ? 3 : 1);

      if (userLevelWeight < requiredWeight) {
        return next(
          ApiError.forbidden(
            `Insufficient organization permissions. Required: ${minAccessLevel}, Current: ${membership.accessLevel || membership.role}`,
            'INSUFFICIENT_ORG_PERMISSIONS'
          )
        );
      }

      // Attach organization membership context for downstream services/controllers
      req.organizationMember = membership;
      req.organization = membership.organization;

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export default {
  requireAccountType,
  requireRole,
  requireOrganizationAccess,
};
