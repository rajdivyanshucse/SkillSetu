import React from 'react';
import { MapPin, ArrowLeft, Building2, Laptop, Info } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { locationBenchmarks } from '../../data/compensationData';
import { LocationCompensation } from '../../components/compensation/LocationCompensation';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CompensationLocationsPage = () => {
  const { navigate } = useRouter();

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
                Location Intelligence
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Location & Work Mode Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Examine advertised compensation parameters across primary metropolitan engineering hubs and distributed remote work arrangements.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/compensation/roles')}
              className="text-xs flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Role Benchmarks
            </Button>
          </div>
        </div>

        {/* Location Grid Component */}
        <LocationCompensation
          locations={locationBenchmarks}
          title="All Location Benchmarks in Prototype Dataset"
          subtitle="Comprehensive overview of 7 geographic segments evaluated."
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="general" />
      </div>
    </DashboardLayout>
  );
};
