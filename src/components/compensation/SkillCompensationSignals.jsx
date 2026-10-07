import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Info, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { skillCompensationAssociations } from '../../data/compensationData';
import Tooltip from '../ui/Tooltip';
import Badge from '../ui/Badge';

export const SkillCompensationSignals = ({
  skills = skillCompensationAssociations,
  className = '',
  title = 'Skill-Associated Compensation Patterns',
  subtitle = 'Observational alignment between advertised opportunity skills and compensation quartiles.',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(skills.map((s) => s.category || 'General'));
    return ['All', ...Array.from(set)];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-1 px-2.5 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 focus:outline-none cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="p-3.5 rounded-lg bg-canvas-subtle/40 border border-surface-border hover:border-brand-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider block">
                    {skill.category}
                  </span>
                  <h4 className="text-sm font-bold text-charcoal-900">
                    {skill.name}
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">
                  {skill.opportunityCount} listings ({skill.presenceRate}%)
                </span>
              </div>

              <div className="my-2.5 p-2 rounded bg-surface border border-surface-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Observed Median
                  </span>
                  <span className="font-extrabold text-charcoal-900 text-sm">
                    ₹{skill.medianLpa} LPA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Typical Opportunity Range
                  </span>
                  <span className="font-semibold text-charcoal-700">
                    {skill.typicalRange}
                  </span>
                </div>
              </div>

              <p className="text-xs text-charcoal-600 leading-relaxed italic mb-2">
                "{skill.observation}"
              </p>
            </div>

            {skill.commonRoles && (
              <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-charcoal-500">
                <span className="truncate">
                  Common in: {skill.commonRoles.slice(0, 2).join(', ')}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Critical Methodology Note */}
      <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-charcoal-700 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Non-Causal Association:</strong> Opportunities mentioning specialized technologies like AWS or Kubernetes show higher median advertised compensation in this prototype dataset. Observational opportunity data does not establish that acquiring a specific skill directly increases individual salary by a guaranteed percentage.
        </span>
      </div>
    </div>
  );
};
