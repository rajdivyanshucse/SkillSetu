import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Button } from '../ui/Button';

export const RoadmapSkillCard = ({
  skill,
  stageTitle = '',
  onSelectSkill,
  onOpenStage,
  className = '',
}) => {
  if (!skill) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-800 border border-brand-200">
            <Sparkles className="w-3 h-3 text-brand-600" />
            In Progress
          </span>
        );
      case 'Next':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Active Next
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-medium bg-canvas-muted text-charcoal-600 border border-surface-border">
            Upcoming
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'Critical') {
      return (
        <span className="text-[10px] px-2 py-0.2 rounded-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          Critical Gap
        </span>
      );
    }
    if (priority === 'High') {
      return (
        <span className="text-[10px] px-2 py-0.2 rounded-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
          High Priority
        </span>
      );
    }
    return null;
  };

  const completedCount = (skill.activities || []).filter((a) => a.completed).length;
  const totalCount = (skill.activities || []).length || 4;

  return (
    <div
      className={`
        p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3
        ${
          skill.status === 'Next'
            ? 'bg-brand-50/30 border-brand-300 ring-1 ring-brand-300/50 shadow-xs'
            : skill.status === 'Completed'
            ? 'bg-canvas-subtle/50 border-surface-border opacity-90'
            : 'bg-surface border-surface-border hover:border-surface-border-strong hover:shadow-xs'
        }
        ${className}
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-charcoal-400">
              {skill.category}
            </span>
            {getPriorityBadge(skill.priority)}
          </div>
          {getStatusBadge(skill.status)}
        </div>

        <h4 className="text-body-sm font-bold text-charcoal-900">
          {skill.name}
        </h4>

        <p className="text-xs text-charcoal-600 mt-1 leading-normal line-clamp-2">
          {skill.description || skill.whyItMatters}
        </p>

        {/* Level Progression */}
        <div className="mt-3 pt-2.5 border-t border-surface-border/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-charcoal-500 font-medium">
              {skill.currentLevel}
            </span>
            <span className="text-charcoal-300 font-bold">→</span>
            <span className="text-[11px] font-bold text-brand-800">
              {skill.targetLevel}
            </span>
          </div>

          <span className="text-[10px] text-charcoal-500 font-mono">
            {completedCount}/{totalCount} milestones
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-surface-border flex items-center justify-end">
        <Button
          variant="outline"
          size="xs"
          rightIcon={<ArrowRight className="w-3 h-3" />}
          onClick={() => onSelectSkill && onSelectSkill(skill)}
          className="text-xs font-semibold"
        >
          Open Development Plan
        </Button>
      </div>
    </div>
  );
};

export default RoadmapSkillCard;
