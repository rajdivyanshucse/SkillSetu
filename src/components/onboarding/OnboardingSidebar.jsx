import React from 'react';
import { Check, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { useOnboarding } from './OnboardingContext';

export const OnboardingSidebar = ({ currentStepIndex = 1 }) => {
  const { currentPath } = useRouter();
  const { calculateCompleteness } = useOnboarding();
  const completeness = calculateCompleteness();

  const steps = [
    { num: '01', title: 'Profile', path: '/onboarding/profile', desc: 'Background & education' },
    { num: '02', title: 'Skills', path: '/onboarding/skills', desc: 'Competencies & ratings' },
    { num: '03', title: 'Experience', path: '/onboarding/experience', desc: 'Projects & roles' },
    { num: '04', title: 'Interests', path: '/onboarding/interests', desc: 'Target domains' },
    { num: '05', title: 'Goals', path: '/onboarding/goals', desc: 'Career objectives' },
    { num: '06', title: 'Resume', path: '/onboarding/resume', desc: 'Document verification' },
    { num: '07', title: 'Preferences', path: '/onboarding/preferences', desc: 'Work style & location' },
    { num: '08', title: 'Review', path: '/onboarding/review', desc: 'Profile summary' },
  ];

  return (
    <aside className="w-full h-full bg-canvas-subtle p-6 sm:p-8 flex flex-col justify-between select-none border-r border-surface-border">
      {/* Top Header */}
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-body-sm font-bold text-charcoal-900 leading-none block">
              SkillSetu
            </span>
            <span className="text-[10px] font-medium text-brand-700 uppercase tracking-wider block mt-0.5">
              Profile Calibration
            </span>
          </div>
        </Link>

        {/* Progress Overview Bar */}
        <div className="p-3.5 bg-surface rounded-lg border border-surface-border shadow-subtle space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-charcoal-800">Calibration Progress</span>
            <span className="font-mono font-bold text-brand-700">{completeness}%</span>
          </div>
          <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Step Items List */}
        <nav aria-label="Onboarding Steps" className="space-y-1">
          {steps.map((step, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < currentStepIndex;
            const isActive = stepNumber === currentStepIndex || currentPath === step.path;
            const isUpcoming = stepNumber > currentStepIndex;

            return (
              <Link
                key={step.num}
                href={step.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-150 text-xs
                  ${isActive
                    ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200/70 shadow-subtle'
                    : isCompleted
                    ? 'text-charcoal-800 font-medium hover:bg-surface/80'
                    : 'text-charcoal-400 hover:text-charcoal-700'
                  }
                `}
              >
                {/* Step Circle / Check Indicator */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : isActive
                      ? 'bg-brand-500 text-white font-bold'
                      : 'bg-canvas-subtle border border-surface-border text-charcoal-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                </div>

                <div className="flex flex-col truncate">
                  <span className={`truncate leading-tight ${isActive ? 'text-charcoal-900 font-semibold' : ''}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-charcoal-400 truncate hidden xl:inline">
                    {step.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Contextual Intelligence Note */}
      <div className="pt-4 border-t border-surface-border">
        <div className="p-3 bg-surface/70 rounded-md border border-surface-border flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-charcoal-600 leading-normal">
            Your inputs directly calibrate your future skill gap analysis and role compatibility curves.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;
