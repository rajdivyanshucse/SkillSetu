import React from 'react';
import { ShieldCheck, Eye, Target, Compass } from 'lucide-react';
import SectionHeader from './SectionHeader';

export const TrustPrinciples = () => {
  const principles = [
    {
      title: 'Data-Driven Precision',
      icon: <Target className="w-5 h-5 text-charcoal-700" />,
      desc: 'All recommendations are grounded in verified competency signals and real market requirements, eliminating guesswork and hype.',
    },
    {
      title: 'Explainable Rationale',
      icon: <Eye className="w-5 h-5 text-charcoal-700" />,
      desc: 'Every compatibility score and career delta explains the exact competencies driving the calculation with zero opaque black-box metrics.',
    },
    {
      title: 'Skill-First Focus',
      icon: <ShieldCheck className="w-5 h-5 text-charcoal-700" />,
      desc: 'Prioritizes demonstrated skills, problem-solving depth, and practical output over static job titles or educational pedigree.',
    },
    {
      title: 'Action-Oriented Direction',
      icon: <Compass className="w-5 h-5 text-charcoal-700" />,
      desc: 'Rather than passive dashboards, SkillSetu generates concrete, sequenced roadmap milestones for immediate execution.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="Our Principles"
          title="Architected for Trust and Practical Decision-Making"
          description="We believe career and workforce decisions require honest, explainable signals rather than unrealistic marketing guarantees."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-2.5 rounded-md bg-canvas-subtle border border-surface-border w-fit">
                  {p.icon}
                </div>
                <h3 className="text-body-md font-bold text-charcoal-900 leading-snug">
                  {p.title}
                </h3>
                <p className="text-body-sm text-charcoal-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPrinciples;
