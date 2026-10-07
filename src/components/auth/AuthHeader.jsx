import React from 'react';

export const AuthHeader = ({
  badge,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60 mb-1">
          {badge}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-body-sm text-charcoal-500 leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
