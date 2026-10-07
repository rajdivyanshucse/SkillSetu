import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle2, Play, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { initialLearningCourses } from '../../data/growthData';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

export const LearningProgress = ({
  courses = initialLearningCourses,
  onToggleModuleComplete,
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Structured Learning Modules & Progress
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Interactive self-directed development tracks aligned with your roadmap goals.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          {courses.length} Active Tracks
        </span>
      </div>

      {/* Courses List */}
      <div className="space-y-3.5">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-3.5 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-200 transition-colors space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="text-charcoal-300">•</span>
                  <span className="text-[11px] text-charcoal-500 font-medium">
                    {course.provider}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-charcoal-900 mt-0.5">
                  {course.title}
                </h4>
              </div>

              <Badge
                variant={course.status === 'Completed' ? 'success' : 'brand'}
                size="sm"
              >
                {course.status}
              </Badge>
            </div>

            {/* Progress Section */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                <span>{course.currentModule}</span>
                <span>{course.progressPct}%</span>
              </div>
              <div className="h-2 w-full bg-canvas-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    course.progressPct === 100 ? 'bg-emerald-600' : 'bg-brand-600'
                  }`}
                  style={{ width: `${course.progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-charcoal-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-charcoal-400" />
                  {course.estimatedEffort}
                </span>
                <span>
                  {course.completedModules}/{course.modulesCount} modules
                </span>
              </div>
            </div>

            {/* Footer / Link */}
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs">
              <span className="text-charcoal-600 font-medium">
                Related Capability: <strong>{course.relatedSkillName}</strong>
              </span>
              <button
                type="button"
                onClick={() => navigate('/dashboard/career-roadmap')}
                className="text-brand-700 hover:text-brand-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                Continue Track <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
