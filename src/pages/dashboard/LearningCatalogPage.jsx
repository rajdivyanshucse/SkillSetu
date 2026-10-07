import React from 'react';
import { BookOpen, Search, ArrowLeft, Bookmark } from 'lucide-react';
import { useRouter } from '../../router/Router';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LearningCatalog from '../../components/learning/LearningCatalog';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import LearningMethodology from '../../components/learning/LearningMethodology';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const LearningCatalogPage = () => {
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
            onClick={() => navigate('/dashboard/learning/saved')}
          >
            <Bookmark className="w-3.5 h-3.5 mr-1 text-amber-700" />
            Saved Learning Resources
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100/70 text-amber-900">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Learning Catalog
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                Prototype Resources
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl">
              Search and filter structured prototype learning resources, tutorials, documentation, and practice labs curated by target skill, role relevance, and developmental format.
            </p>
          </div>
        </div>

        {/* Catalog Main Component */}
        <LearningCatalog />

        {/* Methodology & Disclaimer */}
        <div className="space-y-6 pt-6">
          <LearningMethodology />
          <LearningDisclaimer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearningCatalogPage;
