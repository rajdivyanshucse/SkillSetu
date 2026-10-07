import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const WorkforceEmptyState = ({
  title = 'No skills found',
  description = 'Try adjusting your search terms or filter criteria to view capability data.',
  onReset,
}) => {
  return (
    <div className="p-10 text-center rounded-lg border border-surface-border bg-surface flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-canvas-subtle border border-surface-border flex items-center justify-center text-charcoal-400 mb-3">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="text-body font-bold text-charcoal-900 mb-1">
        {title}
      </h3>
      <p className="text-body-xs text-charcoal-500 mb-4 max-w-xs">
        {description}
      </p>
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
};

export default WorkforceEmptyState;
