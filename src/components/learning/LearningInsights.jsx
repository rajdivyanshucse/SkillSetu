import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Compass, ArrowRight, ShieldCheck, Target, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { prototypeLearningInsights } from '../../data/learningData';

const typeIcons = {
  priority: Target,
  gap: TrendingUp,
  relevance: Compass,
  evidence: Sparkles,
};

const badgeStyles = {
  priority: { label: 'High Priority Gap', variant: 'danger' },
  gap: { label: 'Capability Delta', variant: 'warning' },
  relevance: { label: 'Role Alignment', variant: 'primary' },
  evidence: { label: 'Portfolio Evidence', variant: 'success' },
};

export const LearningInsights = ({ insights = prototypeLearningInsights }) => {
  const { navigate } = useRouter();

  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-brand-600" />
            Learning Intelligence Signals & Diagnostic Observations
          </h3>
          <p className="text-xs text-charcoal-500">
            Synthesized curriculum insights comparing your active skill velocity against target-role baselines
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Deterministic Insights
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((ins, idx) => {
          const Icon = typeIcons[ins.type] || Lightbulb;
          const badge = badgeStyles[ins.type] || badgeStyles.priority;

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
                  {ins.skill && (
                    <span className="text-[11px] font-mono text-charcoal-500">
                      Skill: {ins.skill}
                    </span>
                  )}
                </div>

                {/* Observation */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider block mb-0.5">
                    Observed Progress Data:
                  </span>
                  <p className="text-xs font-semibold text-charcoal-900 leading-snug">
                    {ins.observation}
                  </p>
                </div>

                {/* Context & Interpretation */}
                <div className="p-2.5 rounded bg-canvas-subtle/80 border border-surface-border text-xs space-y-1">
                  <div className="text-[11px] text-charcoal-600 leading-relaxed">
                    <strong className="text-charcoal-800">Context:</strong> {ins.context}
                  </div>
                  <div className="text-[11px] text-charcoal-700 leading-relaxed pt-1 border-t border-surface-border/50">
                    <strong className="text-brand-800">Strategic Interpretation:</strong> {ins.interpretation}
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
                    <span>{ins.linkText || 'Explore Next Action'}</span>
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

export default LearningInsights;
