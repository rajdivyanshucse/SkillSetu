import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  BookOpen,
  Code,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import {
  defaultRoadmapStages,
  projectRecommendations,
  getStoredRoadmapProgress,
  saveRoadmapProgress,
  calculateRoadmapMetrics,
} from '../../data/roadmapData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const PersonalizedPathway = ({
  targetRole = 'Senior Full Stack Engineer',
  compatibility = 84,
  alignedSkills = ['Java', 'SQL', 'Spring Boot', 'REST APIs'],
  gapSkills = ['AWS', 'Docker', 'System Design'],
  description = 'Personalized pathway mapping end-to-end execution across foundational architecture, microservices, cloud deployments, and production readiness.',
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [storedProgress, setStoredProgress] = useState(() => getStoredRoadmapProgress());
  const [activePillar, setActivePillar] = useState('all');

  const { stages, overallRoadmapProgress, currentFocusSkill } = calculateRoadmapMetrics(
    defaultRoadmapStages,
    storedProgress
  );

  const handleToggleActivity = (activityId, isCompleted, title) => {
    const nextState = {
      ...storedProgress,
      [activityId]: !isCompleted,
    };
    setStoredProgress(nextState);
    saveRoadmapProgress(nextState);

    addToast({
      title: !isCompleted ? 'Activity Completed' : 'Progress Updated',
      message: `"${title}" has been updated in your roadmap progress.`,
      type: !isCompleted ? 'success' : 'info',
      duration: 3000,
    });
  };

  const pillars = [
    { id: 'all', label: 'All Stages', icon: Layers },
    { id: 'learn', label: '01 LEARN', icon: BookOpen, desc: 'Concepts & architecture' },
    { id: 'practice', label: '02 PRACTICE', icon: Code, desc: 'Hands-on exercises' },
    { id: 'build', label: '03 BUILD', icon: Wrench, desc: 'Production systems' },
    { id: 'validate', label: '04 VALIDATE', icon: ShieldCheck, desc: 'Evidence & metrics' },
  ];

  return (
    <Card className={`bg-surface border-surface-border shadow-subtle ${className}`}>
      <CardHeader className="border-b border-surface-border/80 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-xs border border-brand-200/60">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Active Personalized Pathway</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              Personalized Pathway: {targetRole}
            </CardTitle>
            <CardDescription className="text-xs text-charcoal-600 max-w-2xl">
              {description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-brand-700">
                {overallRoadmapProgress}%
              </div>
              <div className="text-[10px] uppercase font-bold text-charcoal-500">
                Roadmap Progress
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/dashboard/career-roadmap')}
            >
              Open Full Roadmap
            </Button>
          </div>
        </div>

        {/* Target Role Context KPI Row */}
        <div className="mt-4 pt-4 border-t border-surface-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
              Target Role Compatibility
            </span>
            <div className="text-base font-extrabold text-brand-800">
              {compatibility}% Alignment
            </div>
            <p className="text-[11px] text-charcoal-500">Calibrated against role archetypes</p>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Aligned Core Capabilities ({alignedSkills.length})
            </span>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {alignedSkills.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.2 rounded-xs bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Active Priority Gaps ({gapSkills.length})
            </span>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {gapSkills.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.2 rounded-xs bg-amber-50 text-amber-800 font-semibold border border-amber-200"
                >
                  ▲ {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Pillars Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 pt-4">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(p.id)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer
                  ${
                    activePillar === p.id
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Stages Timeline & Activities Execution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Execution Sequence (LEARN → PRACTICE → BUILD → VALIDATE)
            </span>
            <span className="text-xs text-charcoal-500">
              Checked items sync with your overall progress
            </span>
          </div>

          <div className="space-y-4">
            {stages.map((stage) => {
              return (
                <div
                  key={stage.id}
                  className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-4"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                        {stage.stageNumber}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-charcoal-900">
                          {stage.title}
                        </h4>
                        <p className="text-[11px] text-charcoal-500">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`
                          text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider
                          ${
                            stage.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : stage.status === 'In Progress'
                              ? 'bg-brand-50 text-brand-800 border border-brand-200'
                              : 'bg-canvas-muted text-charcoal-600 border border-surface-border'
                          }
                        `}
                      >
                        {stage.status} ({stage.progress}%)
                      </span>

                      <Button
                        variant="ghost"
                        size="xs"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/dashboard/career-roadmap/${stage.id}`)}
                        className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                      >
                        View Stage
                      </Button>
                    </div>
                  </div>

                  {/* Skills & Activity Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(stage.skills || []).map((skill) => {
                      const acts = (skill.activities || []).filter((act) => {
                        if (activePillar === 'all') return true;
                        return act.type === activePillar;
                      });

                      if (acts.length === 0 && activePillar !== 'all') return null;

                      return (
                        <div
                          key={skill.id}
                          className="p-3.5 rounded-lg bg-surface border border-surface-border space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                                  {skill.category}
                                </span>
                                <h5 className="font-bold text-xs text-charcoal-900">
                                  {skill.name}
                                </h5>
                              </div>
                              <span className="text-[10px] font-semibold text-charcoal-500">
                                {skill.status}
                              </span>
                            </div>

                            {/* Activities Checklist */}
                            <div className="space-y-2 pt-1">
                              {acts.map((act) => (
                                <div
                                  key={act.id}
                                  className="flex items-start gap-2 text-xs leading-normal"
                                >
                                  <input
                                    type="checkbox"
                                    id={`pathway-${act.id}`}
                                    checked={act.completed}
                                    onChange={() =>
                                      handleToggleActivity(act.id, act.completed, act.title)
                                    }
                                    className="mt-0.5 rounded-xs border-charcoal-400 text-brand-600 focus:ring-brand-500 cursor-pointer"
                                  />
                                  <label
                                    htmlFor={`pathway-${act.id}`}
                                    className={`cursor-pointer select-none text-[11px] ${
                                      act.completed
                                        ? 'text-charcoal-400 line-through'
                                        : 'text-charcoal-800 font-medium'
                                    }`}
                                  >
                                    <span className="font-mono text-[9px] uppercase font-bold px-1 py-0.2 rounded bg-canvas-subtle border border-surface-border mr-1">
                                      {act.type}
                                    </span>
                                    {act.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/dashboard/career-roadmap/skill/${skill.id}`)
                              }
                              className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                            >
                              Open Learning Path →
                            </button>
                            <span className="text-[10px] text-charcoal-400">
                              {skill.currentLevel} → {skill.targetLevel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Practical Project Recommendations */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-600" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-charcoal-900">
                Recommended Projects For {targetRole}
              </h4>
            </div>
            <span className="text-xs text-charcoal-500">
              Applied portfolio artifacts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {projectRecommendations.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-lg bg-canvas-subtle/80 border border-surface-border flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded-xs border border-brand-200">
                      {proj.category}
                    </span>
                    <span className="text-charcoal-500 font-semibold">{proj.estimatedTime}</span>
                  </div>
                  <h5 className="font-bold text-xs text-charcoal-900">
                    {proj.title}
                  </h5>
                  <p className="text-[11px] text-charcoal-600 leading-normal">
                    {proj.purpose}
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {proj.skillsPracticed.slice(0, 2).map((s) => (
                      <span key={s} className="text-[10px] text-charcoal-500">
                        #{s}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate('/dashboard/learning/projects')}
                  >
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedPathway;
