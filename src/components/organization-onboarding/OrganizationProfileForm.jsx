import React from 'react';
import { Building2, Globe, MapPin, Users, Calendar, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { organizationTypes, organizationSizes } from '../../data/organizationData';

export const OrganizationProfileForm = ({
  companyData,
  onChange,
  errors = {},
}) => {
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Organization Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Organization Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={companyData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. TechNova Solutions"
              className={`w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden transition-colors ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-surface-border'
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-600 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Organization Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Organization Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={companyData.type || 'Enterprise'}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden cursor-pointer"
          >
            {organizationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Organization Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Organization Size (Employees) <span className="text-rose-500">*</span>
          </label>
          <select
            value={companyData.size || '201–500'}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden cursor-pointer"
          >
            {organizationSizes.map((size) => (
              <option key={size} value={size}>
                {size} employees
              </option>
            ))}
          </select>
        </div>

        {/* Founded Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Founded Year
          </label>
          <input
            type="text"
            value={companyData.foundedYear || ''}
            onChange={(e) => handleChange('foundedYear', e.target.value)}
            placeholder="e.g. 2018"
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Website URL
          </label>
          <input
            type="text"
            value={companyData.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="e.g. https://technova.example.com"
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>

        {/* Primary Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Primary Headquarters Location <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={companyData.primaryLocation || ''}
            onChange={(e) => handleChange('primaryLocation', e.target.value)}
            placeholder="e.g. Bengaluru, India"
            className={`w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden ${
              errors.primaryLocation ? 'border-rose-400 bg-rose-50/20' : 'border-surface-border'
            }`}
          />
          {errors.primaryLocation && (
            <p className="text-xs text-rose-600 font-medium">{errors.primaryLocation}</p>
          )}
        </div>

        {/* Additional Locations */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Additional Operating Locations
          </label>
          <input
            type="text"
            value={companyData.additionalLocations || ''}
            onChange={(e) => handleChange('additionalLocations', e.target.value)}
            placeholder="e.g. Hyderabad, Pune, Remote"
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>

        {/* Company Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Organization Overview & Mission
          </label>
          <textarea
            rows={3}
            value={companyData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your organization's core operations, business focus, and engineering scope..."
            className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfileForm;
