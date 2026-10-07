import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  CalendarCheck,
  Briefcase,
  Info,
} from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import {
  normalizedRoles,
  fictionalOpportunityRecords,
  experienceBands,
  locationBenchmarks,
  skillCompensationAssociations,
  compensationDistributionBuckets,
} from '../../data/compensationData';
import {
  calculateOpportunitySignals,
  generateCompensationInsights,
} from '../../utils/compensationIntelligence';

// Components
import { CompensationKpiGrid } from '../../components/compensation/CompensationKpiGrid';
import { RoleCompensationOverview } from '../../components/compensation/RoleCompensationOverview';
import { CompensationDistribution } from '../../components/compensation/CompensationDistribution';
import { ExperienceCompensationChart } from '../../components/compensation/ExperienceCompensationChart';
import { SkillCompensationSignals } from '../../components/compensation/SkillCompensationSignals';
import { LocationCompensation } from '../../components/compensation/LocationCompensation';
import { CompensationInsights } from '../../components/compensation/CompensationInsights';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const OrganizationCompensationPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOrganizationOnboarding();
  const orgName = onboardingData?.company?.name || mockOrganizationProfile.name;

  const kpiData = useMemo(() => {
    return calculateOpportunitySignals(fictionalOpportunityRecords);
  }, []);

  const insights = useMemo(() => {
    return generateCompensationInsights(fictionalOpportunityRecords);
  }, []);

  return (
    <OrganizationLayout activeRoute="/organization/compensation">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Workforce Intelligence
              </span>
              <Badge variant="brand" size="sm">
                Prototype Compensation Layer
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Compensation Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Explore role-level advertised compensation patterns and skill-associated opportunity signals to support workforce planning for <strong>{orgName}</strong>.
            </p>
          </div>

          {/* Quick Sub-navigation Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/compensation/roles')}
              className="text-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Role Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/compensation/skills')}
              className="text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skill Analysis
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/organization/planning')}
              className="text-xs flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Workforce Planning
            </Button>
          </div>
        </div>

        {/* Visible Disclaimer */}
        <CompensationDisclaimer type="organizationPlanning" compact />

        {/* Executive KPI Grid */}
        <section aria-label="Organization Compensation Summary Metrics">
          <CompensationKpiGrid kpiData={kpiData} />
        </section>

        {/* Workforce Planning Connection Banner */}
        <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-charcoal-900">
                Connected with Workforce Planning & Headcount Modeling
              </h3>
            </div>
            <p className="text-xs text-charcoal-600 max-w-2xl leading-relaxed">
              Capability gaps identified in Workforce Planning (e.g. Cloud Engineering, Data Engineering) correlate with observed advertised opportunity compensation ranges in the prototype catalog.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/talent')}
              className="text-xs flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Explore Talent Pools
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/organization/planning')}
              className="text-xs flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              View Planning Gaps
            </Button>
          </div>
        </div>

        {/* Role Compensation Overview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Department & Role Compensation Benchmarks
              </h2>
              <p className="text-xs text-charcoal-500">
                Advertised compensation spans across key engineering, data, and product capability areas.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/organization/compensation/roles')}
              className="text-xs text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              View Full Table ({normalizedRoles.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <RoleCompensationOverview
            roles={normalizedRoles}
            maxDisplay={6}
            showSearch={false}
          />
        </section>

        {/* Dual Visualizations: Distribution & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompensationDistribution buckets={compensationDistributionBuckets} />
          <ExperienceCompensationChart bands={experienceBands} />
        </div>

        {/* Skill-Associated Compensation Signals */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Skill-Associated Opportunity Signals
              </h2>
              <p className="text-xs text-charcoal-500">
                Opportunity volume and advertised compensation associations for critical technical competencies.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/organization/compensation/skills')}
              className="text-xs text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              View All Skills ({skillCompensationAssociations.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <SkillCompensationSignals
            skills={skillCompensationAssociations.slice(0, 6)}
          />
        </section>

        {/* Location Intelligence */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Geographic & Remote Compensation Patterns
              </h2>
              <p className="text-xs text-charcoal-500">
                Observational spreads across major tech corridors and distributed work arrangements.
              </p>
            </div>
          </div>

          <LocationCompensation
            locations={locationBenchmarks}
          />
        </section>

        {/* Deterministic Insights */}
        <CompensationInsights insights={insights} />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="organizationPlanning" />
      </div>
    </OrganizationLayout>
  );
};
