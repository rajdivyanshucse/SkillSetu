import React from 'react';
import { motion } from 'framer-motion';
import { Layers, FolderGit2, BookOpen, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import CapabilityStateBadge from './CapabilityStateBadge';
import Button from './Button';
import Tooltip from './Tooltip';

/**
 * Reusable CapabilityCard Component
 * Presents a single capability with its current proficiency, target requirement,
 * evidence composition chips, state badge, and actionable drill-down.
 */
export const CapabilityCard = ({
  capability,
  onSelect,
  className = '',
}) => {
  if (!capability) return null;

  const {
    name,
    category,
    currentProficiency = 'Intermediate',
    targetProficiency = 'Advanced',
    targetRequirement = 'REQUIRED',
    capabilityState,
    evidenceItems = [],
    evidenceCount = 0,
    attachedProjects = [],
    attachedCourses = [],
  } = capability;

  const projectCount = attachedProjects.length;
  const courseCount = attachedCourses.length;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`bg-surface border border-surface-border rounded-xl p-5 shadow-xs hover:border-surface-border-strong hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header: Category & State Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
            {category}
          </span>
          <CapabilityStateBadge state={capabilityState} size="sm" />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-charcoal-900 mb-2">{name}</h3>

        {/* Current vs Target Proficiency Comparison */}
        <div className="bg-canvas-subtle/70 rounded-lg p-3 mb-3.5 border border-surface-border/60">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase tracking-wider mb-0.5">Current</span>
              <span className="font-semibold text-charcoal-800">{currentProficiency}</span>
            </div>
            <div>
              <span className="text-charcoal-400 block text-[10px] uppercase tracking-wider mb-0.5">Target</span>
              <span className="font-semibold text-charcoal-800 flex items-center gap-1">
                {targetProficiency}
                {targetRequirement === 'REQUIRED' && (
                  <span className="text-[9px] px-1 py-0.2 bg-brand-50 text-brand-700 font-bold rounded">REQ</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Composition */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider block mb-1.5">
            Supporting Evidence
          </span>
          {evidenceCount > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {projectCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-canvas text-charcoal-700 text-[11px] font-medium rounded-md border border-surface-border">
                  <FolderGit2 className="w-3 h-3 text-brand-600" />
                  Project ×{projectCount}
                </span>
              )}
              {courseCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-canvas text-charcoal-700 text-[11px] font-medium rounded-md border border-surface-border">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  Learning ×{courseCount}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-charcoal-400 italic flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              No implementation evidence attached
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between">
        <span className="text-[11px] text-charcoal-500 font-medium">
          {capabilityState?.key === 'DEMONSTRATED'
            ? 'Evidence Verified'
            : capabilityState?.key === 'EVIDENCE_NEEDED'
            ? 'Evidence Needed'
            : 'In Progress'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect && onSelect(capability)}
          className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:bg-brand-50 p-1.5 h-auto flex items-center gap-1"
        >
          <span>Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CapabilityCard;
