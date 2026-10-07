import React from 'react';
import { Sparkles, Info, CheckCircle, AlertTriangle, TrendingUp, Users } from 'lucide-react';

export const WorkforceInsights = ({ insights = [] }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case 'distribution':
        return <Users className="w-4 h-4 text-brand-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-accent-600" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-warning-200/80 bg-warning-50/30';
      case 'positive':
        return 'border-success-200/80 bg-success-50/30';
      case 'distribution':
        return 'border-brand-200/80 bg-brand-50/30';
      default:
        return 'border-accent-200/80 bg-accent-50/30';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Workforce Intelligence Insights
            </h3>
            <p className="text-body-xs text-charcoal-500">
              Deterministic capability patterns derived from your configured organization baseline
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-xs">
          Based on organization profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-md border ${getBorderColor(insight.type)} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start gap-2.5 mb-2">
                <div className="mt-0.5 shrink-0">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="text-body-xs font-bold text-charcoal-900 leading-tight">
                    {insight.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider">
                    {insight.category}
                  </span>
                </div>
              </div>
              <p className="text-body-xs text-charcoal-600 mt-1">
                {insight.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-surface-border/60 flex items-center justify-between text-[10px] text-charcoal-400">
              <span>Source: Profile Calibration</span>
              <span className="font-mono text-charcoal-500">Deterministic</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkforceInsights;
