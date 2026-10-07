import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Compass, Users, Target, DollarSign, ArrowUpRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { Link } from '../../router/Router';

export const IntelligenceModulesGrid = () => {
  const modules = [
    {
      id: 'skill-intel',
      title: 'Skill Intelligence',
      icon: <Layers className="w-5 h-5 text-brand-700" />,
      desc: 'Normalized competency taxonomy mapping over 35,000 verified technical and operational skills with dynamic relationship weighting.',
      badge: 'Core Engine',
    },
    {
      id: 'gap-analysis',
      title: 'Skill Gap Analysis',
      icon: <Target className="w-5 h-5 text-status-danger-text" />,
      desc: 'Precision competency delta calculation comparing existing talent profiles against target roles or evolving industry benchmarks.',
      badge: 'Diagnostics',
    },
    {
      id: 'career-intel',
      title: 'Career Intelligence',
      icon: <Compass className="w-5 h-5 text-brand-700" />,
      desc: 'Predictive career trajectory modeling offering step-by-step transition pathways, prerequisite milestones, and readiness indices.',
      badge: 'Pathways',
    },
    {
      id: 'talent-match',
      title: 'Talent Matching',
      icon: <Users className="w-5 h-5 text-emerald-700" />,
      desc: 'Algorithmic alignment connecting verified individual capabilities with internal project needs, squads, and open requisitions.',
      badge: 'Mobility',
    },
    {
      id: 'workforce-plan',
      title: 'Workforce Planning',
      icon: <Sparkles className="w-5 h-5 text-indigo-700" />,
      desc: 'Macro organizational capability telemetry forecasting critical future talent shortages 12 to 24 months in advance.',
      badge: 'Strategy',
    },
    {
      id: 'comp-intel',
      title: 'Compensation Intelligence',
      icon: <DollarSign className="w-5 h-5 text-amber-700" />,
      desc: 'Real-time market premium modeling calculating compensation premiums associated with scarce and emerging skill clusters.',
      badge: 'Benchmarks',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="Platform Architecture"
          title="Modular Intelligence for Every Workforce Dimension"
          description="SkillSetu provides specialized intelligence modules that function seamlessly together to solve career and workforce challenges."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-6 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-md bg-canvas-subtle border border-surface-border">
                    {mod.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-body-md font-bold text-charcoal-900">
                    {mod.title}
                  </h3>
                  <p className="text-body-sm text-charcoal-600 mt-2 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-surface-border flex items-center justify-between">
                <Link
                  href="/features"
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors"
                >
                  <span>Explore Module</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntelligenceModulesGrid;
