import React from 'react';
import FormField from './FormField';

export const Textarea = React.forwardRef(({
  id,
  label,
  required,
  error,
  success,
  hint,
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled = false,
  rows = 3,
  maxLength,
  showCount = false,
  className = '',
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  const textareaElement = (
    <div className="relative w-full">
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`
          w-full rounded-sm bg-surface text-charcoal-900 placeholder:text-charcoal-400
          text-body-sm p-3 transition-all duration-150 font-sans border resize-y
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
      />
      {showCount && maxLength && (
        <div className="text-[11px] text-right text-charcoal-400 mt-1 font-mono">
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );

  if (label || error || success || hint) {
    return (
      <FormField id={textareaId} label={label} required={required} error={error} success={success} hint={hint}>
        {textareaElement}
      </FormField>
    );
  }

  return textareaElement;
});

Textarea.displayName = 'Textarea';

export default Textarea;
