import React from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { WorkforceProfileForm } from '../../components/organization-onboarding/WorkforceProfileForm';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingWorkforcePage = () => {
  const { navigate } = useRouter();
  const { data, updateWorkforce } = useOrganizationOnboarding();

  const handleNext = () => {
    navigate('/organization/onboarding/skills');
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="workforce"
      title="Workforce Profile & Structure"
      subtitle="Establish approximate employee counts across departments and team experience distributions."
    >
      <div className="space-y-8">
        <WorkforceProfileForm
          workforceData={data.workforce || {}}
          onChange={updateWorkforce}
        />

        <OrganizationOnboardingNavigation
          currentStepId="workforce"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingWorkforcePage;
