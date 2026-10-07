import React from 'react';

export const SectionHeader = ({
  badge,
  title,
  description,
  align = 'center', // 'left' | 'center'
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`space-y-3 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60 ${isCenter ? 'mx-auto' : ''}`}>
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-page-title sm:text-display text-charcoal-900 font-bold tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-body-md sm:text-body-lg text-charcoal-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
