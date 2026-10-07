import React from 'react';
import { TalentCard } from './TalentCard';
import { ArrowUpDown } from 'lucide-react';

export const TalentList = ({
  candidates = [],
  role,
  shortlist = [],
  onToggleShortlist,
  compareList = [],
  onToggleCompare,
  sortBy = 'compatibility',
  onSortChange,
}) => {
  return (
    <div className="space-y-4">
      {/* List Header & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-surface-border shadow-2xs">
        <span className="text-xs font-semibold text-charcoal-700">
          Showing <strong className="text-charcoal-900">{candidates.length}</strong> calibrated candidate {candidates.length === 1 ? 'profile' : 'profiles'}
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-400" />
          <label htmlFor="talent-sort-select" className="text-xs font-medium text-charcoal-500">
            Sort by:
          </label>
          <select
            id="talent-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-semibold text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="compatibility">Highest Compatibility</option>
            <option value="experience">Years of Experience</option>
            <option value="requiredSkills">Required Skill Coverage</option>
            <option value="availability">Earliest Availability</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <TalentCard
            key={candidate.id}
            candidate={candidate}
            role={role}
            shortlist={shortlist}
            onToggleShortlist={onToggleShortlist}
            compareList={compareList}
            onToggleCompare={onToggleCompare}
          />
        ))}
      </div>
    </div>
  );
};

export default TalentList;
