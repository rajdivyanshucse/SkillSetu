import React from 'react';
import { Target, AlertTriangle, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import {
  workforcePrioritiesList,
  workforceChallengesList,
} from '../../data/organizationData';

export const WorkforcePrioritySelector = ({
  prioritiesData,
  onChange,
  errors = {},
}) => {
  const selectedPriorities = prioritiesData.strategicPriorities || [];
  const selectedChallenges = prioritiesData.workforceChallenges || [];

  const handleTogglePriority = (item) => {
    let updated;
    if (selectedPriorities.includes(item)) {
      updated = selectedPriorities.filter((p) => p !== item);
    } else {
      updated = [...selectedPriorities, item];
    }
    onChange({ strategicPriorities: updated });
  };

  const handleToggleChallenge = (item) => {
    let updated;
    if (selectedChallenges.includes(item)) {
      updated = selectedChallenges.filter((c) => c !== item);
    } else {
      updated = [...selectedChallenges, item];
    }
    onChange({ workforceChallenges: updated });
  };

  return (
    <div className="space-y-6">
      {/* Strategic Workforce Priorities */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Strategic Workforce Priorities <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-charcoal-500">
            {selectedPriorities.length} selected
          </span>
        </div>
        <p className="text-xs text-charcoal-500">
          Select the strategic talent and capability goals your leadership is currently focusing on.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {workforcePrioritiesList.map((item) => {
            const isSelected = selectedPriorities.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleTogglePriority(item)}
                className={`
                  p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer text-left
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs ring-1 ring-brand-200'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
        {errors.strategicPriorities && (
          <p className="text-xs text-rose-600 font-medium">{errors.strategicPriorities}</p>
        )}
      </div>

      {/* Workforce Challenges */}
      <div className="space-y-2 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Most Pressing Workforce Challenges
          </label>
          <span className="text-[11px] text-charcoal-500">
            {selectedChallenges.length} selected
          </span>
        </div>
        <p className="text-xs text-charcoal-500">
          Identify operational, skill, or hiring bottlenecks your teams face.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {workforceChallengesList.map((item) => {
            const isSelected = selectedChallenges.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleChallenge(item)}
                className={`
                  p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer text-left
                  ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Strategic Context Notes */}
      <div className="space-y-1.5 pt-4 border-t border-surface-border">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Additional Strategic Context / Objectives
        </label>
        <textarea
          rows={2}
          value={prioritiesData.additionalNotes || ''}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="e.g. Preparing existing backend engineers for cloud-native microservice architecture..."
          className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
        />
      </div>
    </div>
  );
};

export default WorkforcePrioritySelector;
