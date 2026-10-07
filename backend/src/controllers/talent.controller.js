import talentService from '../services/talent.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getTalentPool = async (req, res, next) => {
  try {
    const result = await talentService.getTalentPool(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Talent pool retrieved successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await talentService.getCandidateById(req.organization.id, req.params.candidateId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Candidate capability profile retrieved',
      data: { candidate },
    });
  } catch (error) {
    return next(error);
  }
};

export const getCandidateCompatibility = async (req, res, next) => {
  try {
    const compatibility = await talentService.getCandidateCompatibility(
      req.organization.id,
      req.params.candidateId,
      req.query
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Candidate capability compatibility calculated',
      data: { compatibility },
    });
  } catch (error) {
    return next(error);
  }
};

export const getCandidateSemanticCompatibility = async (req, res, next) => {
  try {
    const result = await talentService.getCandidateSemanticCompatibility(
      req.organization.id,
      req.params.candidateId,
      req.query
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Candidate semantic compatibility calculated',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const compareCandidates = async (req, res, next) => {
  try {
    const candidateIds = req.query.candidateIds ? req.query.candidateIds.split(',') : [];
    const result = await talentService.compareCandidates(
      req.organization.id,
      candidateIds,
      req.query.roleId
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Candidate capability comparison calculated',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getShortlist = async (req, res, next) => {
  try {
    const result = await talentService.getShortlist(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization talent shortlist retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const addToShortlist = async (req, res, next) => {
  try {
    const shortlist = await talentService.addToShortlist(
      req.organization.id,
      req.params.candidateId,
      req.body,
      req.user.id
    );
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Candidate added to organization shortlist successfully',
      data: { shortlist },
    });
  } catch (error) {
    return next(error);
  }
};

export const removeFromShortlist = async (req, res, next) => {
  try {
    const result = await talentService.removeFromShortlist(
      req.organization.id,
      req.params.candidateId,
      req.user.id
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { shortlistId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getTalentPool,
  getCandidateById,
  getCandidateCompatibility,
  getCandidateSemanticCompatibility,
  compareCandidates,
  getShortlist,
  addToShortlist,
  removeFromShortlist,
};
