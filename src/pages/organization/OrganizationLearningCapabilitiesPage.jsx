import React from 'react';
import { Layers, ArrowLeft, ArrowRight, CalendarCheck, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import OrganizationLearningCapabilities from '../../components/learning/OrganizationLearningCapabilities';
import OrganizationLearningInsights from '../../components/learning/OrganizationLearningInsights';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

export const OrganizationLearningCapabilitiesPage = () => {
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
              onClick={() => navigate('/organization/learning/programs')}
            >
              Development Programs
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
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Capability Learning Coverage
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                Strategic Alignment Matrix
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl leading-relaxed">
              Synthesize organizational skill baselines, target capability benchmarks, and active upskilling coverage to determine remaining capacity deficits and recommend balanced Build vs. Buy intervention mixes.
            </p>
          </div>
        </div>

        {/* Action Mix Integration Banner */}
        <Card className="p-5 border-stone-200 bg-gradient-to-r from-stone-50 via-amber-50/40 to-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-mono">
              Phase 12 Workforce Planning Linkage
            </h4>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Internal development is projected to close <strong>45–65%</strong> of capability deficits across priority domains. The remaining gap is routed to external talent acquisition channels.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => navigate('/organization/talent')}
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Source External Talent
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-amber-800 hover:bg-amber-900 text-white text-xs"
              onClick={() => navigate('/organization/planning')}
            >
              Adjust Planning Scenarios
            </Button>
          </div>
        </Card>

        {/* Main Capability Matrix Component */}
        <OrganizationLearningCapabilities />

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

export default OrganizationLearningCapabilitiesPage;
