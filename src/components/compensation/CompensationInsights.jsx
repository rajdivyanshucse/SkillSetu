import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { prototypeCompensationInsights } from '../../data/compensationData';

export const CompensationInsights = ({
  insights = prototypeCompensationInsights,
  className = '',
  title = 'Compensation Intelligence Observations',
  subtitle = 'Deterministic insights derived from structured prototype opportunity parameters.',
}) => {
  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60 self-start sm:self-auto">
          Contextual Observations
        </span>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: idx * 0.04 }}
            className="p-3.5 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-200 transition-colors flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-charcoal-900">
                  {item.title}
                </span>
                {item.category && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-canvas-muted text-charcoal-600 border border-surface-border/60">
                    {item.category}
                  </span>
                )}
              </div>

              <p className="text-xs text-charcoal-700 leading-relaxed font-medium">
                {item.observation}
              </p>

              {item.supportingMetric && (
                <div className="mt-2 p-2 rounded bg-surface border border-surface-border/70 text-[11px] font-semibold text-brand-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{item.supportingMetric}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-2 border-t border-surface-border/60 text-[11px] text-charcoal-500">
              {item.context && (
                <p>
                  <strong className="text-charcoal-700">Context:</strong> {item.context}
                </p>
              )}
              {item.limitation && (
                <p className="text-charcoal-500 italic">
                  <strong className="text-charcoal-600">Limitation:</strong> {item.limitation}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
