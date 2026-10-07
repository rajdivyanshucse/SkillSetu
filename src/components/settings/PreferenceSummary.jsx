import React from 'react';
import { Compass, Shield, Bell, BookOpen, Layers } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { generateSettingsSummary } from '../../utils/settingsIntelligence';

export const PreferenceSummary = ({ className = '' }) => {
  const summary = generateSettingsSummary();

  const items = [
    {
      label: 'Target Role',
      value: summary.targetRole || 'Backend Engineer',
      icon: Compass,
    },
    {
      label: 'Profile Visibility',
      value: summary.visibility === 'visible_opportunities' ? 'Opportunity Matchers' : summary.visibility,
      icon: Shield,
    },
    {
      label: 'Work Mode',
      value: summary.workMode || 'Hybrid',
      icon: Layers,
    },
    {
      label: 'Active Notifications',
      value: `${summary.activeNotifsCount || 8} Categories`,
      icon: Bell,
    },
    {
      label: 'Learning Focus',
      value: summary.learningGoal || 'Skill improvement',
      icon: BookOpen,
    },
  ];

  return (
    <Card className={`p-4 bg-gradient-to-r from-canvas-subtle/80 via-white to-canvas-subtle/80 border-surface-border ${className}`}>
      <div className="flex items-center justify-between mb-3 border-b border-surface-border/60 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 font-mono">
          Current Intelligence Configuration
        </span>
        <Badge variant="outline" className="text-[10px] bg-brand-50 text-brand-800 border-brand-200">
          Simulated Context
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-charcoal-400 text-[11px]">
                <Icon className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="text-body-sm font-semibold text-charcoal-900 truncate">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PreferenceSummary;
