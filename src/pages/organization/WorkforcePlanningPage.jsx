import React, { useState, useMemo } from 'react';
import { Sparkles, Sliders, ArrowRight, Layers, Compass, Clock, Building2, Bookmark, TrendingUp } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import {
  defaultPlanningScenarios,
  getPlanningScenarioById,
  planningHorizons,
  STORAGE_KEY_WORKFORCE_PLANNING,
} from '../../data/workforcePlanningData';
import {
  calculateScenarioMetrics,
  calculateDepartmentProjections,
  generateWorkforcePlanningInsights,
} from '../../utils/workforcePlanning';

// Components
import { PlanningHeader } from '../../components/workforce-planning/PlanningHeader';
import { PlanningKpiGrid } from '../../components/workforce-planning/PlanningKpiGrid';
import { CurrentWorkforceBaseline } from '../../components/workforce-planning/CurrentWorkforceBaseline';
import { FutureWorkforceDemand } from '../../components/workforce-planning/FutureWorkforceDemand';
import { CapabilityGapTable } from '../../components/workforce-planning/CapabilityGapTable';
import { ActionMixPanel } from '../../components/workforce-planning/ActionMixPanel';
import { DepartmentPlanning } from '../../components/workforce-planning/DepartmentPlanning';
import { PlanningInsights } from '../../components/workforce-planning/PlanningInsights';
import { ScenarioAssumptions } from '../../components/workforce-planning/ScenarioAssumptions';
import { PlanningMethodology } from '../../components/workforce-planning/PlanningMethodology';
import { ScenarioConfigurator } from '../../components/workforce-planning/ScenarioConfigurator';
import { Button } from '../../components/ui/Button';

