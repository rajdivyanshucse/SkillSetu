import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, Target, ShieldAlert, ArrowRight, BarChart2, DollarSign } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const OrganizationPreviewMockup = () => {
  const orgCapabilities = [
    { title: 'Workforce Capability Radar', desc: 'Real-time aggregated view of organizational competency health across departments and squads.' },
    { title: 'Critical Gap Forecaster', desc: 'Early warning indicators highlighting talent vulnerabilities before product deadlines or key departures.' },
    { title: 'Future Skill Planning', desc: 'Model future headcount competencies needed to execute strategic 12-to-24 month technology roadmaps.' },
    { title: 'Smart Internal Mobility', desc: 'Match internal team members to critical open initiatives based on verified skills rather than tenure.' },
    { title: 'Upskill vs. Hire ROI Modeling', desc: 'Data-driven insights to decide whether to develop internal talent (3–6 months) or hire externally.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-surface border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="For Organizations"
          title="Build Workforce Capability With Better Intelligence"
          description="Move beyond static org charts. SkillSetu gives HR leaders and workforce planners continuous visibility into skills, capability risks, and internal talent deployment."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Organization Mock Dashboard UI (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="bg-surface rounded-xl border border-surface-border shadow-card overflow-hidden"
            >
              {/* Mock OS Header */}
              <div className="p-4 bg-canvas-subtle/80 border-b border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-sm bg-charcoal-900 text-white font-bold text-xs flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                      Acme Global Engineering
                    </span>
                    <span className="text-[10px] text-charcoal-500">
                      Workforce Capability Intelligence · 420 Engineers
                    </span>
                  </div>
                </div>
                <Badge status="verified" size="sm" showDot>
                  Benchmark: Tier 1 Tech
                </Badge>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="p-5 space-y-5 bg-canvas/30">
                {/* Metric Summary Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 bg-surface rounded-md border border-surface-border shadow-subtle">
                    <span className="text-[11px] text-charcoal-500 font-medium block">Org Capability</span>
                    <span className="text-section-title font-bold text-charcoal-900">88.4%</span>
                    <span className="text-[10px] text-status-success-text block font-semibold mt-0.5">+4.2% QoQ</span>
                  </div>
                  <div className="p-3.5 bg-surface rounded-md border border-surface-border shadow-subtle">
                    <span className="text-[11px] text-charcoal-500 font-medium block">Critical Gaps</span>
                    <span className="text-section-title font-bold text-status-warning-text">6 Nodes</span>
                    <span className="text-[10px] text-charcoal-400 block mt-0.5">High Attrition Risk</span>
                  </div>
                  <div className="p-3.5 bg-surface rounded-md border border-surface-border shadow-subtle">
                    <span className="text-[11px] text-charcoal-500 font-medium block">Internal Match</span>
                    <span className="text-section-title font-bold text-brand-700">74%</span>
                    <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">Save $420k Hiring</span>
                  </div>
                </div>

                {/* Team Capability Telemetry Graph Mock */}
                <div className="p-4 bg-surface rounded-md border border-surface-border shadow-subtle space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <span className="text-xs font-semibold text-charcoal-800">Department Capability Index</span>
                    <span className="text-[11px] font-mono text-charcoal-400">Current vs Peer Index</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { dept: 'Cloud & Infrastructure', score: 91, benchmark: 85, state: 'Strong' },
                      { dept: 'Data Platform & ML', score: 76, benchmark: 82, state: 'Upskill Priority' },
                      { dept: 'Core Product Engineering', score: 88, benchmark: 80, state: 'Optimal' },
                      { dept: 'Security & Compliance', score: 94, benchmark: 88, state: 'Exemplary' },
                    ].map((row) => (
                      <div key={row.dept} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-charcoal-800">{row.dept}</span>
                          <span className={`text-[10px] font-semibold ${
                            row.state === 'Upskill Priority' ? 'text-amber-700' : 'text-emerald-700'
                          }`}>
                            {row.state} ({row.score}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden flex">
                          <div
                            className={`h-full rounded-full ${
                              row.state === 'Upskill Priority' ? 'bg-amber-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upskilling vs Hiring Decision Matrix */}
                <div className="p-3.5 bg-brand-50/70 border border-brand-200/80 rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-charcoal-900 block">
                      Upskill Strategy Recommended
                    </span>
                    <span className="text-[11px] text-charcoal-600">
                      12 internal engineers have 80%+ baseline readiness for upcoming AI platform launch.
                    </span>
                  </div>
                  <Button variant="brand" size="xs">
                    Deploy Cohort
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {orgCapabilities.map((cap) => (
              <div
                key={cap.title}
                className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle hover:border-surface-border-strong transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <h4 className="text-body-sm font-semibold text-charcoal-900">{cap.title}</h4>
                </div>
                <p className="text-xs text-charcoal-600 mt-1 pl-3.5 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationPreviewMockup;
