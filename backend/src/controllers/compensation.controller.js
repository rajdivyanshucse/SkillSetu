import compensationService from '../services/compensation.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getCompensationOverview = async (req, res, next) => {
  try {
    const compensation = await compensationService.getCompensationOverview(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Advertised compensation patterns retrieved',
      data: { compensation },
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleCompensation = async (req, res, next) => {
  try {
    const compensation = await compensationService.getRoleCompensation(req.organization.id, req.params.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role advertised compensation pattern retrieved',
      data: {
        roleCompensation: compensation,
        compensation,
        ...compensation,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getLocationCompensation = async (req, res, next) => {
  try {
    const locations = await compensationService.getLocationCompensation(req.organization.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Location-level advertised compensation patterns retrieved',
      data: locations,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getCompensationOverview,
  getRoleCompensation,
  getLocationCompensation,
};
