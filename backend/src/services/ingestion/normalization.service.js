import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export const MATCH_METHOD = {
  EXACT: 'EXACT',
  ALIAS: 'ALIAS',
  SEMANTIC: 'SEMANTIC',
  UNMATCHED: 'UNMATCHED',
};

export const NORMALIZATION_STATUS = {
  NORMALIZED: 'NORMALIZED',
  PARTIAL: 'PARTIAL',
  UNRESOLVED: 'UNRESOLVED',
};

// Canonical skill aliases map for deterministic normalization
const SKILL_ALIASES = {
  'js': 'JavaScript',
  'javascript': 'JavaScript',
  'es6': 'JavaScript',
  'ts': 'TypeScript',
  'typescript': 'TypeScript',
  'react': 'React.js',
  'reactjs': 'React.js',
  'react.js': 'React.js',
  'react native': 'React Native',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'psql': 'PostgreSQL',
  'py': 'Python',
  'python': 'Python',
  'python3': 'Python',
  'system design': 'System Architecture',
  'system architecture': 'System Architecture',
  'sys design': 'System Architecture',
  'docker': 'Docker',
  'containerization': 'Docker',
  'rest': 'REST APIs',
  'rest api': 'REST APIs',
  'restful apis': 'REST APIs',
  'rest apis': 'REST APIs',
  'graphql': 'GraphQL',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'aws': 'AWS Cloud',
  'aws cloud': 'AWS Cloud',
  'amazon web services': 'AWS Cloud',
  'ci/cd': 'CI/CD Pipelines',
  'cicd': 'CI/CD Pipelines',
  'ci cd': 'CI/CD Pipelines',
  'ci/cd pipelines': 'CI/CD Pipelines',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'tailwind css': 'Tailwind CSS',
  'dsa': 'Data Structures',
  'data structures': 'Data Structures',
  'algorithms': 'Data Structures',
  'ml': 'Machine Learning',
  'machine learning': 'Machine Learning',
  'ai': 'Artificial Intelligence',
  'nlp': 'Natural Language Processing',
  'git': 'Git & Version Control',
  'github': 'Git & Version Control',
};

// Canonical role aliases map for deterministic normalization
const ROLE_ALIASES = {
  'frontend engineer': 'Frontend Engineer',
  'frontend developer': 'Frontend Engineer',
  'front end developer': 'Frontend Engineer',
  'react developer': 'Frontend Engineer',
  'backend engineer': 'Backend Engineer',
  'backend developer': 'Backend Engineer',
  'back end developer': 'Backend Engineer',
  'node.js developer': 'Backend Engineer',
  'full stack engineer': 'Full Stack Engineer',
  'full stack developer': 'Full Stack Engineer',
  'fullstack developer': 'Full Stack Engineer',
  'software engineer': 'Full Stack Engineer',
  'software developer': 'Full Stack Engineer',
  'devops engineer': 'DevOps Engineer',
  'sre': 'DevOps Engineer',
  'site reliability engineer': 'DevOps Engineer',
  'cloud engineer': 'Cloud Engineer',
  'data engineer': 'Data Engineer',
  'data scientist': 'Data Scientist',
  'ai/ml engineer': 'AI/ML Engineer',
  'machine learning engineer': 'AI/ML Engineer',
  'product manager': 'Product Manager',
  'technical product manager': 'Product Manager',
  'ui/ux designer': 'UI/UX Designer',
  'product designer': 'UI/UX Designer',
};

