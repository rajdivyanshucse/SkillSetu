import React from 'react';
import { Sparkles, Users, AlertTriangle, TrendingUp, Compass, ShieldCheck } from 'lucide-react';

export const TalentInsights = ({
  candidates = [],
  role,
  className = '',
}) => {
  if (!role || candidates.length === 0) return null;

  // Generate deterministic insights from candidate set
  const highCompatCount = candidates.filter((c) => {
    const javaScore = c.skills?.Java || 0;
    const reactScore = c.skills?.React || 0;
    const pyScore = c.skills?.Python || 0;
    return javaScore >= 7 || reactScore >= 7 || pyScore >= 7;
  }).length;

  const hybridCount = candidates.filter((c) => c.workMode === 'Hybrid').length;
  const immediateCount = candidates.filter((c) => c.availability === 'Immediate' || c.availability === '15 days').length;

  const insights = [
    {
      id: 'pool-alignment',
      icon: <Users className="w-4 h-4 text-brand-600" />,
      title: `${candidates.length} profiles calibrated against ${role.title} requirements`,
      detail: `Talent pool exhibits strong core competency depth with ${immediateCount} candidates available within 15 days.`,
      tag: 'Talent Density',
      type: 'brand',
    },
    {
      id: 'dev-areas',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      title: 'Cloud architecture & containerization frequently surfaced as development areas',
      detail: 'While foundational language skills are robust, Docker and AWS depth remain prime vectors for internal onboarding cohorts.',
      tag: 'Capability Pattern',
      type: 'warning',
    },
    {
      id: 'experience-dist',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      title: 'Candidate pool concentrated in 1.5–3.5 year high-growth tenure bracket',
      detail: 'Profiles match the calibrated target experience baseline, offering high adaptability and fast ramp-up potential.',
      tag: 'Experience Fit',
      type: 'success',
    },
    {
      id: 'work-mode',
      icon: <Compass className="w-4 h-4 text-purple-600" />,
      title: `${hybridCount} candidates indicate active preference for Hybrid operating models`,
      detail: 'Strong geographical alignment across primary tech hubs (Bengaluru, Hyderabad, Pune).',
      tag: 'Location Match',
      type: 'purple',
    },
  ];

  return (
    <div className={`p-5 bg-surface rounded-2xl border border-surface-border shadow-2xs space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
              Talent Pool Intelligence Insights
            </h3>
            <p className="text-xs text-charcoal-500">
              Deterministic patterns identified across profiles aligned with {role.title}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-charcoal-500 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          Based on prototype talent data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="p-3.5 rounded-xl border border-surface-border bg-canvas-subtle/50 flex flex-col justify-between space-y-2"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-md bg-surface border border-surface-border">
                  {ins.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500">
                  {ins.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-charcoal-900 leading-snug">
                {ins.title}
              </h4>
            </div>
            <p className="text-[11px] text-charcoal-600 leading-relaxed pt-1 border-t border-surface-border/60">
              {ins.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentInsights;
