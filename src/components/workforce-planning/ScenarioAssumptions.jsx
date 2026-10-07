import React from 'react';
import { Sliders, ShieldCheck, Info, CheckCircle2, Clock, Users } from 'lucide-react';
import { PLANNING_DISCLAIMER } from '../../data/workforcePlanningData';

export const ScenarioAssumptions = ({
  scenario,
  horizonMonths = 24,
  headcount = 287,
  className = '',
}) => {
  if (!scenario) return null;

  return (
    <div className={`bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-charcoal-900 leading-tight">
              Configured Scenario Assumptions: {scenario.name}
            </h4>
            <p className="text-xs text-charcoal-500">
              Mathematical baselines underpinning projected workforce demand calculations
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          Assumption Log
        </span>
      </div>

      {/* Assumptions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-surface-border">
          <span className="text-[10px] text-charcoal-400 font-bold uppercase block mb-0.5">Planning Horizon</span>
          <span className="font-mono font-bold text-charcoal-900 text-sm">{horizonMonths} Months</span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-surface-border">
          <span className="text-[10px] text-charcoal-400 font-bold uppercase block mb-0.5">Headcount Growth</span>
          <span className="font-mono font-bold text-brand-700 text-sm">{scenario.workforceGrowth}</span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-surface-border">
          <span className="text-[10px] text-charcoal-400 font-bold uppercase block mb-0.5">Demand Multiplier</span>
          <span className="font-mono font-bold text-charcoal-900 text-sm">{scenario.skillDemandMultiplier}x</span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-surface-border">
          <span className="text-[10px] text-charcoal-400 font-bold uppercase block mb-0.5">Attrition Assumption</span>
          <span className="font-mono font-bold text-charcoal-800 text-sm">{scenario.attritionAssumption}</span>
        </div>
      </div>

      {/* Action Mix Badges */}
      <div className="p-3 rounded-xl bg-canvas-subtle/50 border border-surface-border space-y-2">
        <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
          Default Planning Action Mix Distribution
        </span>
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-accent-50 text-accent-800 border border-accent-200 font-bold">
            Hiring: {scenario.defaultActionMix?.hiring}%
          </span>
          <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-800 border border-brand-200 font-bold">
            Upskilling: {scenario.defaultActionMix?.upskilling}%
          </span>
          <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-bold">
            Internal Mobility: {scenario.defaultActionMix?.internalMobility}%
          </span>
          <span className="px-2.5 py-1 rounded-md bg-warning-50 text-warning-800 border border-warning-200 font-bold">
            Reskilling: {scenario.defaultActionMix?.reskilling}%
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-canvas-subtle/90 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
        <span className="text-[11px] leading-relaxed">{PLANNING_DISCLAIMER}</span>
      </div>
    </div>
  );
};

export default ScenarioAssumptions;
