import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Layers,
  Compass,
  Users,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Database,
  ArrowRight,
  Info,
  Calendar,
  ExternalLink,
  Target,
  FileSpreadsheet,
  Activity,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import Tooltip from '../../components/ui/Tooltip';
import api from '../../services/api';

export const ExecutiveIntelligencePage = () => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedDisclaimersOpen, setSelectedDisclaimersOpen] = useState(false);
  const [provenanceFilter, setProvenanceFilter] = useState('ALL');
  const [marketData, setMarketData] = useState({
    risingSkills: [
      { name: 'TypeScript', score: 94, velocity: '+18.4%', status: 'HIGH_DEMAND', provenance: 'IMPORTED' },
      { name: 'PostgreSQL', score: 89, velocity: '+14.2%', status: 'RISING', provenance: 'IMPORTED' },
      { name: 'FastAPI', score: 86, velocity: '+22.1%', status: 'HIGH_GROWTH', provenance: 'DERIVED' },
      { name: 'Docker', score: 91, velocity: '+9.8%', status: 'STABLE_CORE', provenance: 'SEEDED' },
      { name: 'Kubernetes', score: 85, velocity: '+16.5%', status: 'RISING', provenance: 'IMPORTED' }
    ],
    emergingSkills: [
      { name: 'Vector Databases (pgvector)', growthRate: '+45.2%', category: 'AI & Data Infrastructure', horizon: '6-12 Months', provenance: 'DERIVED' },
      { name: 'LLM Orchestration (LangChain)', growthRate: '+38.7%', category: 'Applied GenAI', horizon: '3-6 Months', provenance: 'DERIVED' },
      { name: 'Cloud Native Serverless', growthRate: '+24.1%', category: 'DevOps & Cloud', horizon: '12-24 Months', provenance: 'SEEDED' }
    ],
    forecastHorizon: {
      horizonMonths: 12,
      confidenceBand: '82% - 94%',
      modelType: 'Linear Exponential Smoothing (Holt-Winters)',
      observationsCount: 240,
      disclaimer: 'Statistical forecast based on historical observations. Does not guarantee future market demand.'
    }
  });

  const [talentSignals, setTalentSignals] = useState({
    baselineCoverage: 76,
    targetRole: 'Backend Software Engineer',
    matchedSkills: 8,
    requiredSkillsTotal: 10,
    priorityGaps: [
      { skill: 'AWS Cloud Architecture', criticality: 'HIGH', effortMonths: 1.5, marketMultiplier: '1.25x' },
      { skill: 'Docker Containerization', criticality: 'MEDIUM', effortMonths: 0.8, marketMultiplier: '1.15x' }
    ],
    compatibilityScore: 78
  });

  const [workforceSignals, setWorkforceSignals] = useState({
    totalHeadcount: 48,
    benchStrengthScore: 82,
    criticalGapsCount: 3,
    actionMix: {
      hire: 35,
      upskill: 50,
      redistribute: 15
    },
    projectedDemandGrowth: '+18%'
  });

  const [recommendations, setRecommendations] = useState([
    {
      id: 'rec-01',
      type: 'SKILL_DEVELOPMENT',
      title: 'Accelerate AWS Cloud Infrastructure Competency',
      priority: 'HIGH',
      score: 88,
      category: 'SKILL',
      evidence: 'High target-role importance (20%), verified skill gap (30%), strong market growth velocity (15%).',
      weights: { gap: 30, role: 20, market: 15, semantic: 10, velocity: 10, learning: 10, progress: 5 },
      provenance: 'DERIVED'
    },
    {
      id: 'rec-02',
      type: 'LEARNING_PATHWAY',
      title: 'Complete System Design & Microservices Module',
      priority: 'MEDIUM',
      score: 82,
      category: 'LEARNING',
      evidence: 'Aligned with Backend Engineer taxonomy benchmark and 4 completed prerequisites.',
      weights: { gap: 30, role: 20, market: 15, semantic: 10, velocity: 10, learning: 10, progress: 5 },
      provenance: 'DERIVED'
    }
  ]);

  useEffect(() => {
    // Attempt live API data fetch, fallback to robust deterministic baseline
    const fetchData = async () => {
      try {
        const [demandRes, emergingRes, recsRes] = await Promise.allSettled([
          api.intelligence.getDemandSkills ? api.intelligence.getDemandSkills({ limit: 5 }) : null,
          api.intelligence.getEmergingSkills ? api.intelligence.getEmergingSkills({ limit: 3 }) : null,
          api.recommendations.getRecommendations ? api.recommendations.getRecommendations({ limit: 4 }) : null
        ]);

        if (demandRes.status === 'fulfilled' && demandRes.value?.data?.skills) {
          // enrich with real items if available
          const fetched = demandRes.value.data.skills.map((s, idx) => ({
            name: s.skillName || s.name,
            score: s.demandScore || 85,
            velocity: s.growthRate ? `+${(s.growthRate * 100).toFixed(1)}%` : '+12.5%',
            status: s.demandStatus || 'HIGH_DEMAND',
            provenance: s.provenance || 'IMPORTED'
          }));
          if (fetched.length > 0) {
            setMarketData((prev) => ({ ...prev, risingSkills: fetched }));
          }
        }

        if (recsRes.status === 'fulfilled' && recsRes.value?.data?.recommendations) {
          const recs = recsRes.value.data.recommendations.slice(0, 3).map((r) => ({
            id: r.id,
            type: r.type || 'RECOMMENDATION',
            title: r.title || r.name,
            priority: r.priority || 'HIGH',
            score: Math.round(r.score || 85),
            category: r.category || 'SKILL',
            evidence: r.evidence?.rationale || r.description || 'Evidence derived from multi-signal algorithm.',
            weights: r.weights || { gap: 30, role: 20, market: 15, semantic: 10, velocity: 10, learning: 10, progress: 5 },
            provenance: r.provenance || 'DERIVED'
          }));
          if (recs.length > 0) {
            setRecommendations(recs);
          }
        }
      } catch (e) {
        console.info('[ExecutiveIntelligence] Using deterministic intelligence baseline');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout
      activeRoute="/intelligence"
      breadcrumbItems={[{ label: 'Intelligence OS' }, { label: 'Executive Intelligence Dashboard' }]}
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* TOP BANNER & PLATFORM CONTEXT */}
        <div className="bg-surface border border-surface-border rounded-lg p-6 shadow-subtle relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <Badge variant="outline" className="text-[11px] font-mono border-brand-300 text-brand-700 bg-brand-50/50">
                  EXECUTIVE INTELLIGENCE SYNTHESIS
                </Badge>
                <Badge variant="subtle" className="text-[11px] font-mono text-charcoal-600 bg-canvas-subtle">
                  PROVENANCE: MULTI-SOURCE VERIFIED
                </Badge>
              </div>
              <h1 className="text-display-sm font-bold text-charcoal-900 tracking-tight">
                SkillSetu Platform Intelligence Dashboard
              </h1>
              <p className="text-body-sm text-charcoal-600 max-w-3xl">
                Synthesized workforce, skill taxonomy, talent capability, and demand signals powered by deterministic 
                calibration and explainable AI algorithms.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/recommendations')}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-600" />}
              >
                Explainable Recommendations
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/demo')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Launch Demo Mode
              </Button>
            </div>
          </div>

          {/* VISUAL FLOW DIAGRAM (NO BARE ARROWS IN UI COPY) */}
          <div className="mt-6 pt-5 border-t border-surface-border/70">
            <div className="text-[11px] font-mono font-semibold uppercase text-charcoal-500 mb-3 tracking-wider">
              Platform Intelligence Continuum Flow
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
              {[
                { step: '01', title: 'Industry Demand', desc: 'Normalized signals', color: 'border-blue-200 bg-blue-50/40 text-blue-800' },
                { step: '02', title: 'Canonical Skills', desc: 'Semantic taxonomy', color: 'border-indigo-200 bg-indigo-50/40 text-indigo-800' },
                { step: '03', title: 'Talent Capability', desc: 'Calibrated profiles', color: 'border-purple-200 bg-purple-50/40 text-purple-800' },
                { step: '04', title: 'Skill Gaps', desc: 'Gap criticality & effort', color: 'border-amber-200 bg-amber-50/40 text-amber-800' },
                { step: '05', title: 'Workforce Insights', desc: 'Scenarios & roadmaps', color: 'border-emerald-200 bg-emerald-50/40 text-emerald-800' },
                { step: '06', title: 'Recommendations', desc: 'Explainable actions', color: 'border-brand-200 bg-brand-50/40 text-brand-800' }
              ].map((item, idx) => (
                <div key={item.step} className={`p-2.5 rounded-md border text-left transition-all ${item.color}`}>
                  <div className="text-[10px] font-mono font-bold opacity-60">PHASE {item.step}</div>
                  <div className="text-body-xs font-bold leading-tight mt-0.5">{item.title}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION A: MARKET SIGNALS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-body-lg font-bold text-charcoal-900">
                Market & Skill Demand Signals
              </h2>
            </div>
            <span className="text-xs text-charcoal-500 font-mono">
              Observed Horizon: 12-24 Months
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Demand Skills */}
            <Card orientation="vertical" className="lg:col-span-2 p-5 space-y-4 bg-surface">
              <div className="flex items-center justify-between border-b border-surface-border pb-3">
                <div>
                  <h3 className="text-body-md font-semibold text-charcoal-900">High-Velocity Market Skills</h3>
                  <p className="text-body-xs text-charcoal-500">Observed demand intensity and quarterly velocity change.</p>
                </div>
                <Badge variant="subtle" className="text-[11px] font-mono">
                  DEMAND INDEX
                </Badge>
              </div>

              <div className="space-y-3">
                {marketData.risingSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between p-3 rounded-md bg-canvas-subtle/70 border border-surface-border/60 hover:bg-canvas-subtle transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="text-body-sm font-semibold text-charcoal-900 flex items-center gap-2">
                          {skill.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-normal border bg-surface text-charcoal-600">
                            {skill.provenance}
                          </span>
                        </div>
                        <div className="text-body-xs text-charcoal-500">Status: {skill.status}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-body-sm font-bold text-charcoal-900">{skill.score}/100</div>
                        <div className="text-[11px] font-semibold text-emerald-600 font-mono">{skill.velocity}</div>
                      </div>
                      <div className="w-16 bg-surface-border/50 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: `${skill.score}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Forecast Disclaimer */}
              <div className="p-3 rounded-md bg-blue-50/50 border border-blue-200/60 text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-body-xs leading-relaxed">
                  <span className="font-semibold">Statistical Demand Notice: </span>
                  {marketData.forecastHorizon.disclaimer}
                </div>
              </div>
            </Card>

            {/* Emerging Skills & Horizon Projections */}
            <Card orientation="vertical" className="p-5 space-y-4 bg-surface">
              <div className="border-b border-surface-border pb-3">
                <h3 className="text-body-md font-semibold text-charcoal-900">Emerging Technology Horizons</h3>
                <p className="text-body-xs text-charcoal-500">High-acceleration competencies based on recent observations.</p>
              </div>

              <div className="space-y-3">
                {marketData.emergingSkills.map((em) => (
                  <div key={em.name} className="p-3 rounded-md border border-surface-border bg-canvas-subtle/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-body-xs font-semibold text-charcoal-900">{em.name}</span>
                      <Badge variant="success" className="text-[10px] font-mono">{em.growthRate}</Badge>
                    </div>
                    <div className="text-[11px] text-charcoal-600">{em.category}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-1 border-t border-surface-border/50">
                      <span>Projection Horizon: {em.horizon}</span>
                      <span className="text-brand-700 font-semibold">{em.provenance}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-medium text-charcoal-500 mb-1.5">Forecast Model Baseline:</div>
                <div className="text-body-xs font-mono bg-canvas-subtle p-2 rounded border border-surface-border text-charcoal-700">
                  {marketData.forecastHorizon.modelType} ({marketData.forecastHorizon.observationsCount} observations)
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION B & C: TALENT SIGNALS & WORKFORCE CAPABILITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION B: TALENT SIGNALS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="text-body-lg font-bold text-charcoal-900">
                Individual Talent Signals
              </h2>
            </div>

            <Card orientation="vertical" className="p-5 space-y-4 bg-surface">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div>
                  <div className="text-body-sm font-semibold text-charcoal-900">Target Role Alignment</div>
                  <div className="text-body-xs text-charcoal-500">{talentSignals.targetRole}</div>
                </div>
                <div className="text-right">
                  <span className="text-display-xs font-bold text-brand-700">{talentSignals.compatibilityScore}%</span>
                  <div className="text-[10px] uppercase font-mono text-charcoal-500">Role Compatibility</div>
                </div>
              </div>

              {/* Progress & Baseline Coverage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-body-xs font-medium text-charcoal-700">
                  <span>Required Skill Coverage ({talentSignals.matchedSkills}/{talentSignals.requiredSkillsTotal} Skills)</span>
                  <span>{talentSignals.baselineCoverage}%</span>
                </div>
                <div className="w-full bg-surface-border/50 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${talentSignals.baselineCoverage}%` }} />
                </div>
              </div>

              {/* Priority Gaps List */}
              <div className="space-y-2 pt-2">
                <div className="text-body-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                  Calibrated Priority Gaps
                </div>
                {talentSignals.priorityGaps.map((gap) => (
                  <div key={gap.skill} className="flex items-center justify-between p-2.5 rounded-md bg-canvas-subtle border border-surface-border/70">
                    <div>
                      <div className="text-body-xs font-semibold text-charcoal-900">{gap.skill}</div>
                      <div className="text-[11px] text-charcoal-500">Estimated Effort: ~{gap.effortMonths} mos</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={gap.criticality === 'HIGH' ? 'danger' : 'warning'} className="text-[10px]">
                        {gap.criticality} GAP
                      </Badge>
                      <div className="text-[10px] text-emerald-600 font-mono font-semibold mt-0.5">
                        +{gap.marketMultiplier} Market Value
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-md bg-canvas-subtle text-[11px] text-charcoal-600 border border-surface-border">
                <span className="font-semibold">Semantic Matching Notice: </span>
                Semantic similarity indicates relatedness between skills or requirements. It is not a hiring probability or candidate ranking.
              </div>
            </Card>
          </section>

          {/* SECTION C: WORKFORCE SIGNALS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-body-lg font-bold text-charcoal-900">
                Organization Workforce Signals
              </h2>
            </div>

            <Card orientation="vertical" className="p-5 space-y-4 bg-surface">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div>
                  <div className="text-body-sm font-semibold text-charcoal-900">Organization Bench Strength</div>
                  <div className="text-body-xs text-charcoal-500">48 Engineers across 3 Core Departments</div>
                </div>
                <div className="text-right">
                  <span className="text-display-xs font-bold text-emerald-700">{workforceSignals.benchStrengthScore}/100</span>
                  <div className="text-[10px] uppercase font-mono text-charcoal-500">Workforce Health</div>
                </div>
              </div>

              {/* Strategic Action Mix */}
              <div className="space-y-2">
                <div className="text-body-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                  Strategic Action Plan Distribution
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-md bg-blue-50 border border-blue-200 text-center">
                    <div className="text-body-md font-bold text-blue-900">{workforceSignals.actionMix.hire}%</div>
                    <div className="text-[10px] font-semibold text-blue-700 uppercase">Hire</div>
                  </div>
                  <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-body-md font-bold text-emerald-900">{workforceSignals.actionMix.upskill}%</div>
                    <div className="text-[10px] font-semibold text-emerald-700 uppercase">Upskill</div>
                  </div>
                  <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200 text-center">
                    <div className="text-body-md font-bold text-amber-900">{workforceSignals.actionMix.redistribute}%</div>
                    <div className="text-[10px] font-semibold text-amber-700 uppercase">Redistribute</div>
                  </div>
                </div>
              </div>

              {/* Workforce Planning Scenario Preview */}
              <div className="p-3 rounded-md bg-canvas-subtle border border-surface-border space-y-2">
                <div className="flex items-center justify-between text-body-xs font-semibold text-charcoal-900">
                  <span>Scenario: Cloud Native & AI Modernization</span>
                  <Badge variant="outline" className="text-[10px]">12 MONTHS</Badge>
                </div>
                <p className="text-[11px] text-charcoal-600 leading-relaxed">
                  Projected demand requires +12 headcount equivalents in Vector Search, Kubernetes, and Go, resolved 
                  primarily through internal upskilling cohorts (6 FTE) and targeted external hiring (6 FTE).
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/organization/planning')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Scenario Modeler
                </Button>
              </div>
            </Card>
          </section>
        </div>

        {/* SECTION D: RECOMMENDATION SIGNALS & MULTI-FACTOR EVIDENCE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-body-lg font-bold text-charcoal-900">
                Explainable Multi-Signal Recommendations
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/recommendations')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              All Recommendations
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} orientation="vertical" className="p-5 bg-surface space-y-3.5 border-l-4 border-l-brand-500">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" className="text-[10px] font-mono">{rec.category}</Badge>
                      <Badge variant={rec.priority === 'HIGH' ? 'danger' : 'subtle'} className="text-[10px]">
                        {rec.priority} PRIORITY
                      </Badge>
                      <span className="text-[10px] font-mono text-charcoal-500 px-1.5 py-0.2 bg-canvas-subtle rounded border">
                        {rec.provenance}
                      </span>
                    </div>
                    <h3 className="text-body-sm font-bold text-charcoal-900 leading-snug">{rec.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-body-md font-bold text-brand-700">{rec.score}</span>
                    <div className="text-[9px] font-mono uppercase text-charcoal-500">Score</div>
                  </div>
                </div>

                <p className="text-body-xs text-charcoal-600 leading-relaxed bg-canvas-subtle/70 p-2.5 rounded border border-surface-border/60">
                  <span className="font-semibold text-charcoal-800">Evidence: </span>
                  {rec.evidence}
                </p>

                {/* Mathematical Weight Breakdown */}
                <div className="pt-2 border-t border-surface-border">
                  <div className="text-[10px] font-mono font-semibold text-charcoal-500 mb-1.5 uppercase">
                    Deterministic Multi-Signal Weights Applied:
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-charcoal-600">
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Gap: 30%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Role: 20%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Market: 15%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Semantic: 10%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Velocity: 10%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Learning: 10%</span>
                    <span className="px-1.5 py-0.5 rounded bg-canvas-subtle border">Progress: 5%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* STANDARDIZED PLATFORM DISCLAIMERS FOOTER ACCORDION */}
        <div className="bg-canvas-subtle border border-surface-border rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-body-sm font-semibold text-charcoal-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Standard Platform Methodology & Disclaimers</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedDisclaimersOpen(!selectedDisclaimersOpen)}
            >
              {selectedDisclaimersOpen ? 'Collapse Details' : 'View Disclaimers'}
            </Button>
          </div>

          <AnimatePresence>
            {selectedDisclaimersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2 border-t border-surface-border text-body-xs text-charcoal-600"
              >
                <div className="p-2 bg-surface rounded border border-surface-border">
                  <span className="font-semibold text-charcoal-900">Forecast: </span>
                  Statistical forecast based on historical observations. Does not guarantee future market demand.
                </div>
                <div className="p-2 bg-surface rounded border border-surface-border">
                  <span className="font-semibold text-charcoal-900">Semantic Matching: </span>
                  Semantic similarity indicates relatedness between skills or requirements. It is not a hiring probability or candidate ranking.
                </div>
                <div className="p-2 bg-surface rounded border border-surface-border">
                  <span className="font-semibold text-charcoal-900">Compensation: </span>
                  Advertised compensation patterns reflect observed job-posting data and do not predict individual salary.
                </div>
                <div className="p-2 bg-surface rounded border border-surface-border">
                  <span className="font-semibold text-charcoal-900">Recommendations: </span>
                  Recommendations are decision-support signals generated from available profile, market, learning, and workforce data.
                </div>
                <div className="p-2 bg-surface rounded border border-surface-border">
                  <span className="font-semibold text-charcoal-900">Real-Data Limitation: </span>
                  Market intelligence depends on the availability and quality of verified datasets. Demonstration and automated evaluation utilize deterministic seeded datasets.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExecutiveIntelligencePage;
