import React from 'react';
import { BookOpen, Code2, Hammer, ShieldCheck, RotateCcw, CheckCircle2, Circle } from 'lucide-react';

/**
 * LearnPracticeBuildValidate Component
 * Signature SkillSetu 5-stage capability development workflow.
 * Highlight: BUILD stage produces project evidence; VALIDATE demonstrates proof; RE-EVALUATE triggers adaptive review.
 */
export const LearnPracticeBuildValidate = ({
  learnText = 'Understand core architecture and syntax principles.',
  practiceText = 'Execute coding exercises in local sandbox.',
  buildText = 'Construct a runnable project artifact producing portfolio evidence.',
  validateText = 'Attach implementation benchmark proof and verify capability.',
  reevaluateText = 'Reassess your demonstrable capability state upon evidence submission.',
  activities = [],
  className = '',
}) => {
  const stages = [
    {
      key: 'learn',
      title: 'LEARN',
      subtitle: 'Understand',
      icon: <BookOpen className="w-4 h-4 text-sky-700" />,
      bgClass: 'bg-sky-50/70 border-sky-200 text-sky-900',
      badgeClass: 'bg-sky-100 text-sky-800',
      text: learnText,
    },
    {
      key: 'practice',
      title: 'PRACTICE',
      subtitle: 'Apply',
      icon: <Code2 className="w-4 h-4 text-indigo-700" />,
      bgClass: 'bg-indigo-50/70 border-indigo-200 text-indigo-900',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      text: practiceText,
    },
    {
      key: 'build',
      title: 'BUILD',
      subtitle: 'Create Evidence',
      icon: <Hammer className="w-4 h-4 text-brand-700" />,
      bgClass: 'bg-brand-50 border-brand-200 text-brand-900',
      badgeClass: 'bg-brand-200 text-brand-900 font-bold',
      highlightBadge: 'Produces Project Evidence',
      text: buildText,
    },
    {
      key: 'validate',
      title: 'VALIDATE',
      subtitle: 'Demonstrate',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
      bgClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      text: validateText,
    },
    {
      key: 'reevaluate',
      title: 'RE-EVALUATE',
      subtitle: 'Adaptive Review',
      icon: <RotateCcw className="w-4 h-4 text-amber-800" />,
      bgClass: 'bg-amber-50/70 border-amber-200 text-amber-900',
      badgeClass: 'bg-amber-100 text-amber-900 font-medium',
      text: reevaluateText,
      isLoop: true,
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
          Development Pathway (LEARN → PRACTICE → BUILD → VALIDATE → RE-EVALUATE)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stages.map((stg) => {
          const matchedActivity = activities.find((a) => a.type?.toLowerCase() === stg.key);

          return (
            <div
              key={stg.key}
              className={`rounded-xl border p-4 flex flex-col justify-between ${stg.bgClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    {stg.icon}
                    <span className="text-xs font-bold tracking-wider">{stg.title}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${stg.badgeClass}`}>
                    {stg.subtitle}
                  </span>
                </div>

                {stg.highlightBadge && (
                  <span className="inline-block text-[9px] uppercase font-bold text-brand-800 bg-brand-100/90 px-1.5 py-0.5 rounded mb-2 border border-brand-300">
                    ★ {stg.highlightBadge}
                  </span>
                )}

                <p className="text-xs text-charcoal-700 leading-relaxed">
                  {matchedActivity?.title || stg.text}
                </p>
              </div>

              {matchedActivity ? (
                <div className="pt-3 mt-3 border-t border-black/10 flex items-center gap-1.5 text-[11px] font-medium">
                  {matchedActivity.completed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="text-emerald-800">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                      <span className="text-charcoal-600">Pending Action</span>
                    </>
                  )}
                </div>
              ) : stg.isLoop ? (
                <div className="pt-3 mt-3 border-t border-amber-300/60 text-[10px] text-amber-900 font-semibold">
                  ↻ State updates upon validation
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnPracticeBuildValidate;
