import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import {
  defaultRoadmapStages,
  projectRecommendations,
  roleReadinessAreas,
  completedMilestonesInferred,
  getStoredRoadmapProgress,
  saveRoadmapProgress,
  calculateRoadmapMetrics,
} from '../../data/roadmapData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { RoadmapHeader } from '../../components/roadmap/RoadmapHeader';
import { RoadmapSummary } from '../../components/roadmap/RoadmapSummary';
import { RoadmapTimeline } from '../../components/roadmap/RoadmapTimeline';
import { CurrentFocusCard } from '../../components/roadmap/CurrentFocusCard';
import { DevelopmentPlan } from '../../components/roadmap/DevelopmentPlan';
import { RoadmapProgress } from '../../components/roadmap/RoadmapProgress';
import { CompletedDevelopment } from '../../components/roadmap/CompletedDevelopment';
import { UpcomingDevelopment } from '../../components/roadmap/UpcomingDevelopment';
import { ProjectRecommendation } from '../../components/roadmap/ProjectRecommendation';
import { RoleReadiness } from '../../components/roadmap/RoleReadiness';
import Drawer from '../../components/ui/Drawer';
import { SkillGapDetail } from '../../components/skill-gaps/SkillGapDetail';

export const CareerRoadmapPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData, calculateCompleteness } = useOnboarding();

  const defaultRole =
    onboardingData?.goals?.targetRole ||
    onboardingData?.interests?.roles?.[0] ||
    'Backend Software Engineer';

  const [targetRole, setTargetRole] = useState(defaultRole);
  const [storedProgress, setStoredProgress] = useState(() => getStoredRoadmapProgress());
  const [selectedSkillForDrawer, setSelectedSkillForDrawer] = useState(null);

  // Recalculate metrics whenever storedProgress or defaultRoadmapStages changes
  const { stages, overallRoadmapProgress, currentFocusSkill } = calculateRoadmapMetrics(
    defaultRoadmapStages,
    storedProgress
  );

  const [activePlanSkill, setActivePlanSkill] = useState(currentFocusSkill || stages[2]?.skills[0]);

  // Keep active plan skill in sync
  useEffect(() => {
    if (currentFocusSkill && !activePlanSkill) {
      setActivePlanSkill(currentFocusSkill);
    }
  }, [currentFocusSkill]);

  const handleToggleActivity = (activityId, isCompleted) => {
    const nextState = {
      ...storedProgress,
      [activityId]: isCompleted,
    };
    setStoredProgress(nextState);
    saveRoadmapProgress(nextState);
  };

  const handleSelectSkill = (skill) => {
    setActivePlanSkill(skill);
    // On desktop, scroll smoothly to development plan, or open drawer
    if (window.innerWidth < 768) {
      setSelectedSkillForDrawer(skill);
    } else {
      const planElement = document.getElementById('development-plan-section');
      if (planElement) {
        planElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleOpenStage = (stageId) => {
    navigate(`/dashboard/career-roadmap/${stageId}`);
  };

  const availableRoles = [
    'Backend Software Engineer',
    'Software Engineer',
    'Full Stack Developer',
  ];

  // Upcoming skills from stage 03 & 04
  const upcomingSkills = stages
    .flatMap((s) => s.skills)
    .filter((s) => s.status === 'Upcoming' || s.status === 'Next')
    .slice(0, 4);

  return (
    <DashboardLayout
      activeRoute="/dashboard/career-roadmap"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: 'Career Roadmap' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <section aria-label="Roadmap Header">
          <RoadmapHeader
            targetRole={targetRole}
            overallProgress={overallRoadmapProgress}
            currentFocusSkill={currentFocusSkill?.name || 'AWS Cloud Fundamentals'}
            onRoleChange={setTargetRole}
            availableRoles={availableRoles}
          />
        </section>

        {/* SECTION 1 — Roadmap Summary KPIs */}
        <section aria-label="Roadmap Summary">
          <RoadmapSummary
            targetRole={targetRole}
            currentAlignment={72}
            roadmapProgress={overallRoadmapProgress}
            activeSkillName={currentFocusSkill?.name || 'AWS'}
            priorityAreasCount={4}
          />
        </section>

        {/* SECTION 3 — Current Focus Highlight */}
        <section aria-label="Current Focus">
          <CurrentFocusCard
            focusSkill={currentFocusSkill}
            onContinue={(skill) => {
              setActivePlanSkill(skill);
              const el = document.getElementById('development-plan-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* SECTION 4 — Interactive Development Plan (Learn, Practice, Build, Validate) */}
        <section id="development-plan-section" aria-label="Interactive Development Plan">
          <DevelopmentPlan
            skill={activePlanSkill || currentFocusSkill}
            onToggleActivity={handleToggleActivity}
          />
        </section>

        {/* SECTION 2 — Career Roadmap Timeline */}
        <section aria-label="Roadmap Timeline">
          <RoadmapTimeline
            stages={stages}
            onSelectSkill={handleSelectSkill}
            onOpenStage={handleOpenStage}
          />
        </section>

        {/* SECTION 5 & SECTION 6 — Progress Breakdown & Completed Milestones */}
        <section
          aria-label="Progress and Completed Milestones"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <RoadmapProgress
            overallProgress={overallRoadmapProgress}
            stages={stages}
          />
          <CompletedDevelopment milestones={completedMilestonesInferred} />
        </section>

        {/* SECTION 7 & SECTION 8 — Upcoming Development & Practical Projects */}
        <section aria-label="Upcoming Pipeline and Practical Projects" className="space-y-6">
          <UpcomingDevelopment
            upcomingSkills={upcomingSkills}
            onSelectSkill={handleSelectSkill}
          />
          <ProjectRecommendation projects={projectRecommendations} />
        </section>

        {/* SECTION 9 — Role Readiness */}
        <section aria-label="Role Readiness">
          <RoleReadiness readinessAreas={roleReadinessAreas} />
        </section>
      </div>

      {/* Detail Drawer for Mobile */}
      <Drawer
        isOpen={Boolean(selectedSkillForDrawer)}
        onClose={() => setSelectedSkillForDrawer(null)}
        position="right"
        size="md"
        className="p-0 bg-surface overflow-y-auto"
      >
        {selectedSkillForDrawer && (
          <SkillGapDetail
            skill={selectedSkillForDrawer}
            onClose={() => setSelectedSkillForDrawer(null)}
            isDrawer={true}
          />
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default CareerRoadmapPage;
