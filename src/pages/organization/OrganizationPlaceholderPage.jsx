import React from 'react';
import { Layers, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../router/Router';

export const OrganizationPlaceholderPage = ({
  title = 'Module In Development',
  description = 'This workspace module is scheduled for activation in an upcoming SkillSetu enterprise phase.',
  targetPhase = 'Phase 11',
  activeRoute = '/organization/dashboard',
}) => {
  const { navigate } = useRouter();

  return (
    <OrganizationLayout activeRoute={activeRoute}>
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Layers className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-body-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{targetPhase} Roadmap</span>
        </div>

        <h1 className="text-heading-lg font-bold text-charcoal-900 tracking-tight mb-3">
          {title}
        </h1>

        <p className="text-body text-charcoal-600 mb-8 max-w-lg mx-auto leading-relaxed">
          {description}
        </p>

        <div className="p-5 rounded-lg border border-surface-border bg-surface text-left mb-8 shadow-xs">
          <h4 className="text-body-xs font-bold text-charcoal-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            Coming in a later SkillSetu module
          </h4>
          <p className="text-body-xs text-charcoal-600">
            Workforce intelligence capabilities from Phase 10 provide the baseline foundation for candidate matching, automated cohort reskilling, and predictive headcount planning in subsequent releases.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/organization/dashboard')}
            className="cursor-pointer"
          >
            <span>Return to Workforce Intelligence</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/organization/workforce')}
            className="cursor-pointer"
          >
            <span>View Workforce Skills</span>
          </Button>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationPlaceholderPage;
