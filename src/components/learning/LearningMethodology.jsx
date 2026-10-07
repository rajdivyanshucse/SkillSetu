import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Layers, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { LEARNING_METHODOLOGY } from '../../data/learningData';

export const LearningMethodology = ({ className = '' }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`p-5 rounded-lg bg-surface border border-surface-border shadow-card space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-700 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body-sm font-bold text-charcoal-900 tracking-tight">
              {LEARNING_METHODOLOGY.title}
            </h3>
            <p className="text-xs text-charcoal-500">
              Deterministic curriculum mapping based on skill gap calibrations and target-role expectations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-900 bg-brand-50/80 px-2.5 py-1.5 rounded border border-brand-200/60 cursor-pointer self-start sm:self-auto transition-colors"
        >
          <span>{expanded ? 'Collapse Methodology' : 'Explain Learning Architecture'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Pipeline Visual */}
      <div className="p-3.5 rounded-md bg-canvas-subtle/90 border border-surface-border font-mono text-xs text-charcoal-800 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="font-semibold text-brand-800 bg-brand-100/70 px-2 py-0.5 rounded">Learning Priority</span>
        <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-surface-border">Learning Path</span>
        <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-surface-border">Practice</span>
        <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="font-semibold text-charcoal-700 bg-white px-2 py-0.5 rounded border border-surface-border">Project</span>
        <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">Validation</span>
        <ArrowRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="font-semibold text-brand-800 bg-brand-100/70 px-2 py-0.5 rounded">Skill Growth</span>
      </div>

      {/* Expanded 6-Step Breakdown */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          className="pt-3 border-t border-surface-border space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {LEARNING_METHODOLOGY.steps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-md bg-canvas border border-surface-border space-y-1.5"
              >
                <div className="flex items-center gap-1.5 font-bold text-charcoal-900 text-xs">
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

          <div className="pt-2 text-[11px] text-charcoal-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span>
              SkillSetu Learning Intelligence provides structured educational recommendations and does not imply automated university accreditation or recruitment guarantees.
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LearningMethodology;
