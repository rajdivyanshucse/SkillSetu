import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Sparkles,
  Bookmark,
  Send,
  Info,
  ShieldCheck,
  TrendingUp,
  Target,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OpportunityFilters } from '../../components/opportunities/OpportunityFilters';
import { OpportunityList } from '../../components/opportunities/OpportunityList';
import { OpportunityCard } from '../../components/opportunities/OpportunityCard';
import { OpportunityIntelligence } from '../../components/opportunities/OpportunityIntelligence';
import {
  opportunitiesData,
  filterOpportunities,
  sortOpportunities,
  getStoredSavedOpportunities,
  saveStoredSavedOpportunities,
  getStoredApplicationStatuses,
  OPPORTUNITY_DATA_DISCLAIMER,
} from '../../data/opportunityData';

export const OpportunitiesPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOnboarding();

  const targetRole =
    onboardingData?.goals?.targetRole ||
    onboardingData?.interests?.roles?.[0] ||
    'Backend Software Engineer';

  const [savedIds, setSavedIds] = useState(() => getStoredSavedOpportunities());
  const [appStatuses, setAppStatuses] = useState(() => getStoredApplicationStatuses());

  const [filters, setFilters] = useState({
    searchQuery: '',
    roleCategory: 'all',
    location: 'all',
    workMode: 'all',
    experience: 'all',
    employmentType: 'all',
    skill: 'all',
  });

  const [sortBy, setSortBy] = useState('recommended');

  const handleToggleSave = (nextSavedState, updatedList) => {
    setSavedIds(updatedList);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      roleCategory: 'all',
      location: 'all',
      workMode: 'all',
      experience: 'all',
      employmentType: 'all',
      skill: 'all',
    });
  };

  // Filter and sort opportunities
  const filteredJobs = filterOpportunities(opportunitiesData, filters);
  const sortedJobs = sortOpportunities(filteredJobs, sortBy);

  // Recommended / Featured matches for top section
  const recommendedMatches = opportunitiesData
    .filter((j) => j.compatibility >= 80)
    .slice(0, 3);

  const strongMatchesCount = opportunitiesData.filter((j) => j.compatibility >= 80).length;
  const applicationsCount = Object.keys(appStatuses).length;

  return (
    <DashboardLayout
      activeRoute="/dashboard/jobs"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Opportunities & Jobs' },
      ]}
    >
      <div className="space-y-6">
        {/* Top Header Banner */}
        <section aria-label="Opportunities Header" className="space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                Jobs & Opportunities
              </h1>
              <p className="text-body-sm text-charcoal-600 mt-1">
                Explore opportunities aligned with your skills, career goals, and development path.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Bookmark className="w-3.5 h-3.5" />}
                onClick={() => navigate('/dashboard/saved')}
              >
                Saved ({savedIds.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Send className="w-3.5 h-3.5" />}
                onClick={() => navigate('/dashboard/applications')}
              >
                Applications ({applicationsCount})
              </Button>
            </div>
          </div>

          {/* Prototype Disclaimer Notice */}
          <div className="p-2.5 rounded-lg bg-canvas-subtle/80 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
            <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            <span className="text-[11px] leading-normal">{OPPORTUNITY_DATA_DISCLAIMER}</span>
          </div>
        </section>

        {/* SECTION — Profile Opportunity Summary KPIs */}
        <section aria-label="Opportunity Summary Metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Relevant Opportunities
            </span>
            <div className="text-2xl font-black text-charcoal-900">
              {opportunitiesData.length}
            </div>
            <span className="text-[11px] text-charcoal-500 block">
              Filtered for {targetRole}
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Strong Matches
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {strongMatchesCount}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              ≥80% Compatibility Fit
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Saved Opportunities
            </span>
            <div className="text-2xl font-black text-brand-700">
              {savedIds.length}
            </div>
            <span className="text-[11px] text-brand-700 font-semibold block">
              Tracked in Workspace
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Average Compatibility
            </span>
            <div className="text-2xl font-black text-charcoal-900">
              84%
            </div>
            <span className="text-[11px] text-charcoal-500 block">
              Profile Alignment Model
            </span>
          </Card>
        </section>

        {/* SECTION — Relevant for Your Profile (Highlighted Matches) */}
        {!filters.searchQuery && filters.roleCategory === 'all' && (
          <section aria-label="Relevant for Your Profile" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-body-md font-bold text-charcoal-900">
                    Relevant for Your Profile
                  </h2>
                  <p className="text-xs text-charcoal-500">
                    Highest alignment with your verified competencies and active roadmap stages.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline text-xs text-charcoal-500">
                Target Role: <strong>{targetRole}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedMatches.map((job) => (
                <OpportunityCard
                  key={`rec-${job.id}`}
                  opportunity={job}
                  isSaved={savedIds.includes(job.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION — Filters & Searchable Opportunity List */}
        <section aria-label="Opportunity Search and Filter" className="space-y-4">
          <OpportunityFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            totalCount={sortedJobs.length}
          />

          <OpportunityList
            opportunities={sortedJobs}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            searchQuery={filters.searchQuery}
            onSearchChange={(query) => setFilters({ ...filters, searchQuery: query })}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* SECTION — Opportunity Intelligence Panel */}
        <section aria-label="Opportunity Intelligence">
          <OpportunityIntelligence />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
