import React from 'react';
import { Briefcase, ChevronDown, Sparkles } from 'lucide-react';
import { talentRoles, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';

export const TargetRoleSelector = ({
  selectedRoleId,
  onSelectRole,
  className = '',
}) => {
  const currentRole = talentRoles.find((r) => r.id === selectedRoleId) || talentRoles[0];

  const handleRoleChange = (roleId) => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_TALENT_ROLE, roleId);
    } catch (e) {
      console.warn('Failed to save selected role to localStorage:', e);
    }
    if (onSelectRole) {
      onSelectRole(roleId);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-surface-border shadow-2xs ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-xs">
              Target Role Alignment
            </span>
            <span className="text-xs text-charcoal-400">•</span>
            <span className="text-xs font-semibold text-charcoal-500">
              {currentRole.department}
            </span>
          </div>
          <h3 className="text-body font-bold text-charcoal-900 tracking-tight mt-0.5">
            {currentRole.title}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="target-role-select" className="text-xs font-semibold text-charcoal-500 shrink-0">
          Active Role:
        </label>
        <div className="relative min-w-[220px]">
          <select
            id="target-role-select"
            value={currentRole.id}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-xs font-semibold text-charcoal-800 bg-canvas-subtle border border-surface-border rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-hidden focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            {talentRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title} ({role.experience})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-charcoal-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TargetRoleSelector;
