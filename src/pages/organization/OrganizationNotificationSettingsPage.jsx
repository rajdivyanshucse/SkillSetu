import React, { useState } from 'react';
import { Bell, Mail, Users, CalendarCheck, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { getStoredOrgNotificationPreferences, saveOrgNotificationPreferences } from '../../utils/settingsIntelligence';

export const OrganizationNotificationSettingsPage = () => {
  const { addToast } = useToast();
  const initialNotifs = getStoredOrgNotificationPreferences();

  const [notifs, setNotifs] = useState(initialNotifs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (category, field, value) => {
    setNotifs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveOrgNotificationPreferences(notifs);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Organization Alert Rules Saved',
        message: 'Notification triggers updated for all workspace administrators.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setNotifs(initialNotifs);
    setHasChanges(false);
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Organization Alert Preferences"
          subtitle="Configure enterprise notification triggers for workforce planning scenarios, talent matching, cohort milestones, and compensation shifts."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        {/* Channels */}
        <SettingsSection
          title="Dispatch Channels"
          description="Select delivery methods for executive briefings and operational alerts."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="org-channel-email"
              label="Executive Email Digest"
              description="Weekly digest of department capacity deficits and hiring velocity."
              checked={notifs.channels?.email}
              onChange={(c) => handleToggle('channels', 'email', c)}
            />
            <PreferenceToggle
              id="org-channel-inapp"
              label="Organization Workspace Notifications"
              description="Real-time in-app alerts on talent shortlists and cohort milestones."
              checked={notifs.channels?.inApp}
              onChange={(c) => handleToggle('channels', 'inApp', c)}
            />
          </div>
        </SettingsSection>

        {/* Workforce Planning Alerts */}
        <SettingsSection
          title="Workforce Planning & Capability Gaps"
          description="Triggers when department capacity deficits or scenario targets change."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="org-wf-gap"
              label="Workforce Capability Gap Changes"
              description="Alerts when engineering or data team gaps exceed threshold boundaries."
              checked={notifs.workforce?.skillGapAlerts}
              onChange={(c) => handleToggle('workforce', 'skillGapAlerts', c)}
            />
            <PreferenceToggle
              id="org-wf-future"
              label="Emerging Technology & Future Skill Signals"
              description="Alerts on industry shifts affecting 24-month talent demand."
              checked={notifs.workforce?.futureSkillSignals}
              onChange={(c) => handleToggle('workforce', 'futureSkillSignals', c)}
            />
            <PreferenceToggle
              id="org-wf-scenarios"
              label="Planning Scenario Calibration Updates"
              description="Notices when team planners modify FTE growth projections."
              checked={notifs.workforce?.planningScenarioUpdates}
              onChange={(c) => handleToggle('workforce', 'planningScenarioUpdates', c)}
            />
          </div>
        </SettingsSection>

        {/* Talent Discovery Alerts */}
        <SettingsSection
          title="Talent Discovery & Pipelines"
          description="Updates on matched candidate shortlists and role pipeline activity."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="org-talent-shortlist"
              label="Candidate Shortlist Collaborations"
              description="Notifications when team members add candidates to active role shortlists."
              checked={notifs.talent?.candidateShortlistActivity}
              onChange={(c) => handleToggle('talent', 'candidateShortlistActivity', c)}
            />
            <PreferenceToggle
              id="org-talent-matches"
              label="New Matching Candidate Alerts"
              description="Alerts when candidates with >90% compatibility with open roles register."
              checked={notifs.talent?.newMatchingTalentAlerts}
              onChange={(c) => handleToggle('talent', 'newMatchingTalentAlerts', c)}
            />
          </div>
        </SettingsSection>

        {/* Learning Programs Alerts */}
        <SettingsSection
          title="Learning & Capability Programs"
          description="Progress tracking for internal workforce upskilling cohorts."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="org-learn-cohort"
              label="Cohort Milestone Advances"
              description="Updates when enterprise cohorts (e.g. Cloud Engineering) reach 50% or 100% completion."
              checked={notifs.learning?.cohortMilestones}
              onChange={(c) => handleToggle('learning', 'cohortMilestones', c)}
            />
            <PreferenceToggle
              id="org-learn-coverage"
              label="Capability Coverage Matrix Milestone"
              description="Alerts when internal upskilling closes a designated net capability gap."
              checked={notifs.learning?.capabilityCoverageMilestones}
              onChange={(c) => handleToggle('learning', 'capabilityCoverageMilestones', c)}
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
      </div>
    </SettingsLayout>
  );
};

export default OrganizationNotificationSettingsPage;
