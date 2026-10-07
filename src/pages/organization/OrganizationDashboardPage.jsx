import React, { useState } from 'react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import {
  calculateWorkforceMetrics,
  generateSkillGapsList,
  generateActionSignals,
  generateWorkforceInsights,
} from '../../utils/workforceIntelligence';

// Workforce Components
import { WorkforceDashboardHeader } from '../../components/workforce/WorkforceDashboardHeader';
import { WorkforceKpiGrid } from '../../components/workforce/WorkforceKpiGrid';
import { WorkforceSnapshot } from '../../components/workforce/WorkforceSnapshot';
import { WorkforceSeniority } from '../../components/workforce/WorkforceSeniority';
import { SkillCoverageOverview } from '../../components/workforce/SkillCoverageOverview';
import { WorkforceSkillGaps } from '../../components/workforce/WorkforceSkillGaps';
import { FutureSkillSignals } from '../../components/workforce/FutureSkillSignals';
import { DevelopmentPriorities } from '../../components/workforce/DevelopmentPriorities';
import { WorkforceActionSignals } from '../../components/workforce/WorkforceActionSignals';
import { WorkforceInsights } from '../../components/workforce/WorkforceInsights';
import { WorkforceMethodology } from '../../components/workforce/WorkforceMethodology';
import { SkillDetailDrawer } from '../../components/workforce/SkillDetailDrawer';

export const OrganizationDashboardPage = () => {
  const { data: onboardingData } = useOrganizationOnboarding();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Merge onboarding context with default mock organization data fallback
  const effectiveOrgData = {
    ...mockOrganizationProfile,
    ...onboardingData,
    company: {
      ...mockOrganizationProfile.company,
      ...(onboardingData.company || {}),
    },
    workforce: {
      ...mockOrganizationProfile.workforce,
      ...(onboardingData.workforce || {}),
    },
    currentSkills: (onboardingData.currentSkills && onboardingData.currentSkills.length > 0)
      ? onboardingData.currentSkills
      : mockOrganizationProfile.currentSkills,
    futureSkills: (onboardingData.futureSkills && onboardingData.futureSkills.length > 0)
      ? onboardingData.futureSkills
      : mockOrganizationProfile.futureSkills,
    strategicPriorities: (onboardingData.strategicPriorities && onboardingData.strategicPriorities.length > 0)
      ? onboardingData.strategicPriorities
      : mockOrganizationProfile.strategicPriorities,
  };

  // Compute deterministic intelligence metrics
  const metrics = calculateWorkforceMetrics(effectiveOrgData);
  const skillGaps = generateSkillGapsList(effectiveOrgData);
  const actionSignals = generateActionSignals(effectiveOrgData);
  const insights = generateWorkforceInsights(effectiveOrgData);

  const handleOpenSkill = (skillName) => {
    setSelectedSkill(skillName);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedSkill(null);
  };

  return (
    <OrganizationLayout activeRoute="/organization/dashboard">
      <div className="space-y-6 pb-12">
        {/* Header */}
        <WorkforceDashboardHeader
          companyName={effectiveOrgData.company?.name || 'TechNova Solutions'}
          industry={effectiveOrgData.company?.industry || 'Technology & Software'}
          employeeCount={effectiveOrgData.workforce?.totalEmployees || 287}
          locations={effectiveOrgData.company?.locations || ['Bengaluru', 'Hyderabad', 'Remote']}
        />

        {/* Executive KPI Summary */}
        <WorkforceKpiGrid metrics={metrics} />

        {/* Workforce Composition Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <WorkforceSnapshot
              totalHeadcount={effectiveOrgData.workforce?.totalEmployees || 287}
              departments={effectiveOrgData.workforce?.departments || {}}
            />
          </div>
          <div className="lg:col-span-5">
            <WorkforceSeniority
              totalHeadcount={effectiveOrgData.workforce?.totalEmployees || 287}
              seniority={effectiveOrgData.workforce?.seniority || {}}
            />
          </div>
        </div>

        {/* Skill Coverage & Gaps Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <SkillCoverageOverview
              skills={effectiveOrgData.currentSkills}
              onSelectSkill={handleOpenSkill}
            />
          </div>
          <div className="lg:col-span-6">
            <WorkforceSkillGaps
              gaps={skillGaps}
              onSelectSkill={handleOpenSkill}
              maxDisplay={4}
            />
          </div>
        </div>

        {/* Future Skills & Strategic Vectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <FutureSkillSignals
              futureSkills={effectiveOrgData.futureSkills}
              onSelectSkill={handleOpenSkill}
            />
          </div>
          <div className="lg:col-span-6">
            <DevelopmentPriorities
              strategicPriorities={effectiveOrgData.strategicPriorities}
              hiringPlan={effectiveOrgData.workforce?.hiringPlan}
            />
          </div>
        </div>

        {/* Decision Support Matrix: Action Signals */}
        <WorkforceActionSignals
          actionSignals={actionSignals}
          onSelectSkill={handleOpenSkill}
        />

        {/* Deterministic Insights */}
        <WorkforceInsights insights={insights} />

        {/* Methodology & Disclaimer */}
        <WorkforceMethodology />
      </div>

      {/* Skill Detail Slide-out Drawer */}
      <SkillDetailDrawer
        skillName={selectedSkill}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        orgData={effectiveOrgData}
      />
    </OrganizationLayout>
  );
};

export default OrganizationDashboardPage;