export const WorkforcePlanningPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOrganizationOnboarding();

  // Merge context data with default mock organization fallback
  const effectiveOrgData = useMemo(() => ({
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
  }), [onboardingData]);

  // Stored Planning State
  const [storedConfig, setStoredConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFORCE_PLANNING);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeScenarioId, setActiveScenarioId] = useState(
    storedConfig?.activeScenarioId || defaultPlanningScenarios[0].id
  );

  const [horizonMonths, setHorizonMonths] = useState(
    storedConfig?.horizonMonths || 24
  );

  const [configuratorOpen, setConfiguratorOpen] = useState(false);

  // Active Scenario Object (incorporating customized config if present)
  const activeScenario = useMemo(() => {
    const base = getPlanningScenarioById(activeScenarioId);
    if (storedConfig?.customScenarios && storedConfig.customScenarios[activeScenarioId]) {
      return {
        ...base,
        ...storedConfig.customScenarios[activeScenarioId],
      };
    }
    return base;
  }, [activeScenarioId, storedConfig]);

  // Derived Metrics & Calculations
  const scenarioMetrics = useMemo(() => {
    return calculateScenarioMetrics(activeScenario, horizonMonths, effectiveOrgData);
  }, [activeScenario, horizonMonths, effectiveOrgData]);

  const departmentProjections = useMemo(() => {
    return calculateDepartmentProjections(activeScenario, horizonMonths, effectiveOrgData);
  }, [activeScenario, horizonMonths, effectiveOrgData]);

  const insights = useMemo(() => {
    return generateWorkforcePlanningInsights(activeScenario, scenarioMetrics);
  }, [activeScenario, scenarioMetrics]);

  // Handlers
  const handleHorizonChange = (months) => {
    setHorizonMonths(months);
    const updated = {
      ...(storedConfig || {}),
      activeScenarioId,
      horizonMonths: months,
    };
    try {
      localStorage.setItem(STORAGE_KEY_WORKFORCE_PLANNING, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save horizon to localStorage:', e);
    }
    setStoredConfig(updated);
  };

  const handleSaveConfiguration = (customizedScenario) => {
    const updated = {
      ...(storedConfig || {}),
      activeScenarioId: customizedScenario.id,
      horizonMonths: customizedScenario.horizonMonths || horizonMonths,
      customScenarios: {
        ...(storedConfig?.customScenarios || {}),
        [customizedScenario.id]: customizedScenario,
      },
    };
    try {
      localStorage.setItem(STORAGE_KEY_WORKFORCE_PLANNING, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save configuration to localStorage:', e);
    }
    setStoredConfig(updated);
  };

  return (
    <OrganizationLayout activeRoute="/organization/planning">
      <div className="space-y-6 pb-12">
        {/* Planning Header */}
        <PlanningHeader
          companyName={effectiveOrgData.company?.name || 'TechNova Solutions'}
          selectedScenario={activeScenario}
          selectedHorizonMonths={horizonMonths}
          onHorizonChange={handleHorizonChange}
          onOpenConfigurator={() => setConfiguratorOpen(true)}
        />

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none border-b border-surface-border">
          <button
            type="button"
            className="px-4 py-2 border-b-2 border-brand-600 text-brand-800 font-bold whitespace-nowrap"
          >
            Planning Overview
          </button>
          <button
            type="button"
            onClick={() => navigate('/organization/planning/skills')}
            className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 whitespace-nowrap cursor-pointer"
          >
            Future Skill Demand
          </button>
          <button
            type="button"
            onClick={() => navigate('/organization/planning/scenarios')}
            className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 whitespace-nowrap cursor-pointer"
          >
            Scenario Library & Comparison
          </button>
          <button
            type="button"
            onClick={() => navigate('/organization/planning/roadmap')}
            className="px-4 py-2 text-charcoal-600 hover:text-charcoal-900 whitespace-nowrap cursor-pointer"
          >
            Workforce Roadmap
          </button>
        </div>

        {/* Executive KPI Summary */}
        <PlanningKpiGrid
          metrics={scenarioMetrics}
          scenarioName={activeScenario.name}
        />

        {/* 2-Column Baseline & Demand Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <CurrentWorkforceBaseline
              headcount={scenarioMetrics.currentHeadcount}
              departments={effectiveOrgData.workforce?.departments || {}}
              seniority={effectiveOrgData.workforce?.seniority || {}}
              avgCoverage={64}
            />
          </div>
          <div className="lg:col-span-6">
            <FutureWorkforceDemand
              capabilities={scenarioMetrics.capabilities}
              scenarioName={activeScenario.name}
            />
          </div>
        </div>

        {/* Capability Gap Matrix */}
        <CapabilityGapTable
          capabilities={scenarioMetrics.capabilities}
        />

        {/* Compensation Signal Integration Banner */}
        <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                Advertised Compensation Signals for Capability Gaps
              </h3>
            </div>
            <p className="text-xs text-charcoal-600">
              External hiring actions for identified capability gaps (e.g., Cloud: 16 gap units, Data: 14 gap units) correlate with prototype advertised compensation patterns of ₹9.0–18.5 LPA.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/organization/compensation')}
            className="text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Explore Compensation Intelligence
          </Button>
        </div>

        {/* Action Mix Panel */}
        <ActionMixPanel
          actionMix={activeScenario.defaultActionMix}
          totalGap={scenarioMetrics.totalCapacityGap}
        />

        {/* Department Planning Breakdown */}
        <DepartmentPlanning
          departmentProjections={departmentProjections}
          scenarioName={activeScenario.name}
        />

        {/* Planning Insights */}
        <PlanningInsights insights={insights} />

        {/* Configured Assumptions */}
        <ScenarioAssumptions
          scenario={activeScenario}
          horizonMonths={horizonMonths}
          headcount={scenarioMetrics.currentHeadcount}
        />

        {/* Methodology */}
        <PlanningMethodology />
      </div>

      {/* Scenario Configurator Modal */}
      <ScenarioConfigurator
        isOpen={configuratorOpen}
        onClose={() => setConfiguratorOpen(false)}
        currentScenario={activeScenario}
        onSaveConfiguration={handleSaveConfiguration}
      />
    </OrganizationLayout>
  );
};

export default WorkforcePlanningPage;
