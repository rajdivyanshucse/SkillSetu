import { z } from 'zod';

/**
 * Zod Schemas for Authentication & Authorization APIs
 */

export const registerSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    accountType: z.enum(['INDIVIDUAL', 'ORGANIZATION'], {
      required_error: 'Account type must be either INDIVIDUAL or ORGANIZATION',
      invalid_type_error: 'Account type must be either INDIVIDUAL or ORGANIZATION',
    }),
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100).optional(),
    firstName: z.string().trim().max(50).optional(),
    lastName: z.string().trim().max(50).optional(),
    organizationName: z.string().trim().min(2, 'Organization name must be at least 2 characters').max(150).optional(),
    industry: z.string().trim().max(100).optional(),
    companySize: z.string().trim().max(50).optional(),
    size: z.string().trim().max(50).optional(),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
};

export const refreshSchema = {
  body: z.object({
    refreshToken: z.string().min(10, 'Refresh token must be valid string').optional(),
  }),
};

export const verifyEmailRequestSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address format').toLowerCase().optional(),
  }),
};

export const verifyEmailConfirmSchema = {
  body: z.object({
    token: z.string({ required_error: 'Verification token is required' }).min(16, 'Invalid token length'),
  }),
};

export const forgotPasswordSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format')
      .toLowerCase(),
  }),
};

export const resetPasswordSchema = {
  body: z.object({
    token: z.string({ required_error: 'Password reset token is required' }).min(16, 'Invalid reset token'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
};

export const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'New password must be at least 8 characters long')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
};

export const sessionIdParamSchema = {
  params: z.object({
    sessionId: z.string({ required_error: 'Session ID is required' }).uuid('Invalid session ID format'),
  }),
};

export default {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifyEmailRequestSchema,
  verifyEmailConfirmSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  sessionIdParamSchema,
};
