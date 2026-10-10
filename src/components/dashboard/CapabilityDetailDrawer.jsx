import React from 'react';
import {
  X,
  ShieldCheck,
  FolderGit2,
  BookOpen,
  ExternalLink,
  Target,
  ArrowRight,
  GitBranch,
  Hammer,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import CapabilityStateBadge from '../ui/CapabilityStateBadge';
import LearnPracticeBuildValidate from '../roadmap/LearnPracticeBuildValidate';
import { useRouter } from '../../router/Router';

/**
 * CapabilityDetailDrawer Component
 * Provides complete evidence traceability and answers the 7 key capability questions:
 * 1. What is this capability?
 * 2. What is my current state?
 * 3. Why does SkillSetu classify it this way?
 * 4. What concrete evidence is attached?
 * 5. What does my target role require?
 * 6. What is missing?
 * 7. What should I do next? (Integrated LEARN -> PRACTICE -> BUILD -> VALIDATE breakdown)
 */
export const CapabilityDetailDrawer = ({
  isOpen = false,
  onClose,
  capability = null,
}) => {
  const { navigate } = useRouter();

  if (!capability) return null;

  const {
    name,
    category,
    currentProficiency,
    targetProficiency,
    targetRequirement,
    capabilityState,
    whyItMatters,
    whatToBuild = [],
    evidenceItems = [],
    attachedProjects = [],
    attachedCourses = [],
    roadmap = {},
    evidenceStrength,
    evidenceGap,
    recencyText,
    explanation = [],
  } = capability;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span>{name}</span>
          <CapabilityStateBadge state={capabilityState} size="sm" />
        </div>
      }
      size="lg"
    >
      <div className="space-y-6 pb-8">
        {/* 1. Overview & Classification Reason */}
        <section className="bg-canvas-subtle p-4 rounded-xl border border-surface-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            <span>Capability Classification Rationale</span>
            <span className="text-charcoal-400">{category}</span>
          </div>
          <p className="text-sm text-charcoal-800 leading-relaxed font-medium">
            {capabilityState?.description || 'Classified based on attached project evidence and profile status.'}
          </p>

          {explanation && explanation.length > 0 && (
            <div className="pt-2 border-t border-surface-border space-y-1">
              <span className="text-[11px] font-bold text-charcoal-600 block uppercase tracking-wider">Telemetry Diagnostic Signals:</span>
              <ul className="text-xs text-charcoal-700 space-y-0.5 list-disc list-inside">
                {explanation.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 2. Current State vs Target Role Benchmark */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-brand-600" />
            Proficiency & Benchmark Comparison
          </h4>
          <div className="grid grid-cols-2 gap-3 bg-surface p-4 rounded-xl border border-surface-border">
            <div className="space-y-1">
              <span className="text-xs text-charcoal-400 uppercase tracking-wider block">Your Demonstrated Level</span>
              <span className="text-base font-bold text-charcoal-900">{currentProficiency || 'Intermediate'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-charcoal-400 uppercase tracking-wider block">Target Role Benchmark</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-brand-800">{targetProficiency || 'Advanced'}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-700 font-bold rounded border border-brand-200">
                  {targetRequirement}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-surface rounded-lg border border-surface-border">
              <span className="text-[10px] text-charcoal-400 uppercase block font-semibold">Evidence Strength</span>
              <span className="font-bold text-charcoal-800">{evidenceStrength || 'Moderate'}</span>
            </div>
            <div className="p-2 bg-surface rounded-lg border border-surface-border">
              <span className="text-[10px] text-charcoal-400 uppercase block font-semibold">Evidence Gap</span>
              <span className="font-bold text-charcoal-800">{evidenceGap || 'None'}</span>
            </div>
            <div className="p-2 bg-surface rounded-lg border border-surface-border">
              <span className="text-[10px] text-charcoal-400 uppercase block font-semibold">Recency</span>
              <span className="font-bold text-charcoal-800">{recencyText || 'Recent'}</span>
            </div>
          </div>
          {whyItMatters && (
            <p className="text-xs text-charcoal-600 leading-relaxed pt-1">
              <strong>Role Context:</strong> {whyItMatters}
            </p>
          )}
        </section>

        {/* 3. Attached Verifiable Evidence */}
        <section className="space-y-3">
          <h4 className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
            Attached Project & Workplace Evidence ({evidenceItems.length || attachedProjects.length})
          </h4>

          {evidenceItems.length > 0 ? (
            <div className="space-y-2.5">
              {evidenceItems.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-surface p-3.5 rounded-xl border border-surface-border hover:border-surface-border-strong space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-charcoal-900">{ev.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-200">
                          {ev.type || 'Project'}
                        </span>
                        {ev.evidenceStrength && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-canvas-subtle text-charcoal-600 font-medium rounded border border-surface-border">
                            {ev.evidenceStrength} Strength
                          </span>
                        )}
                      </div>
                      {ev.role && <span className="text-xs text-charcoal-500">{ev.role}</span>}
                    </div>
                  </div>
                  {ev.description && <p className="text-xs text-charcoal-600">{ev.description}</p>}
                </div>
              ))}
            </div>
          ) : attachedProjects.length > 0 ? (
            <div className="space-y-2.5">
              {attachedProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface p-3.5 rounded-xl border border-surface-border hover:border-surface-border-strong space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-charcoal-900">{p.name}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-200">
                          {p.status}
                        </span>
                      </div>
                      <span className="text-xs text-charcoal-500">{p.role}</span>
                    </div>
                    {p.evidenceUrl && (
                      <a
                        href={p.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-700 hover:text-brand-900 p-1 flex items-center gap-1 text-xs font-medium"
                      >
                        <span>Spec</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-charcoal-600">{p.description}</p>
                  {p.metrics && (
                    <div className="text-[11px] text-charcoal-700 bg-canvas-subtle px-2.5 py-1 rounded border border-surface-border">
                      <strong>Observed Benchmark:</strong> {p.metrics}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                No direct project or experience evidence attached to this capability yet.
              </div>
              <p className="text-amber-800">
                To move this capability from <em>{capabilityState?.label}</em> to <em>Demonstrated</em>, attach a project implementation artifact or verifiable workplace experience demonstrating real-world usage.
              </p>
            </div>
          )}
        </section>

        {/* 4. Concrete What To Build & Implement */}
        {whatToBuild && whatToBuild.length > 0 && (
          <section className="space-y-2.5">
            <h4 className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-brand-600" />
              Evidence Creation Checklist (What to Build)
            </h4>
            <div className="bg-surface p-3.5 rounded-xl border border-surface-border space-y-2">
              {whatToBuild.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-charcoal-700">
                  <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Development Pathway Pipeline (LEARN -> PRACTICE -> BUILD -> VALIDATE) */}
        <section className="space-y-3 pt-2">
          <LearnPracticeBuildValidate
            learnText={roadmap.learn || `Review advanced ${name} concepts and architectural patterns.`}
            practiceText={roadmap.practice || `Write clean, tested ${name} micro-components in sandbox.`}
            buildText={roadmap.build || `Construct an end-to-end service utilizing ${name} to produce project evidence.`}
            validateText={roadmap.validate || `Benchmark execution and attach repository to your portfolio.`}
            activities={roadmap.activities || []}
          />
        </section>

        {/* 6. Footer Actions */}
        <div className="pt-4 border-t border-surface-border flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/dashboard/career-roadmap');
            }}
            className="text-xs font-semibold"
          >
            View on Roadmap
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              navigate('/dashboard/growth');
            }}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Attach Project Proof</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CapabilityDetailDrawer;
