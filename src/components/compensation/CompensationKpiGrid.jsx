import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, DollarSign, Layers, MapPin, Sparkles, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export const CompensationKpiGrid = ({
  kpiData = {},
  className = '',
}) => {
  const {
    totalOpportunities = 28,
    medianCompensation = 11.5,
    typicalRange = '₹6.5–18.5 LPA',
    rolesAnalyzed = 10,
    locationsCovered = 7,
    skillSignalsCount = 10,
  } = kpiData;

  const kpis = [
    {
      id: 'kpi-opps',
      label: 'Advertised Opportunities',
      value: totalOpportunities,
      suffix: '',
      subtext: 'Cataloged in prototype dataset',
      icon: <Briefcase className="w-4 h-4 text-brand-600" />,
      tooltip: 'Total structured fictional opportunity profiles analyzed in the intelligence layer.',
    },
    {
      id: 'kpi-median',
      label: 'Median Advertised Comp',
      value: `₹${medianCompensation}`,
      suffix: ' LPA',
      subtext: 'Observed prototype midpoint',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      tooltip: '50th percentile advertised compensation across all filtered opportunity records.',
    },
    {
      id: 'kpi-range',
      label: 'Typical Advertised Range',
      value: typicalRange,
      suffix: '',
      subtext: 'Mid-market spread (P25–P75)',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
      tooltip: 'Interquartile range representing typical advertised opportunity spans.',
    },
    {
      id: 'kpi-roles',
      label: 'Roles Analyzed',
      value: rolesAnalyzed,
      suffix: '',
      subtext: 'Normalized capability archetypes',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      tooltip: 'Standardized job profiles mapped from opportunity listings.',
    },
    {
      id: 'kpi-locs',
      label: 'Locations Covered',
      value: locationsCovered,
      suffix: '',
      subtext: 'Metros & remote arrangements',
      icon: <MapPin className="w-4 h-4 text-indigo-600" />,
      tooltip: 'Tier-1 technology hubs and remote work distributions evaluated.',
    },
    {
      id: 'kpi-skills',
      label: 'Skill-Associated Signals',
      value: skillSignalsCount,
      suffix: '',
      subtext: 'Specialized capability patterns',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      tooltip: 'High-frequency competencies with observed compensation quartile patterns.',
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

          <div className="my-1 flex items-baseline gap-1">
            <span className="text-xl font-bold text-charcoal-900 tracking-tight">
              {kpi.value}
            </span>
            {kpi.suffix && (
              <span className="text-xs font-semibold text-charcoal-600">
                {kpi.suffix}
              </span>
            )}
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
