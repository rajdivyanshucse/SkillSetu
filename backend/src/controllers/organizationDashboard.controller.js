import organizationDashboardService from '../services/organizationDashboard.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getOrganizationDashboard = async (req, res, next) => {
  try {
    const dashboard = await organizationDashboardService.getOrganizationDashboard(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization aggregated dashboard telemetry retrieved',
      data: {
        dashboard,
        ...dashboard,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getOrganizationDashboard,
};
