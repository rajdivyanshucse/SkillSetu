import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Sparkles, Compass, FolderGit2, ShieldCheck, ArrowRight, Layers, Award } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import LearningKpiGrid from '../../components/learning/LearningKpiGrid';
import LearningPriorityCards from '../../components/learning/LearningPriorityCards';
import LearningPathCard from '../../components/learning/LearningPathCard';
import LearningProgressPanel from '../../components/learning/LearningProgressPanel';
import LearningProjectRecommendations from '../../components/learning/LearningProjectRecommendations';
import LearningValidation from '../../components/learning/LearningValidation';
import LearningInsights from '../../components/learning/LearningInsights';
import LearningMethodology from '../../components/learning/LearningMethodology';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  loadLearningState,
  calculateLearningReadiness,
  calculateLearningProgress
} from '../../utils/learningIntelligence';
import { initialLearningPaths, initialLearningProjects, initialValidationActivities } from '../../data/learningData';

export const LearningIntelligencePage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOnboarding();
  const [learningState, setLearningState] = useState(() => loadLearningState());

  useEffect(() => {
    setLearningState(loadLearningState());
  }, []);

  const targetRole = onboardingData?.targetRole || 'Backend Software Engineer';
  const paths = learningState?.paths || initialLearningPaths;
  const projects = learningState?.projects || initialLearningProjects;
  const validation = learningState?.validation || initialValidationActivities;

  const kpis = calculateLearningReadiness(paths, projects, validation);
  const overallProgress = calculateLearningProgress(paths);

  return (
    <DashboardLayout activeRoute="/dashboard/learning">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm" className="gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Development Intelligence
              </Badge>
              <span className="text-xs text-charcoal-500">
                Target Role: <strong>{targetRole}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">
              Learning Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl leading-relaxed">
              Turn skill gaps and career goals into structured learning paths, practice activities, and project-based development.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/learning/recommendations')}
              className="text-xs gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              Recommendations
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/learning/catalog')}
              className="text-xs gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Resource Catalog
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/learning/saved')}
              className="text-xs gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              Saved Learning
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/learning/projects')}
              className="text-xs gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Projects
            </Button>
          </div>
        </div>

        {/* Learning KPI Grid */}
        <LearningKpiGrid kpis={kpis} />

        {/* Priority Learning Areas */}
        <LearningPriorityCards />

        {/* Active Structured Learning Paths */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-600" />
                Structured Learning Paths for {targetRole}
              </h3>
              <p className="text-xs text-charcoal-500">
                Multi-stage curricula sequencing theory, practical labs, systems implementation, and validation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paths.slice(0, 3).map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </div>

        {/* 4-Stage Learning Progression Pipeline */}
        <LearningProgressPanel
          overallProgress={overallProgress}
          targetRole={targetRole}
        />

        {/* Project-Based Learning & Portfolio Evidence */}
        <LearningProjectRecommendations projects={projects} />

        {/* Validation Activities */}
        <LearningValidation activities={validation} />

        {/* Diagnostic Insights */}
        <LearningInsights />

        {/* Methodology & Disclaimers */}
        <LearningMethodology />
        <LearningDisclaimer />
      </div>
    </DashboardLayout>
  );
};

export default LearningIntelligencePage;
