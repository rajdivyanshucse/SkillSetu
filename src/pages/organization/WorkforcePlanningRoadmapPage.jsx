import React, { useMemo, useState } from 'react';
import { CalendarCheck, ArrowLeft, Clock, Sparkles, ShieldCheck, UserPlus, BookOpen } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import {
  defaultPlanningScenarios,
  getPlanningScenarioById,
  roadmapMilestones,
  STORAGE_KEY_WORKFORCE_PLANNING,
} from '../../data/workforcePlanningData';
import { WorkforceRoadmap } from '../../components/workforce-planning/WorkforceRoadmap';
import { ScenarioAssumptions } from '../../components/workforce-planning/ScenarioAssumptions';
import { PlanningMethodology } from '../../components/workforce-planning/PlanningMethodology';
import { Button } from '../../components/ui/Button';

export const WorkforcePlanningRoadmapPage = () => {
  const { navigate } = useRouter();

  const [storedConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFORCE_PLANNING);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const activeScenarioId = storedConfig?.activeScenarioId || defaultPlanningScenarios[0].id;
  const horizonMonths = storedConfig?.horizonMonths || 24;

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

  return (
    <OrganizationLayout activeRoute="/organization/planning">
      <div className="space-y-6 pb-12">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/planning')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Workforce Planning Overview</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/planning/scenarios')}
              className="cursor-pointer"
            >
              <span>Scenario Library</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/organization/talent')}
              className="cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              <span>Explore Talent</span>
            </Button>
          </div>
        </div>

        {/* Roadmap Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Workforce Development & Execution Roadmap
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              Multi-phase operational sequence aligning capability upskilling, talent acquisition, and long-range readiness for {activeScenario.name}.
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Roadmap Span</span>
            <span className="text-sm font-black text-brand-700">36 Months Vision</span>
          </div>
        </div>

        {/* Roadmap Milestone Timeline Component */}
        <WorkforceRoadmap
          milestones={roadmapMilestones}
          scenarioName={activeScenario.name}
        />

        {/* Scenario Assumptions */}
        <ScenarioAssumptions
          scenario={activeScenario}
          horizonMonths={horizonMonths}
        />

        {/* Methodology */}
        <PlanningMethodology />
      </div>
    </OrganizationLayout>
  );
};

export default WorkforcePlanningRoadmapPage;
