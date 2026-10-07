import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SaveOpportunityButton } from './SaveOpportunityButton';

export const OpportunityCard = ({
  opportunity,
  isSaved = false,
  onToggleSave,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!opportunity) return null;

  const {
    id,
    title,
    company,
    companyLogo,
    location,
    workMode,
    experience,
    salary,
    category,
    compatibility,
    matchingSkills = [],
    developmentAreas = [],
    postedDaysAgo,
    isFeatured,
  } = opportunity;

  const handleCardClick = () => {
    navigate(`/dashboard/jobs/${id}`);
  };

  const getCompatibilityColor = (score) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-brand-700 bg-brand-50 border-brand-200';
    return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  };

  const getCompatibilityBarColor = (score) => {
    if (score >= 85) return 'bg-emerald-600';
    if (score >= 75) return 'bg-brand-600';
    return 'bg-indigo-600';
  };

  return (
    <Card
      className={`
        relative p-5 transition-all duration-200 hover:shadow-md hover:border-surface-border-strong
        flex flex-col justify-between space-y-4 cursor-pointer group bg-surface
        ${isFeatured ? 'border-brand-300 ring-1 ring-brand-100' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Top Header: Company, Title & Save Button */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-canvas-subtle border border-surface-border text-brand-800 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs group-hover:border-brand-300 transition-colors">
              {companyLogo || company.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-charcoal-600 truncate">
                  {company}
                </span>
                {isFeatured && (
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded-xs border border-brand-200">
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="text-body-md font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors truncate">
                {title}
              </h3>
            </div>
          </div>

          <SaveOpportunityButton
            jobId={id}
            isSaved={isSaved}
            onToggle={onToggleSave}
            size="sm"
          />
        </div>

        {/* Metadata Pills: Location • Work Mode • Experience • Salary */}
        <div className="flex items-center flex-wrap gap-y-1.5 gap-x-2 mt-3 text-xs text-charcoal-600 font-medium">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
            {location}
          </span>
          <span className="text-charcoal-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
            {workMode}
          </span>
          <span className="text-charcoal-300">•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            {experience}
          </span>
          <span className="text-charcoal-300">•</span>
          <span className="font-bold text-charcoal-900">{salary}</span>
        </div>
      </div>

      {/* Compatibility Metric & Skill Highlights */}
      <div className="pt-3 border-t border-surface-border space-y-3">
        {/* Compatibility Gauge */}
        <div className="p-2.5 rounded-lg bg-canvas-subtle/70 border border-surface-border space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700">
                Profile Compatibility
              </span>
            </div>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-xs border ${getCompatibilityColor(
                compatibility
              )}`}
            >
              {compatibility}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${getCompatibilityBarColor(
                compatibility
              )}`}
              style={{ width: `${compatibility}%` }}
            />
          </div>

          <p className="text-[10px] text-charcoal-500 leading-tight">
            Based on your current profile and opportunity requirements.
          </p>
        </div>

        {/* Matching Skills & Development Areas */}
        <div className="space-y-2 text-xs">
          {/* Matching Skills */}
          {matchingSkills.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
                Matching Competencies:
              </span>
              <div className="flex items-center flex-wrap gap-1">
                {matchingSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Development Areas */}
          {developmentAreas.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
                Development Areas:
              </span>
              <div className="flex items-center flex-wrap gap-1">
                {developmentAreas.map((area) => (
                  <span
                    key={typeof area === 'string' ? area : area.name}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-xs bg-brand-50 text-brand-800 border border-brand-200/70"
                  >
                    <AlertCircle className="w-3 h-3 text-brand-600 shrink-0" />
                    {typeof area === 'string' ? area : area.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Posted timestamp & CTA */}
      <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
        <span>
          Posted {postedDaysAgo === 0 ? 'today' : `${postedDaysAgo}d ago`}
        </span>

        <Button
          variant="outline"
          size="xs"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/jobs/${id}`);
          }}
          className="group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-600 transition-colors"
        >
          View Opportunity
        </Button>
      </div>
    </Card>
  );
};

export default OpportunityCard;
