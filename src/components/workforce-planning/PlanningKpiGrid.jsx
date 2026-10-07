import React from 'react';
import { Users, TrendingUp, AlertTriangle, Compass, UserPlus, Target } from 'lucide-react';
import { Card } from '../ui/Card';

export const PlanningKpiGrid = ({
  metrics = {},
  scenarioName = 'Growth',
  className = '',
}) => {
  const {
    currentHeadcount = 287,
    projectedHeadcount = 330,
    totalCapacityGap = 43,
    futureCriticalCount = 6,
    totalHiringUnits = 18,
    developmentPrioritiesCount = 8,
  } = metrics;

  const kpiItems = [
    {
      id: 'current',
      label: 'Current Workforce',
      value: currentHeadcount,
      unit: 'employees',
      desc: 'Configured baseline headcount',
      icon: Users,
      color: 'text-charcoal-900',
    },
    {
      id: 'projected',
      label: 'Projected Capability Demand',
      value: projectedHeadcount,
      unit: 'capability units',
      desc: `Illustrative requirement (${scenarioName})`,
      icon: TrendingUp,
      color: 'text-brand-700',
    },
    {
      id: 'gap',
      label: 'Projected Capacity Gap',
      value: totalCapacityGap,
      unit: 'gap units',
      desc: 'Across prioritized competencies',
      icon: AlertTriangle,
      color: 'text-amber-700',
    },
    {
      id: 'future-critical',
      label: 'Future-Critical Capabilities',
      value: futureCriticalCount,
      unit: 'strategic areas',
      desc: 'High-priority future capabilities',
      icon: Compass,
      color: 'text-purple-700',
    },
    {
      id: 'hiring',
      label: 'Potential Hiring Actions',
      value: totalHiringUnits,
      unit: 'scenario allocations',
      desc: 'External talent acquisition signals',
      icon: UserPlus,
      color: 'text-accent-700',
    },
    {
      id: 'dev',
      label: 'Development Priorities',
      value: developmentPrioritiesCount,
      unit: 'focus vectors',
      desc: 'Skills suitable for internal upskilling',
      icon: Target,
      color: 'text-emerald-700',
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {kpiItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.id}
            className="p-4 bg-surface hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-2 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider truncate">
                {item.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            </div>

            <div>
              <div className={`text-2xl font-black font-mono tracking-tight ${item.color}`}>
                {item.value}
              </div>
              <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                {item.unit}
              </span>
            </div>

            <p className="text-[11px] text-charcoal-500 leading-tight pt-1 border-t border-surface-border/60">
              {item.desc}
            </p>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanningKpiGrid;
