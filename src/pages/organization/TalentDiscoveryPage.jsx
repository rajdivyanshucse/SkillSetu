import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Info, Users, Bookmark, GitCompare, Briefcase } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { talentRoles, getTalentRoleById, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';
import {
  mockCandidates,
  STORAGE_KEY_TALENT_SHORTLIST,
  STORAGE_KEY_TALENT_COMPARE,
} from '../../data/talentData';
import { calculateTalentCompatibility, getMatchingSkills } from '../../utils/talentMatching';

// Talent Components
import { TalentKpiGrid } from '../../components/talent/TalentKpiGrid';
import { TargetRoleSelector } from '../../components/talent/TargetRoleSelector';
import { TalentFilters } from '../../components/talent/TalentFilters';
import { TalentList } from '../../components/talent/TalentList';
import { TalentInsights } from '../../components/talent/TalentInsights';
import { TalentEmptyState } from '../../components/talent/TalentEmptyState';
import { TalentMethodology } from '../../components/talent/TalentMethodology';
import { useRouter } from '../../router/Router';

export const TalentDiscoveryPage = () => {
  const { navigate } = useRouter();

  // Selected Target Role State
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED_TALENT_ROLE) || talentRoles[0].id;
    } catch (e) {
      return talentRoles[0].id;
    }
  });

  // Shortlist & Compare State
  const [shortlist, setShortlist] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_SHORTLIST);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
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

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [minCompatibility, setMinCompatibility] = useState('All');
  const [sortBy, setSortBy] = useState('compatibility');

  const activeRole = useMemo(() => getTalentRoleById(selectedRoleId), [selectedRoleId]);

  // Derived filter options
  const availableSkills = useMemo(() => {
    const set = new Set();
    mockCandidates.forEach((c) => {
      Object.keys(c.skills || {}).forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, []);

  const availableLocations = useMemo(() => {
    const set = new Set(mockCandidates.map((c) => c.location).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  // Filter & Sort Candidates
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter((candidate) => {
      // 1. Keyword search (Name, headline, skills, location, bio)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(q);
        const matchesHeadline = candidate.headline.toLowerCase().includes(q);
        const matchesLoc = candidate.location.toLowerCase().includes(q);
        const matchesSkills = Object.keys(candidate.skills || {}).some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesHeadline && !matchesLoc && !matchesSkills) {
          return false;
        }
      }

      // 2. Location
      if (selectedLocation !== 'All' && candidate.location !== selectedLocation) {
        return false;
      }

      // 3. Experience
      if (selectedExperience !== 'All') {
        const exp = candidate.experienceYears || 0;
        if (selectedExperience === '0-1' && exp > 1) return false;
        if (selectedExperience === '1-3' && (exp < 1 || exp > 3)) return false;
        if (selectedExperience === '3-5' && (exp < 3 || exp > 5)) return false;
        if (selectedExperience === '5+' && exp < 5) return false;
      }

      // 4. Availability
      if (selectedAvailability !== 'All' && candidate.availability !== selectedAvailability) {
        return false;
      }

      // 5. Work Mode
      if (selectedWorkMode !== 'All' && candidate.workMode !== selectedWorkMode) {
        return false;
      }

      // 6. Specific Skill
      if (selectedSkill !== 'All' && !(candidate.skills && candidate.skills[selectedSkill])) {
        return false;
      }

      // 7. Min Compatibility
      if (minCompatibility !== 'All') {
        const minVal = parseInt(minCompatibility, 10);
        const comp = calculateTalentCompatibility(candidate, activeRole);
        if (comp.overallCompatibility < minVal) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'experience') {
        return b.experienceYears - a.experienceYears;
      }
      if (sortBy === 'requiredSkills') {
        const compA = calculateTalentCompatibility(a, activeRole);
        const compB = calculateTalentCompatibility(b, activeRole);
        return compB.requiredSkillFit - compA.requiredSkillFit;
      }
      if (sortBy === 'availability') {
        const order = { Immediate: 1, '15 days': 2, '30 days': 3, '60+ days': 4 };
        return (order[a.availability] || 5) - (order[b.availability] || 5);
      }
      // Default: Highest Compatibility
      const compA = calculateTalentCompatibility(a, activeRole);
      const compB = calculateTalentCompatibility(b, activeRole);
      return compB.overallCompatibility - compA.overallCompatibility;
    });
  }, [
    searchQuery,
    selectedLocation,
    selectedExperience,
    selectedAvailability,
    selectedWorkMode,
    selectedSkill,
    minCompatibility,
    sortBy,
    activeRole,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedLocation !== 'All') count++;
    if (selectedExperience !== 'All') count++;
    if (selectedAvailability !== 'All') count++;
    if (selectedWorkMode !== 'All') count++;
    if (selectedSkill !== 'All') count++;
    if (minCompatibility !== 'All') count++;
    return count;
  }, [
    searchQuery,
    selectedLocation,
    selectedExperience,
    selectedAvailability,
    selectedWorkMode,
    selectedSkill,
    minCompatibility,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedExperience('All');
    setSelectedAvailability('All');
    setSelectedWorkMode('All');
    setSelectedSkill('All');
    setMinCompatibility('All');
  };

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                Talent Discovery Workspace
              </span>
              <span className="text-xs text-charcoal-400">•</span>
              <span className="text-xs font-semibold text-charcoal-500">
                Live Pipeline Intelligence
              </span>
            </div>
            <h1 className="text-heading-lg font-bold text-charcoal-900 tracking-tight">
              Talent Discovery
            </h1>
            <p className="text-body-sm text-charcoal-600">
              Explore talent profiles aligned with your organization's role and skill requirements.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/organization/talent/shortlist')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-canvas-subtle border border-surface-border text-charcoal-700 hover:bg-canvas-muted hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-accent-600" />
              <span>Shortlisted ({shortlist.length})</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/organization/talent/compare')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-800 hover:bg-brand-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-brand-600" />
              <span>Compare ({compareList.length})</span>
            </button>
          </div>
        </div>

        {/* Prototype Talent Notice */}
        <div className="p-2.5 rounded-xl bg-canvas-subtle/90 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
          <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
          <span className="text-[11px]">
            Talent profiles shown here are fictional prototype data. Compatibility signals are calculated from configured role requirements and profile attributes and are not connected to live candidate databases.
          </span>
        </div>

        {/* Executive KPI Summary */}
        <TalentKpiGrid
          totalProfiles={mockCandidates.length}
          potentialMatches={filteredCandidates.length}
          shortlistedCount={shortlist.length}
          targetRolesCount={talentRoles.length}
          avgSkillCoverage={76}
          developmentAreasCount={8}
        />

        {/* Target Role Selector */}
        <TargetRoleSelector
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
        />

        {/* Filters Bar */}
        <TalentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedExperience={selectedExperience}
          onExperienceChange={setSelectedExperience}
          selectedAvailability={selectedAvailability}
          onAvailabilityChange={setSelectedAvailability}
          selectedWorkMode={selectedWorkMode}
          onWorkModeChange={setSelectedWorkMode}
          selectedSkill={selectedSkill}
          onSkillChange={setSelectedSkill}
          minCompatibility={minCompatibility}
          onMinCompatibilityChange={setMinCompatibility}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
          availableSkills={availableSkills}
          availableLocations={availableLocations}
        />

        {/* Candidate List or Empty State */}
        {filteredCandidates.length === 0 ? (
          <TalentEmptyState onReset={handleResetFilters} />
        ) : (
          <TalentList
            candidates={filteredCandidates}
            role={activeRole}
            shortlist={shortlist}
            onToggleShortlist={setShortlist}
            compareList={compareList}
            onToggleCompare={setCompareList}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Intelligence Insights */}
        <TalentInsights candidates={filteredCandidates} role={activeRole} />

        {/* Methodology */}
        <TalentMethodology />
      </div>
    </OrganizationLayout>
  );
};

export default TalentDiscoveryPage;
