import React from 'react';
import { Target, ArrowRight, BookOpen, RefreshCw, UserPlus, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from '../../router/Router';

export const DevelopmentPriorities = ({
  strategicPriorities = [],
  hiringPlan = {},
  trainingFocus = [],
}) => {
  const { navigate } = useRouter();

  // Standardize development priorities from onboarding data
  const defaultFocusItems = [
    {
      type: 'Upskill',
      title: 'Upskill Existing Engineering Teams',
      priority: 'High',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-brand-50 text-brand-700 border-brand-200',
      reason: 'Prioritizing internal mobility and accelerating modern stack proficiency for current engineers.',
      timeline: 'Next 6 months',
    },
    {
      type: 'Hire',
      title: 'Strategic External Hiring for Cloud & AI',
      priority: 'High',
      icon: <UserPlus className="w-4 h-4" />,
      color: 'bg-accent-50 text-accent-700 border-accent-200',
      reason: 'Targeting experienced senior talent to bridge specialized architecture and infrastructure gaps.',
      timeline: 'Immediate Q3/Q4',
    },
    {
      type: 'Reskill',
      title: 'Reskill Legacy Maintenance Resources',
      priority: 'Medium',
      icon: <RefreshCw className="w-4 h-4" />,
      color: 'bg-warning-50 text-warning-700 border-warning-200',
      reason: 'Transitioning support personnel toward cloud operations and data engineering fundamentals.',
      timeline: '6–12 months',
    },
    {
      type: 'Hybrid',
      title: 'Blended Cohort Upskilling + Mentorship',
      priority: 'High',
      icon: <Layers className="w-4 h-4" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      reason: 'Pairing incoming subject-matter experts with internal squads for knowledge transfer.',
      timeline: 'Continuous',
    },
  ];

  // Derive customized items if strategicPriorities are provided
  const items = (strategicPriorities.length > 0)
    ? strategicPriorities.map((sp, idx) => {
        const text = typeof sp === 'string' ? sp : sp.name || sp.title;
        const isHire = text.toLowerCase().includes('hir') || text.toLowerCase().includes('talent');
        const isReskill = text.toLowerCase().includes('reskill') || text.toLowerCase().includes('transit');
        const isHybrid = text.toLowerCase().includes('hybrid') || text.toLowerCase().includes('partner');

        let type = 'Upskill';
        let icon = <BookOpen className="w-4 h-4" />;
        let color = 'bg-brand-50 text-brand-700 border-brand-200';

        if (isHire) {
          type = 'Hire';
          icon = <UserPlus className="w-4 h-4" />;
          color = 'bg-accent-50 text-accent-700 border-accent-200';
        } else if (isReskill) {
          type = 'Reskill';
          icon = <RefreshCw className="w-4 h-4" />;
          color = 'bg-warning-50 text-warning-700 border-warning-200';
        } else if (isHybrid) {
          type = 'Hybrid';
          icon = <Layers className="w-4 h-4" />;
          color = 'bg-purple-50 text-purple-700 border-purple-200';
        }

        return {
          type,
          title: text,
          priority: idx === 0 ? 'High' : 'Medium',
          icon,
          color,
          reason: 'Configured by organization as an active workforce development priority.',
          timeline: idx === 0 ? '0–6 months' : '6–12 months',
        };
      })
    : defaultFocusItems;

  return (
    <div className="bg-surface rounded-lg border border-surface-border p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-accent-50 text-accent-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-body font-bold text-charcoal-900 tracking-tight">
                Strategic Development Focus
              </h3>
              <p className="text-body-xs text-charcoal-500">
                Workforce execution vectors based on stated organizational priorities
              </p>
            </div>
          </div>
          <span className="text-body-xs font-mono font-bold bg-accent-50 text-accent-800 border border-accent-200 px-2 py-0.5 rounded-xs">
            {items.length} Vectors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-md border border-surface-border bg-canvas-subtle/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-xs border ${item.color}`}>
                      {item.icon}
                    </span>
                    <span className="text-body-xs font-bold text-charcoal-900">
                      {item.type} Vector
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-canvas text-charcoal-700 border border-surface-border font-mono">
                    {item.priority}
                  </span>
                </div>

                <h4 className="text-body-sm font-semibold text-charcoal-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-body-xs text-charcoal-600 line-clamp-2">
                  {item.reason}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-surface-border/80 flex items-center justify-between text-[11px] text-charcoal-500">
                <span>Target Timeline: <strong className="text-charcoal-700 font-semibold">{item.timeline}</strong></span>
                <span className="text-brand-600 font-medium">Profile Priority</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-surface-border flex items-center justify-between text-body-xs">
        <span className="text-charcoal-400">
          Connects capability gaps with actionable training and acquisition vectors
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/organization/workforce')}
          className="cursor-pointer"
        >
          <span>View Workforce Skills</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};

export default DevelopmentPriorities;
