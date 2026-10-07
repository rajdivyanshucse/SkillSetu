import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Compass, CheckCircle2, ArrowDown, Users, Building2, Sparkles } from 'lucide-react';
import SectionHeader from '../components/marketing/SectionHeader';
import { CTASection } from '../components/marketing/CTASection';

export const HowItWorksPage = () => {
  const workflowStages = [
    {
      num: '01',
      phase: 'DATA',
      title: 'Signal Gathering & Telemetry Ingestion',
      desc: 'Ingests real-time job market postings, normalized global taxonomies (ESCO, O*NET), talent competency artifacts, and organizational workforce telemetry.',
      items: ['Real-time hiring market demand', 'Global skill taxonomies', 'Developer & project artifacts', 'Enterprise org structures'],
    },
    {
      num: '02',
      phase: 'UNDERSTAND',
      title: 'Skill Extraction & Normalization',
      desc: 'Transforms noisy resumes, job descriptions, and project commits into normalized, weighted competency nodes with cross-functional relationship mapping.',
      items: ['Contextual keyword disambiguation', 'Competency relationship weighting', 'Skill half-life modeling', 'Experience depth validation'],
    },
    {
      num: '03',
      phase: 'IDENTIFY',
      title: 'Delta Calculation & Compatibility Scoring',
      desc: 'Performs deterministic mathematical comparison against target role archetypes and industry peer benchmarks to compute transparent capability deltas.',
      items: ['Role compatibility fit index', 'Identified critical gap hierarchy', 'Attrition & capability risk forecaster', 'Salary premium correlations'],
    },
    {
      num: '04',
      phase: 'ACT',
      title: 'Sequenced Roadmaps & Decision Execution',
      desc: 'Delivers actionable, prioritized steps: structured career advancement milestones for individuals, and internal mobility deployment plans for enterprise leadership.',
      items: ['Personalized progression milestones', 'Targeted upskilling cohorts', 'Internal team staffing matches', 'Quarterly hiring ROI roadmap'],
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-20">
      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligence Methodology</span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-charcoal-900 font-extrabold tracking-tight">
          How SkillSetu Works
        </h1>
        <p className="text-body-lg text-charcoal-600 max-w-2xl mx-auto">
          A transparent look at how our continuous intelligence pipeline turns raw workforce signals into clear career moves and strategic talent decisions.
        </p>
      </section>

      {/* Main Visual Storytelling Flow */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="hidden sm:block absolute left-8 top-12 bottom-12 w-0.5 bg-surface-border -z-10" />

          {workflowStages.map((stage, idx) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-xl bg-surface border border-surface-border shadow-card flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Step Badge */}
              <div className="w-16 h-16 rounded-lg bg-canvas-subtle border border-surface-border flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-semibold uppercase text-brand-700">
                  {stage.phase}
                </span>
                <span className="text-xl font-bold font-mono text-charcoal-900 leading-none mt-0.5">
                  {stage.num}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-3">
                <h3 className="text-section-title text-charcoal-900 font-bold">
                  {stage.title}
                </h3>
                <p className="text-body-sm text-charcoal-600 leading-relaxed">
                  {stage.desc}
                </p>

                {/* Sub-items list */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stage.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-charcoal-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dual Deep Dives: For Individuals vs For Organizations */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <SectionHeader
          badge="Two Perspectives"
          title="Designed for Both Sides of the Workforce Equation"
          description="Whether you are an individual shaping your personal trajectory or an executive managing global engineering capability."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual Pathway */}
          <div className="p-8 rounded-xl bg-surface border border-surface-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-body-md font-bold text-charcoal-900">For Talent & Individuals</h3>
                <span className="text-xs text-charcoal-500">Self-directed career acceleration</span>
              </div>
            </div>

            <div className="space-y-3 text-body-sm text-charcoal-600">
              <p>
                1. Upload or link verified project work and repository commits.
              </p>
              <p>
                2. SkillSetu maps your competencies against 200+ industry archetypes.
              </p>
              <p>
                3. Receive a prioritized 3-skill development sprint to unlock senior bands.
              </p>
            </div>
          </div>

          {/* Org Pathway */}
          <div className="p-8 rounded-xl bg-surface border border-surface-border shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-charcoal-900 text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-body-md font-bold text-charcoal-900">For Enterprise Leaders</h3>
                <span className="text-xs text-charcoal-500">Continuous workforce optimization</span>
              </div>
            </div>

            <div className="space-y-3 text-body-sm text-charcoal-600">
              <p>
                1. Integrate team capability profiles and strategic technical roadmaps.
              </p>
              <p>
                2. View live organizational health indices and identify capability vulnerabilities.
              </p>
              <p>
                3. Deploy internal engineers to critical initiatives with quantified confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Experience the Intelligence Pipeline"
        description="Get in touch to explore how SkillSetu integrates with your talent development or workforce planning workflow."
        primaryActionLabel="Request Platform Briefing"
        secondaryActionLabel="Explore All Features"
      />
    </div>
  );
};

export default HowItWorksPage;
