/**
 * SkillSetu Compensation Intelligence Utilities (Phase 13)
 * Deterministic calculation engine for advertised opportunity compensation analysis.
 * 
 * Model Name: SkillSetu Prototype Compensation Intelligence Model
 */

import {
  normalizedRoles,
  fictionalOpportunityRecords,
  experienceBands,
  locationBenchmarks,
  skillCompensationAssociations,
  compensationDistributionBuckets,
  prototypeCompensationInsights,
  COMPENSATION_DISCLAIMERS,
  STORAGE_KEY_COMPENSATION,
} from '../data/compensationData';

/**
 * Calculates the deterministic median advertised compensation from a list of opportunities or numeric values.
 */
export const calculateMedianCompensation = (items = fictionalOpportunityRecords) => {
  if (!items || items.length === 0) return 11.0;
  
  const medians = items
    .map((item) => (typeof item === 'number' ? item : item.advertisedMedian || (item.advertisedMin + item.advertisedMax) / 2))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);

  if (medians.length === 0) return 11.0;

  const mid = Math.floor(medians.length / 2);
  const median = medians.length % 2 !== 0 ? medians[mid] : (medians[mid - 1] + medians[mid]) / 2;
  return Number(median.toFixed(1));
};

/**
 * Calculates the overall min, max, and span of advertised compensation.
 */
export const calculateCompensationRange = (items = fictionalOpportunityRecords) => {
  if (!items || items.length === 0) {
    return { min: 5.5, max: 32.0, formatted: '₹5.5–32.0 LPA' };
  }

  const mins = items.map((i) => i.advertisedMin || i.minLpa || 5.5);
  const maxs = items.map((i) => i.advertisedMax || i.maxLpa || 32.0);

  const min = Math.min(...mins);
  const max = Math.max(...maxs);

  return {
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
    formatted: `₹${min.toFixed(1)}–${max.toFixed(1)} LPA`,
  };
};

/**
 * Calculates 25th, 50th (median), and 75th percentiles.
 */
