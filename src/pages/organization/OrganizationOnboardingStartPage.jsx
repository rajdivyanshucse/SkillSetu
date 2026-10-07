import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
  Target,
  Compass,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';

export const OrganizationOnboardingStartPage = () => {
  const { navigate } = useRouter();
  const { completeness, resetOnboarding, data } = useOrganizationOnboarding();

  const stepsPreview = [
    { title: 'Organization Identity', desc: 'Company size, headquarters, type & scope' },
    { title: 'Industry & Business', desc: 'Core sector & key business departments' },
    { title: 'Workforce Profile', desc: 'Department counts & experience levels' },
    { title: 'Current Skills', desc: 'Organizational competency & coverage %' },
    { title: 'Strategic Priorities', desc: 'Talent goals & operational challenges' },
    { title: 'Future Skills', desc: 'Emerging technology & planning horizons' },
    { title: 'Development Preferences', desc: 'L&D strategy, hiring & remote policies' },
    { title: 'Profile Calibration', desc: 'Review & initialize workforce telemetry' },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between text-charcoal-900 font-sans p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto">
        {/* Top Branding Pill */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-body-sm font-extrabold text-charcoal-900 tracking-tight leading-none block">
              SkillSetu
            </span>
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block mt-0.5">
              Workforce Intelligence Platform
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Organization Onboarding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
            Configure Your Enterprise Workforce Profile
          </h1>

          <p className="text-body-md text-charcoal-600 leading-relaxed max-w-2xl">
            Establish your organizational footprint, departmental structure, current competency inventory, and strategic skill priorities to unlock workforce intelligence.
          </p>
        </div>

        {/* 8-Step Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {stepsPreview.map((s, idx) => (
            <Card key={s.title} className="p-3.5 bg-surface space-y-1 hover:border-brand-300 transition-all">
              <span className="font-mono text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded-xs border border-brand-200 inline-block">
                STEP 0{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-charcoal-900 mt-1">{s.title}</h4>
              <p className="text-[11px] text-charcoal-500 leading-tight">{s.desc}</p>
            </Card>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-charcoal-500">
            {completeness > 20 ? (
              <span>
                Existing profile draft saved in workspace (<strong>{completeness}% complete</strong>).
              </span>
            ) : (
              <span>Estimated configuration time: 3–5 minutes.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {completeness > 20 && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  resetOnboarding();
                }}
                className="text-xs text-charcoal-500"
              >
                Reset Draft
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/organization/onboarding/company')}
              className="w-full sm:w-auto justify-center"
            >
              Start Organization Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationOnboardingStartPage;
