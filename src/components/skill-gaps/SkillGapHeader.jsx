import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Target, ShieldCheck, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const SkillGapHeader = ({
  targetRole = 'Backend Software Engineer',
  onRoleChange,
  availableRoles = ['Backend Software Engineer', 'Software Engineer', 'Full Stack Developer'],
  completeness = 92,
  className = '',
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  return (
    <>
      <div
        className={`
          bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-subtle
          flex flex-col md:flex-row md:items-center justify-between gap-4
          ${className}
        `}
      >
        {/* Left: Title, subtitle & Target role */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
              <GitBranch className="w-3.5 h-3.5 text-brand-600" />
              <span>Skill Gap Calibration</span>
            </div>

            <span className="text-[11px] text-charcoal-400">
              Deterministic Capability Delta
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Skill Gap Analysis
          </h1>

          <p className="text-body-sm text-charcoal-600 max-w-xl">
            Understand which skills can strengthen your alignment with your target role.
          </p>
        </div>

        {/* Right: Active Target Role & Change Target button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0">
          <div className="p-2.5 px-3 rounded-lg bg-canvas-subtle border border-surface-border flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500">
                  Target Role
                </span>
                <span className="text-xs font-bold text-charcoal-900 truncate">
                  {targetRole}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRoleModalOpen(true)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 underline ml-2 cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-emerald-800">
              Profile Calibrated ({completeness}%)
            </span>
          </div>
        </div>
      </div>

      {/* Target Role Switcher Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title="Select Target Career Archetype"
        size="md"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-charcoal-600">
            Switching target archetypes recalculates skill requirement weights and gap priorities based on the chosen role's modeled benchmarks.
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableRoles.map((roleName) => {
              const isSelected = targetRole === roleName;
              return (
                <button
                  key={roleName}
                  type="button"
                  onClick={() => {
                    onRoleChange && onRoleChange(roleName);
                    setRoleModalOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all cursor-pointer
                    ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-300/40 font-bold text-brand-900'
                        : 'bg-surface border-surface-border hover:border-surface-border-strong text-charcoal-800'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-charcoal-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-body-sm font-semibold">{roleName}</span>
                  </div>

                  {isSelected && (
                    <Badge status="verified" size="sm">
                      Active
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SkillGapHeader;
