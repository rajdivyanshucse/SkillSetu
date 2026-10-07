import React from 'react';
import { motion } from 'framer-motion';

export const Toggle = React.forwardRef(({
  id,
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  size = 'md', // 'sm' | 'md'
  className = '',
  ...props
}, ref) => {
  const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const switchDimensions = {
    sm: { track: 'w-7 h-4', thumb: 'w-3 h-3', translate: 12 },
    md: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 16 },
  };

  const dim = switchDimensions[size] || switchDimensions.md;

  return (
    <label
      htmlFor={toggleId}
      className={`
        inline-flex items-start gap-3 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
    >
      <div className="relative flex items-center mt-0.5 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`
            ${dim.track} rounded-full p-0.5 transition-colors duration-200 ease-out flex items-center
            ${checked ? 'bg-brand-500' : 'bg-charcoal-200 peer-hover:bg-charcoal-300'}
            peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/20 peer-focus-visible:ring-offset-1
          `}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            animate={{ x: checked ? dim.translate : 0 }}
            className={`${dim.thumb} rounded-full bg-white shadow-sm`}
          />
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

Toggle.displayName = 'Toggle';

export default Toggle;
