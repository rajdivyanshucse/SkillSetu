import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from './OrganizationOnboardingContext';
import { organizationSteps } from './OrganizationOnboardingSidebar';

export const OrganizationOnboardingHeader = ({ currentStepId }) => {
  const { navigate } = useRouter();
  const { completeness, data } = useOrganizationOnboarding();

  const currentIdx = organizationSteps.findIndex((s) => s.id === currentStepId);
  const currentStep = organizationSteps[currentIdx] || organizationSteps[0];

  return (
    <header className="lg:hidden bg-surface border-b border-surface-border p-4 sticky top-0 z-30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-charcoal-900 block leading-none">
              {data.company?.name || 'SkillSetu Organization'}
            </span>
            <span className="text-[10px] text-brand-600 font-semibold block mt-0.5">
              Workforce Setup • Step {currentIdx + 1} of 8
            </span>
          </div>
        </div>

        <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
          {completeness}%
        </span>
      </div>

      <div className="w-full h-1 bg-canvas-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${completeness}%` }}
        />
      </div>

      <div className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
        <span className="text-charcoal-400">Step {currentIdx + 1}:</span>
        <span>{currentStep.title}</span>
      </div>
    </header>
  );
};

export default OrganizationOnboardingHeader;
