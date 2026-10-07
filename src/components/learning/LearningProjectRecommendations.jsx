import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ArrowRight, CheckCircle2, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import { initialLearningProjects } from '../../data/learningData';

export const LearningProjectRecommendations = ({
  projects = initialLearningProjects,
}) => {
  const { navigate } = useRouter();

  if (!projects || projects.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-brand-600" />
            Project-Based Learning & Portfolio Evidence
          </h3>
          <p className="text-xs text-charcoal-500">
            Concrete engineering projects that transform conceptual learning into tangible portfolio artifacts
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/growth/projects')}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Track in Professional Growth</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj, idx) => (
          <motion.div
            key={proj.id || idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="p-5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge
                  variant={
                    proj.status === 'Completed'
                      ? 'success'
                      : proj.status === 'In Progress'
                      ? 'info'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {proj.status}
                </Badge>
                <span className="text-[11px] text-charcoal-500 font-semibold">
                  {proj.estimatedHours}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-body-sm font-bold text-charcoal-900 mb-1 leading-snug">
                {proj.title}
              </h4>
              <span className="text-[11px] text-brand-800 font-medium block mb-2.5">
                Target Role: {proj.role}
              </span>

              {/* Skills Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.skills?.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded bg-canvas-subtle text-charcoal-700 font-medium border border-surface-border"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Purpose Context Box */}
              <div className="p-2.5 rounded bg-canvas-subtle/70 border border-surface-border space-y-1 mb-3 text-xs">
                <span className="font-semibold text-charcoal-800 text-[11px] block">Learning Objective:</span>
                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                  {proj.learningPurpose}
                </p>
              </div>

              {/* Validation Method */}
              <div className="text-[11px] text-charcoal-500 space-y-0.5">
                <span className="font-semibold text-charcoal-700 block">Validation:</span>
                <span className="text-charcoal-600 leading-relaxed block">
                  {proj.validationMethod}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  if (proj.relatedPathId) {
                    navigate(`/dashboard/learning/path/${proj.relatedPathId}`);
                  } else {
                    navigate('/dashboard/learning/recommendations');
                  }
                }}
                className="text-xs font-semibold text-charcoal-600 hover:text-brand-600 cursor-pointer"
              >
                View Linked Path →
              </button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard/growth/projects')}
                className="text-xs"
              >
                Growth Portfolio
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningProjectRecommendations;
