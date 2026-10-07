import React from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { OrganizationPreferences } from '../../components/organization-onboarding/OrganizationPreferences';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingPreferencesPage = () => {
  const { navigate } = useRouter();
  const { data, updatePreferences } = useOrganizationOnboarding();

  const handleNext = () => {
    navigate('/organization/onboarding/review');
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="preferences"
      title="Workforce Development Preferences"
      subtitle="Configure your organization's learning delivery formats, talent engagement models, and remote policies."
    >
      <div className="space-y-8">
        <OrganizationPreferences
          preferencesData={data.preferences || {}}
          onChange={updatePreferences}
        />

        <OrganizationOnboardingNavigation
          currentStepId="preferences"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingPreferencesPage;
