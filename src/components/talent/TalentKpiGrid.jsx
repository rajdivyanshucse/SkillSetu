import React from 'react';
import { Users, Sparkles, Bookmark, Briefcase, Layers, Target } from 'lucide-react';
import { Card } from '../ui/Card';

export const TalentKpiGrid = ({
  totalProfiles = 20,
  potentialMatches = 12,
  shortlistedCount = 0,
  targetRolesCount = 7,
  avgSkillCoverage = 74,
  developmentAreasCount = 8,
  className = '',
}) => {
  const kpis = [
    {
      id: 'total',
      label: 'Talent Profiles',
      value: totalProfiles,
      unit: 'calibrated',
      desc: 'Active talent pool in discovery',
      icon: Users,
      color: 'text-charcoal-900',
    },
    {
      id: 'matches',
      label: 'Potential Matches',
      value: potentialMatches,
      unit: 'aligned',
      desc: 'Profiles meeting role baseline',
      icon: Sparkles,
      color: 'text-brand-700',
    },
    {
      id: 'shortlist',
      label: 'Shortlisted',
      value: shortlistedCount,
      unit: 'saved',
      desc: 'Candidates tagged for review',
      icon: Bookmark,
      color: 'text-accent-700',
    },
    {
      id: 'roles',
      label: 'Target Roles',
      value: targetRolesCount,
      unit: 'configured',
      desc: 'Active role requirement definitions',
      icon: Briefcase,
      color: 'text-charcoal-900',
    },
    {
      id: 'coverage',
      label: 'Skill Match Coverage',
      value: `${avgSkillCoverage}%`,
      unit: 'average',
      desc: 'Mean requirement alignment',
      icon: Layers,
      color: 'text-emerald-700',
    },
    {
      id: 'dev',
      label: 'Development Areas',
      value: developmentAreasCount,
      unit: 'identified',
      desc: 'Skills for internal coaching',
      icon: Target,
      color: 'text-purple-700',
    },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {kpis.map((item) => {
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

export default TalentKpiGrid;
