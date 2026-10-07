import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { LEARNING_DISCLAIMERS } from '../../data/learningData';

export const LearningDisclaimer = ({ isOrganization = false, className = '' }) => {
  const text = isOrganization
    ? LEARNING_DISCLAIMERS.organization
    : LEARNING_DISCLAIMERS.individual;

  return (
    <div
      className={`p-4 rounded-lg bg-canvas-subtle/80 border border-surface-border text-xs text-charcoal-600 leading-relaxed space-y-2 ${className}`}
      role="note"
      aria-label="Learning Intelligence Disclaimer"
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">
          Learning & Skill Development Intelligence Notice
        </span>
      </div>
      <p className="text-charcoal-700 leading-relaxed">
        {text}
      </p>
      <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-charcoal-500 border-t border-surface-border/60">
        <span>• Development & Curriculum Guidance</span>
        <span>• Non-Evaluative Learning Model</span>
        <span>• Prototype Educational Resources</span>
      </div>
    </div>
  );
};

export default LearningDisclaimer;
