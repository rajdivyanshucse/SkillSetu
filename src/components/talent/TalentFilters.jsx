import React from 'react';
import { Filter, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import { talentRoles } from '../../data/talentRoleData';

export const TalentFilters = ({
  searchQuery = '',
  onSearchChange,
  selectedLocation = 'All',
  onLocationChange,
  selectedExperience = 'All',
  onExperienceChange,
  selectedAvailability = 'All',
  onAvailabilityChange,
  selectedWorkMode = 'All',
  onWorkModeChange,
  selectedSkill = 'All',
  onSkillChange,
  minCompatibility = 'All',
  onMinCompatibilityChange,
  onResetFilters,
  activeFilterCount = 0,
  availableSkills = [],
  availableLocations = [],
  className = '',
}) => {
  return (
    <div className={`bg-surface p-4 rounded-xl border border-surface-border shadow-2xs space-y-3.5 ${className}`}>
      {/* Top Search and Reset Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidate name, headline, skills, or experience..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas rounded-lg border border-surface-border text-charcoal-900 placeholder:text-charcoal-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Filter Count & Reset */}
        <div className="flex items-center gap-2 justify-end shrink-0">
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-1 rounded-md">
              {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
            </span>
          )}

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-semibold text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-surface-border hover:bg-canvas-subtle transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 border-t border-surface-border/60">
        {/* Experience */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Experience
          </label>
          <div className="relative">
            <select
              value={selectedExperience}
              onChange={(e) => onExperienceChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Experience</option>
              <option value="0-1">0–1 years</option>
              <option value="1-3">1–3 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5+">5+ years</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Availability
          </label>
          <div className="relative">
            <select
              value={selectedAvailability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Availabilities</option>
              <option value="Immediate">Immediate</option>
              <option value="15 days">15 days</option>
              <option value="30 days">30 days</option>
              <option value="60+ days">60+ days</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Work Mode */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Work Mode
          </label>
          <div className="relative">
            <select
              value={selectedWorkMode}
              onChange={(e) => onWorkModeChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Specific Skill Filter */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Key Competency
          </label>
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => onSkillChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Skills</option>
              {availableSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Min Compatibility */}
        <div>
          <label className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
            Compatibility
          </label>
          <div className="relative">
            <select
              value={minCompatibility}
              onChange={(e) => onMinCompatibilityChange(e.target.value)}
              className="w-full text-xs text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-md px-2.5 py-1.5 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Ranges</option>
              <option value="85">85%+ Alignment</option>
              <option value="75">75%+ Alignment</option>
              <option value="65">65%+ Alignment</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentFilters;
