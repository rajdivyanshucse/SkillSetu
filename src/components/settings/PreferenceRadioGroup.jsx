import React from 'react';
import { Check } from 'lucide-react';

export const PreferenceRadioGroup = ({
  options = [], // [{ value, label, description, badge }]
  value,
  onChange,
  disabled = false,
  layout = 'grid', // 'grid' | 'stack'
  columns = 2,
  className = '',
}) => {
  return (
    <div
      className={`
        ${layout === 'grid' ? `grid grid-cols-1 md:grid-cols-${columns} gap-3` : 'space-y-2.5'}
        ${className}
      `}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => !disabled && onChange && onChange(opt.value)}
            className={`
              p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between
              ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/20'
                  : 'border-surface-border bg-white hover:border-brand-300 hover:bg-canvas-subtle/30'
              }
              ${disabled ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-body-sm font-semibold ${isSelected ? 'text-brand-950' : 'text-charcoal-900'}`}>
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-charcoal-600 border border-stone-200">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-caption text-charcoal-500 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                )}
              </div>

              <div
                className={`
                  w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors
                  ${
                    isSelected
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-charcoal-300 bg-white'
                  }
                `}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreferenceRadioGroup;
