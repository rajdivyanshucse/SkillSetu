import React from 'react';
import { Sparkles, SearchX, AlertCircle, FileSearch, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'There are currently no items matching your criteria in the system.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'card', // 'card' | 'plain'
  className = '',
}) => {
  const defaultIcon = <FileSearch className="w-6 h-6 text-charcoal-400" />;

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center mb-4 text-charcoal-600 shadow-subtle">
        {icon || defaultIcon}
      </div>

      <h4 className="text-section-title text-charcoal-900 font-semibold tracking-tight">
        {title}
      </h4>

      <p className="text-body-sm text-charcoal-500 mt-2 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {secondaryActionLabel && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <div className={`bg-surface border border-surface-border rounded-lg shadow-card ${className}`}>
        {content}
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};

export const ErrorState = ({
  title = 'Unable to load workforce telemetry',
  description = 'An unexpected error occurred while communicating with the intelligence pipeline.',
  onRetry,
  retryLabel = 'Retry Connection',
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-lg bg-red-50/40 border border-red-200/80 flex flex-col items-center text-center max-w-lg mx-auto ${className}`}>
      <div className="w-10 h-10 rounded-full bg-red-100/80 text-status-danger-text flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>

      <h4 className="text-body-md font-semibold text-charcoal-900">{title}</h4>
      <p className="text-body-sm text-charcoal-600 mt-1 leading-normal max-w-sm">{description}</p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
          className="mt-4"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
