import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { defaultPlanningScenarios } from '../../data/workforcePlanningData';
import { calculateScenarioMetrics } from '../../utils/workforcePlanning';
import { Button } from '../ui/Button';

export const ScenarioComparison = ({
  scenarios = defaultPlanningScenarios,
  activeScenarioId = 'growth',
  onSelectScenario,
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Neutral Comparison Notice */}
      <div className="p-3 rounded-xl bg-canvas-subtle border border-surface-border flex items-center justify-between text-xs text-charcoal-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>Neutral Scenario Comparison:</strong> Scenarios reflect different strategic assumptions. Inspect how varying parameters influence capability demand without prescriptive scoring.
          </span>
        </div>
        <span className="text-[11px] font-mono text-charcoal-500 font-bold bg-surface border border-surface-border px-2 py-0.5 rounded-md">
          {scenarios.length} Scenarios
        </span>
      </div>

      {/* Comparison Matrix */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-surface-border bg-canvas-subtle/70">
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-charcoal-500 w-48">
                  Scenario Parameter
                </th>
                {scenarios.map((sc) => {
                  const isActive = sc.id === activeScenarioId;
                  return (
                    <th
                      key={sc.id}
                      className={`p-4 min-w-[200px] border-l border-surface-border ${
                        isActive ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-body-sm font-bold text-charcoal-900">
                              {sc.name}
                            </h4>
                            {isActive && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-xs bg-brand-600 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-charcoal-500 font-normal line-clamp-1 mt-0.5">
                            {sc.tagline}
                          </span>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
              {/* Planning Horizon */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Planning Horizon
                </td>
                {scenarios.map((sc) => (
                  <td key={sc.id} className="p-4 border-l border-surface-border font-mono font-bold text-charcoal-900">
                    {sc.horizon}
                  </td>
                ))}
              </tr>

              {/* Workforce Growth */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Workforce Growth
                </td>
                {scenarios.map((sc) => (
                  <td key={sc.id} className="p-4 border-l border-surface-border font-mono font-bold text-brand-700">
                    {sc.workforceGrowth}
                  </td>
                ))}
              </tr>

              {/* Demand Multiplier */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Demand Multiplier
                </td>
                {scenarios.map((sc) => (
                  <td key={sc.id} className="p-4 border-l border-surface-border font-mono text-charcoal-800">
                    {sc.skillDemandMultiplier}x
                  </td>
                ))}
              </tr>

              {/* Projected Headcount */}
              <tr className="bg-canvas-subtle/30">
                <td className="p-4 font-bold text-charcoal-900">
                  Projected Requirement
                </td>
                {scenarios.map((sc) => {
                  const m = calculateScenarioMetrics(sc, sc.horizonMonths);
                  return (
                    <td key={sc.id} className="p-4 border-l border-surface-border font-mono">
                      <span className="text-sm font-black text-charcoal-900">
                        {m.projectedHeadcount} units
                      </span>
                      <span className="text-[10px] text-charcoal-400 block font-normal">
                        (+{m.totalHeadcountDelta} delta)
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Capacity Gap */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Capacity Gap
                </td>
                {scenarios.map((sc) => {
                  const m = calculateScenarioMetrics(sc, sc.horizonMonths);
                  return (
                    <td key={sc.id} className="p-4 border-l border-surface-border font-mono">
                      <span className="font-bold text-danger-700 bg-danger-50 border border-danger-200 px-2 py-0.5 rounded-md text-[11px]">
                        +{m.totalCapacityGap} Gap Units
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Hiring Actions */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Hiring Allocation
                </td>
                {scenarios.map((sc) => {
                  const m = calculateScenarioMetrics(sc, sc.horizonMonths);
                  return (
                    <td key={sc.id} className="p-4 border-l border-surface-border font-mono">
                      <span className="font-bold text-accent-700">~{m.totalHiringUnits} positions</span>
                      <span className="text-[10px] text-charcoal-400 block font-normal">({sc.defaultActionMix.hiring}%)</span>
                    </td>
                  );
                })}
              </tr>

              {/* Upskilling Allocation */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Upskilling Focus
                </td>
                {scenarios.map((sc) => {
                  const m = calculateScenarioMetrics(sc, sc.horizonMonths);
                  return (
                    <td key={sc.id} className="p-4 border-l border-surface-border font-mono">
                      <span className="font-bold text-brand-700">~{m.totalUpskillUnits} staff</span>
                      <span className="text-[10px] text-charcoal-400 block font-normal">({sc.defaultActionMix.upskilling}%)</span>
                    </td>
                  );
                })}
              </tr>

              {/* Actions */}
              <tr className="bg-canvas-subtle/40">
                <td className="p-4 font-semibold text-charcoal-500">
                  Apply Scenario
                </td>
                {scenarios.map((sc) => {
                  const isActive = sc.id === activeScenarioId;
                  return (
                    <td key={sc.id} className="p-4 border-l border-surface-border">
                      <Button
                        variant={isActive ? 'primary' : 'outline'}
                        size="xs"
                        onClick={() => onSelectScenario && onSelectScenario(sc.id)}
                        className="cursor-pointer w-full"
                      >
                        {isActive ? 'Active Plan' : 'Select Scenario'}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;
