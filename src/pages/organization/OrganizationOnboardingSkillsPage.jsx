import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { OrganizationSkillSelector } from '../../components/organization-onboarding/OrganizationSkillSelector';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingSkillsPage = () => {
  const { navigate } = useRouter();
  const { data, addSkill, updateSkill, removeSkill } = useOrganizationOnboarding();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.skills || data.skills.length === 0) {
      errs.skills = 'Please select at least one workforce skill for your inventory.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/organization/onboarding/priorities');
    }
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="skills"
      title="Workforce Skills Inventory"
      subtitle="Catalog the technical and business competencies currently active across your workforce."
    >
      <div className="space-y-8">
        <OrganizationSkillSelector
          skills={data.skills || []}
          onAddSkill={addSkill}
          onUpdateSkill={updateSkill}
          onRemoveSkill={removeSkill}
          errors={errors}
        />

        <OrganizationOnboardingNavigation
          currentStepId="skills"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingSkillsPage;
