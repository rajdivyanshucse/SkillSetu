import React, { useState } from 'react';
import { Bell, Mail, Compass, BookOpen, Briefcase, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { getStoredNotificationPreferences, saveNotificationPreferences } from '../../utils/settingsIntelligence';

export const NotificationSettingsPage = () => {
  const { addToast } = useToast();
  const initialNotifs = getStoredNotificationPreferences();

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

  const handleEnableAll = () => {
    const enabled = {
      channels: { email: true, inApp: true },
      careerIntelligence: { careerInsights: true, skillGapUpdates: true, roleCompatibilityUpdates: true, emergingSkillAlerts: true },
      learning: { learningReminders: true, courseProgressUpdates: true, validationReminders: true, roadmapMilestones: true },
      opportunities: { newMatchingOpportunities: true, savedOpportunityUpdates: true, applicationStatusReminders: true },
      product: { productUpdates: true, featureAnnouncements: true, platformMessages: true },
    };
    setNotifs(enabled);
    setHasChanges(true);
  };

  const handleDisableAll = () => {
    const disabled = {
      channels: { email: false, inApp: false },
      careerIntelligence: { careerInsights: false, skillGapUpdates: false, roleCompatibilityUpdates: false, emergingSkillAlerts: false },
      learning: { learningReminders: false, courseProgressUpdates: false, validationReminders: false, roadmapMilestones: false },
      opportunities: { newMatchingOpportunities: false, savedOpportunityUpdates: false, applicationStatusReminders: false },
      product: { productUpdates: false, featureAnnouncements: false, platformMessages: false },
    };
    setNotifs(disabled);
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveNotificationPreferences(notifs);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Notification Preferences Saved',
        message: 'Your simulated notification dispatch rules have been saved.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setNotifs(initialNotifs);
    setHasChanges(false);
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/notifications">
      <div className="space-y-6">
        <SettingsHeader
          title="Notification Preferences"
          subtitle="Configure simulated email digests, milestone alerts, learning reminders, and opportunity match notifications."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDisableAll}>
                Mute All
              </Button>
              <Button variant="outline" size="sm" onClick={handleEnableAll}>
                Enable All
              </Button>
            </div>
          }
        />

        {/* Delivery Channels */}
        <SettingsSection
          title="Delivery Channels"
          description="Choose which prototype communication surfaces receive your alerts."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="channel-email"
              label="Email Notifications (Simulated Digest)"
              description="Receive weekly summaries and critical roadmap notifications via email."
              checked={notifs.channels?.email}
              onChange={(c) => handleToggle('channels', 'email', c)}
            />
            <PreferenceToggle
              id="channel-inapp"
              label="In-App Notification Center"
              description="Display real-time badge toasts and activity timeline updates inside SkillSetu."
              checked={notifs.channels?.inApp}
              onChange={(c) => handleToggle('channels', 'inApp', c)}
            />
          </div>
        </SettingsSection>

        {/* Career Intelligence Alerts */}
        <SettingsSection
          title="Career Intelligence & Skill Gaps"
          description="Alerts related to market benchmark shifts, skill calibrations, and role compatibility."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="notif-career-insights"
              label="Career Intelligence & Insights"
              description="Notifications when new market observations are generated for your target role."
              checked={notifs.careerIntelligence?.careerInsights}
              onChange={(c) => handleToggle('careerIntelligence', 'careerInsights', c)}
            />
            <PreferenceToggle
              id="notif-skill-gaps"
              label="Skill Gap Recalibration Alerts"
              description="Updates when your self-assessment changes or new required skills emerge."
              checked={notifs.careerIntelligence?.skillGapUpdates}
              onChange={(c) => handleToggle('careerIntelligence', 'skillGapUpdates', c)}
            />
            <PreferenceToggle
              id="notif-role-compatibility"
              label="Role Compatibility Index Updates"
              description="Alerts when your overall capability overlap with target roles shifts."
              checked={notifs.careerIntelligence?.roleCompatibilityUpdates}
              onChange={(c) => handleToggle('careerIntelligence', 'roleCompatibilityUpdates', c)}
            />
            <PreferenceToggle
              id="notif-emerging-skills"
              label="Emerging Technology Alerts"
              description="Periodic signals on rising tech stacks relevant to backend and cloud engineering."
              checked={notifs.careerIntelligence?.emergingSkillAlerts}
              onChange={(c) => handleToggle('careerIntelligence', 'emergingSkillAlerts', c)}
            />
          </div>
        </SettingsSection>

        {/* Learning Intelligence Reminders */}
        <SettingsSection
          title="Learning & Development"
          description="Study habits, curriculum module progression, and validation checkpoint reminders."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="notif-learning-reminders"
              label="Daily / Weekly Study Reminders"
              description="Gentle nudges aligned with your configured daily study commitment."
              checked={notifs.learning?.learningReminders}
              onChange={(c) => handleToggle('learning', 'learningReminders', c)}
            />
            <PreferenceToggle
              id="notif-course-progress"
              label="Module & Curriculum Progress"
              description="Notifications upon completing modules in active learning paths."
              checked={notifs.learning?.courseProgressUpdates}
              onChange={(c) => handleToggle('learning', 'courseProgressUpdates', c)}
            />
            <PreferenceToggle
              id="notif-validation-reminders"
              label="Validation & Checkpoint Alerts"
              description="Reminders to execute coding tests and architecture case studies."
              checked={notifs.learning?.validationReminders}
              onChange={(c) => handleToggle('learning', 'validationReminders', c)}
            />
            <PreferenceToggle
              id="notif-roadmap-milestones"
              label="Career Roadmap Milestone Advances"
              description="Celebrations when learning milestones advance your career roadmap stages."
              checked={notifs.learning?.roadmapMilestones}
              onChange={(c) => handleToggle('learning', 'roadmapMilestones', c)}
            />
          </div>
        </SettingsSection>

        {/* Opportunity Match Alerts */}
        <SettingsSection
          title="Opportunity & Job Intelligence"
          description="New listings matching your configured skills and compensation thresholds."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="notif-matching-jobs"
              label="High Compatibility Opportunity Matches"
              description="Alerts for prototype job openings with >85% skill compatibility."
              checked={notifs.opportunities?.newMatchingOpportunities}
              onChange={(c) => handleToggle('opportunities', 'newMatchingOpportunities', c)}
            />
            <PreferenceToggle
              id="notif-saved-jobs"
              label="Saved Opportunity Updates"
              description="Notifications when bookmarked listings update requirements or compensation bands."
              checked={notifs.opportunities?.savedOpportunityUpdates}
              onChange={(c) => handleToggle('opportunities', 'savedOpportunityUpdates', c)}
            />
            <PreferenceToggle
              id="notif-app-status"
              label="Application Tracking Reminders"
              description="Follow-up reminders for prototype applications submitted in the platform."
              checked={notifs.opportunities?.applicationStatusReminders}
              onChange={(c) => handleToggle('opportunities', 'applicationStatusReminders', c)}
            />
          </div>
        </SettingsSection>

        {/* Product & Platform Updates */}
        <SettingsSection
          title="Product & System Announcements"
          description="Platform releases, new intelligence modules, and telemetry governance notes."
        >
          <div className="divide-y divide-surface-border">
            <PreferenceToggle
              id="notif-product-updates"
              label="SkillSetu Feature Releases"
              description="Notices when new career intelligence, workforce planning, or learning tools launch."
              checked={notifs.product?.productUpdates}
              onChange={(c) => handleToggle('product', 'productUpdates', c)}
            />
            <PreferenceToggle
              id="notif-platform-messages"
              label="Platform Telemetry & System Messages"
              description="Operational notes regarding LocalStorage state and schema calibrations."
              checked={notifs.product?.platformMessages}
              onChange={(c) => handleToggle('product', 'platformMessages', c)}
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

export default NotificationSettingsPage;
