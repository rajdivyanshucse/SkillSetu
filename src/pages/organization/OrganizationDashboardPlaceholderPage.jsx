import React from 'react';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { useRouter } from '../../router/Router';

export const OrganizationDashboardPlaceholderPage = () => {
  const { navigate } = useRouter();
  const { data, completeness } = useOrganizationOnboarding();

  const totalEmployees = Object.values(data.workforce?.departments || {}).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  );

  const previewCards = [
    {
      id: 'workforce-skills',
      title: 'Workforce Skills Inventory',
      desc: 'Real-time telemetry across engineering, product, and data competency coverage.',
      icon: Users,
      tag: 'Coming in Workforce Intelligence',
      metrics: `${(data.skills || []).length} Active Competencies`,
    },
    {
      id: 'skill-gaps',
      title: 'Enterprise Skill Gap Analysis',
      desc: 'Identify critical capability deficits across microservices, cloud, and AI engineering.',
      icon: GitBranch,
      tag: 'Coming in Workforce Intelligence',
      metrics: `${(data.priorities?.strategicPriorities || []).length} Prioritized Strategic Gaps`,
    },
    {
      id: 'future-skills',
      title: 'Future Skills & Horizon Planning',
      desc: '12-to-36 month predictive workforce forecasting for emerging technologies.',
      icon: Compass,
      tag: 'Coming in Workforce Intelligence',
      metrics: `${(data.futureSkills || []).length} Emerging Horizons`,
    },
    {
      id: 'talent-needs',
      title: 'Talent Acquisition & Upskilling',
      desc: 'Automated internal mobility matching and tailored cohort upskilling pathways.',
      icon: Sparkles,
      tag: 'Coming in Workforce Intelligence',
      metrics: `${data.preferences?.workforceStrategy || 'Hybrid'} Strategy Active`,
    },
  ];

  return (
    <OrganizationLayout
      activeRoute="/organization/dashboard"
      breadcrumbItems={[
        { label: 'Enterprise Workspace' },
        { label: 'Workforce Dashboard' },
      ]}
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-surface border border-brand-200 rounded-xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
                Enterprise Intelligence
              </span>
              <span className="text-xs text-charcoal-400">•</span>
              <span className="text-xs font-semibold text-charcoal-600">
                {data.company?.name || 'TechNova Solutions'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Workforce Intelligence Dashboard
            </h1>

            <p className="text-body-sm text-charcoal-600">
              Your organization intelligence workspace is ready for workforce analysis, capability modeling, and talent planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/profile')}
            >
              View Organization Profile
            </Button>
          </div>
        </div>

        {/* Quick Calibration Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Total Headcount
            </span>
            <div className="text-2xl font-black text-charcoal-900 font-mono">
              {totalEmployees}
            </div>
            <span className="text-[11px] text-charcoal-500">
              Across {Object.keys(data.workforce?.departments || {}).length} departments
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Profile Completeness
            </span>
            <div className="text-2xl font-black text-brand-700 font-mono">
              {completeness}%
            </div>
            <span className="text-[11px] text-brand-700 font-semibold">
              Workforce Parameters
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Tracked Skills
            </span>
            <div className="text-2xl font-black text-charcoal-900 font-mono">
              {(data.skills || []).length}
            </div>
            <span className="text-[11px] text-charcoal-500">
              Competencies in inventory
            </span>
          </Card>

          <Card className="p-4 bg-surface space-y-1">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider">
              Future Horizons
            </span>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {(data.futureSkills || []).length}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Emerging skill areas
            </span>
          </Card>
        </div>

        {/* Preview Modules Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-body-md font-bold text-charcoal-900">
              Workforce Intelligence Modules
            </h2>
            <span className="text-xs text-charcoal-500">
              Structured from your Phase 9 onboarding telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.id}
                  className="p-5 bg-surface hover:border-surface-border-strong transition-all space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-body-md font-bold text-charcoal-900">
                      {card.title}
                    </h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed mt-1">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
                    <span className="font-semibold text-charcoal-800">{card.metrics}</span>
                    <span className="text-brand-600 text-[11px] font-bold">Planned</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationDashboardPlaceholderPage;
