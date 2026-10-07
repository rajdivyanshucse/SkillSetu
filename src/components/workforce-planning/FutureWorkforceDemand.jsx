import React from 'react';
import { TrendingUp, Sparkles, Clock, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useRouter } from '../../router/Router';

export const FutureWorkforceDemand = ({
  capabilities = [],
  scenarioName = 'Growth',
  className = '',
}) => {
  const { navigate } = useRouter();

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'text-danger-800 bg-danger-50 border-danger-200';
      case 'High':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-brand-800 bg-brand-50 border-brand-200';
    }
  };

  return (
    <div className={`bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Future Capability Demand & Capacity Gaps
            </h3>
            <p className="text-xs text-charcoal-500">
              Projected requirement vs current capacity under {scenarioName} scenario
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/organization/planning/skills')}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
        >
          <span>All Capabilities</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Capabilities List with Visual Meters */}
      <div className="space-y-3.5">
        {capabilities.slice(0, 5).map((cap) => {
          const current = cap.currentCapacity || 20;
          const projected = cap.projectedRequirement || 30;
          const gap = cap.capacityGap || (projected - current);
          const maxCapacityScale = Math.max(80, Math.round(projected * 1.3));
          const currentPct = Math.min(100, Math.round((current / maxCapacityScale) * 100));
          const projectedPct = Math.min(100, Math.round((projected / maxCapacityScale) * 100));

          return (
            <div
              key={cap.id}
              className="p-3.5 rounded-xl bg-canvas-subtle/60 border border-surface-border space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-900">
                      {cap.name}
                    </span>
                    <span className="text-[10px] text-charcoal-500 font-medium">
                      ({cap.category})
                    </span>
                  </div>
                  <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-charcoal-400" />
                    Planning Horizon: {cap.horizon}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(cap.priority)}`}>
                    {cap.priority} Priority
                  </span>
                  <span className="text-xs font-mono font-black text-danger-700 bg-danger-50 border border-danger-200 px-2 py-0.5 rounded-md">
                    +{gap} Gap
                  </span>
                </div>
              </div>

              {/* Dual Visual Comparison Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-charcoal-600">
                    Current Capacity: <strong className="text-charcoal-900">{current} units</strong>
                  </span>
                  <span className="text-brand-700">
                    Projected Requirement: <strong className="text-brand-900">{projected} units</strong>
                  </span>
                </div>

                <div className="w-full h-2.5 bg-canvas-muted rounded-full overflow-hidden relative">
                  {/* Current Capacity Bar */}
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300 z-10"
                    style={{ width: `${currentPct}%` }}
                  />
                  {/* Projected Difference Marker */}
                  <div
                    className="absolute top-0 bottom-0 bg-brand-300/60 transition-all duration-300"
                    style={{ left: `${currentPct}%`, width: `${Math.max(0, projectedPct - currentPct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FutureWorkforceDemand;
