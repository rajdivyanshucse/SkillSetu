import React from 'react';
import { Info, AlertCircle, ShieldAlert } from 'lucide-react';
import { COMPENSATION_DISCLAIMERS } from '../../data/compensationData';

export const CompensationDisclaimer = ({
  type = 'general',
  className = '',
  compact = false,
  showTitle = true,
}) => {
  const text = COMPENSATION_DISCLAIMERS[type] || COMPENSATION_DISCLAIMERS.general;

  if (compact) {
    return (
      <div
        className={`flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-charcoal-700 leading-relaxed ${className}`}
        role="note"
        aria-label="Compensation Data Disclaimer"
      >
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          {showTitle && (
            <span className="font-semibold text-amber-900 block mb-0.5">
              Prototype Intelligence Note
            </span>
          )}
          <span>{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg bg-canvas-subtle/80 border border-surface-border text-xs text-charcoal-600 leading-relaxed space-y-2 ${className}`}
      role="note"
      aria-label="Compensation Intelligence Disclaimer"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">
          Compensation Data & Methodology Disclaimer
        </span>
      </div>
      <p className="text-charcoal-700">
        {text}
      </p>
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-charcoal-500 border-t border-surface-border/60">
        <span>• Fictional Opportunity Sample (28 Records)</span>
        <span>• Deterministic Prototype Distribution</span>
        <span>• Non-Prescriptive Decision Support</span>
      </div>
    </div>
  );
};
