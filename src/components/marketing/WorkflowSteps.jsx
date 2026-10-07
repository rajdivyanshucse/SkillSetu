import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Lightbulb, Compass, ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';

export const WorkflowSteps = () => {
  const steps = [
    {
      num: '01',
      title: 'Data Collection & Ingestion',
      icon: <Database className="w-5 h-5 text-charcoal-700" />,
      desc: 'Aggregates structured market demand, global taxonomies, project repositories, and talent competency profiles.',
    },
    {
      num: '02',
      title: 'Intelligence Synthesis',
      icon: <Cpu className="w-5 h-5 text-brand-700" />,
      desc: 'Normalizes and correlates competencies, mapping exact capability deltas and industry benchmark curves.',
    },
    {
      num: '03',
      title: 'Explainable Insights',
      icon: <Lightbulb className="w-5 h-5 text-amber-700" />,
      desc: 'Translates raw mathematical correlations into clear role fit percentages, skill gaps, and market demand indices.',
    },
    {
      num: '04',
      title: 'Actionable Roadmaps',
      icon: <Compass className="w-5 h-5 text-emerald-700" />,
      desc: 'Generates step-by-step career moves for talent and high-impact hiring/upskilling strategies for organizations.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-canvas border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="How It Works"
          title="From Raw Workforce Data to Clear Action"
          description="A four-stage intelligence pipeline engineered for rigor, explainability, and maximum decision clarity."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-surface rounded-lg border border-surface-border p-6 shadow-card hover:border-surface-border-strong transition-all flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-md bg-canvas-subtle border border-surface-border">
                    {step.icon}
                  </div>
                  <span className="text-section-title font-mono font-bold text-charcoal-300 group-hover:text-brand-500 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-body-md font-bold text-charcoal-900 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-charcoal-600 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs text-brand-700 font-semibold">
                <span>Stage {step.num} Core</span>
                <ArrowRight className="w-3.5 h-3.5 text-brand-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;
