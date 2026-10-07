import React, { useMemo } from 'react';
import {
  BookOpen,
  Users,
  Layers,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  ExternalLink,
  Building2,
  Sparkles
} from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import OrganizationLearningKpiGrid from '../../components/learning/OrganizationLearningKpiGrid';
import OrganizationLearningPrograms from '../../components/learning/OrganizationLearningPrograms';
import OrganizationLearningCapabilities from '../../components/learning/OrganizationLearningCapabilities';
import OrganizationLearningInsights from '../../components/learning/OrganizationLearningInsights';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import { initialOrganizationPrograms, initialOrganizationCapabilities } from '../../data/learningData';

export const OrganizationLearningPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOrganizationOnboarding();

  const effectiveOrgData = useMemo(() => ({
    ...mockOrganizationProfile,
    ...onboardingData,
    company: {
      ...mockOrganizationProfile.company,
      ...(onboardingData.company || {})
    }
  }), [onboardingData]);

  return (
    <OrganizationLayout activeRoute="/organization/learning">
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100/80 text-amber-900">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Learning & Capability Development
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                Workforce Intelligence
              </Badge>
            </div>
            <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
              Connect workforce capability gaps with structured development programs and learning priorities for {effectiveOrgData.company.name || 'your organization'}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/planning')}
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
              Workforce Planning
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/talent')}
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Talent Discovery
            </Button>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <OrganizationLearningKpiGrid />

        {/* Quick Program Navigation Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800 text-white flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                  Active Programs
                </Badge>
                <span className="text-xs text-stone-400 font-mono">
                  {initialOrganizationPrograms.length} In Flight
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-white">
                Enterprise Upskilling Programs
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Structured internal development curricula designed to close high-priority capacity gaps in cloud, backend modernization, and AI engineering.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-700/60 flex items-center justify-between">
              <span className="text-xs text-stone-400">Total Enrolled: 184 cohort members</span>
              <Button
                size="sm"
                variant="primary"
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs"
                onClick={() => navigate('/organization/learning/programs')}
              >
                View All Programs
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          <Card className="p-5 border-stone-200 bg-white flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">
                  Capability Matrix
                </Badge>
                <span className="text-xs text-stone-500 font-mono">
                  {initialOrganizationCapabilities.length} Core Areas
                </span>
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Workforce Capability Coverage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Compare baseline coverage against future target coverage to calculate net capability deficits and determine optimal Buy vs. Build intervention mix.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-500">Planning Link: Workforce Planning Scenarios</span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => navigate('/organization/learning/capabilities')}
              >
                Inspect Capability Coverage
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Active Programs Section Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Workforce Development Programs
              </h3>
              <p className="text-xs text-stone-500">
                Active enterprise cohorts closing strategic workforce capability gaps.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/learning/programs')}
            >
              Full Programs View
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <OrganizationLearningPrograms limit={3} />
        </div>

        {/* Capability Matrix Section Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Capability Gap vs. Learning Coverage
              </h3>
              <p className="text-xs text-stone-500">
                Strategic alignment between target readiness and active upskilling volume.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/learning/capabilities')}
            >
              Full Matrix View
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
          <OrganizationLearningCapabilities />
        </div>

        {/* Aggregate Insights */}
        <OrganizationLearningInsights />

        {/* Methodology & Disclaimer */}
        <div className="space-y-6 pt-6">
          <LearningMethodology />
          <LearningDisclaimer />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationLearningPage;
