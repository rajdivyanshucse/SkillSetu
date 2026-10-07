import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Building2, User, ArrowRight, HelpCircle } from 'lucide-react';
import SectionHeader from '../components/marketing/SectionHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useRouter } from '../router/Router';
import { CTASection } from '../components/marketing/CTASection';

export const PricingPage = () => {
  const { navigate } = useRouter();

  const plans = [
    {
      id: 'individual',
      name: 'Individual Talent',
      badge: 'Early Access',
      price: 'Free Access',
      period: 'Full Platform Access',
      desc: 'For students, job seekers, and engineers seeking verified skill benchmarking and transparent career pathways.',
      features: [
        'Personal verified skill graph',
        'Target role compatibility scoring',
        'Skill gap diagnostic breakdown',
        '3-step prioritized development roadmap',
        'High-match opportunity radar',
      ],
      cta: 'Get Free Access',
      variant: 'secondary',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Workforce',
      badge: 'Custom Deployment',
      price: 'Contact Us',
      period: 'Billed annually per organization',
      desc: 'For HR leaders, workforce planners, and engineering leadership seeking aggregate capability visibility and internal mobility.',
      features: [
        'All Individual Talent features included',
        'Org-wide workforce capability radar',
        'Critical skill gap & attrition forecaster',
        'Automated internal talent mobility matcher',
        'Custom taxonomy normalization & SSO integration',
        'Dedicated workforce intelligence advisory',
      ],
      cta: 'Request Enterprise Pilot',
      variant: 'primary',
      highlight: true,
    },
  ];

  const comparisonFeatures = [
    { name: 'Verified Competency Graph', ind: true, org: true },
    { name: 'Role Compatibility Analysis', ind: true, org: true },
    { name: 'Personal Progression Roadmaps', ind: true, org: true },
    { name: 'Aggregated Department Telemetry', ind: false, org: true },
    { name: 'Critical Gap Forecaster', ind: false, org: true },
    { name: 'Internal Squad Mobility Matcher', ind: false, org: true },
    { name: 'Custom Taxonomy Normalization', ind: false, org: true },
    { name: 'Enterprise SSO & Data Isolation', ind: false, org: true },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-20">
      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plans & Deployment</span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-charcoal-900 font-extrabold tracking-tight">
          Transparent Intelligence Plans
        </h1>
        <p className="text-body-lg text-charcoal-600 max-w-2xl mx-auto">
          Explore individual career acceleration access or partner with our team on organizational workforce intelligence deployments.
        </p>
      </section>

      {/* Pricing Cards Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                p-8 rounded-2xl bg-surface border flex flex-col justify-between relative shadow-card
                ${plan.highlight ? 'border-brand-500 ring-1 ring-brand-500' : 'border-surface-border'}
              `}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-section-title font-bold text-charcoal-900">{plan.name}</h3>
                    <span className="text-xs text-charcoal-500 mt-0.5 block">{plan.desc}</span>
                  </div>
                  <Badge status={plan.highlight ? 'recommended' : 'neutral'} size="sm">
                    {plan.badge}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-surface-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-charcoal-900">{plan.price}</span>
                  </div>
                  <span className="text-xs text-charcoal-500 mt-1 block font-mono">{plan.period}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400 block">
                    What is Included:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs text-charcoal-700">
                      <Check className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant={plan.variant}
                  size="md"
                  className="w-full justify-center"
                  onClick={() => navigate('/contact')}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="Compare Platform Capabilities"
          description="A clear breakdown of features available in individual vs organizational tiers."
        />

        <div className="bg-surface rounded-xl border border-surface-border overflow-hidden shadow-card">
          <div className="p-4 bg-canvas-subtle border-b border-surface-border grid grid-cols-12 text-xs font-bold text-charcoal-800">
            <span className="col-span-6 sm:col-span-8">Capability</span>
            <span className="col-span-3 sm:col-span-2 text-center">Individual</span>
            <span className="col-span-3 sm:col-span-2 text-center">Enterprise</span>
          </div>

          <div className="divide-y divide-surface-border text-xs text-charcoal-700">
            {comparisonFeatures.map((row) => (
              <div key={row.name} className="p-4 grid grid-cols-12 items-center">
                <span className="col-span-6 sm:col-span-8 font-medium">{row.name}</span>
                <span className="col-span-3 sm:col-span-2 flex justify-center">
                  {row.ind ? <Check className="w-4 h-4 text-brand-600" /> : <span className="text-charcoal-300">—</span>}
                </span>
                <span className="col-span-3 sm:col-span-2 flex justify-center">
                  {row.org ? <Check className="w-4 h-4 text-brand-600 font-bold" /> : <span className="text-charcoal-300">—</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <SectionHeader
          title="Frequently Answered Questions"
          description="Common inquiries regarding data telemetry and deployment models."
        />

        <div className="space-y-4">
          {[
            { q: 'How does SkillSetu verify individual skills?', a: 'SkillSetu extracts and cross-validates demonstrated capabilities from verified repository commits, project artifacts, code samples, and organizational feedback rather than unverified self-reported resumes.' },
            { q: 'Can organizations customize skill taxonomies?', a: 'Yes. Enterprise tiers support custom taxonomy mapping, allowing organizations to integrate their existing competency frameworks with global standards like O*NET and ESCO.' },
            { q: 'Is individual workforce data kept private?', a: 'SkillSetu enforces strict privacy and GDPR compliance. Individual telemetry is anonymized in aggregated organizational health reports unless an employee actively applies for an internal mobility opportunity.' },
          ].map((item) => (
            <div key={item.q} className="p-6 bg-surface rounded-lg border border-surface-border shadow-subtle space-y-2">
              <h4 className="text-body-sm font-bold text-charcoal-900">{item.q}</h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <CTASection
        title="Start Leveraging Workforce Intelligence"
        description="Connect with our team to initiate an organizational pilot or explore personal career compatibility."
        primaryActionLabel="Contact for Deployment"
        secondaryActionLabel="Explore How It Works"
      />
    </div>
  );
};

export default PricingPage;
