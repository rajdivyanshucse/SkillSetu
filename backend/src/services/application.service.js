import prisma from '../config/db.js';
import { ApiError } from '../utils/apiError.js';
import { logAuthEvent } from './audit.service.js';

/**
 * Individual Job Applications Lifecycle Service
 */

export const getUserApplications = async (userId) => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      opportunity: {
        include: {
          advertisedCompensations: true,
        },
      },
    },
    orderBy: { appliedDate: 'desc' },
  });
};

export const createApplication = async (userId, { opportunityId, status = 'APPLIED', notes = null }) => {
  const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opp) throw ApiError.notFound('Opportunity not found', 'OPPORTUNITY_NOT_FOUND');

  // Check duplicate
  const existing = await prisma.application.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('You have already applied or saved an application for this opportunity', 'APPLICATION_EXISTS');
  }

  const app = await prisma.application.create({
    data: {
      userId,
      opportunityId,
      status,
      notes,
    },
    include: {
      opportunity: true,
    },
  });

  await logAuthEvent({
    userId,
    action: 'APPLICATION_CREATED',
    metadata: { opportunityId, status, title: opp.title },
  });

  return app;
};

export const updateApplication = async (userId, applicationId, { status, notes }) => {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app || app.userId !== userId) {
    throw ApiError.notFound('Application record not found or unauthorized', 'APPLICATION_NOT_FOUND');
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
    include: {
      opportunity: true,
    },
  });

  await logAuthEvent({
    userId,
    action: 'APPLICATION_STATUS_UPDATED',
    metadata: { applicationId, newStatus: status },
  });

  return updated;
};

export const deleteApplication = async (userId, applicationId) => {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app || app.userId !== userId) {
    throw ApiError.notFound('Application record not found or unauthorized', 'APPLICATION_NOT_FOUND');
  }

  await prisma.application.delete({ where: { id: applicationId } });
  return { message: 'Application deleted successfully' };
};

export default {
  getUserApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
