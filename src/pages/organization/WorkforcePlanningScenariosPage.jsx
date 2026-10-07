import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowLeft, Sliders, ShieldCheck, Check } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { defaultPlanningScenarios, getPlanningScenarioById, STORAGE_KEY_WORKFORCE_PLANNING } from '../../data/workforcePlanningData';
import { ScenarioCard } from '../../components/workforce-planning/ScenarioCard';
import { ScenarioComparison } from '../../components/workforce-planning/ScenarioComparison';
import { ScenarioConfigurator } from '../../components/workforce-planning/ScenarioConfigurator';
import { ScenarioAssumptions } from '../../components/workforce-planning/ScenarioAssumptions';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const WorkforcePlanningScenariosPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

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

  const [configuratorOpen, setConfiguratorOpen] = useState(false);

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

  const handleSelectScenario = (id) => {
    setActiveScenarioId(id);
    const updated = {
      ...(storedConfig || {}),
      activeScenarioId: id,
    };
    try {
      localStorage.setItem(STORAGE_KEY_WORKFORCE_PLANNING, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save selected scenario to localStorage:', e);
    }
    setStoredConfig(updated);
    addToast({
      title: 'Planning Scenario Activated',
      message: `${getPlanningScenarioById(id).name} is now the primary active scenario.`,
      type: 'success',
      duration: 3000,
    });
  };

  const handleSaveConfiguration = (customizedScenario) => {
    const updated = {
      ...(storedConfig || {}),
      activeScenarioId: customizedScenario.id,
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
    setActiveScenarioId(customizedScenario.id);
  };

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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfiguratorOpen(true)}
            className="cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
            <span>Calibrate Scenario Parameters</span>
          </Button>
        </div>

        {/* Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Workforce Planning Scenario Library
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              Select or calibrate strategic planning scenarios to evaluate capability demand and capacity gap implications.
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Active Scenario</span>
            <span className="text-sm font-black text-brand-700">{activeScenario.name}</span>
          </div>
        </div>

        {/* 4 Scenario Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultPlanningScenarios.map((sc) => (
            <ScenarioCard
              key={sc.id}
              scenario={sc}
              isSelected={sc.id === activeScenarioId}
              onSelect={handleSelectScenario}
            />
          ))}
        </div>

        {/* Scenario Side-by-Side Comparison */}
        <ScenarioComparison
          scenarios={defaultPlanningScenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
        />

        {/* Configured Assumptions */}
        <ScenarioAssumptions
          scenario={activeScenario}
          horizonMonths={activeScenario.horizonMonths || 24}
        />
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

export default WorkforcePlanningScenariosPage;
