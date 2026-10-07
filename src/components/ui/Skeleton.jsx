import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <Loader2 className={`animate-spin text-brand-600 ${sizes[size] || sizes.md} ${className}`} />
  );
};

export const Skeleton = ({
  className = '',
  width,
  height,
  rounded = 'rounded-xs',
}) => {
  return (
    <div
      style={{ width, height }}
      className={`
        bg-charcoal-200/60 shimmer-mask ${rounded} ${className}
      `}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-3.5 ${
            idx === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-lg border border-surface-border bg-surface flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-16 rounded-xs" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <div className="pt-3 border-t border-surface-border flex items-center justify-between">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 4, cols = 4, className = '' }) => {
  return (
    <div className={`w-full border border-surface-border rounded-lg bg-surface overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="p-3.5 bg-canvas-subtle/70 border-b border-surface-border flex items-center gap-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="h-3.5 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-surface-border">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-3.5 flex items-center gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={`h-3.5 flex-1 ${cIdx === 0 ? 'w-1/3' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonChart = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-lg border border-surface-border bg-surface flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 w-1/3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-7 w-24 rounded-xs" />
      </div>

      <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2">
        {[40, 65, 30, 85, 55, 90, 70, 45, 95].map((heightPct, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <Skeleton
              className="w-full rounded-t-xs"
              style={{ height: `${heightPct}%` }}
            />
            <Skeleton className="h-2.5 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PageLoadingState = ({
  message = 'Synthesizing workforce intelligence telemetry...',
}) => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-3 p-8 text-center">
      <Spinner size="lg" />
      <p className="text-body-sm font-medium text-charcoal-600 max-w-sm">{message}</p>
    </div>
  );
};

export default Skeleton;
