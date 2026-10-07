import React from 'react';
import { Sliders, Check, MapPin, DollarSign, Globe, Award } from 'lucide-react';
import {
  workforceStrategies,
  learningPreferencesList,
  hiringPreferencesList,
  budgetTiers,
} from '../../data/organizationData';

export const OrganizationPreferences = ({
  preferencesData,
  onChange,
  errors = {},
}) => {
  const selectedLearning = preferencesData.learningPreferences || [];
  const selectedHiring = preferencesData.hiringPreferences || [];

  const handleToggleLearning = (item) => {
    let updated;
    if (selectedLearning.includes(item)) {
      updated = selectedLearning.filter((l) => l !== item);
    } else {
      updated = [...selectedLearning, item];
    }
    onChange({ learningPreferences: updated });
  };

  const handleToggleHiring = (item) => {
    let updated;
    if (selectedHiring.includes(item)) {
      updated = selectedHiring.filter((h) => h !== item);
    } else {
      updated = [...selectedHiring, item];
    }
    onChange({ hiringPreferences: updated });
  };

  return (
    <div className="space-y-6">
      {/* Primary Workforce Strategy */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Primary Workforce Development Strategy <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {workforceStrategies.map((strat) => {
            const isSelected = preferencesData.workforceStrategy === strat;
            return (
              <button
                key={strat}
                type="button"
                onClick={() => onChange({ workforceStrategy: strat })}
                className={`
                  p-3 rounded-lg text-xs font-semibold text-center transition-all border cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs ring-1 ring-brand-200'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                {strat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="space-y-2 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Preferred Learning & Development Formats <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-charcoal-500">
            {selectedLearning.length} selected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {learningPreferencesList.map((item) => {
            const isSelected = selectedLearning.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleLearning(item)}
                className={`
                  p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer text-left
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.learningPreferences && (
          <p className="text-xs text-rose-600 font-medium">{errors.learningPreferences}</p>
        )}
      </div>

      {/* Hiring Preferences */}
      <div className="space-y-2 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Hiring Engagement Models
          </label>
          <span className="text-[11px] text-charcoal-500">
            {selectedHiring.length} selected
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {hiringPreferencesList.map((item) => {
            const isSelected = selectedHiring.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleHiring(item)}
                className={`
                  p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer text-left
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Remote Support & Budget Tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-surface-border">
        {/* Remote Support */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Remote Workforce Policy
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Yes (Fully Remote)', 'No (On-site)', 'Hybrid'].map((opt) => {
              const val = opt.split(' ')[0];
              const isSelected = preferencesData.remoteSupport === val;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ remoteSupport: val })}
                  className={`
                    p-2.5 rounded-lg text-xs font-semibold text-center transition-all border cursor-pointer
                    ${
                      isSelected
                        ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs'
                        : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle'
                    }
                  `}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Tier */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            L&D Investment Allocation Tier
          </label>
          <select
            value={preferencesData.budgetTier || 'Enterprise-scale'}
            onChange={(e) => onChange({ budgetTier: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs font-semibold bg-surface border border-surface-border rounded-lg text-charcoal-900 focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {budgetTiers.map((tier) => (
              <option key={tier} value={tier}>
                {tier} Allocation
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPreferences;
