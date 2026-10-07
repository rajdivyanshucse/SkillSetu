import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Target,
  Compass,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Code,
  Briefcase
} from 'lucide-react';
import SectionHeader from '../components/marketing/SectionHeader';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CTASection } from '../components/marketing/CTASection';
import { useRouter } from '../router/Router';

export const FeaturesPage = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const individualFeatures = [
    {
      id: 'ind-skill-intel',
      title: 'Skill Intelligence & Taxonomy',
      desc: 'Map and verify technical and cross-functional competencies against over 35,000 normalized skill nodes.',
      preview: {
        title: 'Verified Competency Graph',
        stat: '34 Skills Mapped',
        tags: ['TypeScript', 'Distributed Systems', 'PostgreSQL', 'Docker', 'GraphQL'],
      },
    },
    {
      id: 'ind-gap-analysis',
      title: 'Precision Skill Gap Analysis',
      desc: 'Instantly view the exact competency deltas separating your current skill graph from target seniority levels.',
      preview: {
        title: 'Target: Principal Engineer',
        stat: '84% Readiness Fit',
        tags: ['Architecture (90%)', 'Observability (78%)', 'Kubernetes (52%)'],
      },
    },
    {
      id: 'ind-career-intel',
      title: 'Career Compatibility Scoring',
      desc: 'Evaluate compatibility across hundreds of modern industry role archetypes with fully transparent rationale.',
      preview: {
        title: 'Top Synergistic Roles',
        stat: 'Top 3 Archetypes',
        tags: ['Platform Engineer (91%)', 'Cloud Architect (86%)', 'DevOps Lead (82%)'],
      },
    },
    {
      id: 'ind-roadmaps',
      title: 'Personalized Progression Roadmaps',
      desc: 'Sequenced learning and project milestones designed to close high-impact capability gaps efficiently.',
      preview: {
        title: 'Milestone 1: Cloud Infra',
        stat: 'Estimated: 6-8 Weeks',
        tags: ['Terraform Modules', 'EKS Cluster Setup', 'Zero Trust IAM'],
      },
    },
    {
      id: 'ind-opportunities',
      title: 'High-Match Internal & External Roles',
      desc: 'Match with real opportunities where your verified competency profile delivers immediate high performance.',
      preview: {
        title: 'Matched Opportunities',
        stat: '12 Active Postings',
        tags: ['Staff Core Engineer', 'SRE Lead', 'Systems Engineer'],
      },
    },
  ];

  const organizationFeatures = [
    {
      id: 'org-workforce-intel',
      title: 'Workforce Capability Telemetry',
      desc: 'Aggregate real-time competency analytics across squads, business units, and global engineering hubs.',
      preview: {
        title: 'Global Capability Index',
        stat: '88.4% Health Score',
        tags: ['420 Engineers', '8 Squads', '14 Core Domains'],
      },
    },
    {
      id: 'org-talent-matching',
      title: 'Algorithmic Internal Mobility',
      desc: 'Instantly deploy internal talent to urgent technical initiatives based on verified capability rather than static titles.',
      preview: {
        title: 'Internal Talent Synergies',
        stat: '74% Internal Match',
        tags: ['6 Matched Engineers', 'Zero Agency Fees', '1-Week Onboarding'],
      },
    },
    {
      id: 'org-future-planning',
      title: 'Future Skill Planning & Modeling',
      desc: 'Model future headcount competency requirements to support 12-to-24 month technology strategy shifts.',
      preview: {
        title: '2027 Tech Architecture Needs',
        stat: '+40% Vector & ML Needs',
        tags: ['RAG Infra', 'Rust Low-Latency', 'eBPF Security'],
      },
    },
    {
      id: 'org-upskill-hire',
      title: 'Upskilling vs. Hiring ROI Simulator',
      desc: 'Compare the economic and timeline impact of training existing engineers versus external talent acquisition.',
      preview: {
        title: 'Upskilling Cost Benefit',
        stat: 'Save $420k / Quarter',
        tags: ['4-Month Upskill Cohort', '85% Retention Rate'],
      },
    },
    {
      id: 'org-comp-intel',
      title: 'Compensation & Benchmark Telemetry',
      desc: 'Benchmark your team compensation and skill premiums against verified peer company cohorts.',
      preview: {
        title: 'Market Premium Index',
        stat: 'Tier-1 Peer Index',
        tags: ['Distributed Systems (+18%)', 'Cloud Sec (+14%)'],
      },
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-20">
      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Capabilities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-charcoal-900 font-extrabold tracking-tight">
          One Platform for Skill & Workforce Intelligence
        </h1>
        <p className="text-body-lg text-charcoal-600 max-w-2xl mx-auto">
          Explore specialized features tailored for individual professionals navigating career growth and enterprise teams designing resilient workforces.
        </p>

        {/* Tab Filters */}
        <div className="pt-6 flex justify-center">
          <Tabs
            variant="segmented"
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'all', label: 'All Capabilities' },
              { id: 'individuals', label: 'For Individuals' },
              { id: 'organizations', label: 'For Organizations' },
            ]}
          />
        </div>
      </section>

      {/* For Individuals Section */}
      {(activeTab === 'all' || activeTab === 'individuals') && (
        <section id="individuals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="border-b border-surface-border pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xs bg-brand-100 text-brand-800">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-section-title text-charcoal-900 font-bold">
                Capabilities For Individuals
              </h2>
            </div>
            <span className="text-xs text-charcoal-500 hidden sm:inline font-mono">
              5 Modular Features
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {individualFeatures.map((feat) => (
              <motion.div
                key={feat.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <h3 className="text-body-md font-bold text-charcoal-900">{feat.title}</h3>
                  <p className="text-body-sm text-charcoal-600 leading-relaxed">{feat.desc}</p>
                </div>

                {/* Mock UI Preview Box */}
                <div className="mt-6 p-3.5 bg-canvas-subtle/80 rounded-md border border-surface-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-charcoal-800">{feat.preview.title}</span>
                    <span className="font-mono text-brand-700 font-semibold">{feat.preview.stat}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {feat.preview.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-xs bg-surface border border-surface-border text-charcoal-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* For Organizations Section */}
      {(activeTab === 'all' || activeTab === 'organizations') && (
        <section id="organizations" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
          <div className="border-b border-surface-border pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xs bg-charcoal-800 text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-section-title text-charcoal-900 font-bold">
                Capabilities For Organizations
              </h2>
            </div>
            <span className="text-xs text-charcoal-500 hidden sm:inline font-mono">
              5 Enterprise Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationFeatures.map((feat) => (
              <motion.div
                key={feat.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-lg bg-surface border border-surface-border shadow-card hover:border-surface-border-strong flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <h3 className="text-body-md font-bold text-charcoal-900">{feat.title}</h3>
                  <p className="text-body-sm text-charcoal-600 leading-relaxed">{feat.desc}</p>
                </div>

                {/* Mock UI Preview Box */}
                <div className="mt-6 p-3.5 bg-canvas-subtle/80 rounded-md border border-surface-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-charcoal-800">{feat.preview.title}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{feat.preview.stat}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {feat.preview.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-xs bg-surface border border-surface-border text-charcoal-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection
        title="Ready to Explore Platform Capabilities?"
        description="Connect with our team to explore workforce intelligence pilots or begin mapping your personal capability roadmap."
        primaryActionLabel="Contact SkillSetu"
        secondaryActionLabel="Review Methodology"
      />
    </div>
  );
};

export default FeaturesPage;
