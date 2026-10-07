import React from 'react';
import { HelpCircle, Users, Sliders, Compass, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { PLANNING_DISCLAIMER } from '../../data/workforcePlanningData';

export const PlanningMethodology = () => {
  const steps = [
    {
      icon: <Users className="w-4 h-4 text-brand-600" />,
      label: 'Current Workforce Baseline',
      desc: 'Active departmental headcount and calibrated skill coverage levels',
    },
    {
      icon: <Sliders className="w-4 h-4 text-accent-600" />,
      label: 'Scenario Assumptions',
      desc: 'Growth rate multipliers, planning horizons, and attrition estimates',
    },
    {
      icon: <Compass className="w-4 h-4 text-purple-600" />,
      label: 'Future Skill Priorities',
      desc: 'Strategic emerging competencies and critical capability horizons',
    },
    {
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      label: 'Capacity Gap & Action Mix',
      desc: 'Balanced distribution across hiring, internal upskilling, and mobility',
    },
  ];

  return (
    <div className="p-5 rounded-2xl border border-surface-border bg-canvas-subtle/70 shadow-2xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-canvas text-charcoal-700 flex items-center justify-center border border-surface-border">
          <HelpCircle className="w-4 h-4 text-brand-600" />
        </div>
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 tracking-tight">
            How Workforce Planning Works
          </h3>
          <p className="text-xs text-charcoal-500">
            Deterministic calculation engine converting profile calibration and scenario parameters into forward planning views
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface border border-surface-border flex flex-col justify-between space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-canvas-subtle border border-surface-border">
                {step.icon}
              </span>
              <span className="text-xs font-bold text-charcoal-900">
                {step.label}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 leading-normal">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-xl bg-surface border border-brand-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-charcoal-700">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>SkillSetu Prototype Workforce Planning Model:</strong> Outputs are illustrative scenario calculations based on configured assumptions and prototype data. They are not forecasts, guarantees, or actual workforce commitments.
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md shrink-0">
          Decision Support Model
        </span>
      </div>
    </div>
  );
};

export default PlanningMethodology;
