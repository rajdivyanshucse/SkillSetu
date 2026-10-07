import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Select } from '../ui/Select';

export const SkillGapFilters = ({
  activeStatus = 'All',
  onStatusChange,
  activeCategory = 'All',
  onCategoryChange,
  categories = ['All', 'Programming', 'Backend', 'Databases', 'Cloud', 'DevOps', 'Architecture'],
  searchQuery = '',
  onSearchChange,
  sortBy = 'priority',
  onSortChange,
  className = '',
}) => {
  const statusTabs = [
    { id: 'All', label: 'All Requirements' },
    { id: 'Priority', label: 'Priority Gaps' },
    { id: 'Developing', label: 'Developing' },
    { id: 'Aligned', label: 'Aligned' },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top row: Status pills & search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status segment tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-canvas-subtle border border-surface-border overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-surface text-charcoal-900 shadow-subtle border border-surface-border font-bold'
                      : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-surface/50 border border-transparent'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills or categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-surface border border-surface-border focus:outline-none focus:border-brand-500 text-charcoal-900 placeholder:text-charcoal-400"
          />
        </div>
      </div>

      {/* Bottom row: Category filter + Sort selector */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 shrink-0">
            Category:
          </span>
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`
                  px-2.5 py-0.5 rounded-xs text-[11px] font-medium transition-colors cursor-pointer shrink-0
                  ${
                    activeCategory === cat
                      ? 'bg-brand-500 text-white font-semibold'
                      : 'bg-canvas-subtle text-charcoal-600 hover:bg-canvas-muted border border-surface-border'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs py-1 px-2.5 rounded-md bg-surface border border-surface-border text-charcoal-800 font-medium focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="priority">Priority Rank</option>
            <option value="gap">Gap Intensity</option>
            <option value="name">Skill Name (A-Z)</option>
            <option value="importance">Role Importance</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SkillGapFilters;
