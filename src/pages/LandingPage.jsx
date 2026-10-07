import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useRouter } from '../router/Router';
import { Button } from '../components/ui/Button';
import { HeroVisual } from '../components/marketing/HeroVisual';
import { TheGapSection } from '../components/marketing/TheGapSection';
import { ConnectedHubVisual } from '../components/marketing/ConnectedHubVisual';
import { IndividualPreviewMockup } from '../components/marketing/IndividualPreviewMockup';
import { OrganizationPreviewMockup } from '../components/marketing/OrganizationPreviewMockup';
import { WorkflowSteps } from '../components/marketing/WorkflowSteps';
import { IntelligenceModulesGrid } from '../components/marketing/IntelligenceModulesGrid';
import { DataFlowVisual } from '../components/marketing/DataFlowVisual';
import { TrustPrinciples } from '../components/marketing/TrustPrinciples';
import { CTASection } from '../components/marketing/CTASection';

export const LandingPage = () => {
  const { navigate } = useRouter();

  return (
    <div className="space-y-0">
      {/* ==========================================================
          SECTION 1 — HERO
         ========================================================== */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Subtle Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-800 bg-brand-50/80 px-3 py-1 rounded-pill border border-brand-200/70"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Intelligent Workforce & Career Intelligence Platform</span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-extrabold tracking-tight leading-[1.12]"
          >
            Turn Workforce Data Into Career & Talent Intelligence
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-body-lg sm:text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed"
          >
            SkillSetu connects industry demand, individual skills and workforce capabilities to reveal skill gaps, career opportunities and development priorities.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/features')}
            >
              Explore Skill Intelligence
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/how-it-works')}
            >
              See How It Works
            </Button>
          </motion.div>
        </div>

        {/* Hero Visual Area with Layered Mockup */}
        <HeroVisual />
      </section>

      {/* ==========================================================
          SECTION 2 — THE WORKFORCE GAP
         ========================================================== */}
      <TheGapSection />

      {/* ==========================================================
          SECTION 3 — WHAT SKILLSETU CONNECTS
         ========================================================== */}
      <ConnectedHubVisual />

      {/* ==========================================================
          SECTION 4 — FOR INDIVIDUALS
         ========================================================== */}
      <IndividualPreviewMockup />

      {/* ==========================================================
          SECTION 5 — FOR ORGANIZATIONS
         ========================================================== */}
      <OrganizationPreviewMockup />

      {/* ==========================================================
          SECTION 6 — HOW IT WORKS
         ========================================================== */}
      <WorkflowSteps />

      {/* ==========================================================
          SECTION 7 — INTELLIGENCE MODULES
         ========================================================== */}
      <IntelligenceModulesGrid />

      {/* ==========================================================
          SECTION 8 — DATA & AI PIPELINE
         ========================================================== */}
      <DataFlowVisual />

      {/* ==========================================================
          SECTION 9 — TRUST / PRINCIPLES
         ========================================================== */}
      <TrustPrinciples />

      {/* ==========================================================
          SECTION 10 — FINAL CTA
         ========================================================== */}
      <CTASection
        title="Make Your Next Skill Move With Better Intelligence"
        description="Explore your skills, understand market demand and identify your next development opportunity."
        primaryActionLabel="Get Started"
        secondaryActionLabel="Explore Features"
      />
    </div>
  );
};

export default LandingPage;
