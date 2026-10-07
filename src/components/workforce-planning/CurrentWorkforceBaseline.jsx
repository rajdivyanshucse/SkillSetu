import React from 'react';
import { Users, Building2, Award, Sparkles, Layers, Info } from 'lucide-react';
import { Card } from '../ui/Card';

export const CurrentWorkforceBaseline = ({
  headcount = 287,
  departments = {},
  seniority = {},
  avgCoverage = 64,
  className = '',
}) => {
  const defaultDepts = {
    Engineering: 120,
    Product: 30,
    Sales: 45,
    Operations: 60,
    HR: 12,
    'Data & Analytics': 20,
  };

  const activeDepts = Object.keys(departments).length > 0 ? departments : defaultDepts;

  const total = Object.values(activeDepts).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  ) || headcount;

  const deptColors = {
    Engineering: 'bg-brand-500',
    Product: 'bg-indigo-500',
    Sales: 'bg-emerald-500',
    Operations: 'bg-amber-500',
    HR: 'bg-purple-500',
    'Data & Analytics': 'bg-cyan-500',
    Marketing: 'bg-rose-500',
    Finance: 'bg-slate-500',
    Other: 'bg-stone-500',
  };

  const sortedDepts = Object.entries(activeDepts)
    .map(([dept, count]) => ({
      dept,
      count: parseInt(count, 10) || 0,
      pct: total > 0 ? Math.round(((parseInt(count, 10) || 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className={`bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Current Workforce Baseline
            </h3>
            <p className="text-xs text-charcoal-500">
              Operational headcount and department distribution snapshot
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black font-mono text-charcoal-900 leading-none">
            {total}
          </span>
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block mt-0.5">
            Active Baseline
          </span>
        </div>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-canvas-muted rounded-full overflow-hidden flex">
          {sortedDepts.map((d) => (
            <div
              key={d.dept}
              className={`h-full ${deptColors[d.dept] || 'bg-brand-400'}`}
              style={{ width: `${d.pct}%` }}
              title={`${d.dept}: ${d.count} (${d.pct}%)`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-charcoal-400 font-mono">
          <span>0%</span>
          <span>100% Departmental Allocation</span>
        </div>
      </div>

      {/* Grid of Department Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
        {sortedDepts.slice(0, 6).map((d) => (
          <div
            key={d.dept}
            className="p-2.5 rounded-xl bg-canvas-subtle/70 border border-surface-border flex items-center justify-between"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${deptColors[d.dept] || 'bg-brand-400'}`} />
              <span className="text-xs font-semibold text-charcoal-800 truncate">{d.dept}</span>
            </div>
            <span className="font-mono text-xs font-bold text-charcoal-900 ml-1 shrink-0">{d.count}</span>
          </div>
        ))}
      </div>

      {/* Context Notice */}
      <div className="p-3 rounded-xl bg-canvas-subtle/90 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span className="text-[11px]">
          Baseline derived from configured organization profile and prototype workforce data.
        </span>
      </div>
    </div>
  );
};

export default CurrentWorkforceBaseline;
