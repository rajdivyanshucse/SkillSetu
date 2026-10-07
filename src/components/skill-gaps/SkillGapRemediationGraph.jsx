import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  Layers,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  Target,
  Search,
  Compass,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { calculateSkillGaps, roleRequirementTaxonomy } from '../../data/skillGapData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SkillGapRemediationGraph = ({
  userSkills = [],
  initialTargetRole = 'Backend Software Engineer',
  className = '',
  showHeader = true,
}) => {
  const { navigate } = useRouter();
  const [selectedRole, setSelectedRole] = useState(initialTargetRole);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedSkillNode, setSelectedSkillNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableRoles = [
    'Backend Software Engineer',
    'Software Engineer',
    'Full Stack Developer',
  ];

  // Live deterministic gap calculation using existing Phase 6 engine
  const gapAnalysis = useMemo(() => {
    return calculateSkillGaps(userSkills, selectedRole);
  }, [userSkills, selectedRole]);

  const allSkills = gapAnalysis.allSkills || [];
  const alignedSkills = gapAnalysis.alignedSkills || [];
  const priorityGaps = gapAnalysis.priorityGaps || [];
  const developingSkills = gapAnalysis.developingSkills || [];

  const categories = useMemo(() => {
    return ['All', ...new Set(allSkills.map((s) => s.category).filter(Boolean))];
  }, [allSkills]);

  const filteredGaps = useMemo(() => {
    const gaps = [...priorityGaps, ...developingSkills];
    if (activeCategory === 'All') return gaps;
    return gaps.filter((s) => s.category === activeCategory);
  }, [priorityGaps, developingSkills, activeCategory]);

  const handleRoleSelect = (role) => {
    setIsLoading(true);
    setSelectedRole(role);
    setSelectedSkillNode(null);
    setTimeout(() => setIsLoading(false), 150);
  };

  const getSeverityBadge = (priorityLabel, gapIntensity) => {
    if (priorityLabel === 'Critical' || gapIntensity === 'High') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          {priorityLabel === 'Critical' ? 'Critical Gap' : 'High Priority'}
        </span>
      );
    }
    if (priorityLabel === 'High') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          High Gap
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-canvas-muted text-charcoal-800 border border-surface-border">
        Medium Gap
      </span>
    );
  };

  return (
    <Card className={`bg-surface border-surface-border shadow-subtle ${className}`}>
      {/* Header & Role Switcher */}
      {showHeader && (
        <CardHeader className="border-b border-surface-border/80 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-xs border border-brand-200/60">
                <GitBranch className="w-3.5 h-3.5 text-brand-600" />
                <span>Skill Gap Remediation Graph</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
                Capability Remediation & Prerequisite Pathway
              </CardTitle>
              <CardDescription className="text-xs text-charcoal-600 max-w-2xl">
                Understand current capability foundations, identify priority competency gaps, and map clear prerequisite learning paths to role readiness.
              </CardDescription>
            </div>

            {/* Target Role Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Target Role:
              </span>
              <div className="inline-flex rounded-lg bg-canvas-subtle p-1 border border-surface-border">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`
                      px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer
                      ${
                        selectedRole === role
                          ? 'bg-surface text-brand-800 shadow-xs border border-surface-border font-bold'
                          : 'text-charcoal-600 hover:text-charcoal-900'
                      }
                    `}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <span className="text-[11px] font-semibold text-charcoal-500 mr-1">Filter Area:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-2 py-0.5 text-[11px] rounded-xs font-semibold transition-colors cursor-pointer
                  ${
                    activeCategory === cat
                      ? 'bg-brand-700 text-white shadow-xs'
                      : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </CardHeader>
      )}

      <CardContent className="p-4 sm:p-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4 py-8 animate-pulse">
            <div className="h-6 bg-canvas-muted rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-40 bg-canvas-subtle rounded-xl" />
              <div className="h-40 bg-canvas-subtle rounded-xl" />
              <div className="h-40 bg-canvas-subtle rounded-xl" />
            </div>
          </div>
        ) : (
          <>
            {/* Top Pipeline Overview Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-canvas-subtle border border-surface-border text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface border border-surface-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-charcoal-900">{alignedSkills.length} Aligned Foundations</div>
                  <div className="text-[11px] text-charcoal-500">Demonstrated competency</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface border border-surface-border">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-charcoal-900">{priorityGaps.length} Priority Remediations</div>
                  <div className="text-[11px] text-charcoal-500">Core role bottlenecks</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface border border-surface-border">
                <Target className="w-4 h-4 text-brand-600 shrink-0" />
                <div>
                  <div className="font-extrabold text-brand-800">{gapAnalysis.overallAlignment}% Target Alignment</div>
                  <div className="text-[11px] text-charcoal-500">Role requirement coverage</div>
                </div>
              </div>
            </div>

            {/* Visual Remediation Flow: Current Capability -> Priority Gaps -> Prerequisite Mapping -> Target Capability */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
                  Prerequisite & Capability Remediation Hierarchy
                </span>
                <span className="text-xs text-charcoal-500 font-medium hidden sm:inline">
                  Click any node to inspect remediation roadmap
                </span>
              </div>

              {/* Responsive Graph Container */}
              <div className="space-y-6">
                {/* STAGE 1: Current Capabilities (Foundation Layer) */}
                <div className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>01. Current Capability Foundation</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      Baseline Mapped
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {alignedSkills.length > 0 ? (
                      alignedSkills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="p-3 rounded-lg bg-surface border border-surface-border hover:border-emerald-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-charcoal-900 truncate">
                                {skill.name}
                              </span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </div>
                            <span className="text-[10px] text-charcoal-400 block mt-0.5">
                              {skill.category}
                            </span>
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-surface-border/60 flex items-center justify-between text-[10px]">
                            <span className="text-charcoal-500">Current:</span>
                            <span className="font-semibold text-emerald-800">{skill.userLevel}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full p-3 text-center text-xs text-charcoal-500">
                        No fully aligned skills mapped yet. Focus on primary prerequisites below.
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Visual Flow Connector */}
                <div className="flex items-center justify-center -my-2 relative z-10">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface border border-surface-border text-[11px] font-semibold text-charcoal-600 shadow-xs">
                    <span>Prerequisites feed into target development</span>
                    <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                </div>

                {/* STAGE 2: Priority Gaps & Prerequisite Remediation Graph */}
                <div className="p-4 sm:p-5 rounded-xl bg-brand-50/40 border border-brand-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
                      <span className="w-2 h-2 rounded-full bg-brand-600" />
                      <span>02. Priority Gaps & Remediation Pathways</span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-800 bg-brand-100 px-2 py-0.5 rounded-xs border border-brand-200">
                      {filteredGaps.length} Actionable Gaps
                    </span>
                  </div>

                  {/* Nodes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredGaps.map((skill) => {
                      const isExpanded = selectedSkillNode?.id === skill.id;
                      const hasPrereqs = skill.prerequisites && skill.prerequisites.length > 0;

                      return (
                        <div
                          key={skill.id || skill.name}
                          tabIndex={0}
                          role="button"
                          aria-expanded={isExpanded}
                          aria-label={`Skill gap node for ${skill.name}`}
                          onClick={() =>
                            setSelectedSkillNode(isExpanded ? null : skill)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedSkillNode(isExpanded ? null : skill);
                            }
                          }}
                          className={`
                            p-4 rounded-xl border transition-all text-left cursor-pointer flex flex-col justify-between
                            ${
                              isExpanded
                                ? 'bg-surface border-brand-500 ring-2 ring-brand-300/40 shadow-card'
                                : 'bg-surface border-surface-border hover:border-brand-300 hover:shadow-xs'
                            }
                          `}
                        >
                          <div>
                            {/* Card Top Row */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-sm text-charcoal-900">
                                    {skill.name}
                                  </h4>
                                  <span className="text-[10px] text-charcoal-400 font-medium">
                                    ({skill.category})
                                  </span>
                                </div>
                                <div className="text-[11px] text-charcoal-600 mt-1 line-clamp-2">
                                  {skill.whyItMatters || skill.skillContext}
                                </div>
                              </div>
                              {getSeverityBadge(skill.priorityLabel, skill.gapIntensity)}
                            </div>

                            {/* Level Progression & Prerequisites Box */}
                            <div className="mt-3 p-2.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-2 text-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-charcoal-500">Capability Delta:</span>
                                <span className="font-bold text-charcoal-900">
                                  {skill.userLevel} <span className="text-brand-600 font-extrabold">→</span> {skill.requiredLevel}
                                </span>
                              </div>

                              {/* Prerequisite and Supporting Dependencies */}
                              <div className="pt-1.5 border-t border-surface-border/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                                  {hasPrereqs ? 'Prerequisite Foundation:' : 'Related Supporting Skills:'}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {(hasPrereqs ? skill.prerequisites : ['Core Logic', 'Relational Basics']).map((p) => (
                                    <span
                                      key={p}
                                      className="text-[10px] px-1.5 py-0.2 rounded-xs bg-surface border border-surface-border text-charcoal-700 font-semibold"
                                    >
                                      ↳ {p}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Remediation Milestone */}
                            {skill.whatToBuild && skill.whatToBuild.length > 0 && (
                              <div className="mt-3 text-xs text-charcoal-700 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1">
                                  <BookOpen className="w-3 h-3 text-brand-600" />
                                  <span>Next Remediation Milestone:</span>
                                </span>
                                <p className="text-[11px] text-charcoal-600 leading-normal pl-3 border-l-2 border-brand-300">
                                  {skill.whatToBuild[0]}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="mt-4 pt-3 border-t border-surface-border flex flex-wrap items-center justify-between gap-2">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/skill-gaps/${skill.id}`);
                              }}
                            >
                              View Gap Details
                            </Button>

                            <Button
                              variant="primary"
                              size="xs"
                              rightIcon={<ArrowRight className="w-3 h-3" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/career-roadmap/skill/${skill.id}`);
                              }}
                            >
                              Open Learning Path
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vertical Visual Flow Connector */}
                <div className="flex items-center justify-center -my-2 relative z-10">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface border border-surface-border text-[11px] font-semibold text-charcoal-600 shadow-xs">
                    <span>Remediating gaps unlocks target role readiness</span>
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>

                {/* STAGE 3: Target Role Capability Outcome */}
                <div className="p-4 rounded-xl bg-surface border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800">
                      <Target className="w-4 h-4 text-brand-600" />
                      <span>03. Target Capability Outcome: {selectedRole}</span>
                    </div>
                    <p className="text-xs text-charcoal-600 max-w-xl">
                      Closing these {priorityGaps.length} priority gaps bridges your capability to standard production readiness benchmarks for {selectedRole}.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/dashboard/skill-gaps')}
                    >
                      Full Gap Matrix
                    </Button>
                    <Button
                      variant="brand"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/dashboard/career-roadmap')}
                    >
                      Open Career Roadmap
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillGapRemediationGraph;
