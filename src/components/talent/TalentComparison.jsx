import React from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { calculateTalentCompatibility, getMatchingSkills } from '../../utils/talentMatching';
import { Button } from '../ui/Button';

export const TalentComparison = ({
  candidates = [],
  role,
  onRemoveCandidate,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (candidates.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-surface-border bg-surface max-w-lg mx-auto my-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-body font-bold text-charcoal-900">
          No Candidates Selected for Comparison
        </h3>
        <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
          Select 2 to 4 candidates from the Talent Discovery or Shortlist pages to view their side-by-side capability alignment matrix.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/organization/talent')}
          className="cursor-pointer"
        >
          <span>Explore Talent Pool</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Disclaimer Banner */}
      <div className="p-3 rounded-xl bg-canvas-subtle border border-surface-border flex items-center justify-between text-xs text-charcoal-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            <strong>Side-by-Side Evaluation:</strong> Metrics are displayed neutrally to support multi-dimensional candidate evaluation without prescriptive ranking.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
          {candidates.length} of 4 Max
        </span>
      </div>

      {/* Comparison Table / Matrix */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-surface-border bg-canvas-subtle/70">
                <th className="p-4 text-[11px] font-bold uppercase tracking-wider text-charcoal-500 w-44">
                  Evaluation Vector
                </th>
                {candidates.map((c) => (
                  <th key={c.id} className="p-4 min-w-[200px] border-l border-surface-border">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-body-sm font-bold text-charcoal-900">
                          {c.name}
                        </h4>
                        <span className="text-[11px] text-charcoal-500 font-normal line-clamp-1">
                          {c.headline}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveCandidate && onRemoveCandidate(c.id)}
                        className="p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-canvas-muted rounded-md transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
              {/* Overall Compatibility */}
              <tr className="bg-brand-50/20">
                <td className="p-4 font-bold text-charcoal-900">
                  Talent Compatibility
                </td>
                {candidates.map((c) => {
                  const comp = calculateTalentCompatibility(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border font-mono">
                      <span className="text-base font-black text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-md">
                        {comp.overallCompatibility}%
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Required Skill Coverage */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Required Skill Fit
                </td>
                {candidates.map((c) => {
                  const comp = calculateTalentCompatibility(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border font-mono font-bold text-charcoal-900">
                      {comp.requiredSkillFit}%
                    </td>
                  );
                })}
              </tr>

              {/* Preferred Skill Coverage */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Preferred Skill Fit
                </td>
                {candidates.map((c) => {
                  const comp = calculateTalentCompatibility(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border font-mono text-charcoal-800">
                      {comp.preferredSkillFit}%
                    </td>
                  );
                })}
              </tr>

              {/* Role Alignment */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Role Alignment
                </td>
                {candidates.map((c) => {
                  const comp = calculateTalentCompatibility(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border font-mono text-charcoal-800">
                      {comp.roleAlignment}%
                    </td>
                  );
                })}
              </tr>

              {/* Experience */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Experience
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-4 border-l border-surface-border">
                    <span className="font-semibold text-charcoal-900">{c.experienceYears} Years</span>
                    <span className="text-[11px] text-charcoal-500 block">({c.education.split(',')[0]})</span>
                  </td>
                ))}
              </tr>

              {/* Availability & Mode */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Availability & Mode
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-4 border-l border-surface-border">
                    <span className="font-semibold text-charcoal-900">{c.availability}</span>
                    <span className="text-[11px] text-charcoal-500 block">{c.location} • {c.workMode}</span>
                  </td>
                ))}
              </tr>

              {/* Matching Skills */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Strong Matches
                </td>
                {candidates.map((c) => {
                  const { strongMatches } = getMatchingSkills(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border">
                      <div className="flex flex-wrap gap-1">
                        {strongMatches.map((sk) => (
                          <span
                            key={sk.name}
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Development Areas */}
              <tr>
                <td className="p-4 font-semibold text-charcoal-700">
                  Development Areas
                </td>
                {candidates.map((c) => {
                  const { developmentAreas } = getMatchingSkills(c, role);
                  return (
                    <td key={c.id} className="p-4 border-l border-surface-border">
                      <div className="flex flex-wrap gap-1">
                        {developmentAreas.map((da) => (
                          <span
                            key={da.name}
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded-xs bg-canvas-subtle text-charcoal-600 border border-surface-border"
                          >
                            {da.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Detail Page Links */}
              <tr className="bg-canvas-subtle/40">
                <td className="p-4 font-semibold text-charcoal-500">
                  Action
                </td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-4 border-l border-surface-border">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigate(`/organization/talent/${c.id}`)}
                      className="cursor-pointer"
                    >
                      <span>Full Profile</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TalentComparison;
