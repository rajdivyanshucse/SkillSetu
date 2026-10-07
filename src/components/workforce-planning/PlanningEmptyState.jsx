import React from 'react';
import { CalendarCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';

export const PlanningEmptyState = ({
  title = 'No Planning Data Available',
  description = 'Configure your organization profile or calibrate scenario parameters to generate workforce projections.',
  onReset,
}) => {
  const { navigate } = useRouter();

  return (
    <div className="p-12 text-center rounded-2xl border border-surface-border bg-surface max-w-md mx-auto my-8 space-y-4">
      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center mx-auto">
        <CalendarCheck className="w-6 h-6" />
      </div>
      <h3 className="text-body font-bold text-charcoal-900">
        {title}
      </h3>
      <p className="text-xs text-charcoal-600 max-w-xs mx-auto">
        {description}
      </p>
      <div className="flex items-center justify-center gap-2 pt-2">
        {onReset && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Scenario</span>
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/organization/profile')}
          className="cursor-pointer"
        >
          <span>Workforce Profile</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

export default PlanningEmptyState;
