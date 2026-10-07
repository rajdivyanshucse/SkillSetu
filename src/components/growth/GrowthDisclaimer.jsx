import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';
import { GROWTH_DISCLAIMERS } from '../../data/growthData';

export const GrowthDisclaimer = ({
  type = 'individual',
  compact = false,
  className = '',
}) => {
  const text = GROWTH_DISCLAIMERS[type] || GROWTH_DISCLAIMERS.individual;

  if (compact) {
    return (
      <div
        className={`flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-charcoal-700 leading-relaxed ${className}`}
        role="note"
        aria-label="Growth Disclaimer"
      >
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-900 block mb-0.5">
            Development Tracking Note
          </span>
          <span>{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg bg-canvas-subtle/80 border border-surface-border text-xs text-charcoal-600 leading-relaxed space-y-2 ${className}`}
      role="note"
      aria-label="Professional Growth Disclaimer"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">
          Professional Growth & Development Disclaimer
        </span>
      </div>
      <p className="text-charcoal-700">
        {text}
      </p>
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-charcoal-500 border-t border-surface-border/60">
        <span>• Development & Evidence Tracking</span>
        <span>• Non-Evaluative Metric Model</span>
        <span>• No Employee Ranking or Surveillance</span>
      </div>
    </div>
  );
};

export default GrowthDisclaimer;
