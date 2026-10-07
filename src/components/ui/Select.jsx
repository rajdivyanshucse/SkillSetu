import React from 'react';
import { ChevronDown } from 'lucide-react';
import FormField from './FormField';

export const Select = React.forwardRef(({
  id,
  label,
  required,
  error,
  success,
  hint,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  placeholder = 'Select an option...',
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const selectElement = (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      <select
        ref={ref}
        id={selectId}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full h-9 pl-3 pr-9 rounded-sm bg-surface text-charcoal-900 appearance-none
          text-body-sm transition-all duration-150 font-sans border cursor-pointer
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/30' 
            : success
            ? 'border-status-success-border focus:border-status-success-dot focus:ring-1 focus:ring-status-success-border'
            : 'border-surface-border hover:border-surface-border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
          }
          disabled:bg-canvas-subtle disabled:text-charcoal-400 disabled:cursor-not-allowed
          outline-none
          ${className}
        `}
        {...props}
      >
        {placeholder && <option value="" disabled className="text-charcoal-400">{placeholder}</option>}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue} value={optValue} className="text-charcoal-900 bg-surface">
              {optLabel}
            </option>
          );
        })}
      </select>

      <ChevronDown className="absolute right-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
    </div>
  );

  if (label || error || success || hint) {
    return (
      <FormField id={selectId} label={label} required={required} error={error} success={success} hint={hint}>
        {selectElement}
      </FormField>
    );
  }

  return selectElement;
});

Select.displayName = 'Select';

export default Select;
