import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Layers, Clock, ArrowRight, Sparkles, CheckCircle2, Compass, Award } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

export const LearningPathCard = ({ path }) => {
  const { navigate } = useRouter();

  if (!path) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
    >
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Badge
              variant={path.priority === 'High' ? 'danger' : 'warning'}
              size="sm"
            >
              {path.priority} Priority
            </Badge>
            <span className="text-xs px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-600 font-medium border border-surface-border">
              {path.difficulty}
            </span>
          </div>

          <span className="text-xs font-semibold text-charcoal-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            {path.estimatedDuration}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-body-md font-bold text-charcoal-900 tracking-tight mb-1 group-hover:text-brand-600 transition-colors">
          {path.title}
        </h3>
        <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2 mb-3">
          {path.tagline || path.description}
        </p>

        {/* Skills Covered */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {path.skills?.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border/70"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Roadmap Association */}
        {path.roadmapStage && (
          <div className="p-2 rounded bg-brand-50/50 border border-brand-100/60 text-[11px] text-brand-900 mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate"><strong>Roadmap:</strong> {path.roadmapStage}</span>
          </div>
        )}

        {/* Progress Metric */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-charcoal-600">
              {path.completedModules || 0} of {path.modulesCount || path.modules?.length || 0} Modules Completed
            </span>
            <span className="font-mono text-brand-700">{path.progressPct || 0}%</span>
          </div>
          <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${path.progressPct || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-surface-border/70 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate('/dashboard/career-roadmap')}
          className="text-xs text-charcoal-500 hover:text-charcoal-800 font-medium cursor-pointer"
        >
          View Roadmap →
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/dashboard/learning/path/${path.id}`)}
          className="flex items-center gap-1.5"
        >
          <span>Explore Path</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningPathCard;
