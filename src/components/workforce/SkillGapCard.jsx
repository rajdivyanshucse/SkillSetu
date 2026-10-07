import React from 'react';
import { AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const SkillGapCard = ({
  gap,
  onSelect,
  className = '',
}) => {
  if (!gap) return null;

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'Critical':
        return 'text-rose-800 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-indigo-800 bg-indigo-50 border-indigo-200';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(gap)}
      className={`
        p-4 bg-surface border border-surface-border rounded-xl shadow-2xs hover:border-brand-300
        hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group
        ${className}
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block truncate">
              {gap.category}
            </span>
            <h4 className="text-body-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
              {gap.name || gap.skillName}
            </h4>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border shrink-0 ${getPriorityStyle(
              gap.priority
            )}`}
          >
            {gap.priority} Gap
          </span>
        </div>

        {/* Coverage vs Target Meter */}
        <div className="p-2.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-charcoal-600">
              Current: <strong>{gap.currentCoverage}%</strong>
            </span>
            <span className="text-brand-700 font-bold">
              Target: <strong>{gap.targetCoverage}%</strong>
            </span>
          </div>

          <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden relative">
            <div
              className="h-full bg-brand-500 rounded-full"
              style={{ width: `${gap.currentCoverage}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-charcoal-900"
              style={{ left: `${gap.targetCoverage}%` }}
              title={`Target: ${gap.targetCoverage}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-charcoal-500">
            <span>Deficit: <strong className="text-rose-600">-{gap.gap} pts</strong></span>
            <span className="text-charcoal-400">Target Benchmark</span>
          </div>
        </div>

        <p className="text-xs text-charcoal-600 leading-relaxed mt-2.5">
          {gap.reason}
        </p>
      </div>

      <div className="pt-2 border-t border-surface-border/60 flex items-center justify-end">
        <span className="text-[11px] font-semibold text-brand-700 group-hover:underline inline-flex items-center gap-1">
          Inspect Capability Detail <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default SkillGapCard;
