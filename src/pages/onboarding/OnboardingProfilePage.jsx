import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';

export const OnboardingProfilePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, updateProfile } = useOnboarding();

  const [form, setForm] = useState(data.profile);
  const [errors, setErrors] = useState({});

  const isStudent = form.statusType === 'student' || form.currentRole === 'Student';

  const validate = () => {
    const errs = {};
    if (!form.fullName?.trim()) errs.fullName = 'Full name is required.';
    if (!form.currentRole) errs.currentRole = 'Current role is required.';
    if (!form.educationLevel) errs.educationLevel = 'Education level is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) {
      addToast({
        title: 'Incomplete Fields',
        message: 'Please complete all required fields.',
        type: 'error',
      });
      return;
    }

    updateProfile(form);
    navigate('/onboarding/skills');
  };

  return (
    <OnboardingLayout stepIndex={1}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={1}
          badge="Step 01"
          title="Tell us about yourself"
          subtitle="Provide your baseline academic and professional details to calibrate initial competency expectations."
        />

        {/* Status Type Toggle (Student vs Working Professional) */}
        <div className="flex items-center gap-2 p-1 bg-canvas-subtle rounded-md border border-surface-border w-fit">
          <button
            type="button"
            onClick={() => setForm({ ...form, statusType: 'professional', currentRole: form.currentRole === 'Student' ? 'Software Engineer' : form.currentRole })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
              !isStudent ? 'bg-surface text-charcoal-900 shadow-subtle' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Working Professional
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, statusType: 'student', currentRole: 'Student' })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
              isStudent ? 'bg-surface text-charcoal-900 shadow-subtle' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Student / Early Career
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Maya Chen"
            value={form.fullName}
            onChange={(e) => {
              setForm({ ...form, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: null });
            }}
            error={errors.fullName}
            required
          />

          <Select
            label="Current Role Archetype"
            value={form.currentRole}
            onChange={(e) => {
              setForm({ ...form, currentRole: e.target.value });
              if (errors.currentRole) setErrors({ ...errors, currentRole: null });
            }}
            error={errors.currentRole}
            required
            options={[
              { value: 'Student', label: 'Student / Academic Researcher' },
              { value: 'Software Engineer', label: 'Software Engineer' },
              { value: 'Data Analyst', label: 'Data Analyst' },
              { value: 'Data Scientist', label: 'Data Scientist' },
              { value: 'Product Manager', label: 'Product Manager' },
              { value: 'UI/UX Designer', label: 'Designer (UI/UX)' },
              { value: 'HR Professional', label: 'HR / Talent Professional' },
              { value: 'Business Professional', label: 'Business / Operations Lead' },
              { value: 'Other', label: 'Other Domain' },
            ]}
          />
        </div>

        {/* Conditional Fields: Student vs Professional */}
        {isStudent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-canvas-subtle/70 border border-surface-border">
            <Select
              label="Current Academic Year"
              value={form.graduationYear}
              onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
              options={[
                { value: '1st Year', label: '1st Year (Freshman)' },
                { value: '2nd Year', label: '2nd Year (Sophomore)' },
                { value: '3rd Year', label: '3rd Year (Junior)' },
                { value: '4th Year', label: '4th Year (Senior)' },
                { value: 'Graduated', label: 'Recent Graduate (2025/2026)' },
              ]}
            />
            <Input
              label="Institution / University"
              placeholder="e.g. Stanford University / IIT"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-canvas-subtle/70 border border-surface-border">
            <Select
              label="Years of Industry Experience"
              value={form.yearsOfExperience}
              onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
              options={[
                { value: '0-1 year', label: '0–1 year (Entry Level)' },
                { value: '2-3 years', label: '2–3 years (Mid Level)' },
                { value: '4-6 years', label: '4–6 years (Senior Level)' },
                { value: '7-10 years', label: '7–10 years (Staff / Principal)' },
                { value: '10+ years', label: '10+ years (Director / Executive)' },
              ]}
            />
            <Input
              label="Current Employer / Organization"
              placeholder="e.g. Apex Global Systems (or Freelance)"
              value={form.currentCompany}
              onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Highest Education Level"
            value={form.educationLevel}
            onChange={(e) => {
              setForm({ ...form, educationLevel: e.target.value });
              if (errors.educationLevel) setErrors({ ...errors, educationLevel: null });
            }}
            error={errors.educationLevel}
            required
            options={[
              { value: "Bachelor's", label: "Bachelor's Degree (B.S. / B.Tech / B.A.)" },
              { value: "Master's", label: "Master's Degree (M.S. / M.Tech / MBA)" },
              { value: 'Doctorate', label: 'Doctorate (Ph.D.)' },
              { value: 'Diploma', label: 'Associate / Diploma' },
              { value: 'High School', label: 'High School / Secondary' },
              { value: 'Other', label: 'Self-Taught / Other' },
            ]}
          />

          <Input
            label="Field of Study / Degree Title"
            placeholder="e.g. Computer Science, Information Systems"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />
        </div>

        <Input
          label="Current Location (City, Country)"
          placeholder="e.g. San Francisco, CA / Bengaluru, India"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          hint="Used for localized market demand & opportunity calibrations"
        />

        <OnboardingNavigation
          onBack={() => navigate('/onboarding')}
          onContinue={handleContinue}
          continueLabel="Save & Continue to Skills"
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingProfilePage;
