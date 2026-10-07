import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Code, Wrench, ShieldCheck, CheckCircle2, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from '../../router/Router';
import {
  defaultRoadmapStages,
  getStoredRoadmapProgress,
  saveRoadmapProgress,
  calculateRoadmapMetrics,
} from '../../data/roadmapData';
import { getSkillAssociation } from '../../data/compensationData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const RoadmapSkillPage = ({ skillId = 'aws' }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [storedProgress, setStoredProgress] = useState(() => getStoredRoadmapProgress());

  const { stages } = calculateRoadmapMetrics(defaultRoadmapStages, storedProgress);

  // Search all skills across all stages
  const allSkills = stages.flatMap((s) => s.skills);
  const matchedSkill =
    allSkills.find((s) => s.id === skillId || s.name.toLowerCase().includes(skillId.toLowerCase())) ||
    allSkills[0];

  const handleToggleActivity = (activityId, isCompleted, actTitle) => {
    const nextState = {
      ...storedProgress,
      [activityId]: !isCompleted,
    };
    setStoredProgress(nextState);
    saveRoadmapProgress(nextState);
    addToast({
      title: !isCompleted ? 'Milestone Completed!' : 'Milestone Updated',
      message: `"${actTitle}" has been updated in your development progress.`,
      type: !isCompleted ? 'success' : 'info',
      duration: 3000,
    });
  };

  const acts = matchedSkill.activities || [];
  const completedCount = acts.filter((a) => a.completed).length;
  const progressPct = acts.length > 0 ? Math.round((completedCount / acts.length) * 100) : 0;

  return (
    <DashboardLayout
      activeRoute="/dashboard/career-roadmap"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Career Roadmap', href: '/dashboard/career-roadmap' },
        { label: matchedSkill.name },
      ]}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Back navigation */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/career-roadmap')}
            className="text-xs font-semibold text-charcoal-700"
          >
            Back to Career Roadmap
          </Button>
        </div>

        {/* Skill Hero Header */}
        <div className="bg-surface border border-brand-200 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
                {matchedSkill.category}
              </span>
              <span className="text-xs font-semibold text-charcoal-500">
                {matchedSkill.currentLevel} → {matchedSkill.targetLevel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {matchedSkill.name}
            </h1>

            <p className="text-body-sm text-charcoal-600 leading-relaxed">
              {matchedSkill.whyItMatters || matchedSkill.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-canvas-subtle/80 border border-surface-border text-center shrink-0 min-w-36">
            <div className="text-3xl font-black text-brand-700">
              {progressPct}%
            </div>
            <div className="text-[10px] uppercase font-bold text-charcoal-500 mt-0.5">
              Skill Progress
            </div>
            <div className="w-24 h-1.5 bg-canvas-muted rounded-full overflow-hidden mx-auto mt-2">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid: LEARN, PRACTICE, BUILD, VALIDATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-3 bg-canvas-subtle/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  WHAT TO LEARN
                </h3>
                <span className="text-[10px] text-charcoal-500">Core architectural concepts</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              {matchedSkill.learn || 'Understand foundational compute, networking, storage, and IAM permission models.'}
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-canvas-subtle/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  WHAT TO PRACTICE
                </h3>
                <span className="text-[10px] text-charcoal-500">Hands-on exercises</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              {matchedSkill.practice || 'Work with compute provisioning, container configuration, and secure storage access.'}
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-canvas-subtle/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  WHAT TO BUILD
                </h3>
                <span className="text-[10px] text-charcoal-500">Practical application</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              {matchedSkill.build || 'Deploy a containerized backend application with public access.'}
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-canvas-subtle/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal-900">
                  HOW TO VALIDATE
                </h3>
                <span className="text-[10px] text-charcoal-500">Demonstrate capability</span>
              </div>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              {matchedSkill.validate || 'Explain the architecture and document the deployment process in a portfolio repo.'}
            </p>
          </Card>
        </div>

        {/* Milestone checklist */}
        <Card className="p-5 space-y-3">
          <CardTitle>Milestone Checklist</CardTitle>
          <CardDescription>
            Check off development activities as you complete them to update your roadmap progress.
          </CardDescription>

          <div className="space-y-2 pt-2">
            {acts.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-canvas-subtle/80 border border-surface-border"
              >
                <input
                  type="checkbox"
                  id={`skill-page-${act.id}`}
                  checked={act.completed}
                  onChange={() => handleToggleActivity(act.id, act.completed, act.title)}
                  className="mt-0.5 rounded-xs border-charcoal-400 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <label
                  htmlFor={`skill-page-${act.id}`}
                  className={`text-xs cursor-pointer select-none leading-normal ${
                    act.completed
                      ? 'text-charcoal-400 line-through'
                      : 'text-charcoal-900 font-semibold'
                  }`}
                >
                  {act.title}
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Compensation Signal Integration */}
        {(() => {
          const compSignal = getSkillAssociation(matchedSkill.name || skillId);
          if (!compSignal) return null;

          return (
            <Card className="p-5 space-y-3 bg-surface border border-surface-border shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                    Compensation Signal ({matchedSkill.name})
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-brand-50 text-brand-800 border border-brand-200/60">
                  Prototype Association
                </span>
              </div>

              <div className="p-3 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Observed Market Presence
                  </span>
                  <span className="font-extrabold text-charcoal-900 text-sm">
                    {compSignal.opportunityCount} prototype opportunities ({compSignal.presenceRate}%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Observed Median
                  </span>
                  <span className="font-extrabold text-charcoal-900 text-sm">
                    ₹{compSignal.medianLpa} LPA
                  </span>
                </div>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed italic">
                "{compSignal.observation}"
              </p>

              <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-500">
                  Non-causal observational pattern in prototype opportunity data.
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/compensation/skills')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
                >
                  Skill Intelligence <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })()}
      </div>
    </DashboardLayout>
  );
};

export default RoadmapSkillPage;
