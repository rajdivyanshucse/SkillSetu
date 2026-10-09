import capabilityIntelligenceService from '../services/capabilityIntelligence.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getCapabilityProfile = async (req, res, next) => {
  try {
    const profile = await capabilityIntelligenceService.getCapabilityProfile(req.user.id, {
      targetRoleId: req.query.targetRoleId || req.query.roleId,
      category: req.query.category,
      state: req.query.state,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Capability profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCapabilitySummary = async (req, res, next) => {
  try {
    const summary = await capabilityIntelligenceService.getCapabilitySummary(req.user.id, {
      targetRoleId: req.query.targetRoleId || req.query.roleId,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Capability summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCapabilityDetail = async (req, res, next) => {
  try {
    const detail = await capabilityIntelligenceService.getCapabilityDetail(
      req.user.id,
      req.params.skillId,
      { targetRoleId: req.query.targetRoleId || req.query.roleId }
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Capability detail retrieved successfully',
      data: detail,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCapabilityEvidenceList = async (req, res, next) => {
  try {
    const evidences = await capabilityIntelligenceService.getCapabilityEvidenceList(req.user.id, {
      skillId: req.params.skillId || req.query.skillId,
      evidenceType: req.query.evidenceType,
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Capability evidence items retrieved successfully',
      data: evidences,
    });
  } catch (error) {
    return next(error);
  }
};

export const linkEvidence = async (req, res, next) => {
  try {
    const evidence = await capabilityIntelligenceService.linkEvidence(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Evidence linked to capability successfully',
      data: evidence,
    });
  } catch (error) {
    return next(error);
  }
};

export const unlinkEvidence = async (req, res, next) => {
  try {
    const result = await capabilityIntelligenceService.unlinkEvidence(req.user.id, req.params.evidenceId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Evidence unlinked successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRoleCapabilityReadiness = async (req, res, next) => {
  try {
    const readiness = await capabilityIntelligenceService.getRoleCapabilityReadiness(req.user.id, req.params.roleId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Role capability readiness telemetry retrieved successfully',
      data: readiness,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getCapabilityProfile,
  getCapabilitySummary,
  getCapabilityDetail,
  getCapabilityEvidenceList,
  linkEvidence,
  unlinkEvidence,
  getRoleCapabilityReadiness,
};
