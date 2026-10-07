import React from 'react';
import { Send, ArrowLeft, Plus } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { useRouter } from '../../router/Router';
import { ApplicationTracker } from '../../components/opportunities/ApplicationTracker';

export const ApplicationsPage = () => {
  const { navigate } = useRouter();

  return (
    <DashboardLayout
      activeRoute="/dashboard/applications"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Opportunities & Jobs', href: '/dashboard/jobs' },
        { label: 'Application Tracking' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Application Tracking
            </h1>
            <p className="text-body-sm text-charcoal-600 mt-1">
              Monitor your application lifecycle, upcoming interview stages, and next suggested actions.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/jobs')}
          >
            Find New Opportunities
          </Button>
        </div>

        {/* Tracker Table / Stacked View */}
        <ApplicationTracker />
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsPage;
