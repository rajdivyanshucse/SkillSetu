import React from 'react';
import { Clock, BookOpen, Layers, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge';

export const DevelopmentActivity = ({
  activity,
  className = '',
}) => {
  if (!activity) return null;

  const getIcon = (type = '') => {
    if (type.includes('Course') || type.includes('Learning')) {
      return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
    }
    if (type.includes('Skill')) {
      return <Layers className="w-3.5 h-3.5 text-brand-600" />;
    }
    if (type.includes('Project')) {
      return <Briefcase className="w-3.5 h-3.5 text-purple-600" />;
    }
    if (type.includes('Milestone')) {
      return <Award className="w-3.5 h-3.5 text-amber-600" />;
    }
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
  };

  return (
    <div className={`p-3 rounded-lg bg-canvas-subtle/50 border border-surface-border flex items-start justify-between gap-3 text-xs ${className}`}>
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-full bg-surface border border-surface-border shrink-0 mt-0.5 shadow-2xs">
          {getIcon(activity.type)}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal-900">
              {activity.title}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface text-charcoal-600 border border-surface-border">
              {activity.type}
            </span>
          </div>
          <div className="text-[11px] text-charcoal-500">
            {activity.relatedSkill && <span>{activity.relatedSkill} • </span>}
            <span className="text-brand-700 font-semibold">{activity.impact}</span>
          </div>
        </div>
      </div>

      <span className="text-[11px] text-charcoal-400 font-medium shrink-0">
        {activity.date}
      </span>
    </div>
  );
};

export default DevelopmentActivity;
