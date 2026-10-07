import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  Layers,
  ShieldCheck,
  Info,
  ExternalLink,
  ChevronRight,
  Scale,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import {
  getNormalizedRoleById,
  fictionalOpportunityRecords,
  experienceBands,
  locationBenchmarks,
  STORAGE_KEY_COMPENSATION,
} from '../../data/compensationData';
import {
  calculateRoleCompensationSummary,
  generateCompensationInsights,
  getStoredCompensationPreferences,
  saveStoredCompensationPreferences,
} from '../../utils/compensationIntelligence';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CompensationRoleDetailPage = ({ roleId }) => {
  const { navigate } = useRouter();

  const roleSummary = useMemo(() => {
    return calculateRoleCompensationSummary(roleId, fictionalOpportunityRecords);
  }, [roleId]);

  const insights = useMemo(() => {
    return generateCompensationInsights(fictionalOpportunityRecords, { roleId });
  }, [roleId]);

  const handleCompareClick = () => {
    const existing = getStoredCompensationPreferences() || {};
    const current = existing.compareIds || [];
    let updated;
    if (!current.includes(roleSummary.id)) {
      updated = [...current.slice(-3), roleSummary.id];
    } else {
      updated = current;
    }
    saveStoredCompensationPreferences({ ...existing, compareIds: updated });
    navigate('/dashboard/compensation/compare');
  };

  return (
    <DashboardLayout activeRoute="/dashboard/compensation">
      <div className="space-y-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard/compensation/roles')}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Role Catalog
              </button>
              <span className="text-charcoal-300">•</span>
              <span className="text-xs font-semibold text-charcoal-500">
                {roleSummary.category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
              {roleSummary.title}
              {roleSummary.growthSignal && (
                <Badge variant="brand" size="sm">
                  {roleSummary.growthSignal}
                </Badge>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              {roleSummary.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCompareClick}
              className="text-xs flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare this Role
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/jobs')}
              className="text-xs flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Matching Opportunities
            </Button>
          </div>
        </div>

        {/* Highlight Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Advertised Median */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
              Advertised Median
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
                ₹{roleSummary.calculatedMedian || roleSummary.medianLpa}
              </span>
              <span className="text-xs font-bold text-charcoal-600">LPA</span>
            </div>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              50th percentile across prototype records
            </span>
          </div>

          {/* Typical Span */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
              Typical Advertised Span
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-charcoal-900 tracking-tight">
                {roleSummary.calculatedRange || roleSummary.typicalRange}
              </span>
            </div>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Interquartile range (P25–P75)
            </span>
          </div>

          {/* Opportunity Sample */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
              Opportunity Sample
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-charcoal-900 tracking-tight">
                {roleSummary.opportunityCount}
              </span>
              <span className="text-xs font-semibold text-charcoal-600">listings</span>
            </div>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              In fictional catalog
            </span>
          </div>

          {/* Primary Work Mode */}
          <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-xs">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block mb-1">
              Primary Arrangement
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-charcoal-900 tracking-tight">
                {roleSummary.primaryWorkMode || 'Hybrid'}
              </span>
            </div>
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Dominant arrangement
            </span>
          </div>
        </div>

        {/* Percentile Distribution Meter */}
        <div className="bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-charcoal-900">
              Advertised Percentile Spread
            </h3>
            <span className="text-xs text-charcoal-500">
              Prototype Parametric Distribution
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-charcoal-600 font-semibold">
              <span>25th Percentile (Entry): ₹{roleSummary.percentiles?.p25 || roleSummary.p25Lpa} LPA</span>
              <span>Median (P50): ₹{roleSummary.percentiles?.p50 || roleSummary.medianLpa} LPA</span>
              <span>75th Percentile (Senior): ₹{roleSummary.percentiles?.p75 || roleSummary.p75Lpa} LPA</span>
            </div>
            <div className="h-3 w-full bg-canvas-muted rounded-full overflow-hidden flex">
              <div className="w-1/4 bg-amber-400" title="P0–P25" />
              <div className="w-2/4 bg-brand-600" title="P25–P75" />
              <div className="w-1/4 bg-emerald-500" title="P75–P100" />
            </div>
            <div className="flex justify-between text-[11px] text-charcoal-400">
              <span>Min Advertised: ₹{roleSummary.minLpa} LPA</span>
              <span>Max Advertised: ₹{roleSummary.maxLpa} LPA</span>
            </div>
          </div>
        </div>

        {/* Why this matters card */}
        <div className="p-4 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs text-charcoal-700 space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-700" />
            <span className="font-bold text-brand-900 uppercase tracking-wider text-[11px]">
              Why this Matters & Contextual Variance
            </span>
          </div>
          <p className="leading-relaxed">
            Advertised compensation ranges in opportunity listings reflect specific organizational hiring parameters and vary widely based on candidate experience, geographical location, specialized skill requirements, company scale, and business sector. They do not constitute guaranteed contractual offers or uniform market rates.
          </p>
        </div>

        {/* Associated Skills & Matched Prototype Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Associated Skills */}
          <div className="bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Associated Key Capabilities
            </h3>
            <p className="text-xs text-charcoal-500">
              Skills frequently mentioned in prototype opportunity profiles for this role archetype.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {roleSummary.topSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-canvas-subtle text-charcoal-800 text-xs font-semibold border border-surface-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Related Opportunities in Dataset */}
          <div className="bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              Related Opportunity Records ({roleSummary.matchedOpportunities?.length || 0})
            </h3>
            <p className="text-xs text-charcoal-500">
              Sample fictional job listings mapped to this role archetype.
            </p>
            <div className="space-y-2">
              {roleSummary.matchedOpportunities?.slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="p-2.5 rounded-md bg-canvas-subtle/50 border border-surface-border flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-charcoal-900 block">
                      {opp.company}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      {opp.location} • {opp.workMode} • {opp.experienceBand}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-charcoal-900 block">
                      ₹{opp.advertisedMin}–{opp.advertisedMax} LPA
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/jobs')}
                      className="text-[11px] font-semibold text-brand-600 hover:text-brand-800"
                    >
                      View in Jobs →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role Specific Insights */}
        <div className="bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-charcoal-900">
            Role Specific Observations
          </h3>
          <div className="space-y-2">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-md bg-canvas-subtle/40 border border-surface-border text-xs text-charcoal-700 space-y-1"
              >
                <div className="font-bold text-charcoal-900">{item.title}</div>
                <p>{item.observation}</p>
                <span className="text-[11px] text-brand-700 font-semibold block">
                  {item.supportingMetric}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="general" />
      </div>
    </DashboardLayout>
  );
};
