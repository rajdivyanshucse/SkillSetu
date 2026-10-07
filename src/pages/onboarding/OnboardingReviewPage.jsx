import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, CheckCircle2, ShieldCheck, Sparkles, User, Layers, Briefcase, Compass, Target, FileText, Settings, ArrowRight } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

export const OnboardingReviewPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, calculateCompleteness } = useOnboarding();
  const completeness = calculateCompleteness();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleFinish = () => {
    setIsCompleting(true);
    setTimeout(() => {
      setIsCompleting(false);
      addToast({
        title: 'Profile Calibration Finalized',
        message: 'Your personal capability blueprint is ready for intelligence synthesis.',
        type: 'success',
      });
      navigate('/onboarding/complete');
    }, 800);
  };

  return (
    <OnboardingLayout stepIndex={8}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={8}
          badge="Step 08"
          title="Review your calibrated profile"
          subtitle="Ensure your competency signals, past experience, and career goals are accurate before calibration."
        />

        {/* Profile Completeness Score Card */}
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-brand-100 text-brand-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-body-sm font-bold text-charcoal-900 block leading-tight">
                Profile Completeness: {completeness}%
              </span>
              <span className="text-xs text-charcoal-600">
                Sufficient competency inputs gathered for baseline skill gap and compatibility calculations.
              </span>
            </div>
          </div>
          <Badge status="verified" size="sm" showDot>
            Ready for Synthesis
          </Badge>
        </div>

        {/* Summary Sections Grid */}
        <div className="space-y-4">
          {/* 1. Basic Profile */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                <User className="w-3.5 h-3.5" />
                <span>Basic Profile</span>
              </div>
              <h4 className="text-body-md font-bold text-charcoal-900">
                {data.profile.fullName || 'Unnamed Candidate'}
              </h4>
              <p className="text-xs text-charcoal-600">
                {data.profile.currentRole} · {data.profile.educationLevel} ({data.profile.degree || 'Degree unspecified'})
              </p>
              {data.profile.location && (
                <span className="text-[11px] text-charcoal-400 block font-mono">
                  📍 {data.profile.location}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="xs"
              leftIcon={<Edit3 className="w-3 h-3" />}
              onClick={() => navigate('/onboarding/profile')}
            >
              Edit
            </Button>
          </div>

          {/* 2. Skills Profile */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Skills Mapped ({data.skills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((s) => (
                  <span
                    key={s.name}
                    className="text-xs px-2.5 py-1 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-800 font-medium"
                  >
                    {s.name} <span className="text-[10px] text-brand-700 font-bold">({s.proficiency})</span>
                  </span>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              leftIcon={<Edit3 className="w-3 h-3" />}
              onClick={() => navigate('/onboarding/skills')}
            >
              Edit
            </Button>
          </div>

          {/* 3. Experience */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience ({data.experience.length} records)</span>
              </div>
              {data.experience.length > 0 ? (
                <div className="space-y-1">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="text-xs text-charcoal-700">
                      <span className="font-semibold text-charcoal-900">{exp.role}</span> at {exp.organization}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-charcoal-400 italic">No formal experience records added.</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="xs"
              leftIcon={<Edit3 className="w-3 h-3" />}
              onClick={() => navigate('/onboarding/experience')}
            >
              Edit
            </Button>
          </div>

          {/* 4. Career Interests & Target Roles */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Career Interests ({data.interests.roles?.length || 0} target roles)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.interests.roles?.map((r) => (
                  <span
                    key={r}
                    className="text-xs px-2.5 py-1 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-800 font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="xs"
              leftIcon={<Edit3 className="w-3 h-3" />}
              onClick={() => navigate('/onboarding/interests')}
            >
              Edit
            </Button>
          </div>

          {/* 5. Career Goals */}
          <div className="p-4 sm:p-5 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                <Target className="w-3.5 h-3.5" />
                <span>Career Objective & Horizon</span>
              </div>
              <h4 className="text-body-sm font-bold text-charcoal-900">
                {data.goals.primaryGoal}
              </h4>
              <p className="text-xs text-charcoal-600">
                Target Role: <span className="font-semibold text-charcoal-800">{data.goals.targetRole || 'Flexible'}</span> · Timeline: {data.goals.learningTimeline}
              </p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              leftIcon={<Edit3 className="w-3 h-3" />}
              onClick={() => navigate('/onboarding/goals')}
            >
              Edit
            </Button>
          </div>

          {/* 6. Resume & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume Attached</span>
                </div>
                <span className="text-xs font-semibold text-charcoal-800 block">
                  {data.resume ? data.resume.name : 'Skipped for now'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/onboarding/resume')}
              >
                Edit
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-400">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Work Preferences</span>
                </div>
                <span className="text-xs font-semibold text-charcoal-800 block">
                  {data.preferences.workStyle} · {data.preferences.experienceLevel}
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/onboarding/preferences')}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-surface-border flex items-center justify-between">
          <Button
            variant="ghost"
            size="md"
            onClick={() => navigate('/onboarding/preferences')}
          >
            Back to Preferences
          </Button>

          <Button
            variant="primary"
            size="lg"
            isLoading={isCompleting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleFinish}
          >
            Complete Profile
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingReviewPage;
