import React from 'react';
import { Building2, Sparkles, Clock, RefreshCw, Info, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { WORKFORCE_INTELLIGENCE_DISCLAIMER } from '../../data/workforceIntelligenceData';

export const WorkforceDashboardHeader = ({
  companyName = 'TechNova Solutions',
  industry = 'Information Technology',
  size = '201–500',
  onRefresh,
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-surface border border-brand-200 rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
              {companyName}
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-600">
              {industry}
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-500">
              {size} Headcount
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Workforce Intelligence
          </h1>

          <p className="text-body-sm text-charcoal-600">
            Understand your workforce capabilities, team skill coverage, and development priorities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            <span>Updated just now</span>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={onRefresh}
            >
              Refresh Telemetry
            </Button>
          )}
        </div>
      </div>

      {/* Subtle Prototype Notice Bar */}
      <div className="p-2.5 rounded-lg bg-canvas-subtle/80 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span className="text-[11px] leading-normal">{WORKFORCE_INTELLIGENCE_DISCLAIMER}</span>
      </div>
    </div>
  );
};

export default WorkforceDashboardHeader;
