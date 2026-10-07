import React from 'react';
import { useRouter } from '../../router/Router';
import { OrganizationOnboardingLayout } from '../../components/organization-onboarding/OrganizationOnboardingLayout';
import { OrganizationReviewSection } from '../../components/organization-onboarding/OrganizationReviewSection';
import { OrganizationCompleteness } from '../../components/organization-onboarding/OrganizationCompleteness';
import { OrganizationOnboardingNavigation } from '../../components/organization-onboarding/OrganizationOnboardingNavigation';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { useToast } from '../../components/ui/Toast';

export const OrganizationOnboardingReviewPage = () => {
  const { navigate } = useRouter();
  const { data, completeness, markCompleted } = useOrganizationOnboarding();
  const { addToast } = useToast();

  const handleComplete = () => {
    markCompleted();
    addToast({
      title: 'Organization Profile Calibrated',
      message: 'Workforce intelligence parameters have been saved successfully.',
      type: 'success',
      duration: 3500,
    });
    navigate('/organization/onboarding/complete');
  };

  return (
    <OrganizationOnboardingLayout
      currentStepId="review"
      title="Review Organization Profile"
      subtitle="Verify your organizational structure, current skill inventory, and strategic workforce priorities before finalizing."
    >
      <div className="space-y-6">
        <OrganizationCompleteness completeness={completeness} />

        <OrganizationReviewSection data={data} />

        <OrganizationOnboardingNavigation
          currentStepId="review"
          onNext={handleComplete}
          nextLabel="Complete Organization Profile"
          canContinue={true}
        />
      </div>
    </OrganizationOnboardingLayout>
  );
};

export default OrganizationOnboardingReviewPage;
