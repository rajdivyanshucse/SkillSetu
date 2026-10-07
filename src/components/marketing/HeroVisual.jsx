import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Sparkles, Layers, ArrowUpRight, CheckCircle2, Compass } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto select-none">
      {/* Background soft ambient halo (warm neutral, NOT neon) */}
      <div className="absolute -inset-4 bg-gradient-to-b from-brand-100/40 via-canvas-subtle/50 to-transparent rounded-2xl filter blur-xl -z-10" />

      {/* Main Layered Intelligence Window */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface rounded-xl border border-surface-border shadow-modal overflow-hidden"
      >
        {/* Mock OS Header */}
        <div className="px-4 py-3 bg-canvas-subtle/80 border-b border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-charcoal-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-charcoal-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-charcoal-300" />
            </div>
            <span className="text-[11px] font-mono text-charcoal-500 pl-2 hidden sm:inline">
              skillsetu.intelligence.radar // live-telemetry
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge status="verified" size="sm" showDot>
              Continuous Signal Sync
            </Badge>
          </div>
        </div>

        {/* Intelligence Grid Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 bg-canvas/40">
          {/* Col 1: Workforce Capability Matrix (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Top Node Card */}
            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-semibold text-brand-700 uppercase tracking-wider">
                    Role Archetype
                  </span>
                  <h4 className="text-body-md font-bold text-charcoal-900 mt-0.5">
                    Lead Distributed Systems Architect
                  </h4>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
                  92% Match
                </span>
              </div>

              {/* Capability Progress Bars */}
              <div className="space-y-2.5 pt-1">
                {[
                  { skill: 'Event-Driven Architecture', score: 94, status: 'Verified', statusColor: 'emerald' },
                  { skill: 'Distributed Consensus (Raft/Paxos)', score: 88, status: 'Verified', statusColor: 'emerald' },
                  { skill: 'Kubernetes & Service Mesh', score: 82, status: 'Active', statusColor: 'brand' },
                  { skill: 'eBPF Kernel Observability', score: 64, status: 'Priority Gap', statusColor: 'amber' },
                ].map((item) => (
                  <div key={item.skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-charcoal-800">{item.skill}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold ${
                          item.statusColor === 'emerald' ? 'text-emerald-700' :
                          item.statusColor === 'amber' ? 'text-amber-700' : 'text-brand-700'
                        }`}>
                          {item.status}
                        </span>
                        <span className="font-mono text-charcoal-500">{item.score}%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.statusColor === 'amber' ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Pathway Indicator */}
            <div className="p-3 bg-brand-50/70 border border-brand-200/70 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="text-xs font-medium text-charcoal-800">
                  1 Priority Skill needed to reach <span className="font-bold text-brand-800">Principal Tier</span>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-brand-700 underline cursor-pointer">
                View Path
              </span>
            </div>
          </div>

          {/* Col 2: Market Demand & Industry Signals (5 cols) */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Market Demand Stat Card */}
            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle space-y-2">
              <div className="flex items-center justify-between text-xs text-charcoal-500 font-medium">
                <span>Industry Demand Surge</span>
                <TrendingUp className="w-3.5 h-3.5 text-status-success-dot" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-stat text-charcoal-900 font-bold">+34.8%</span>
                <span className="text-xs font-medium text-emerald-700">YoY Growth</span>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-normal">
                High demand velocity detected across 1,400+ peer technology organizations.
              </p>
            </div>

            {/* Connected Nodes Mini Preview */}
            <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle space-y-3">
              <span className="text-[10px] font-mono font-semibold text-charcoal-400 uppercase tracking-wider block">
                Workforce Capability Cluster
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Go Systems', 'Distributed SQL', 'Kafka Streams', 'Vector DBs', 'CI/CD Pipelines'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-xs bg-canvas-subtle border border-surface-border text-charcoal-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
                <span>Cluster Health</span>
                <span className="font-semibold text-charcoal-900">Optimal (94.6)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroVisual;
