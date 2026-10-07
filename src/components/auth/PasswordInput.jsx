import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormField from '../ui/FormField';

export const PasswordInput = React.forwardRef(({
  id,
  label = 'Password',
  required = false,
  error,
  success,
  hint,
  placeholder = '••••••••',
  value,
  defaultValue,
  onChange,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'password');

  const inputElement = (
    <div className="relative flex items-center w-full">
      <input
        ref={ref}
        id={inputId}
        type={showPassword ? 'text' : 'password'}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full h-9 pl-3 pr-10 rounded-sm bg-surface text-charcoal-900 placeholder:text-charcoal-400
          text-body-sm transition-all duration-150 font-sans border
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

      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute right-2.5 p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-canvas-subtle rounded-xs transition-colors cursor-pointer select-none"
      >
        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
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

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
