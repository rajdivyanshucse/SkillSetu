import React from 'react';
import { CalendarCheck, Clock, Sliders, ChevronDown, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { planningHorizons, PLANNING_DISCLAIMER } from '../../data/workforcePlanningData';

export const PlanningHeader = ({
  companyName = 'TechNova Solutions',
  selectedScenario,
  selectedHorizonMonths = 24,
  onHorizonChange,
  onOpenConfigurator,
  onResetToDefaults,
  className = '',
}) => {
  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Top Banner */}
      <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
              {companyName}
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-600">
              Active Scenario: <strong className="text-charcoal-900">{selectedScenario?.name || 'Growth & Expansion'}</strong>
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-500">
              {selectedHorizonMonths} Months Horizon
            </span>
          </div>

          <h1 className="text-heading-lg font-bold text-charcoal-900 tracking-tight">
            Workforce Planning & Future Intelligence
          </h1>

          <p className="text-body-sm text-charcoal-600">
            Explore future workforce requirements, capability gaps, and potential workforce actions under configurable planning scenarios.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Planning Horizon Selector */}
          <div className="flex items-center gap-1.5 bg-canvas-subtle p-1 rounded-xl border border-surface-border">
            <Clock className="w-3.5 h-3.5 text-charcoal-400 ml-2" />
            <span className="text-xs font-medium text-charcoal-500 mr-1">Horizon:</span>
            {planningHorizons.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => onHorizonChange && onHorizonChange(h.value)}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer
                  ${
                    selectedHorizonMonths === h.value
                      ? 'bg-surface text-brand-800 shadow-2xs border border-surface-border'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }
                `}
              >
                {h.label}
              </button>
            ))}
          </div>

          {onOpenConfigurator && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenConfigurator}
              className="cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
              <span>Configure Scenario</span>
            </Button>
          )}
        </div>
      </div>

      {/* Prototype Planning Notice */}
      <div className="p-2.5 rounded-xl bg-canvas-subtle/80 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span className="text-[11px] leading-normal">{PLANNING_DISCLAIMER}</span>
      </div>
    </div>
  );
};

export default PlanningHeader;
