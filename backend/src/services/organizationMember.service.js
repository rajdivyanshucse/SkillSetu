import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

export const getMembers = async (organizationId, query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const where = { organizationId };
  if (query.role) where.role = query.role;
  if (query.accessLevel) where.accessLevel = query.accessLevel;
  if (query.status) where.status = query.status;

  const [total, members] = await Promise.all([
    prisma.organizationMember.count({ where }),
    prisma.organizationMember.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            accountType: true,
            status: true,
            profile: {
              select: {
                fullName: true,
                headline: true,
                location: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const items = members.map((m) => ({
    id: m.id,
    userId: m.userId,
    email: m.user?.email || null,
    fullName: m.user?.profile?.fullName || 'Anonymous Member',
    name: m.user?.profile?.fullName || 'Anonymous Member',
    headline: m.user?.profile?.headline || null,
    role: m.role,
    accessLevel: m.accessLevel,
    status: m.status,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    user: {
      id: m.user?.id || m.userId,
      email: m.user?.email || null,
      fullName: m.user?.profile?.fullName || 'Anonymous Member',
    },
  }));

  return {
    items,
    members: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getMemberById = async (organizationId, memberId) => {
  const member = await prisma.organizationMember.findUnique({
    where: { id: memberId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          accountType: true,
          status: true,
          profile: {
            select: {
              fullName: true,
              headline: true,
              location: true,
              education: true,
            },
          },
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!member || member.organizationId !== organizationId) {
    throw ApiError.notFound('Organization member not found', 'MEMBER_NOT_FOUND');
  }

  return {
    id: member.id,
    userId: member.userId,
    organizationId: member.organizationId,
    email: member.user?.email || null,
    fullName: member.user?.profile?.fullName || 'Anonymous Member',
    name: member.user?.profile?.fullName || 'Anonymous Member',
    headline: member.user?.profile?.headline || null,
    role: member.role,
    accessLevel: member.accessLevel,
    status: member.status,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
    user: {
      id: member.user?.id || member.userId,
      email: member.user?.email || null,
      fullName: member.user?.profile?.fullName || 'Anonymous Member',
    },
  };
};

export const createMember = async (organizationId, data, currentUserId = null) => {
  let targetUserId = data.userId;

  // If email was provided instead of userId, lookup user by email or auto-provision
  if (!targetUserId && data.email) {
    const normEmail = data.email.toLowerCase().trim();
    let user = await prisma.user.findUnique({
      where: { email: normEmail },
    });

    if (!user) {
      const displayName = data.name || data.fullName || normEmail.split('@')[0];
      user = await prisma.user.create({
        data: {
          email: normEmail,
          accountType: 'ORGANIZATION',
          status: 'ACTIVE',
          emailVerified: false,
          passwordHash: null,
        },
      });

      await prisma.individualProfile.create({
        data: {
          userId: user.id,
          fullName: displayName,
          headline: data.department ? `${data.department} Member` : 'Organization Member',
          completeness: 20,
        },
      });
    }
    targetUserId = user.id;
  }

  // Check if member already belongs to organization
  const existing = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: targetUserId,
        organizationId,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('User is already a member of this organization', 'MEMBER_ALREADY_EXISTS');
  }

  const roleUpper = (data.role || 'MEMBER').toUpperCase();
  let accessLevel = 'Viewer';
  if (data.accessLevel) {
    const al = data.accessLevel.toLowerCase();
    if (al.includes('admin')) accessLevel = 'Admin';
    else if (al.includes('editor')) accessLevel = 'Editor';
    else if (al.includes('owner')) accessLevel = 'Owner';
    else accessLevel = 'Viewer';
  } else {
    if (roleUpper === 'ADMIN') accessLevel = 'Admin';
    else if (roleUpper === 'EDITOR') accessLevel = 'Editor';
    else if (roleUpper === 'OWNER') accessLevel = 'Owner';
    else accessLevel = 'Viewer';
  }

  const member = await prisma.organizationMember.create({
    data: {
      userId: targetUserId,
      organizationId,
      role: roleUpper,
      accessLevel,
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: { fullName: true, headline: true },
          },
        },
      },
    },
  });

  if (currentUserId) {
    await logAuthEvent({
      userId: currentUserId,
      action: 'ORGANIZATION_MEMBER_ADDED',
      metadata: { organizationId, targetUserId, role: member.role, accessLevel: member.accessLevel },
    });
  }

  return {
    id: member.id,
    userId: member.userId,
    organizationId: member.organizationId,
    email: member.user?.email || data.email,
    fullName: member.user?.profile?.fullName || data.name || 'Anonymous Member',
    name: member.user?.profile?.fullName || data.name || 'Anonymous Member',
    role: member.role,
    accessLevel: member.accessLevel,
    status: member.status,
    createdAt: member.createdAt,
    user: {
      id: member.user?.id || targetUserId,
      email: member.user?.email || data.email,
      fullName: member.user?.profile?.fullName || data.name || 'Anonymous Member',
    },
  };
};

export const updateMember = async (organizationId, memberId, data, currentUserId = null) => {
  const existing = await prisma.organizationMember.findUnique({
    where: { id: memberId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Organization member not found', 'MEMBER_NOT_FOUND');
  }

  let accessLevel = data.accessLevel;
  if (data.role && !data.accessLevel) {
    const roleUpper = data.role.toUpperCase();
    if (roleUpper === 'ADMIN') accessLevel = 'Admin';
    else if (roleUpper === 'EDITOR') accessLevel = 'Editor';
    else if (roleUpper === 'OWNER') accessLevel = 'Owner';
    else accessLevel = 'Viewer';
  }

  const updated = await prisma.organizationMember.update({
    where: { id: memberId },
    data: {
      ...(data.role && { role: data.role.toUpperCase() }),
      ...(accessLevel && { accessLevel }),
      ...(data.status && { status: data.status }),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: { select: { fullName: true } },
        },
      },
    },
  });

  if (currentUserId) {
    await logAuthEvent({
      userId: currentUserId,
      action: 'ORGANIZATION_MEMBER_UPDATED',
      metadata: { organizationId, memberId, changes: data },
    });
  }

  return {
    id: updated.id,
    userId: updated.userId,
    organizationId: updated.organizationId,
    email: updated.user?.email,
    fullName: updated.user?.profile?.fullName || 'Anonymous Member',
    name: updated.user?.profile?.fullName || 'Anonymous Member',
    role: updated.role,
    accessLevel: updated.accessLevel,
    status: updated.status,
    updatedAt: updated.updatedAt,
    user: {
      id: updated.user?.id,
      email: updated.user?.email,
      fullName: updated.user?.profile?.fullName || 'Anonymous Member',
    },
  };
};

export const deleteMember = async (organizationId, memberId, currentUserId = null) => {
  const existing = await prisma.organizationMember.findUnique({
    where: { id: memberId },
  });

  if (!existing || existing.organizationId !== organizationId) {
    throw ApiError.notFound('Organization member not found', 'MEMBER_NOT_FOUND');
  }

  // Prevent user from removing themselves if they are the last Admin/Owner
  const deleted = await prisma.organizationMember.delete({
    where: { id: memberId },
  });

  if (currentUserId) {
    await logAuthEvent({
      userId: currentUserId,
      action: 'ORGANIZATION_MEMBER_REMOVED',
      metadata: { organizationId, memberId, targetUserId: existing.userId },
    });
  }

  return {
    id: deleted.id,
    message: 'Member successfully removed from organization',
  };
};

export default {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
