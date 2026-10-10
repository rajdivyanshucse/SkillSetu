import React from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  BookOpen,
  Code2,
  Hammer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

/**
 * AdaptiveRoadmapPreview Component
 * Phase 37: Explains how SkillSetu connects evidence, role benchmarks, and market direction into an evolving development roadmap.
 * 
 * CRITICAL HONESTY:
 * Communicates the closed-loop methodology without claiming live automatic backend calculation yet.
 */
export const AdaptiveRoadmapPreview = ({ className = '' }) => {
  const steps = [
    {
      stage: '01',
      title: 'LEARN',
      subtitle: 'Understand Foundations',
      description: 'Study architecture patterns, core syntax, and engineering contracts.',
      icon: BookOpen,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    {
      stage: '02',
      title: 'PRACTICE',
      subtitle: 'Apply in Sandbox',
      description: 'Execute targeted programming exercises and micro-benchmarks.',
      icon: Code2,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      stage: '03',
      title: 'BUILD',
      subtitle: '★ Create Project Evidence',
      description: 'Construct full-stack repositories, container manifests, and deployable artifacts.',
      icon: Hammer,
      color: 'text-brand-800 bg-brand-50 border-brand-200',
      highlight: true,
    },
    {
      stage: '04',
      title: 'VALIDATE',
      subtitle: 'Demonstrate Capability',
      description: 'Attach benchmark results, test suites, and repository links as concrete proof.',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      stage: '05',
      title: 'RE-EVALUATE',
      subtitle: 'Closed-Loop Assessment',
      description: 'Your capability profile is reassessed to recalibrate roadmap priorities.',
      icon: RotateCcw,
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      isLoop: true,
    },
  ];

  return (
    <Card className={`overflow-hidden border-surface-border shadow-xs ${className}`}>
      <CardHeader className="bg-surface border-b border-surface-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200/60">
                <RotateCcw className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                How Your Development Roadmap Evolves
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              SkillSetu's evidence-grounded capability methodology: Learn → Practice → Build → Validate → Re-evaluate.
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface border border-surface-border text-charcoal-700 self-start sm:self-auto">
            Methodology Architecture
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Core Formula Diagram */}
        <div className="bg-gradient-to-r from-canvas-subtle via-surface to-canvas-subtle p-4 rounded-xl border border-surface-border text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block">
            Adaptive Capability Feedback Loop
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-charcoal-800">
            <span className="bg-surface px-2.5 py-1 rounded border border-surface-border shadow-2xs">
              Current Capabilities
            </span>
            <span className="text-charcoal-400">+</span>
            <span className="bg-emerald-50 text-emerald-900 px-2.5 py-1 rounded border border-emerald-200 shadow-2xs">
              Project Evidence
            </span>
            <span className="text-charcoal-400">+</span>
            <span className="bg-surface px-2.5 py-1 rounded border border-surface-border shadow-2xs">
              Target Role Benchmarks
            </span>
            <span className="text-charcoal-400">+</span>
            <span className="bg-brand-50 text-brand-900 px-2.5 py-1 rounded border border-brand-200 shadow-2xs">
              Market Signals
            </span>
            <span className="text-charcoal-400">→</span>
            <span className="bg-brand-700 text-white px-3 py-1 rounded shadow-xs">
              Calibrated Development Priorities
            </span>
          </div>
        </div>

        {/* 5-Stage Step Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {steps.map((stg, idx) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.stage}
                className={`rounded-xl border p-4 flex flex-col justify-between space-y-3 transition-all ${stg.color} ${
                  stg.highlight ? 'ring-1 ring-brand-300 shadow-2xs' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-black tracking-widest text-charcoal-500">
                      STEP {stg.stage}
                    </span>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>

                  <h4 className="text-xs font-bold tracking-wider uppercase mb-0.5">
                    {stg.title}
                  </h4>

                  <span className="text-[11px] font-semibold text-charcoal-600 block mb-2">
                    {stg.subtitle}
                  </span>

                  <p className="text-xs text-charcoal-700 leading-relaxed">
                    {stg.description}
                  </p>
                </div>

                {stg.isLoop && (
                  <div className="pt-2 border-t border-amber-300/80 text-[10px] font-bold text-amber-900">
                    ↻ Reassesses Capability State
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Honest Methodology Note */}
        <div className="p-3.5 bg-canvas-subtle rounded-xl border border-surface-border text-xs text-charcoal-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Evidence-Driven Progression:</strong> The SkillSetu roadmap is designed around verifiable milestones rather than passive video completion checklists. As you build and validate projects, your capability state transitions from <em>Evidence Needed</em> to <em>Demonstrated</em>, automatically keeping your career direction calibrated.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdaptiveRoadmapPreview;
