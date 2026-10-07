import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Building2, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

export const TheGapSection = () => {
  const gapCards = [
    {
      category: 'Individuals',
      icon: <UserX className="w-5 h-5 text-charcoal-700" />,
      tag: 'Talent Blindspots',
      title: 'Unclear Career Direction & Skill Relevance',
      description: 'Professionals struggle to discern which competencies are truly in demand versus fleeting buzzwords, leading to misaligned learning investments.',
      symptoms: [
        'Difficulty identifying real capability gaps',
        'Outdated resume keywords vs. actual role requirements',
        'Lack of clear, verified progression roadmaps'
      ]
    },
    {
      category: 'Organizations',
      icon: <Building2 className="w-5 h-5 text-charcoal-700" />,
      tag: 'Workforce Blindspots',
      title: 'Limited Visibility into Internal Capability Gaps',
      description: 'Enterprise leaders often have zero real-time visibility into the actual skills possessed by their teams, defaulting to expensive external hiring.',
      symptoms: [
        'Static job descriptions detached from team reality',
        'Inability to benchmark skills against industry peers',
        'Uninformed upskilling vs. hiring decisions'
      ]
    },
    {
      category: 'Industry',
      icon: <TrendingUp className="w-5 h-5 text-charcoal-700" />,
      tag: 'Market Velocity',
      title: 'Rapidly Shifting Demand & Emerging Archetypes',
      description: 'Technological disruption creates novel job archetypes faster than traditional academic curricula or corporate HR taxonomies can adapt.',
      symptoms: [
        'Exponential emergence of AI & cloud competencies',
        'Fragmented skill definitions across market verticals',
        'Structural mismatch between talent supply and open roles'
      ]
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-canvas border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="The Workforce Challenge"
          title="Skills Are Changing Faster Than Career Decisions"
          description="The modern economy is held back by fragmented workforce data. Individuals don't know what to learn next, and organizations don't know what their talent can do."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gapCards.map((card, idx) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-surface rounded-lg border border-surface-border p-6 shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-sm bg-canvas-subtle border border-surface-border text-charcoal-700">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
                    {card.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-body-md font-bold text-charcoal-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-body-sm text-charcoal-600 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-border space-y-2">
                  <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                    Observed Friction:
                  </span>
                  {card.symptoms.map((symp) => (
                    <div key={symp} className="flex items-start gap-2 text-xs text-charcoal-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <span>{symp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheGapSection;
