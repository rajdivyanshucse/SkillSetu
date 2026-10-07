import React from 'react';
import { HelpCircle, Building2, Layers, Target, Compass, Sparkles, ArrowRight } from 'lucide-react';

export const WorkforceMethodology = () => {
  const steps = [
    {
      icon: <Building2 className="w-4 h-4 text-brand-600" />,
      label: 'Organization Profile',
      desc: 'Headcount, structure & domain context',
    },
    {
      icon: <Layers className="w-4 h-4 text-accent-600" />,
      label: 'Workforce Skills',
      desc: 'Observed coverage & capability levels',
    },
    {
      icon: <Target className="w-4 h-4 text-purple-600" />,
      label: 'Strategic Priorities',
      desc: 'Internal upskilling vs hiring focus',
    },
    {
      icon: <Compass className="w-4 h-4 text-warning-600" />,
      label: 'Future Horizons',
      desc: 'Target timelines & emerging skills',
    },
  ];

  return (
    <div className="p-5 rounded-lg border border-surface-border bg-canvas-subtle/70 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-md bg-canvas text-charcoal-700 flex items-center justify-center border border-surface-border">
          <HelpCircle className="w-4 h-4 text-brand-600" />
        </div>
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 tracking-tight">
            How Workforce Intelligence Works
          </h3>
          <p className="text-body-xs text-charcoal-500">
            Deterministic calculation engine converting profile calibration into strategic signals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-3 rounded-md bg-surface border border-surface-border flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-xs bg-canvas-subtle border border-surface-border">
                {step.icon}
              </span>
              <span className="text-body-xs font-bold text-charcoal-900">
                {step.label}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-md bg-surface border border-brand-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-body-xs">
        <div className="flex items-center gap-2 text-charcoal-700">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>Deterministic Synthesis:</strong> SkillSetu uses organization-provided workforce information to surface capability coverage, skill gaps, future priorities, and potential workforce actions.
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-xs shrink-0">
          Prototype Intelligence
        </span>
      </div>
    </div>
  );
};

export default WorkforceMethodology;
