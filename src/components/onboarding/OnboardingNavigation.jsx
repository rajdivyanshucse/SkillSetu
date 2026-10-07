import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const OnboardingNavigation = ({
  onBack,
  onContinue,
  onSkip,
  canContinue = true,
  isLoading = false,
  continueLabel = 'Continue',
  backLabel = 'Back',
  skipLabel = 'Skip for now',
  className = '',
}) => {
  return (
    <div className={`pt-6 mt-8 border-t border-surface-border flex items-center justify-between gap-4 ${className}`}>
      {/* Left: Back button or placeholder */}
      {onBack ? (
        <Button
          variant="ghost"
          size="md"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          disabled={isLoading}
        >
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {/* Right: Skip + Continue Buttons */}
      <div className="flex items-center gap-3">
        {onSkip && (
          <Button
            variant="ghost"
            size="md"
            onClick={onSkip}
            disabled={isLoading}
            className="text-charcoal-500 hover:text-charcoal-800 text-xs"
          >
            {skipLabel}
          </Button>
        )}

        <Button
          variant="primary"
          size="md"
          onClick={onContinue}
          disabled={!canContinue || isLoading}
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {continueLabel}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingNavigation;
