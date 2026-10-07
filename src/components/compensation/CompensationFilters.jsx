import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { normalizedRoles, locationBenchmarks, experienceBands } from '../../data/compensationData';
import { Button } from '../ui/Button';

export const CompensationFilters = ({
  filters = {},
  onChangeFilter,
  onResetFilters,
  className = '',
}) => {
  const categories = ['All', ...new Set(normalizedRoles.map((r) => r.category))];
  const locations = ['All', ...locationBenchmarks.map((l) => l.name)];
  const expBands = ['All', '0–1 years', '1–3 years', '3–5 years', '5–8 years', '8+ years'];
  const workModes = ['All', 'Hybrid', 'Remote', 'On-site'];
  const employmentTypes = ['All', 'Full-time', 'Contract'];

  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.location && filters.location !== 'All') ||
    (filters.experience && filters.experience !== 'All') ||
    (filters.workMode && filters.workMode !== 'All') ||
    (filters.employmentType && filters.employmentType !== 'All');

  return (
    <div className={`bg-surface p-3.5 sm:p-4 rounded-lg border border-surface-border shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-surface-border/70">
        <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-brand-600" />
          <span>Compensation Intelligence Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
        {/* Role Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Role Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => onChangeFilter('category', e.target.value)}
            className="w-full py-1.5 px-2 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Location
          </label>
          <select
            value={filters.location || 'All'}
            onChange={(e) => onChangeFilter('location', e.target.value)}
            className="w-full py-1.5 px-2 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Band */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Experience Band
          </label>
          <select
            value={filters.experience || 'All'}
            onChange={(e) => onChangeFilter('experience', e.target.value)}
            className="w-full py-1.5 px-2 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {expBands.map((exp) => (
              <option key={exp} value={exp}>
                {exp === 'All' ? 'All Experience Levels' : exp}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Work Mode
          </label>
          <select
            value={filters.workMode || 'All'}
            onChange={(e) => onChangeFilter('workMode', e.target.value)}
            className="w-full py-1.5 px-2 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {workModes.map((wm) => (
              <option key={wm} value={wm}>
                {wm === 'All' ? 'All Work Modes' : wm}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block">
            Employment Type
          </label>
          <select
            value={filters.employmentType || 'All'}
            onChange={(e) => onChangeFilter('employmentType', e.target.value)}
            className="w-full py-1.5 px-2 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            {employmentTypes.map((et) => (
              <option key={et} value={et}>
                {et === 'All' ? 'All Employment Types' : et}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
