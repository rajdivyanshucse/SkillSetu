import React, { useMemo, useState } from 'react';
import { ArrowLeft, Sliders, Check, Clock, TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import {
  getPlanningScenarioById,
  STORAGE_KEY_WORKFORCE_PLANNING,
} from '../../data/workforcePlanningData';
import {
  calculateScenarioMetrics,
  calculateDepartmentProjections,
  generateWorkforcePlanningInsights,
} from '../../utils/workforcePlanning';
import { PlanningKpiGrid } from '../../components/workforce-planning/PlanningKpiGrid';
import { FutureWorkforceDemand } from '../../components/workforce-planning/FutureWorkforceDemand';
import { CapabilityGapTable } from '../../components/workforce-planning/CapabilityGapTable';
import { ActionMixPanel } from '../../components/workforce-planning/ActionMixPanel';
import { DepartmentPlanning } from '../../components/workforce-planning/DepartmentPlanning';
import { PlanningInsights } from '../../components/workforce-planning/PlanningInsights';
import { ScenarioAssumptions } from '../../components/workforce-planning/ScenarioAssumptions';
import { PlanningMethodology } from '../../components/workforce-planning/PlanningMethodology';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const WorkforceScenarioDetailPage = ({ scenarioId }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data: onboardingData } = useOrganizationOnboarding();

  const scenario = useMemo(() => getPlanningScenarioById(scenarioId), [scenarioId]);

  const effectiveOrgData = useMemo(() => ({
    ...mockOrganizationProfile,
    ...onboardingData,
  }), [onboardingData]);

  const metrics = useMemo(() => {
    return calculateScenarioMetrics(scenario, scenario.horizonMonths || 24, effectiveOrgData);
  }, [scenario, effectiveOrgData]);

  const departmentProjections = useMemo(() => {
    return calculateDepartmentProjections(scenario, scenario.horizonMonths || 24, effectiveOrgData);
  }, [scenario, effectiveOrgData]);

  const insights = useMemo(() => {
    return generateWorkforcePlanningInsights(scenario, metrics);
  }, [scenario, metrics]);

  const handleActivateScenario = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFORCE_PLANNING);
      const existing = raw ? JSON.parse(raw) : {};
      const updated = {
        ...existing,
        activeScenarioId: scenario.id,
      };
      localStorage.setItem(STORAGE_KEY_WORKFORCE_PLANNING, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to activate scenario in localStorage:', e);
    }
    addToast({
      title: 'Active Scenario Set',
      message: `${scenario.name} is now the primary active scenario across Workforce Planning.`,
      type: 'success',
      duration: 3000,
    });
    navigate('/organization/planning');
  };

  return (
    <OrganizationLayout activeRoute="/organization/planning">
      <div className="space-y-6 pb-12">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/planning/scenarios')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Scenario Library</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleActivateScenario}
            className="cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            <span>Set as Active Planning Scenario</span>
          </Button>
        </div>

        {/* Scenario Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                    Scenario Deep-Dive
                  </span>
                  <span className="text-xs text-charcoal-400">•</span>
                  <span className="text-xs font-semibold text-charcoal-600">
                    {scenario.horizon} Horizon
                  </span>
                </div>
                <h1 className="text-heading font-bold text-charcoal-900 tracking-tight mt-1">
                  {scenario.name}
                </h1>
                <p className="text-xs text-brand-700 font-semibold mt-0.5">
                  {scenario.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-charcoal-600">
              <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center">
                <span className="text-[10px] text-charcoal-400 block font-bold uppercase">Growth Assumption</span>
                <span className="font-bold text-brand-700 font-mono text-sm">{scenario.workforceGrowth}</span>
              </div>
              <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center">
                <span className="text-[10px] text-charcoal-400 block font-bold uppercase">Demand Multiplier</span>
                <span className="font-bold text-charcoal-900 font-mono text-sm">{scenario.skillDemandMultiplier}x</span>
              </div>
            </div>
          </div>

          <p className="text-body-sm text-charcoal-700 leading-relaxed pt-2 border-t border-surface-border/60">
            {scenario.description}
          </p>
        </div>

        {/* Executive KPI Grid */}
        <PlanningKpiGrid metrics={metrics} scenarioName={scenario.name} />

        {/* Capability Demand */}
        <FutureWorkforceDemand capabilities={metrics.capabilities} scenarioName={scenario.name} />

        {/* Capability Gap Matrix */}
        <CapabilityGapTable capabilities={metrics.capabilities} />

        {/* Action Mix Panel */}
        <ActionMixPanel actionMix={scenario.defaultActionMix} totalGap={metrics.totalCapacityGap} />

        {/* Department Planning */}
        <DepartmentPlanning departmentProjections={departmentProjections} scenarioName={scenario.name} />

        {/* Insights */}
        <PlanningInsights insights={insights} />

        {/* Assumptions */}
        <ScenarioAssumptions scenario={scenario} horizonMonths={scenario.horizonMonths || 24} />

        {/* Methodology */}
        <PlanningMethodology />
      </div>
    </OrganizationLayout>
  );
};

export default WorkforceScenarioDetailPage;
