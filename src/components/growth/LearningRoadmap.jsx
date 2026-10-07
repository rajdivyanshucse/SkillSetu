import React from 'react';
import { BookOpen, Code, Wrench, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LearningRoadmap = ({
  className = '',
}) => {
  const stages = [
    {
      step: 1,
      title: 'LEARN',
      subtitle: 'Conceptual Foundations',
      description: 'Master core architectural paradigms, design principles, and syntax semantics.',
      icon: <BookOpen className="w-4 h-4 text-brand-700" />,
      color: 'bg-brand-50 border-brand-200 text-brand-900',
    },
    {
      step: 2,
      title: 'PRACTICE',
      subtitle: 'Hands-on Labs',
      description: 'Execute targeted programming exercises, sandbox configuration, and error recovery drills.',
      icon: <Code className="w-4 h-4 text-blue-700" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
    {
      step: 3,
      title: 'BUILD',
      subtitle: 'Production Projects',
      description: 'Implement end-to-end repositories, deploy containerized services, and benchmark performance.',
      icon: <Wrench className="w-4 h-4 text-emerald-700" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      step: 4,
      title: 'VALIDATE',
      subtitle: 'Evidence Verification',
      description: 'Document architecture case studies, verify test coverage, and attain career milestones.',
      icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
      color: 'bg-purple-50 border-purple-200 text-purple-900',
    },
  ];

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="pb-3 border-b border-surface-border/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
            SkillSetu 4-Pillar Learning Framework
          </h3>
        </div>
        <p className="text-xs text-charcoal-500 mt-0.5">
          Progressive capability acquisition cycle applied across all career development tracks.
        </p>
      </div>

      {/* Grid of 4 Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st, idx) => (
          <div
            key={st.step}
            className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-2 ${st.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded bg-surface shadow-2xs border border-surface-border/60">
                  {st.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface/80 border border-surface-border/50">
                  Step 0{st.step}
                </span>
              </div>

              <h4 className="text-xs font-black tracking-wider uppercase">
                {st.title}
              </h4>
              <span className="text-[11px] font-semibold block mb-1 opacity-80">
                {st.subtitle}
              </span>

              <p className="text-[11px] leading-relaxed opacity-90">
                {st.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningRoadmap;
