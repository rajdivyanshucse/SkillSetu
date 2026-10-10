import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Target,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * CapabilityReadinessHero Component
 * Replaces job-search hero with a prominent Career Readiness and Evidence-Backed Capability view.
 */
export const CapabilityReadinessHero = ({
  targetRole = 'Backend Software Engineer',
  readinessPct = 78,
  counts = { demonstrated: 6, developing: 3, selfReported: 2, evidenceNeeded: 2, total: 13 },
  biggestGap = 'Cloud Infrastructure & AWS',
  className = '',
}) => {
  const { navigate } = useRouter();
  const [showExplainerModal, setShowExplainerModal] = useState(false);

  return (
    <div
      className={`bg-surface border border-surface-border rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Subtle brand background gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Target Role & Readiness Score */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-800 text-xs font-semibold rounded-full border border-brand-200">
              <Target className="w-3.5 h-3.5 text-brand-600" />
              TARGET ROLE READINESS
            </span>
            <button
              onClick={() => setShowExplainerModal(true)}
              className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 transition-colors ml-1 font-medium"
              title="How is this determined?"
            >
              <HelpCircle className="w-3.5 h-3.5 text-charcoal-400" />
              <span>How is this determined?</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
              {targetRole}
            </h1>
            <p className="text-sm text-charcoal-500 mt-1 max-w-xl">
              Evidence-based evaluation of your demonstrated capabilities and remaining gaps required for role competency.
            </p>
          </div>

          {/* Readiness Progress Bar & Honest Metrics */}
          <div className="space-y-2 pt-1 max-w-lg">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
                Overall Capability Readiness
              </span>
              <span className="text-2xl font-bold text-charcoal-900">{readinessPct}%</span>
            </div>
            <div className="w-full bg-canvas-muted h-3 rounded-full overflow-hidden p-0.5 border border-surface-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${readinessPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-brand-600 h-full rounded-full"
              />
            </div>
            <p className="text-[11px] text-charcoal-400">
              Based on {counts.demonstrated} demonstrated capabilities and {counts.evidenceNeeded} required evidence gaps.
            </p>
          </div>
        </div>

        {/* Right Side: Capability Composition Snapshot & Primary Gap */}
        <div className="lg:col-span-5 bg-canvas-subtle/80 border border-surface-border rounded-xl p-4 sm:p-5 space-y-4">
          <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            Capability State Composition
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-surface rounded-lg p-3 border border-surface-border/70">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-medium text-charcoal-600">Demonstrated</span>
              </div>
              <span className="text-xl font-bold text-charcoal-900">{counts.demonstrated}</span>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">With project evidence</span>
            </div>

            <div className="bg-surface rounded-lg p-3 border border-surface-border/70">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="text-xs font-medium text-charcoal-600">Developing</span>
              </div>
              <span className="text-xl font-bold text-charcoal-900">{counts.developing}</span>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">In-progress work</span>
            </div>

            <div className="bg-surface rounded-lg p-3 border border-surface-border/70">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-xs font-medium text-charcoal-600">Self-Reported</span>
              </div>
              <span className="text-xl font-bold text-charcoal-900">{counts.selfReported}</span>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">Claimed on profile</span>
            </div>

            <div className="bg-surface rounded-lg p-3 border border-surface-border/70">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="text-xs font-medium text-charcoal-600">Evidence Needed</span>
              </div>
              <span className="text-xl font-bold text-charcoal-900">{counts.evidenceNeeded}</span>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">Target requirement</span>
            </div>
          </div>

          {/* Top Priority Action / Biggest Gap */}
          <div className="pt-2 border-t border-surface-border flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider block">
                Priority Development Gap
              </span>
              <span className="text-xs font-semibold text-charcoal-800">{biggestGap}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/skill-gaps')}
              className="text-xs font-medium shrink-0 flex items-center gap-1"
            >
              <span>View Gaps</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Explainer Modal */}
      <Modal
        isOpen={showExplainerModal}
        onClose={() => setShowExplainerModal(false)}
        title="How is Capability Readiness Determined?"
        size="md"
      >
        <div className="space-y-4 text-sm text-charcoal-700">
          <p>
            SkillSetu determines your <strong>Capability Readiness</strong> by comparing your target role's verified requirement benchmarks against concrete evidence in your profile:
          </p>

          <div className="space-y-2.5 bg-canvas-subtle p-3.5 rounded-lg border border-surface-border">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <strong className="text-charcoal-900 font-semibold">Demonstrated Capabilities:</strong> Supported by completed project repositories, production deployments, or work experience artifacts.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <div>
                <strong className="text-charcoal-900 font-semibold">Developing Capabilities:</strong> Actively being practiced in courses or in-progress projects.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <div>
                <strong className="text-charcoal-900 font-semibold">Evidence Needed:</strong> High-importance target role competencies that do not yet have linked project proof.
              </div>
            </div>
          </div>

          <p className="text-xs text-charcoal-500 italic">
            Disclaimer: Capability readiness represents alignment with configured role requirements based on profile and project artifacts. It is not an employment guarantee, candidate ranking, or interview score.
          </p>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setShowExplainerModal(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CapabilityReadinessHero;
