import React from 'react';
import { Users, Building2, PieChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const WorkforceSnapshot = ({
  departments = {
    Engineering: 120,
    Product: 30,
    Sales: 45,
    Operations: 60,
    HR: 12,
    'Data & Analytics': 20,
  },
  className = '',
}) => {
  const totalEmployees = Object.values(departments).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  );

  const deptColors = {
    Engineering: 'bg-brand-500 text-brand-800',
    Product: 'bg-indigo-500 text-indigo-800',
    Sales: 'bg-emerald-500 text-emerald-800',
    Operations: 'bg-amber-500 text-amber-800',
    HR: 'bg-purple-500 text-purple-800',
    'Data & Analytics': 'bg-cyan-500 text-cyan-800',
    Marketing: 'bg-rose-500 text-rose-800',
    Finance: 'bg-slate-500 text-slate-800',
    Other: 'bg-stone-500 text-stone-800',
  };

  const sortedDepts = Object.entries(departments)
    .map(([dept, count]) => ({
      dept,
      count: parseInt(count, 10) || 0,
      pct: totalEmployees > 0 ? Math.round(((parseInt(count, 10) || 0) / totalEmployees) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className={`p-5 space-y-4 bg-surface ${className}`}>
      <CardHeader className="p-0 pb-3 border-b border-surface-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Workforce Snapshot & Distribution</CardTitle>
              <CardDescription>
                Departmental headcount allocation across organizational units.
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-black font-mono text-charcoal-900 leading-none">
              {totalEmployees}
            </span>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mt-0.5">
              Total Staff
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Multi-segment Segmented Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-canvas-muted rounded-full overflow-hidden flex shadow-inner">
          {sortedDepts.map((item) => (
            <div
              key={item.dept}
              className={`h-full transition-all duration-300 ${
                deptColors[item.dept]?.split(' ')[0] || 'bg-brand-400'
              }`}
              style={{ width: `${item.pct}%` }}
              title={`${item.dept}: ${item.count} employees (${item.pct}%)`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-charcoal-400 font-mono">
          <span>0%</span>
          <span>100% Departmental Allocation</span>
        </div>
      </div>

      {/* Department Breakdown List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {sortedDepts.map((item) => (
          <div
            key={item.dept}
            className="p-2.5 rounded-lg bg-canvas-subtle/80 border border-surface-border flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  deptColors[item.dept]?.split(' ')[0] || 'bg-brand-400'
                }`}
              />
              <span className="text-xs font-semibold text-charcoal-800 truncate">
                {item.dept}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs shrink-0">
              <span className="font-bold text-charcoal-900">{item.count}</span>
              <span className="text-[10px] font-bold text-charcoal-400">({item.pct}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WorkforceSnapshot;
