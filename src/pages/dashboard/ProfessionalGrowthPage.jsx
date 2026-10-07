import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import GrowthKpiGrid from '../../components/growth/GrowthKpiGrid';
import GrowthFocusCard from '../../components/growth/GrowthFocusCard';
import RoleReadinessCard from '../../components/growth/RoleReadinessCard';
import GrowthTimeline from '../../components/growth/GrowthTimeline';
import DevelopmentActivity from '../../components/growth/DevelopmentActivity';
import GrowthMethodology from '../../components/growth/GrowthMethodology';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  TrendingUp,
  Target,
  ArrowRight,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Award,
  Compass
} from 'lucide-react';
import {
  loadGrowthData,
  loadProjects,
  loadMilestones,
  calculateSkillProgress,
  calculateLearningProgress,
  calculateProjectEvidence,
  calculateMilestoneProgress,
  calculateDevelopmentProgress,
  calculateRoleReadiness,
  generateGrowthTimeline
} from '../../utils/growthIntelligence';
import { GROWTH_FOCUS_AREAS } from '../../data/growthData';

export default function ProfessionalGrowthPage() {
  const { data: onboardingData } = useOnboarding();
  const [growthState, setGrowthState] = useState(() => loadGrowthData());
  const [projects, setProjects] = useState(() => loadProjects());
  const [milestones, setMilestones] = useState(() => loadMilestones());

  useEffect(() => {
    setGrowthState(loadGrowthData());
    setProjects(loadProjects());
    setMilestones(loadMilestones());
  }, []);

  const targetRole = onboardingData?.targetRole || growthState?.targetRole || 'Backend Software Engineer';
  const skills = growthState?.skills || [];
  const learningCourses = growthState?.learningCourses || [];

  // Calculate Metrics
  const skillProgress = calculateSkillProgress(skills);
  const learningProgress = calculateLearningProgress(learningCourses);
  const projectEvidence = calculateProjectEvidence(projects);
  const milestoneProgress = calculateMilestoneProgress(milestones);
  const overallDevelopment = calculateDevelopmentProgress({
    skills,
    learningCourses,
    projects,
    milestones
  });
  const roleReadiness = calculateRoleReadiness({
    skills,
    projects,
    milestones,
    targetRole
  });

  const timelineActivities = generateGrowthTimeline({
    activities: growthState?.activities || [],
    projects,
    milestones
  });

  const kpis = {
    overallDevelopment,
    skillProgress,
    learningProgress,
    projectsCount: projectEvidence.completedProjects,
    milestonesCompleted: milestoneProgress.completed,
    milestonesTotal: milestoneProgress.total,
    roleReadiness
  };

  return (
    <DashboardLayout activeRoute="/dashboard/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm" className="gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Continuous Development
              </Badge>
              <span className="text-xs text-charcoal-muted">Target Role: <strong>{targetRole}</strong></span>
            </div>
            <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
              Professional Growth
            </h1>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Track skill development, learning progress, projects, milestones, and career readiness in one place.
            </p>
          </div>

          {/* Quick Nav Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/dashboard/growth/skills">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5" />
                Skills ({skills.length})
              </Button>
            </Link>
            <Link to="/dashboard/growth/learning">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                Learning
              </Button>
            </Link>
            <Link to="/dashboard/growth/projects">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <FolderGit2 className="w-3.5 h-3.5" />
                Projects ({projects.length})
              </Button>
            </Link>
            <Link to="/dashboard/growth/milestones">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Award className="w-3.5 h-3.5" />
                Milestones ({milestoneProgress.completed}/{milestoneProgress.total})
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Grid */}
        <GrowthKpiGrid kpis={kpis} />

        {/* Main Content Grid: Growth Focus & Role Readiness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Growth Focus */}
            <GrowthFocusCard focusAreas={GROWTH_FOCUS_AREAS} />

            {/* Quick Hub Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-warm-brown flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Learning Track
                    </span>
                    <Badge variant="neutral" size="sm">{learningCourses.length} Modules</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-warm-charcoal mb-1">
                    Structured Learning Activities
                  </h3>
                  <p className="text-xs text-charcoal-muted mb-4">
                    Progress through foundational courses, practical labs, and system design reading.
                  </p>
                </div>
                <Link to="/dashboard/growth/learning" className="inline-flex items-center gap-1 text-xs font-medium text-warm-brown hover:underline">
                  View Learning Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>

              <Card className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-warm-brown flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4" />
                      Portfolio Evidence
                    </span>
                    <Badge variant="success" size="sm">{projects.length} Projects</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-warm-charcoal mb-1">
                    Project & Experience Portfolio
                  </h3>
                  <p className="text-xs text-charcoal-muted mb-4">
                    Tangible evidence of technical capabilities demonstrated through completed initiatives.
                  </p>
                </div>
                <Link to="/dashboard/growth/projects" className="inline-flex items-center gap-1 text-xs font-medium text-warm-brown hover:underline">
                  Manage Project Portfolio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-5 border-charcoal-light/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-warm-charcoal flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-warm-brown" />
                  Recent Development Activity
                </h3>
                <Link to="/dashboard/growth/insights" className="text-xs text-warm-brown hover:underline flex items-center gap-1">
                  Growth Insights <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <DevelopmentActivity activities={growthState?.activities?.slice(0, 5) || []} />
            </Card>
          </div>

          {/* Right Column: Role Readiness & Growth Timeline */}
          <div className="space-y-6">
            <RoleReadinessCard
              targetRole={targetRole}
              roleReadiness={roleReadiness}
              skillProgress={skillProgress}
              projectsCount={projectEvidence.completedProjects}
            />

            <Card className="p-5 border-charcoal-light/10">
              <h3 className="text-sm font-semibold text-warm-charcoal mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-warm-brown" />
                Development Milestones
              </h3>
              <div className="space-y-3">
                {milestones.slice(0, 4).map((m) => (
                  <div key={m.id} className="flex items-start gap-2.5 text-xs p-2 rounded bg-warm-sand/20 border border-charcoal-light/5">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${m.status === 'completed' ? 'text-sage-dark' : 'text-charcoal-muted/50'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${m.status === 'completed' ? 'line-through text-charcoal-muted' : 'text-warm-charcoal'}`}>
                        {m.title}
                      </p>
                      <span className="text-[10px] text-charcoal-muted capitalize">{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/growth/milestones" className="mt-4 block text-center text-xs font-medium text-warm-brown hover:underline">
                View All Milestones ({milestones.length}) →
              </Link>
            </Card>

            <Card className="p-5 border-charcoal-light/10">
              <h3 className="text-sm font-semibold text-warm-charcoal mb-4">
                Growth Chronology
              </h3>
              <GrowthTimeline activities={timelineActivities.slice(0, 6)} />
            </Card>
          </div>
        </div>

        {/* Methodology and Disclaimer */}
        <GrowthMethodology />
        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
