import React from 'react';
import { motion } from 'framer-motion';
import { Users, Layers, Compass, TrendingUp, Building2, GraduationCap, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';

export const ConnectedHubVisual = () => {
  const nodes = [
    { label: 'Talent & Capabilities', icon: <Users className="w-4 h-4" />, position: 'top-left', desc: 'Profiles, verified skills, and career intent' },
    { label: 'Skill Taxonomies', icon: <Layers className="w-4 h-4" />, position: 'top-right', desc: 'Dynamic ontology of normalized competencies' },
    { label: 'Role Archetypes', icon: <Compass className="w-4 h-4" />, position: 'bottom-left', desc: 'Future-ready job descriptions and benchmarks' },
    { label: 'Industry Market Signals', icon: <TrendingUp className="w-4 h-4" />, position: 'bottom-right', desc: 'Real-time hiring velocity and telemetry' },
    { label: 'Enterprise Organizations', icon: <Building2 className="w-4 h-4" />, position: 'center-bottom', desc: 'Strategic workforce planning and mobility' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="The Intelligence Hub"
          title="Bridging Talent Capabilities with Market Reality"
          description="SkillSetu sits at the confluence of five critical workforce dimensions, synchronizing raw telemetry into clear career moves and organizational capability plans."
        />

        {/* Central Visualization Composition */}
        <div className="relative max-w-4xl mx-auto p-6 sm:p-12 rounded-xl bg-canvas-subtle/50 border border-surface-border shadow-card overflow-hidden">
          {/* Subtle background connecting lines grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#D6D0C5_1px,transparent_1px)] [background-size:16px_16px] opacity-40 -z-10" />

          {/* Central SkillSetu Core */}
          <div className="flex flex-col items-center justify-center my-6 sm:my-10 relative">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-surface border-2 border-brand-500 shadow-modal flex flex-col items-center text-center max-w-xs z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center mb-3 shadow-subtle">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-body-md font-bold text-charcoal-900 leading-none">
                SkillSetu Intelligence Core
              </h3>
              <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">
                Continuous skills mapping, role normalization & predictive career path synthesis
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
                <Sparkles className="w-3 h-3" />
                <span>INTELLIGENCE ENGINE</span>
              </div>
            </motion.div>
          </div>

          {/* Surrounding Connected Satellite Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {nodes.map((node) => (
              <motion.div
                key={node.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start gap-3.5"
              >
                <div className="p-2 rounded-sm bg-canvas-subtle border border-surface-border text-brand-700 shrink-0 mt-0.5">
                  {node.icon}
                </div>
                <div>
                  <h4 className="text-body-sm font-semibold text-charcoal-900">{node.label}</h4>
                  <p className="text-xs text-charcoal-500 mt-1 leading-normal">{node.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectedHubVisual;
