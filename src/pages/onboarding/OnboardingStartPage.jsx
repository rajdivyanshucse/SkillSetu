import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Layers, Target, Compass, CheckCircle2, User } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const OnboardingStartPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const readinessPoints = [
    'What competencies and practical depth you already possess',
    'Where specific skill gaps exist relative to senior roles',
    'Which modern industry role archetypes match your exact profile',
    'Which skills are gaining market demand velocity in your field',
    'What prioritized milestones you should learn next',
  ];

  const handleCompleteLater = () => {
    addToast({
      title: 'Calibration Progress Saved',
      message: 'You can return anytime to complete your SkillSetu calibration.',
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full my-auto space-y-8">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="p-8 sm:p-12 rounded-2xl bg-surface border border-surface-border shadow-card space-y-8 text-center sm:text-left"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Profile Calibration Setup</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl text-charcoal-900 font-extrabold tracking-tight leading-tight">
              Build your SkillSetu profile
            </h1>

            <p className="text-body-md sm:text-body-lg text-charcoal-600 max-w-2xl leading-relaxed">
              Tell us about your background, skills and career goals. SkillSetu will use this information to personalize your career intelligence experience.
            </p>
          </div>

          {/* Profile Readiness Value Card */}
          <div className="p-6 sm:p-8 rounded-xl bg-canvas-subtle/80 border border-surface-border space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                Profile Readiness Blueprint
              </span>
              <span className="text-[11px] font-mono text-brand-700 font-semibold">
                8 Guided Steps (~4 mins)
              </span>
            </div>

            <p className="text-body-sm text-charcoal-700 font-medium">
              Your profile calibration will help the SkillSetu engine compute:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {readinessPoints.map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-xs text-charcoal-600 text-left">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-surface-border">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/onboarding/profile')}
              className="w-full sm:w-auto"
            >
              Start Profile Setup
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={handleCompleteLater}
              className="text-charcoal-500 hover:text-charcoal-800 text-xs"
            >
              Complete Later
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingStartPage;
