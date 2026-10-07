import React from 'react';
import { Sparkles, ArrowRight, Check, Sliders, TrendingUp, Clock, Target } from 'lucide-react';
import { useRouter } from '../../router/Router';

export const ScenarioCard = ({
  scenario,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!scenario) return null;

  return (
    <div
      onClick={() => onSelect && onSelect(scenario.id)}
      className={`
        bg-surface border rounded-2xl p-5 shadow-2xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group
        ${
          isSelected
            ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/10'
            : 'border-surface-border hover:border-brand-300 hover:shadow-xs'
        }
        ${className}
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-body-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
                {scenario.name}
              </h3>
              {isSelected && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-brand-700 font-medium mt-0.5">
              {scenario.tagline}
            </p>
          </div>
        </div>

        <p className="text-xs text-charcoal-600 line-clamp-2 mb-3">
          {scenario.description}
        </p>

        {/* Key Assumptions Pills */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-border/60 text-xs">
          <div className="p-2 rounded-lg bg-canvas-subtle/80 border border-surface-border">
            <span className="text-[10px] text-charcoal-400 uppercase font-bold block">Growth</span>
            <span className="font-mono font-bold text-charcoal-900">{scenario.workforceGrowth}</span>
          </div>
          <div className="p-2 rounded-lg bg-canvas-subtle/80 border border-surface-border">
            <span className="text-[10px] text-charcoal-400 uppercase font-bold block">Demand Multiplier</span>
            <span className="font-mono font-bold text-brand-700">{scenario.skillDemandMultiplier}x</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-border flex items-center justify-between">
        <span className="text-[11px] text-charcoal-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-charcoal-400" />
          {scenario.horizon}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/organization/planning/scenarios/${scenario.id}`);
          }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Deep-Dive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ScenarioCard;
