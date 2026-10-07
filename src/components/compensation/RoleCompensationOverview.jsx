import React, { useState, useMemo } from 'react';
import { Search, Filter, Layers, ArrowUpDown, ArrowRight, TrendingUp, Sparkles, Plus, Check } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { normalizedRoles } from '../../data/compensationData';
import { CompensationRoleCard } from './CompensationRoleCard';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const RoleCompensationOverview = ({
  roles = normalizedRoles,
  selectedCompareIds = [],
  onToggleCompare,
  showSearch = true,
  maxDisplay = null,
  viewModeDefault = 'grid', // 'grid' | 'table'
  className = '',
}) => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState(viewModeDefault);
  const [sortBy, setSortBy] = useState('medianDesc'); // 'medianDesc' | 'medianAsc' | 'oppsDesc' | 'title'

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(roles.map((r) => r.category || 'Other'));
    return ['All', ...Array.from(cats)];
  }, [roles]);

  // Filter & sort roles
  const filteredRoles = useMemo(() => {
    let result = [...roles];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.topSkills && r.topSkills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter((r) => r.category === categoryFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'medianDesc') return b.medianLpa - a.medianLpa;
      if (sortBy === 'medianAsc') return a.medianLpa - b.medianLpa;
      if (sortBy === 'oppsDesc') return b.opportunityCount - a.opportunityCount;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    if (maxDisplay) {
      return result.slice(0, maxDisplay);
    }
    return result;
  }, [roles, searchQuery, categoryFilter, sortBy, maxDisplay]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 rounded-lg border border-surface-border">
          <div className="flex-1 flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles or skills (e.g., Java, AWS)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 px-2.5 bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-800 focus:outline-none cursor-pointer"
            >
              <option value="medianDesc">Highest Median Comp</option>
              <option value="medianAsc">Lowest Median Comp</option>
              <option value="oppsDesc">Most Opportunities</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex border border-surface-border rounded-md overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 font-medium cursor-pointer ${
                  viewMode === 'grid' ? 'bg-brand-600 text-white' : 'bg-surface text-charcoal-600 hover:bg-canvas-subtle'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 font-medium cursor-pointer ${
                  viewMode === 'table' ? 'bg-brand-600 text-white' : 'bg-surface text-charcoal-600 hover:bg-canvas-subtle'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {filteredRoles.length === 0 ? (
        <div className="p-8 text-center bg-surface rounded-lg border border-surface-border space-y-2">
          <Layers className="w-8 h-8 text-charcoal-400 mx-auto" />
          <h4 className="text-sm font-bold text-charcoal-800">No matching role records found</h4>
          <p className="text-xs text-charcoal-500">Try adjusting your search criteria or category filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredRoles.map((role) => (
            <CompensationRoleCard
              key={role.id}
              role={role}
              isSelectedForCompare={selectedCompareIds.includes(role.id)}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface rounded-lg border border-surface-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-canvas-subtle/80 border-b border-surface-border text-charcoal-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Role Archetype</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Advertised Median</th>
                  <th className="py-2.5 px-3">Typical Range</th>
                  <th className="py-2.5 px-3">Tenure Band</th>
                  <th className="py-2.5 px-3">Key Skills</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {filteredRoles.map((role) => {
                  const isSelected = selectedCompareIds.includes(role.id);
                  return (
                    <tr
                      key={role.id}
                      className="hover:bg-canvas-subtle/50 transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-bold text-charcoal-900">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/compensation/roles/${role.id}`)}
                          className="hover:text-brand-600 text-left transition-colors cursor-pointer"
                        >
                          {role.title}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-600">
                        <span className="px-1.5 py-0.5 rounded-xs bg-canvas-muted text-[10px] font-medium border border-surface-border/60">
                          {role.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-charcoal-900">
                        ₹{role.medianLpa} LPA
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-700 font-semibold">
                        {role.typicalRange}
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-600">
                        {role.commonExperience}
                      </td>
                      <td className="py-2.5 px-3 text-charcoal-600">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {role.topSkills.slice(0, 3).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1 py-0.2 bg-canvas-muted text-charcoal-700 text-[10px] rounded-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onToggleCompare && (
                            <button
                              type="button"
                              onClick={() => onToggleCompare(role.id)}
                              className={`p-1 rounded text-xs cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-600 text-white'
                                  : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-canvas-muted'
                              }`}
                              title={isSelected ? 'Remove from compare' : 'Add to compare'}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            </button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/compensation/roles/${role.id}`)}
                            className="p-1 h-auto text-charcoal-600 hover:text-brand-600"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
