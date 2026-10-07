import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  defaultOrganizationState,
  STORAGE_KEY_ORG_ONBOARDING,
  STORAGE_KEY_ORG_COMPLETE,
  calculateOrgCompleteness,
} from '../../data/organizationData';

const OrganizationOnboardingContext = createContext(null);

export const OrganizationOnboardingProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORG_ONBOARDING);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load organization onboarding state from localStorage:', e);
    }
    return defaultOrganizationState;
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ORG_COMPLETE) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Persist data updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORG_ONBOARDING, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save organization onboarding state to localStorage:', e);
    }
  }, [data]);

  // Updaters
  const updateCompany = (fields) => {
    setData((prev) => ({
      ...prev,
      company: { ...prev.company, ...fields },
    }));
  };

  const updateIndustry = (fields) => {
    setData((prev) => ({
      ...prev,
      industry: { ...prev.industry, ...fields },
    }));
  };

  const updateWorkforce = (fields) => {
    setData((prev) => ({
      ...prev,
      workforce: { ...prev.workforce, ...fields },
    }));
  };

  const addSkill = (skillObj) => {
    setData((prev) => {
      const existingIdx = prev.skills.findIndex(
        (s) => s.name.toLowerCase() === skillObj.name.toLowerCase()
      );
      if (existingIdx !== -1) {
        const updated = [...prev.skills];
        updated[existingIdx] = { ...updated[existingIdx], ...skillObj };
        return { ...prev, skills: updated };
      }
      return {
        ...prev,
        skills: [...prev.skills, skillObj],
      };
    });
  };

  const updateSkill = (skillName, fields) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, ...fields } : s
      ),
    }));
  };

  const removeSkill = (skillName) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()),
    }));
  };

  const updatePriorities = (fields) => {
    setData((prev) => ({
      ...prev,
      priorities: { ...prev.priorities, ...fields },
    }));
  };

  const addFutureSkill = (futureSkillObj) => {
    setData((prev) => {
      const existingIdx = prev.futureSkills.findIndex(
        (s) => s.name.toLowerCase() === futureSkillObj.name.toLowerCase()
      );
      if (existingIdx !== -1) {
        const updated = [...prev.futureSkills];
        updated[existingIdx] = { ...updated[existingIdx], ...futureSkillObj };
        return { ...prev, futureSkills: updated };
      }
      return {
        ...prev,
        futureSkills: [...prev.futureSkills, futureSkillObj],
      };
    });
  };

  const updateFutureSkill = (futureSkillName, fields) => {
    setData((prev) => ({
      ...prev,
      futureSkills: prev.futureSkills.map((s) =>
        s.name.toLowerCase() === futureSkillName.toLowerCase() ? { ...s, ...fields } : s
      ),
    }));
  };

  const removeFutureSkill = (futureSkillName) => {
    setData((prev) => ({
      ...prev,
      futureSkills: prev.futureSkills.filter(
        (s) => s.name.toLowerCase() !== futureSkillName.toLowerCase()
      ),
    }));
  };

  const updatePreferences = (fields) => {
    setData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...fields },
    }));
  };

  const markCompleted = () => {
    setIsCompleted(true);
    try {
      localStorage.setItem(STORAGE_KEY_ORG_COMPLETE, 'true');
    } catch (e) {}
  };

  const resetOnboarding = () => {
    setData(defaultOrganizationState);
    setIsCompleted(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ORG_ONBOARDING);
      localStorage.removeItem(STORAGE_KEY_ORG_COMPLETE);
    } catch (e) {}
  };

  const completeness = calculateOrgCompleteness(data);

  return (
    <OrganizationOnboardingContext.Provider
      value={{
        data,
        completeness,
        isCompleted,
        updateCompany,
        updateIndustry,
        updateWorkforce,
        addSkill,
        updateSkill,
        removeSkill,
        updatePriorities,
        addFutureSkill,
        updateFutureSkill,
        removeFutureSkill,
        updatePreferences,
        markCompleted,
        resetOnboarding,
      }}
    >
      {children}
    </OrganizationOnboardingContext.Provider>
  );
};

export const useOrganizationOnboarding = () => {
  const context = useContext(OrganizationOnboardingContext);
  if (!context) {
    throw new Error(
      'useOrganizationOnboarding must be used within an OrganizationOnboardingProvider'
    );
  }
  return context;
};

export default OrganizationOnboardingContext;
