import React from 'react';
import { Target, UserPlus, BookOpen, RefreshCw, Layers, Info } from 'lucide-react';

export const ActionMixPanel = ({
  actionMix = {
    hiring: 40,
    upskilling: 45,
    reskilling: 5,
    internalMobility: 10,
  },
  totalGap = 43,
  className = '',
}) => {
  const hireUnits = Math.round((totalGap * (actionMix.hiring || 40)) / 100);
  const upskillUnits = Math.round((totalGap * (actionMix.upskilling || 45)) / 100);
  const reskillUnits = Math.round((totalGap * (actionMix.reskilling || 5)) / 100);
  const mobilityUnits = Math.max(0, totalGap - (hireUnits + upskillUnits + reskillUnits));

  const items = [
    {
      label: 'Internal Upskilling',
      pct: actionMix.upskilling || 45,
      units: upskillUnits,
      icon: <BookOpen className="w-4 h-4 text-brand-600" />,
      color: 'bg-brand-500',
      bgColor: 'bg-brand-50 border-brand-200 text-brand-900',
      desc: 'Structured cohort-based training for current engineering and product staff.',
    },
    {
      label: 'External Hiring',
      pct: actionMix.hiring || 40,
      units: hireUnits,
      icon: <UserPlus className="w-4 h-4 text-accent-600" />,
      color: 'bg-accent-500',
      bgColor: 'bg-accent-50 border-accent-200 text-accent-900',
      desc: 'Targeted recruitment for senior architects and specialist lead roles.',
    },
    {
      label: 'Internal Mobility',
      pct: actionMix.internalMobility || 10,
      units: mobilityUnits,
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-900',
      desc: 'Cross-functional lateral rotations from legacy squads into high-demand pods.',
    },
    {
      label: 'Reskilling Pathways',
      pct: actionMix.reskilling || 5,
      units: reskillUnits,
      icon: <RefreshCw className="w-4 h-4 text-warning-600" />,
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50 border-warning-200 text-warning-900',
      desc: 'Deep career transitions for maintenance personnel into cloud and data.',
    },
  ];

  return (
    <div className={`bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Illustrative Workforce Action Mix
            </h3>
            <p className="text-xs text-charcoal-500">
              Potential planning allocation to bridge the projected {totalGap}-unit capability gap
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          Configured Scenario Mix
        </span>
      </div>

      {/* Multi-segment Segmented Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-canvas-muted rounded-full overflow-hidden flex">
          {items.map((it) => (
            <div
              key={it.label}
              className={`h-full ${it.color} transition-all duration-300`}
              style={{ width: `${it.pct}%` }}
              title={`${it.label}: ${it.pct}% (~${it.units} units)`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-charcoal-400 font-mono">
          <span>0%</span>
          <span>100% Action Mix Allocation</span>
        </div>
      </div>

      {/* Action Mix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className={`p-3.5 rounded-xl border ${it.bgColor} flex flex-col justify-between space-y-2`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="p-1 rounded-md bg-surface/80 border border-surface-border/60">
                  {it.icon}
                </span>
                <span className="font-mono font-black text-sm">
                  {it.pct}%
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight">
                {it.label}
              </h4>
              <span className="text-[11px] font-mono opacity-80 block mt-0.5">
                ~{it.units} capability units
              </span>
            </div>
            <p className="text-[10px] opacity-75 leading-relaxed pt-1 border-t border-current/20">
              {it.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Context Notice */}
      <div className="p-3 rounded-xl bg-canvas-subtle/80 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span className="text-[11px]">
          Percentages represent configured planning assumptions rather than mandatory allocations.
        </span>
      </div>
    </div>
  );
};

export default ActionMixPanel;
