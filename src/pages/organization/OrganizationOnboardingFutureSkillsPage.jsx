import React from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { FutureSkillSelector } from '../../components/organization-onboarding/FutureSkillSelector';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingFutureSkillsPage = () => {
  const { navigate } = useRouter();
  const { data, addFutureSkill, updateFutureSkill, removeFutureSkill } = useOrganizationOnboarding();

  const handleNext = () => {
    navigate('/organization/onboarding/preferences');
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="future-skills"
      title="Future Skills & Horizon Planning"
      subtitle="Anticipate the technical and organizational capabilities your teams will need over the next 1–3 years."
    >
      <div className="space-y-8">
        <FutureSkillSelector
          futureSkills={data.futureSkills || []}
          onAddFutureSkill={addFutureSkill}
          onUpdateFutureSkill={updateFutureSkill}
          onRemoveFutureSkill={removeFutureSkill}
        />

        <OrganizationOnboardingNavigation
          currentStepId="future-skills"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingFutureSkillsPage;
