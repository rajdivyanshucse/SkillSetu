import React from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Clock, Users } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';

export const RoleRequirementCard = ({
  role,
  candidateMatchCount = 0,
  onSelectRole,
  className = '',
}) => {
  const { navigate } = useRouter();

  if (!role) return null;

  return (
    <div
      onClick={() => onSelectRole ? onSelectRole(role.id) : navigate(`/organization/talent/roles/${role.id}`)}
      className={`
        bg-surface border border-surface-border rounded-xl p-5 shadow-2xs hover:border-brand-300
        hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group
        ${className}
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center font-bold text-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-body-sm font-bold text-charcoal-900 group-hover:text-brand-700 transition-colors">
                {role.title}
              </h3>
              <span className="text-[11px] text-charcoal-500">
                {role.department} • {role.experience}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-canvas-subtle border border-surface-border text-charcoal-600">
            {role.workMode}
          </span>
        </div>

        <p className="text-xs text-charcoal-600 line-clamp-2 mb-3">
          {role.description}
        </p>

        {/* Required Skills */}
        <div className="space-y-1.5 pt-2 border-t border-surface-border/60">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
            Required Skills ({role.requiredSkills?.length || 0})
          </span>
          <div className="flex flex-wrap gap-1">
            {role.requiredSkills?.map((sk) => (
              <span
                key={sk}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-xs bg-brand-50 text-brand-800 border border-brand-200"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-border flex items-center justify-between">
        <span className="text-xs text-charcoal-500 flex items-center gap-1 font-medium">
          <Users className="w-3.5 h-3.5 text-brand-600" />
          <span>{candidateMatchCount} Matching Candidates</span>
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/organization/talent/roles/${role.id}`);
          }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Requirements</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RoleRequirementCard;
