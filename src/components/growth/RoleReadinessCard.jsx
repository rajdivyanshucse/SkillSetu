import React from 'react';
import { Target, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const RoleReadinessCard = ({
  readinessData = {},
  className = '',
}) => {
  const { navigate } = useRouter();

  const {
    targetRole = 'Backend Software Engineer',
    readinessScore = 72,
    roleRequirementCoverage = 84,
    developmentProgress = 68,
    relevantProjectsCount = 4,
    priorityGapsCount = 4,
  } = readinessData;

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Target Role Development Readiness
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Holistic capability alignment for <strong>{targetRole}</strong>.
          </p>
        </div>

        <Badge variant="brand" size="md">
          {readinessScore}% Development Alignment
        </Badge>
      </div>

      {/* 4 Alignment Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-lg bg-canvas-subtle/50 border border-surface-border/80">
          <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
            Role Requirement Coverage
          </span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">
            {roleRequirementCoverage}%
          </span>
          <span className="text-[10px] text-charcoal-400">Core capabilities</span>
        </div>

        <div className="p-3 rounded-lg bg-canvas-subtle/50 border border-surface-border/80">
          <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
            Development Progress
          </span>
          <span className="text-xl font-extrabold text-brand-700 mt-1 block">
            {developmentProgress}%
          </span>
          <span className="text-[10px] text-charcoal-400">Weighted progress</span>
        </div>

        <div className="p-3 rounded-lg bg-canvas-subtle/50 border border-surface-border/80">
          <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
            Project Evidence
          </span>
          <span className="text-xl font-extrabold text-charcoal-900 mt-1 block">
            {relevantProjectsCount}
          </span>
          <span className="text-[10px] text-charcoal-400">Verified artifacts</span>
        </div>

        <div className="p-3 rounded-lg bg-canvas-subtle/50 border border-surface-border/80">
          <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
            Priority Gaps
          </span>
          <span className="text-xl font-extrabold text-amber-700 mt-1 block">
            {priorityGapsCount}
          </span>
          <span className="text-[10px] text-charcoal-400">Active focus areas</span>
        </div>
      </div>

      {/* Context Note */}
      <div className="p-3 rounded-md bg-canvas-subtle/70 border border-surface-border text-[11px] text-charcoal-600 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5" />
        <span>
          Role readiness is a prototype development indicator based on configured skills, progress, and role requirements. It is not an employment guarantee or interview score.
        </span>
      </div>

      {/* Quick Navigation Footer */}
      <div className="pt-2 border-t border-surface-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => navigate('/dashboard/skill-gaps')}
          className="text-charcoal-600 hover:text-brand-600 font-semibold cursor-pointer"
        >
          Review Skill Gaps →
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard/career-roadmap')}
          className="text-brand-700 hover:text-brand-900 font-bold cursor-pointer"
        >
          Open Career Roadmap →
        </button>
      </div>
    </div>
  );
};

export default RoleReadinessCard;