export class NormalizationService {
  /**
   * Normalizes a full job posting record.
   */
  async normalizeJobPosting(rawRecord, options = {}) {
    if (!rawRecord || typeof rawRecord !== 'object') {
      return {
        isNormalized: false,
        status: NORMALIZATION_STATUS.UNRESOLVED,
        errors: ['Raw record must be an object'],
      };
    }

    const normalizedSkills = await this.normalizeSkills(rawRecord.skills || rawRecord.requiredSkills || []);
    const normalizedRole = await this.normalizeRole(rawRecord.title || rawRecord.role || rawRecord.jobTitle || '');
    const normalizedExperience = this.normalizeExperience(rawRecord.experience || rawRecord.experienceRequired || '');
    const normalizedLocation = this.normalizeLocation(rawRecord.location || rawRecord.workLocation || '');
    const normalizedCompensation = this.normalizeCompensation(rawRecord.salary || rawRecord.compensation || rawRecord.ctc || '');
    const normalizedDate = this.normalizeDate(rawRecord.postedDate || rawRecord.postingDate || rawRecord.createdAt || rawRecord.date || '');

    const employmentType = this.normalizeEmploymentType(rawRecord.employmentType || rawRecord.type || '');
    const organization = (rawRecord.organization || rawRecord.company || rawRecord.employer || '').trim() || null;
    const industry = (rawRecord.industry || rawRecord.domain || rawRecord.sector || '').trim() || null;

    // Calculate coverage metrics
    const totalSkills = normalizedSkills.length;
    const resolvedSkills = normalizedSkills.filter((s) => s.status === NORMALIZATION_STATUS.NORMALIZED).length;
    const skillCoverage = totalSkills > 0 ? Math.round((resolvedSkills / totalSkills) * 100) / 100 : 0;

    const isFullyNormalized =
      normalizedRole.status === NORMALIZATION_STATUS.NORMALIZED &&
      (totalSkills === 0 || skillCoverage >= 0.6);

    const overallStatus = isFullyNormalized
      ? NORMALIZATION_STATUS.NORMALIZED
      : resolvedSkills > 0 || normalizedRole.status === NORMALIZATION_STATUS.NORMALIZED
      ? NORMALIZATION_STATUS.PARTIAL
      : NORMALIZATION_STATUS.UNRESOLVED;

    return {
      isNormalized: isFullyNormalized,
      status: overallStatus,
      data: {
        rawTitle: rawRecord.title || rawRecord.role || rawRecord.jobTitle || null,
        role: normalizedRole,
        skills: normalizedSkills,
        skillCoverage,
        experience: normalizedExperience,
        location: normalizedLocation,
        compensation: normalizedCompensation,
        date: normalizedDate,
        employmentType,
        organization,
        industry,
        externalId: rawRecord.id || rawRecord.externalId || rawRecord.jobId || null,
      },
    };
  }

  /**
   * Normalizes a list of skills against the canonical catalog and alias map.
   */
  async normalizeSkills(rawSkillsInput) {
    let rawSkills = [];
    if (Array.isArray(rawSkillsInput)) {
      rawSkills = rawSkillsInput;
    } else if (typeof rawSkillsInput === 'string') {
      rawSkills = rawSkillsInput.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    }

    if (rawSkills.length === 0) return [];

    // Fetch existing canonical skills from database
    const canonicalSkills = await prisma.skill.findMany({ where: { isActive: true } });
    const canonicalMap = new Map();
    canonicalSkills.forEach((s) => {
      canonicalMap.set(s.name.toLowerCase(), s);
      if (s.normalizedName) {
        canonicalMap.set(s.normalizedName.toLowerCase(), s);
      }
    });

    const results = [];
    for (const raw of rawSkills) {
      if (!raw || typeof raw !== 'string') continue;
      const cleanRaw = raw.trim();
      const lowerRaw = cleanRaw.toLowerCase();

      // 1. Exact Match against DB
      if (canonicalMap.has(lowerRaw)) {
        const matched = canonicalMap.get(lowerRaw);
        results.push({
          raw: cleanRaw,
          canonicalName: matched.name,
          skillId: matched.id,
          category: matched.category,
          method: MATCH_METHOD.EXACT,
          confidence: 1.0,
          status: NORMALIZATION_STATUS.NORMALIZED,
        });
        continue;
      }

      // 2. Alias Match
      if (SKILL_ALIASES[lowerRaw]) {
        const aliasTarget = SKILL_ALIASES[lowerRaw];
        const matched = canonicalMap.get(aliasTarget.toLowerCase());
        results.push({
          raw: cleanRaw,
          canonicalName: aliasTarget,
          skillId: matched ? matched.id : null,
          category: matched ? matched.category : 'General',
          method: MATCH_METHOD.ALIAS,
          confidence: 0.95,
          status: NORMALIZATION_STATUS.NORMALIZED,
        });
        continue;
      }

      // 3. Fallback: Unmatched
      results.push({
        raw: cleanRaw,
        canonicalName: null,
        skillId: null,
        category: null,
        method: MATCH_METHOD.UNMATCHED,
        confidence: 0.0,
        status: NORMALIZATION_STATUS.UNRESOLVED,
      });
    }

    return results;
  }

