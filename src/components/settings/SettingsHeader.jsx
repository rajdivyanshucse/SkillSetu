import React from 'react';
import { Settings, ArrowLeft } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const SettingsHeader = ({
  title = 'Settings',
  subtitle = 'Manage your account preferences, privacy controls, and workspace intelligence.',
  badge = 'Prototype Controls',
  backUrl,
  backLabel = 'Back',
  actions,
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`border-b border-surface-border pb-5 space-y-3 ${className}`}>
      {backUrl && (
        <div>
          <button
            type="button"
            onClick={() => navigate(backUrl)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-charcoal-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backLabel}
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-charcoal-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <Badge variant="outline" className="text-xs bg-brand-50 text-brand-800 border-brand-200">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-body-sm text-charcoal-600 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default SettingsHeader;
