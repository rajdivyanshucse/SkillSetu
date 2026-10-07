import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const FormField = ({
  label,
  required = false,
  error,
  success,
  hint,
  children,
  className = '',
  id,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-body-sm font-medium text-charcoal-800 flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-brand-600 font-semibold">*</span>}
          </label>
        </div>
      )}

      {children}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-status-danger-text animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && success && (
        <div className="flex items-center gap-1.5 text-xs text-status-success-text animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {!error && !success && hint && (
        <p className="text-xs text-charcoal-500">{hint}</p>
      )}
    </div>
  );
};

export default FormField;
