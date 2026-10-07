import dashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getIndividualDashboard = async (req, res, next) => {
  try {
    const dashboardData = await dashboardService.getIndividualDashboardData(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Individual dashboard intelligence retrieved',
      data: dashboardData,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getIndividualDashboard,
};
