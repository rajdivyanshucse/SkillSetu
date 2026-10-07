import React from 'react';
import Card from '../ui/Card';

export const SettingsSection = ({
  title,
  description,
  badge,
  action,
  children,
  className = '',
}) => {
  return (
    <Card className={`border-surface-border bg-surface overflow-hidden divide-y divide-surface-border ${className}`}>
      {(title || description || action) && (
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-body-md font-bold text-charcoal-900 font-serif">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {description && (
              <p className="text-body-sm text-charcoal-500 mt-0.5 leading-normal">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className="p-5 space-y-4">{children}</div>
    </Card>
  );
};

export default SettingsSection;
