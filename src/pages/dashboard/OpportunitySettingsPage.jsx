import React, { useState } from 'react';
import { Briefcase, DollarSign, MapPin, Check, Bell, Sparkles } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import PreferenceToggle from '../../components/settings/PreferenceToggle';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { getStoredOpportunityPreferences, saveOpportunityPreferences } from '../../utils/settingsIntelligence';

export const OpportunitySettingsPage = () => {
  const { addToast } = useToast();
  const initialPrefs = getStoredOpportunityPreferences();

  const [opps, setOpps] = useState(initialPrefs);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setOpps((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleTypeToggle = (type) => {
    const current = opps.opportunityTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    handleChange('opportunityTypes', updated);
  };

  const handleWorkModeToggle = (mode) => {
    const current = opps.workModes || [];
    const updated = current.includes(mode)
      ? current.filter((m) => m !== mode)
      : [...current, mode];
    handleChange('workModes', updated);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveOpportunityPreferences(opps);
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Opportunity Preferences Saved',
        message: 'Your job match filters and compensation benchmarks have been updated.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setOpps(initialPrefs);
    setHasChanges(false);
  };

  const allTypes = ['Full-time', 'Internship', 'Contract', 'Apprenticeship'];
  const allModes = ['Remote', 'Hybrid', 'On-site'];

  return (
    <SettingsLayout activeRoute="/dashboard/settings/opportunities">
      <div className="space-y-6">
        <SettingsHeader
          title="Opportunity & Matching Preferences"
          subtitle="Configure job opportunity filters, engagement types, target compensation thresholds, and skill-based alert triggers."
          backUrl="/dashboard/settings"
          backLabel="Back to Settings Hub"
        />

        {/* Opportunity Profile Preview Summary */}
        <Card className="p-4 bg-gradient-to-r from-canvas-subtle/80 to-white border-surface-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-charcoal-500">
              Active Opportunity Profile
            </span>
            <Badge variant="outline" className="text-[10px] bg-brand-50 text-brand-800 border-brand-200">
              Active Radar Connected
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-700">
            <span><strong>Types:</strong> {opps.opportunityTypes?.join(', ') || 'All'}</span>
            <span>•</span>
            <span><strong>Modes:</strong> {opps.workModes?.join(', ') || 'Any'}</span>
            <span>•</span>
            <span><strong>Target Band:</strong> ₹{opps.minCompensationLPA}–{opps.maxCompensationLPA} LPA</span>
          </div>
        </Card>

        {/* Opportunity Engagement Types */}
        <SettingsSection
          title="Opportunity & Engagement Types"
          description="Select which employment structures are displayed in your matching feed."
        >
          <div className="flex flex-wrap gap-2.5">
            {allTypes.map((type) => {
              const isSelected = (opps.opportunityTypes || []).includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeToggle(type)}
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
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </SettingsSection>

        {/* Work Mode & Compensation */}
        <SettingsSection
          title="Working Modality & Target Compensation"
          description="Filter opportunity signals by remote flexibility and minimum compensation thresholds."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Allowed Work Modes
              </label>
              <div className="flex flex-wrap gap-2">
                {allModes.map((mode) => {
                  const isSelected = (opps.workModes || []).includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleWorkModeToggle(mode)}
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
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-surface-border">
              <Input
                label="Minimum Advertised Compensation (₹ LPA)"
                type="number"
                value={opps.minCompensationLPA || 12}
                onChange={(e) => handleChange('minCompensationLPA', Number(e.target.value))}
                placeholder="14"
              />
              <Input
                label="Target / Maximum Compensation (₹ LPA)"
                type="number"
                value={opps.maxCompensationLPA || 24}
                onChange={(e) => handleChange('maxCompensationLPA', Number(e.target.value))}
                placeholder="24"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Opportunity Alerts */}
        <SettingsSection
          title="Skill-Based Opportunity Alerts"
          description="Automated digests when prototype openings matching your calibrated skills are published."
        >
          <div className="space-y-4">
            <PreferenceToggle
              id="pref-opp-alerts"
              label="Enable High Compatibility Match Alerts"
              description="Notify me when opportunities with >85% skill compatibility are indexed."
              checked={opps.skillAlertsEnabled}
              onChange={(c) => handleChange('skillAlertsEnabled', c)}
            />

            <div className="space-y-1.5 pt-2 border-t border-surface-border">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Match Alert Digest Frequency
              </label>
              <Select
                value={opps.alertFrequency}
                onChange={(e) => handleChange('alertFrequency', e.target.value)}
                options={['Instant', 'Daily digest', 'Weekly digest']}
                disabled={!opps.skillAlertsEnabled}
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

export default OpportunitySettingsPage;
