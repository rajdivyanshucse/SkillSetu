import React from 'react';
import { Check, Building2, Layers, Users, Sparkles, Target, Compass, Sliders, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from './OrganizationOnboardingContext';

export const organizationSteps = [
  { id: 'company', stepNumber: 1, title: 'Organization', route: '/organization/onboarding/company', icon: Building2 },
  { id: 'industry', stepNumber: 2, title: 'Industry & Business', route: '/organization/onboarding/industry', icon: Layers },
  { id: 'workforce', stepNumber: 3, title: 'Workforce Profile', route: '/organization/onboarding/workforce', icon: Users },
  { id: 'skills', stepNumber: 4, title: 'Workforce Skills', route: '/organization/onboarding/skills', icon: Sparkles },
  { id: 'priorities', stepNumber: 5, title: 'Strategic Priorities', route: '/organization/onboarding/priorities', icon: Target },
  { id: 'future-skills', stepNumber: 6, title: 'Future Skills', route: '/organization/onboarding/future-skills', icon: Compass },
  { id: 'preferences', stepNumber: 7, title: 'Preferences', route: '/organization/onboarding/preferences', icon: Sliders },
  { id: 'review', stepNumber: 8, title: 'Review Profile', route: '/organization/onboarding/review', icon: ShieldCheck },
];

export const OrganizationOnboardingSidebar = ({ currentStepId }) => {
  const { navigate } = useRouter();
  const { completeness, data } = useOrganizationOnboarding();

  const currentIdx = organizationSteps.findIndex((s) => s.id === currentStepId);

  return (
    <aside className="w-80 bg-surface border-r border-surface-border p-6 flex flex-col justify-between h-full select-none shrink-0 shadow-2xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-body-sm font-extrabold text-charcoal-900 tracking-tight leading-none block">
                SkillSetu
              </span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mt-0.5">
                Workforce Intelligence
              </span>
            </div>
          </div>
          <p className="text-[11px] text-charcoal-500 pt-2 leading-relaxed">
            Configure your enterprise profile to initialize workforce skill analysis and capability modeling.
          </p>
        </div>

        {/* Progress Gauge */}
        <div className="p-3.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-charcoal-700 uppercase tracking-wider text-[10px]">
              Profile Completeness
            </span>
            <span className="font-mono font-bold text-brand-700">{completeness}%</span>
          </div>
          <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <span className="text-[10px] text-charcoal-400 block">
            Step {Math.max(1, currentIdx + 1)} of 8 ({organizationSteps[currentIdx]?.title || 'Setup'})
          </span>
        </div>

        {/* Step Navigation List */}
        <nav aria-label="Onboarding Steps" className="space-y-1">
          {organizationSteps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = step.id === currentStepId;
            const StepIcon = step.icon;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => navigate(step.route)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-semibold
                  transition-all duration-150 cursor-pointer text-left
                  ${
                    isCurrent
                      ? 'bg-brand-50 text-brand-800 border border-brand-200 shadow-xs'
                      : isCompleted
                      ? 'text-charcoal-700 hover:bg-canvas-subtle'
                      : 'text-charcoal-400 hover:bg-canvas-subtle hover:text-charcoal-600'
                  }
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors
                    ${
                      isCurrent
                        ? 'bg-brand-600 text-white shadow-2xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-canvas-subtle border border-surface-border text-charcoal-400'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${step.stepNumber}`}
                </div>

                <span className="truncate flex-1">{step.title}</span>

                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Organization Info Footer */}
      <div className="pt-4 border-t border-surface-border text-xs text-charcoal-500">
        <span className="font-semibold text-charcoal-800 block truncate">
          {data.company?.name || 'New Organization'}
        </span>
        <span className="text-[11px] text-charcoal-400 block truncate">
          {data.industry?.primaryIndustry || 'Workforce Setup'}
        </span>
      </div>
    </aside>
  );
};

export default OrganizationOnboardingSidebar;
