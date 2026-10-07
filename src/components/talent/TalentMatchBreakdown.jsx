import React from 'react';
import { Sparkles, Info, HelpCircle } from 'lucide-react';

export const TalentMatchBreakdown = ({
  breakdown = {},
  onOpenExplanation,
  compact = false,
  className = '',
}) => {
  const {
    overallCompatibility = 75,
    requiredSkillFit = 80,
    preferredSkillFit = 70,
    roleAlignment = 85,
    experienceAlignment = 75,
  } = breakdown;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-brand-700 bg-brand-50 border-brand-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const getBarColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-brand-500';
    return 'bg-amber-500';
  };

  const metrics = [
    { label: 'Required Skill Coverage', value: requiredSkillFit, weight: '45%' },
    { label: 'Preferred Skill Coverage', value: preferredSkillFit, weight: '20%' },
    { label: 'Role Alignment', value: roleAlignment, weight: '20%' },
    { label: 'Experience Alignment', value: experienceAlignment, weight: '15%' },
  ];

  return (
    <div className={`p-4 rounded-xl border border-surface-border bg-surface shadow-2xs space-y-3.5 ${className}`}>
      {/* Top Compatibility Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-charcoal-900 leading-tight">
              Talent Compatibility
            </h4>
            <span className="text-[11px] text-charcoal-500">
              Role & Requirement Alignment
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-base font-black font-mono px-2.5 py-1 rounded-md border ${getScoreColor(overallCompatibility)}`}>
            {overallCompatibility}%
          </span>
          {onOpenExplanation && (
            <button
              type="button"
              onClick={onOpenExplanation}
              title="How this compatibility was calculated"
              className="p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-canvas-subtle rounded-md transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Breakdown Bars */}
      <div className="space-y-2.5 pt-1">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-charcoal-700 font-medium">{m.label}</span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-charcoal-900">{m.value}%</span>
                <span className="text-[10px] text-charcoal-400">({m.weight})</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getBarColor(m.value)}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-surface-border/60 flex items-center gap-1.5 text-[10px] text-charcoal-500">
        <Info className="w-3 h-3 text-charcoal-400 shrink-0" />
        <span>Decision-support heuristic based on configured role baseline.</span>
      </div>
    </div>
  );
};

export default TalentMatchBreakdown;
