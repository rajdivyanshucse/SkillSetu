/**
 * SkillSetu Talent Matching Engine (Phase 11)
 * Deterministic frontend compatibility modeling combining required skills, preferred skills, role alignment, and experience.
 *
 * NOTE: Compatibility is a decision-support heuristic, not a hiring guarantee or selection probability.
 */

/**
 * Calculates candidate alignment with required skills (0–100%)
 */
export const calculateRequiredSkillFit = (candidate, role) => {
  if (!candidate || !role || !role.requiredSkills || role.requiredSkills.length === 0) {
    return 80;
  }

  const candidateSkills = candidate.skills || {};
  let totalPoints = 0;
  let maxPoints = role.requiredSkills.length * 10;

  role.requiredSkills.forEach((skillName) => {
    const score = candidateSkills[skillName] || 0;
    totalPoints += score;
  });

  return Math.min(100, Math.round((totalPoints / maxPoints) * 100));
};

/**
 * Calculates candidate alignment with preferred skills (0–100%)
 */
export const calculatePreferredSkillFit = (candidate, role) => {
  if (!candidate || !role || !role.preferredSkills || role.preferredSkills.length === 0) {
    return 70;
  }

  const candidateSkills = candidate.skills || {};
  let totalPoints = 0;
  let maxPoints = role.preferredSkills.length * 10;

  role.preferredSkills.forEach((skillName) => {
    const score = candidateSkills[skillName] || 0;
    totalPoints += score;
  });

  return Math.min(100, Math.round((totalPoints / maxPoints) * 100));
};

/**
 * Calculates role alignment based on candidate's target roles and headline
 */
export const calculateRoleAlignment = (candidate, role) => {
  if (!candidate || !role) return 75;

  const targetRoles = candidate.targetRoles || [];
  const isDirectTarget = targetRoles.includes(role.id);
  const headlineMatches = (candidate.headline || '').toLowerCase().includes((role.title || '').toLowerCase().split(' ')[0]);

  if (isDirectTarget) return 95;
  if (headlineMatches) return 85;
  return 70;
};

/**
 * Calculates experience alignment (0–100%)
 */
export const calculateExperienceAlignment = (candidate, role) => {
  if (!candidate || !role) return 80;

  const candidateExp = candidate.experienceYears || 2.0;
  const minExp = role.minExperienceYears || 1.5;

  if (candidateExp >= minExp) {
    return 90;
  }
  const ratio = candidateExp / minExp;
  return Math.min(100, Math.max(50, Math.round(ratio * 90)));
};

/**
 * Calculates composite Talent Compatibility score (0–100%)
 * Configurable weights:
 * - Required Skills: 45%
 * - Preferred Skills: 20%
 * - Role Alignment: 20%
 * - Experience Alignment: 15%
 */
export const calculateTalentCompatibility = (candidate, role) => {
  const reqFit = calculateRequiredSkillFit(candidate, role);
  const prefFit = calculatePreferredSkillFit(candidate, role);
  const roleFit = calculateRoleAlignment(candidate, role);
  const expFit = calculateExperienceAlignment(candidate, role);

  const weightedScore = Math.round(
    reqFit * 0.45 +
    prefFit * 0.20 +
    roleFit * 0.20 +
    expFit * 0.15
  );

  return {
    overallCompatibility: Math.min(99, Math.max(45, weightedScore)),
    requiredSkillFit: reqFit,
    preferredSkillFit: prefFit,
    roleAlignment: roleFit,
    experienceAlignment: expFit,
  };
};

/**
 * Categorizes skills into Strong Match, Partial Match, and Development Area
 */
export const getMatchingSkills = (candidate, role) => {
  if (!candidate || !role) {
    return { strongMatches: [], partialMatches: [], developmentAreas: [] };
  }

  const candidateSkills = candidate.skills || {};
  const strongMatches = [];
  const partialMatches = [];
  const developmentAreas = [];

  const allRoleSkills = [
    ...(role.requiredSkills || []).map((s) => ({ name: s, isRequired: true })),
    ...(role.preferredSkills || []).map((s) => ({ name: s, isRequired: false })),
  ];

  allRoleSkills.forEach(({ name, isRequired }) => {
    const score = candidateSkills[name] || 0;
    const item = {
      name,
      score,
      isRequired,
      proficiency: score >= 8 ? 'Advanced' : score >= 6 ? 'Intermediate' : score >= 4 ? 'Developing' : 'Beginner / Limited',
    };

    if (score >= 7) {
      strongMatches.push(item);
    } else if (score >= 4) {
      partialMatches.push(item);
    } else {
      developmentAreas.push(item);
    }
  });

  return { strongMatches, partialMatches, developmentAreas };
};

/**
 * Extracts candidate development areas specifically relative to role requirements
 */
export const getDevelopmentAreas = (candidate, role) => {
  const { partialMatches, developmentAreas } = getMatchingSkills(candidate, role);
  return [...developmentAreas, ...partialMatches.filter((p) => p.isRequired)];
};

/**
 * Produces structured explanation of the compatibility signal
 */
export const getTalentMatchExplanation = (candidate, role) => {
  const comp = calculateTalentCompatibility(candidate, role);
  const { strongMatches, developmentAreas } = getMatchingSkills(candidate, role);

  return {
    score: comp.overallCompatibility,
    breakdown: comp,
    summary: `${candidate.name} exhibits ${comp.overallCompatibility}% overall role alignment for ${role.title}, with ${strongMatches.length} strong skill matches and ${developmentAreas.length} potential development areas.`,
    methodologyNotice: 'Compatibility reflects alignment between the configured role requirements and candidate profile attributes. It is not a hiring or selection probability.',
  };
};
