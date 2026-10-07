import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, TrendingUp, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const SkillSetuAuthVisual = () => {
  return (
    <div className="relative w-full h-full p-8 sm:p-12 bg-canvas-subtle border-r border-surface-border flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D6D0C5_1px,transparent_1px)] [background-size:20px_20px] opacity-35 -z-10" />

      {/* Top Branding / Mission Note */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-body-sm font-bold text-charcoal-900 leading-none block">
              SkillSetu
            </span>
            <span className="text-[10px] font-medium text-brand-700 uppercase tracking-wider block mt-0.5">
              Workforce Intelligence
            </span>
          </div>
        </div>

        <p className="text-xs text-charcoal-600 max-w-xs leading-relaxed">
          Continuous competency normalization, transparent role fit analysis, and predictive career roadmaps.
        </p>
      </div>

      {/* Center Layered Intelligence Mockup Card */}
      <div className="relative my-8 sm:my-10 max-w-sm mx-auto w-full">
        {/* Subtle Bottom Floating Backplane Layer */}
        <div className="absolute -bottom-3 -right-3 inset-x-3 inset-y-0 bg-brand-100/60 rounded-xl border border-brand-200/80 -z-10 transform rotate-1" />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="p-5 rounded-xl bg-surface border border-surface-border shadow-card space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-charcoal-400">
                Target Role Fit Analysis
              </span>
              <h4 className="text-body-sm font-bold text-charcoal-900 mt-0.5">
                Staff Cloud Systems Engineer
              </h4>
            </div>
            <Badge status="recommended" size="sm" icon>
              84% Fit
            </Badge>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-sm bg-canvas-subtle border border-surface-border">
              <span className="text-[10px] text-charcoal-500 block">Skill Coverage</span>
              <span className="text-body-md font-bold text-charcoal-900">72%</span>
            </div>
            <div className="p-2.5 rounded-sm bg-canvas-subtle border border-surface-border">
              <span className="text-[10px] text-charcoal-500 block">Market Velocity</span>
              <span className="text-body-md font-bold text-status-success-text">+28% YoY</span>
            </div>
          </div>

          {/* Priority Skills Checklist */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal-400 block">
              Priority Development Focus:
            </span>
            <div className="space-y-1.5">
              {[
                { name: 'AWS Cloud Architecture', status: 'Core Priority', level: '80%' },
                { name: 'Docker & Kubernetes Pods', status: 'In Progress', level: '75%' },
                { name: 'Distributed System Design', status: 'Milestone 2', level: '85%' },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs p-1.5 rounded-xs bg-canvas/60 border border-surface-border">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <span className="font-medium text-charcoal-800">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-charcoal-500">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Verified Note */}
      <div className="pt-4 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Explainable Telemetry</span>
        </div>
        <span className="font-mono text-[11px] text-charcoal-400">v1.0 Release</span>
      </div>
    </div>
  );
};

export default SkillSetuAuthVisual;
