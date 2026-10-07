import React from 'react';
import { Layers, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { industryOptions, businessFunctionsList } from '../../data/organizationData';

export const IndustryBusinessForm = ({
  industryData,
  onChange,
  errors = {},
}) => {
  const handleToggleFunction = (fnName) => {
    const current = industryData.businessFunctions || [];
    let updated;
    if (current.includes(fnName)) {
      updated = current.filter((item) => item !== fnName);
    } else {
      updated = [...current, fnName];
    }
    onChange({ businessFunctions: updated });
  };

  return (
    <div className="space-y-6">
      {/* Primary Industry */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Primary Industry Sector <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {industryOptions.map((ind) => {
            const isSelected = industryData.primaryIndustry === ind;
            return (
              <button
                key={ind}
                type="button"
                onClick={() => onChange({ primaryIndustry: ind })}
                className={`
                  p-3 rounded-lg text-xs font-semibold text-left transition-all border cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs ring-1 ring-brand-200'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                {ind}
              </button>
            );
          })}
        </div>
        {errors.primaryIndustry && (
          <p className="text-xs text-rose-600 font-medium">{errors.primaryIndustry}</p>
        )}
      </div>

      {/* Business Functions (Multi-Select) */}
      <div className="space-y-2 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Key Business Functions & Departments <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-charcoal-500">
            {(industryData.businessFunctions || []).length} selected
          </span>
        </div>
        <p className="text-xs text-charcoal-500">
          Select all functional areas present in your organizational structure.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {businessFunctionsList.map((fn) => {
            const isSelected = (industryData.businessFunctions || []).includes(fn);
            return (
              <button
                key={fn}
                type="button"
                onClick={() => handleToggleFunction(fn)}
                className={`
                  p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all border cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                <span>{fn}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-700" />}
              </button>
            );
          })}
        </div>
        {errors.businessFunctions && (
          <p className="text-xs text-rose-600 font-medium">{errors.businessFunctions}</p>
        )}
      </div>

      {/* Primary Business Areas & Description */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Primary Business Focus Areas / Product Lines
          </label>
          <input
            type="text"
            value={industryData.primaryBusinessAreas || ''}
            onChange={(e) => onChange({ primaryBusinessAreas: e.target.value })}
            placeholder="e.g. Enterprise Software Products, Cloud Data Platforms, B2B SaaS"
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Short Business Summary
          </label>
          <textarea
            rows={2}
            value={industryData.shortDescription || ''}
            onChange={(e) => onChange({ shortDescription: e.target.value })}
            placeholder="Briefly describe what your organization delivers to clients or markets..."
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default IndustryBusinessForm;
