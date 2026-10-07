import React, { useState } from 'react';
import { Eye, Shield, Lock, Award, Briefcase, ExternalLink, Sparkles } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import ProfileVisibilityCard from '../../components/settings/ProfileVisibilityCard';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import ProfilePreviewModal from '../../components/settings/ProfilePreviewModal';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { getStoredSettings, saveSettings, getStoredCareerPreferences } from '../../utils/settingsIntelligence';

export const ProfileSettingsPage = () => {
  const { addToast } = useToast();
  const initialSettings = getStoredSettings();
  const careerPrefs = getStoredCareerPreferences();

  const [visibility, setVisibility] = useState(initialSettings.profileVisibility);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleToggle = (field, checked) => {
    setVisibility((prev) => ({ ...prev, [field]: checked }));
    setHasChanges(true);
  };

  const handleVisibilityLevelChange = (level) => {
    setVisibility((prev) => ({ ...prev, visibilityLevel: level }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveSettings({ profileVisibility: visibility });
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Visibility Preferences Updated',
        message: 'Your profile discovery and disclosure preferences have been saved.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setVisibility(initialSettings.profileVisibility);
    setHasChanges(false);
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/profile">
      <div className="space-y-6">
        <SettingsHeader
          title="Profile & Visibility Settings"
          subtitle="Control who can discover your profile, which calibrated competencies are public, and preview your candidate presence."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreviewModal(true)}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
              Preview Public Profile
            </Button>
          }
        />

        {/* Profile Visibility Tiers */}
        <SettingsSection
          title="Profile Visibility Tier"
          description="Choose how accessible your calibrated capabilities are across candidate matching and talent discovery pipelines."
        >
          <ProfileVisibilityCard
            value={visibility.visibilityLevel}
            onChange={handleVisibilityLevelChange}
          />
        </SettingsSection>

        {/* Granular Field Disclosure Toggles */}
        <SettingsSection
          title="Profile Discovery & Field Disclosure"
          description="Select exactly which calibrated components are disclosed when your profile is viewed by opportunity matchers."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="pref-allow-discovery"
              label="Allow Profile Discovery in Talent Searches"
              description="Permit verified organization talent search algorithms to index your calibrated skills."
              checked={visibility.allowDiscovery}
              onChange={(c) => handleToggle('allowDiscovery', c)}
            />
            <PreferenceToggle
              id="pref-show-skills"
              label="Display Verified Technical Competencies"
              description="Disclose your calibrated technical skills (0–10 rating scale) on your public candidate card."
              checked={visibility.showSkills}
              onChange={(c) => handleToggle('showSkills', c)}
            />
            <PreferenceToggle
              id="pref-show-exp"
              label="Display Experience Level & Career History"
              description="Share your total years of experience, current seniority tier, and previous roles."
              checked={visibility.showExperience}
              onChange={(c) => handleToggle('showExperience', c)}
            />
            <PreferenceToggle
              id="pref-show-target-role"
              label="Display Target Engineering Roles"
              description="Show your primary and secondary target roles (e.g. Backend Software Engineer)."
              checked={visibility.showTargetRole}
              onChange={(e) => handleToggle('showTargetRole', e)}
            />
            <PreferenceToggle
              id="pref-show-learning"
              label="Display Active Learning Progress"
              description="Show enrolled learning paths, completed curriculum modules, and active study velocity."
              checked={visibility.showLearningProgress}
              onChange={(e) => handleToggle('showLearningProgress', e)}
            />
            <PreferenceToggle
              id="pref-show-projects"
              label="Display Verified Portfolio Projects"
              description="Show linkable repository projects and architecture blueprints in your candidate showcase."
              checked={visibility.showProjects}
              onChange={(e) => handleToggle('showProjects', e)}
            />
          </div>
        </SettingsSection>

        {/* Save Bar */}
        <SettingsSaveBar
          hasChanges={hasChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />

        {/* Profile Preview Modal */}
        <ProfilePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          profile={initialSettings.account}
          visibilitySettings={visibility}
          careerPrefs={careerPrefs}
        />
      </div>
    </SettingsLayout>
  );
};

export default ProfileSettingsPage;
