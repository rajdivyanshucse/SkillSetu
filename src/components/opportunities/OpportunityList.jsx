import React from 'react';
import { Search, ArrowUpDown, SlidersHorizontal, Layers } from 'lucide-react';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityEmptyState } from './OpportunityEmptyState';

export const OpportunityList = ({
  opportunities = [],
  savedIds = [],
  onToggleSave,
  searchQuery = '',
  onSearchChange,
  sortBy = 'recommended',
  onSortChange,
  onResetFilters,
  className = '',
}) => {
  const sortOptions = [
    { value: 'recommended', label: 'Recommended Matches' },
    { value: 'compatibility', label: 'Highest Compatibility' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'relevance', label: 'Direct Role Relevance' },
    { value: 'salary', label: 'Highest Compensation' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar & Sort Control */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, company, skill (e.g. Java, AWS), or location..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:bg-surface focus:ring-1 focus:ring-brand-500 focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-xs text-charcoal-400 hover:text-charcoal-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 font-semibold shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">Sort:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-canvas-subtle/80 border border-surface-border rounded-lg text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-charcoal-500">
        <span>
          Showing <strong className="text-charcoal-900">{opportunities.length}</strong> opportunities
        </span>
        <span className="text-[11px] text-charcoal-400">
          Ranked by deterministic profile compatibility
        </span>
      </div>

      {/* Opportunities Grid / Empty State */}
      {opportunities.length === 0 ? (
        <OpportunityEmptyState type="search" onResetFilters={onResetFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((job) => (
            <OpportunityCard
              key={job.id}
              opportunity={job}
              isSaved={savedIds.includes(job.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityList;
