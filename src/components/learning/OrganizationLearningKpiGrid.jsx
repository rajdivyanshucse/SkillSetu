import React from 'react';
import { motion } from 'framer-motion';
import { Users, Layers, BookOpen, Target, TrendingUp, CalendarCheck, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const OrganizationLearningKpiGrid = ({
  coverage = '74%',
  activePrograms = '4',
  skillsInDevelopment = '18',
  learningParticipation = '130',
  capabilityGapCoverage = '68%',
  developmentPriorities = '7',
}) => {
  const kpiItems = [
    {
      id: 'coverage',
      label: 'Workforce Learning Coverage',
      value: coverage,
      subtext: 'Across technical workforce',
      icon: <Users className="w-4 h-4 text-brand-600" />,
      tooltip: 'Proportion of technical workforce enrolled in or actively developing strategic capabilities.',
    },
    {
      id: 'programs',
      label: 'Active Development Programs',
      value: activePrograms,
      subtext: 'Multi-week cohorts',
      icon: <BookOpen className="w-4 h-4 text-brand-600" />,
      tooltip: 'Total structured cohort-based technical development tracks running currently.',
    },
    {
      id: 'skills_dev',
      label: 'Skills in Development',
      value: skillsInDevelopment,
      subtext: 'Tracked capability domains',
      icon: <Layers className="w-4 h-4 text-brand-600" />,
      tooltip: 'Distinct organizational competencies with active curriculum tracks.',
    },
    {
      id: 'participation',
      label: 'Learning Participation',
      value: `${learningParticipation} Engineers`,
      subtext: 'Total cohort members',
      icon: <Target className="w-4 h-4 text-brand-600" />,
      tooltip: 'Aggregate headcount of technical team members enrolled in development programs.',
    },
    {
      id: 'gap_coverage',
      label: 'Capability Gap Coverage',
      value: capabilityGapCoverage,
      subtext: 'Internal pipeline potential',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      tooltip: 'Percentage of projected 12-month workforce capability gaps addressed through internal training cohorts.',
    },
    {
      id: 'priorities',
      label: 'Development Priorities',
      value: developmentPriorities,
      subtext: 'High-impact domains',
      icon: <CalendarCheck className="w-4 h-4 text-amber-600" />,
      tooltip: 'Critical capabilities requiring prioritized internal upskilling or external talent matching.',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {kpiItems.map((kpi, idx) => (
        <motion.div
          key={kpi.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.04 }}
          className="p-3.5 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between select-none"
        >
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-semibold text-charcoal-600 truncate leading-tight">
              {kpi.label}
            </span>
            <Tooltip content={kpi.tooltip} position="top">
              <button
                type="button"
                className="text-charcoal-400 hover:text-charcoal-600 p-0.5 rounded cursor-pointer"
                aria-label={`Info about ${kpi.label}`}
              >
                <HelpCircle className="w-3 h-3" />
              </button>
            </Tooltip>
          </div>

          <div className="my-2">
            <span className="text-xl font-extrabold text-charcoal-900 tracking-tight">
              {kpi.value}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-surface-border/50 text-[10px] text-charcoal-500">
            {kpi.icon}
            <span className="truncate">{kpi.subtext}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrganizationLearningKpiGrid;
