import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Laptop, Info, ArrowRight } from 'lucide-react';
import { locationBenchmarks } from '../../data/compensationData';

export const LocationCompensation = ({
  locations = locationBenchmarks,
  className = '',
  title = 'Location & Work Mode Intelligence',
  subtitle = 'Advertised compensation spreads across technology hubs and remote arrangements in the prototype dataset.',
}) => {
  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          7 Locations Analyzed
        </span>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {locations.map((loc, idx) => (
          <motion.div
            key={loc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
            className="p-3.5 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                    {loc.state} • {loc.tier}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                    {loc.name}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-canvas-muted text-charcoal-700">
                  {loc.opportunityCount} listings
                </span>
              </div>

              {/* Comp Stats */}
              <div className="my-2.5 p-2 rounded bg-surface border border-surface-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Advertised Median
                  </span>
                  <span className="font-extrabold text-charcoal-900 text-sm">
                    ₹{loc.medianLpa} LPA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Typical Span
                  </span>
                  <span className="font-semibold text-charcoal-700">
                    {loc.typicalRange}
                  </span>
                </div>
              </div>

              {/* Work Mode Breakdown */}
              <div className="mb-2.5 text-xs text-charcoal-600">
                <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
                  Work Mode Distribution
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span>Hybrid: <strong>{loc.workModeBreakdown.hybrid}%</strong></span>
                  <span>•</span>
                  <span>Remote: <strong>{loc.workModeBreakdown.remote}%</strong></span>
                  <span>•</span>
                  <span>On-site: <strong>{loc.workModeBreakdown.onSite}%</strong></span>
                </div>
              </div>

              <p className="text-[11px] text-charcoal-600 leading-relaxed italic mb-2">
                "{loc.observation}"
              </p>
            </div>

            {/* Dominant Roles */}
            {loc.dominantRoles && (
              <div className="pt-2 border-t border-surface-border/60 text-[11px] text-charcoal-500">
                <span className="font-medium text-charcoal-700">Frequent Roles: </span>
                <span>{loc.dominantRoles.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Methodology note */}
      <div className="mt-2 pt-3 border-t border-surface-border/60 flex items-start gap-1.5 text-[11px] text-charcoal-500">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0 mt-0.5" />
        <span>
          In the prototype opportunity dataset, advertised compensation distributions vary across metropolitan hubs and remote listings based on role composition and sample opportunity parameters.
        </span>
      </div>
    </div>
  );
};
