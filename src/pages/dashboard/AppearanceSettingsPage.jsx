import React, { useState } from 'react';
import { Palette, Layout, Eye, Sparkles, Sliders } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceRadioGroup from '../../components/settings/PreferenceRadioGroup';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { getStoredAppearancePreferences, saveAppearancePreferences } from '../../utils/settingsIntelligence';

export const AppearanceSettingsPage = () => {
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
        title: 'Appearance Preferences Saved',
        message: 'Your interface display preferences have been updated.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setAppearance(initialPrefs);
    setHasChanges(false);
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/appearance">
      <div className="space-y-6">
        <SettingsHeader
          title="Appearance & Display Preferences"
          subtitle="Customize interface density, motion accessibility, navigation sidebar behavior, and default landing views."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Color Theme */}
        <SettingsSection
          title="Color Theme & Palette"
          description="SkillSetu uses a warm editorial color palette engineered for focused development and long calibration sessions."
        >
          <PreferenceRadioGroup
            value={appearance.theme}
            onChange={(val) => handleChange('theme', val)}
            columns={3}
            options={[
              { value: 'Light (Warm Editorial)', label: 'Warm Editorial (Default)', description: 'Warm canvas (#FAF8F5), charcoal typography', badge: 'Active' },
              { value: 'Dark (Studio)', label: 'Dark Studio', description: 'Deep slate surfaces with warm amber accents', badge: 'Prototype Preview' },
              { value: 'System', label: 'System Default', description: 'Follow your operating system theme settings', badge: 'Auto' },
            ]}
          />
        </SettingsSection>

        {/* Interface Density */}
        <SettingsSection
          title="Interface Layout Density"
          description="Adjust padding, spacing, and row height across data tables and KPI grids."
        >
          <PreferenceRadioGroup
            value={appearance.density}
            onChange={(val) => handleChange('density', val)}
            columns={2}
            options={[
              { value: 'Comfortable', label: 'Comfortable Density', description: 'Standard spacing with generous whitespace and breathable cards' },
              { value: 'Compact', label: 'Compact Density', description: 'Higher data density with condensed table rows and tighter margins' },
            ]}
          />
        </SettingsSection>

        {/* Motion & Navigation Behavior */}
        <SettingsSection
          title="Motion & Navigation Configuration"
          description="Configure animations for accessibility and choose your primary entry dashboard."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Animation & Transition Effects
              </label>
              <PreferenceRadioGroup
                value={appearance.motion}
                onChange={(val) => handleChange('motion', val)}
                columns={2}
                options={[
                  { value: 'Full motion', label: 'Full Motion & Transitions', description: 'Smooth Framer Motion route entrances and card reveals' },
                  { value: 'Reduced motion', label: 'Reduced Motion (Accessible)', description: 'Minimal animations conforming to vestibular preferences' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-border">
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-charcoal-900 block">
                  Default Landing Dashboard
                </label>
                <Select
                  value={appearance.defaultDashboard}
                  onChange={(e) => handleChange('defaultDashboard', e.target.value)}
                  options={[
                    'Overview Hub',
                    'Career Intelligence',
                    'Skill Intelligence & Gaps',
                    'Career Roadmap',
                    'Learning Intelligence (Phase 15)',
                    'Professional Growth (Phase 14)',
                    'Opportunities Feed',
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-charcoal-900 block">
                  Sidebar Default State
                </label>
                <Select
                  value={appearance.sidebarState}
                  onChange={(e) => handleChange('sidebarState', e.target.value)}
                  options={['Expanded (Standard)', 'Collapsed (Icons Only)']}
                />
              </div>
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

export default AppearanceSettingsPage;
