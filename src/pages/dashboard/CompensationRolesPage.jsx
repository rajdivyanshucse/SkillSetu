import React, { useState, useMemo } from 'react';
import { Layers, ArrowLeft, Scale, Sparkles, Filter, Search, RotateCcw } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { normalizedRoles, fictionalOpportunityRecords } from '../../data/compensationData';
import {
  getStoredCompensationPreferences,
  saveStoredCompensationPreferences,
} from '../../utils/compensationIntelligence';
import { RoleCompensationOverview } from '../../components/compensation/RoleCompensationOverview';
import { CompensationFilters } from '../../components/compensation/CompensationFilters';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CompensationRolesPage = () => {
  const { navigate } = useRouter();

  const [filters, setFilters] = useState({
    category: 'All',
    location: 'All',
    experience: 'All',
    workMode: 'All',
    employmentType: 'All',
  });

  const [selectedCompareIds, setSelectedCompareIds] = useState(() => {
    const stored = getStoredCompensationPreferences();
    return stored?.compareIds || ['backend-software-engineer', 'data-engineer'];
  });

  const handleToggleCompare = (roleId) => {
    setSelectedCompareIds((prev) => {
      let next;
      if (prev.includes(roleId)) {
        next = prev.filter((id) => id !== roleId);
      } else {
        if (prev.length >= 4) {
          next = [...prev.slice(1), roleId];
        } else {
          next = [...prev, roleId];
        }
      }
      const existing = getStoredCompensationPreferences() || {};
      saveStoredCompensationPreferences({ ...existing, compareIds: next });
      return next;
    });
  };

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
    <DashboardLayout activeRoute="/dashboard/compensation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard/compensation')}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Compensation Home
              </button>
              <span className="text-charcoal-300">•</span>
              <Badge variant="brand" size="sm">
                Role Catalog
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Role Compensation Catalog
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Explore advertised compensation parameters, typical tenure bands, and skill associations across normalized software roles.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/compare')}
              className="text-xs flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Selected ({selectedCompareIds.length})
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <CompensationFilters
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Role Overview */}
        <RoleCompensationOverview
          roles={normalizedRoles}
          selectedCompareIds={selectedCompareIds}
          onToggleCompare={handleToggleCompare}
          showSearch={true}
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="general" />
      </div>
    </DashboardLayout>
  );
};
