import React, { useState } from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import AccountActivityTimeline from '../../components/settings/AccountActivityTimeline';
import { useToast } from '../../components/ui/Toast';
import { getStoredOrgActivity, clearOrgActivity } from '../../utils/settingsIntelligence';

export const OrganizationActivityPage = () => {
  const { addToast } = useToast();
  const [activities, setActivities] = useState(getStoredOrgActivity());

  const handleClear = () => {
    clearOrgActivity();
    setActivities([]);
    addToast({
      title: 'Organization Activity Cleared',
      message: 'All enterprise workspace audit records have been erased from local storage.',
      type: 'info',
    });
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Organization Audit Log"
          subtitle="Audit trail of workforce planning calibrations, cohort advances, candidate shortlists, and team member role modifications."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        <AccountActivityTimeline
          activities={activities}
          onClear={handleClear}
          title="Enterprise Workspace Activity"
          subtitle="Historical events logged across organization workforce, talent, planning, and learning modules."
        />
      </div>
    </SettingsLayout>
  );
};

export default OrganizationActivityPage;
