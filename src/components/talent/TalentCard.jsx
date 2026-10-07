import React from 'react';
import {
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  ArrowRight,
  GitCompare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { calculateTalentCompatibility, getMatchingSkills } from '../../utils/talentMatching';
import { ShortlistButton } from './ShortlistButton';
import { STORAGE_KEY_TALENT_COMPARE } from '../../data/talentData';
import { useToast } from '../ui/Toast';

export const TalentCard = ({
  candidate,
  role,
  shortlist = [],
  onToggleShortlist,
  compareList = [],
  onToggleCompare,
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  if (!candidate || !role) return null;

  const compatibility = calculateTalentCompatibility(candidate, role);
  const { strongMatches, developmentAreas } = getMatchingSkills(candidate, role);
  const isCompared = compareList.includes(candidate.id);

  const getScoreBadge = (score) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (score >= 65) return 'bg-brand-50 text-brand-800 border-brand-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    let updated;
    if (isCompared) {
      updated = compareList.filter((id) => id !== candidate.id);
      addToast({
        title: 'Removed from Comparison',
        message: `${candidate.name} was removed from the comparison matrix.`,
        type: 'info',
        duration: 2500,
      });
    } else {
      if (compareList.length >= 4) {
        addToast({
          title: 'Comparison Limit Reached',
          message: 'Comparison supports up to 4 candidates simultaneously.',
          type: 'warning',
          duration: 3500,
        });
        return;
      }
      updated = [...compareList, candidate.id];
      addToast({
        title: 'Added to Comparison',
        message: `${candidate.name} is ready for side-by-side comparison.`,
        type: 'success',
        duration: 2500,
      });
    }

    try {
      localStorage.setItem(STORAGE_KEY_TALENT_COMPARE, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist comparison list:', err);
    }

    if (onToggleCompare) {
      onToggleCompare(updated);
    }
  };

  return (
    <div
      onClick={() => navigate(`/organization/talent/${candidate.id}`)}
      className={`
        bg-surface border border-surface-border rounded-xl p-5 shadow-2xs hover:border-brand-300
        hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group
        ${isCompared ? 'ring-2 ring-brand-500/40 border-brand-300' : ''}
        ${className}
      `}
    >
      {/* Header & Compatibility Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {candidate.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-body-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
                {candidate.name}
              </h3>
              <p className="text-xs text-charcoal-500 line-clamp-1">
                {candidate.headline}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${getScoreBadge(
                compatibility.overallCompatibility
              )}`}
            >
              <Sparkles className="w-3 h-3" />
              {compatibility.overallCompatibility}% Match
            </span>
            <span className="text-[10px] text-charcoal-400 font-medium mt-0.5">
              Role Alignment
            </span>
          </div>
        </div>

        {/* Metadata Pills */}
        <div className="flex items-center gap-3 text-xs text-charcoal-500 flex-wrap pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
            {candidate.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-charcoal-400" />
            {candidate.experienceYears}y Exp ({candidate.workMode})
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-charcoal-700">
            <Clock className="w-3.5 h-3.5 text-charcoal-400" />
            {candidate.availability}
          </span>
        </div>
      </div>

      {/* Skills & Match Breakdown */}
      <div className="space-y-3 pt-2 border-t border-surface-border/60">
        {/* Matching Skills */}
        <div>
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1.5">
            Strong Matching Competencies ({strongMatches.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {strongMatches.slice(0, 4).map((sk) => (
              <span
                key={sk.name}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                {sk.name}
              </span>
            ))}
            {strongMatches.length > 4 && (
              <span className="text-[10px] text-charcoal-500 px-1.5 py-0.5 font-medium">
                +{strongMatches.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Development Areas */}
        {developmentAreas.length > 0 && (
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1.5">
              Candidate Development Areas ({developmentAreas.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {developmentAreas.slice(0, 3).map((da) => (
                <span
                  key={da.name}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-xs bg-canvas-subtle text-charcoal-600 border border-surface-border flex items-center gap-1"
                >
                  <AlertCircle className="w-2.5 h-2.5 text-amber-500" />
                  {da.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="pt-3 border-t border-surface-border flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <ShortlistButton
            candidateId={candidate.id}
            candidateName={candidate.name}
            shortlist={shortlist}
            onToggleShortlist={onToggleShortlist}
            size="sm"
          />

          <button
            type="button"
            onClick={handleToggleCompare}
            className={`
              text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-colors cursor-pointer
              ${
                isCompared
                  ? 'bg-brand-50 text-brand-800 border-brand-300 hover:bg-brand-100'
                  : 'bg-surface text-charcoal-600 border-surface-border hover:bg-canvas-subtle hover:text-charcoal-900'
              }
            `}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/organization/talent/${candidate.id}`)}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors cursor-pointer group/link"
        >
          <span>Profile</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default TalentCard;
