import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, Clock, Circle, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';

export const CareerMilestones = ({
  milestones = [],
  onToggleMilestone,
  className = '',
}) => {
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Career Development Milestones
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Key progression gates toward production-ready target-role readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-charcoal-800">
            {completedCount} of {milestones.length} Completed
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60">
            {progressPct}% Progress
          </span>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === 'Completed';
          const isInProgress = milestone.status === 'In Progress';

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                isCompleted
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : isInProgress
                  ? 'bg-brand-500/5 border-brand-500/30 ring-1 ring-brand-500/10'
                  : 'bg-canvas-subtle/30 border-surface-border opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Toggle Completion Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleMilestone && onToggleMilestone(milestone.id)}
                  className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isInProgress
                      ? 'border border-brand-500 bg-surface text-brand-600'
                      : 'border border-charcoal-300 bg-surface text-transparent hover:border-charcoal-500'
                  }`}
                  title={isCompleted ? 'Mark In Progress' : 'Mark Completed'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-900">
                      {milestone.title}
                    </span>
                    <Badge
                      variant={isCompleted ? 'success' : isInProgress ? 'brand' : 'neutral'}
                      size="sm"
                    >
                      {milestone.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {milestone.description}
                  </p>

                  {/* Related skills */}
                  {milestone.relatedSkills && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {milestone.relatedSkills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.2 rounded-xs bg-canvas-muted text-charcoal-700 text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {milestone.nextAction && !isCompleted && (
                    <p className="text-[11px] text-brand-800 font-medium pt-1">
                      <strong>Next Action:</strong> {milestone.nextAction}
                    </p>
                  )}
                </div>
              </div>

              {/* Date */}
              {milestone.completedDate && (
                <span className="text-[11px] font-semibold text-emerald-700 shrink-0 hidden sm:inline">
                  {milestone.completedDate}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CareerMilestones;