  /**
   * Normalizes a job title / role against the canonical role taxonomy.
   */
  async normalizeRole(rawTitle) {
    if (!rawTitle || typeof rawTitle !== 'string') {
      return {
        raw: '',
        canonicalRole: null,
        roleId: null,
        method: MATCH_METHOD.UNMATCHED,
        confidence: 0.0,
        status: NORMALIZATION_STATUS.UNRESOLVED,
      };
    }

    const cleanTitle = rawTitle.trim();
    const lowerTitle = cleanTitle.toLowerCase();

    // Fetch canonical roles from database
    const canonicalRoles = await prisma.role.findMany();
    const roleMap = new Map();
    canonicalRoles.forEach((r) => {
      const roleName = r.name || r.title || '';
      if (roleName) {
        roleMap.set(roleName.toLowerCase(), r);
      }
    });

    // 1. Exact Match
    if (roleMap.has(lowerTitle)) {
      const matched = roleMap.get(lowerTitle);
      const matchedName = matched.name || matched.title;
      return {
        raw: cleanTitle,
        canonicalRole: matchedName,
        roleId: matched.id,
        method: MATCH_METHOD.EXACT,
        confidence: 1.0,
        status: NORMALIZATION_STATUS.NORMALIZED,
      };
    }

    // 2. Alias Match
    if (ROLE_ALIASES[lowerTitle]) {
      const targetRoleName = ROLE_ALIASES[lowerTitle];
      const matched = roleMap.get(targetRoleName.toLowerCase());
      return {
        raw: cleanTitle,
        canonicalRole: targetRoleName,
        roleId: matched ? matched.id : null,
        method: MATCH_METHOD.ALIAS,
        confidence: 0.92,
        status: NORMALIZATION_STATUS.NORMALIZED,
      };
    }

    // 3. Partial substring matching against known canonical roles
    for (const [canonicalName, roleObj] of roleMap.entries()) {
      if (lowerTitle.includes(canonicalName) || canonicalName.includes(lowerTitle)) {
        const canonicalRoleName = roleObj.name || roleObj.title;
        return {
          raw: cleanTitle,
          canonicalRole: canonicalRoleName,
          roleId: roleObj.id,
          method: MATCH_METHOD.ALIAS,
          confidence: 0.85,
          status: NORMALIZATION_STATUS.NORMALIZED,
        };
      }
    }

    // 4. Unmatched
    return {
      raw: cleanTitle,
      canonicalRole: null,
      roleId: null,
      method: MATCH_METHOD.UNMATCHED,
      confidence: 0.0,
      status: NORMALIZATION_STATUS.UNRESOLVED,
    };
  }

