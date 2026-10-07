import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Layers, BookOpen, Briefcase, Award, Target, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const GrowthKpiGrid = ({
  metrics = {},
  className = '',
}) => {
  const {
    overallDevelopment = 68,
    skillProgress = 74,
    learningProgress = 61,
    projectsCompleted = 5,
    totalProjects = 5,
    milestonesCompleted = 4,
    totalMilestones = 8,
    roleReadiness = 72,
    targetRole = 'Backend Software Engineer',
  } = metrics;

  const kpis = [
    {
      id: 'kpi-overall',
      label: 'Overall Development',
      value: `${overallDevelopment}%`,
      subtext: 'Weighted growth index',
      icon: <TrendingUp className="w-4 h-4 text-brand-600" />,
      tooltip: 'Composite progress combining skills (40%), learning (25%), projects (20%), and milestones (15%).',
    },
    {
      id: 'kpi-skills',
      label: 'Skill Progress',
      value: `${skillProgress}%`,
      subtext: 'Across 8 tracked skills',
      icon: <Layers className="w-4 h-4 text-emerald-600" />,
      tooltip: 'Average self-reported development progress toward calibrated target skill levels.',
    },
    {
      id: 'kpi-learning',
      label: 'Learning Progress',
      value: `${learningProgress}%`,
      subtext: 'Across 5 structured tracks',
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      tooltip: 'Completion rate of interactive courses, reading modules, and concept labs.',
    },
    {
      id: 'kpi-projects',
      label: 'Projects Completed',
      value: `${projectsCompleted}`,
      subtext: `${totalProjects} total in portfolio`,
      icon: <Briefcase className="w-4 h-4 text-purple-600" />,
      tooltip: 'Practical implementation repositories and architecture case studies demonstrating skills.',
    },
    {
      id: 'kpi-milestones',
      label: 'Career Milestones',
      value: `${milestonesCompleted} / ${totalMilestones}`,
      subtext: 'Structured progression steps',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      tooltip: 'Completed progression gates from onboarding to production deployment readiness.',
    },
    {
      id: 'kpi-readiness',
      label: 'Role Readiness',
      value: `${roleReadiness}%`,
      subtext: `Alignment for ${targetRole.split(' ')[0]}`,
      icon: <Target className="w-4 h-4 text-rose-600" />,
      tooltip: 'Development alignment with selected target role. Note: This is a development indicator, not a hiring probability.',
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

export default GrowthKpiGrid;
