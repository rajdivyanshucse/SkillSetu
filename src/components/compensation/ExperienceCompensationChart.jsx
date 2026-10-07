import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Info } from 'lucide-react';
import { experienceBands } from '../../data/compensationData';

export const ExperienceCompensationChart = ({
  bands = experienceBands,
  className = '',
}) => {
  const maxMedian = Math.max(...bands.map((b) => b.medianLpa || 1));

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Advertised Compensation by Experience Band
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Observational spread across tenure brackets in the prototype dataset.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          Pattern Analysis
        </span>
      </div>

      {/* Bands Grid / Rows */}
      <div className="space-y-4">
        {bands.map((band, idx) => {
          const widthPct = Math.round((band.medianLpa / maxMedian) * 100);

          return (
            <div
              key={band.id}
              className="p-3 rounded-md bg-canvas-subtle/50 border border-surface-border/80 space-y-2 hover:border-brand-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-charcoal-900 text-sm">
                    {band.label}
                  </span>
                  <span className="text-[11px] font-semibold text-charcoal-500">
                    ({band.subtext})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                      Advertised Median
                    </span>
                    <span className="font-extrabold text-charcoal-900 text-sm">
                      ₹{band.medianLpa} LPA
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-surface-border">
                    <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                      Typical Range
                    </span>
                    <span className="font-semibold text-charcoal-700 text-xs">
                      {band.typicalRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Visualizing Median Progression */}
              <div className="h-2 w-full bg-canvas-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full"
                />
              </div>

              <p className="text-[11px] text-charcoal-600 leading-relaxed pt-0.5">
                {band.insight}
              </p>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-start gap-1.5 text-[11px] text-charcoal-500">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5" />
        <span>
          Advertised compensation pattern by experience band. This is not a personalized salary trajectory prediction or guaranteed increment timeline.
        </span>
      </div>
    </div>
  );
};
