import React from 'react';

export const Radio = React.forwardRef(({
  id,
  name,
  value,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const radioId = id || `radio-${name}-${value}`;

  return (
    <label
      htmlFor={radioId}
      className={`
        inline-flex items-start gap-2.5 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            w-4 h-4 rounded-full border transition-all duration-150 flex items-center justify-center
            ${checked
              ? 'border-brand-500 bg-surface'
              : 'border-surface-border bg-surface peer-hover:border-surface-border-strong'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/20 peer-focus-visible:ring-offset-1
          `}
        >
          {checked && (
            <div className="w-2 h-2 rounded-full bg-brand-500" />
          )}
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
        </div>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';

export const RadioGroup = ({
  name,
  options = [],
  value,
  onChange,
  className = '',
  layout = 'vertical', // 'vertical' | 'horizontal' | 'cards'
}) => {
  return (
    <div
      className={`
        flex
        ${layout === 'horizontal' ? 'flex-row gap-6 items-center' : ''}
        ${layout === 'vertical' ? 'flex-col gap-3' : ''}
        ${layout === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}
        ${className}
      `}
    >
      {options.map((opt) => {
        const isChecked = value === opt.value;
        if (layout === 'cards') {
          return (
            <div
              key={opt.value}
              onClick={() => !opt.disabled && onChange && onChange(opt.value)}
              className={`
                p-3.5 rounded-md border transition-all duration-150 cursor-pointer
                ${isChecked 
                  ? 'border-brand-500 bg-brand-50/50 shadow-subtle' 
                  : 'border-surface-border bg-surface hover:border-surface-border-strong hover:bg-canvas-subtle/50'
                }
                ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Radio
                name={name}
                value={opt.value}
                checked={isChecked}
                label={opt.label}
                description={opt.description}
                disabled={opt.disabled}
                onChange={() => onChange && onChange(opt.value)}
              />
            </div>
          );
        }

        return (
          <Radio
            key={opt.value}
            name={name}
            value={opt.value}
            checked={isChecked}
            label={opt.label}
            description={opt.description}
            disabled={opt.disabled}
            onChange={() => onChange && onChange(opt.value)}
          />
        );
      })}
    </div>
  );
};

export default Radio;
