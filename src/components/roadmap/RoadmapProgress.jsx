import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, TrendingUp, Layers, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const RoadmapProgress = ({
  overallProgress = 18,
  stages = [],
  className = '',
}) => {
  const getStageColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 40) return 'bg-brand-500';
    if (pct > 0) return 'bg-amber-500';
    return 'bg-canvas-muted';
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Roadmap Progress</CardTitle>
              <CardDescription>
                Milestone completion across all 5 career roadmap stages.
              </CardDescription>
            </div>
          </div>

          <span className="text-body-md font-black text-brand-700">
            {overallProgress}% Total
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Overall progress meter */}
        <div className="p-3.5 rounded-xl bg-canvas-subtle/80 border border-surface-border space-y-2">
          <div className="flex justify-between text-xs font-bold text-charcoal-900">
            <span>Overall Career Progression</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-canvas-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-full bg-brand-500 rounded-full"
            />
          </div>
        </div>

        {/* Stage-by-stage bars */}
        <div className="space-y-3 pt-1">
          {stages.map((st, idx) => (
            <div key={st.id || idx} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-900">
                  {st.stageNumber}. {st.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-charcoal-400 font-medium">
                    {st.status}
                  </span>
                  <span className="font-bold text-charcoal-800">{st.progress}%</span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${st.progress}%` }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getStageColor(st.progress)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapProgress;
