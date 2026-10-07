import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceRadioGroup from '../../components/settings/PreferenceRadioGroup';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { getStoredAppearancePreferences, saveAppearancePreferences } from '../../utils/settingsIntelligence';

export const OrganizationAppearanceSettingsPage = () => {
  const { addToast } = useToast();
  const initialPrefs = getStoredAppearancePreferences();

  const [appearance, setAppearance] = useState(initialPrefs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveAppearancePreferences(appearance);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Workspace Appearance Saved',
        message: 'Organization workspace display preferences updated.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setAppearance(initialPrefs);
    setHasChanges(false);
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Organization Appearance Preferences"
          subtitle="Customize interface density, motion accessibility, and default dashboard landing for your team workspace."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        {/* Layout Density */}
        <SettingsSection
          title="Enterprise Layout Density"
          description="Adjust spacing across workforce capacity matrices, talent tables, and planning scenario cards."
        >
          <PreferenceRadioGroup
            value={appearance.density}
            onChange={(val) => handleChange('density', val)}
            columns={2}
            options={[
              { value: 'Comfortable', label: 'Comfortable Density', description: 'Standard padding with generous whitespace' },
              { value: 'Compact', label: 'Compact Density', description: 'Condensed rows for high-volume workforce data' },
            ]}
          />
        </SettingsSection>

        {/* Theme & Motion */}
        <SettingsSection
          title="Theme & Accessibility"
          description="Maintain consistent brand styling across all team members."
        >
          <div className="space-y-4">
            <PreferenceRadioGroup
              value={appearance.theme}
              onChange={(val) => handleChange('theme', val)}
              columns={2}
              options={[
                { value: 'Light (Warm Editorial)', label: 'Warm Editorial (Default)', description: 'Warm canvas with dark charcoal text', badge: 'Active' },
                { value: 'Dark (Studio)', label: 'Dark Studio (Enterprise)', description: 'Deep surfaces with amber highlights', badge: 'Preview' },
              ]}
            />

            <div className="pt-2 border-t border-surface-border">
              <label className="text-body-sm font-semibold text-charcoal-900 block mb-2">
                Motion & Transitions
              </label>
              <PreferenceRadioGroup
                value={appearance.motion}
                onChange={(val) => handleChange('motion', val)}
                columns={2}
                options={[
                  { value: 'Full motion', label: 'Full Motion', description: 'Standard animated page reveals and chart transitions' },
                  { value: 'Reduced motion', label: 'Reduced Motion', description: 'Minimal animations for accessibility' },
                ]}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Save Bar */}
        <SettingsSaveBar
          hasChanges={hasChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </SettingsLayout>
  );
};

export default OrganizationAppearanceSettingsPage;
