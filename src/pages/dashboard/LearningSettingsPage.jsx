import React, { useState } from 'react';
import { BookOpen, Clock, Target, Sparkles, Layers, Award } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceRadioGroup from '../../components/settings/PreferenceRadioGroup';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { getStoredLearningPreferences, saveLearningPreferences } from '../../utils/settingsIntelligence';

export const LearningSettingsPage = () => {
  const { addToast } = useToast();
  const initialPrefs = getStoredLearningPreferences();

  const [learning, setLearning] = useState(initialPrefs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setLearning((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveLearningPreferences(learning);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Learning Preferences Saved',
        message: 'Your study goals and schedule have been updated in Learning Intelligence.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setLearning(initialPrefs);
    setHasChanges(false);
  };

  return (
    <SettingsLayout activeRoute="/dashboard/settings/learning">
      <div className="space-y-6">
        <SettingsHeader
          title="Learning & Development Preferences"
          subtitle="Tailor your learning recommendations, daily time commitments, pedagogical formats, and reminder cadence."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Primary Learning Goal */}
        <SettingsSection
          title="Primary Learning Objective"
          description="Select your core motivation to shape how curriculum tracks are prioritized."
        >
          <PreferenceRadioGroup
            value={learning.learningGoal}
            onChange={(val) => handleChange('learningGoal', val)}
            columns={3}
            options={[
              { value: 'Skill improvement', label: 'Skill Improvement', description: 'Deepen existing technical competencies' },
              { value: 'Career transition', label: 'Career Transition', description: 'Pivot toward new target engineering roles' },
              { value: 'Interview preparation', label: 'Interview Prep', description: 'Focus on System Design & coding assessments' },
              { value: 'Project development', label: 'Portfolio Building', description: 'Hands-on repository implementation' },
              { value: 'General exploration', label: 'Broad Exploration', description: 'Explore emerging frameworks & tools' },
            ]}
          />
        </SettingsSection>

        {/* Learning Style & Pedagogy */}
        <SettingsSection
          title="Pedagogical Style & Format"
          description="Determine whether you prefer linear theory, code practice, or full portfolio projects."
        >
          <PreferenceRadioGroup
            value={learning.learningStyle}
            onChange={(val) => handleChange('learningStyle', val)}
            columns={2}
            options={[
              { value: 'Structured curriculum', label: 'Structured Curriculum', description: 'Sequential theory → practice → build → validate' },
              { value: 'Project-based', label: 'Project-First', description: 'Learn by building production-scope services' },
              { value: 'Practice-first', label: 'Interactive Labs', description: 'Short interactive sandbox exercises' },
              { value: 'Mixed', label: 'Balanced Hybrid', description: 'Dynamic blend of documentation and coding' },
            ]}
          />
        </SettingsSection>

        {/* Daily Time Commitment & Frequency */}
        <SettingsSection
          title="Daily Study Commitment & Schedule"
          description="Calibrate estimated completion horizons across active learning paths."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Target Study Duration
              </label>
              <PreferenceRadioGroup
                value={learning.dailyTimeCommitment}
                onChange={(val) => handleChange('dailyTimeCommitment', val)}
                columns={4}
                options={[
                  { value: '15 min/day', label: '15 min / day', description: 'Micro-learning' },
                  { value: '30 min/day', label: '30 min / day', description: 'Steady pace' },
                  { value: '1 hour/day', label: '1 hour / day', description: 'Accelerated' },
                  { value: 'Flexible', label: 'Flexible', description: 'Self-scheduled' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-border">
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-charcoal-900 block">
                  Study Reminder Cadence
                </label>
                <Select
                  value={learning.reminderFrequency}
                  onChange={(e) => handleChange('reminderFrequency', e.target.value)}
                  options={['Daily', 'Weekly', 'None']}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-charcoal-900 block">
                  Learning Modality
                </label>
                <Select
                  value={learning.modality}
                  onChange={(e) => handleChange('modality', e.target.value)}
                  options={['Self-paced', 'Guided', 'Mixed']}
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Priority Competency Focus */}
        <SettingsSection
          title="Priority Skill Targets"
          description="Directly steer which technical competencies appear at the top of your learning recommendations."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Competency Focus"
              value={learning.primaryFocusSkill || ''}
              onChange={(e) => handleChange('primaryFocusSkill', e.target.value)}
              placeholder="e.g. Spring Boot & Microservices"
            />
            <Input
              label="Secondary Competency Focus"
              value={learning.secondaryFocusSkill || ''}
              onChange={(e) => handleChange('secondaryFocusSkill', e.target.value)}
              placeholder="e.g. AWS Cloud Architecture"
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

export default LearningSettingsPage;
