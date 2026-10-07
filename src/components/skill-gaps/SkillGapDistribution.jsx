import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Layers, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const SkillGapDistribution = ({
  distribution = { aligned: 7, developing: 3, priority: 4 },
  totalSkills = 14,
  className = '',
}) => {
  const total = distribution.aligned + distribution.developing + distribution.priority || totalSkills || 14;

  const alignedPct = Math.round((distribution.aligned / total) * 100);
  const devPct = Math.round((distribution.developing / total) * 100);
  const prioPct = 100 - alignedPct - devPct;

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Gap Distribution</CardTitle>
              <CardDescription>
                Capability alignment proportions across target taxonomy.
              </CardDescription>
            </div>
          </div>

          <span className="text-xs font-semibold text-charcoal-500">
            {total} Total Modeled
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* Segmented Multi-Color Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-canvas-muted rounded-full overflow-hidden flex shadow-xs">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${alignedPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full bg-emerald-500"
              title={`Aligned: ${alignedPct}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${devPct}%` }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="h-full bg-amber-500"
              title={`Developing: ${devPct}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prioPct}%` }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-rose-500"
              title={`Priority Gap: ${prioPct}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-charcoal-500 font-mono">
            <span>{alignedPct}% Aligned</span>
            <span>{devPct}% Developing</span>
            <span>{prioPct}% Priority</span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50/40 border border-emerald-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Aligned</span>
            </div>
            <div className="text-xl font-extrabold text-charcoal-900">
              {distribution.aligned} <span className="text-xs font-normal text-charcoal-500">skills</span>
            </div>
            <p className="text-[10px] text-charcoal-600">
              Meets required benchmark
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/40 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Developing</span>
            </div>
            <div className="text-xl font-extrabold text-charcoal-900">
              {distribution.developing} <span className="text-xs font-normal text-charcoal-500">skills</span>
            </div>
            <p className="text-[10px] text-charcoal-600">
              Within 1 level of target
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/40 border border-rose-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Priority Gap</span>
            </div>
            <div className="text-xl font-extrabold text-charcoal-900">
              {distribution.priority} <span className="text-xs font-normal text-charcoal-500">skills</span>
            </div>
            <p className="text-[10px] text-charcoal-600">
              High delta & market impact
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillGapDistribution;
