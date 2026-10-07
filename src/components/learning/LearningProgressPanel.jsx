import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Wrench, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

const pipelineStages = [
  {
    key: 'learn',
    title: 'LEARN',
    label: 'Core Concepts',
    icon: <BookOpen className="w-4 h-4 text-brand-600" />,
    progress: 75,
    description: 'Foundational theory, language internals, and architecture reading.',
    count: '6 / 8 Modules',
  },
  {
    key: 'practice',
    title: 'PRACTICE',
    label: 'Hands-on Labs',
    icon: <Code className="w-4 h-4 text-amber-600" />,
    progress: 60,
    description: 'Interactive coding sandboxes, query profiling, and configuration labs.',
    count: '4 / 6 Labs',
  },
  {
    key: 'build',
    title: 'BUILD',
    label: 'Project Implementations',
    icon: <Wrench className="w-4 h-4 text-indigo-600" />,
    progress: 40,
    description: 'Multi-service repositories, Docker stacks, and end-to-end applications.',
    count: '2 / 4 Projects',
  },
  {
    key: 'validate',
    title: 'VALIDATE',
    label: 'Assessments & Reviews',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    progress: 50,
    description: 'Architecture case studies, load simulation, and portfolio evidence.',
    count: '2 / 4 Validations',
  },
];

export const LearningProgressPanel = ({
  overallProgress = 64,
  targetRole = 'Backend Software Engineer',
}) => {
  const { navigate } = useRouter();

  return (
    <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 block">
            4-Stage Learning Pipeline
          </span>
          <h3 className="text-body-md font-bold text-charcoal-900 tracking-tight">
            Curriculum Progression & Mastery Architecture
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block tracking-wider">
              Overall Pipeline Index
            </span>
            <span className="text-lg font-extrabold text-brand-700 font-mono">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pipeline Stage Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pipelineStages.map((stage, idx) => (
          <div
            key={stage.key}
            className="p-3.5 rounded-lg bg-canvas border border-surface-border flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 uppercase tracking-wider">
                  Stage 0{idx + 1}
                </span>
                <span className="text-xs font-bold font-mono text-charcoal-800">
                  {stage.progress}%
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                {stage.icon}
                <h4 className="text-xs font-bold text-charcoal-900">
                  {stage.title} • {stage.label}
                </h4>
              </div>

              <p className="text-[11px] text-charcoal-600 leading-relaxed line-clamp-2">
                {stage.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-surface-border/50">
              <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${stage.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-charcoal-500 font-semibold block text-right">
                {stage.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Connection to Growth */}
      <div className="p-3.5 rounded-md bg-brand-50/50 border border-brand-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brand-900">
          <TrendingUp className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>Growth Portfolio Link:</strong> Modules, projects, and validations completed here directly advance your Phase 14 Professional Growth scorecards.
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard/growth')}
          className="font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View Growth Scorecard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default LearningProgressPanel;
