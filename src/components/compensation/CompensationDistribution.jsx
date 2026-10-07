import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Info } from 'lucide-react';
import { compensationDistributionBuckets } from '../../data/compensationData';

export const CompensationDistribution = ({
  buckets = compensationDistributionBuckets,
  className = '',
  title = 'Advertised Compensation Distribution',
  subtitle = 'Observed compensation brackets across 28 fictional prototype opportunity records.',
}) => {
  const maxPercentage = Math.max(...buckets.map((b) => b.percentage || 1));

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          Prototype Distribution
        </span>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-3.5">
        {buckets.map((bucket, index) => {
          const widthPct = Math.round((bucket.percentage / maxPercentage) * 100);

          return (
            <div key={bucket.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-charcoal-900 w-20">
                    {bucket.label}
                  </span>
                  <span className="text-[11px] text-charcoal-500 hidden sm:inline">
                    {bucket.description}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-charcoal-900">{bucket.count} opportunities</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-canvas-muted text-charcoal-600 font-bold">
                    {bucket.percentage}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div className="h-3 w-full bg-canvas-muted rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    index === 2
                      ? 'bg-brand-600' // modal band
                      : index >= 3
                      ? 'bg-emerald-600'
                      : 'bg-amber-600'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-start gap-1.5 text-[11px] text-charcoal-500">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5" />
        <span>
          Distribution of advertised compensation in prototype opportunity data. Does not represent actual employee payroll or real-world market census.
        </span>
      </div>
    </div>
  );
};
