import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, AlertTriangle, Layers, BookOpen } from 'lucide-react';
import { useRouter } from '../../router/Router';
import CapabilityStateBadge from '../ui/CapabilityStateBadge';
import Button from '../ui/Button';

/**
 * PriorityCapabilityGaps Component
 * Prominently presents high-impact capability gaps with target proficiency requirements,
 * reason why it matters, and direct link to development roadmap.
 */
export const PriorityCapabilityGaps = ({
  gaps = [],
  onSelectGap,
  className = '',
}) => {
  const { navigate } = useRouter();

  // Take top 4 priority gaps
  const topGaps = gaps.slice(0, 4);

  return (
    <div className={`bg-surface border border-surface-border rounded-xl p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-charcoal-900">Priority Capability Gaps</h3>
            <p className="text-xs text-charcoal-500">
              High-impact competencies where target role requirements exceed current demonstrable evidence
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/skill-gaps')}
          className="text-xs font-semibold shrink-0"
        >
          View All Gaps
        </Button>
      </div>

      {topGaps.length > 0 ? (
        <div className="space-y-3">
          {topGaps.map((gap, index) => (
            <motion.div
              key={gap.id || gap.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3.5 bg-canvas-subtle/70 rounded-xl border border-surface-border/70 hover:border-surface-border-strong hover:bg-surface transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-charcoal-900">{gap.name}</span>
                  <CapabilityStateBadge state={gap.capabilityState} size="sm" />
                  <span className="text-[10px] font-semibold uppercase text-charcoal-400 bg-surface px-1.5 py-0.5 rounded border border-surface-border">
                    {gap.category}
                  </span>
                </div>
                <p className="text-xs text-charcoal-600 line-clamp-1 max-w-xl">
                  {gap.whyItMatters || 'Required proficiency level exceeds current profile evidence.'}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-charcoal-500 pt-0.5">
                  <span>
                    Current: <strong className="text-charcoal-700">{gap.currentProficiency}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Target: <strong className="text-brand-700">{gap.targetProficiency}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Evidence: <strong className="text-charcoal-700">{gap.evidenceCount} sources</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectGap ? onSelectGap(gap) : navigate('/dashboard/skill-gaps')}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:bg-brand-50 flex items-center gap-1"
                >
                  <span>Close Gap</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-charcoal-500">
          No critical capability gaps identified. All required competencies currently have supporting evidence.
        </div>
      )}
    </div>
  );
};

export default PriorityCapabilityGaps;
