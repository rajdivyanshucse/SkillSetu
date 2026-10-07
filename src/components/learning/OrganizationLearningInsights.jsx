import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Compass, ArrowRight, ShieldCheck, Target, Users } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { organizationLearningInsights } from '../../data/learningData';

const typeIcons = {
  priority: Target,
  alignment: Compass,
  observation: Lightbulb,
};

const badgeStyles = {
  priority: { label: 'Strategic Priority', variant: 'danger' },
  alignment: { label: 'Planning Alignment', variant: 'primary' },
  observation: { label: 'Capability Trend', variant: 'neutral' },
};

export const OrganizationLearningInsights = ({
  insights = organizationLearningInsights,
}) => {
  const { navigate } = useRouter();

  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-600" />
            Aggregate Workforce Learning Signals & Planning Insights
          </h3>
          <p className="text-xs text-charcoal-500">
            Strategic observations connecting internal development cohorts with multi-year capability horizons
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Aggregate Planning Only
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {insights.map((ins, idx) => {
          const Icon = typeIcons[ins.type] || Lightbulb;
          const badge = badgeStyles[ins.type] || badgeStyles.observation;

          return (
            <motion.div
              key={ins.id || idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.04 }}
              className="p-4 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-charcoal-900 leading-snug">
                  {ins.title}
                </h4>

                <p className="text-[11px] text-charcoal-700 leading-relaxed font-medium">
                  {ins.observation}
                </p>

                <div className="p-2.5 rounded bg-canvas-subtle/80 border border-surface-border text-xs space-y-1">
                  <div className="text-[11px] text-charcoal-600 leading-relaxed">
                    <strong className="text-charcoal-800">Context:</strong> {ins.context}
                  </div>
                  <div className="text-[11px] text-brand-900 leading-relaxed pt-1 border-t border-surface-border/50">
                    <strong>Recommended Strategy:</strong> {ins.potentialAction}
                  </div>
                </div>
              </div>

              {ins.link && (
                <div className="pt-2 border-t border-surface-border/60">
                  <button
                    type="button"
                    onClick={() => navigate(ins.link)}
                    className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{ins.linkText || 'Inspect Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrganizationLearningInsights;
