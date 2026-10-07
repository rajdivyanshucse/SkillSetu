import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const SkillGrowthCard = ({
  skill,
  onUpdateLevel,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!skill) return null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`bg-surface p-4 rounded-lg border border-surface-border hover:border-brand-300 shadow-xs flex flex-col justify-between space-y-3 ${className}`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
              {skill.category}
            </span>
            <h3 className="text-sm font-bold text-charcoal-900">
              {skill.name}
            </h3>
          </div>
          <Badge
            variant={
              skill.status?.includes('Advanced')
                ? 'success'
                : skill.status?.includes('Early')
                ? 'warning'
                : 'brand'
            }
            size="sm"
          >
            {skill.status || 'In Progress'}
          </Badge>
        </div>

        {/* Level & Progress */}
        <div className="my-2.5 p-2.5 rounded-md bg-canvas-subtle/70 border border-surface-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-charcoal-600 font-semibold">
              Current: <strong>{skill.currentLevel} / 10</strong>
            </span>
            <span className="text-charcoal-600 font-semibold">
              Target: <strong>{skill.targetLevel} / 10</strong>
            </span>
          </div>

          <div className="h-2 w-full bg-canvas-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-300"
              style={{ width: `${skill.progressPct || 0}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-charcoal-500">
            <span>Progress: {skill.progressPct}%</span>
            <span>{skill.completedActivities || 0}/{skill.activitiesCount || 0} activities</span>
          </div>
        </div>

        {/* Reason / Context */}
        {skill.reason && (
          <p className="text-xs text-charcoal-600 leading-relaxed mb-1">
            <strong className="text-charcoal-800">Focus:</strong> {skill.reason}
          </p>
        )}

        {/* Next Action */}
        {skill.nextAction && (
          <p className="text-[11px] text-brand-900 bg-brand-50/70 p-2 rounded border border-brand-100/60 leading-relaxed">
            <strong>Next Action:</strong> {skill.nextAction}
          </p>
        )}
      </div>

      {/* Action Links */}
      <div className="pt-3 border-t border-surface-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/skill-gaps`)}
          className="text-charcoal-600 hover:text-brand-600 font-semibold cursor-pointer"
        >
          View Skill Gap →
        </button>

        <button
          type="button"
          onClick={() => navigate(`/dashboard/career-roadmap`)}
          className="text-brand-700 hover:text-brand-900 font-bold cursor-pointer"
        >
          View Roadmap →
        </button>
      </div>
    </motion.div>
  );
};

export default SkillGrowthCard;
