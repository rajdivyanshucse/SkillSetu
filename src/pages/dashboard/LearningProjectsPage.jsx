import React from 'react';
import { Layers, ArrowLeft, ExternalLink, Sparkles, Code, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LearningProjectRecommendations from '../../components/learning/LearningProjectRecommendations';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

const LearningProjectsPage = () => {
  const { navigate } = useRouter();

  return (
    <DashboardLayout activeRoute="/dashboard/learning">
      <div className="space-y-8 pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard/learning')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Intelligence
          </button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => navigate('/dashboard/growth/projects')}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            Track in Professional Growth
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100/70 text-amber-900">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Project-Based Learning
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                Production-Scope Portfolio Labs
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl">
              Translate learning modules into tangible production artifacts. Each project is engineered with realistic architecture requirements, testing criteria, and direct mapping to Professional Growth & Portfolio Verification.
            </p>
          </div>
        </div>

        {/* Growth Pipeline Link Callout */}
        <Card className="p-4 bg-gradient-to-r from-amber-50/60 to-stone-50 border-amber-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">
                Unified Professional Growth Integration
              </h4>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Completed projects feed your Professional Growth portfolio evidence, updating development milestones and capability verification metrics.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-amber-300 text-amber-900 hover:bg-amber-100/50 shrink-0"
            onClick={() => navigate('/dashboard/growth/projects')}
          >
            Open Growth Projects Workspace
          </Button>
        </Card>

        {/* Main Projects Component */}
        <LearningProjectRecommendations />

        {/* Methodology & Disclaimer */}
        <div className="space-y-6 pt-6">
          <LearningMethodology />
          <LearningDisclaimer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningProjectsPage;
