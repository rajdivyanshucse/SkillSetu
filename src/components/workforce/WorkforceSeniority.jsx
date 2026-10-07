import React from 'react';
import { Award, Clock, TrendingUp, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const WorkforceSeniority = ({
  experienceDistribution = {
    '0–2 years': '25%',
    '3–5 years': '40%',
    '6–10 years': '25%',
    '10+ years': '10%',
  },
  totalEmployees = 287,
  className = '',
}) => {
  const brackets = Object.entries(experienceDistribution).map(([label, pctStr]) => {
    const pct = parseInt(pctStr, 10) || 0;
    const count = Math.round((pct / 100) * totalEmployees);
    return {
      label,
      pct,
      count,
    };
  });

  return (
    <Card className={`p-5 space-y-4 bg-surface ${className}`}>
      <CardHeader className="p-0 pb-3 border-b border-surface-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Workforce Seniority & Experience</CardTitle>
              <CardDescription>
                Tenure breakdown across early, mid, senior, and lead segments.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200">
            Tenure Modeling
          </span>
        </div>
      </CardHeader>

      {/* Seniority Distribution Bars */}
      <div className="space-y-3 pt-1">
        {brackets.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-charcoal-800">{item.label} Experience</span>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="font-bold text-charcoal-900">~{item.count} staff</span>
                <span className="text-charcoal-400 font-bold">({item.pct}%)</span>
              </div>
            </div>

            <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Data-Traceable Seniority Insight */}
      <div className="p-3 rounded-lg bg-canvas-subtle/90 border border-surface-border flex items-start gap-2 text-xs text-charcoal-700">
        <Info className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong className="text-charcoal-900">Workforce Concentration:</strong> Over 65% of the workforce is concentrated in the mid-to-senior segment (3–10 years), offering a prime talent base for targeted upskilling into advanced architecture and cloud-native practices.
        </p>
      </div>
    </Card>
  );
};

export default WorkforceSeniority;
