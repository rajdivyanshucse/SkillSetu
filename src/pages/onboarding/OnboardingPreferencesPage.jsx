import React, { useState } from 'react';
import { Check, MapPin, Briefcase, DollarSign, Building } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const WORK_STYLES = ['Remote', 'Hybrid', 'On-site', 'Flexible'];

const OPPORTUNITY_TYPES = ['Full-time', 'Internship', 'Contract / Project', 'Part-time', 'Freelance'];

const EXPERIENCE_LEVELS = ['Entry level', 'Mid level', 'Senior level', 'Leadership / Staff'];

export const OnboardingPreferencesPage = () => {
  const { navigate } = useRouter();
  const { data, updatePreferences } = useOnboarding();

  const [form, setForm] = useState({
    locationPreference: data.preferences.locationPreference || 'Any location',
    specificLocations: data.preferences.specificLocations || '',
    workStyle: data.preferences.workStyle || 'Hybrid',
    opportunityTypes: data.preferences.opportunityTypes || ['Full-time'],
    experienceLevel: data.preferences.experienceLevel || 'Mid level',
    salaryMin: data.preferences.salaryMin || '',
    salaryMax: data.preferences.salaryMax || '',
  });

  const toggleOpportunityType = (type) => {
    const current = form.opportunityTypes || [];
    if (current.includes(type)) {
      setForm({ ...form, opportunityTypes: current.filter((t) => t !== type) });
    } else {
      setForm({ ...form, opportunityTypes: [...current, type] });
    }
  };

  const handleContinue = () => {
    updatePreferences(form);
    navigate('/onboarding/review');
  };

  return (
    <OnboardingLayout stepIndex={7}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={7}
          badge="Step 07"
          title="Set your career preferences"
          subtitle="Configure your target work environment, opportunity types, and location flexibility."
        />

        {/* Work Style Selection */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-charcoal-900 block">
            Work Modality Preference
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WORK_STYLES.map((style) => {
              const isSelected = form.workStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setForm({ ...form, workStyle: style })}
                  className={`
                    p-3 rounded-md border text-center font-semibold text-xs transition-all cursor-pointer select-none
                    ${isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-subtle'
                      : 'bg-surface border-surface-border text-charcoal-700 hover:bg-canvas-subtle'
                    }
                  `}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Select
            label="Location Flexibility"
            value={form.locationPreference}
            onChange={(e) => setForm({ ...form, locationPreference: e.target.value })}
            options={[
              { value: 'Any location', label: 'Worldwide / Any location' },
              { value: 'Specific locations', label: 'Specific Cities / Regions only' },
              { value: 'Country specific', label: 'Within my home country only' },
            ]}
          />

          {form.locationPreference === 'Specific locations' && (
            <Input
              label="Preferred Locations"
              placeholder="e.g. San Francisco, New York, London"
              value={form.specificLocations}
              onChange={(e) => setForm({ ...form, specificLocations: e.target.value })}
            />
          )}
        </div>

        {/* Opportunity Types */}
        <div className="space-y-2 pt-2 border-t border-surface-border">
          <span className="text-xs font-bold text-charcoal-900 block">
            Target Opportunity Types
          </span>
          <div className="flex flex-wrap gap-2">
            {OPPORTUNITY_TYPES.map((type) => {
              const isSelected = form.opportunityTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleOpportunityType(type)}
                  className={`
                    px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer select-none flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-charcoal-900 text-white font-semibold'
                      : 'bg-canvas-subtle text-charcoal-600 border border-surface-border hover:bg-canvas-muted'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Level & Optional Salary Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-border">
          <Select
            label="Target Seniority Band"
            value={form.experienceLevel}
            onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            options={EXPERIENCE_LEVELS.map((lvl) => ({ value: lvl, label: lvl }))}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-800 block">
              Annual Compensation Range (USD, Optional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min e.g. 90,000"
                value={form.salaryMin}
                onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              />
              <span className="text-charcoal-400 text-xs font-mono">—</span>
              <Input
                placeholder="Max e.g. 140,000"
                value={form.salaryMax}
                onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              />
            </div>
          </div>
        </div>

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/resume')}
          onContinue={handleContinue}
          continueLabel="Save & Review Profile"
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPreferencesPage;