  /**
   * Normalizes experience expressions (e.g., "2-4 years", "2+ yrs", "5 years", "Fresher").
   */
  normalizeExperience(rawExp) {
    if (rawExp === null || rawExp === undefined || rawExp === '') {
      return {
        raw: null,
        minYears: null,
        maxYears: null,
        unit: 'YEARS',
        isStructured: false,
      };
    }

    if (typeof rawExp === 'number') {
      return {
        raw: `${rawExp} years`,
        minYears: rawExp,
        maxYears: rawExp,
        unit: 'YEARS',
        isStructured: true,
      };
    }

    const str = String(rawExp).trim().toLowerCase();

    // Check for fresher/entry level
    if (str.includes('fresher') || str.includes('entry') || str.includes('intern') || str === '0') {
      return {
        raw: String(rawExp).trim(),
        minYears: 0,
        maxYears: 1,
        unit: 'YEARS',
        isStructured: true,
      };
    }

    // Range patterns: "2-4 years", "2 to 5 yrs", "2 - 6 years"
    const rangeMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/i);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      return {
        raw: String(rawExp).trim(),
        minYears: Math.min(min, max),
        maxYears: Math.max(min, max),
        unit: 'YEARS',
        isStructured: true,
      };
    }

    // Plus patterns: "5+ years", "3+ yrs", "at least 4 years"
    const plusMatch = str.match(/(\d+(?:\.\d+)?)\s*\+/i) || str.match(/(?:at least|min|minimum)\s*(\d+(?:\.\d+)?)/i);
    if (plusMatch) {
      const min = parseFloat(plusMatch[1]);
      return {
        raw: String(rawExp).trim(),
        minYears: min,
        maxYears: null,
        unit: 'YEARS',
        isStructured: true,
      };
    }

    // Single number: "5 years", "3 yrs"
    const singleMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:yrs|years|year|yr)/i);
    if (singleMatch) {
      const val = parseFloat(singleMatch[1]);
      return {
        raw: String(rawExp).trim(),
        minYears: val,
        maxYears: val,
        unit: 'YEARS',
        isStructured: true,
      };
    }

    return {
      raw: String(rawExp).trim(),
      minYears: null,
      maxYears: null,
      unit: 'YEARS',
      isStructured: false,
    };
  }

  /**
   * Normalizes location strings (city, state, country, workMode).
   */
  normalizeLocation(rawLoc) {
    if (!rawLoc || typeof rawLoc !== 'string') {
      return {
        raw: null,
        city: null,
        state: null,
        country: null,
        workMode: 'ON_SITE',
        isStructured: false,
      };
    }

    const clean = rawLoc.trim();
    const lower = clean.toLowerCase();

    let workMode = 'ON_SITE';
    if (lower.includes('remote') || lower.includes('work from home') || lower.includes('wfh')) {
      workMode = 'REMOTE';
    } else if (lower.includes('hybrid') || lower.includes('flexible')) {
      workMode = 'HYBRID';
    }

    // Handle common location splits (e.g. "New Delhi, Delhi, India" or "Bengaluru, India")
    const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);
    let city = null;
    let state = null;
    let country = null;

    if (parts.length === 1) {
      if (['india', 'usa', 'united states', 'uk', 'germany', 'singapore'].includes(parts[0].toLowerCase())) {
        country = parts[0];
      } else {
        city = parts[0];
      }
    } else if (parts.length === 2) {
      city = parts[0];
      country = parts[1];
    } else if (parts.length >= 3) {
      city = parts[0];
      state = parts[1];
      country = parts[2];
    }

    // Standardize obvious country aliases
    if (country) {
      const lowerCountry = country.toLowerCase();
      if (lowerCountry === 'in' || lowerCountry === 'ind') country = 'India';
      if (lowerCountry === 'us' || lowerCountry === 'usa') country = 'United States';
      if (lowerCountry === 'uk') country = 'United Kingdom';
    }

    return {
      raw: clean,
      city,
      state,
      country,
      workMode,
      isStructured: Boolean(city || country),
    };
  }

  /**
   * Normalizes advertised compensation patterns.
   * Preserves raw values, parses numeric bounds, avoids causal claims.
   */
  normalizeCompensation(rawComp) {
    if (rawComp === null || rawComp === undefined || rawComp === '') {
      return {
        raw: null,
        minSalary: null,
        maxSalary: null,
        currency: 'INR',
        period: 'ANNUAL',
        isNumeric: false,
        patternType: 'UNSPECIFIED',
      };
    }

    if (typeof rawComp === 'number') {
      return {
        raw: `${rawComp}`,
        minSalary: rawComp,
        maxSalary: rawComp,
        currency: 'INR',
        period: 'ANNUAL',
        isNumeric: true,
        patternType: 'EXACT_NUMERIC',
      };
    }

    const str = String(rawComp).trim();
    const lower = str.toLowerCase();

    let currency = 'INR';
    if (str.includes('$') || lower.includes('usd') || lower.includes('dollar')) currency = 'USD';
    if (str.includes('€') || lower.includes('eur')) currency = 'EUR';
    if (str.includes('£') || lower.includes('gbp')) currency = 'GBP';

    let period = 'ANNUAL';
    if (lower.includes('/month') || lower.includes('per month') || lower.includes('pm') || lower.includes('monthly')) {
      period = 'MONTHLY';
    }

    // LPA patterns: "₹8-12 LPA", "8 - 12 LPA", "₹8-₹12 LPA", "10 LPA", "15 lpa"
    const lpaRange = lower.match(/[$₹€£]?\s*(\d+(?:\.\d+)?)\s*(?:-|to)\s*[$₹€£]?\s*(\d+(?:\.\d+)?)\s*lpa/i);
    if (lpaRange) {
      const min = parseFloat(lpaRange[1]) * 100000;
      const max = parseFloat(lpaRange[2]) * 100000;
      return {
        raw: str,
        minSalary: Math.min(min, max),
        maxSalary: Math.max(min, max),
        currency: 'INR',
        period: 'ANNUAL',
        isNumeric: true,
        patternType: 'ADVERTISED_COMPENSATION_PATTERN',
      };
    }

    const lpaSingle = lower.match(/[$₹€£]?\s*(\d+(?:\.\d+)?)\s*lpa/i);
    if (lpaSingle) {
      const val = parseFloat(lpaSingle[1]) * 100000;
      return {
        raw: str,
        minSalary: val,
        maxSalary: val,
        currency: 'INR',
        period: 'ANNUAL',
        isNumeric: true,
        patternType: 'ADVERTISED_COMPENSATION_PATTERN',
      };
    }

    // $k patterns: "$80k-$100k", "$80k to $100k", "80k to 100k"
    const kRange = lower.match(/[$₹€£]?\s*(\d+(?:\.\d+)?)\s*k\s*(?:-|to)\s*[$₹€£]?\s*(\d+(?:\.\d+)?)\s*k/i);
    if (kRange) {
      const min = parseFloat(kRange[1]) * 1000;
      const max = parseFloat(kRange[2]) * 1000;
      return {
        raw: str,
        minSalary: Math.min(min, max),
        maxSalary: Math.max(min, max),
        currency,
        period: 'ANNUAL',
        isNumeric: true,
        patternType: 'ADVERTISED_COMPENSATION_PATTERN',
      };
    }

    const kSingle = lower.match(/[$₹€£]?\s*(\d+(?:\.\d+)?)\s*k/i);
    if (kSingle) {
      const val = parseFloat(kSingle[1]) * 1000;
      return {
        raw: str,
        minSalary: val,
        maxSalary: val,
        currency,
        period: 'ANNUAL',
        isNumeric: true,
        patternType: 'ADVERTISED_COMPENSATION_PATTERN',
      };
    }

    // Standard number range: "500000 - 800000", "50,000 - 80,000"
    const cleanNumbers = str.replace(/[,₹$€£]/g, '');
    const numRange = cleanNumbers.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/);
    if (numRange) {
      const min = parseFloat(numRange[1]);
      const max = parseFloat(numRange[2]);
      return {
        raw: str,
        minSalary: Math.min(min, max),
        maxSalary: Math.max(min, max),
        currency,
        period,
        isNumeric: true,
        patternType: 'ADVERTISED_COMPENSATION_PATTERN',
      };
    }

    // Non-numeric descriptions (e.g. "Competitive salary", "Market standard")
    return {
      raw: str,
      minSalary: null,
      maxSalary: null,
      currency,
      period,
      isNumeric: false,
      patternType: 'DESCRIPTIVE_PATTERN',
    };
  }

  /**
   * Normalizes dates into standard representations and observation periods (e.g. 2026-Q1).
   */
  normalizeDate(rawDate) {
    if (!rawDate) {
      const now = new Date();
      return this._formatDateOutput(now, false);
    }

    const d = new Date(rawDate);
    if (isNaN(d.getTime())) {
      return {
        raw: String(rawDate),
        isoDate: null,
        quarter: null,
        month: null,
        year: null,
        isValid: false,
      };
    }

    return this._formatDateOutput(d, true);
  }

  _formatDateOutput(dateObj, isValid = true) {
    const year = dateObj.getUTCFullYear();
    const monthNum = dateObj.getUTCMonth() + 1;
    const quarterNum = Math.ceil(monthNum / 3);
    const monthStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;

    return {
      raw: dateObj.toISOString(),
      isoDate: dateObj.toISOString(),
      quarter: `${year}-Q${quarterNum}`,
      month: `${year}-${monthStr}`,
      year,
      isValid,
    };
  }

  /**
   * Normalizes employment type strings.
   */
  normalizeEmploymentType(rawType) {
    if (!rawType) return 'FULL_TIME';
    const lower = String(rawType).toLowerCase();
    if (lower.includes('part') || lower.includes('part-time')) return 'PART_TIME';
    if (lower.includes('contract') || lower.includes('freelance') || lower.includes('temp')) return 'CONTRACT';
    if (lower.includes('intern') || lower.includes('trainee')) return 'INTERNSHIP';
    return 'FULL_TIME';
  }
}

export const normalizationService = new NormalizationService();
export default normalizationService;
