import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Compass, ShieldCheck, Eye, Layers, Users, Building2, BookOpen } from 'lucide-react';
import SectionHeader from '../components/marketing/SectionHeader';
import { TrustPrinciples } from '../components/marketing/TrustPrinciples';
import { CTASection } from '../components/marketing/CTASection';

export const AboutPage = () => {
  const visionAlignments = [
    { title: 'People', desc: 'Gaining transparent, self-directed clarity on career moves and skill demand without relying on opaque recruiters.' },
    { title: 'Skills', desc: 'Treated as living, evolving modular capabilities rather than static bullet points on a static resume.' },
    { title: 'Education', desc: 'Directly linked to current and forecasted industry requirements rather than outdated historical curricula.' },
    { title: 'Industry', desc: 'Benefiting from a resilient, highly adaptable talent supply ready for rapid technological shifts.' },
    { title: 'Organizations', desc: 'Empowered with continuous workforce visibility to nurture internal talent and build high-performing teams.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-20">
      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About SkillSetu</span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-charcoal-900 font-extrabold tracking-tight max-w-3xl mx-auto">
          Making Workforce Intelligence More Actionable
        </h1>
        <p className="text-body-lg text-charcoal-600 max-w-2xl mx-auto">
          SkillSetu was conceived to solve the profound structural friction between rapidly changing technological demand and human career decisions.
        </p>
      </section>

      {/* Mission Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-surface-border shadow-card space-y-6">
          <span className="text-label text-brand-700">Our Mission</span>
          <h2 className="text-section-title sm:text-page-title text-charcoal-900 font-bold leading-snug">
            To build the intelligence bridge connecting individual capabilities with organizational and market demand.
          </h2>
          <div className="space-y-4 text-body-md text-charcoal-600 leading-relaxed">
            <p>
              In today's economy, the rate of technological innovation outpaces the ability of traditional HR taxonomies, job descriptions, and educational institutions to keep up. Individuals spend valuable time learning outdated tools, while engineering leaders struggle to understand the real capabilities inside their teams.
            </p>
            <p>
              SkillSetu replaces static titles and keyword-guessing with normalized skill graphs, deterministic compatibility scoring, and actionable development roadmaps.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Alignment Network */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <SectionHeader
          badge="System Alignment"
          title="Aligning the Key Pillars of the Modern Workforce"
          description="A truly intelligent platform must harmonize incentives across every participant in the talent ecosystem."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionAlignments.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-lg bg-surface border border-surface-border shadow-card space-y-3"
            >
              <span className="text-body-md font-bold text-charcoal-900 block">
                {pillar.title}
              </span>
              <p className="text-body-sm text-charcoal-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles */}
      <div id="principles">
        <TrustPrinciples />
      </div>

      {/* CTA */}
      <CTASection
        title="Join the Future of Workforce Intelligence"
        description="Whether you want to explore career compatibility or implement workforce planning in your organization, we welcome the conversation."
        primaryActionLabel="Contact SkillSetu Team"
        secondaryActionLabel="Explore Platform Features"
      />
    </div>
  );
};

export default AboutPage;
