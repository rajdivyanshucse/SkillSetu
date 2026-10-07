import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  Check,
  TrendingUp,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const SkillGapDetail = ({
  skill,
  onClose,
  isDrawer = true,
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [isFocused, setIsFocused] = useState(false);

  if (!skill) return null;

  const handleToggleFocus = () => {
    const nextState = !isFocused;
    setIsFocused(nextState);
    addToast({
      title: nextState ? 'Added to Development Focus' : 'Removed from Focus',
      message: nextState
        ? `${skill.name} has been added to your priority focus list for career roadmap planning.`
        : `${skill.name} has been removed from active focus.`,
      type: nextState ? 'success' : 'info',
      duration: 3500,
    });
  };

  const content = (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-xs border border-brand-200/60">
            {skill.category}
          </span>
          {onClose && isDrawer && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-sm text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
              aria-label="Close detail"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
          {skill.name}
        </h3>

        <p className="text-xs text-charcoal-600 leading-relaxed">
          {skill.skillContext || skill.whyItMatters}
        </p>
      </div>

      {/* Level Delta Comparison Box */}
      <div className="p-4 rounded-xl bg-canvas-subtle/80 border border-surface-border grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
            Current Level
          </span>
          <span className="text-body-md font-bold text-charcoal-800">
            {skill.userLevel}
          </span>
          <span className="text-[10px] text-charcoal-400 block">Self-rated rating</span>
        </div>

        <div className="p-3 rounded-lg bg-brand-50/60 border border-brand-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-700 block">
            Target Benchmark
          </span>
          <span className="text-body-md font-extrabold text-brand-900">
            {skill.requiredLevel}
          </span>
          <span className="text-[10px] text-brand-600 block">Role requirement</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-lg bg-canvas-subtle border border-surface-border space-y-0.5">
          <span className="text-[10px] text-charcoal-400 font-semibold block">
            Gap Delta
          </span>
          <span className="font-bold text-charcoal-900">{skill.gapIntensity}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-canvas-subtle border border-surface-border space-y-0.5">
          <span className="text-[10px] text-charcoal-400 font-semibold block">
            Role Weight
          </span>
          <span className="font-bold text-charcoal-900">{skill.roleImportance}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-canvas-subtle border border-surface-border space-y-0.5">
          <span className="text-[10px] text-charcoal-400 font-semibold block">
            Market Demand
          </span>
          <span className="font-bold text-emerald-800">{skill.marketRelevance}</span>
        </div>
      </div>

      {/* What To Build / Practical Focus Suggestions */}
      <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900">
          <BookOpen className="w-4 h-4 text-brand-600" />
          <span>What to build to close this gap:</span>
        </div>

        <div className="space-y-2 text-xs text-charcoal-700">
          {(skill.whatToBuild || [
            'Understand foundational concepts & syntax conventions',
            'Build a practical hands-on project integrating this technology',
            'Write automated tests & benchmark performance metrics',
          ]).map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="leading-normal">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites & difficulty */}
      {skill.prerequisites && skill.prerequisites.length > 0 && (
        <div className="space-y-1.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
            Suggested Prerequisites:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {skill.prerequisites.map((p) => (
              <span
                key={p}
                className="text-[11px] px-2 py-0.5 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-700"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row gap-2.5">
        <Button
          variant={isFocused ? 'secondary' : 'primary'}
          size="md"
          leftIcon={isFocused ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
          onClick={handleToggleFocus}
          className="w-full justify-center"
        >
          {isFocused ? 'In Development Focus' : 'Add to Development Focus'}
        </Button>

        {skill.id && (
          <Button
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              if (onClose) onClose();
              navigate(`/dashboard/career-roadmap/skill/${skill.id}`);
            }}
            className="w-full sm:w-auto justify-center text-xs font-semibold"
          >
            Open Learning Path
          </Button>
        )}

        {onClose && (
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );

  return <div className={`p-5 sm:p-6 ${className}`}>{content}</div>;
};

export default SkillGapDetail;
