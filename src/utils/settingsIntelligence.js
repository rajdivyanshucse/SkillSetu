/**
 * SkillSetu Settings Intelligence Utility (Phase 16)
 * Safe LocalStorage getters, setters, reset logic, data export simulators,
 * and summary generators with schema resilience and fallback defaults.
 */

import {
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_NOTIFICATION_PREFS,
  STORAGE_KEY_CAREER_PREFS,
  STORAGE_KEY_LEARNING_PREFS,
  STORAGE_KEY_OPPORTUNITY_PREFS,
  STORAGE_KEY_APPEARANCE_PREFS,
  STORAGE_KEY_PRIVACY_PREFS,
  STORAGE_KEY_ACCOUNT_ACTIVITY,
  STORAGE_KEY_ORG_SETTINGS,
  STORAGE_KEY_ORG_NOTIFICATION_PREFS,
  STORAGE_KEY_ORG_WORKFORCE_PREFS,
  STORAGE_KEY_ORG_PRIVACY_PREFS,
  STORAGE_KEY_ORG_MEMBERS,
  STORAGE_KEY_ORG_ACTIVITY,
  defaultAccountProfile,
  defaultProfileVisibility,
  defaultCareerPreferences,
  defaultNotificationPreferences,
  defaultLearningPreferences,
  defaultOpportunityPreferences,
  defaultPrivacyPreferences,
  defaultAppearancePreferences,
  initialIndividualActivity,
  defaultOrganizationSettings,
  defaultOrganizationMembers,
  defaultOrganizationNotifications,
  initialOrganizationActivity,
} from '../data/settingsData';

// Safe Storage Helper
const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return typeof parsed === 'object' && parsed !== null
      ? Array.isArray(fallback)
        ? Array.isArray(parsed) ? parsed : fallback
        : { ...fallback, ...parsed }
      : parsed;
  } catch (err) {
    console.warn(`[SkillSetu Settings] Corrupt LocalStorage key "${key}", reverting to fallback:`, err);
    return fallback;
  }
};

const safeSet = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`[SkillSetu Settings] Failed to save key "${key}":`, err);
    return false;
  }
};

// 1. Account & Profile
export const getStoredSettings = () => {
  return safeGet(STORAGE_KEY_SETTINGS, {
    account: defaultAccountProfile,
    profileVisibility: defaultProfileVisibility,
  });
};

export const saveSettings = (newSettings) => {
  const current = getStoredSettings();
  const updated = { ...current, ...newSettings };
  safeSet(STORAGE_KEY_SETTINGS, updated);
  return updated;
};

// 2. Notification Preferences
export const getStoredNotificationPreferences = () => {
  return safeGet(STORAGE_KEY_NOTIFICATION_PREFS, defaultNotificationPreferences);
};

export const saveNotificationPreferences = (prefs) => {
  safeSet(STORAGE_KEY_NOTIFICATION_PREFS, prefs);
  return prefs;
};

// 3. Career Preferences
export const getStoredCareerPreferences = () => {
  return safeGet(STORAGE_KEY_CAREER_PREFS, defaultCareerPreferences);
};

export const saveCareerPreferences = (prefs) => {
  safeSet(STORAGE_KEY_CAREER_PREFS, prefs);
  return prefs;
};

// 4. Learning Preferences
export const getStoredLearningPreferences = () => {
  return safeGet(STORAGE_KEY_LEARNING_PREFS, defaultLearningPreferences);
};

export const saveLearningPreferences = (prefs) => {
  safeSet(STORAGE_KEY_LEARNING_PREFS, prefs);
  return prefs;
};

// 5. Opportunity Preferences
export const getStoredOpportunityPreferences = () => {
  return safeGet(STORAGE_KEY_OPPORTUNITY_PREFS, defaultOpportunityPreferences);
};

export const saveOpportunityPreferences = (prefs) => {
  safeSet(STORAGE_KEY_OPPORTUNITY_PREFS, prefs);
  return prefs;
};

// 6. Appearance Preferences
export const getStoredAppearancePreferences = () => {
  return safeGet(STORAGE_KEY_APPEARANCE_PREFS, defaultAppearancePreferences);
};

export const saveAppearancePreferences = (prefs) => {
  safeSet(STORAGE_KEY_APPEARANCE_PREFS, prefs);
  return prefs;
};

// 7. Privacy Preferences
export const getStoredPrivacyPreferences = () => {
  return safeGet(STORAGE_KEY_PRIVACY_PREFS, defaultPrivacyPreferences);
};

export const savePrivacyPreferences = (prefs) => {
  safeSet(STORAGE_KEY_PRIVACY_PREFS, prefs);
  return prefs;
};

// 8. Individual Account Activity
export const getStoredAccountActivity = () => {
  return safeGet(STORAGE_KEY_ACCOUNT_ACTIVITY, initialIndividualActivity);
};

export const logAccountActivity = (activityItem) => {
  const current = getStoredAccountActivity();
  const newItem = {
    id: `act-${Date.now()}`,
    timestamp: 'Just now',
    ...activityItem,
  };
  const updated = [newItem, ...current];
  safeSet(STORAGE_KEY_ACCOUNT_ACTIVITY, updated);
  return updated;
};

export const clearAccountActivity = () => {
  safeSet(STORAGE_KEY_ACCOUNT_ACTIVITY, []);
  return [];
};

// 9. Organization Settings
export const getStoredOrganizationSettings = () => {
  return safeGet(STORAGE_KEY_ORG_SETTINGS, defaultOrganizationSettings);
};

export const saveOrganizationSettings = (settings) => {
  safeSet(STORAGE_KEY_ORG_SETTINGS, settings);
  return settings;
};

