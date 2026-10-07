import React from 'react';
import { HelpCircle, Briefcase, Layers, Clock, Sparkles, ShieldCheck } from 'lucide-react';

export const TalentMethodology = () => {
  const steps = [
    {
      icon: <Briefcase className="w-4 h-4 text-brand-600" />,
      label: 'Role Requirements',
      desc: 'Configured core skill baseline & importance weights',
    },
    {
      icon: <Layers className="w-4 h-4 text-accent-600" />,
      label: 'Candidate Competencies',
      desc: 'Self-reported & calibrated technical depth',
    },
    {
      icon: <Clock className="w-4 h-4 text-purple-600" />,
      label: 'Experience Alignment',
      desc: 'Tenure baseline against minimum role expectations',
    },
    {
      icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
      label: 'Preferred Value-Add',
      desc: 'Complementary framework and cloud depth',
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
            How Talent Compatibility Works
          </h3>
          <p className="text-xs text-charcoal-500">
            Deterministic decision-support synthesis matching candidate competencies to organizational role criteria
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
            <strong>Deterministic Evaluation:</strong> SkillSetu compatibility is a prototype decision-support signal based on configured role requirements and profile data. It does not represent hiring probability or candidate quality.
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md shrink-0">
          Decision Support Heuristic
        </span>
      </div>
    </div>
  );
};

export default TalentMethodology;