export const calculateCompensationPercentiles = (items = fictionalOpportunityRecords) => {
  if (!items || items.length === 0) {
    return { p25: 8.5, p50: 11.5, p75: 16.0 };
  }

  const values = items
    .map((i) => i.advertisedMedian || (i.advertisedMin + i.advertisedMax) / 2)
    .sort((a, b) => a - b);

  const getPercentile = (arr, p) => {
    const idx = (p / 100) * (arr.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    const weight = idx - lower;
    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
  };

  return {
    p25: Number(getPercentile(values, 25).toFixed(1)),
    p50: Number(getPercentile(values, 50).toFixed(1)),
    p75: Number(getPercentile(values, 75).toFixed(1)),
  };
};

/**
 * Computes compensation metrics grouped by experience band.
 */
export const calculateExperienceCompensation = (items = fictionalOpportunityRecords) => {
  return experienceBands.map((band) => {
    let bandItems = [];
    if (band.id === 'exp-0-1') {
      bandItems = items.filter((i) => i.experienceMin <= 1 && i.experienceMax <= 1);
    } else if (band.id === 'exp-1-3') {
      bandItems = items.filter((i) => (i.experienceMin >= 1 && i.experienceMin <= 3) || (i.experienceMax >= 2 && i.experienceMax <= 4));
    } else if (band.id === 'exp-3-5') {
      bandItems = items.filter((i) => i.experienceMin >= 3 && i.experienceMax <= 6);
    } else if (band.id === 'exp-5-8') {
      bandItems = items.filter((i) => i.experienceMin >= 5 && i.experienceMax <= 9);
    } else {
      bandItems = items.filter((i) => i.experienceMin >= 7 || i.experienceMax >= 10);
    }

    const count = bandItems.length > 0 ? bandItems.length : band.opportunityCount;
    const median = bandItems.length > 0 ? calculateMedianCompensation(bandItems) : band.medianLpa;
    const range = bandItems.length > 0 ? calculateCompensationRange(bandItems) : { formatted: band.typicalRange };

    return {
      ...band,
      calculatedCount: count,
      calculatedMedian: median,
      calculatedRange: range.formatted,
    };
  });
};

/**
 * Computes compensation metrics grouped by location.
 */
export const calculateLocationCompensation = (items = fictionalOpportunityRecords) => {
  return locationBenchmarks.map((loc) => {
    const locItems = items.filter(
      (i) => i.location && i.location.toLowerCase().includes(loc.name.toLowerCase().split(' ')[0])
    );
    const count = locItems.length > 0 ? locItems.length : loc.opportunityCount;
    const median = locItems.length > 0 ? calculateMedianCompensation(locItems) : loc.medianLpa;
    const range = locItems.length > 0 ? calculateCompensationRange(locItems) : { formatted: loc.typicalRange };

    return {
      ...loc,
      calculatedCount: count,
      calculatedMedian: median,
      calculatedRange: range.formatted,
    };
  });
};

/**
 * Calculates skill presence and compensation associations across opportunities.
 */
export const calculateSkillCompensationAssociation = (items = fictionalOpportunityRecords) => {
  const total = items.length || 1;

  return skillCompensationAssociations.map((skill) => {
    const matched = items.filter(
      (opp) => opp.skills && opp.skills.some((s) => s.toLowerCase() === skill.name.toLowerCase())
    );

    const count = matched.length > 0 ? matched.length : skill.opportunityCount;
    const median = matched.length > 0 ? calculateMedianCompensation(matched) : skill.medianLpa;
    const presenceRate = Math.round((count / total) * 100);

    return {
      ...skill,
      calculatedCount: count,
      calculatedMedian: median,
      presenceRate: presenceRate || skill.presenceRate,
    };
  });
};

/**
 * Generates comprehensive summary for a single role archetype.
 */
export const calculateRoleCompensationSummary = (roleId, items = fictionalOpportunityRecords) => {
  const role = normalizedRoles.find((r) => r.id === roleId) || normalizedRoles[0];
  const matchedOpps = items.filter((o) => o.roleId === roleId || o.role === role.title);

  const median = matchedOpps.length > 0 ? calculateMedianCompensation(matchedOpps) : role.medianLpa;
  const range = matchedOpps.length > 0 ? calculateCompensationRange(matchedOpps) : { formatted: role.typicalRange, min: role.minLpa, max: role.maxLpa };
  const percentiles = matchedOpps.length > 0 ? calculateCompensationPercentiles(matchedOpps) : { p25: role.p25Lpa, p50: role.medianLpa, p75: role.p75Lpa };

  return {
    ...role,
    matchedOpportunities: matchedOpps,
    calculatedMedian: median,
    calculatedRange: range.formatted,
    minLpa: range.min || role.minLpa,
    maxLpa: range.max || role.maxLpa,
    percentiles,
  };
};

/**
 * Calculates overall high-level opportunity signals for KPI grids.
 */
export const calculateOpportunitySignals = (items = fictionalOpportunityRecords) => {
  const median = calculateMedianCompensation(items);
  const range = calculateCompensationRange(items);
  const percentiles = calculateCompensationPercentiles(items);
  const uniqueRoles = new Set(items.map((i) => i.roleId || i.role)).size || normalizedRoles.length;
  const uniqueLocations = new Set(items.map((i) => i.location)).size || locationBenchmarks.length;

  return {
    totalOpportunities: items.length,
    medianCompensation: median,
    typicalRange: range.formatted,
    percentiles,
    rolesAnalyzed: uniqueRoles,
    locationsCovered: uniqueLocations,
    skillSignalsCount: skillCompensationAssociations.length,
  };
};

/**
 * Generates deterministic insights tailored to active filters.
 */
export const generateCompensationInsights = (items = fictionalOpportunityRecords, filters = {}) => {
  const baseInsights = [...prototypeCompensationInsights];

  if (filters.roleId) {
    const role = normalizedRoles.find((r) => r.id === filters.roleId);
    if (role) {
      baseInsights.unshift({
        id: `insight-role-${role.id}`,
        title: `${role.title} Focus`,
        observation: `In the prototype dataset, ${role.title} positions feature an advertised median of ₹${role.medianLpa} LPA with strong presence across ${role.commonExperience}.`,
        supportingMetric: `${role.typicalRange} advertised range across ${role.opportunityCount} prototype records`,
        context: `Key associated capabilities include ${role.topSkills.slice(0, 3).join(', ')}.`,
        limitation: 'Advertised parameters reflect opportunity descriptions, not guaranteed contract offers.',
        category: 'Role Specific',
      });
    }
  }

  if (filters.location) {
    const loc = locationBenchmarks.find((l) => l.name.toLowerCase() === filters.location.toLowerCase());
    if (loc) {
      baseInsights.unshift({
        id: `insight-loc-${loc.id}`,
        title: `${loc.name} Hub Profile`,
        observation: `Opportunities located in ${loc.name} show a median advertised compensation of ₹${loc.medianLpa} LPA.`,
        supportingMetric: `${loc.opportunityCount} prototype records with ${loc.workModeBreakdown.hybrid}% hybrid arrangements`,
        context: `Dominant role archetypes include ${loc.dominantRoles.slice(0, 2).join(', ')}.`,
        limitation: 'Reflects sample opportunity observations, not city-wide labor census.',
        category: 'Location Specific',
      });
    }
  }

  return baseInsights.slice(0, 5);
};

/**
 * Returns the appropriate disclaimer text.
 */
export const generateCompensationDisclaimer = (type = 'general') => {
  return COMPENSATION_DISCLAIMERS[type] || COMPENSATION_DISCLAIMERS.general;
};

/**
 * LocalStorage Helpers
 */
export const getStoredCompensationPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPENSATION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse compensation localStorage preferences:', e);
    return null;
  }
};

export const saveStoredCompensationPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEY_COMPENSATION, JSON.stringify(preferences));
  } catch (e) {
    console.warn('Failed to save compensation localStorage preferences:', e);
  }
};
