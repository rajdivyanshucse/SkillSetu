import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, AlertCircle, GitBranch, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const GapOverview = ({
  skillsAssessed = 12,
  skillsAligned = 7,
  priorityGaps = 4,
  averageGap = 'Moderate',
  className = '',
}) => {
  const cards = [
    {
      title: 'SKILLS ASSESSED',
      value: skillsAssessed,
      note: 'Role taxonomy requirements',
      icon: <Layers className="w-4 h-4 text-brand-600" />,
      subtext: 'Mapped against baseline',
    },
    {
      title: 'SKILLS ALIGNED',
      value: skillsAligned,
      note: 'Meet or exceed target level',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      subtext: 'Core strength foundation',
    },
    {
      title: 'PRIORITY GAPS',
      value: priorityGaps,
      note: 'High relevance & impact',
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      subtext: 'Recommended first focus',
    },
    {
      title: 'AVERAGE GAP',
      value: averageGap,
      note: 'Across target requirements',
      icon: <GitBranch className="w-4 h-4 text-amber-600" />,
      subtext: 'Manageable trajectory',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map((c, idx) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
        >
          <Card className="p-5 flex flex-col justify-between h-full hover:border-surface-border-strong hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                {c.title}
              </span>
              <div className="p-1.5 rounded-sm bg-canvas-subtle border border-surface-border">
                {c.icon}
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
                {c.value}
              </div>
              <p className="text-xs text-charcoal-600 mt-1 leading-normal font-medium">
                {c.note}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-charcoal-400">
              <span>{c.subtext}</span>
              <span className="font-semibold text-charcoal-700">Calibrated</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default GapOverview;
