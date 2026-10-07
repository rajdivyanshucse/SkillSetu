import React from 'react';
import { Clock, CheckCircle2, CircleDot, Sparkles, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { roadmapMilestones } from '../../data/workforcePlanningData';

export const WorkforceRoadmap = ({
  milestones = roadmapMilestones,
  scenarioName = 'Growth',
  className = '',
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-brand-800 bg-brand-50 border-brand-200';
      case 'Planned':
        return 'text-charcoal-700 bg-canvas-subtle border-surface-border';
      default:
        return 'text-purple-800 bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Roadmap Timeline Cards */}
      <div className="space-y-4">
        {milestones.map((ms, idx) => (
          <div
            key={ms.stage}
            className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-3 relative overflow-hidden"
          >
            {/* Stage Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-charcoal-900">
                      {ms.title}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadge(ms.status)}`}>
                      {ms.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-700 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    Horizon: {ms.stage}
                  </span>
                </div>
              </div>

              <span className="text-xs text-charcoal-500 font-medium">
                Phase Objective
              </span>
            </div>

            {/* Objective & Actions */}
            <div className="space-y-2">
              <p className="text-xs text-charcoal-700 font-semibold leading-relaxed">
                Objective: <span className="font-normal text-charcoal-600">{ms.objective}</span>
              </p>

              <div className="p-3.5 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                  Actionable Strategic Vectors
                </span>
                <ul className="space-y-1.5 text-xs text-charcoal-700">
                  {ms.actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CircleDot className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-1">
                <span>Key Dependency: <strong className="text-charcoal-800">{ms.dependencies}</strong></span>
                <span className="font-mono text-charcoal-400">Milestone {idx + 1} of 5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkforceRoadmap;
