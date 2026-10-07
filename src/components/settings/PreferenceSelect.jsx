import React from 'react';
import { Select } from '../ui/Select';

export const PreferenceSelect = ({
  id,
  label,
  description,
  value,
  onChange,
  options = [],
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-body-sm font-semibold text-charcoal-900 block">
          {label}
        </label>
      )}
      <Select
        id={id}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        options={options}
        disabled={disabled}
      />
      {description && (
        <p className="text-caption text-charcoal-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default PreferenceSelect;
