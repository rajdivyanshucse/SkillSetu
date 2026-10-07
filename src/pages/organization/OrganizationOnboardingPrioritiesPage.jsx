import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { WorkforcePrioritySelector } from '../../components/organization-onboarding/WorkforcePrioritySelector';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingPrioritiesPage = () => {
  const { navigate } = useRouter();
  const { data, updatePriorities } = useOrganizationOnboarding();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (
      !data.priorities?.strategicPriorities ||
      data.priorities.strategicPriorities.length === 0
    ) {
      errs.strategicPriorities = 'Please select at least one strategic workforce priority.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/organization/onboarding/future-skills');
    }
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="priorities"
      title="Strategic Workforce Priorities"
      subtitle="Identify the talent, capability, and transformation goals that matter most to your leadership."
    >
      <div className="space-y-8">
        <WorkforcePrioritySelector
          prioritiesData={data.priorities || {}}
          onChange={updatePriorities}
          errors={errors}
        />

        <OrganizationOnboardingNavigation
          currentStepId="priorities"
          onNext={handleNext}
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingPrioritiesPage;
