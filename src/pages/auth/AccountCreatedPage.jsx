import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useRouter, Link } from '../../router/Router';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Button } from '../../components/ui/Button';

export const AccountCreatedPage = () => {
  const { navigate } = useRouter();

  const accountType = typeof window !== 'undefined'
    ? sessionStorage.getItem('skillsetu_account_type') || 'individual'
    : 'individual';

  const isOrg = accountType === 'organization';

  const milestones = isOrg
    ? [
        { label: 'Organization workspace authenticated & provisioned', ready: true },
        { label: 'Workforce telemetry engine ready for input', ready: true },
        { label: 'Profile ready for enterprise capability calibration', ready: true },
      ]
    : [
        { label: 'Account authenticated & secured', ready: true },
        { label: 'Workforce intelligence telemetry initialized', ready: true },
        { label: 'Profile ready for initial competency calibration', ready: true },
      ];

  return (
    <AuthLayout>
      <div className="space-y-6 text-center sm:text-left">
        {/* Success Badge */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto sm:mx-0 shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-xs border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{isOrg ? 'Enterprise Workspace Ready' : 'Identity Authenticated'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {isOrg ? 'Your organization account is ready' : 'Your SkillSetu account is ready'}
          </h1>

          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            {isOrg
              ? 'Welcome to the enterprise workforce intelligence platform. Complete your organization profile calibration to map department capabilities and future skills.'
              : 'Welcome to the intelligent workforce platform. Complete your profile calibration to generate your personal skill graph.'}
          </p>
        </div>

        {/* Readiness Checklist */}
        <div className="p-4 bg-canvas-subtle/80 rounded-lg border border-surface-border space-y-2.5">
          {milestones.map((m) => (
            <div key={m.label} className="flex items-center gap-2.5 text-xs text-charcoal-800 font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <span>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate(isOrg ? '/organization/onboarding' : '/onboarding')}
            className="w-full justify-center"
          >
            {isOrg ? 'Set Up Organization Profile' : 'Set Up My Profile'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/features')}
            className="w-full justify-center"
          >
            Explore SkillSetu
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AccountCreatedPage;
