import React from 'react';
import { Lightbulb, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const WorkforceActionSignals = ({
  actionSignals = [],
  onSelectSkill,
}) => {
  const getActionBadge = (action) => {
    switch (action?.toLowerCase()) {
      case 'hire':
      case 'hire + upskill':
      case 'upskill + hire':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-accent-50 text-accent-700 border border-accent-200">
            {action}
          </span>
        );
      case 'reskill':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-warning-50 text-warning-700 border border-warning-200">
            Reskill
          </span>
        );
      case 'maintain':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-success-50 text-success-700 border border-success-200">
            Maintain
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-brand-50 text-brand-700 border border-brand-200">
            Upskill Focus
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
                Workforce Action Signals (Hiring vs. Upskilling)
              </h3>
              <p className="text-body-xs text-charcoal-500">
                Decision-support indicators calculated from coverage deficits and strategic horizons
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-xs">
            Decision Support Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border bg-canvas-subtle/50 text-charcoal-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Skill / Competency</th>
                <th className="py-2.5 px-3">Current Coverage</th>
                <th className="py-2.5 px-3">Future Importance</th>
                <th className="py-2.5 px-3">Potential Workforce Action</th>
                <th className="py-2.5 px-3">Signal Rationale</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/70">
              {actionSignals.map((signal) => (
                <tr
                  key={signal.skill}
                  className="hover:bg-canvas-subtle/70 transition-colors group cursor-pointer"
                  onClick={onSelectSkill ? () => onSelectSkill(signal.skill) : undefined}
                >
                  <td className="py-3 px-3 font-semibold text-charcoal-900">
                    <div className="flex items-center gap-1.5">
                      <span>{signal.skill}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-charcoal-800">
                        {signal.currentCoverage}%
                      </span>
                      <span className="text-[10px] text-charcoal-400">
                        ({signal.coverageStatus})
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-charcoal-700">
                      {signal.futureImportance}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {getActionBadge(signal.suggestedAction)}
                  </td>
                  <td className="py-3 px-3 text-charcoal-600 max-w-xs truncate">
                    {signal.explanation}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      className="text-brand-600 group-hover:text-brand-700 font-medium inline-flex items-center gap-0.5 text-body-xs"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-body-xs text-charcoal-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          Signals are derived deterministically to support human workforce planning, not prescriptive rules.
        </span>
        <span className="text-[11px] text-charcoal-500 font-mono">
          SkillSetu Signal Engine
        </span>
      </div>
    </div>
  );
};

export default WorkforceActionSignals;
