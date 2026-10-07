import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Layers, Target, ArrowRight, Briefcase, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

export const LearningRecommendationCard = ({ recommendation, onStart }) => {
  const { navigate } = useRouter();

  if (!recommendation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-4"
    >
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-semibold border border-brand-200/60">
              {recommendation.format}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border">
              {recommendation.relatedSkill}
            </span>
          </div>

          <Badge
            variant={recommendation.priority === 'High' ? 'danger' : 'warning'}
            size="sm"
          >
            {recommendation.priority} Priority
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-body-md font-bold text-charcoal-900 tracking-tight mb-2 leading-snug">
          {recommendation.activity}
        </h3>

        {/* Why it Matters Context Box */}
        <div className="p-3 rounded-md bg-canvas-subtle/70 border border-surface-border space-y-1.5 mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-charcoal-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>Why This Recommendation Matters:</span>
          </div>
          <p className="text-charcoal-600 leading-relaxed text-[11px]">
            {recommendation.whyItMatters}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs py-2 border-y border-surface-border/60">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
              Skill Gap
            </span>
            <span className="font-semibold text-charcoal-800 text-[11px] truncate block">
              {recommendation.skillGap}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
              Target Role
            </span>
            <span className="font-semibold text-brand-800 text-[11px] truncate block">
              {recommendation.targetRole}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
              Estimated Effort
            </span>
            <span className="font-semibold text-charcoal-800 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-charcoal-400" />
              {recommendation.estimatedEffort}
            </span>
          </div>
        </div>

        {/* Connected Market & Opportunity Signals */}
        {(recommendation.opportunityPresence || recommendation.compensationContext) && (
          <div className="pt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-charcoal-500">
            {recommendation.opportunityPresence && (
              <span className="inline-flex items-center gap-1 bg-brand-50/50 px-2 py-0.5 rounded text-brand-800 font-medium">
                <Briefcase className="w-3 h-3 text-brand-600" />
                {recommendation.opportunityPresence}
              </span>
            )}
            {recommendation.compensationContext && (
              <span className="inline-flex items-center gap-1 bg-emerald-50/50 px-2 py-0.5 rounded text-emerald-800 font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                {recommendation.compensationContext}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate('/dashboard/skill-gaps')}
          className="text-xs text-charcoal-500 hover:text-charcoal-800 font-medium cursor-pointer"
        >
          View Skill Gap Delta →
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            if (onStart) {
              onStart(recommendation);
            } else if (recommendation.pathId) {
              navigate(`/dashboard/learning/path/${recommendation.pathId}`);
            } else {
              navigate('/dashboard/learning/catalog');
            }
          }}
          className="flex items-center gap-1.5"
        >
          <span>{recommendation.nextAction || 'Start Learning Path'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningRecommendationCard;
