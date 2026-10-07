import React, { useState } from 'react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import OrganizationMembersTable from '../../components/settings/OrganizationMembersTable';
import { getStoredOrganizationMembers, saveOrganizationMembers } from '../../utils/settingsIntelligence';

export const OrganizationMembersSettingsPage = () => {
  const [members, setMembers] = useState(getStoredOrganizationMembers());

  const handleUpdateMembers = (updatedList) => {
    setMembers(updatedList);
    saveOrganizationMembers(updatedList);
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Team Members & Roles"
          subtitle="Manage workspace collaborators, invite workforce planners, assign recruiter roles, and control access permissions."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        <OrganizationMembersTable
          members={members}
          onUpdateMembers={handleUpdateMembers}
        />
      </div>
    </SettingsLayout>
  );
};

export default OrganizationMembersSettingsPage;
