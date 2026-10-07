import React from 'react';
import { Search, Bookmark, Send, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';

export const OpportunityEmptyState = ({
  type = 'search',
  onResetFilters,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (type === 'saved') {
    return (
      <div
        className={`bg-surface border border-surface-border rounded-xl p-8 text-center max-w-lg mx-auto shadow-subtle space-y-4 ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto shadow-2xs">
          <Bookmark className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-body-md font-bold text-charcoal-900">
            No saved opportunities yet
          </h3>
          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            Save opportunities from the Jobs & Opportunities section to review, compare, or track them later.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/jobs')}
        >
          Explore Opportunities
        </Button>
      </div>
    );
  }

  if (type === 'applications') {
    return (
      <div
        className={`bg-surface border border-surface-border rounded-xl p-8 text-center max-w-lg mx-auto shadow-subtle space-y-4 ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center mx-auto shadow-2xs">
          <Send className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-body-md font-bold text-charcoal-900">
            No applications tracked yet
          </h3>
          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            Track opportunities you have applied to or plan to apply to, and update your interview progress locally.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate('/dashboard/jobs')}
        >
          Browse Opportunities to Track
        </Button>
      </div>
    );
  }

  // Default: search / filter empty state
  return (
    <div
      className={`bg-surface border border-surface-border rounded-xl p-8 text-center max-w-lg mx-auto shadow-subtle space-y-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-surface-border text-charcoal-500 flex items-center justify-center mx-auto shadow-2xs">
        <Search className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-body-md font-bold text-charcoal-900">
          No opportunities match your current filters
        </h3>
        <p className="text-body-sm text-charcoal-600 leading-relaxed">
          Try expanding your role category, location, or clearing specific skill keywords.
        </p>
      </div>
      {onResetFilters && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onResetFilters}
        >
          Reset All Filters
        </Button>
      )}
    </div>
  );
};

export default OpportunityEmptyState;
