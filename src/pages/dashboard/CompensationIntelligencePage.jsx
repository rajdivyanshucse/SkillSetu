import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  DollarSign,
  Compass,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import {
  normalizedRoles,
  fictionalOpportunityRecords,
  experienceBands,
  locationBenchmarks,
  skillCompensationAssociations,
  compensationDistributionBuckets,
  STORAGE_KEY_COMPENSATION,
} from '../../data/compensationData';
import {
  calculateOpportunitySignals,
  generateCompensationInsights,
  getStoredCompensationPreferences,
  saveStoredCompensationPreferences,
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

export const CompensationIntelligencePage = () => {
  const { navigate } = useRouter();

  // Selected compare roles state with local storage persistence
  const [selectedCompareIds, setSelectedCompareIds] = useState(() => {
    const stored = getStoredCompensationPreferences();
    return stored?.compareIds || ['backend-software-engineer', 'data-engineer'];
  });

  const handleToggleCompare = (roleId) => {
    setSelectedCompareIds((prev) => {
      let next;
      if (prev.includes(roleId)) {
        next = prev.filter((id) => id !== roleId);
      } else {
        if (prev.length >= 4) {
          next = [...prev.slice(1), roleId];
        } else {
          next = [...prev, roleId];
        }
      }
      const existing = getStoredCompensationPreferences() || {};
      saveStoredCompensationPreferences({ ...existing, compareIds: next });
      return next;
    });
  };

  const kpiData = useMemo(() => {
    return calculateOpportunitySignals(fictionalOpportunityRecords);
  }, []);

  const insights = useMemo(() => {
    return generateCompensationInsights(fictionalOpportunityRecords);
  }, []);

  return (
    <DashboardLayout activeRoute="/dashboard/compensation">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Opportunity Intelligence
              </span>
              <Badge variant="brand" size="sm">
                Prototype Intelligence
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Compensation Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Explore advertised compensation patterns across roles, skills, experience levels, and locations.
            </p>
          </div>

          {/* Quick Sub-Navigation Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/roles')}
              className="text-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Role Catalog
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/skills')}
              className="text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skills
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/locations')}
              className="text-xs flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              Locations
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/compare')}
              className="text-xs flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare ({selectedCompareIds.length})
            </Button>
          </div>
        </div>

        {/* Visible Disclaimer */}
        <CompensationDisclaimer type="general" compact />

        {/* Executive KPI Grid */}
        <section aria-label="Compensation Summary Metrics">
          <CompensationKpiGrid kpiData={kpiData} />
        </section>

        {/* Role Compensation Catalog Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Role Compensation Archetypes
              </h2>
              <p className="text-xs text-charcoal-500">
                Advertised midpoint and typical range across normalized software engineering archetypes.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/roles')}
              className="text-xs text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              View Full Catalog ({normalizedRoles.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <RoleCompensationOverview
            roles={normalizedRoles}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            maxDisplay={6}
            showSearch={false}
          />
        </section>

        {/* Dual Grid: Distribution & Experience */}
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
                Skill-Associated Compensation Signals
              </h2>
              <p className="text-xs text-charcoal-500">
                Observational patterns linking specialized tech capabilities with advertised compensation bands.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/skills')}
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

        {/* Location & Remote Intelligence */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Metropolitan & Remote Intelligence
              </h2>
              <p className="text-xs text-charcoal-500">
                Advertised distributions across major Indian tech hubs and distributed arrangements.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/locations')}
              className="text-xs text-brand-700 hover:text-brand-900 flex items-center gap-1"
            >
              Explore Locations ({locationBenchmarks.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <LocationCompensation
            locations={locationBenchmarks.slice(0, 6)}
          />
        </section>

        {/* Deterministic Insights */}
        <CompensationInsights insights={insights} />

        {/* Methodology and Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="general" />
      </div>
    </DashboardLayout>
  );
};
