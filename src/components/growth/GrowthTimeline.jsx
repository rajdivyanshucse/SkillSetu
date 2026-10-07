import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { initialGrowthTimeline } from '../../data/growthData';
import { DevelopmentActivity } from './DevelopmentActivity';

export const GrowthTimeline = ({
  activities = initialGrowthTimeline,
  className = '',
  title = 'Recent Development Activity Stream',
  subtitle = 'Chronological record of skill calibration, course progression, and milestone completions.',
}) => {
  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-3.5 ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-surface-border/70 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60">
          Activity Log
        </span>
      </div>

      {/* Activity Items */}
      <div className="space-y-2">
        {activities.map((act, idx) => (
          <motion.div
            key={act.id || idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: idx * 0.03 }}
          >
            <DevelopmentActivity activity={act} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GrowthTimeline;
