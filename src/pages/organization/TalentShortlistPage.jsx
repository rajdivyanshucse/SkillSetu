import React, { useState, useMemo } from 'react';
import { Bookmark, ArrowLeft, Search, Filter, Sparkles, ArrowRight, Trash2, GitCompare } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { mockCandidates, STORAGE_KEY_TALENT_SHORTLIST, STORAGE_KEY_TALENT_COMPARE } from '../../data/talentData';
import { talentRoles, getTalentRoleById, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';
import { TalentCard } from '../../components/talent/TalentCard';
import { TargetRoleSelector } from '../../components/talent/TargetRoleSelector';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const TalentShortlistPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED_TALENT_ROLE) || talentRoles[0].id;
    } catch (e) {
      return talentRoles[0].id;
    }
  });

  const activeRole = useMemo(() => getTalentRoleById(selectedRoleId), [selectedRoleId]);

  const [shortlist, setShortlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_SHORTLIST);
      const parsed = raw ? JSON.parse(raw) : [];
      // Default initial shortlist if empty for smooth demo
      if (!parsed || parsed.length === 0) {
        return ['candidate-001', 'candidate-002', 'candidate-004', 'candidate-006'];
      }
      return parsed;
    } catch (e) {
      return ['candidate-001', 'candidate-002', 'candidate-004', 'candidate-006'];
    }
  });

  const [compareList, setCompareList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_COMPARE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  const shortlistedCandidates = useMemo(() => {
    return shortlist
      .map((id) => mockCandidates.find((c) => c.id === id))
      .filter(Boolean)
      .filter((candidate) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(q) ||
          candidate.headline.toLowerCase().includes(q) ||
          candidate.location.toLowerCase().includes(q)
        );
      });
  }, [shortlist, searchQuery]);

  const handleClearShortlist = () => {
    setShortlist([]);
    try {
      localStorage.setItem(STORAGE_KEY_TALENT_SHORTLIST, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear shortlist in localStorage:', e);
    }
    addToast({
      title: 'Shortlist Cleared',
      message: 'All candidates have been removed from your saved shortlist.',
      type: 'info',
      duration: 2500,
    });
  };

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/talent')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Talent Discovery</span>
          </button>

          {shortlist.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => navigate('/organization/talent/compare')}
                className="cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5 mr-1" />
                <span>Compare Shortlist</span>
              </Button>

              <button
                type="button"
                onClick={handleClearShortlist}
                className="text-xs text-charcoal-500 hover:text-danger-700 font-semibold px-2.5 py-1.5 rounded-lg border border-surface-border hover:bg-canvas-subtle transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Page Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-700 border border-accent-200 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Shortlisted Talent Candidates
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              Profiles saved for team review and alignment against {activeRole.title}.
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Total Saved</span>
            <span className="text-lg font-black font-mono text-accent-700">{shortlist.length} Profiles</span>
          </div>
        </div>

        {/* Target Role Selector */}
        <TargetRoleSelector
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
        />

        {/* Search Bar */}
        {shortlist.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter shortlisted candidates by name or headline..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-surface rounded-xl border border-surface-border text-charcoal-900 placeholder:text-charcoal-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        )}

        {/* Candidates Grid or Empty State */}
        {shortlistedCandidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-surface-border bg-surface max-w-md mx-auto my-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent-50 text-accent-700 border border-accent-200 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-body font-bold text-charcoal-900">
              No Candidates Shortlisted Yet
            </h3>
            <p className="text-xs text-charcoal-600 max-w-xs mx-auto">
              Save promising talent profiles during discovery to evaluate, share with hiring managers, and compare.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/organization/talent')}
              className="cursor-pointer"
            >
              <span>Explore Talent</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortlistedCandidates.map((candidate) => (
              <TalentCard
                key={candidate.id}
                candidate={candidate}
                role={activeRole}
                shortlist={shortlist}
                onToggleShortlist={setShortlist}
                compareList={compareList}
                onToggleCompare={setCompareList}
              />
            ))}
          </div>
        )}
      </div>
    </OrganizationLayout>
  );
};

export default TalentShortlistPage;
