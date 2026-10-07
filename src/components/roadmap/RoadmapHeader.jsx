import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Compass, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

export const RoadmapHeader = ({
  targetRole = 'Backend Software Engineer',
  overallProgress = 18,
  currentFocusSkill = 'AWS Cloud Fundamentals',
  onRoleChange,
  availableRoles = ['Backend Software Engineer', 'Software Engineer', 'Full Stack Developer'],
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
        {/* Left: Heading & Subtitle */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Personalized Development Plan</span>
            </div>

            <span className="text-[11px] text-charcoal-400">
              Target: {targetRole}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Your Career Roadmap
          </h1>

          <p className="text-body-sm text-charcoal-600 max-w-xl leading-relaxed">
            A personalized development path based on your current skills, target role and priority gaps.
          </p>
        </div>

        {/* Right: Quick Progress & Role Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0">
          <div className="p-2.5 px-3.5 rounded-lg bg-canvas-subtle border border-surface-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-extrabold text-xs shrink-0">
              {overallProgress}%
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500">
                Roadmap Progress
              </span>
              <span className="text-xs font-bold text-charcoal-900 truncate">
                Active Focus: {currentFocusSkill?.name || currentFocusSkill}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setRoleModalOpen(true)}
            className="shrink-0"
          >
            Change Target Role
          </Button>
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
            Switching target archetypes re-sequences stages, priorities, and project recommendations to align with the chosen role's core requirements.
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

export default RoadmapHeader;
