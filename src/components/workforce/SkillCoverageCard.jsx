import React from 'react';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { calculateCoverageStatus } from '../../utils/workforceIntelligence';

export const SkillCoverageCard = ({
  skill,
  onSelect,
  className = '',
}) => {
  if (!skill) return null;

  const coverageStatus = calculateCoverageStatus(skill.coveragePct);

  return (
    <div
      onClick={() => onSelect && onSelect(skill)}
      className={`
        p-3.5 bg-surface border border-surface-border rounded-xl shadow-2xs hover:border-brand-300
        hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block truncate">
            {skill.category}
          </span>
          <h4 className="text-body-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
            {skill.name}
          </h4>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border shrink-0 ${coverageStatus.color}`}
        >
          {coverageStatus.label}
        </span>
      </div>

      <div className="space-y-1.5 pt-1 border-t border-surface-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-charcoal-500 font-medium">
            Team Depth: <strong>{skill.capabilityLevel}</strong>
          </span>
          <span className="font-mono font-bold text-charcoal-900">
            {skill.coveragePct}% Coverage
          </span>
        </div>

        <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              skill.coveragePct >= 75
                ? 'bg-emerald-500'
                : skill.coveragePct >= 50
                ? 'bg-brand-500'
                : skill.coveragePct >= 25
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${skill.coveragePct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillCoverageCard;
