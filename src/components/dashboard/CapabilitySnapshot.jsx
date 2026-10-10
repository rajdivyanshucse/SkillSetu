import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, HelpCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { CAPABILITY_STATES } from '../../utils/capabilityAdapter';

/**
 * CapabilitySnapshot Component
 * 4 interactive snapshot cards: Demonstrated, Developing, Self-Reported, Evidence Needed
 * Enables filtering and instant drill-down.
 */
export const CapabilitySnapshot = ({
  counts = { demonstrated: 6, developing: 3, selfReported: 2, evidenceNeeded: 2 },
  activeFilter = 'ALL',
  onFilterChange,
  className = '',
}) => {
  const cards = [
    {
      key: 'DEMONSTRATED',
      label: 'Demonstrated',
      count: counts.demonstrated || 0,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      subtext: 'Supported by project or experience evidence',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-100 bg-emerald-50/40',
      badgeClass: 'bg-emerald-50 text-emerald-800',
    },
    {
      key: 'DEVELOPING',
      label: 'Developing',
      count: counts.developing || 0,
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      subtext: 'Active courses or in-progress implementations',
      borderColor: 'border-amber-200 hover:border-amber-400',
      activeBorder: 'border-amber-600 ring-2 ring-amber-100 bg-amber-50/40',
      badgeClass: 'bg-amber-50 text-amber-800',
    },
    {
      key: 'SELF_REPORTED',
      label: 'Self-Reported',
      count: counts.selfReported || 0,
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
      subtext: 'Claimed on profile without attached project proof',
      borderColor: 'border-slate-200 hover:border-slate-400',
      activeBorder: 'border-slate-600 ring-2 ring-slate-100 bg-slate-50/60',
      badgeClass: 'bg-slate-100 text-slate-800',
    },
    {
      key: 'EVIDENCE_NEEDED',
      label: 'Evidence Needed',
      count: counts.evidenceNeeded || 0,
      icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      subtext: 'Required for target role but missing proof',
      borderColor: 'border-rose-200 hover:border-rose-400',
      activeBorder: 'border-rose-600 ring-2 ring-rose-100 bg-rose-50/40',
      badgeClass: 'bg-rose-50 text-rose-800',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-charcoal-900">Capability Snapshot</h2>
          <p className="text-xs text-charcoal-500">
            Categorization based on attached implementation evidence and target role requirements
          </p>
        </div>
        {activeFilter !== 'ALL' && (
          <button
            onClick={() => onFilterChange && onFilterChange('ALL')}
            className="text-xs font-semibold text-brand-700 hover:underline cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isSelected = activeFilter === card.key;
          return (
            <motion.div
              key={card.key}
              whileHover={{ y: -2 }}
              onClick={() => onFilterChange && onFilterChange(card.key === activeFilter ? 'ALL' : card.key)}
              className={`bg-surface border rounded-xl p-4 cursor-pointer transition-all ${
                isSelected ? card.activeBorder : card.borderColor
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {card.icon}
                  <span className="text-xs font-semibold text-charcoal-800">{card.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.badgeClass}`}>
                  {card.count}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 leading-relaxed min-h-[32px]">
                {card.subtext}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CapabilitySnapshot;
