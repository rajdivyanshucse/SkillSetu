import React, { createContext, useContext, useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'skillsetu_onboarding_state_v1';

const defaultState = {
  profile: {
    fullName: '',
    currentRole: 'Software Engineer',
    educationLevel: "Bachelor's",
    degree: 'Computer Science',
    institution: '',
    graduationYear: '2026',
    yearsOfExperience: '2-3 years',
    currentCompany: '',
    location: '',
    statusType: 'professional', // 'student' | 'professional'
  },
  skills: [
    { name: 'JavaScript', category: 'Programming', proficiency: 'Advanced' },
    { name: 'React', category: 'Web Development', proficiency: 'Intermediate' },
    { name: 'SQL', category: 'Databases', proficiency: 'Intermediate' },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Junior Frontend Developer',
      organization: 'TechCorp Solutions',
      startDate: '2024-01',
      endDate: '',
      isPresent: true,
      description: 'Building responsive web interfaces and reusable UI component libraries.',
      type: 'work',
    }
  ],
  interests: {
    roles: ['Frontend Engineer', 'Full Stack Developer'],
    industries: ['Technology', 'Fintech'],
  },
  goals: {
    primaryGoal: 'Get a better role',
    targetRole: 'Senior Full Stack Engineer',
    learningTimeline: '6 months',
    learningPreferences: ['Projects', 'Practice / coding', 'Documentation'],
    additionalNotes: '',
  },
  resume: null,
  preferences: {
    locationPreference: 'Any location',
    specificLocations: '',
    workStyle: 'Hybrid',
    opportunityTypes: ['Full-time'],
    experienceLevel: 'Mid level',
    salaryMin: '90000',
    salaryMax: '130000',
  },
};

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load onboarding state from localStorage:', e);
    }
    return defaultState;
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save onboarding state to localStorage:', e);
    }
  }, [data]);

  // Updaters
  const updateProfile = (profileData) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileData },
    }));
  };

  const addSkill = (skillObj) => {
    setData((prev) => {
      if (prev.skills.some((s) => s.name.toLowerCase() === skillObj.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        skills: [...prev.skills, skillObj],
      };
    });
  };

  const removeSkill = (skillName) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()),
    }));
  };

  const updateSkillProficiency = (skillName, proficiency) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase()
          ? { ...s, proficiency }
          : s
      ),
    }));
  };

  const addExperience = (exp) => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...exp, id: `exp-${Date.now()}` }],
    }));
  };

  const updateExperience = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, ...updatedFields } : item
      ),
    }));
  };

  const removeExperience = (id) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const updateInterests = (interestsData) => {
    setData((prev) => ({
      ...prev,
      interests: { ...prev.interests, ...interestsData },
    }));
  };

  const updateGoals = (goalsData) => {
    setData((prev) => ({
      ...prev,
      goals: { ...prev.goals, ...goalsData },
    }));
  };

  const setResume = (resumeData) => {
    setData((prev) => ({
      ...prev,
      resume: resumeData,
    }));
  };

  const updatePreferences = (prefData) => {
    setData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefData },
    }));
  };

  // Calculate frontend profile completeness percentage (out of 100)
  const calculateCompleteness = () => {
    let score = 0;
    if (data.profile.fullName) score += 15;
    if (data.profile.currentRole) score += 10;
    if (data.profile.educationLevel) score += 5;
    if (data.skills.length >= 1) score += 20;
    if (data.skills.length >= 4) score += 5;
    if (data.experience.length >= 1) score += 15;
    if (data.interests.roles.length >= 1) score += 10;
    if (data.goals.primaryGoal) score += 10;
    if (data.resume) score += 5;
    if (data.preferences.workStyle) score += 5;
    return Math.min(100, Math.max(20, score));
  };

  const resetOnboarding = () => {
    setData(defaultState);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateProfile,
        addSkill,
        removeSkill,
        updateSkillProficiency,
        addExperience,
        updateExperience,
        removeExperience,
        updateInterests,
        updateGoals,
        setResume,
        updatePreferences,
        calculateCompleteness,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
