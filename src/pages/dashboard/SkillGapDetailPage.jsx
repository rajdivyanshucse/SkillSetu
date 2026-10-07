import React from 'react';
import { ArrowLeft, GitBranch, Target, Layers, Compass } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { calculateSkillGaps } from '../../data/skillGapData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { SkillGapDetail } from '../../components/skill-gaps/SkillGapDetail';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SkillGapDetailPage = ({ skillId }) => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOnboarding();

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

  const targetRole =
    onboardingData?.goals?.targetRole ||
    onboardingData?.interests?.roles?.[0] ||
    'Backend Software Engineer';

  const gapAnalysis = calculateSkillGaps(userSkills, targetRole);

  const matchedSkill =
    gapAnalysis.allSkills.find(
      (s) => s.id === skillId || s.name.toLowerCase() === (skillId || '').toLowerCase()
    ) || gapAnalysis.allSkills[0];

  return (
    <DashboardLayout
      activeRoute="/dashboard/skill-gaps"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: 'Skill Gap Analysis', href: '/dashboard/skill-gaps' },
        { label: matchedSkill.name },
      ]}
    >
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/skill-gaps')}
            className="text-xs font-semibold text-charcoal-700"
          >
            Back to Skill Gap Overview
          </Button>
        </div>

        {/* Detailed Card View */}
        <Card className="shadow-subtle border-brand-200">
          <SkillGapDetail
            skill={matchedSkill}
            isDrawer={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SkillGapDetailPage;
