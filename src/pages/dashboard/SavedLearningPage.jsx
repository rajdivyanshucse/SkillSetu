import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowLeft, Trash2, ExternalLink, BookOpen, Clock, Tag, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LearningResourceCard from '../../components/learning/LearningResourceCard';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import { initialLearningCatalog } from '../../data/learningData';
import { getStoredSavedLearning, toggleSaveLearningResource } from '../../utils/learningIntelligence';

const SavedLearningPage = () => {
  const { navigate } = useRouter();
  const [savedIds, setSavedIds] = useState(getStoredSavedLearning());
  const [formatFilter, setFormatFilter] = useState('ALL');

  useEffect(() => {
    setSavedIds(getStoredSavedLearning());
  }, []);

  const handleToggleSave = (resourceId) => {
    const nextSaved = toggleSaveLearningResource(resourceId);
    setSavedIds(nextSaved);
  };

  const savedResources = initialLearningCatalog.filter(res => savedIds.includes(res.id));
  const filteredResources = formatFilter === 'ALL'
    ? savedResources
    : savedResources.filter(r => r.format.toLowerCase().includes(formatFilter.toLowerCase()));

  const formats = ['ALL', 'Course', 'Practice Lab', 'Tutorial', 'Case Study', 'Documentation'];

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
            onClick={() => navigate('/dashboard/learning/catalog')}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Browse Full Catalog
          </Button>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-100/70 text-amber-900">
                <Bookmark className="w-5 h-5 fill-amber-900" />
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">
                Saved Learning Resources
              </h1>
              <Badge variant="outline" className="text-xs font-semibold border-amber-300 text-amber-800 bg-amber-50">
                {savedResources.length} Items Saved
              </Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600 max-w-3xl">
              Access bookmarked learning materials, documentation modules, and practice labs stored locally for offline review and self-paced execution.
            </p>
          </div>
        </div>

        {/* Format Filter Bar if items exist */}
        {savedResources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-stone-500 mr-2">Filter by format:</span>
            {formats.map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormatFilter(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  formatFilter === fmt
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map(resource => (
              <LearningResourceCard
                key={resource.id}
                resource={resource}
                isSaved={true}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-stone-300 bg-stone-50/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                No saved learning resources yet
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Save courses, tutorials, and practice labs from the learning catalog or recommendation engine to build your personalized study list.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold"
                onClick={() => navigate('/dashboard/learning/catalog')}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Explore Catalog
              </Button>
            </div>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="pt-6">
          <LearningDisclaimer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedLearningPage;
