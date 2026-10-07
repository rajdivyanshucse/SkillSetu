import React from 'react';

export const OnboardingHeader = ({
  stepNumber,
  totalSteps = 8,
  badge = 'Calibration Step',
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`space-y-2 pb-6 border-b border-surface-border ${className}`}>
      <div className="flex items-center justify-between">
        {badge && (
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            <span>{badge}</span>
          </div>
        )}
        {stepNumber && (
          <span className="text-[11px] font-mono font-medium text-charcoal-400">
            Step {stepNumber} of {totalSteps}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="text-body-sm text-charcoal-600 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default OnboardingHeader;
