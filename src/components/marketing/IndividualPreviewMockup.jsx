import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Sparkles, TrendingUp, ArrowRight, ShieldCheck, Compass, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const IndividualPreviewMockup = () => {
  const individualFeatures = [
    { title: 'Verified Skill Profile', desc: 'Synthesize your competencies from real project history, codebases, and credentials into an objective skill graph.' },
    { title: 'Skill Gap Analysis', desc: 'Identify precise technical & leadership gaps separating your current role from your aspirational position.' },
    { title: 'Career Compatibility Score', desc: 'Quantify compatibility against hundreds of modern industry role archetypes with explainable rationale.' },
    { title: 'Emerging Skills Radar', desc: 'Discover high-demand emerging skills gaining momentum in your domain before they become standard requirements.' },
    { title: 'Personalized Progression Roadmap', desc: 'Step-by-step development priorities sequenced for maximum career impact and verified capability.' },
    { title: 'High-Match Opportunities', desc: 'Discover internal mobility options and external roles tailored to your exact capability blueprint.' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-canvas border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeader
          badge="For Individuals"
          title="Understand Where Your Skills Can Take You"
          description="Transform guesswork into actionable career strategy. SkillSetu analyzes your verified skills against live market requirements to map clear, step-by-step pathways."
        />

        {/* Feature Grid & Realistic Product Mockup Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Feature List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-3">
              {individualFeatures.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle hover:border-surface-border-strong transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    <h4 className="text-body-sm font-semibold text-charcoal-900">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 mt-1 pl-3.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Realistic Individual Dashboard Mockup (7 cols) */}
          <div className="lg:col-span-7">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="bg-surface rounded-xl border border-surface-border shadow-card overflow-hidden"
            >
              {/* Top Mock Header */}
              <div className="p-4 bg-canvas-subtle/80 border-b border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                    AK
                  </div>
                  <div>
                    <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                      Aarav Kapoor
                    </span>
                    <span className="text-[10px] text-charcoal-500">
                      Mid-Level Backend Engineer · Platform Services
                    </span>
                  </div>
                </div>
                <Badge status="recommended" size="sm" icon>
                  84% Target Compatibility
                </Badge>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-5 space-y-5 bg-canvas/30">
                {/* Compatibility Target Card */}
                <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-charcoal-400">
                        Target Pathway Archetype
                      </span>
                      <h4 className="text-body-md font-bold text-charcoal-900">
                        Senior Cloud Backend Engineer
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-stat text-brand-700 font-bold leading-none">84%</span>
                      <span className="text-[10px] font-medium text-charcoal-500 block">Overall Fit</span>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal-500">
                    High synergy with existing Java/Spring & SQL baseline. Core gaps identified in container orchestration and distributed caching.
                  </p>
                </div>

                {/* Skill Gap Analysis Bar Breakdown */}
                <div className="p-4 rounded-lg bg-surface border border-surface-border shadow-subtle space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                    <span className="text-xs font-semibold text-charcoal-800">Competency Gap Breakdown</span>
                    <span className="text-[11px] font-mono text-charcoal-400">Current vs Required</span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { skill: 'Java / Kotlin Core', current: 95, required: 90, status: 'Mastered' },
                      { skill: 'Spring Boot & Microservices', current: 88, required: 85, status: 'Verified' },
                      { skill: 'SQL & Database Optimization', current: 82, required: 80, status: 'Verified' },
                      { skill: 'AWS Cloud Infrastructure', current: 45, required: 80, status: 'Priority Gap' },
                      { skill: 'Docker & Kubernetes', current: 40, required: 75, status: 'Priority Gap' },
                      { skill: 'High-Scale System Design', current: 55, required: 85, status: 'Active Focus' },
                    ].map((row) => (
                      <div key={row.skill} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-charcoal-800">{row.skill}</span>
                          <span className={`text-[10px] font-semibold ${
                            row.status === 'Priority Gap' ? 'text-status-danger-text' :
                            row.status === 'Active Focus' ? 'text-status-warning-text' : 'text-status-success-text'
                          }`}>
                            {row.status} ({row.current}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-canvas-muted rounded-full overflow-hidden flex">
                          <div
                            className={`h-full rounded-full ${
                              row.status === 'Priority Gap' ? 'bg-red-400' :
                              row.status === 'Active Focus' ? 'bg-amber-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${row.current}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalized Roadmap Callout */}
                <div className="p-3.5 rounded-lg bg-brand-50/70 border border-brand-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-charcoal-900 block leading-tight">
                        3 Priority Skills Recommended
                      </span>
                      <span className="text-[11px] text-charcoal-600">
                        Targeting AWS, Docker, and System Design closes 94% of the capability delta.
                      </span>
                    </div>
                  </div>
                  <Button variant="brand" size="xs">
                    Explore Roadmap
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndividualPreviewMockup;
