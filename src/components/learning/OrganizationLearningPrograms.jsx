import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, Compass, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import { organizationLearningPrograms } from '../../data/learningData';

export const OrganizationLearningPrograms = ({
  programs = organizationLearningPrograms,
}) => {
  const { navigate } = useRouter();

  if (!programs || programs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            Active Capability Development Programs
          </h3>
          <p className="text-xs text-charcoal-500">
            Cohort-based learning tracks mapped directly to strategic workforce capability gaps
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Aggregate Cohorts Only
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog, idx) => (
          <motion.div
            key={prog.id || idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs px-2.5 py-0.5 rounded bg-brand-50 text-brand-800 font-semibold border border-brand-200/60">
                  {prog.strategicPriority} Priority
                </span>
                <span className="text-xs text-charcoal-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  {prog.duration}
                </span>
              </div>

              {/* Program Name */}
              <h4 className="text-body-md font-bold text-charcoal-900 tracking-tight mb-2 leading-snug">
                {prog.name}
              </h4>

              <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                {prog.description}
              </p>

              {/* Target Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {prog.targetSkills?.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Progress & Participants */}
              <div className="space-y-1.5 pt-2 border-t border-surface-border/60">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-charcoal-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-charcoal-400" />
                    {prog.participants} Engineers Enrolled
                  </span>
                  <span className="font-mono text-brand-700">{prog.progressPct}% Progress</span>
                </div>
                <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${prog.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Related Capability Gap */}
              <div className="mt-3 p-2 rounded bg-canvas-subtle border border-surface-border text-[11px] text-charcoal-700">
                <strong className="text-charcoal-800">Target Gap:</strong> {prog.capabilityGap}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => navigate('/organization/planning')}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Workforce Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/organization/planning/roadmap')}
                className="text-xs"
              >
                Inspect Roadmap
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationLearningPrograms;
