import React from 'react';
import { AlertCircle, RotateCcw, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';

export const CompensationEmptyState = ({
  title = 'No Compensation Records Found',
  description = 'No prototype opportunity data matches your selected filters or search parameters.',
  onReset,
  showBackAction = true,
  className = '',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`p-8 sm:p-12 text-center bg-surface rounded-lg border border-surface-border space-y-4 max-w-md mx-auto shadow-xs ${className}`}>
      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-200/60">
        <Search className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-charcoal-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-charcoal-500 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
        {showBackAction && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/dashboard/compensation')}
            className="text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Compensation Home
          </Button>
        )}
      </div>
    </div>
  );
};
