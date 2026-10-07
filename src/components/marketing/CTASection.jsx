import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';

export const CTASection = ({
  title = 'Make Your Next Skill Move With Better Intelligence',
  description = 'Explore your skills, understand market demand and identify your next development opportunity with precision.',
  primaryActionLabel = 'Get Started with SkillSetu',
  secondaryActionLabel = 'Explore Platform Features',
}) => {
  const { navigate } = useRouter();

  return (
    <section className="py-16 sm:py-24 bg-canvas border-t border-surface-border select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="relative p-8 sm:p-14 rounded-2xl bg-surface border border-surface-border shadow-modal text-center space-y-6 overflow-hidden"
        >
          {/* Subtle warm decorative top line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Workforce Platform</span>
          </div>

          <h2 className="text-display sm:text-4xl text-charcoal-900 font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            {title}
          </h2>

          <p className="text-body-md sm:text-body-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/contact')}
            >
              {primaryActionLabel}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/features')}
            >
              {secondaryActionLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
