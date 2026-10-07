import React from 'react';
import { motion } from 'framer-motion';
import { Target, Info, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AlignmentMeter = ({
  alignmentScore = 72,
  targetRole = 'Backend Software Engineer',
  alignedSkills = [],
  developingSkills = [],
  priorityGaps = [],
  className = '',
}) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Your Current Role Alignment</CardTitle>
              <CardDescription>
                Overall alignment against modeled {targetRole} expectations.
              </CardDescription>
            </div>
          </div>

          <Badge status="recommended" size="sm">
            {alignmentScore}% Alignment
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Large Meter Visual */}
        <div className="p-5 rounded-xl bg-canvas-subtle/70 border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-brand-700 tracking-tight">
                {alignmentScore}%
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-charcoal-500">
                Compatibility Rating
              </span>
            </div>

            <div className="w-full h-3 bg-canvas-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${alignmentScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-brand-500 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-0.5">
              <span>Baseline: Entry-Level Readiness</span>
              <span className="font-semibold text-charcoal-700">Target Standard</span>
            </div>
          </div>

          <div className="sm:border-l sm:border-surface-border sm:pl-6 space-y-1 text-xs text-charcoal-600 max-w-xs">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Alignment Status
            </span>
            <p className="leading-relaxed text-[11px]">
              Strong core programming & data skills with targeted expansion needed in cloud & containerization.
            </p>
          </div>
        </div>

        {/* 3 Pillars Breakdown: Strong Alignment, Developing, Priority Development */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Strong Alignment */}
          <div className="p-3.5 rounded-lg bg-surface border border-emerald-200/80 bg-emerald-50/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strong Alignment ({alignedSkills.length})</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {alignedSkills.slice(0, 5).map((s) => (
                <span
                  key={s.id || s.name}
                  className="text-[11px] px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold"
                >
                  {s.name}
                </span>
              ))}
              {alignedSkills.length === 0 && (
                <span className="text-xs text-charcoal-400">Calibrating...</span>
              )}
            </div>
          </div>

          {/* Developing */}
          <div className="p-3.5 rounded-lg bg-surface border border-amber-200/80 bg-amber-50/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Developing ({developingSkills.length})</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {developingSkills.slice(0, 5).map((s) => (
                <span
                  key={s.id || s.name}
                  className="text-[11px] px-2 py-0.5 rounded-xs bg-amber-50 text-amber-900 border border-amber-200 font-semibold"
                >
                  {s.name}
                </span>
              ))}
              {developingSkills.length === 0 && (
                <span className="text-xs text-charcoal-400">None in intermediate delta</span>
              )}
            </div>
          </div>

          {/* Priority Development */}
          <div className="p-3.5 rounded-lg bg-surface border border-rose-200/80 bg-rose-50/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Priority Gaps ({priorityGaps.length})</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {priorityGaps.slice(0, 5).map((s) => (
                <span
                  key={s.id || s.name}
                  className="text-[11px] px-2 py-0.5 rounded-xs bg-rose-50 text-rose-900 border border-rose-200 font-bold"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Explanatory disclaimer */}
        <div className="p-3 rounded-md bg-canvas-subtle border border-surface-border flex items-start gap-2 text-xs text-charcoal-600">
          <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Alignment reflects the difference between your current profile and the selected role's modeled skill requirements. It is an illustrative compatibility model and does not represent employer hiring decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlignmentMeter;
