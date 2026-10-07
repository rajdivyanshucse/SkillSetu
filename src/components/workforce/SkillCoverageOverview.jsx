import React, { useState } from 'react';
import { Layers, ArrowRight, Filter, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SkillCoverageCard } from './SkillCoverageCard';
import { useRouter } from '../../router/Router';

export const SkillCoverageOverview = ({
  skills = [],
  onSelectSkill,
  className = '',
}) => {
  const { navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <Card className={`p-5 space-y-4 bg-surface ${className}`}>
      <CardHeader className="p-0 pb-3 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Workforce Skill Coverage</CardTitle>
              <CardDescription>
                Competency depth and team proficiency across technical domains.
              </CardDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="xs"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/organization/workforce')}
            className="text-xs text-brand-700"
          >
            Full Skill Inventory
          </Button>
        </div>
      </CardHeader>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-2.5 py-1 rounded-xs text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border
                ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-700 shadow-2xs'
                    : 'bg-canvas-subtle text-charcoal-700 border-surface-border hover:bg-canvas-muted'
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredSkills.slice(0, 8).map((skill) => (
          <SkillCoverageCard
            key={skill.name}
            skill={skill}
            onSelect={onSelectSkill}
          />
        ))}
      </div>
    </Card>
  );
};

export default SkillCoverageOverview;
