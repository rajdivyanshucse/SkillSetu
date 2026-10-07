import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { getMergedDashboardData } from '../../data/dashboardData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { PersonalizedPathway } from '../../components/roadmap/PersonalizedPathway';

export const CareerIntelligencePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data: onboardingData, calculateCompleteness } = useOnboarding();

  const completeness = calculateCompleteness ? calculateCompleteness() : 92;
  const dashboardData = getMergedDashboardData(onboardingData, completeness);

  const roles = dashboardData.careerFit.roles || [];
  const [selectedRole, setSelectedRole] = useState(roles[0] || {});

  const handleExploreRoadmap = (roleTitle) => {
    navigate('/dashboard/career-roadmap');
  };

  return (
    <DashboardLayout
      activeRoute="/dashboard/career-intelligence"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: 'Career Intelligence' },
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Career Compatibility Archetypes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Career Intelligence
            </h1>
            <p className="text-body-sm text-charcoal-600 max-w-xl">
              Explore how your current profile aligns with different career directions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge status="recommended" size="md">
              Target: {dashboardData.careerFit.targetRole} ({roles[0]?.compatibility}%)
            </Badge>
          </div>
        </div>

        {/* Top Active Target Role Alignment Showcase */}
        <Card className="p-6 border-brand-200/90 bg-gradient-to-br from-surface to-brand-50/30 shadow-subtle">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-800 bg-brand-100 px-2.5 py-0.5 rounded-xs">
                  Primary Target Role
                </span>
                <span className="text-xs text-charcoal-500 font-medium">
                  Calibrated via Profile Goals
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900">
                {selectedRole.title || dashboardData.careerFit.targetRole}
              </h2>

              <p className="text-body-sm text-charcoal-600 leading-relaxed">
                {selectedRole.description}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-surface-border shadow-xs shrink-0 self-start lg:self-center">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-brand-700 tracking-tight">
                  {selectedRole.compatibility || 84}%
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 mt-1">
                  Profile Compatibility
                </div>
              </div>

              <div className="h-10 w-px bg-surface-border" />

              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleExploreRoadmap(selectedRole.title)}
              >
                View Roadmap
              </Button>
            </div>
          </div>

          {/* Why This Role Fits breakdown */}
          <div className="mt-6 pt-5 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strong Alignment Factors</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-normal">
                Your declared foundation in {selectedRole.alignedSkills ? selectedRole.alignedSkills.join(', ') : 'Java, SQL, REST APIs'} gives you strong alignment with core responsibilities.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selectedRole.alignedSkills || ['Java', 'SQL', 'Spring Boot']).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Development / Expansion Areas</span>
              </div>
              <p className="text-xs text-charcoal-600 leading-normal">
                Closing gaps in {selectedRole.gapSkills ? selectedRole.gapSkills.join(', ') : 'Cloud, System Design, Docker'} will significantly boost full stack & production readiness.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selectedRole.gapSkills || ['AWS', 'Docker', 'System Design']).map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-xs bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    ▲ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Compensation Intelligence Signal */}
            <div className="p-4 rounded-lg bg-surface border border-surface-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-800">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>Advertised Compensation Pattern</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/compensation')}
                  className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 cursor-pointer"
                >
                  View Details →
                </button>
              </div>
              <div className="flex items-baseline justify-between pt-0.5">
                <div>
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Typical Advertised Range
                  </span>
                  <span className="text-sm font-extrabold text-charcoal-900">
                    ₹8.0–16.0 LPA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block">
                    Prototype Median
                  </span>
                  <span className="text-sm font-bold text-charcoal-700">
                    ₹11.5 LPA
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-normal italic pt-1 border-t border-surface-border/60">
                Compatibility rating reflects skill alignment and is not a prediction of individual compensation.
              </p>
            </div>
          </div>
        </Card>

        {/* Role Archetype Comparison Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-body-md font-bold text-charcoal-900">
              Benchmark Across Alternative Archetypes
            </h3>
            <span className="text-xs text-charcoal-500">
              Click any role to inspect alignment factors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const isSelected = selectedRole.title === role.title;
              return (
                <button
                  key={role.id || role.title}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`
                    p-5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between
                    ${
                      isSelected
                        ? 'bg-brand-50/50 border-brand-500 ring-2 ring-brand-300/40 shadow-card'
                        : 'bg-surface border-surface-border hover:border-surface-border-strong hover:shadow-xs'
                    }
                  `}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-body-md font-bold text-charcoal-900">
                        {role.title}
                      </h4>
                      <span className="text-body-sm font-extrabold text-brand-700">
                        {role.compatibility}%
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-600 leading-normal mb-4">
                      {role.description}
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${role.compatibility}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-charcoal-500 font-medium">
                      <span>{role.matchLevel}</span>
                      <span className="text-brand-700 font-semibold">
                        {isSelected ? 'Selected' : 'Inspect Factor'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Personalized Career Pathway (Phase 7 Roadmap Experience) */}
        <PersonalizedPathway
          targetRole={selectedRole.title || dashboardData.careerFit.targetRole}
          compatibility={selectedRole.compatibility || 84}
          alignedSkills={selectedRole.alignedSkills || ['Java', 'SQL', 'Spring Boot', 'REST APIs']}
          gapSkills={selectedRole.gapSkills || ['AWS', 'Docker', 'System Design']}
          description={selectedRole.description}
        />

        {/* Disclaimer Callout */}
        <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border flex items-start gap-3 text-xs text-charcoal-600">
          <Info className="w-4 h-4 text-charcoal-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-charcoal-800">
              Integrity Notice on Compatibility Ratings:
            </div>
            <p className="leading-relaxed text-[11px]">
              {dashboardData.careerFit.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CareerIntelligencePage;
