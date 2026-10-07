import React from 'react';
import { Check, Minus } from 'lucide-react';

export const Checkbox = React.forwardRef(({
  id,
  label,
  description,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  className = '',
  error,
  ...props
}, ref) => {
  const checkboxId = id || (label ? `cb-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`
        inline-flex items-start gap-2.5 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            w-4 h-4 rounded-xs border transition-all duration-150 flex items-center justify-center
            ${error
              ? 'border-red-400 bg-surface'
              : checked || indeterminate
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-surface border-surface-border peer-hover:border-surface-border-strong'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/20 peer-focus-visible:ring-offset-1
          `}
        >
          {checked && !indeterminate && <Check className="w-3 h-3 stroke-[3]" />}
          {indeterminate && <Minus className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-body-sm font-medium text-charcoal-800 leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-charcoal-500 mt-0.5 leading-normal">
              {description}
            </span>
          )}
          {error && (
            <span className="text-xs text-status-danger-text mt-0.5">{error}</span>
          )}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
