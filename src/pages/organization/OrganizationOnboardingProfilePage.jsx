import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { OrganizationProfileForm } from '../../components/organization-onboarding/OrganizationProfileForm';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingProfilePage = () => {
  const { navigate } = useRouter();
  const { data, updateCompany } = useOrganizationOnboarding();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.company?.name?.trim()) {
      errs.name = 'Organization name is required.';
    }
    if (!data.company?.primaryLocation?.trim()) {
      errs.primaryLocation = 'Primary headquarters location is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/organization/onboarding/industry');
    }
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="company"
      title="Organization Identity"
      subtitle="Provide core details about your legal entity, headcount scale, headquarters, and business overview."
    >
      <div className="space-y-8">
        <OrganizationProfileForm
          companyData={data.company || {}}
          onChange={updateCompany}
          errors={errors}
        />

        <OrganizationOnboardingNavigation
          currentStepId="company"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingProfilePage;
