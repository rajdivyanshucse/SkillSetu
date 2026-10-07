import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  GitBranch,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import {
  calculateCoverageStatus,
  calculateSkillGap,
  calculateWorkforceMetrics,
} from '../../utils/workforceIntelligence';
import { COVERAGE_STATUS_THRESHOLDS } from '../../data/workforceIntelligenceData';
import { SkillDetailDrawer } from '../../components/workforce/SkillDetailDrawer';
import { WorkforceEmptyState } from '../../components/workforce/WorkforceEmptyState';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const WorkforceOverviewPage = () => {
  const { data: onboardingData } = useOrganizationOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCoverageTier, setSelectedCoverageTier] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Merge context with fallback
  const effectiveOrgData = {
    ...mockOrganizationProfile,
    ...onboardingData,
    company: {
      ...mockOrganizationProfile.company,
      ...(onboardingData.company || {}),
    },
    workforce: {
      ...mockOrganizationProfile.workforce,
      ...(onboardingData.workforce || {}),
    },
    currentSkills: (onboardingData.currentSkills && onboardingData.currentSkills.length > 0)
      ? onboardingData.currentSkills
      : mockOrganizationProfile.currentSkills,
    futureSkills: (onboardingData.futureSkills && onboardingData.futureSkills.length > 0)
      ? onboardingData.futureSkills
      : mockOrganizationProfile.futureSkills,
  };

  const metrics = calculateWorkforceMetrics(effectiveOrgData);

  // Categories list
  const categories = [
    'All',
    'Programming',
    'Backend',
    'Frontend',
    'Database',
    'Cloud',
    'DevOps',
    'Data',
    'AI/ML',
    'Management',
    'Business',
  ];

  // Map and enrich skills data
  const enrichedSkills = useMemo(() => {
    return effectiveOrgData.currentSkills.map((skillItem) => {
      const name = typeof skillItem === 'string' ? skillItem : skillItem.name;
      const coverage = typeof skillItem === 'object' ? (skillItem.coverage || skillItem.percentage || 50) : 50;
      const level = typeof skillItem === 'object' ? (skillItem.level || 'Intermediate') : 'Intermediate';
      const category = typeof skillItem === 'object' ? (skillItem.category || 'Backend') : 'Backend';

      const statusInfo = calculateCoverageStatus(coverage);
      const gapInfo = calculateSkillGap(name, coverage);

      return {
        name,
        coverage,
        level,
        category,
        statusInfo,
        gapInfo,
      };
    });
  }, [effectiveOrgData.currentSkills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return enrichedSkills.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' ||
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Programming' && (item.category === 'Backend' || item.category === 'Frontend'));

      let matchesTier = true;
      if (selectedCoverageTier === 'strong') matchesTier = item.coverage >= 75;
      else if (selectedCoverageTier === 'moderate') matchesTier = item.coverage >= 50 && item.coverage < 75;
      else if (selectedCoverageTier === 'developing') matchesTier = item.coverage >= 25 && item.coverage < 50;
      else if (selectedCoverageTier === 'limited') matchesTier = item.coverage < 25;

      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [enrichedSkills, searchQuery, selectedCategory, selectedCoverageTier]);

  const handleOpenSkill = (skillName) => {
    setSelectedSkill(skillName);
    setDrawerOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCoverageTier('All');
  };

  return (
    <OrganizationLayout activeRoute="/organization/workforce">
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="bg-surface p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-body-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-xs">
                Workforce Inventory
              </span>
              <span className="text-body-xs text-charcoal-400">
                {effectiveOrgData.company?.name || 'TechNova Solutions'}
              </span>
            </div>
            <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
              Workforce Skills & Capability Matrix
            </h1>
            <p className="text-body-sm text-charcoal-600 mt-1">
              Comprehensive inventory of tracked organizational competencies, capability levels, and coverage distribution.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-canvas-subtle rounded-md border border-surface-border text-center">
              <span className="text-caption text-charcoal-500 block">Total Skills</span>
              <span className="text-body font-mono font-bold text-charcoal-900">{enrichedSkills.length}</span>
            </div>
            <div className="p-3 bg-canvas-subtle rounded-md border border-surface-border text-center">
              <span className="text-caption text-charcoal-500 block">Avg Coverage</span>
              <span className="text-body font-mono font-bold text-brand-700">{metrics.avgCoverage}%</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-surface p-4 rounded-lg border border-surface-border shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, categories, frameworks..."
                className="w-full pl-9 pr-4 py-2 text-body-sm bg-canvas rounded-md border border-surface-border text-charcoal-900 placeholder:text-charcoal-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Coverage Tier Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-body-xs text-charcoal-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Coverage:
              </span>
              <select
                value={selectedCoverageTier}
                onChange={(e) => setSelectedCoverageTier(e.target.value)}
                className="text-body-xs bg-canvas px-3 py-2 rounded-md border border-surface-border text-charcoal-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Coverage Levels</option>
                <option value="strong">Strong (75%+)</option>
                <option value="moderate">Moderate (50–74%)</option>
                <option value="developing">Developing (25–49%)</option>
                <option value="limited">Limited (0–24%)</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-body-xs scrollbar-none">
            <span className="text-caption text-charcoal-400 uppercase tracking-wider mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                  ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Inventory Table / Grid */}
        {filteredSkills.length === 0 ? (
          <WorkforceEmptyState onReset={handleResetFilters} />
        ) : (
          <div className="bg-surface rounded-lg border border-surface-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-body-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border bg-canvas-subtle/60 text-charcoal-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Skill / Competency</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Capability Level</th>
                    <th className="py-3 px-4">Workforce Coverage</th>
                    <th className="py-3 px-4">Coverage Status</th>
                    <th className="py-3 px-4">Target Benchmark</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/70">
                  {filteredSkills.map((item) => (
                    <tr
                      key={item.name}
                      onClick={() => handleOpenSkill(item.name)}
                      className="hover:bg-canvas-subtle/80 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-canvas text-charcoal-800 border border-surface-border flex items-center justify-center font-bold text-[11px]">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-charcoal-900 group-hover:text-brand-600 transition-colors text-body-sm">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-charcoal-600">
                        <span className="px-2 py-0.5 rounded-xs bg-canvas-subtle border border-surface-border text-[11px] font-medium">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-charcoal-700">
                        {item.level}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <span className="font-mono font-bold text-charcoal-900 w-9">
                            {item.coverage}%
                          </span>
                          <div className="flex-1 h-2 bg-canvas-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.statusInfo.barColor}`}
                              style={{ width: `${item.coverage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-xs border ${item.statusInfo.badgeClass}`}>
                          {item.statusInfo.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-charcoal-700">
                            {item.gapInfo.targetCoverage}%
                          </span>
                          {item.gapInfo.gapPoints > 0 && (
                            <span className="text-[10px] font-bold text-warning-700">
                              (-{item.gapInfo.gapPoints}%)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          className="text-brand-600 group-hover:text-brand-700 font-semibold inline-flex items-center gap-1 text-body-xs"
                        >
                          <span>Deep-Dive</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-surface-border bg-canvas-subtle/40 flex items-center justify-between text-body-xs text-charcoal-500">
              <span>Showing {filteredSkills.length} of {enrichedSkills.length} competencies</span>
              <span className="text-[11px] text-charcoal-400">
                Click any row to open full capability diagnostics
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Slide-out Drawer */}
      <SkillDetailDrawer
        skillName={selectedSkill}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        orgData={effectiveOrgData}
      />
    </OrganizationLayout>
  );
};

export default WorkforceOverviewPage;
