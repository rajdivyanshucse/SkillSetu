import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';
import { organizationSteps } from './OrganizationOnboardingSidebar';

export const OrganizationOnboardingNavigation = ({
  currentStepId,
  onNext,
  onBack,
  canContinue = true,
  nextLabel = 'Save & Continue',
  className = '',
}) => {
  const { navigate } = useRouter();

  const currentIdx = organizationSteps.findIndex((s) => s.id === currentStepId);
  const prevStep = currentIdx > 0 ? organizationSteps[currentIdx - 1] : null;
  const nextStep = currentIdx < organizationSteps.length - 1 ? organizationSteps[currentIdx + 1] : null;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (prevStep) {
      navigate(prevStep.route);
    } else {
      navigate('/organization/onboarding');
    }
  };

  const handleNext = () => {
    if (!canContinue) return;
    if (onNext) {
      onNext();
    } else if (nextStep) {
      navigate(nextStep.route);
    } else {
      navigate('/organization/onboarding/complete');
    }
  };

  const isReview = currentStepId === 'review';

  return (
    <div
      className={`pt-6 border-t border-surface-border flex items-center justify-between gap-4 select-none ${className}`}
    >
      <Button
        variant="ghost"
        size="md"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={handleBack}
        className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
      >
        {prevStep ? 'Previous Step' : 'Overview'}
      </Button>

      <div className="flex items-center gap-3">
        {currentIdx > 1 && !isReview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/organization/onboarding/review')}
            className="hidden sm:inline-flex text-xs text-charcoal-500 hover:text-charcoal-800"
          >
            Skip to Review
          </Button>
        )}

        <Button
          variant="primary"
          size="md"
          rightIcon={isReview ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          onClick={handleNext}
          disabled={!canContinue}
        >
          {isReview ? 'Complete Organization Profile' : nextLabel}
        </Button>
      </div>
    </div>
  );
};

export default OrganizationOnboardingNavigation;
