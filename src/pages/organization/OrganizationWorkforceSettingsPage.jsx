import React, { useState } from 'react';
import { CalendarCheck, Layers, TrendingUp, Check } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceRadioGroup from '../../components/settings/PreferenceRadioGroup';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { getStoredOrgWorkforcePreferences, saveOrgWorkforcePreferences } from '../../utils/settingsIntelligence';

export const OrganizationWorkforceSettingsPage = () => {
  const { addToast } = useToast();
  const initialPrefs = getStoredOrgWorkforcePreferences();

  const [prefs, setPrefs] = useState(initialPrefs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAreaToggle = (area) => {
    const current = prefs.primaryAreas || [];
    const updated = current.includes(area)
      ? current.filter((a) => a !== area)
      : [...current, area];
    handleChange('primaryAreas', updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveOrgWorkforcePreferences(prefs);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Workforce Planning Preferences Saved',
        message: 'Default horizons and scenario parameters updated for Workforce Planning modeling.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setPrefs(initialPrefs);
    setHasChanges(false);
  };

  const allAreas = [
    'Skill gaps',
    'Future skills',
    'Talent matching',
    'Workforce planning',
    'Learning development',
    'Compensation context',
  ];

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Workforce Intelligence Preferences"
          subtitle="Configure default planning horizons, baseline growth scenarios, and priority intelligence areas for Workforce Planning."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        {/* Planning Horizon */}
        <SettingsSection
          title="Default Planning Horizon"
          description="Choose the default look-ahead timeframe used when projecting organizational talent demand."
        >
          <PreferenceRadioGroup
            value={prefs.planningHorizon}
            onChange={(val) => handleChange('planningHorizon', val)}
            columns={4}
            options={[
              { value: '6 months', label: '6 Months', description: 'Immediate tactical hiring' },
              { value: '12 months', label: '12 Months (Default)', description: 'Annual capacity plan' },
              { value: '24 months', label: '24 Months', description: 'Strategic transformation' },
              { value: '36 months', label: '36 Months', description: 'Long-range roadmap' },
            ]}
          />
        </SettingsSection>

        {/* Default Scenario Preference */}
        <SettingsSection
          title="Baseline Scenario Strategy"
          description="Select the default business projection scenario applied across department modeling."
        >
          <PreferenceRadioGroup
            value={prefs.defaultScenario}
            onChange={(val) => handleChange('defaultScenario', val)}
            columns={2}
            options={[
              { value: 'Growth & Cloud Acceleration', label: 'Growth Acceleration', description: '+15–25% headcount expansion prioritizing cloud & platform engineering' },
              { value: 'Digital Transformation', label: 'Digital Transformation', description: 'Aggressive modern stack migration and decoupled architecture adoption' },
              { value: 'Skills Modernization', label: 'Internal Skills Modernization', description: 'Heavy focus on upskilling existing teams with minimal external hiring' },
              { value: 'Cost-Conscious Planning', label: 'Cost-Conscious Efficiency', description: 'Conservative hiring with strict ROI and offshore center expansion' },
            ]}
          />
        </SettingsSection>

        {/* Priority Intelligence Focus Areas */}
        <SettingsSection
          title="Primary Intelligence Focus Areas"
          description="Select which capability matrices are highlighted on executive overview dashboards."
        >
          <div className="flex flex-wrap gap-2.5">
            {allAreas.map((area) => {
              const isSelected = (prefs.primaryAreas || []).includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaToggle(area)}
                  className={`
                    px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-canvas-subtle text-charcoal-700 hover:bg-stone-200/80 border border-surface-border'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  <span>{area}</span>
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

export default OrganizationWorkforceSettingsPage;
