import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Sparkles, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';

export const RoadmapSummary = ({
  targetRole = 'Backend Software Engineer',
  currentAlignment = 72,
  roadmapProgress = 18,
  activeSkillName = 'AWS Cloud Fundamentals',
  priorityAreasCount = 4,
  className = '',
}) => {
  const summaryCards = [
    {
      title: 'TARGET ROLE',
      value: targetRole,
      subtext: 'Calibrated Career Destination',
      icon: <Target className="w-4 h-4 text-brand-700" />,
      isRole: true,
    },
    {
      title: 'CURRENT ALIGNMENT',
      value: `${currentAlignment}%`,
      subtext: 'Profile-to-Role Benchmark',
      icon: <Compass className="w-4 h-4 text-brand-600" />,
    },
    {
      title: 'ROADMAP PROGRESS',
      value: `${roadmapProgress}%`,
      subtext: 'Curriculum & Project Milestones',
      icon: <Sparkles className="w-4 h-4 text-brand-600" />,
    },
    {
      title: 'ACTIVE FOCUS',
      value: activeSkillName.split(' ')[0] || 'AWS',
      subtext: `${priorityAreasCount} Priority Areas Total`,
      icon: <Layers className="w-4 h-4 text-amber-600" />,
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {summaryCards.map((c, idx) => (
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
              <div
                className={`font-black text-charcoal-900 tracking-tight truncate ${
                  c.isRole ? 'text-lg sm:text-xl' : 'text-3xl'
                }`}
              >
                {c.value}
              </div>
              <p className="text-xs text-charcoal-500 mt-1 leading-normal">
                {c.subtext}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between text-[11px] text-charcoal-400">
              <span>Dynamic Plan</span>
              <span className="font-semibold text-charcoal-700">Stage Sequenced</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default RoadmapSummary;
