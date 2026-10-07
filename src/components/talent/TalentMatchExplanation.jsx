import React, { useEffect } from 'react';
import { X, Sparkles, Layers, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const TalentMatchExplanation = ({
  isOpen,
  onClose,
  candidateName = 'Candidate',
  roleTitle = 'Role',
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-title"
    >
      <div className="bg-surface border border-surface-border rounded-2xl max-w-lg w-full shadow-modal p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="explanation-title" className="text-body font-bold text-charcoal-900 leading-tight">
                How Compatibility Was Calculated
              </h3>
              <p className="text-[11px] text-charcoal-500">
                Evaluation methodology for {candidateName} vs {roleTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
            aria-label="Close calculation explanation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Formula */}
        <div className="p-4 rounded-xl bg-canvas-subtle border border-surface-border space-y-3 text-xs">
          <span className="text-[10px] uppercase font-bold text-charcoal-400 tracking-wider block">
            Weighted Mathematical Synthesis
          </span>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center p-2 rounded-md bg-surface border border-surface-border">
              <span className="text-charcoal-700 font-sans">Required Skill Coverage (45%)</span>
              <span className="font-bold text-charcoal-900">Direct role prerequisites</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-surface border border-surface-border">
              <span className="text-charcoal-700 font-sans">Preferred Skill Coverage (20%)</span>
              <span className="font-bold text-charcoal-900">Value-add technical depth</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-surface border border-surface-border">
              <span className="text-charcoal-700 font-sans">Role Alignment (20%)</span>
              <span className="font-bold text-charcoal-900">Target role match</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md bg-surface border border-surface-border">
              <span className="text-charcoal-700 font-sans">Experience Alignment (15%)</span>
              <span className="font-bold text-charcoal-900">Tenure baseline vs requirement</span>
            </div>
          </div>
        </div>

        {/* Strict Disclaimer Notice */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Decision Support Boundary</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Talent compatibility reflects alignment between configured role requirements and candidate profile attributes. It is not a hiring guarantee, selection probability, or assessment of absolute human potential.
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TalentMatchExplanation;
