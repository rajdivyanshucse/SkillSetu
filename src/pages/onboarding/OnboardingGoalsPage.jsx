import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Sparkles, Clock, BookOpen, Check } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useToast } from '../../components/ui/Toast';

const GOAL_OPTIONS = [
  { id: 'Get my first job', label: 'Get my first job / entry placement' },
  { id: 'Get a better role', label: 'Step up to a more senior / lead role' },
  { id: 'Switch careers', label: 'Pivot into a new technology / field' },
  { id: 'Increase my salary', label: 'Benchmark & maximize market earning value' },
  { id: 'Become stronger in my current role', label: 'Deepen expertise in current stack' },
  { id: 'Prepare for internships', label: 'Secure competitive summer internship' },
  { id: 'Prepare for placements', label: 'Campus placement preparation' },
  { id: 'Build leadership skills', label: 'Transition from IC to tech leadership' },
  { id: 'Start freelancing', label: 'High-value independent consulting' },
];

const LEARNING_PREFERENCES = [
  'Projects & Real Code',
  'Practice & Coding Sandboxes',
  'Documentation & RFCs',
  'Self-Paced Structured Courses',
  'Technical Certifications',
  'Expert Mentorship',
  'Video Deep Dives',
];

export const OnboardingGoalsPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, updateGoals } = useOnboarding();

  const [form, setForm] = useState({
    primaryGoal: data.goals.primaryGoal || 'Get a better role',
    targetRole: data.goals.targetRole || (data.interests.roles?.[0] || 'Senior Distributed Architect'),
    learningTimeline: data.goals.learningTimeline || '6 months',
    learningPreferences: data.goals.learningPreferences || ['Projects & Real Code'],
    additionalNotes: data.goals.additionalNotes || '',
  });

  const toggleLearningPref = (pref) => {
    const current = form.learningPreferences || [];
    if (current.includes(pref)) {
      setForm({
        ...form,
        learningPreferences: current.filter((p) => p !== pref),
      });
    } else {
      setForm({
        ...form,
        learningPreferences: [...current, pref],
      });
    }
  };

  const handleContinue = () => {
    if (!form.primaryGoal) {
      addToast({
        title: 'Select a primary career goal',
        message: 'Please choose your primary objective.',
        type: 'error',
      });
      return;
    }

    updateGoals(form);
    navigate('/onboarding/resume');
  };

  return (
    <OnboardingLayout stepIndex={5}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={5}
          badge="Step 05"
          title="What are you working toward?"
          subtitle="Define your primary career trajectory, target timelines, and learning style preferences."
        />

        {/* Primary Goal Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-charcoal-900 block">
            Primary Career Objective
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = form.primaryGoal === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setForm({ ...form, primaryGoal: goal.id })}
                  className={`
                    p-3 rounded-md border text-left transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer select-none
                    ${isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold shadow-subtle'
                      : 'bg-surface border-surface-border hover:border-surface-border-strong text-charcoal-700'
                    }
                  `}
                >
                  <span className="text-xs leading-snug">{goal.label}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'bg-surface border-surface-border'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Role & Timeline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Specific Target Role Title"
            placeholder="e.g. Senior Backend Engineer"
            value={form.targetRole}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            hint="Used as baseline for skill gap calculations"
          />

          <Select
            label="Target Horizon / Learning Timeline"
            value={form.learningTimeline}
            onChange={(e) => setForm({ ...form, learningTimeline: e.target.value })}
            options={[
              { value: '3 months', label: '3 months (Immediate Sprint)' },
              { value: '6 months', label: '6 months (Medium Horizon)' },
              { value: '12 months', label: '12 months (Comprehensive Growth)' },
              { value: 'Long term', label: 'Long term (Strategic Trajectory)' },
            ]}
          />
        </div>

        {/* Learning Preferences */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <span className="text-xs font-bold text-charcoal-900 block">
            Preferred Learning Modalities
          </span>
          <div className="flex flex-wrap gap-2">
            {LEARNING_PREFERENCES.map((pref) => {
              const isSelected = form.learningPreferences?.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => toggleLearningPref(pref)}
                  className={`
                    px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer select-none flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-charcoal-900 text-white font-semibold'
                      : 'bg-canvas-subtle text-charcoal-600 border border-surface-border hover:bg-canvas-muted'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{pref}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Notes */}
        <Textarea
          label="Anything else you want SkillSetu to know? (Optional)"
          rows={2}
          placeholder="e.g. Actively targeting distributed systems and open-source contributions..."
          value={form.additionalNotes}
          onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
        />

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/interests')}
          onContinue={handleContinue}
          continueLabel="Save & Continue to Resume"
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingGoalsPage;
