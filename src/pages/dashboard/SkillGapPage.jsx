import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { calculateSkillGaps } from '../../data/skillGapData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SkillGapHeader } from '../../components/skill-gaps/SkillGapHeader';
import { GapOverview } from '../../components/skill-gaps/GapOverview';
import { AlignmentMeter } from '../../components/skill-gaps/AlignmentMeter';
import { PriorityGapCard } from '../../components/skill-gaps/PriorityGapCard';
import { SkillRequirementList } from '../../components/skill-gaps/SkillRequirementList';
import { SkillGapDistribution } from '../../components/skill-gaps/SkillGapDistribution';
import { GapReasonCard } from '../../components/skill-gaps/GapReasonCard';
import { SkillGapDetail } from '../../components/skill-gaps/SkillGapDetail';
import { FocusAreaCard } from '../../components/skill-gaps/FocusAreaCard';
import { GapMethodology } from '../../components/skill-gaps/GapMethodology';
import { DashboardEmptyState } from '../../components/dashboard/DashboardEmptyState';
import Drawer from '../../components/ui/Drawer';

export const SkillGapPage = () => {
  const { data: onboardingData, calculateCompleteness } = useOnboarding();

  const fallbackSkills = [
    { name: 'Java', proficiency: 'Advanced' },
    { name: 'SQL', proficiency: 'Intermediate' },
    { name: 'Spring Boot', proficiency: 'Intermediate' },
    { name: 'JavaScript', proficiency: 'Intermediate' },
    { name: 'React', proficiency: 'Beginner' },
    { name: 'AWS', proficiency: 'Beginner' },
    { name: 'Docker', proficiency: 'Beginner' },
  ];

  const userSkills =
    onboardingData?.skills && onboardingData.skills.length > 0
      ? onboardingData.skills
      : fallbackSkills;

  const defaultRole =
    onboardingData?.goals?.targetRole ||
    onboardingData?.interests?.roles?.[0] ||
    'Backend Software Engineer';

  const [targetRole, setTargetRole] = useState(defaultRole);
  const [selectedSkillForDrawer, setSelectedSkillForDrawer] = useState(null);

  const completeness = calculateCompleteness ? calculateCompleteness() : 92;

  // Compute live deterministic skill gaps
  const gapAnalysis = calculateSkillGaps(userSkills, targetRole);

  const availableRoles = [
    'Backend Software Engineer',
    'Software Engineer',
    'Full Stack Developer',
  ];

  return (
    <DashboardLayout
      activeRoute="/dashboard/skill-gaps"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: 'Skill Gap Analysis' },
      ]}
    >
      <div className="space-y-6">
        {/* SECTION 1 — Page Header */}
        <section aria-label="Skill Gap Header">
          <SkillGapHeader
            targetRole={targetRole}
            onRoleChange={setTargetRole}
            availableRoles={availableRoles}
            completeness={completeness}
          />
        </section>

        {/* SECTION 2 — Gap Overview KPIs */}
        <section aria-label="Gap Overview Summary">
          <GapOverview
            skillsAssessed={gapAnalysis.skillsAssessedCount}
            skillsAligned={gapAnalysis.skillsAlignedCount}
            priorityGaps={gapAnalysis.priorityGapsCount}
            averageGap={gapAnalysis.averageGap}
          />
        </section>

        {/* SECTION 3 & SECTION 6 — Overall Alignment & Gap Distribution */}
        <section
          aria-label="Alignment and Distribution"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <AlignmentMeter
              alignmentScore={gapAnalysis.overallAlignment}
              targetRole={targetRole}
              alignedSkills={gapAnalysis.alignedSkills}
              developingSkills={gapAnalysis.developingSkills}
              priorityGaps={gapAnalysis.priorityGaps}
              className="h-full"
            />
          </div>
          <div className="lg:col-span-1">
            <SkillGapDistribution
              distribution={gapAnalysis.distribution}
              totalSkills={gapAnalysis.skillsAssessedCount}
              className="h-full"
            />
          </div>
        </section>

        {/* SECTION 4 — Prioritized Skill Gaps */}
        <section aria-label="Prioritized Skill Gaps">
          <PriorityGapCard
            priorityGaps={gapAnalysis.priorityGaps}
            onSelectSkill={(skill) => setSelectedSkillForDrawer(skill)}
          />
        </section>

        {/* SECTION 5 — Role Requirement Breakdown (Full Matrix) */}
        <section aria-label="Role Requirement Breakdown">
          <SkillRequirementList
            skills={gapAnalysis.allSkills}
            onSelectSkill={(skill) => setSelectedSkillForDrawer(skill)}
          />
        </section>

        {/* SECTION 7 & SECTION 9 — Why Gaps Matter & Recommended Focus */}
        <section
          aria-label="Why Gaps Matter and Recommended Focus"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <GapReasonCard
            prioritySkills={gapAnalysis.priorityGaps.slice(0, 4)}
            onSelectSkill={(skill) => setSelectedSkillForDrawer(skill)}
          />
          <FocusAreaCard focusAreas={gapAnalysis.focusAreas} />
        </section>

        {/* SECTION 10 — Methodology & Transparency */}
        <section aria-label="Intelligence Methodology">
          <GapMethodology methodology={gapAnalysis.methodology} />
        </section>
      </div>

      {/* SECTION 8 — Interactive Skill Detail Drawer */}
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

export default SkillGapPage;
