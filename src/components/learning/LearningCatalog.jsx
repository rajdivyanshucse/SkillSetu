import React, { useState, useMemo } from 'react';
import { Search, Filter, Bookmark, BookOpen, Layers, X, Sparkles } from 'lucide-react';
import LearningResourceCard from './LearningResourceCard';
import LearningEmptyState from './LearningEmptyState';
import { initialLearningCatalog } from '../../data/learningData';

const formatsList = ['All', 'Course', 'Practice Lab', 'Tutorial', 'Project', 'Case Study', 'Documentation', 'Assessment'];
const difficultiesList = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const LearningCatalog = ({
  resources = initialLearningCatalog,
  savedIds = [],
  onToggleSave,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  // Extract unique skills from resources
  const availableSkills = useMemo(() => {
    const set = new Set();
    resources.forEach((r) => r.skills?.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [resources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.skills?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFormat = selectedFormat === 'All' || res.format === selectedFormat;
      const matchesDifficulty = selectedDifficulty === 'All' || res.difficulty === selectedDifficulty;
      const matchesSkill = selectedSkill === 'All' || res.skills?.includes(selectedSkill);

      return matchesSearch && matchesFormat && matchesDifficulty && matchesSkill;
    });
  }, [resources, searchTerm, selectedFormat, selectedDifficulty, selectedSkill]);

  const hasActiveFilters = searchTerm || selectedFormat !== 'All' || selectedDifficulty !== 'All' || selectedSkill !== 'All';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFormat('All');
    setSelectedDifficulty('All');
    setSelectedSkill('All');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Card */}
      <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-card space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, skills, architectures, or formats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-surface-border rounded-md bg-canvas focus:outline-none focus:ring-1 focus:ring-brand-500 text-charcoal-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold cursor-pointer shrink-0 self-start md:self-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="space-y-2 pt-1 border-t border-surface-border/60">
          {/* Format Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-charcoal-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Format:
            </span>
            {formatsList.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-charcoal-900 text-white font-semibold shadow-xs'
                    : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Difficulty & Skill Selector Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-charcoal-500">Difficulty:</span>
              <div className="flex gap-1">
                {difficultiesList.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-brand-100 text-brand-900 font-bold border border-brand-300'
                        : 'bg-canvas-subtle text-charcoal-600 hover:bg-canvas-muted'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-charcoal-500">Skill:</span>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="text-[11px] py-0.5 px-2 bg-canvas border border-surface-border rounded text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {availableSkills.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Results Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <LearningResourceCard
              key={resource.id}
              resource={resource}
              isSaved={savedIds.includes(resource.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <LearningEmptyState
          title="No matching learning resources found"
          description="Try broadening your search query or resetting filters to browse all educational modules."
          actionLabel="Clear All Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
};

export default LearningCatalog;
