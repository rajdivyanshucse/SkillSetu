import React, { useState } from 'react';
import { ArrowLeft, Layers, Sparkles, CheckCircle2, BookOpen, Wrench, ShieldCheck, Play } from 'lucide-react';
import { useRouter } from '../../router/Router';
import {
  defaultRoadmapStages,
  projectRecommendations,
  getStoredRoadmapProgress,
  saveRoadmapProgress,
  calculateRoadmapMetrics,
} from '../../data/roadmapData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const RoadmapDetailPage = ({ roadmapId = 'cloud-deployment' }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const [storedProgress, setStoredProgress] = useState(() => getStoredRoadmapProgress());

  const { stages } = calculateRoadmapMetrics(defaultRoadmapStages, storedProgress);

  const matchedStage =
    stages.find((s) => s.id === roadmapId) ||
    stages.find((s) => s.id.includes(roadmapId) || roadmapId.includes(s.id)) ||
    stages[2];

  const handleToggleActivity = (activityId, isCompleted, actTitle) => {
    const nextState = {
      ...storedProgress,
      [activityId]: !isCompleted,
    };
    setStoredProgress(nextState);
    saveRoadmapProgress(nextState);
    addToast({
      title: !isCompleted ? 'Milestone Completed!' : 'Milestone Updated',
      message: `"${actTitle}" has been updated in your roadmap.`,
      type: !isCompleted ? 'success' : 'info',
      duration: 3000,
    });
  };

  return (
    <DashboardLayout
      activeRoute="/dashboard/career-roadmap"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Career Roadmap', href: '/dashboard/career-roadmap' },
        { label: `Stage ${matchedStage.stageNumber}: ${matchedStage.title}` },
      ]}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
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

        {/* Stage Overview Banner */}
        <div className="bg-surface border border-brand-200 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
                STAGE {matchedStage.stageNumber}
              </span>
              <Badge status={matchedStage.progress >= 100 ? 'verified' : 'recommended'} size="sm">
                {matchedStage.status}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {matchedStage.title}
            </h1>

            <p className="text-body-sm text-charcoal-600 leading-relaxed">
              {matchedStage.subtitle}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-canvas-subtle/80 border border-surface-border text-center shrink-0 min-w-36">
            <div className="text-3xl font-black text-brand-700">
              {matchedStage.progress}%
            </div>
            <div className="text-[10px] uppercase font-bold text-charcoal-500 mt-0.5">
              Stage Progress
            </div>
            <div className="w-24 h-1.5 bg-canvas-muted rounded-full overflow-hidden mx-auto mt-2">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${matchedStage.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills & Activity Checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-body-md font-bold text-charcoal-900">
              Competencies & Practical Milestones
            </h2>
            <span className="text-xs text-charcoal-500">
              {(matchedStage.skills || []).length} Competencies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(matchedStage.skills || []).map((skill) => (
              <Card key={skill.id || skill.name} className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-charcoal-400">
                        {skill.category}
                      </span>
                      <h3 className="text-body-md font-bold text-charcoal-900 mt-0.5">
                        {skill.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
                      Target: {skill.targetLevel}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                    {skill.description || skill.whyItMatters}
                  </p>

                  {/* Activity Checklist */}
                  <div className="space-y-2 pt-2 border-t border-surface-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                      Development Milestones:
                    </span>
                    {(skill.activities || []).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-2 text-xs p-2 rounded-md bg-canvas-subtle border border-surface-border"
                      >
                        <input
                          type="checkbox"
                          id={`detail-${act.id}`}
                          checked={act.completed}
                          onChange={() => handleToggleActivity(act.id, act.completed, act.title)}
                          className="mt-0.5 rounded-xs border-charcoal-400 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                        <label
                          htmlFor={`detail-${act.id}`}
                          className={`leading-snug cursor-pointer select-none ${
                            act.completed
                              ? 'text-charcoal-400 line-through'
                              : 'text-charcoal-800 font-medium'
                          }`}
                        >
                          {act.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => navigate(`/dashboard/career-roadmap/skill/${skill.id}`)}
                  >
                    View Full Skill Plan
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoadmapDetailPage;
