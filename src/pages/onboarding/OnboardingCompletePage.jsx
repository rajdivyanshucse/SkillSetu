import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Layers, Compass, ShieldCheck, Home } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const OnboardingCompletePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data } = useOnboarding();

  const completedModules = [
    { title: 'Verified Background & Education', detail: `${data.profile.fullName || 'User'} · ${data.profile.currentRole}` },
    { title: 'Skills Ontology Calibrated', detail: `${data.skills.length} Competencies Rated & Mapped` },
    { title: 'Career Trajectory & Goals', detail: `${data.goals.primaryGoal}` },
    { title: 'Target Role Archetypes', detail: `${data.interests.roles?.join(', ') || 'General Engineering'}` },
    { title: 'Workplace & Seniority Preferences', detail: `${data.preferences.workStyle} · ${data.preferences.experienceLevel}` },
  ];

  const handleContinue = () => {
    addToast({
      title: 'Calibration Finalized!',
      message: 'Your profile calibration is complete. Welcome to your Individual Dashboard.',
      type: 'success',
      duration: 4000,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full my-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="p-8 sm:p-12 rounded-2xl bg-surface border border-surface-border shadow-card text-center space-y-8"
        >
          {/* Top Success Badge */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-subtle">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile Calibration Complete</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight">
              Your SkillSetu profile is ready
            </h1>

            <p className="text-body-md text-charcoal-600 max-w-lg mx-auto leading-relaxed">
              Your profile is now prepared for personalized career and skill intelligence synthesis. Next, SkillSetu can help you explore your career fit, skill gaps and opportunities.
            </p>
          </div>

          {/* Calibrated Pillars List */}
          <div className="p-5 rounded-xl bg-canvas-subtle/80 border border-surface-border space-y-3 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800 block border-b border-surface-border pb-2">
              Calibrated Profile Pillars:
            </span>
            <div className="space-y-2.5">
              {completedModules.map((mod) => (
                <div key={mod.title} className="flex items-start gap-3 text-xs">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-charcoal-900 block">{mod.title}</span>
                    <span className="text-charcoal-500 text-[11px]">{mod.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleContinue}
              className="w-full sm:w-auto"
            >
              Continue to Skill Intelligence
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Return to Website
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingCompletePage;
