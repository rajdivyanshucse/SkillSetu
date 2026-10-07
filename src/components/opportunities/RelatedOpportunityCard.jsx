import React from 'react';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const RelatedOpportunityCard = ({ opportunity, className = '' }) => {
  const { navigate } = useRouter();

  if (!opportunity) return null;

  const { id, title, company, location, workMode, compatibility, salary } = opportunity;

  return (
    <Card
      className={`p-3.5 hover:border-surface-border-strong hover:shadow-xs transition-all cursor-pointer bg-surface space-y-2.5 ${className}`}
      onClick={() => navigate(`/dashboard/jobs/${id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold text-charcoal-500 block truncate">
            {company}
          </span>
          <h4 className="text-body-sm font-bold text-charcoal-900 truncate hover:text-brand-700 transition-colors">
            {title}
          </h4>
        </div>

        <span className="font-mono text-xs font-black text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-xs border border-brand-200 shrink-0">
          {compatibility}%
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] text-charcoal-600 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate">{location}</span>
          <span className="text-charcoal-300">•</span>
          <span className="shrink-0">{workMode}</span>
        </div>
        <span className="font-bold text-charcoal-900 shrink-0 ml-1">{salary}</span>
      </div>
    </Card>
  );
};

export default RelatedOpportunityCard;
