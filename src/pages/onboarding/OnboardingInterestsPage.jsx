import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Compass, Search, Building2, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingNavigation } from '../../components/onboarding/OnboardingNavigation';
import { SearchInput } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

const TARGET_ROLES = [
  'Software Engineer',
  'Backend Engineer',
  'Frontend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Data Analyst',
  'Cloud Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Cybersecurity Analyst',
  'Business Analyst',
  'Site Reliability Engineer',
  'Distributed Systems Engineer',
  'AI Solutions Architect',
];

const INDUSTRIES = [
  'Technology & SaaS',
  'Financial Services & Fintech',
  'Healthcare & Biotech',
  'E-Commerce & Retail',
  'Management Consulting',
  'Education & EdTech',
  'Advanced Manufacturing',
  'Media & Entertainment',
  'Government & Public Sector',
  'Energy & CleanTech',
];

export const OnboardingInterestsPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data, updateInterests } = useOnboarding();

  const [roleSearch, setRoleSearch] = useState('');
  const selectedRoles = data.interests.roles || [];
  const selectedIndustries = data.interests.industries || [];

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      updateInterests({
        roles: selectedRoles.filter((r) => r !== role),
      });
    } else {
      updateInterests({
        roles: [...selectedRoles, role],
      });
    }
  };

  const toggleIndustry = (ind) => {
    if (selectedIndustries.includes(ind)) {
      updateInterests({
        industries: selectedIndustries.filter((i) => i !== ind),
      });
    } else {
      updateInterests({
        industries: [...selectedIndustries, ind],
      });
    }
  };

  const filteredRoles = TARGET_ROLES.filter((r) =>
    r.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedRoles.length === 0) {
      addToast({
        title: 'Select at least one role',
        message: 'Please choose at least one role interest to calibrate career pathways.',
        type: 'error',
      });
      return;
    }
    navigate('/onboarding/goals');
  };

  return (
    <OnboardingLayout stepIndex={4}>
      <div className="space-y-6">
        <OnboardingHeader
          stepNumber={4}
          badge="Step 04"
          title="What kind of work interests you?"
          subtitle="Select the target role archetypes and industry sectors you want SkillSetu to benchmark against."
        />

        {/* Roles Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-900">
              Target Role Archetypes ({selectedRoles.length} selected)
            </span>
            <span className="text-[11px] text-charcoal-500">Select all that apply</span>
          </div>

          <SearchInput
            placeholder="Search roles (e.g. Backend, Data Scientist, SRE)..."
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
            {filteredRoles.map((role) => {
              const isSelected = selectedRoles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`
                    p-3 rounded-md border text-left transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer select-none
                    ${isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold shadow-subtle'
                      : 'bg-surface border-surface-border hover:border-surface-border-strong text-charcoal-700'
                    }
                  `}
                >
                  <span className="text-xs truncate">{role}</span>
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
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

        {/* Industry Sector Section */}
        <div className="space-y-3 pt-3 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-900">
              Preferred Industry Verticals ({selectedIndustries.length} selected)
            </span>
            <span className="text-[11px] text-charcoal-500">Optional</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => {
              const isSelected = selectedIndustries.includes(ind);
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndustry(ind)}
                  className={`
                    px-3 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer select-none flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-charcoal-900 text-white font-semibold'
                      : 'bg-canvas-subtle text-charcoal-600 border border-surface-border hover:bg-canvas-muted'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{ind}</span>
                </button>
              );
            })}
          </div>
        </div>

        <OnboardingNavigation
          onBack={() => navigate('/onboarding/experience')}
          onContinue={handleContinue}
          continueLabel="Save & Continue to Goals"
          canContinue={selectedRoles.length > 0}
        />
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingInterestsPage;
