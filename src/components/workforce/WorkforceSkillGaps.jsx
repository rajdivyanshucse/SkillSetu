import React from 'react';
import { GitBranch, ArrowRight, AlertTriangle } from 'lucide-react';
import { SkillGapCard } from './SkillGapCard';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';

export const WorkforceSkillGaps = ({
  gaps = [],
  onSelectSkill,
  maxDisplay = 4,
}) => {
  const { navigate } = useRouter();
  const displayedGaps = gaps.slice(0, maxDisplay);

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-warning-50 text-warning-700 flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
                Priority Capability Gaps
              </h3>
              <p className="text-body-xs text-charcoal-500">
                Skills with the highest divergence between current coverage and target requirements
              </p>
            </div>
          </div>
          <span className="text-body-xs font-mono font-bold bg-warning-50 text-warning-800 border border-warning-200 px-2 py-0.5 rounded-xs">
            {gaps.length} Identified
          </span>
        </div>

        {displayedGaps.length === 0 ? (
          <div className="p-6 text-center rounded-md bg-canvas-subtle border border-surface-border text-charcoal-500 text-body-sm">
            No critical capability gaps detected based on current profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedGaps.map((gap) => (
              <SkillGapCard
                key={gap.skill}
                gap={gap}
                onClick={onSelectSkill ? () => onSelectSkill(gap.skill) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-surface-border flex items-center justify-between text-body-xs text-charcoal-500">
        <span className="flex items-center gap-1 text-charcoal-500">
          <AlertTriangle className="w-3.5 h-3.5 text-warning-600" />
          Ranked using deterministic gap sizing and future importance
        </span>
        <button
          type="button"
          onClick={() => navigate('/organization/workforce')}
          className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All Inventory</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default WorkforceSkillGaps;
