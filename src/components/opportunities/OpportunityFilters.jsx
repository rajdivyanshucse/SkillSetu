import React from 'react';
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

export const OpportunityFilters = ({
  filters,
  onChange,
  onReset,
  totalCount = 0,
  className = '',
}) => {
  const roleCategories = [
    { value: 'all', label: 'All Roles' },
    { value: 'Backend', label: 'Backend Engineering' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Full Stack', label: 'Full Stack' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Data', label: 'Data Engineering' },
    { value: 'AI/ML', label: 'AI/ML' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Remote', label: 'Remote' },
  ];

  const workModes = [
    { value: 'all', label: 'All Modes' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'On-site', label: 'On-site' },
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Experience' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Entry Level', label: 'Entry Level' },
    { value: '1–3 years', label: '1–3 years' },
    { value: '3–5 years', label: '3–5 years' },
  ];

  const employmentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Internship', label: 'Internship' },
  ];

  const popularSkills = ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'AWS', 'Docker', 'Redis'];

  const hasActiveFilters =
    filters.roleCategory !== 'all' ||
    filters.location !== 'all' ||
    filters.workMode !== 'all' ||
    filters.experience !== 'all' ||
    filters.employmentType !== 'all' ||
    filters.skill !== 'all' ||
    Boolean(filters.searchQuery);

  const activeFilterCount = [
    filters.roleCategory !== 'all',
    filters.location !== 'all',
    filters.workMode !== 'all',
    filters.experience !== 'all',
    filters.employmentType !== 'all',
    filters.skill !== 'all',
    Boolean(filters.searchQuery),
  ].filter(Boolean).length;

  return (
    <div className={`bg-surface border border-surface-border rounded-xl p-4 shadow-subtle space-y-4 ${className}`}>
      {/* Top Header & Reset */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Filter Opportunities
            </h3>
            <span className="text-[11px] text-charcoal-500">
              {totalCount} matching opportunities
            </span>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<RotateCcw className="w-3 h-3" />}
            onClick={onReset}
            className="text-brand-700 hover:text-brand-800"
          >
            Clear Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        )}
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Role Category */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-charcoal-500 block">
            Role Category
          </label>
          <div className="relative">
            <select
              value={filters.roleCategory}
              onChange={(e) => onChange({ ...filters, roleCategory: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-sm text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden appearance-none cursor-pointer pr-7"
            >
              {roleCategories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-charcoal-500 block">
            Location
          </label>
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-sm text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden appearance-none cursor-pointer pr-7"
            >
              {locations.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Work Mode */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-charcoal-500 block">
            Work Mode
          </label>
          <div className="relative">
            <select
              value={filters.workMode}
              onChange={(e) => onChange({ ...filters, workMode: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-sm text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden appearance-none cursor-pointer pr-7"
            >
              {workModes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-charcoal-500 block">
            Experience Level
          </label>
          <div className="relative">
            <select
              value={filters.experience}
              onChange={(e) => onChange({ ...filters, experience: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-sm text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden appearance-none cursor-pointer pr-7"
            >
              {experienceLevels.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Employment Type */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-charcoal-500 block">
            Employment Type
          </label>
          <div className="relative">
            <select
              value={filters.employmentType}
              onChange={(e) => onChange({ ...filters, employmentType: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-sm text-charcoal-800 focus:ring-1 focus:ring-brand-500 focus:outline-hidden appearance-none cursor-pointer pr-7"
            >
              {employmentTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick Skill Filter Chips */}
      <div className="pt-2 border-t border-surface-border flex items-center flex-wrap gap-1.5">
        <span className="text-[10px] uppercase font-bold text-charcoal-400 mr-1">
          Quick Skill Filter:
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...filters, skill: 'all' })}
          className={`
            text-[11px] font-semibold px-2 py-0.5 rounded-xs transition-colors cursor-pointer
            ${
              filters.skill === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-canvas-subtle text-charcoal-600 hover:bg-canvas-muted'
            }
          `}
        >
          All
        </button>
        {popularSkills.map((sk) => {
          const isSelected = filters.skill.toLowerCase() === sk.toLowerCase();
          return (
            <button
              key={sk}
              type="button"
              onClick={() => onChange({ ...filters, skill: isSelected ? 'all' : sk })}
              className={`
                text-[11px] font-semibold px-2 py-0.5 rounded-xs transition-colors cursor-pointer border
                ${
                  isSelected
                    ? 'bg-brand-100 text-brand-800 border-brand-300'
                    : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                }
              `}
            >
              {sk}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunityFilters;
