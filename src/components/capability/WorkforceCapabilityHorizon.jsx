import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users,
  Compass,
  Info,
  CalendarCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MarketSignalBadge } from './MarketSignalBadge';
import { getWorkforceCapabilityHorizon } from '../../utils/capabilityAdapter';
import { useRouter } from '../../router/Router';

/**
 * WorkforceCapabilityHorizon Component
 * Phase 37: Organization Workforce Capability Horizon.
 * 
 * Segments capabilities into Current Strength, Developing Need, and Emerging Requirement.
 * Maps coverage gaps to explainable Hire vs Upskill vs Redistribute interventions.
 * STRICT INVARIANT: No individual employee ranking.
 */
export const WorkforceCapabilityHorizon = ({
  className = '',
  title = 'Workforce Capability Horizon & Strategic Interventions',
  subtitle = 'Aggregate capability distribution across engineering and data pods with scenario-calibrated interventions.',
}) => {
  const { navigate } = useRouter();
  const [activeHorizonTab, setActiveHorizonTab] = useState('all');
  const horizonData = getWorkforceCapabilityHorizon();

  const displayedHorizons =
    activeHorizonTab === 'all'
      ? horizonData.horizons
      : horizonData.horizons.filter((h) => h.id === activeHorizonTab);

  const getInterventionBadge = (type) => {
    switch (type) {
      case 'UPSKILL':
        return { label: 'Upskill Internal Cohort', variant: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'UPSKILL_HIRE':
        return { label: 'Cohort Upskilling + Key Hire', variant: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'HIRE_UPSKILL':
        return { label: 'Specialist Hire + Cohort', variant: 'bg-brand-50 text-brand-800 border-brand-200' };
      case 'REDISTRIBUTE':
        return { label: 'Internal Mobility & Reskilling', variant: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'HIRE':
        return { label: 'Targeted Talent Acquisition', variant: 'bg-sky-50 text-sky-800 border-sky-200' };
      default:
        return { label: 'Upskill', variant: 'bg-surface text-charcoal-700 border-surface-border' };
    }
  };

  return (
    <Card className={`overflow-hidden border-surface-border shadow-xs ${className}`}>
      {/* Header */}
      <CardHeader className="bg-surface border-b border-surface-border/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/60">
                <Layers className="w-4 h-4" />
              </div>
              <CardTitle className="text-base sm:text-xl">
                {title}
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              {subtitle}
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 bg-canvas-subtle p-1 rounded-lg border border-surface-border self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveHorizonTab('all')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                activeHorizonTab === 'all'
                  ? 'bg-surface text-charcoal-900 font-bold shadow-xs border border-surface-border'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              All Horizons
            </button>
            {horizonData.horizons.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveHorizonTab(h.id)}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeHorizonTab === h.id
                    ? 'bg-surface text-charcoal-900 font-bold shadow-xs border border-surface-border'
                    : 'text-charcoal-600 hover:text-charcoal-900'
                }`}
              >
                {h.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Horizon Sections */}
        <div className="space-y-6">
          {displayedHorizons.map((horizon) => {
            const isDeveloping = horizon.id === 'workforce-developing-need';
            const isEmerging = horizon.id === 'workforce-emerging-requirement';

            const containerTheme = isDeveloping
              ? 'border-brand-200 bg-gradient-to-br from-brand-50/15 to-surface'
              : isEmerging
              ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/15 to-surface'
              : 'border-surface-border bg-surface';

            return (
              <div
                key={horizon.id}
                className={`rounded-xl border p-4 sm:p-5 transition-all ${containerTheme}`}
              >
                {/* Horizon Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-surface-border/70">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
                        {horizon.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-surface border border-surface-border text-charcoal-600">
                        {horizon.horizonLabel}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      {horizon.subtitle}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-charcoal-500 self-start sm:self-auto">
                    {horizon.items.length} Strategic Domains
                  </span>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {horizon.items.map((item) => {
                    const badge = getInterventionBadge(item.interventionType);
                    const coverageGap = item.targetCoverage - item.currentCoverage;

                    return (
                      <div
                        key={item.id}
                        className="bg-surface rounded-xl border border-surface-border hover:border-brand-400 hover:shadow-xs p-4 flex flex-col justify-between transition-all space-y-3"
                      >
                        <div className="space-y-2.5">
                          {/* Top Meta */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                                {item.department}
                              </span>
                              <h4 className="text-sm font-bold text-charcoal-900">
                                {item.capability}
                              </h4>
                            </div>

                            <MarketSignalBadge signal={item.marketSignal} size="xs" />
                          </div>

                          {/* Coverage Progress Bar */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                              <span>Workforce Coverage</span>
                              <span>
                                {item.currentCoverage}% / {item.targetCoverage}% Target
                              </span>
                            </div>

                            <div className="h-2 w-full bg-canvas-subtle rounded-full overflow-hidden border border-surface-border/60">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  item.currentCoverage >= 70
                                    ? 'bg-emerald-600'
                                    : item.currentCoverage >= 40
                                    ? 'bg-brand-600'
                                    : 'bg-amber-600'
                                }`}
                                style={{ width: `${item.currentCoverage}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-charcoal-500">
                              <span>Coverage Gap: {coverageGap > 0 ? `-${coverageGap}%` : 'Optimal'}</span>
                              <span className="font-bold text-emerald-800">{item.marketTrajectory}</span>
                            </div>
                          </div>

                          {/* Recommended Intervention */}
                          <div className="space-y-1 pt-2 border-t border-surface-border/60">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                                Recommended Action:
                              </span>
                            </div>
                            <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${badge.variant}`}>
                              {badge.label}
                            </span>
                            <p className="text-[11px] text-charcoal-600 leading-relaxed pt-1">
                              <strong>Why:</strong> {item.rationale}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-surface-border/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => navigate('/organization/planning')}
                            className="text-xs text-charcoal-600 hover:text-charcoal-900 font-medium cursor-pointer"
                          >
                            Scenario Impact
                          </button>

                          <button
                            onClick={() => navigate('/organization/growth')}
                            className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Cohort Plans</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="p-3.5 bg-canvas-subtle rounded-xl border border-surface-border text-xs text-charcoal-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Workforce Intelligence Notice:</strong> {horizonData.disclaimer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkforceCapabilityHorizon;
