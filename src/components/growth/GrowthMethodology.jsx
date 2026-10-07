import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { GROWTH_METHODOLOGY } from '../../data/growthData';

export const GrowthMethodology = ({
  className = '',
  expanded = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {GROWTH_METHODOLOGY.title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Transparent progression framework connecting capabilities, learning, and project evidence.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 cursor-pointer self-start sm:self-auto"
        >
          {isExpanded ? 'Collapse Workflow' : 'Explore Growth Framework'}
        </button>
      </div>

      {/* Conceptual Formula Box */}
      <div className="p-3 sm:p-4 rounded-lg bg-canvas-subtle/70 border border-surface-border">
        <span className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-2">
          Continuous Development Equation
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-charcoal-800">
          <span className="px-2 py-1 rounded bg-surface border border-surface-border shadow-2xs">
            Current Skills
          </span>
          <span className="text-charcoal-400 font-bold">+</span>
          <span className="px-2 py-1 rounded bg-surface border border-surface-border shadow-2xs">
            Development Activities
          </span>
          <span className="text-charcoal-400 font-bold">+</span>
          <span className="px-2 py-1 rounded bg-surface border border-surface-border shadow-2xs">
            Learning Progress
          </span>
          <span className="text-charcoal-400 font-bold">+</span>
          <span className="px-2 py-1 rounded bg-surface border border-surface-border shadow-2xs">
            Project Evidence
          </span>
          <span className="text-charcoal-400 font-bold">+</span>
          <span className="px-2 py-1 rounded bg-surface border border-surface-border shadow-2xs">
            Career Milestones
          </span>
          <span className="text-brand-600 font-bold">=</span>
          <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-900 font-bold border border-brand-200 shadow-2xs">
            Professional Growth View
          </span>
        </div>
      </div>

      {/* 6-Step Workflow */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2 pt-2 border-t border-surface-border/60"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {GROWTH_METHODOLOGY.steps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-md bg-canvas-subtle/40 border border-surface-border/60 space-y-1 text-xs"
              >
                <div className="flex items-center gap-1.5 font-bold text-charcoal-900">
                  <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 text-[10px] flex items-center justify-center font-extrabold shrink-0">
                    {s.step}
                  </span>
                  <span>{s.title}</span>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-relaxed pl-5.5">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Non-evaluative notice */}
      <div className="pt-2 text-[11px] text-charcoal-500 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span>
          SkillSetu Professional Growth Model is a personal development tracking system, not an employee performance ranking or productivity evaluation tool.
        </span>
      </div>
    </div>
  );
};

export default GrowthMethodology;
