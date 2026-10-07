import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, LayoutDashboard, Compass, Layers, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DashboardPlaceholderPage = ({
  title = 'Module In Development',
  description = 'This advanced workforce intelligence capability is scheduled for integration in the upcoming phase.',
  targetPhase = 'Phase 6',
  activeRoute = '/dashboard',
}) => {
  const { navigate } = useRouter();

  return (
    <DashboardLayout
      activeRoute={activeRoute}
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: title },
      ]}
    >
      <Card className="p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 border-brand-200 shadow-card space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto shadow-subtle">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200">
            <span>Scheduled for {targetPhase}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {title}
          </h1>

          <p className="text-body-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<LayoutDashboard className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>

          <Button
            variant="outline"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/skill-intelligence')}
          >
            Explore Skill Intelligence
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPlaceholderPage;
