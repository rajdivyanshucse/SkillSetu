import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

export const RoleReadiness = ({
  readinessAreas = [
    { name: 'Programming', percentage: 88, status: 'Advanced' },
    { name: 'Backend Frameworks', percentage: 82, status: 'Proficient' },
    { name: 'Databases & SQL', percentage: 76, status: 'Proficient' },
    { name: 'Cloud Infrastructure', percentage: 42, status: 'Emerging' },
    { name: 'DevOps & Containers', percentage: 35, status: 'Foundational' },
    { name: 'System Design', percentage: 28, status: 'Foundational' },
  ],
  remainingAreas = ['AWS Cloud', 'Docker Containerization', 'System Design Scalability', 'CI/CD Pipelines'],
  className = '',
}) => {
  const getBarColor = (pct) => {
    if (pct >= 80) return 'bg-brand-500';
    if (pct >= 60) return 'bg-brand-400';
    if (pct >= 40) return 'bg-amber-500';
    return 'bg-charcoal-400';
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Role Readiness</CardTitle>
              <CardDescription>
                Capability area progression modeled against target role expectations.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
            Readiness Model
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Capability Area Bars */}
        <div className="space-y-3">
          {readinessAreas.map((area, idx) => (
            <div key={area.name} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal-900">{area.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-charcoal-400">{area.status}</span>
                  <span className="font-bold text-charcoal-900">{area.percentage}%</span>
                </div>
              </div>

              <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${area.percentage}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getBarColor(area.percentage)}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Focus Highlights */}
        <div className="p-3.5 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-700">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Remaining Focus Areas to Reach 90%+ Readiness:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {remainingAreas.map((rem) => (
              <span
                key={rem}
                className="text-[11px] px-2.5 py-1 rounded-xs bg-surface border border-surface-border text-charcoal-800 font-semibold"
              >
                {rem}
              </span>
            ))}
          </div>
        </div>

        {/* Integrity Notice */}
        <div className="p-3 rounded-lg bg-canvas-subtle border border-surface-border flex items-start gap-2 text-xs text-charcoal-600">
          <Info className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Role readiness reflects the current profile-to-role alignment model and milestone completion. It is a development indicator and not a hiring prediction.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleReadiness;
