import React from 'react';

export const ApplicationStatusBadge = ({ status = 'Saved', size = 'md' }) => {
  const normalized = status.toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case 'offer':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'interview':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300';
      case 'applied':
        return 'bg-brand-50 text-brand-800 border-brand-300';
      case 'closed':
        return 'bg-charcoal-100 text-charcoal-600 border-charcoal-300';
      case 'saved':
      default:
        return 'bg-canvas-subtle text-charcoal-700 border-surface-border-strong';
    }
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-xs border
        ${getStyle()}
        ${isSmall ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2.5 py-1'}
      `}
    >
      <span
        className={`rounded-full shrink-0 ${isSmall ? 'w-1 h-1' : 'w-1.5 h-1.5'} ${
          normalized === 'offer'
            ? 'bg-emerald-600'
            : normalized === 'interview'
            ? 'bg-indigo-600'
            : normalized === 'applied'
            ? 'bg-brand-600'
            : normalized === 'closed'
            ? 'bg-charcoal-400'
            : 'bg-charcoal-500'
        }`}
      />
      {status}
    </span>
  );
};

export default ApplicationStatusBadge;
