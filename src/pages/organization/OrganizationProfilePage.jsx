import React from 'react';
import { Building2, Edit2, ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { OrganizationReviewSection } from '../../components/organization-onboarding/OrganizationReviewSection';
import { OrganizationCompleteness } from '../../components/organization-onboarding/OrganizationCompleteness';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../router/Router';

export const OrganizationProfilePage = () => {
  const { navigate } = useRouter();
  const { data, completeness } = useOrganizationOnboarding();

  return (
    <OrganizationLayout
      activeRoute="/organization/profile"
      breadcrumbItems={[
        { label: 'Enterprise Workspace' },
        { label: 'Organization Profile' },
      ]}
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
                {data.company?.type || 'Enterprise'} Entity
              </span>
              <span className="text-xs text-charcoal-400">•</span>
              <span className="text-xs font-semibold text-charcoal-600">
                {data.industry?.primaryIndustry || 'Information Technology'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {data.company?.name || 'Organization Profile'}
            </h1>

            <div className="flex items-center gap-3 text-xs text-charcoal-500 pt-0.5">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                Last updated: Today
              </span>
              <span>•</span>
              <span>Headquarters: {data.company?.primaryLocation || 'Bengaluru, India'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => navigate('/organization/onboarding/review')}
            >
              Edit All Parameters
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/organization/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Completeness Card */}
        <OrganizationCompleteness completeness={completeness} />

        {/* Structured Sections */}
        <OrganizationReviewSection data={data} />
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationProfilePage;
