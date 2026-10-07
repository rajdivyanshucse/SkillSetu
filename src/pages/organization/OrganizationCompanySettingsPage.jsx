import React, { useState } from 'react';
import { Building2, Globe, MapPin, Users, CheckCircle2 } from 'lucide-react';
import SettingsLayout from '../../components/settings/SettingsLayout';
import SettingsHeader from '../../components/settings/SettingsHeader';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsSaveBar from '../../components/settings/SettingsSaveBar';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { useOrganizationOnboarding } from '../../components/organization-onboarding/OrganizationOnboardingContext';
import { getStoredOrganizationSettings, saveOrganizationSettings } from '../../utils/settingsIntelligence';

export const OrganizationCompanySettingsPage = () => {
  const { addToast } = useToast();
  const { data: onboardingData, updateCompany } = useOrganizationOnboarding();
  const initialOrg = getStoredOrganizationSettings();

  const [company, setCompany] = useState({
    companyName: onboardingData?.company?.name || initialOrg.companyName,
    industry: onboardingData?.company?.industry || initialOrg.industry,
    companySize: onboardingData?.workforce?.totalHeadcount ? `${onboardingData.workforce.totalHeadcount} employees` : initialOrg.companySize,
    location: onboardingData?.company?.location || initialOrg.location,
    website: onboardingData?.company?.website || initialOrg.website,
    description: initialOrg.description,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      saveOrganizationSettings(company);
      if (updateCompany) {
        updateCompany({
          name: company.companyName,
          industry: company.industry,
          location: company.location,
          website: company.website,
        });
      }
      setIsSaving(false);
      setHasChanges(false);
      addToast({
        title: 'Company Information Saved',
        message: 'Organization profile updated across workforce and planning dashboards.',
        type: 'success',
      });
    }, 400);
  };

  const handleCancel = () => {
    setCompany(initialOrg);
    setHasChanges(false);
  };

  return (
    <SettingsLayout type="organization" activeRoute="/organization/settings">
      <div className="space-y-6">
        <SettingsHeader
          title="Company Profile & Identity"
          subtitle="Manage legal company details, corporate website, headquarters location, and organizational mission."
          backUrl="/organization/settings"
          backLabel="Back to Organization Settings Hub"
        />

        {/* Company Profile Form */}
        <SettingsSection
          title="Corporate Details"
          description="Information visible to team members, candidates, and in aggregate industry benchmarks."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={company.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="e.g. Nexora Technologies Inc."
              required
            />

            <div className="space-y-1.5">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Industry Domain
              </label>
              <Select
                value={company.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                options={[
                  'Enterprise Software & Cloud Platforms',
                  'FinTech & Digital Banking',
                  'HealthTech & Life Sciences',
                  'E-commerce & Retail Tech',
                  'AI, Data & Analytics',
                  'Telecommunications & Infrastructure',
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Company Size Tier
              </label>
              <Select
                value={company.companySize}
                onChange={(e) => handleChange('companySize', e.target.value)}
                options={[
                  '1–50 employees',
                  '50–250 employees',
                  '250–500 employees',
                  '500–1,000 employees',
                  '1,000–5,000 employees',
                  '5,000+ employees',
                ]}
              />
            </div>

            <Input
              label="Headquarters & Office Locations"
              value={company.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g. Bengaluru, India (HQ)"
            />

            <div className="sm:col-span-2">
              <Input
                label="Corporate Website"
                value={company.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://company.example.com"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-body-sm font-semibold text-charcoal-900 block">
                Organization Description & Mission
              </label>
              <textarea
                rows={3}
                value={company.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your organization's mission and engineering core..."
                className="w-full p-3 rounded-md bg-surface text-charcoal-900 border border-surface-border text-body-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 outline-none resize-y"
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

export default OrganizationCompanySettingsPage;
