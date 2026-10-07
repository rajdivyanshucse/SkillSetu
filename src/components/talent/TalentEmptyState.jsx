import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const TalentEmptyState = ({
  title = 'No candidate profiles found',
  description = 'Try broadening your search terms or adjusting the filter criteria to explore more talent.',
  onReset,
}) => {
  return (
    <div className="p-10 text-center rounded-2xl border border-surface-border bg-surface max-w-md mx-auto my-8 space-y-3">
      <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center text-charcoal-400 mx-auto">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="text-body font-bold text-charcoal-900">
        {title}
      </h3>
      <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
        {description}
      </p>
      {onReset && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Search & Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TalentEmptyState;
