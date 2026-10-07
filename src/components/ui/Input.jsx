import React from 'react';
import { X, Search } from 'lucide-react';
import FormField from './FormField';

export const Input = React.forwardRef(({
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
  onClear,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  wrapperClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const inputElement = (
    <div className={`relative flex items-center w-full ${wrapperClassName}`}>
      {leftIcon && (
        <div className="absolute left-3 flex items-center pointer-events-none text-charcoal-400">
          {leftIcon}
        </div>
      )}

      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full h-9 rounded-sm bg-surface text-charcoal-900 placeholder:text-charcoal-400
          text-body-sm transition-all duration-150 font-sans
          border
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/30' 
            : success
            ? 'border-status-success-border focus:border-status-success-dot focus:ring-1 focus:ring-status-success-border'
            : 'border-surface-border hover:border-surface-border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15'
          }
          ${leftIcon ? 'pl-9' : 'pl-3'}
          ${rightIcon || onClear ? 'pr-9' : 'pr-3'}
          disabled:bg-canvas-subtle disabled:text-charcoal-400 disabled:cursor-not-allowed
          outline-none
          ${className}
        `}
        {...props}
      />

      {onClear && value && !disabled && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 p-0.5 text-charcoal-400 hover:text-charcoal-700 rounded-sm hover:bg-canvas-subtle transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {rightIcon && !onClear && (
        <div className="absolute right-3 flex items-center pointer-events-none text-charcoal-400">
          {rightIcon}
        </div>
      )}
    </div>
  );

  if (label || error || success || hint) {
    return (
      <FormField id={inputId} label={label} required={required} error={error} success={success} hint={hint}>
        {inputElement}
      </FormField>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export const SearchInput = React.forwardRef(({
  placeholder = 'Search skills, roles, benchmarks...',
  shortcut = '⌘K',
  onSearch,
  value,
  onChange,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-charcoal-400 pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full h-9 pl-9 pr-14 rounded-sm bg-surface text-charcoal-900 placeholder:text-charcoal-400
          text-body-sm transition-all duration-150 font-sans border border-surface-border
          hover:border-surface-border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15
          outline-none
        "
        {...props}
      />
      {shortcut && (
        <div className="absolute right-2.5 flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono font-medium text-charcoal-500 bg-canvas-subtle border border-surface-border rounded-xs">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default Input;
