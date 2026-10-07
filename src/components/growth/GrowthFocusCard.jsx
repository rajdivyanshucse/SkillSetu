import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { initialSkillGrowthRecords } from '../../data/growthData';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const GrowthFocusCard = ({
  skills = initialSkillGrowthRecords,
  className = '',
}) => {
  const { navigate } = useRouter();

  const focusSkills = skills.filter((s) => s.developmentArea).slice(0, 4);

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Active Growth Focus Areas
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Key capabilities prioritized for your current target-role development roadmap.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/growth/skills')}
          className="text-xs text-brand-700 hover:text-brand-900 self-start sm:self-auto flex items-center gap-1"
        >
          View All Skills ({skills.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Focus Area Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {focusSkills.map((skill, idx) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-3.5 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-300 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                    {skill.category}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900">
                    {skill.name}
                  </h4>
                </div>
                <Badge
                  variant={skill.priority === 'High' ? 'danger' : 'warning'}
                  size="sm"
                >
                  {skill.priority || 'Medium'} Priority
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 my-2">
                <div className="flex justify-between text-[11px] font-semibold text-charcoal-700">
                  <span>Level {skill.currentLevel} / {skill.targetLevel}</span>
                  <span>{skill.progressPct}%</span>
                </div>
                <div className="h-2 w-full bg-canvas-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progressPct}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed mb-1">
                <strong className="text-charcoal-800">Reason:</strong> {skill.reason}
              </p>
              <p className="text-[11px] text-brand-900 bg-brand-50/70 p-2 rounded border border-brand-100/60 leading-relaxed">
                <strong>Next Step:</strong> {skill.nextAction}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/career-roadmap`)}
                className="text-charcoal-600 hover:text-brand-600 font-semibold cursor-pointer"
              >
                Roadmap Stage →
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/growth/learning')}
                className="text-brand-700 hover:text-brand-900 font-bold cursor-pointer"
              >
                Start Learning Lab →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GrowthFocusCard;
