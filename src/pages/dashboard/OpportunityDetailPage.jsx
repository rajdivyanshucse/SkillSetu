import React from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { OpportunityDetail } from '../../components/opportunities/OpportunityDetail';
import { getOpportunityById } from '../../data/opportunityData';

export const OpportunityDetailPage = ({ jobId = 'job-001' }) => {
  const opportunity = getOpportunityById(jobId);

  return (
    <DashboardLayout
      activeRoute="/dashboard/jobs"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Opportunities & Jobs', href: '/dashboard/jobs' },
        { label: opportunity?.title || 'Opportunity Detail' },
      ]}
    >
      <OpportunityDetail opportunityId={jobId} />
    </DashboardLayout>
  );
};

export default OpportunityDetailPage;
