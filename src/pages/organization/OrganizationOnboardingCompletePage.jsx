import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Building2, Users, Layers, Compass, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingCompletePage = () => {
  const { navigate } = useRouter();
  const { data, completeness } = useOrganizationOnboarding();

  const totalEmployees = Object.values(data.workforce?.departments || {}).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  );

  const completedMilestones = [
    { label: 'Organization identity & business functions calibrated', ready: true },
    { label: `Workforce footprint mapped across ${Object.keys(data.workforce?.departments || {}).length} departments (${totalEmployees} employees)`, ready: true },
    { label: `Current skill inventory benchmarked (${(data.skills || []).length} competencies)`, ready: true },
    { label: `Future skill horizons established (${(data.futureSkills || []).length} emerging areas)`, ready: true },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between text-charcoal-900 font-sans p-4 sm:p-8 lg:p-12">
      <div className="max-w-2xl mx-auto w-full space-y-6 my-auto text-center sm:text-left">
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto sm:mx-0 shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-xs border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Profile Calibration Complete</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
            Your organization profile is ready
          </h1>

          <p className="text-body-md text-charcoal-600 leading-relaxed">
            SkillSetu can now organize your workforce intelligence around your business priorities.
          </p>
        </div>

        {/* Milestone Card */}
        <div className="p-5 bg-surface rounded-xl border border-surface-border shadow-subtle space-y-3 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
              Workforce Calibration Summary
            </span>
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
              {completeness}% Score
            </span>
          </div>

          <div className="space-y-2">
            {completedMilestones.map((m) => (
              <div key={m.label} className="flex items-center gap-2.5 text-xs text-charcoal-800 font-medium">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/organization/dashboard')}
            className="w-full justify-center"
          >
            Continue to Workforce Dashboard
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/organization/profile')}
            className="w-full justify-center"
          >
            View Organization Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOnboardingCompletePage;
