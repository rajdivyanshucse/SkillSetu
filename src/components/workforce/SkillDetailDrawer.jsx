import React, { useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  Lightbulb,
  BookOpen,
  UserPlus,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  calculateCoverageStatus,
  calculateSkillGap,
  calculateSkillPriority,
} from '../../utils/workforceIntelligence';
import { DEFAULT_TARGET_BENCHMARKS } from '../../data/workforceIntelligenceData';

export const SkillDetailDrawer = ({
  skillName,
  isOpen,
  onClose,
  orgData,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !skillName) return null;

  // Extract skill details from organization data
  const currentSkills = orgData?.currentSkills || [];
  const foundSkill = currentSkills.find(
    (s) => (typeof s === 'string' ? s : s.name).toLowerCase() === skillName.toLowerCase()
  );

  const coverage = typeof foundSkill === 'object' ? (foundSkill.coverage || foundSkill.percentage || 50) : 50;
  const level = typeof foundSkill === 'object' ? (foundSkill.level || 'Intermediate') : 'Intermediate';
  const category = typeof foundSkill === 'object' ? (foundSkill.category || 'Engineering Core') : 'Engineering Core';

  const futureSkillMatch = (orgData?.futureSkills || []).find(
    (f) => (typeof f === 'string' ? f : f.name || f.skill).toLowerCase() === skillName.toLowerCase()
  );

  const futureImportance = typeof futureSkillMatch === 'object'
    ? (futureSkillMatch.futureImportance || 'Critical')
    : futureSkillMatch ? 'Critical' : 'High';

  const horizon = typeof futureSkillMatch === 'object'
    ? (futureSkillMatch.horizon || '0–12 Months')
    : '0–12 Months';

  const gapInfo = calculateSkillGap(skillName, coverage);
  const statusInfo = calculateCoverageStatus(coverage);
  const priority = calculateSkillPriority(gapInfo.gapPoints, futureImportance);

  // Suggested potential action
  let suggestedAction = 'Upskill Internal Talent';
  let actionExplanation = 'Current coverage provides a base for structured skill-building programmes.';
  let actionBadgeColor = 'bg-brand-50 text-brand-700 border-brand-200';

  if (gapInfo.gapPoints > 30 && (futureImportance === 'Critical' || futureImportance === 'High')) {
    suggestedAction = 'Upskill + Strategic Hiring (Hybrid)';
    actionExplanation = 'Substantial coverage deficit combined with high strategic necessity calls for both fast-track internal cohorts and selective expert recruitment.';
    actionBadgeColor = 'bg-accent-50 text-accent-700 border-accent-200';
  } else if (gapInfo.gapPoints > 20 && coverage < 30) {
    suggestedAction = 'External Hiring & Specialist Acquisition';
    actionExplanation = 'Low internal workforce density suggests bringing in senior practitioners to mentor existing teams.';
    actionBadgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-charcoal-900/40 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-skill-title"
    >
      <div
        className="w-full max-w-lg bg-surface h-full shadow-modal border-l border-surface-border flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div>
          <div className="p-5 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur-xs z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                {skillName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 id="drawer-skill-title" className="text-heading-sm font-bold text-charcoal-900 leading-tight">
                  {skillName}
                </h2>
                <p className="text-body-xs text-charcoal-500">
                  {category} • Workforce Capability Deep-Dive
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
              aria-label="Close skill details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-canvas-subtle border border-surface-border">
                <span className="text-body-xs text-charcoal-500 block mb-1">Current Coverage</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-heading font-bold text-charcoal-900 font-mono">
                    {coverage}%
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-xs border ${statusInfo.badgeClass}`}>
                    {statusInfo.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-md bg-canvas-subtle border border-surface-border">
                <span className="text-body-xs text-charcoal-500 block mb-1">Target Benchmark</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-heading font-bold text-charcoal-900 font-mono">
                    {gapInfo.targetCoverage}%
                  </span>
                  <span className="text-[10px] font-bold text-charcoal-500">
                    Deficit: <strong className="text-danger-600">-{gapInfo.gapPoints}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Coverage Meter */}
            <div className="p-4 rounded-md border border-surface-border bg-surface">
              <div className="flex items-center justify-between text-body-xs mb-1.5">
                <span className="font-semibold text-charcoal-700">Capability Spread</span>
                <span className="text-charcoal-500 font-mono">{coverage}% of {gapInfo.targetCoverage}% Target</span>
              </div>
              <div className="w-full h-3 bg-canvas-muted rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${statusInfo.barColor} transition-all duration-300`}
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-mono">
                <span>0%</span>
                <span>Target: {gapInfo.targetCoverage}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Strategic Attributes */}
            <div className="p-4 rounded-md border border-surface-border bg-canvas-subtle/50 space-y-3">
              <h4 className="text-body-xs font-bold text-charcoal-900 uppercase tracking-wider">
                Strategic Attributes
              </h4>

              <div className="grid grid-cols-2 gap-3 text-body-xs">
                <div>
                  <span className="text-charcoal-500 block text-[11px]">Current Importance</span>
                  <span className="font-semibold text-charcoal-800">High Enterprise Demand</span>
                </div>
                <div>
                  <span className="text-charcoal-500 block text-[11px]">Future Importance</span>
                  <span className="font-semibold text-purple-700">{futureImportance}</span>
                </div>
                <div>
                  <span className="text-charcoal-500 block text-[11px]">Planning Horizon</span>
                  <span className="font-semibold text-charcoal-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                    {horizon}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-500 block text-[11px]">Gap Priority</span>
                  <span className="font-bold text-warning-700 font-mono">{priority} Priority</span>
                </div>
              </div>
            </div>

            {/* Potential Workforce Action */}
            <div className="p-4 rounded-md border border-surface-border bg-surface space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent-600" />
                <h4 className="text-body-xs font-bold text-charcoal-900 uppercase tracking-wider">
                  Potential Workforce Action Signal
                </h4>
              </div>

              <div className={`p-2.5 rounded-xs border ${actionBadgeColor} inline-block text-body-xs font-bold`}>
                {suggestedAction}
              </div>

              <p className="text-body-xs text-charcoal-600 leading-relaxed">
                {actionExplanation}
              </p>
            </div>

            {/* How this signal was derived */}
            <div className="p-4 rounded-md bg-canvas-subtle border border-surface-border text-body-xs space-y-2">
              <div className="flex items-center gap-1.5 text-charcoal-700 font-semibold">
                <Info className="w-4 h-4 text-brand-600 shrink-0" />
                <span>How This Signal Was Derived</span>
              </div>
              <p className="text-charcoal-600 text-[11px] leading-relaxed">
                SkillSetu combines your calibrated current coverage (<strong>{coverage}%</strong>) with enterprise target thresholds (<strong>{gapInfo.targetCoverage}%</strong>) and future capability horizons (<strong>{futureImportance}</strong>) to compute an objective gap score without subjective assumptions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-border bg-surface flex items-center justify-between">
          <span className="text-[11px] text-charcoal-400">
            Workforce Intelligence Signal
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close Inspection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailDrawer;
