import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { organizationDevelopmentPrograms } from '../../data/growthData';
import Badge from '../ui/Badge';

export const OrganizationDevelopmentPrograms = ({
  programs = organizationDevelopmentPrograms,
  className = '',
  title = 'Active Workforce Development Programs & Cohorts',
  subtitle = 'Structured technical learning initiatives driving aggregate capability growth across business units.',
}) => {
  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          {programs.length} Cohorts In Flight
        </span>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map((prog, idx) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-4 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-300 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Top */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                    {prog.department}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900">
                    {prog.name}
                  </h4>
                </div>
                <Badge
                  variant={prog.status === 'Final Stage' ? 'success' : 'brand'}
                  size="sm"
                >
                  {prog.status}
                </Badge>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed mb-2.5">
                {prog.description}
              </p>

              {/* Progress & Duration */}
              <div className="p-2.5 rounded bg-surface border border-surface-border/60 space-y-1.5 mb-2.5">
                <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                  <span>Average Progress: {prog.averageProgress}%</span>
                  <span className="text-brand-700 font-bold">{prog.participants} Participants</span>
                </div>
                <div className="h-1.5 w-full bg-canvas-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{ width: `${prog.averageProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-charcoal-500 pt-0.5">
                  <span>{prog.duration}</span>
                  <span>Completion Rate: {prog.completionRate}%</span>
                </div>
              </div>

              {/* Focus Skills */}
              <div className="flex flex-wrap gap-1">
                {prog.focusSkills?.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-1.5 py-0.5 rounded-xs bg-canvas-muted text-charcoal-700 text-[10px] font-medium border border-surface-border/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Capability */}
            <div className="pt-2 border-t border-surface-border/60 text-xs text-charcoal-600 font-medium flex items-center justify-between">
              <span>
                Target: <strong>{prog.targetCapability}</strong>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationDevelopmentPrograms;
