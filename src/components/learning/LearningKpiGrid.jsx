import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Compass, CheckCircle2, FolderGit2, ShieldCheck, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const LearningKpiGrid = ({ kpis = {} }) => {
  const items = [
    {
      id: 'progress',
      label: 'Learning Progress',
      value: `${kpis.overallProgress ?? 64}%`,
      subtext: 'Average curriculum completion',
      icon: <BookOpen className="w-4 h-4 text-brand-600" />,
      tooltip: 'Weighted completion percentage across all active learning modules and practical exercises.',
      accent: 'text-brand-700',
    },
    {
      id: 'priority_skills',
      label: 'Priority Skills',
      value: kpis.prioritySkillsCount ?? 4,
      subtext: 'High role-impact gaps',
      icon: <Target className="w-4 h-4 text-amber-600" />,
      tooltip: 'Number of competencies configured as high priority based on target-role gap calibrations.',
      accent: 'text-amber-700',
    },
    {
      id: 'active_paths',
      label: 'Active Learning Paths',
      value: kpis.activePathsCount ?? 3,
      subtext: 'In-progress curriculum tracks',
      icon: <Compass className="w-4 h-4 text-brand-600" />,
      tooltip: 'Structured multi-stage learning roadmaps currently in progress.',
      accent: 'text-brand-700',
    },
    {
      id: 'completed_modules',
      label: 'Completed Modules',
      value: kpis.completedModules ?? 12,
      subtext: `Of ${kpis.totalModules ?? 24} total modules`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      tooltip: 'Total conceptual lessons and hands-on coding modules marked complete.',
      accent: 'text-emerald-700',
    },
    {
      id: 'projects_linked',
      label: 'Projects Linked',
      value: kpis.projectsLinkedCount ?? 5,
      subtext: 'Portfolio application evidence',
      icon: <FolderGit2 className="w-4 h-4 text-brand-600" />,
      tooltip: 'Concrete repository and systems implementation projects tied to learning tracks.',
      accent: 'text-brand-700',
    },
    {
      id: 'validation_activities',
      label: 'Validation Activities',
      value: `${kpis.completedValidationCount ?? 2} / ${kpis.validationActivitiesCount ?? 4}`,
      subtext: 'Case studies & assessments',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      tooltip: 'Practical assessments, coding labs, and architecture reviews verifying proficiency.',
      accent: 'text-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((kpi, idx) => (
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
            <span className={`text-xl font-extrabold tracking-tight ${kpi.accent}`}>
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

export default LearningKpiGrid;
