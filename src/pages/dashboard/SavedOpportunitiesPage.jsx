import React, { useState } from 'react';
import { Bookmark, ArrowLeft, Search, RotateCcw } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../router/Router';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityEmptyState } from '../../components/opportunities/OpportunityEmptyState';
import {
  opportunitiesData,
  getStoredSavedOpportunities,
  saveStoredSavedOpportunities,
  filterOpportunities,
  sortOpportunities,
} from '../../data/opportunityData';

export const SavedOpportunitiesPage = () => {
  const { navigate } = useRouter();
  const [savedIds, setSavedIds] = useState(() => getStoredSavedOpportunities());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const handleToggleSave = (nextSavedState, updatedList) => {
    setSavedIds(updatedList);
  };

  // Get saved opportunities
  const savedOpportunities = opportunitiesData.filter((job) => savedIds.includes(job.id));

  // Filter & sort
  const filteredSaved = filterOpportunities(savedOpportunities, { searchQuery });
  const sortedSaved = sortOpportunities(filteredSaved, sortBy);

  const sortOptions = [
    { value: 'recommended', label: 'Recommended Matches' },
    { value: 'compatibility', label: 'Highest Compatibility' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'salary', label: 'Highest Compensation' },
  ];

  return (
    <DashboardLayout
      activeRoute="/dashboard/saved"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Opportunities & Jobs', href: '/dashboard/jobs' },
        { label: 'Saved Opportunities' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Saved Opportunities
            </h1>
            <p className="text-body-sm text-charcoal-600 mt-1">
              Keep track of opportunities you may want to explore or apply to later.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/jobs')}
          >
            Explore All Opportunities
          </Button>
        </div>

        {/* Content */}
        {savedOpportunities.length === 0 ? (
          <OpportunityEmptyState type="saved" />
        ) : (
          <div className="space-y-4">
            {/* Search & Sort Bar */}
            <div className="bg-surface border border-surface-border rounded-xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your saved opportunities..."
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-canvas-subtle/80 border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:bg-surface focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-charcoal-500 font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold bg-canvas-subtle/80 border border-surface-border rounded-lg text-charcoal-800 focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Grid */}
            {sortedSaved.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-500 bg-surface border border-surface-border rounded-xl">
                No saved opportunities matched "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedSaved.map((job) => (
                  <OpportunityCard
                    key={job.id}
                    opportunity={job}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedOpportunitiesPage;
