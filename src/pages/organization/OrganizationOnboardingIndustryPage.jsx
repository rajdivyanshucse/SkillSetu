import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { IndustryBusinessForm } from '../../components/organization-onboarding/IndustryBusinessForm';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingIndustryPage = () => {
  const { navigate } = useRouter();
  const { data, updateIndustry } = useOrganizationOnboarding();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!data.industry?.primaryIndustry) {
      errs.primaryIndustry = 'Please select your primary industry vertical.';
    }
    if (!data.industry?.businessFunctions || data.industry.businessFunctions.length === 0) {
      errs.businessFunctions = 'Please select at least one business function or department.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/organization/onboarding/workforce');
    }
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="industry"
      title="Industry & Business Scope"
      subtitle="Define your organization's primary operating sector and active business departments."
    >
      <div className="space-y-8">
        <IndustryBusinessForm
          industryData={data.industry || {}}
          onChange={updateIndustry}
          errors={errors}
        />

        <OrganizationOnboardingNavigation
          currentStepId="industry"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingIndustryPage;
