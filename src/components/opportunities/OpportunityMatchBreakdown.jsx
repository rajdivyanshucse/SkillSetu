import React from 'react';
import { Sparkles, ShieldCheck, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const OpportunityMatchBreakdown = ({
  compatibility = 84,
  breakdown = {
    roleAlignment: 88,
    skillCoverage: 78,
    requiredSkills: 82,
    developmentAlignment: 70,
  },
  className = '',
}) => {
  const metrics = [
    {
      label: 'Role Alignment',
      value: breakdown.roleAlignment || 88,
      description: 'Correspondence between target archetype and position responsibilities.',
    },
    {
      label: 'Skill Coverage',
      value: breakdown.skillCoverage || 78,
      description: 'Proportion of required technologies present in your calibrated profile.',
    },
    {
      label: 'Required Skills Fit',
      value: breakdown.requiredSkills || 82,
      description: 'Proficiency depth across mandatory core backend dependencies.',
    },
    {
      label: 'Development Alignment',
      value: breakdown.developmentAlignment || 70,
      description: 'Relevance of listed gap areas to active Career Roadmap stages.',
    },
  ];

  return (
    <Card className={`p-5 space-y-4 bg-surface ${className}`}>
      <CardHeader className="p-0 pb-3 border-b border-surface-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Profile Compatibility Breakdown</CardTitle>
              <CardDescription>
                Multi-dimensional alignment model between your profile and this role.
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-brand-700 leading-none">
              {compatibility}%
            </span>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mt-0.5">
              Overall Fit
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Progress Bars Breakdown */}
      <div className="space-y-3 pt-1">
        {metrics.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal-900">{item.label}</span>
              <span className="font-mono font-bold text-brand-700">{item.value}%</span>
            </div>

            <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${item.value}%` }}
              />
            </div>

            <p className="text-[11px] text-charcoal-500 leading-normal">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Required Disclaimer Notice */}
      <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border flex items-start gap-2 text-xs text-charcoal-600">
        <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong className="text-charcoal-800">Model Notice:</strong> Compatibility reflects how closely the opportunity requirements align with your current profile calibration and roadmap priorities. It is not a hiring, selection, or interview guarantee.
        </p>
      </div>
    </Card>
  );
};

export default OpportunityMatchBreakdown;
