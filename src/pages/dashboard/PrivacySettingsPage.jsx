import React, { useState } from 'react';
import { Shield, Lock, Download, Trash2, RotateCcw, Database, CheckCircle2, FileText } from 'lucide-react';
import { useRouter } from '../../router/Router';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import DangerZone from '../../components/settings/DangerZone';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import {
  getStoredPrivacyPreferences,
  savePrivacyPreferences,
  simulateDataExport,
  resetAllIndividualSettings,
} from '../../utils/settingsIntelligence';

export const PrivacySettingsPage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const initialPrivacy = getStoredPrivacyPreferences();

  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleToggle = (field, value) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      savePrivacyPreferences(privacy);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Privacy Preferences Updated',
        message: 'Your personal data and telemetry preferences have been saved.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setPrivacy(initialPrivacy);
    setHasChanges(false);
  };

  const handleExportData = () => {
    const data = simulateDataExport('individual');
    setExportSuccess(true);
    addToast({
      title: 'Data Archive Generated',
      message: 'Simulated JSON data archive compiled from LocalStorage state.',
      type: 'success',
    });
  };

  const handleClearSavedJobs = () => {
    try {
      localStorage.removeItem('skillsetu_saved_jobs_v1');
      addToast({
        title: 'Saved Opportunities Cleared',
        message: 'All bookmarked job listings have been removed from local storage.',
        type: 'info',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearSavedLearning = () => {
    try {
      localStorage.removeItem('skillsetu_saved_learning_v1');
      addToast({
        title: 'Saved Learning Resources Cleared',
        message: 'All bookmarked courses and practice labs have been cleared.',
        type: 'info',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetPreferences = () => {
    resetAllIndividualSettings();
    setPrivacy(getStoredPrivacyPreferences());
    setHasChanges(false);
    addToast({
      title: 'Preferences Reset',
      message: 'All individual settings and alert preferences have been restored to defaults.',
      type: 'info',
    });
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/privacy">
      <div className="space-y-6">
        <SettingsHeader
          title="Privacy & Data Controls"
          subtitle="Manage data usage policies, telemetry boundaries, local storage archives, and export controls."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Data Usage & Personalization */}
        <SettingsSection
          title="Data Usage & Personalization"
          description="Control how your calibrated skills and learning activity shape platform recommendations."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="priv-personalization"
              label="Enable Calibration-Driven Personalization"
              description="Allow SkillSetu to adjust skill gap severity and learning recommendations based on self-reported proficiencies."
              checked={privacy.personalizationEnabled}
              onChange={(c) => handleToggle('personalizationEnabled', c)}
            />
            <PreferenceToggle
              id="priv-learning-data"
              label="Use Learning Progress to Recalibrate Roadmaps"
              description="Automatically advance career roadmap milestones as you complete learning curriculum modules."
              checked={privacy.useLearningDataForRecommendations}
              onChange={(c) => handleToggle('useLearningDataForRecommendations', c)}
            />
            <PreferenceToggle
              id="priv-anonymized-stats"
              label="Contribute Anonymized Aggregate Benchmarks"
              description="Include anonymized skill counts in aggregate industry benchmarks without personal identifiers."
              checked={privacy.shareAggregatedStatsAnonymously}
              onChange={(c) => handleToggle('shareAggregatedStatsAnonymously', c)}
            />
          </div>
        </SettingsSection>

        {/* Data Export & Backup */}
        <SettingsSection
          title="Data Export & Local Portability"
          description="Generate a simulated machine-readable JSON archive of your calibrated profile, progress, and settings."
        >
          <div className="p-4 rounded-xl bg-canvas-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-700" />
                <h4 className="text-body-sm font-bold text-charcoal-900">
                  Export Local Workspace Archive
                </h4>
              </div>
              <p className="text-caption text-charcoal-500">
                Includes profile calibrations, completed learning modules, saved opportunities, and growth milestones.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="shrink-0 self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export My Data (JSON)
            </Button>
          </div>

          {exportSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Simulated data archive compiled successfully. Schema version 1.0.0 validated.</span>
            </div>
          )}
        </SettingsSection>

        {/* Save Bar */}
        <SettingsSaveBar
          hasChanges={hasChanges}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
        />

        {/* Data Management Danger Zone */}
        <DangerZone
          actions={[
            {
              id: 'clear-jobs',
              title: 'Clear Saved Opportunities',
              description: 'Remove all bookmarked prototype job listings from your saved opportunities list.',
              buttonText: 'Clear Saved Jobs',
              isDestructive: true,
              onConfirm: handleClearSavedJobs,
              confirmTitle: 'Clear Saved Opportunities?',
              confirmMessage: 'Are you sure you want to remove all saved job listings from LocalStorage?',
            },
            {
              id: 'clear-learning',
              title: 'Clear Saved Learning Resources',
              description: 'Remove all bookmarked courses, tutorials, and practice labs from your saved list.',
              buttonText: 'Clear Saved Learning',
              isDestructive: true,
              onConfirm: handleClearSavedLearning,
              confirmTitle: 'Clear Saved Learning?',
              confirmMessage: 'Are you sure you want to remove all bookmarked learning items from LocalStorage?',
            },
            {
              id: 'reset-prefs',
              title: 'Reset All Preferences to Defaults',
              description: 'Revert all notification, appearance, privacy, and career settings to default values.',
              buttonText: 'Reset Preferences',
              isDestructive: true,
              onConfirm: handleResetPreferences,
              confirmTitle: 'Reset All Preferences?',
              confirmMessage: 'Are you sure you want to restore default settings? Your calibrated skill profile will be preserved.',
            },
            {
              id: 'nav-delete',
              title: 'Close Account & Permanent Wipe',
              description: 'Navigate to the dedicated account closure workflow to wipe all local data.',
              buttonText: 'Account Closure',
              isDestructive: true,
              onConfirm: () => navigate('/dashboard/settings/delete-account'),
              confirmTitle: 'Proceed to Account Closure?',
              confirmMessage: 'You will be redirected to the dedicated account deletion workflow.',
            },
          ]}
        />
      </div>
    </SettingsLayout>
  );
};

export default PrivacySettingsPage;
