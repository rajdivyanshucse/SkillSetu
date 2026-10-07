import logger from '../../utils/logger.js';

export const QUARANTINE_REASONS = {
  MALFORMED_SCHEMA: 'MALFORMED_SCHEMA',
  INVALID_REQUIRED_FIELD: 'INVALID_REQUIRED_FIELD',
  IMPOSSIBLE_VALUE: 'IMPOSSIBLE_VALUE',
  UNRESOLVED_CRITICAL_MAPPING: 'UNRESOLVED_CRITICAL_MAPPING',
  DUPLICATE_CONFLICT: 'DUPLICATE_CONFLICT',
  UNSAFE_CONTENT: 'UNSAFE_CONTENT',
  INCONSISTENT_DATES: 'INCONSISTENT_DATES',
  INVALID_COMPENSATION_FORMAT: 'INVALID_COMPENSATION_FORMAT',
};

export class ValidationService {
  /**
   * Validates a raw record and its normalized form.
   * Returns { isValid, shouldQuarantine, quarantineReason, errors, warnings }
   */
  validateRecord(rawRecord, normalizedResult = null) {
    const errors = [];
    const warnings = [];
    let quarantineReason = null;

    // 1. Check for empty or malformed record
    if (!rawRecord || typeof rawRecord !== 'object' || Array.isArray(rawRecord) || Object.keys(rawRecord).length === 0) {
      return {
        isValid: false,
        shouldQuarantine: true,
        quarantineReason: QUARANTINE_REASONS.MALFORMED_SCHEMA,
        errors: ['Record is empty or not a valid JSON object'],
        warnings: [],
      };
    }

    // 2. Unsafe Content Detection
    const rawString = JSON.stringify(rawRecord);
    if (this._containsUnsafeContent(rawString)) {
      return {
        isValid: false,
        shouldQuarantine: true,
        quarantineReason: QUARANTINE_REASONS.UNSAFE_CONTENT,
        errors: ['Record contains potentially unsafe or malicious content strings'],
        warnings: [],
      };
    }

    // 3. Required Fields Check (Job title / Role is mandatory for JOB_POSTINGS)
    const title = rawRecord.title || rawRecord.role || rawRecord.jobTitle;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Missing mandatory field: title / role');
      quarantineReason = QUARANTINE_REASONS.INVALID_REQUIRED_FIELD;
    }

    // 4. Normalized Data Checks (if normalization was already computed)
    if (normalizedResult?.data) {
      const { experience, compensation, date, role } = normalizedResult.data;

      // Experience consistency & boundaries
      if (experience?.isStructured) {
        if (experience.minYears < 0 || experience.maxYears < 0) {
          errors.push(`Impossible experience value: negative years (${experience.minYears})`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.IMPOSSIBLE_VALUE;
        }
        if (experience.minYears > 50 || experience.maxYears > 50) {
          errors.push(`Impossible experience value: > 50 years (${experience.minYears})`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.IMPOSSIBLE_VALUE;
        }
        if (experience.minYears !== null && experience.maxYears !== null && experience.minYears > experience.maxYears) {
          errors.push(`Inconsistent experience: min (${experience.minYears}) > max (${experience.maxYears})`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.IMPOSSIBLE_VALUE;
        }
      }

      // Compensation consistency
      if (compensation?.isNumeric) {
        if (compensation.minSalary < 0 || compensation.maxSalary < 0) {
          errors.push(`Impossible compensation value: negative amount`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.INVALID_COMPENSATION_FORMAT;
        }
        if (compensation.minSalary !== null && compensation.maxSalary !== null && compensation.minSalary > compensation.maxSalary) {
          errors.push(`Inconsistent compensation: min salary > max salary`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.INVALID_COMPENSATION_FORMAT;
        }
      }

      // Date validity & boundaries
      if (date && !date.isValid) {
        errors.push(`Invalid date format or unparseable date`);
        quarantineReason = quarantineReason || QUARANTINE_REASONS.INCONSISTENT_DATES;
      } else if (date?.year) {
        const currentYear = new Date().getFullYear();
        if (date.year < 1990 || date.year > currentYear + 10) {
          errors.push(`Impossible date year: ${date.year}`);
          quarantineReason = quarantineReason || QUARANTINE_REASONS.INCONSISTENT_DATES;
        }
      }

      // Critical role mapping unresolved warning
      if (role?.status === 'UNRESOLVED') {
        warnings.push(`Job title "${role.raw}" could not be matched to canonical role taxonomy`);
      }
    }

    const isValid = errors.length === 0;
    const shouldQuarantine = !isValid;

    return {
      isValid,
      shouldQuarantine,
      quarantineReason: shouldQuarantine ? (quarantineReason || QUARANTINE_REASONS.MALFORMED_SCHEMA) : null,
      errors,
      warnings,
    };
  }

  /**
   * Basic safety check against script injections and control payloads.
   */
  _containsUnsafeContent(str) {
    if (!str) return false;
    const lower = str.toLowerCase();
    const unsafePatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /<iframe/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
    ];
    return unsafePatterns.some((p) => p.test(lower));
  }
}

export const validationService = new ValidationService();
export default validationService;
