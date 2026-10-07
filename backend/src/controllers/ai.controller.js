import aiService from '../services/ai.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const extractSkills = async (req, res, next) => {
  try {
    const result = await aiService.extractSkills({
      text: req.body.text,
      userId: req.user?.id,
      accountType: req.user?.accountType,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Skills extracted and normalized successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const analyzeResume = async (req, res, next) => {
  try {
    const result = await aiService.analyzeResume({
      text: req.body.text,
      userId: req.user?.id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Resume analyzed successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const analyzeJobDescription = async (req, res, next) => {
  try {
    const result = await aiService.analyzeJobDescription({
      text: req.body.text,
      organizationId: req.organization?.id,
      userId: req.user?.id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Job description analyzed successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAiStatus = async (req, res, next) => {
  try {
    const status = await aiService.getAiStatus();
    return sendSuccess(res, {
      statusCode: 200,
      message: 'AI service status retrieved',
      data: { aiStatus: status },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  extractSkills,
  analyzeResume,
  analyzeJobDescription,
  getAiStatus,
};
