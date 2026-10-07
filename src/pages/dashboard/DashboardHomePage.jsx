import React from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { getMergedDashboardData } from '../../data/dashboardData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { CareerSnapshot } from '../../components/dashboard/CareerSnapshot';
import { CareerFitCard } from '../../components/dashboard/CareerFitCard';
import { SkillCoverageCard } from '../../components/dashboard/SkillCoverageCard';
import { SkillGapPreview } from '../../components/dashboard/SkillGapPreview';
import { MarketSignals } from '../../components/dashboard/MarketSignals';
import { NextActions } from '../../components/dashboard/NextActions';
import { ProfileSummaryCard } from '../../components/dashboard/ProfileSummaryCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { IntelligenceExplainer } from '../../components/dashboard/IntelligenceExplainer';
import { DashboardEmptyState } from '../../components/dashboard/DashboardEmptyState';

export const DashboardHomePage = () => {
  const { data: onboardingData, calculateCompleteness } = useOnboarding();

  const completeness = calculateCompleteness ? calculateCompleteness() : 92;
  const dashboardData = getMergedDashboardData(onboardingData, completeness);

  // If user has zero data and completeness is very low (e.g. wiped or empty), show empty state
  const isCompletelyEmpty =
    !onboardingData?.profile?.fullName &&
    (!onboardingData?.skills || onboardingData.skills.length === 0) &&
    completeness < 20;

  if (isCompletelyEmpty) {
    return (
      <DashboardLayout
        activeRoute="/dashboard"
        breadcrumbItems={[{ label: 'Individual Workspace' }, { label: 'Dashboard' }]}
      >
        <DashboardEmptyState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeRoute="/dashboard"
      breadcrumbItems={[{ label: 'Individual Workspace' }, { label: 'Dashboard Overview' }]}
    >
      <div className="space-y-6">
        {/* Dashboard Header */}
        <DashboardHeader
          userName={dashboardData.profile.fullName}
          targetRole={dashboardData.profile.targetRole}
          completeness={dashboardData.profile.completeness}
        />

        {/* SECTION 1 — Career Snapshot KPI Cards */}
        <section aria-label="Career Snapshot KPIs">
          <CareerSnapshot kpiStats={dashboardData.kpiStats} />
        </section>

        {/* SECTION 2 & SECTION 3 — Career Fit & Skill Coverage Grid */}
        <section
          aria-label="Career Fit and Skill Coverage"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <CareerFitCard careerFit={dashboardData.careerFit} />
          <SkillCoverageCard skillCoverage={dashboardData.skillCoverage} />
        </section>

        {/* SECTION 4 & SECTION 5 — Priority Skill Gaps & Market Signals */}
        <section
          aria-label="Skill Gaps and Market Signals"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <SkillGapPreview skillGaps={dashboardData.skillGaps} />
          <MarketSignals marketSignals={dashboardData.marketSignals} />
        </section>

        {/* SECTION 6 & SECTION 7 — Recommended Next Steps & Profile Summary */}
        <section
          aria-label="Recommendations and Profile Summary"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <NextActions
            recommendations={dashboardData.recommendations}
            completeness={dashboardData.profile.completeness}
          />
          <ProfileSummaryCard
            profile={dashboardData.profile}
            skills={dashboardData.skills}
          />
        </section>

        {/* SECTION 8 & SECTION 9 — Recent Activity & Intelligence Explainer */}
        <section
          aria-label="Recent Activity and Intelligence Explainer"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <RecentActivity activity={dashboardData.recentActivity} className="h-full" />
          </div>
          <div className="lg:col-span-2">
            <IntelligenceExplainer
              explainer={dashboardData.intelligenceExplainer}
              className="h-full"
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
