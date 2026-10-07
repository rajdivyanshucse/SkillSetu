import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Clock, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

const formatColors = {
  Course: { bg: 'bg-brand-50', text: 'text-brand-800', border: 'border-brand-200/60' },
  'Practice Lab': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200/60' },
  Tutorial: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200/60' },
  Project: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200/60' },
  'Case Study': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200/60' },
  Documentation: { bg: 'bg-canvas-subtle', text: 'text-charcoal-800', border: 'border-surface-border' },
  Assessment: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200/60' },
};

export const LearningResourceCard = ({
  resource,
  isSaved = false,
  onToggleSave,
}) => {
  const { navigate } = useRouter();

  if (!resource) return null;

  const formatStyle = formatColors[resource.format] || formatColors.Course;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-4 group"
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${formatStyle.bg} ${formatStyle.text} ${formatStyle.border}`}>
              {resource.format}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-600 font-medium border border-surface-border">
              {resource.difficulty}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave(resource.id)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isSaved
                ? 'text-brand-700 bg-brand-50 border border-brand-200'
                : 'text-charcoal-400 hover:text-charcoal-700 hover:bg-canvas-subtle'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save resource'}
            aria-label={isSaved ? 'Saved' : 'Save'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-brand-700" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-body-md font-bold text-charcoal-900 tracking-tight mb-2 leading-snug group-hover:text-brand-600 transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2 mb-3">
          {resource.description}
        </p>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resource.skills?.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Why it Matters Context */}
        {resource.whyItMatters && (
          <div className="p-2.5 rounded bg-brand-50/50 border border-brand-100/60 text-[11px] text-brand-900 mb-3 space-y-1">
            <span className="font-semibold block">Development Purpose:</span>
            <p className="text-charcoal-700 leading-relaxed text-[11px]">
              {resource.whyItMatters}
            </p>
          </div>
        )}

        {/* Duration */}
        <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1 border-t border-surface-border/50">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            {resource.estimatedEffort}
          </span>
          <span className="text-charcoal-600 font-semibold text-[11px]">
            {resource.progressPct ?? 0}% Completed
          </span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-surface-border/60">
        <span className="text-[11px] text-charcoal-500 truncate">
          {resource.targetRoles?.[0] || 'Engineering'}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (resource.relatedPathId) {
              navigate(`/dashboard/learning/path/${resource.relatedPathId}`);
            } else {
              navigate('/dashboard/learning/recommendations');
            }
          }}
          className="flex items-center gap-1 text-xs"
        >
          <span>Start Activity</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningResourceCard;
