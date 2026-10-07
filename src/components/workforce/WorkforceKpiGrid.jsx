import React from 'react';
import { Users, Layers, Sparkles, AlertCircle, Compass, Target } from 'lucide-react';
import { Card } from '../ui/Card';

export const WorkforceKpiGrid = ({ metrics = {}, className = '' }) => {
  const kpiItems = [
    {
      id: 'workforce',
      label: 'Total Workforce',
      value: metrics.totalEmployees ?? 287,
      unit: 'employees',
      desc: 'Active headcount across departments',
      icon: Users,
      color: 'text-charcoal-900',
    },
    {
      id: 'skills',
      label: 'Skills Tracked',
      value: metrics.skillsCount ?? 18,
      unit: 'competencies',
      desc: 'Active organizational skill inventory',
      icon: Layers,
      color: 'text-charcoal-900',
    },
    {
      id: 'coverage',
      label: 'Average Skill Coverage',
      value: `${metrics.averageCoverage ?? 64}%`,
      unit: 'mean density',
      desc: 'Mean team proficiency across skills',
      icon: Sparkles,
      color: 'text-brand-700',
    },
    {
      id: 'gaps',
      label: 'Priority Skill Gaps',
      value: metrics.priorityGapsCount ?? 6,
      unit: 'focus areas',
      desc: 'Skills requiring development attention',
      icon: AlertCircle,
      color: 'text-amber-700',
    },
    {
      id: 'future',
      label: 'Future-Critical Skills',
      value: metrics.futureCriticalCount ?? 5,
      unit: 'horizons',
      desc: 'Strategic emerging capabilities',
      icon: Compass,
      color: 'text-emerald-700',
    },
    {
      id: 'focus',
      label: 'Development Focus Areas',
      value: metrics.developmentFocusCount ?? 10,
      unit: 'initiatives',
      desc: 'Active upskilling and talent cohorts',
      icon: Target,
      color: 'text-indigo-700',
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {kpiItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.id}
            className="p-4 bg-surface hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-2"
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

export default WorkforceKpiGrid;
