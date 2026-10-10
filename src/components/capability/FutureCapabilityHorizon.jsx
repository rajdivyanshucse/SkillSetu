import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Info,
  Clock,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CapabilityStateBadge } from '../ui/CapabilityStateBadge';
import { MarketSignalBadge } from './MarketSignalBadge';
import { useRouter } from '../../router/Router';

/**
 * FutureCapabilityHorizon Component
 * Phase 37: Segments capabilities into Current Core, Near-Term Development, and Emerging Direction.
 * Connects current demonstrated capabilities to market direction and development priorities.
 */
export const FutureCapabilityHorizon = ({
  horizonData,
  onSelectCapability,
  className = '',
}) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  if (!horizonData || !horizonData.horizons) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <p className="text-sm text-charcoal-500">
          Future capability signals are not currently available for this role.
        </p>
      </Card>
    );
  }

  const { horizons, targetRole, disclaimer } = horizonData;

  const displayedHorizons =
    activeTab === 'all'
      ? horizons
      : horizons.filter((h) => h.id === activeTab);

  return (
    <Card className={`overflow-hidden border-surface-border shadow-xs ${className}`}>
      {/* Header */}
      <CardHeader className="bg-surface border-b border-surface-border/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/60">
                <Compass className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Future Capability Horizon — {targetRole}
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Explore how your core capabilities connect with near-term development priorities and emerging market signals.
            </CardDescription>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-canvas-subtle p-1 rounded-lg border border-surface-border self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-surface text-charcoal-900 font-bold shadow-xs border border-surface-border'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              All Horizons
            </button>
            {horizons.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveTab(h.id)}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${
                  activeTab === h.id
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
        {/* Horizon Grid */}
        <div className="space-y-6">
          {displayedHorizons.map((horizon) => {
            const isNearTerm = horizon.id === 'near-term';
            const isEmerging = horizon.id === 'emerging-direction';

            const containerBorder = isNearTerm
              ? 'border-brand-300 bg-gradient-to-br from-brand-50/20 to-surface'
              : isEmerging
              ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/15 to-surface'
              : 'border-surface-border bg-surface';

            return (
              <div
                key={horizon.id}
                className={`rounded-xl border p-4 sm:p-5 transition-all ${containerBorder}`}
              >
                {/* Horizon Section Header */}
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
                    {horizon.items.length} Tracked Capabilities
                  </span>
                </div>

                {/* Capability Cards in this horizon */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {horizon.items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface rounded-xl border border-surface-border hover:border-brand-400 hover:shadow-xs p-4 flex flex-col justify-between transition-all group"
                    >
                      <div className="space-y-3">
                        {/* Top Meta */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                              {item.category}
                            </span>
                            <h4 className="text-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
                              {item.name}
                            </h4>
                          </div>

                          <MarketSignalBadge signal={item.marketSignal} size="xs" />
                        </div>

                        {/* Signals breakdown */}
                        <div className="space-y-1.5 pt-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-charcoal-500">Profile State:</span>
                            <CapabilityStateBadge state={item.capabilityState} size="xs" />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-charcoal-500">Role Benchmark:</span>
                            <span className="text-[11px] font-semibold text-charcoal-800">
                              {item.roleImportance}
                            </span>
                          </div>

                          {item.marketTrajectory && (
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-charcoal-500">Trend Trajectory:</span>
                              <span className="text-[11px] font-bold text-emerald-800">
                                {item.marketTrajectory}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Why It Matters */}
                        <p className="text-xs text-charcoal-600 leading-relaxed border-t border-surface-border/60 pt-2">
                          {item.whyItMatters}
                        </p>
                      </div>

                      {/* Bottom Action */}
                      <div className="mt-4 pt-3 border-t border-surface-border/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onSelectCapability && onSelectCapability(item.name)}
                          className="text-xs text-charcoal-600 hover:text-charcoal-900 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-charcoal-400" />
                          <span>Signal Detail</span>
                        </button>

                        <button
                          onClick={() => navigate('/dashboard/career-roadmap')}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Development Path</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Honest Forecast Disclaimer */}
        <div className="p-3.5 bg-canvas-subtle rounded-xl border border-surface-border text-xs text-charcoal-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <div>
            <p className="leading-relaxed">
              <strong>Statistical Forecast Notice:</strong> {disclaimer}
            </p>
            <p className="text-[11px] text-charcoal-500 mt-1">
              Data provenance: O*NET Role Taxonomy, ESCO Competency Framework, and historical market demand trends.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FutureCapabilityHorizon;
