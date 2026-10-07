import React, { useState } from 'react';
import { Layers, ArrowLeft, Building2, Search, Filter } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { normalizedRoles } from '../../data/compensationData';
import { RoleCompensationOverview } from '../../components/compensation/RoleCompensationOverview';
import { CompensationFilters } from '../../components/compensation/CompensationFilters';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const OrganizationCompensationRolesPage = () => {
  const { navigate } = useRouter();

  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    experience: 'All',
    workMode: 'All',
    employmentType: 'All',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      location: 'All',
      experience: 'All',
      workMode: 'All',
      employmentType: 'All',
    });
  };

  return (
    <OrganizationLayout activeRoute="/organization/compensation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/organization/compensation')}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Compensation Overview
              </button>
              <span className="text-charcoal-300">•</span>
              <Badge variant="brand" size="sm">
                Role Analysis
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Role-Level Compensation Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Examine advertised compensation ranges and common technical competencies across normalized organizational role archetypes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/planning')}
              className="text-xs flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              Workforce Planning
            </Button>
          </div>
        </div>

        {/* Filters */}
        <CompensationFilters
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Role Overview */}
        <RoleCompensationOverview
          roles={normalizedRoles}
          showSearch={true}
          viewModeDefault="table"
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="organizationPlanning" />
      </div>
    </OrganizationLayout>
  );
};
