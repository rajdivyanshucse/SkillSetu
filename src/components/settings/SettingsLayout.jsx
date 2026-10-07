import React from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';
import { OrganizationLayout } from '../organization/OrganizationLayout';
import SettingsSidebar from './SettingsSidebar';
import SettingsMethodology from './SettingsMethodology';
import SettingsDisclaimer from './SettingsDisclaimer';

export const SettingsLayout = ({
  type = 'individual', // 'individual' | 'organization'
  activeRoute = '',
  children,
  showMethodology = true,
  showDisclaimer = true,
}) => {
  const content = (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Left Navigation */}
        <div className="lg:col-span-3 lg:sticky lg:top-20">
          <div className="bg-surface rounded-xl border border-surface-border p-4 shadow-xs">
            <SettingsSidebar type={type} activeRoute={activeRoute} />
          </div>
        </div>

        {/* Main Settings Sub-Page Content */}
        <div className="lg:col-span-9 space-y-8 min-w-0">
          {children}

          {(showMethodology || showDisclaimer) && (
            <div className="space-y-4 pt-4 border-t border-surface-border">
              {showMethodology && <SettingsMethodology />}
              {showDisclaimer && <SettingsDisclaimer type={type} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (type === 'organization') {
    return <OrganizationLayout activeRoute="/organization/settings">{content}</OrganizationLayout>;
  }

  return <DashboardLayout activeRoute="/dashboard/settings">{content}</DashboardLayout>;
};

export default SettingsLayout;
