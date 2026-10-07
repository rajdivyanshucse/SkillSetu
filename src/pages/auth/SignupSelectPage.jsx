import React, { useState } from 'react';
import { User, Building2, ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AccountTypeCard } from '../../components/auth/AccountTypeCard';
import { Button } from '../../components/ui/Button';

export const SignupSelectPage = () => {
  const { navigate } = useRouter();
  const [selectedType, setSelectedType] = useState('individual');

  const handleContinue = () => {
    if (selectedType === 'individual') {
      navigate('/signup/individual');
    } else {
      navigate('/signup/organization');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          badge="Get Started"
          title="Create your SkillSetu account"
          subtitle="Choose how you want to use SkillSetu workforce intelligence."
        />

        {/* Selection Cards */}
        <div className="space-y-3.5">
          <AccountTypeCard
            id="individual"
            title="Individual Talent"
            subtitle="Continue as Individual"
            description="For students, job seekers, and professionals seeking verified skill benchmarking and career roadmaps."
            audience={['Students', 'Job Seekers', 'Working Professionals', 'Career Switchers']}
            icon={<User className="w-5 h-5" />}
            isSelected={selectedType === 'individual'}
            onSelect={setSelectedType}
          />

          <AccountTypeCard
            id="organization"
            title="Enterprise Organization"
            subtitle="Continue as Organization"
            description="For HR leaders, recruiters, and workforce planners managing organizational capability and internal mobility."
            audience={['HR Teams', 'Recruiters', 'Workforce Planners', 'Talent Leads']}
            icon={<Building2 className="w-5 h-5" />}
            isSelected={selectedType === 'organization'}
            onSelect={setSelectedType}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={handleContinue}
          className="w-full justify-center mt-4"
        >
          {selectedType === 'individual' ? 'Continue as Individual' : 'Continue as Organization'}
        </Button>

        <div className="text-center text-xs text-charcoal-600 pt-1">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-brand-700 hover:text-brand-900 underline ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupSelectPage;
