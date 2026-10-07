import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, GraduationCap, Compass, Layers } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const DashboardEmptyState = ({ className = '' }) => {
  const { navigate } = useRouter();

  const previewPillars = [
    { label: 'Role Alignment Meter', desc: 'Synthesizes how closely your skills match 100+ industry archetypes.' },
    { label: 'Skill Gap Prioritization', desc: 'Identifies critical high-impact competencies to focus on next.' },
    { label: 'Actionable Career Roadmap', desc: 'Produces clear, step-by-step project & certification milestones.' },
  ];

  return (
    <Card className={`p-8 sm:p-12 text-center max-w-2xl mx-auto my-6 border-brand-200 shadow-card ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto shadow-subtle mb-5">
        <Compass className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
        <span>Profile Calibration Required</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight mb-2">
        Complete your profile to unlock career intelligence
      </h2>

      <p className="text-body-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed mb-6">
        SkillSetu needs your declared skills, education background, and target career goals to generate high-resolution role compatibility and priority gap insights.
      </p>

      {/* Preview Pillars */}
      <div className="p-4 rounded-lg bg-canvas-subtle/80 border border-surface-border text-left space-y-2.5 mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 block border-b border-surface-border pb-1.5">
          What your calibrated profile unlocks:
        </span>
        <div className="space-y-2">
          {previewPillars.map((p) => (
            <div key={p.label} className="text-xs">
              <span className="font-bold text-charcoal-900">{p.label}: </span>
              <span className="text-charcoal-600">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/onboarding')}
          className="w-full sm:w-auto"
        >
          Continue Profile Setup
        </Button>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/features')}
          className="w-full sm:w-auto"
        >
          Learn How It Works
        </Button>
      </div>
    </Card>
  );
};

export default DashboardEmptyState;
