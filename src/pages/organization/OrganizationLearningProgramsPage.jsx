import React from 'react';
import { BookOpen, ArrowLeft, ArrowRight, CalendarCheck, Users, Sparkles, Building2 } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import OrganizationLearningPrograms from '../../components/learning/OrganizationLearningPrograms';
import OrganizationLearningInsights from '../../components/learning/OrganizationLearningInsights';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const OrganizationLearningProgramsPage = () => {
  const { navigate } = useRouter();

  return (
    <OrganizationLayout activeRoute="/organization/learning">
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/organization/learning')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learning & Capability Intelligence
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/learning/capabilities')}
            >
              Capability Coverage Matrix
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/organization/planning')}
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1" />
              Workforce Planning
            </Button>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100/80 text-amber-900">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Enterprise Learning Programs
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                Workforce Development Cohorts
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
              Structured upskilling initiatives mapped directly to workforce capability deficits. Track cohort participation, milestone progress, and planned capacity unit delivery.
            </p>
          </div>
        </div>

        {/* All Organization Learning Programs */}
        <OrganizationLearningPrograms />

        {/* Aggregate Observations */}
        <OrganizationLearningInsights />

        {/* Methodology & Disclaimer */}
        <div className="space-y-6 pt-6">
          <LearningMethodology />
          <LearningDisclaimer />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationLearningProgramsPage;
