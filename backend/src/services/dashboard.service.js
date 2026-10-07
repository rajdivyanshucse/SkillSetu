import { getProfile, getProfileSnapshot } from './profile.service.js';
import { calculateSkillCoverage } from './skillIntelligence.service.js';
import { getSkillGaps } from './skillGap.service.js';
import { getCareerIntelligence } from './careerIntelligence.service.js';
import { getCareerRoadmap } from './roadmap.service.js';
import { getSavedOpportunities } from './opportunity.service.js';
import { getUserApplications } from './application.service.js';

/**
 * Individual Workspace Dashboard Aggregation Service
 * Combines full profile and intelligence telemetry into a single unified payload.
 */

export const getIndividualDashboardData = async (userId) => {
  const [
    profile,
    snapshot,
    coverage,
    gapsData,
    career,
    roadmap,
    savedOpps,
    applications,
  ] = await Promise.all([
    getProfile(userId),
    getProfileSnapshot(userId),
    calculateSkillCoverage(userId),
    getSkillGaps(userId),
    getCareerIntelligence(userId),
    getCareerRoadmap(userId),
    getSavedOpportunities(userId),
    getUserApplications(userId),
  ]);

  return {
    profile: {
      id: profile.id,
      fullName: profile.fullName,
      headline: profile.headline,
      location: profile.location,
      completeness: profile.completeness,
      targetRole: profile.targetRole,
      skillsCount: profile.skills?.length || 0,
      experienceCount: profile.experiences?.length || 0,
      educationCount: profile.educations?.length || 0,
    },
    careerSnapshot: snapshot,
    skillCoverage: {
      targetRole: coverage.targetRole,
      coveragePercentage: coverage.coveragePercentage,
      requiredMatched: coverage.requiredSkills?.matched || 0,
      requiredTotal: coverage.requiredSkills?.total || 0,
    },
    priorityGaps: (gapsData.gaps || []).slice(0, 5),
    careerCompatibility: career.compatibility,
    developmentProgress: roadmap.developmentProgress,
    opportunitySummary: {
      savedCount: savedOpps.length,
      applicationsCount: applications.length,
      activeInterviewsCount: applications.filter((a) => a.status === 'INTERVIEW').length,
      offersCount: applications.filter((a) => a.status === 'OFFER').length,
    },
    recentActivity: [
      { type: 'PROFILE', message: `Profile completeness at ${profile.completeness}%`, timestamp: profile.updatedAt },
      ...(applications.slice(0, 3).map((app) => ({
        type: 'APPLICATION',
        message: `Applied for ${app.opportunity?.title || 'Opportunity'} at ${app.opportunity?.companyName || 'Company'}`,
        timestamp: app.appliedDate,
      }))),
    ],
  };
};

export default {
  getIndividualDashboardData,
};
