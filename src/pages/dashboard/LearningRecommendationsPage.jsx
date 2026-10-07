import React, { useState, useMemo } from 'react';
import { Target, ArrowLeft, Filter, BookOpen, Sparkles, Layers, Briefcase, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { useOnboarding } from '../../components/onboarding/OnboardingContext';
import LearningRecommendationCard from '../../components/learning/LearningRecommendationCard';
import LearningMethodology from '../../components/learning/LearningMethodology';
import LearningDisclaimer from '../../components/learning/LearningDisclaimer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { generateLearningRecommendations } from '../../utils/learningIntelligence';

export const LearningRecommendationsPage = () => {
  const { navigate } = useRouter();
  const { data: onboardingData } = useOnboarding();
  const targetRole = onboardingData?.targetRole || 'Backend Software Engineer';

  const [priorityFilter, setPriorityFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  const recommendations = useMemo(() => {
    return generateLearningRecommendations(targetRole);
  }, [targetRole]);

  const uniqueSkills = useMemo(() => {
    const set = new Set();
    recommendations.forEach((r) => set.add(r.relatedSkill));
    return ['All', ...Array.from(set)];
  }, [recommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((r) => {
      const matchPriority = priorityFilter === 'All' || r.priority === priorityFilter;
      const matchSkill = skillFilter === 'All' || r.relatedSkill === skillFilter;
      return matchPriority && matchSkill;
    });
  }, [recommendations, priorityFilter, skillFilter]);

  return (
    <DashboardLayout activeRoute="/dashboard/learning">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-5">
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/learning')}
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-brand-600 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Learning Intelligence Overview
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">
                Personalized Learning Recommendations
              </h1>
              <Badge variant="primary" size="sm">
                {filteredRecommendations.length} Recommendations
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
              Curriculum recommendations derived from active skill gaps, configured target-role expectations, and current opportunity signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/skill-gaps')}
              className="text-xs"
            >
              Skill Gaps Analysis →
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 rounded-lg bg-surface border border-surface-border shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-charcoal-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Priority:
            </span>
            {['All', 'High', 'Medium'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-brand-600 text-white font-bold'
                    : 'bg-canvas-subtle text-charcoal-700 hover:bg-canvas-muted border border-surface-border'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-charcoal-500 font-semibold">Skill:</span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="py-1 px-2.5 bg-canvas border border-surface-border rounded text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {uniqueSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecommendations.map((rec) => (
            <LearningRecommendationCard
              key={rec.id}
              recommendation={rec}
              onStart={(r) => {
                if (r.pathId) {
                  navigate(`/dashboard/learning/path/${r.pathId}`);
                }
              }}
            />
          ))}
        </div>

        {/* Methodology & Disclaimer */}
        <LearningMethodology />
        <LearningDisclaimer />
      </div>
    </DashboardLayout>
  );
};

export default LearningRecommendationsPage;
