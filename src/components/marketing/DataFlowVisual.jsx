import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileCode, Users, Building, Cpu, Sparkles, Compass, BarChart3, ArrowRight, ArrowDown } from 'lucide-react';
import SectionHeader from './SectionHeader';

export const DataFlowVisual = () => {
  const inputSources = [
    { title: 'Job Market Signals', icon: <Database className="w-4 h-4" />, desc: 'Live hiring demand & velocity' },
    { title: 'Standard Taxonomies', icon: <FileCode className="w-4 h-4" />, desc: 'O*NET, ESCO & normalized roles' },
    { title: 'Talent Competencies', icon: <Users className="w-4 h-4" />, desc: 'Verified project & code artifacts' },
    { title: 'Workforce Telemetry', icon: <Building className="w-4 h-4" />, desc: 'Enterprise organizational graphs' },
  ];

  const outputs = [
    { title: 'Skill Insights', icon: <Sparkles className="w-4 h-4" />, desc: 'Dynamic rarity, half-life & demand' },
    { title: 'Career Insights', icon: <Compass className="w-4 h-4" />, desc: 'Predictive readiness & transition roadmaps' },
    { title: 'Workforce Insights', icon: <BarChart3 className="w-4 h-4" />, desc: 'Capability health & deployment strategy' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-canvas border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="Data & Synthesis"
          title="Built on Skills, Roles and Market Signals"
          description="SkillSetu processes disparate workforce signals through a rigorous normalization pipeline to generate transparent, explainable intelligence."
        />

        {/* Conceptual Flow Diagram */}
        <div className="p-6 sm:p-10 rounded-xl bg-surface border border-surface-border shadow-card max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
            {/* 1. Input Sources (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block pb-1">
                01 Raw Signal Inputs
              </span>
              <div className="space-y-2.5">
                {inputSources.map((src) => (
                  <div
                    key={src.title}
                    className="p-3 bg-canvas-subtle/80 rounded-md border border-surface-border flex items-center gap-3"
                  >
                    <div className="p-1.5 bg-surface rounded-xs border border-surface-border text-brand-700">
                      {src.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                        {src.title}
                      </span>
                      <span className="text-[11px] text-charcoal-500">{src.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Divider / Engine (3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center py-4 lg:py-0">
              <div className="p-5 rounded-xl bg-brand-50 border-2 border-brand-500/80 shadow-card text-center space-y-2 w-full max-w-[220px]">
                <div className="w-10 h-10 rounded-md bg-brand-500 text-white flex items-center justify-center mx-auto shadow-subtle">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-charcoal-900 leading-tight">
                  SkillSetu Synthesis Engine
                </h4>
                <span className="text-[10px] text-brand-800 font-mono block">
                  Normalization & Scoring
                </span>
              </div>
            </div>

            {/* 3. Output Insights (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-400 block pb-1">
                02 Actionable Outputs
              </span>
              <div className="space-y-2.5">
                {outputs.map((out) => (
                  <div
                    key={out.title}
                    className="p-3.5 bg-surface rounded-md border border-brand-200/80 shadow-subtle flex items-center gap-3"
                  >
                    <div className="p-1.5 bg-brand-100 rounded-xs border border-brand-200 text-brand-800">
                      {out.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                        {out.title}
                      </span>
                      <span className="text-[11px] text-charcoal-500">{out.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataFlowVisual;
