import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, Info, Layers } from 'lucide-react';

export const PlanningInsights = ({
  insights = [],
  className = '',
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'purple':
        return <Layers className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-brand-600" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-warning-200/80 bg-warning-50/20';
      case 'success':
        return 'border-success-200/80 bg-success-50/20';
      case 'purple':
        return 'border-purple-200/80 bg-purple-50/20';
      default:
        return 'border-brand-200/80 bg-brand-50/20';
    }
  };

  return (
    <div className={`bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Workforce Planning Intelligence Insights
            </h3>
            <p className="text-xs text-charcoal-500">
              Deterministic scenario signals derived from configured capability requirements
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          Scenario Synthesis
        </span>
      </div>

      {/* Grid of Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className={`p-3.5 rounded-xl border ${getBorderColor(ins.type)} flex flex-col justify-between space-y-2`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-surface border border-surface-border">
                  {getIcon(ins.type)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                  {ins.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-charcoal-900 leading-snug">
                {ins.title}
              </h4>
            </div>
            <p className="text-[11px] text-charcoal-600 leading-relaxed pt-1 border-t border-surface-border/60">
              {ins.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanningInsights;