// 10. Organization Members
export const getStoredOrganizationMembers = () => {
  return safeGet(STORAGE_KEY_ORG_MEMBERS, defaultOrganizationMembers);
};

export const saveOrganizationMembers = (members) => {
  safeSet(STORAGE_KEY_ORG_MEMBERS, members);
  return members;
};

// 11. Organization Notification Preferences
export const getStoredOrgNotificationPreferences = () => {
  return safeGet(STORAGE_KEY_ORG_NOTIFICATION_PREFS, defaultOrganizationNotifications);
};

export const saveOrgNotificationPreferences = (prefs) => {
  safeSet(STORAGE_KEY_ORG_NOTIFICATION_PREFS, prefs);
  return prefs;
};

// 12. Organization Workforce Preferences
export const getStoredOrgWorkforcePreferences = () => {
  return safeGet(STORAGE_KEY_ORG_WORKFORCE_PREFS, {
    planningHorizon: '12 months',
    defaultScenario: 'Growth & Cloud Acceleration',
    primaryAreas: ['Skill gaps', 'Future skills', 'Talent matching', 'Workforce planning'],
  });
};

export const saveOrgWorkforcePreferences = (prefs) => {
  safeSet(STORAGE_KEY_ORG_WORKFORCE_PREFS, prefs);
  return prefs;
};

// 13. Organization Privacy Preferences
export const getStoredOrgPrivacyPreferences = () => {
  return safeGet(STORAGE_KEY_ORG_PRIVACY_PREFS, {
    organizationVisibility: 'Verified Talent Network Only',
    dataUsageAnalytics: true,
    anonymizeWorkforceMetrics: true,
  });
};

export const saveOrgPrivacyPreferences = (prefs) => {
  safeSet(STORAGE_KEY_ORG_PRIVACY_PREFS, prefs);
  return prefs;
};

// 14. Organization Activity
export const getStoredOrgActivity = () => {
  return safeGet(STORAGE_KEY_ORG_ACTIVITY, initialOrganizationActivity);
};

export const clearOrgActivity = () => {
  safeSet(STORAGE_KEY_ORG_ACTIVITY, []);
  return [];
};

// 15. Reset Utilities
export const resetAllIndividualSettings = () => {
  safeSet(STORAGE_KEY_SETTINGS, {
    account: defaultAccountProfile,
    profileVisibility: defaultProfileVisibility,
  });
  safeSet(STORAGE_KEY_NOTIFICATION_PREFS, defaultNotificationPreferences);
  safeSet(STORAGE_KEY_CAREER_PREFS, defaultCareerPreferences);
  safeSet(STORAGE_KEY_LEARNING_PREFS, defaultLearningPreferences);
  safeSet(STORAGE_KEY_OPPORTUNITY_PREFS, defaultOpportunityPreferences);
  safeSet(STORAGE_KEY_APPEARANCE_PREFS, defaultAppearancePreferences);
  safeSet(STORAGE_KEY_PRIVACY_PREFS, defaultPrivacyPreferences);
  safeSet(STORAGE_KEY_ACCOUNT_ACTIVITY, initialIndividualActivity);
  return true;
};

export const resetAllOrganizationSettings = () => {
  safeSet(STORAGE_KEY_ORG_SETTINGS, defaultOrganizationSettings);
  safeSet(STORAGE_KEY_ORG_MEMBERS, defaultOrganizationMembers);
  safeSet(STORAGE_KEY_ORG_NOTIFICATION_PREFS, defaultOrganizationNotifications);
  safeSet(STORAGE_KEY_ORG_WORKFORCE_PREFS, {
    planningHorizon: '12 months',
    defaultScenario: 'Growth & Cloud Acceleration',
    primaryAreas: ['Skill gaps', 'Future skills', 'Talent matching', 'Workforce planning'],
  });
  safeSet(STORAGE_KEY_ORG_ACTIVITY, initialOrganizationActivity);
  return true;
};

// 16. Simulated Data Export
export const simulateDataExport = (type = 'individual') => {
  const exportPayload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      platform: 'SkillSetu Career & Workforce Intelligence',
      schemaVersion: '1.0.0',
      exportType: type,
      environment: 'Frontend Prototype Mode',
    },
    data: type === 'individual'
      ? {
          account: getStoredSettings(),
          career: getStoredCareerPreferences(),
          learning: getStoredLearningPreferences(),
          notifications: getStoredNotificationPreferences(),
          opportunities: getStoredOpportunityPreferences(),
          appearance: getStoredAppearancePreferences(),
          privacy: getStoredPrivacyPreferences(),
          activity: getStoredAccountActivity(),
        }
      : {
          organization: getStoredOrganizationSettings(),
          members: getStoredOrganizationMembers(),
          notifications: getStoredOrgNotificationPreferences(),
          workforce: getStoredOrgWorkforcePreferences(),
          privacy: getStoredOrgPrivacyPreferences(),
          activity: getStoredOrgActivity(),
        },
  };

  return exportPayload;
};

// 17. Summary Generator
export const generateSettingsSummary = () => {
  const account = getStoredSettings();
  const career = getStoredCareerPreferences();
  const notifs = getStoredNotificationPreferences();
  const learning = getStoredLearningPreferences();

  return {
    targetRole: career.primaryTargetRole,
    visibility: account.profileVisibility?.visibilityLevel || 'visible_opportunities',
    workMode: career.workMode,
    activeNotifsCount: Object.values(notifs.careerIntelligence || {}).filter(Boolean).length +
      Object.values(notifs.learning || {}).filter(Boolean).length +
      Object.values(notifs.opportunities || {}).filter(Boolean).length,
    learningGoal: learning.learningGoal,
  };
};
