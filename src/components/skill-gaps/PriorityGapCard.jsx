import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  ShieldAlert,
  HelpCircle,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const PriorityGapCard = ({
  priorityGaps = [],
  onSelectSkill,
  className = '',
}) => {
  const getPriorityBadge = (priorityLabel) => {
    switch (priorityLabel) {
      case 'Critical':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
            Priority: Critical
          </span>
        );
      case 'High':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
            Priority: High
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-canvas-muted text-charcoal-700 border border-surface-border">
            Priority: Medium
          </span>
        );
    }
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200/60">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Priority Skill Gaps</CardTitle>
              <CardDescription>
                Focus on the gaps with the greatest relevance to your target role.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-charcoal-500 bg-canvas-subtle px-2.5 py-1 rounded-xs border border-surface-border self-start sm:self-auto">
            <span>Illustrative priority model</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Conceptual Prioritization Formula Banner */}
        <div className="p-3 rounded-lg bg-canvas-subtle/70 border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs text-charcoal-600">
          <div className="flex items-center gap-2 font-mono text-[11px] text-charcoal-800 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>Gap Size × Role Importance × Market Relevance × Future Relevance</span>
          </div>
          <span className="text-[10px] text-charcoal-400">
            Deterministic UI prioritization weighting
          </span>
        </div>

        {/* Ranked Gap Cards List */}
        <div className="space-y-3">
          {priorityGaps.map((gap, idx) => (
            <motion.div
              key={gap.id || gap.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-surface border border-surface-border hover:border-surface-border-strong hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left info */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-canvas-subtle border border-surface-border flex items-center justify-center font-mono font-bold text-xs text-charcoal-700 shrink-0">
                  0{idx + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-body-md font-bold text-charcoal-900 truncate">
                      {gap.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 bg-canvas-muted px-1.5 py-0.2 rounded-xs">
                      {gap.category}
                    </span>
                    {getPriorityBadge(gap.priorityLabel)}
                  </div>

                  <p className="text-xs text-charcoal-600 line-clamp-1 leading-normal">
                    {gap.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Middle Metrics Comparison */}
              <div className="flex items-center gap-4 text-xs border-t md:border-t-0 md:border-l border-surface-border pt-2 md:pt-0 md:pl-4 shrink-0 flex-wrap sm:flex-nowrap">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-charcoal-400 uppercase font-semibold block">
                    Current
                  </span>
                  <span className="font-bold text-charcoal-800">
                    {gap.userLevel}
                  </span>
                </div>

                <div className="text-charcoal-300 font-bold">→</div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-brand-600 uppercase font-bold block">
                    Target
                  </span>
                  <span className="font-bold text-brand-800">
                    {gap.requiredLevel}
                  </span>
                </div>

                <div className="space-y-0.5 pl-2">
                  <span className="text-[10px] text-charcoal-400 uppercase font-semibold block">
                    Role Weight
                  </span>
                  <span className="font-semibold text-charcoal-700">
                    {gap.roleImportance}
                  </span>
                </div>

                <div className="space-y-0.5 pl-2">
                  <span className="text-[10px] text-charcoal-400 uppercase font-semibold block">
                    Market
                  </span>
                  <span className="font-semibold text-emerald-800">
                    {gap.marketRelevance}
                  </span>
                </div>

                {/* Action CTA */}
                <div className="pl-2">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => onSelectSkill && onSelectSkill(gap)}
                    className="shrink-0 text-xs font-semibold"
                  >
                    View Gap
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityGapCard;
