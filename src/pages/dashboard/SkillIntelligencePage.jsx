import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import { getMergedDashboardData } from '../../data/dashboardData';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { SkillGapRemediationGraph } from '../../components/skill-gaps/SkillGapRemediationGraph';

export const SkillIntelligencePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();
  const { data: onboardingData, calculateCompleteness } = useOnboarding();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const completeness = calculateCompleteness ? calculateCompleteness() : 92;
  const dashboardData = getMergedDashboardData(onboardingData, completeness);

  const allSkills = dashboardData.skills || [];

  // Distribution calculation
  const distribution = {
    Expert: allSkills.filter((s) => s.proficiency === 'Expert').length,
    Advanced: allSkills.filter((s) => s.proficiency === 'Advanced').length,
    Intermediate: allSkills.filter((s) => s.proficiency === 'Intermediate').length,
    Beginner: allSkills.filter((s) => s.proficiency === 'Beginner').length,
  };

  const categories = ['All', ...new Set(allSkills.map((s) => s.category).filter(Boolean))];

  const filteredSkills = allSkills.filter((s) => {
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleExploreGaps = () => {
    navigate('/dashboard/skill-gaps');
  };

  return (
    <DashboardLayout
      activeRoute="/dashboard/skill-intelligence"
      breadcrumbItems={[
        { label: 'Individual Workspace' },
        { label: 'Intelligence' },
        { label: 'Skill Intelligence' },
      ]}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              <span>Competency Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Skill Intelligence
            </h1>
            <p className="text-body-sm text-charcoal-600 max-w-xl">
              Understand the strengths and development areas in your current skill profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleExploreGaps}
            >
              Explore Skill Gaps
            </Button>
          </div>
        </div>

        {/* Highlight Intelligence Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Skill Coverage
            </span>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-charcoal-900">
                {dashboardData.skillCoverage.overallPercentage}%
              </span>
              <p className="text-xs text-charcoal-500 mt-1">
                Target Role Alignment
              </p>
            </div>
            <div className="pt-2 border-t border-surface-border text-xs text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Calibration active</span>
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Strongest Area
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold text-brand-800">
                {dashboardData.skillCoverage.strongestCategory}
              </span>
              <p className="text-xs text-charcoal-500 mt-1">
                Deepest declared competency
              </p>
            </div>
            <div className="pt-2 border-t border-surface-border text-xs text-charcoal-600">
              Languages: Java, JavaScript
            </div>
          </Card>

          <Card className="p-5 flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500">
              Development Area
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold text-amber-800">
                {dashboardData.skillCoverage.developmentCategory}
              </span>
              <p className="text-xs text-charcoal-500 mt-1">
                High-priority focus area
              </p>
            </div>
            <div className="pt-2 border-t border-surface-border text-xs text-amber-700 font-semibold">
              Gaps: AWS, Docker
            </div>
          </Card>
        </div>

        {/* Proficiency Distribution & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proficiency Distribution */}
          <Card className="p-5 flex flex-col justify-between lg:col-span-1">
            <CardHeader className="p-0 pb-3">
              <CardTitle>Proficiency Distribution</CardTitle>
              <CardDescription>
                Breakdown of {allSkills.length} self-rated competencies.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 space-y-3 pt-2">
              {[
                { level: 'Expert', count: distribution.Expert, color: 'bg-brand-700' },
                { level: 'Advanced', count: distribution.Advanced, color: 'bg-brand-500' },
                { level: 'Intermediate', count: distribution.Intermediate, color: 'bg-brand-400' },
                { level: 'Beginner', count: distribution.Beginner, color: 'bg-amber-500' },
              ].map((item) => (
                <div key={item.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-charcoal-900">{item.level}</span>
                    <span className="text-charcoal-600 font-bold">{item.count} skills</span>
                  </div>
                  <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{
                        width: `${allSkills.length > 0 ? (item.count / allSkills.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="pt-3 mt-4 border-t border-surface-border text-[11px] text-charcoal-500">
              Update ratings anytime from Profile Calibration.
            </div>
          </Card>

          {/* Competency Inventory Detail Table / Grid */}
          <Card className="p-5 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div>
                  <CardTitle>Skill Inventory</CardTitle>
                  <CardDescription>
                    All skills mapped into your baseline graph.
                  </CardDescription>
                </div>

                {/* Filter and search */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-2.5 py-1 text-xs rounded-sm bg-canvas-subtle border border-surface-border focus:outline-none focus:border-brand-500 w-32 sm:w-40"
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 py-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-2.5 py-1 rounded-xs text-[11px] font-semibold transition-colors cursor-pointer
                      ${
                        selectedCategory === cat
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-h-80 overflow-y-auto">
                {filteredSkills.map((s) => (
                  <div
                    key={s.name}
                    className="p-3 rounded-md bg-canvas-subtle/70 border border-surface-border flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-charcoal-900">{s.name}</div>
                      <div className="text-[10px] text-charcoal-400">{s.category || 'General'}</div>
                    </div>
                    <span
                      className={`
                        text-[10px] px-2 py-0.5 rounded-xs font-semibold
                        ${
                          s.proficiency === 'Expert' || s.proficiency === 'Advanced'
                            ? 'bg-brand-100 text-brand-900 border border-brand-200'
                            : s.proficiency === 'Intermediate'
                            ? 'bg-canvas-muted text-charcoal-800 border border-surface-border'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }
                      `}
                    >
                      {s.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-charcoal-500">
              <span>Showing {filteredSkills.length} of {allSkills.length} competencies</span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => navigate('/onboarding/skills')}
              >
                Edit Skills
              </Button>
            </div>
          </Card>
        </div>

        {/* Real Skill Gap Remediation & Prerequisite Graph */}
        <SkillGapRemediationGraph
          userSkills={allSkills}
          initialTargetRole={dashboardData.profile?.targetRole || 'Backend Software Engineer'}
        />
      </div>
    </DashboardLayout>
  );
};

export default SkillIntelligencePage;
