import React from 'react';
import { motion } from 'framer-motion';
import { Users, Layers, BookOpen, Target, TrendingUp, CalendarCheck, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const OrganizationGrowthKpiGrid = ({
  metrics = {},
  className = '',
}) => {
  const {
    workforceCoverage = 74,
    skillsInDevelopment = 18,
    learningParticipation = 81,
    developmentPrioritiesCount = 7,
    capabilityProgress = 68,
    roadmapAlignment = 72,
  } = metrics;

  const kpis = [
    {
      id: 'kpi-cov',
      label: 'Development Coverage',
      value: `${workforceCoverage}%`,
      subtext: 'Across technical workforce',
      icon: <Users className="w-4 h-4 text-brand-600" />,
      tooltip: 'Proportion of technical workforce engaged in structured capability development tracks.',
    },
    {
      id: 'kpi-skills',
      label: 'Skills In Development',
      value: `${skillsInDevelopment}`,
      subtext: 'Active capability tracks',
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      tooltip: 'Number of discrete technical competency tracks undergoing active organizational training.',
    },
    {
      id: 'kpi-learn',
      label: 'Learning Participation',
      value: `${learningParticipation}%`,
      subtext: 'Active cohort engagement',
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      tooltip: 'Weekly engagement rate across scheduled upskilling and bootcamp modules.',
    },
    {
      id: 'kpi-priorities',
      label: 'Strategic Priorities',
      value: `${developmentPrioritiesCount}`,
      subtext: 'High-urgency capabilities',
      icon: <Target className="w-4 h-4 text-rose-600" />,
      tooltip: 'Critical skill domains prioritized in the Phase 12 Workforce Planning roadmap.',
    },
    {
      id: 'kpi-prog',
      label: 'Capability Progress',
      value: `${capabilityProgress}%`,
      subtext: 'Aggregate milestone pace',
      icon: <TrendingUp className="w-4 h-4 text-purple-600" />,
      tooltip: 'Weighted completion percentage across ongoing organizational development cohorts.',
    },
    {
      id: 'kpi-road',
      label: 'Roadmap Alignment',
      value: `${roadmapAlignment}%`,
      subtext: 'Plan schedule adherence',
      icon: <CalendarCheck className="w-4 h-4 text-amber-600" />,
      tooltip: 'Adherence of capability delivery to scheduled 0–36 month workforce development milestones.',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 ${className}`}>
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.04 }}
          className="bg-surface p-3.5 rounded-lg border border-surface-border hover:border-brand-200 shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider truncate">
              {kpi.label}
            </span>
            <Tooltip content={kpi.tooltip}>
              <button
                type="button"
                className="text-charcoal-400 hover:text-charcoal-600 p-0.5 rounded cursor-pointer"
                aria-label={`Info about ${kpi.label}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>

          <div className="my-1">
            <span className="text-xl font-extrabold text-charcoal-900 tracking-tight">
              {kpi.value}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-surface-border/50 text-[11px] text-charcoal-500">
            {kpi.icon}
            <span className="truncate">{kpi.subtext}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrganizationGrowthKpiGrid;
