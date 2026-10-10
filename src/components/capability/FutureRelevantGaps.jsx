import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CapabilityStateBadge } from '../ui/CapabilityStateBadge';
import { MarketSignalBadge } from './MarketSignalBadge';
import { useRouter } from '../../router/Router';

/**
 * FutureRelevantGaps Component
 * Phase 37: Explainable Future-Relevant Capability Gaps.
 * Connects target role requirements, market signals, and evidence state into explainable priorities.
 */
export const FutureRelevantGaps = ({
  gaps = [],
  onSelectGap,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!gaps || gaps.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <p className="text-sm text-charcoal-500">
          No high-divergence future capability gaps identified.
        </p>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden border-surface-border shadow-xs ${className}`}>
      <CardHeader className="bg-surface border-b border-surface-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                Future-Relevant Capability Gaps
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              Competencies required by your target role with growing market signals where demonstrable evidence is missing.
            </CardDescription>
          </div>

          <Badge variant="danger" size="md" className="self-start sm:self-auto font-bold">
            {gaps.length} Priority Gaps
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="bg-surface rounded-xl border border-surface-border hover:border-brand-300 hover:shadow-xs p-5 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3.5">
                {/* Header line */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                      {gap.category}
                    </span>
                    <h4 className="text-base font-bold text-charcoal-900">
                      {gap.name}
                    </h4>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      gap.priorityBadge === 'danger'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : gap.priorityBadge === 'warning'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-brand-50 text-brand-800 border-brand-200'
                    }`}
                  >
                    {gap.priorityLevel}
                  </span>
                </div>

                {/* 4-Point Signal Traceability Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-canvas-subtle p-2.5 rounded-lg border border-surface-border/80 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-500 uppercase block font-semibold">Target Role</span>
                    <span className="text-[11px] font-bold text-charcoal-900">{gap.roleImportance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-500 uppercase block font-semibold">Market Signal</span>
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {gap.marketSignal}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-500 uppercase block font-semibold">Profile State</span>
                    <span className="text-[11px] font-semibold text-charcoal-800">{gap.currentState.label}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-500 uppercase block font-semibold">Evidence</span>
                    <span className="text-[11px] font-bold text-rose-800">
                      {gap.currentState.key === 'DEMONSTRATED' ? 'Attached' : 'Missing'}
                    </span>
                  </div>
                </div>

                {/* Why This Matters Explainability */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700 block">
                    Why This Matters (Signal Traceability):
                  </span>
                  <ul className="space-y-1 text-xs text-charcoal-600">
                    {gap.reasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-brand-600 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Development Action */}
                <div className="bg-brand-50/40 border border-brand-200/60 p-3 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-800 tracking-wider block">
                    Target Development Action
                  </span>
                  <p className="text-xs font-semibold text-charcoal-900">
                    {gap.developmentAction}
                  </p>
                  <span className="text-[11px] text-charcoal-500 block">
                    Roadmap Placement: {gap.roadmapStage}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-surface-border/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectGap && onSelectGap(gap.name)}
                  className="text-xs text-charcoal-600 hover:text-charcoal-900 font-medium cursor-pointer"
                >
                  Inspect Evidence Detail
                </button>

                <button
                  onClick={() => navigate('/dashboard/career-roadmap')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1.5 cursor-pointer bg-brand-50 px-3 py-1.5 rounded-md border border-brand-200 transition-colors"
                >
                  <span>View Development Path</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FutureRelevantGaps;
