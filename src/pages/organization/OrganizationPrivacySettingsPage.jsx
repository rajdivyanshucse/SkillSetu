import React, { useState } from 'react';
import { Shield, Lock, Download, Trash2, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import DangerZone from '../../components/settings/DangerZone';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  getStoredOrgPrivacyPreferences,
  saveOrgPrivacyPreferences,
  simulateDataExport,
  resetAllOrganizationSettings,
} from '../../utils/settingsIntelligence';

export const OrganizationPrivacySettingsPage = () => {
  const { addToast } = useToast();
  const initialPrivacy = getStoredOrgPrivacyPreferences();

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
      saveOrgPrivacyPreferences(privacy);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Organization Privacy Preferences Saved',
        message: 'Data governance boundaries updated.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setPrivacy(initialPrivacy);
    setHasChanges(false);
  };

  const handleExportOrgData = () => {
    simulateDataExport('organization');
    setExportSuccess(true);
    addToast({
      title: 'Organization Export Generated',
      message: 'Simulated organizational JSON archive compiled from LocalStorage.',
      type: 'success',
    });
  };

  const handleClearFilters = () => {
    try {
      localStorage.removeItem('skillsetu_talent_filters_v1');
      addToast({
        title: 'Saved Filters Cleared',
        message: 'All custom candidate filters have been reset.',
        type: 'info',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetOrgSettings = () => {
    resetAllOrganizationSettings();
    setPrivacy(getStoredOrgPrivacyPreferences());
    setHasChanges(false);
    addToast({
      title: 'Organization Preferences Reset',
      message: 'All planning horizons and notification rules restored to defaults.',
      type: 'info',
    });
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Organization Privacy & Data Controls"
          subtitle="Configure candidate visibility rules, workforce telemetry boundaries, and export organizational data archives."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        {/* Visibility & Talent Search */}
        <SettingsSection
          title="Organization Visibility & Talent Search"
          description="Control how your organization and open engineering roles appear to candidate matchers."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="org-vis-public"
              label="Allow Verified Candidates to Discover Company Profile"
              description="Enable high-compatibility candidates in Job Intelligence to view your company overview and benefits."
              checked={privacy.organizationVisibility !== 'Private'}
              onChange={(c) => handleToggle('organizationVisibility', c ? 'Verified Talent Network Only' : 'Private')}
            />
            <PreferenceToggle
              id="org-analytics"
              label="Enable Aggregate Workforce Analytics"
              description="Allow SkillSetu to generate capacity gap benchmarks and internal upskilling vs. hiring recommendations."
              checked={privacy.dataUsageAnalytics}
              onChange={(c) => handleToggle('dataUsageAnalytics', c)}
            />
            <PreferenceToggle
              id="org-anonymize-wf"
              label="Anonymize Team-Level Data in Export Archives"
              description="Strip individual email identifiers when generating machine-readable workforce exports."
              checked={privacy.anonymizeWorkforceMetrics}
              onChange={(c) => handleToggle('anonymizeWorkforceMetrics', c)}
            />
          </div>
        </SettingsSection>

        {/* Data Export */}
        <SettingsSection
          title="Organization Data Export"
          description="Download a simulated machine-readable JSON archive of your company profile, members, and workforce scenarios."
        >
          <div className="p-4 rounded-xl bg-canvas-subtle border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-700" />
                <h4 className="text-body-sm font-bold text-charcoal-900">
                  Export Organization JSON Archive
                </h4>
              </div>
              <p className="text-caption text-charcoal-500">
                Includes workforce baseline headcount, planning scenarios, team members, and alert rules.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportOrgData}
              className="shrink-0 self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Organization Data
            </Button>
          </div>

          {exportSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Organization archive compiled successfully. Local schema validated.</span>
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

        {/* Danger Zone */}
        <DangerZone
          actions={[
            {
              id: 'clear-talent-filters',
              title: 'Clear Saved Talent Search Filters',
              description: 'Reset all saved search criteria and role matching filters in Talent Discovery.',
              buttonText: 'Clear Saved Filters',
              isDestructive: true,
              onConfirm: handleClearFilters,
              confirmTitle: 'Clear Talent Filters?',
              confirmMessage: 'Are you sure you want to reset all stored candidate search filters?',
            },
            {
              id: 'reset-org-prefs',
              title: 'Reset All Organization Settings to Defaults',
              description: 'Revert workforce planning horizons, scenario defaults, and alert rules.',
              buttonText: 'Reset Organization Settings',
              isDestructive: true,
              onConfirm: handleResetOrgSettings,
              confirmTitle: 'Reset Organization Settings?',
              confirmMessage: 'Are you sure you want to restore default workforce planning parameters?',
            },
          ]}
        />
      </div>
    </SettingsLayout>
  );
};

export default OrganizationPrivacySettingsPage;
