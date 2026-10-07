import organizationMemberService from '../services/organizationMember.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getMembers = async (req, res, next) => {
  try {
    const result = await organizationMemberService.getMembers(req.organization.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization members retrieved',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMemberById = async (req, res, next) => {
  try {
    const member = await organizationMemberService.getMemberById(req.organization.id, req.params.memberId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization member details retrieved',
      data: { member },
    });
  } catch (error) {
    return next(error);
  }
};

export const createMember = async (req, res, next) => {
  try {
    const member = await organizationMemberService.createMember(req.organization.id, req.body, req.user.id);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Member added to organization successfully',
      data: { member },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateMember = async (req, res, next) => {
  try {
    const member = await organizationMemberService.updateMember(
      req.organization.id,
      req.params.memberId,
      req.body,
      req.user.id
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Organization member updated successfully',
      data: { member },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteMember = async (req, res, next) => {
  try {
    const result = await organizationMemberService.deleteMember(
      req.organization.id,
      req.params.memberId,
      req.user.id
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: result.message,
      data: { memberId: result.id },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
