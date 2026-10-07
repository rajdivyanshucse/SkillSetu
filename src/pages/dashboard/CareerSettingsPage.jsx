import React, { useState } from 'react';
import { Compass, Briefcase, MapPin, Building2, Clock, Check } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceRadioGroup from '../../components/settings/PreferenceRadioGroup';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { getStoredCareerPreferences, saveCareerPreferences } from '../../utils/settingsIntelligence';

export const CareerSettingsPage = () => {
  const { addToast } = useToast();
  const initialPrefs = getStoredCareerPreferences();

  const [career, setCareer] = useState(initialPrefs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setCareer((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleIndustryToggle = (ind) => {
    const current = career.industries || [];
    const updated = current.includes(ind)
      ? current.filter((i) => i !== ind)
      : [...current, ind];
    handleChange('industries', updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveCareerPreferences(career);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Career Preferences Saved',
        message: 'Your target roles and career parameters have been updated across intelligence modules.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setCareer(initialPrefs);
    setHasChanges(false);
  };

  const industryList = ['Software', 'FinTech', 'SaaS', 'E-commerce', 'Healthcare', 'AI & Data Platforms', 'Enterprise IT'];

  return (
    <SettingsLayout activeRoute="/dashboard/settings/career">
      <div className="space-y-6">
        <SettingsHeader
          title="Career Preferences"
          subtitle="Configure your target engineering roles, industry domains, experience tier, and working modalities."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Target Roles */}
        <SettingsSection
          title="Target Engineering Roles"
          description="Your primary target role benchmarks skill expectations, gap severity, and career roadmap sequencing."
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Primary Target Role
              </label>
              <Select
                value={career.primaryTargetRole}
                onChange={(e) => handleChange('primaryTargetRole', e.target.value)}
                options={[
                  'Backend Software Engineer',
                  'Full Stack Developer',
                  'Cloud Platform Engineer',
                  'DevOps & Infrastructure Engineer',
                  'Data Platform Engineer',
                  'AI & Machine Learning Engineer',
                  'System Architect',
                ]}
              />
            </div>

            <Input
              label="Career Direction & Vision"
              value={career.careerDirection || ''}
              onChange={(e) => handleChange('careerDirection', e.target.value)}
              placeholder="e.g. Distributed Systems Specialist & Architecture Lead"
            />
          </div>
        </SettingsSection>

        {/* Experience Tier & Career Timeline */}
        <SettingsSection
          title="Experience Level & Timeline"
          description="Calibrate market benchmark expectations and development urgency."
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Current Seniority Tier
              </label>
              <PreferenceRadioGroup
                value={career.experienceLevel}
                onChange={(val) => handleChange('experienceLevel', val)}
                options={[
                  { value: 'Student / Graduate', label: 'Student / Graduate', description: 'Early foundation building' },
                  { value: 'Entry Level (0-2 years)', label: 'Entry Level', description: 'Junior software engineer' },
                  { value: 'Mid Level (3-5 years)', label: 'Mid Level', description: 'Independent contributor' },
                  { value: 'Senior (6+ years)', label: 'Senior Engineer', description: 'Technical lead / architect' },
                ]}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-surface-border">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Current Career Transition Timeline
              </label>
              <PreferenceRadioGroup
                value={career.careerTimeline}
                onChange={(val) => handleChange('careerTimeline', val)}
                columns={2}
                options={[
                  { value: 'Exploring', label: 'Exploring', description: 'Assessing skill gaps & market demands' },
                  { value: 'Preparing', label: 'Preparing', description: 'Enrolled in structured learning paths' },
                  { value: 'Actively developing', label: 'Actively Developing', description: 'Building portfolio projects & code proof' },
                  { value: 'Opportunity focused', label: 'Opportunity Focused', description: 'Actively matching with open roles' },
                ]}
              />
            </div>
          </div>
        </SettingsSection>

        {/* Working Modality & Location */}
        <SettingsSection
          title="Working Modalities & Location"
          description="Define remote flexibility and geographical matching preferences."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Preferred Work Mode
              </label>
              <PreferenceRadioGroup
                value={career.workMode}
                onChange={(val) => handleChange('workMode', val)}
                columns={3}
                options={[
                  { value: 'Remote', label: 'Remote', description: '100% location independent' },
                  { value: 'Hybrid', label: 'Hybrid', description: '1-3 days in-office flexibility' },
                  { value: 'On-site', label: 'On-site', description: 'Full-time office collaboration' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Current Base City"
                value={career.currentLocation || ''}
                onChange={(e) => handleChange('currentLocation', e.target.value)}
                placeholder="e.g. Bengaluru"
              />
              <Input
                label="Target Cities (Comma-separated)"
                value={Array.isArray(career.preferredCities) ? career.preferredCities.join(', ') : career.preferredCities || ''}
                onChange={(e) => handleChange('preferredCities', e.target.value.split(',').map((c) => c.trim()))}
                placeholder="e.g. Bengaluru, Hyderabad, Remote"
              />
            </div>

            <PreferenceToggle
              id="pref-remote-only"
              label="Remote Only Filter"
              description="Prioritize strictly remote opportunity signals in Job Intelligence."
              checked={career.remoteOnly}
              onChange={(c) => handleChange('remoteOnly', c)}
            />
          </div>
        </SettingsSection>

        {/* Target Industries */}
        <SettingsSection
          title="Target Industry Sectors"
          description="Select domains where you prefer to apply your engineering competencies."
        >
          <div className="flex flex-wrap gap-2">
            {industryList.map((ind) => {
              const isSelected = (career.industries || []).includes(ind);
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => handleIndustryToggle(ind)}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-canvas-subtle text-charcoal-700 hover:bg-stone-200/80 border border-surface-border'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{ind}</span>
                </button>
              );
            })}
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

export default CareerSettingsPage;
