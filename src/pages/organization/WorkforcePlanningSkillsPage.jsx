import React, { useState, useMemo } from 'react';
import { Compass, ArrowLeft, Search, Filter, ExternalLink, Sparkles, TrendingUp, UserPlus, BookOpen } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { mockOrganizationProfile } from '../../data/organizationData';
import { defaultPlanningScenarios, getPlanningScenarioById, STORAGE_KEY_WORKFORCE_PLANNING } from '../../data/workforcePlanningData';
import { calculateScenarioMetrics } from '../../utils/workforcePlanning';
import { PlanningMethodology } from '../../components/workforce-planning/PlanningMethodology';
import { Button } from '../../components/ui/Button';

export const WorkforcePlanningSkillsPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOrganizationOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Stored Planning State
  const [storedConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKFORCE_PLANNING);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const activeScenarioId = storedConfig?.activeScenarioId || defaultPlanningScenarios[0].id;
  const horizonMonths = storedConfig?.horizonMonths || 24;

  const activeScenario = useMemo(() => {
    const base = getPlanningScenarioById(activeScenarioId);
    if (storedConfig?.customScenarios && storedConfig.customScenarios[activeScenarioId]) {
      return {
        ...base,
        ...storedConfig.customScenarios[activeScenarioId],
      };
    }
    return base;
  }, [activeScenarioId, storedConfig]);

  const effectiveOrgData = useMemo(() => ({
    ...mockOrganizationProfile,
    ...onboardingData,
  }), [onboardingData]);

  const metrics = useMemo(() => {
    return calculateScenarioMetrics(activeScenario, horizonMonths, effectiveOrgData);
  }, [activeScenario, horizonMonths, effectiveOrgData]);

  const categories = ['All', 'Cloud', 'Data', 'AI/ML', 'Backend', 'Frontend', 'Security', 'Product', 'DevOps'];

  const filteredCapabilities = useMemo(() => {
    return metrics.capabilities.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [metrics.capabilities, searchQuery, selectedCategory]);

  return (
    <OrganizationLayout activeRoute="/organization/planning">
      <div className="space-y-6 pb-12">
        {/* Top Back & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/planning')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Workforce Planning Overview</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/organization/talent')}
            className="cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Explore Talent Discovery</span>
          </Button>
        </div>

        {/* Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Future Skill Planning & Capability Demand
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              Granular projection modeling of critical future capabilities under the {activeScenario.name} scenario ({horizonMonths} Months).
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Total Capacity Gap</span>
            <span className="text-lg font-black font-mono text-danger-700">+{metrics.totalCapacityGap} Units</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface p-4 rounded-xl border border-surface-border shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search capability domains, technologies, categories..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-canvas rounded-lg border border-surface-border text-charcoal-900 placeholder:text-charcoal-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 mr-1">Domain:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                  ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-2xs'
                      : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Capability Demand Matrix */}
        <div className="bg-surface rounded-2xl border border-surface-border shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-border bg-canvas-subtle/60 text-charcoal-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Capability Domain</th>
                  <th className="py-3 px-3">Current Capacity</th>
                  <th className="py-3 px-3">Projected Requirement</th>
                  <th className="py-3 px-3">Capacity Gap</th>
                  <th className="py-3 px-3">Importance</th>
                  <th className="py-3 px-3">Action Allocation</th>
                  <th className="py-3 px-4 text-right">Talent Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
                {filteredCapabilities.map((cap) => (
                  <tr key={cap.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-charcoal-900">
                      <div>
                        <span>{cap.name}</span>
                        <span className="text-[10px] text-charcoal-400 block font-normal">
                          {cap.category} • Horizon: {cap.horizon}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-charcoal-800">
                      {cap.currentCapacity} units
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-brand-700">
                      {cap.projectedRequirement} units
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-danger-700 bg-danger-50 border border-danger-200 px-2 py-0.5 rounded-md text-[11px]">
                        +{cap.capacityGap} Units
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-charcoal-700">
                        {cap.importance}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-[11px] space-y-0.5 font-mono">
                        <span className="text-brand-700 font-bold block">
                          Upskill: ~{cap.actionMix.upskillUnits}
                        </span>
                        <span className="text-accent-700 block">
                          Hire: ~{cap.actionMix.hiringUnits}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {cap.talentPoolSignalCount > 0 && (
                        <button
                          type="button"
                          onClick={() => navigate('/organization/talent')}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 cursor-pointer"
                        >
                          <span>{cap.talentPoolSignalCount} in Pool</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology */}
        <PlanningMethodology />
      </div>
    </OrganizationLayout>
  );
};

export default WorkforcePlanningSkillsPage;
