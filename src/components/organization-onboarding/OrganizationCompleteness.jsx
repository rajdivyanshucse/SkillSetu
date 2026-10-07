import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const OrganizationCompleteness = ({ completeness = 85, className = '' }) => {
  return (
    <Card className={`p-5 bg-surface border border-brand-200 shadow-subtle space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Profile Completeness Score
            </h3>
            <span className="text-[11px] text-charcoal-500">
              Calculated dynamically from your organizational inputs
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-brand-700 leading-none">
            {completeness}%
          </span>
        </div>
      </div>

      <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${completeness}%` }}
        />
      </div>

      <p className="text-[11px] text-charcoal-500 leading-relaxed">
        A complete profile enables accurate workforce capability modeling, talent gap analysis, and future skills planning across your departments.
      </p>
    </Card>
  );
};

export default OrganizationCompleteness;
