import React from 'react';
import { Toggle } from '../ui/Toggle';

export const PreferenceToggle = ({
  id,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${className}`}>
      <div className="space-y-0.5 max-w-xl">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-body-sm font-semibold text-charcoal-900 cursor-pointer">
            {label}
          </label>
          {badge}
        </div>
        {description && (
          <p className="text-caption text-charcoal-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="shrink-0 pt-0.5">
        <Toggle
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PreferenceToggle;
