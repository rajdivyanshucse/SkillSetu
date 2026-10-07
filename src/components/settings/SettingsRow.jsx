import React from 'react';

export const SettingsRow = ({
  title,
  description,
  control,
  icon: Icon,
  disabled = false,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
        ${className}
      `}
    >
      <div className="flex items-start gap-3 max-w-xl">
        {Icon && (
          <div className="p-2 rounded-md bg-canvas-subtle text-charcoal-600 shrink-0 mt-0.5">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h4 className="text-body-sm font-semibold text-charcoal-900 leading-snug">
            {title}
          </h4>
          {description && (
            <p className="text-caption text-charcoal-500 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 sm:self-center">{control}</div>
    </div>
  );
};

export default SettingsRow;
