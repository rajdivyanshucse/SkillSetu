import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Layers } from 'lucide-react';

export const CandidateSkillMatrix = ({
  candidate,
  role,
  className = '',
}) => {
  if (!candidate || !role) return null;

  const candidateSkills = candidate.skills || {};

  const allSkills = [
    ...(role.requiredSkills || []).map((s) => ({
      name: s,
      type: 'Required',
      weight: 'Essential Core',
      isRequired: true,
    })),
    ...(role.preferredSkills || []).map((s) => ({
      name: s,
      type: 'Preferred',
      weight: 'Value-Add',
      isRequired: false,
    })),
  ];

  const getProficiencyText = (score) => {
    if (score >= 8) return 'Advanced (8-10)';
    if (score >= 6) return 'Intermediate (6-7)';
    if (score >= 4) return 'Developing (4-5)';
    if (score > 0) return 'Beginner (1-3)';
    return 'Not Specified';
  };

  const getAlignmentBadge = (score, isRequired) => {
    if (score >= 7) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Aligned Match
        </span>
      );
    }
    if (score >= 4) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3 text-brand-600" />
          Partial Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
        <AlertCircle className="w-3 h-3 text-amber-600" />
        {isRequired ? 'Core Development Area' : 'Growth Area'}
      </span>
    );
  };

  return (
    <div className={`bg-surface rounded-2xl border border-surface-border shadow-2xs overflow-hidden space-y-3 ${className}`}>
      <div className="p-4 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-charcoal-900 leading-tight">
              Role Requirement Compatibility Matrix
            </h4>
            <span className="text-[11px] text-charcoal-500">
              Granular side-by-side comparison across role prerequisites
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-charcoal-700 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          {allSkills.length} Criteria
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-canvas-subtle/60 text-charcoal-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">Role Requirement</th>
              <th className="py-2.5 px-4">Requirement Type</th>
              <th className="py-2.5 px-4">Candidate Evidence / Level</th>
              <th className="py-2.5 px-4 text-right">Alignment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
            {allSkills.map((sk) => {
              const score = candidateSkills[sk.name] || 0;
              return (
                <tr key={sk.name} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-charcoal-900">
                    {sk.name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                        sk.isRequired
                          ? 'bg-brand-50 text-brand-800 border-brand-200'
                          : 'bg-canvas text-charcoal-600 border-surface-border'
                      }`}
                    >
                      {sk.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-charcoal-900">
                        {score > 0 ? `${score}/10` : '—'}
                      </span>
                      <span className="text-charcoal-500 text-[11px]">
                        ({getProficiencyText(score)})
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {getAlignmentBadge(score, sk.isRequired)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateSkillMatrix;
