import opportunityService from '../services/opportunity.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getOpportunities = async (req, res, next) => {
  try {
    const result = await opportunityService.getOpportunities(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Opportunities retrieved',
      data: { opportunities: result.opportunities },
      meta: { pagination: result.pagination },
    });
  } catch (error) {
    return next(error);
  }
};

export const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunityById(req.params.opportunityId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Opportunity detail retrieved',
      data: { opportunity },
    });
  } catch (error) {
    return next(error);
  }
};

export const calculateOpportunityCompatibility = async (req, res, next) => {
  try {
    const compatibility = await opportunityService.calculateOpportunityCompatibility(req.user.id, req.params.opportunityId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Opportunity compatibility calculated',
      data: compatibility,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSavedOpportunities = async (req, res, next) => {
  try {
    const saved = await opportunityService.getSavedOpportunities(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Saved opportunities retrieved',
      data: { savedOpportunities: saved },
    });
  } catch (error) {
    return next(error);
  }
};

export const saveOpportunity = async (req, res, next) => {
  try {
    const saved = await opportunityService.saveOpportunity(req.user.id, req.params.opportunityId, req.body.notes);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Opportunity bookmarked successfully',
      data: { savedOpportunity: saved },
    });
  } catch (error) {
    return next(error);
  }
};

export const removeSavedOpportunity = async (req, res, next) => {
  try {
    const result = await opportunityService.removeSavedOpportunity(req.user.id, req.params.opportunityId);
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getOpportunities,
  getOpportunityById,
  calculateOpportunityCompatibility,
  getSavedOpportunities,
  saveOpportunity,
  removeSavedOpportunity,
};
