import React from 'react';
import { Link } from '../../router/Router';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import OrganizationGrowthKpiGrid from '../../components/growth/OrganizationGrowthKpiGrid';
import OrganizationCapabilityDevelopment from '../../components/growth/OrganizationCapabilityDevelopment';
import OrganizationDevelopmentPrograms from '../../components/growth/OrganizationDevelopmentPrograms';
import OrganizationGrowthInsights from '../../components/growth/OrganizationGrowthInsights';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Users,
  Compass,
  DollarSign,
  Target
} from 'lucide-react';
import {
  ORGANIZATION_GROWTH_KPIS,
  ORGANIZATION_CAPABILITIES,
  ORGANIZATION_DEVELOPMENT_PROGRAMS,
  ORGANIZATION_GROWTH_INSIGHTS
} from '../../data/growthData';

export default function OrganizationGrowthPage() {
  return (
    <OrganizationLayout activeRoute="/organization/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm" className="gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Workforce Capability Development
              </Badge>
              <Badge variant="neutral" size="sm">
                Aggregate View
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
              Professional Growth & Workforce Development
            </h1>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Monitor aggregate capability development, learning progress, and workforce development priorities across organizational teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/organization/growth/capabilities">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5" />
                All Capabilities ({ORGANIZATION_CAPABILITIES.length})
              </Button>
            </Link>
            <Link to="/organization/growth/development">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <GraduationCap className="w-3.5 h-3.5" />
                Learning Programs ({ORGANIZATION_DEVELOPMENT_PROGRAMS.length})
              </Button>
            </Link>
            <Link to="/organization/planning">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs">
                <Compass className="w-3.5 h-3.5" />
                Workforce Plan
              </Button>
            </Link>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <OrganizationGrowthKpiGrid kpis={ORGANIZATION_GROWTH_KPIS} />

        {/* Main Grid: Capabilities & Programs Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Capability Development Summary */}
            <OrganizationCapabilityDevelopment
              capabilities={ORGANIZATION_CAPABILITIES.slice(0, 4)}
            />

            {/* Development Programs Summary */}
            <OrganizationDevelopmentPrograms
              programs={ORGANIZATION_DEVELOPMENT_PROGRAMS.slice(0, 3)}
            />
          </div>

          {/* Right Sidebar: Strategic Integrations */}
          <div className="space-y-6">
            {/* Workforce Planning Connection */}
            <Card className="p-5 border-charcoal-light/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-warm-brown flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  Workforce Planning
                </span>
                <Badge variant="warning" size="sm">Planning</Badge>
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                Planning Capability Gaps
              </h4>
              <p className="text-xs text-charcoal-muted mb-4">
                Connect capability development cohorts directly with multi-horizon scenario forecasts.
              </p>

              <div className="p-3 bg-warm-sand/20 rounded border border-charcoal-light/10 space-y-2 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Cloud Engineering Gap:</span>
                  <span className="font-bold text-warm-charcoal">18 FTEs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Active Upskilling Cohort:</span>
                  <span className="font-bold text-sage-dark">34 participants</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Action Strategy:</span>
                  <span className="font-bold text-warm-brown">Upskill + Hire</span>
                </div>
              </div>

              <Link to="/organization/planning">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
                  <span>View Workforce Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Talent Matching Connection */}
            <Card className="p-5 border-charcoal-light/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-warm-brown flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Talent Discovery
                </span>
                <Badge variant="primary" size="sm">Talent</Badge>
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                External Talent Signals
              </h4>
              <p className="text-xs text-charcoal-muted mb-4">
                Where internal development timelines do not meet demand, explore aligned external candidate pools.
              </p>

              <div className="p-3 bg-warm-sand/20 rounded border border-charcoal-light/10 text-xs mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-charcoal-muted">Cloud Architecture:</span>
                  <span className="font-semibold text-warm-charcoal">6 aligned profiles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">AI Engineering:</span>
                  <span className="font-semibold text-warm-charcoal">8 aligned profiles</span>
                </div>
              </div>

              <Link to="/organization/talent">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
                  <span>Explore Prototype Talent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            {/* Compensation Intelligence Connection */}
            <Card className="p-5 border-charcoal-light/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-warm-brown flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Market Benchmarks
                </span>
                <Badge variant="neutral" size="sm">Compensation</Badge>
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                Compensation Intelligence
              </h4>
              <p className="text-xs text-charcoal-muted mb-4">
                Evaluate advertised compensation trends for capabilities undergoing internal development.
              </p>

              <Link to="/organization/compensation">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
                  <span>View Compensation Patterns</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Aggregate Growth Insights */}
        <OrganizationGrowthInsights insights={ORGANIZATION_GROWTH_INSIGHTS} />

        <GrowthDisclaimer isOrganization={true} />
      </div>
    </OrganizationLayout>
  );
}
