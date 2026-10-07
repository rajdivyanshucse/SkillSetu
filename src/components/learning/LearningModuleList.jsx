import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle, Clock, BookOpen, Layers, Sparkles, ChevronRight, ChevronDown } from 'lucide-react';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

const stageColors = {
  LEARN: { bg: 'bg-brand-50', text: 'text-brand-800', border: 'border-brand-200/60' },
  PRACTICE: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200/60' },
  BUILD: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200/60' },
  VALIDATE: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200/60' },
};

export const LearningModuleList = ({ modules = [], onUpdateModuleProgress }) => {
  const [expandedModuleId, setExpandedModuleId] = useState(modules[0]?.id || null);

  const handleToggleExpand = (id) => {
    setExpandedModuleId(expandedModuleId === id ? null : id);
  };

  const handleStatusChange = (moduleId, newStatus) => {
    const progress = newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0;
    if (onUpdateModuleProgress) {
      onUpdateModuleProgress(moduleId, newStatus, progress);
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-surface border border-surface-border text-center text-charcoal-500 text-xs">
        No learning modules available for this path.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((mod, idx) => {
        const isExpanded = expandedModuleId === mod.id;
        const stageStyle = stageColors[mod.stage] || stageColors.LEARN;

        return (
          <motion.div
            key={mod.id || idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: idx * 0.03 }}
            className={`rounded-lg bg-surface border transition-all ${
              isExpanded ? 'border-brand-300 shadow-md ring-1 ring-brand-200/50' : 'border-surface-border hover:border-surface-border-strong shadow-card'
            }`}
          >
            {/* Header Row */}
            <div
              onClick={() => handleToggleExpand(mod.id)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-start gap-3">
                {/* Number / Status Icon */}
                <div className="w-7 h-7 rounded-md bg-canvas-subtle border border-surface-border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {mod.status === 'Completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : mod.status === 'In Progress' ? (
                    <PlayCircle className="w-4 h-4 text-brand-600" />
                  ) : (
                    <span className="text-charcoal-600">{mod.number || idx + 1}</span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded border uppercase tracking-wider ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                      {mod.stage}
                    </span>
                    <span className="text-xs px-2 py-0.2 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border">
                      {mod.skill}
                    </span>
                  </div>

                  <h4 className="text-body-sm font-bold text-charcoal-900 leading-snug">
                    {mod.title}
                  </h4>
                </div>
              </div>

              {/* Status and Progress Info */}
              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-charcoal-700 block">
                    {mod.progressPct ?? (mod.status === 'Completed' ? 100 : mod.status === 'In Progress' ? 50 : 0)}%
                  </span>
                  <span className="text-[10px] text-charcoal-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {mod.estimatedEffort}
                  </span>
                </div>

                <Badge
                  variant={
                    mod.status === 'Completed'
                      ? 'success'
                      : mod.status === 'In Progress'
                      ? 'info'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {mod.status}
                </Badge>

                {isExpanded ? <ChevronDown className="w-4 h-4 text-charcoal-400" /> : <ChevronRight className="w-4 h-4 text-charcoal-400" />}
              </div>
            </div>

            {/* Expanded Content Drawer */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-surface-border/60 bg-canvas-subtle/30 space-y-3.5">
                <p className="text-xs text-charcoal-700 leading-relaxed">
                  {mod.description}
                </p>

                {/* Topics Covered */}
                {mod.topics && mod.topics.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider block mb-1.5">
                      Key Curriculum Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.topics.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded bg-white text-charcoal-800 font-medium border border-surface-border/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Toggle Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-charcoal-500">
                    Update Local Module Progress:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(mod.id, 'Not Started')}
                      className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer border ${
                        mod.status === 'Not Started'
                          ? 'bg-charcoal-200 text-charcoal-800 border-charcoal-300'
                          : 'bg-white text-charcoal-600 border-surface-border hover:bg-canvas-subtle'
                      }`}
                    >
                      Not Started
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(mod.id, 'In Progress')}
                      className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer border ${
                        mod.status === 'In Progress'
                          ? 'bg-brand-100 text-brand-800 border-brand-300'
                          : 'bg-white text-charcoal-600 border-surface-border hover:bg-canvas-subtle'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(mod.id, 'Completed')}
                      className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer border ${
                        mod.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white text-charcoal-600 border-surface-border hover:bg-canvas-subtle'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default LearningModuleList;
