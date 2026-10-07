import React, { useState } from 'react';
import { Activity, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import AccountActivityTimeline from '../../components/settings/AccountActivityTimeline';
import { useToast } from '../../components/ui/Toast';
import { getStoredAccountActivity, clearAccountActivity } from '../../utils/settingsIntelligence';

export const AccountActivityPage = () => {
  const { addToast } = useToast();
  const [activities, setActivities] = useState(getStoredAccountActivity());

  const handleClear = () => {
    clearAccountActivity();
    setActivities([]);
    addToast({
      title: 'Activity Log Cleared',
      message: 'All local activity records have been erased from browser storage.',
      type: 'info',
    });
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/activity">
      <div className="space-y-6">
        <SettingsHeader
          title="Account Activity & Audit Log"
          subtitle="Review an audit trail of profile calibrations, completed learning modules, saved opportunities, and preference updates."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        <AccountActivityTimeline
          activities={activities}
          onClear={handleClear}
          title="Chronological Workspace Activity"
          subtitle="Events recorded across all 15 intelligence phases in this browser session."
        />
      </div>
    </SettingsLayout>
  );
};

export default AccountActivityPage;
