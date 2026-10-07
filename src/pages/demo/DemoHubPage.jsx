import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Compass,
  Briefcase,
  TrendingUp,
  BarChart3,
  BookOpen,
  FolderGit2,
  CalendarCheck,
  Info,
  Play
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const DemoHubPage = ({ initialTab = 'individual' }) => {
  const { navigate } = useRouter();
  const [activePersona, setActivePersona] = useState(initialTab === 'organization' ? 'organization' : 'individual');

  return (
    <PublicLayout>
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none">
        {/* TOP DEMO HEADER */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>INTERACTIVE DEMO MODE — DEMO / SEEDED DATA</span>
          </div>

          <h1 className="text-display-md font-bold text-charcoal-900 tracking-tight">
            SkillSetu Platform Evaluation Sandbox
          </h1>

          <p className="text-body-sm text-charcoal-600 leading-relaxed">
            Experience the complete end-to-end intelligence continuum without manual account registration. 
            Evaluate deterministic scenarios for individuals and organizations.
          </p>
        </div>

        {/* PERSONA TOGGLE TABS */}
        <div className="flex justify-center">
          <div className="bg-canvas-subtle p-1 rounded-full border border-surface-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActivePersona('individual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePersona === 'individual'
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Demo Individual Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePersona('organization')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activePersona === 'organization'
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Demo Organization Workspace</span>
            </button>
          </div>
        </div>

        {/* PERSONA CONTENT CARD */}
        <AnimatePresence mode="wait">
          {activePersona === 'individual' ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <Card orientation="vertical" className="p-6 bg-surface border-2 border-brand-500/30 space-y-6 shadow-card">
                {/* Persona Meta Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
                      BE
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-body-lg font-bold text-charcoal-900">Alex Morgan (Demo Backend Engineer)</h2>
                        <Badge variant="success" className="text-[10px]">VERIFIED SCENARIO</Badge>
                      </div>
                      <div className="text-body-xs text-charcoal-500">Target Role: Backend Software Engineer (78% Compatibility)</div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/dashboard')}
                    rightIcon={<Play className="w-4 h-4 fill-current" />}
                  >
                    Open Individual Workspace
                  </Button>
                </div>

                {/* Scenario Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-body-xs">
                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-brand-600" />
                      <span>Verified Calibrated Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Java (Adv)', 'DSA (Adv)', 'SQL (Inter)', 'Spring Boot (Inter)', 'React (Inter)', 'System Design', 'Docker (Beg)', 'AWS (Beg)'].map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-surface border text-[11px] font-mono text-charcoal-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-purple-600" />
                      <span>Priority Skill Gaps</span>
                    </div>
                    <ul className="space-y-1 text-charcoal-600">
                      <li className="flex items-center justify-between">
                        <span>• AWS Cloud Architecture</span>
                        <Badge variant="danger" className="text-[9px]">HIGH</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>• Docker Containerization</span>
                        <Badge variant="warning" className="text-[9px]">MED</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>• Kafka Event Streaming</span>
                        <Badge variant="subtle" className="text-[9px]">LOW</Badge>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Multi-Signal Recommendations</span>
                    </div>
                    <p className="text-[11px] text-charcoal-600 leading-relaxed">
                      5 Explainable recommendations generated across courses, hands-on microservice projects, 
                      and high-fit job opportunities.
                    </p>
                  </div>
                </div>

                {/* Quick Action Exploration Links */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/skill-intelligence')}>
                    Skill Taxonomy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/career-intelligence')}>
                    Career Fit Analysis
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/career-roadmap')}>
                    Milestone Roadmap
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/recommendations')}>
                    Explainable Recommendations
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/intelligence')}>
                    Executive Radar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="organization"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <Card orientation="vertical" className="p-6 bg-surface border-2 border-emerald-500/30 space-y-6 shadow-card">
                {/* Organization Meta Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                      TO
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-body-lg font-bold text-charcoal-900">Apex Global Technologies (Demo Organization)</h2>
                        <Badge variant="success" className="text-[10px]">ENTERPRISE DEMO</Badge>
                      </div>
                      <div className="text-body-xs text-charcoal-500">48 Engineers • 3 Core Divisions • 82% Baseline Health</div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/organization/dashboard')}
                    rightIcon={<Play className="w-4 h-4 fill-current" />}
                  >
                    Open Organization Workspace
                  </Button>
                </div>

                {/* Organization Scenario Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-body-xs">
                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span>Workforce Capabilities</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed text-[11px]">
                      Strong core in Java, Node.js, React, and AWS. Bench strength score at 82/100 across 
                      Core Backend, AI Platform, and DevOps teams.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <CalendarCheck className="w-4 h-4 text-blue-600" />
                      <span>Planning Scenario: Cloud AI Expansion</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed text-[11px]">
                      12-Month horizon modeling: +12 engineers required. Optimal resolution mix: 
                      50% Upskill (6 FTE) + 35% Hire (4 FTE) + 15% Redistribute (2 FTE).
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-canvas-subtle border border-surface-border space-y-2">
                    <div className="font-semibold text-charcoal-800 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      <span>Talent Discovery & Roles</span>
                    </div>
                    <p className="text-charcoal-600 leading-relaxed text-[11px]">
                      Role requirements mapped for Senior Backend Engineer and Cloud Native Architect with 
                      candidate compatibility benchmarks.
                    </p>
                  </div>
                </div>

                {/* Organization Action Links */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/organization/workforce')}>
                    Workforce Inventory
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/organization/planning')}>
                    Scenario Planning
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/organization/talent')}>
                    Talent Discovery
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/organization/learning')}>
                    Learning Programs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate('/intelligence')}>
                    Executive Synthesis
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DEMO NOTICE & DISCLAIMER */}
        <div className="p-4 bg-canvas-subtle rounded-lg border border-surface-border text-body-xs text-charcoal-600 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-charcoal-900">Deterministic Evaluation Grounding: </span>
            This interactive demo sandbox operates strictly on deterministic seeded datasets. All compatibility scores, 
            skill gap criticality metrics, and demand projections reflect verifiable test fixtures.
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default DemoHubPage;
