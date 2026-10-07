import React from 'react';
import { Compass, Clock, Zap, ArrowUpRight, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const FutureSkillSignals = ({
  futureSkills = [],
  onSelectSkill,
}) => {
  // Normalize future skills data
  const normalizedSkills = futureSkills.map((item) => {
    if (typeof item === 'string') {
      return {
        name: item,
        currentImportance: 'Medium',
        futureImportance: 'Critical',
        horizon: '1–2 Years',
        category: 'Emerging Competency',
        reason: 'Surfaced from organization strategic future skills selection.',
      };
    }
    return {
      name: item.name || item.skill || 'Emerging Tech',
      currentImportance: item.currentImportance || 'Medium',
      futureImportance: item.futureImportance || 'Critical',
      horizon: item.horizon || item.timeline || '0–12 Months',
      category: item.category || 'Strategic Competency',
      reason: item.reason || 'Flagged by organization as strategic capability priority for near-term roadmap.',
    };
  });

  const getImportanceBadge = (importance) => {
    switch (importance?.toLowerCase()) {
      case 'critical':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-danger-50 text-danger-700 border border-danger-200">
            Critical Priority
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-warning-50 text-warning-700 border border-warning-200">
            High Priority
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-brand-50 text-brand-700 border border-brand-200">
            Medium Priority
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
                Future Skill Priorities & Horizons
              </h3>
              <p className="text-body-xs text-charcoal-500">
                Emerging competencies identified for strategic workforce capability
              </p>
            </div>
          </div>
          <span className="text-body-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-xs">
            {normalizedSkills.length} Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {normalizedSkills.map((skill) => (
            <div
              key={skill.name}
              onClick={onSelectSkill ? () => onSelectSkill(skill.name) : undefined}
              className={`
                p-3.5 rounded-md border border-surface-border bg-canvas-subtle/50 hover:bg-surface hover:border-purple-300
                transition-all duration-150 flex flex-col justify-between group
                ${onSelectSkill ? 'cursor-pointer hover:shadow-subtle' : ''}
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-body-xs font-bold text-charcoal-900 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                    {skill.name}
                    {onSelectSkill && (
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
                    )}
                  </span>
                  {getImportanceBadge(skill.futureImportance)}
                </div>

                <p className="text-body-xs text-charcoal-600 line-clamp-2 mb-3">
                  {skill.reason}
                </p>
              </div>

              <div className="pt-2.5 border-t border-surface-border/80 flex items-center justify-between text-[11px] text-charcoal-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-500" />
                  Horizon: <strong className="text-charcoal-700 font-semibold">{skill.horizon}</strong>
                </span>
                <span className="text-charcoal-400">
                  Current: <span className="font-medium text-charcoal-600">{skill.currentImportance}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-body-xs text-charcoal-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          Surfaced from organization-configured capability horizons
        </span>
        <span className="text-[11px] text-charcoal-400 italic">
          Prototype Planning Horizon
        </span>
      </div>
    </div>
  );
};

export default FutureSkillSignals;
