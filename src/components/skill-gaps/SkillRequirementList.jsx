import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { SkillGapFilters } from './SkillGapFilters';

export const SkillRequirementList = ({
  skills = [],
  onSelectSkill,
  className = '',
}) => {
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');

  const categories = ['All', ...new Set(skills.map((s) => s.category).filter(Boolean))];

  // Filtering
  const filteredSkills = skills.filter((s) => {
    // Status filter
    if (activeStatus === 'Priority' && !s.isPriority) return false;
    if (activeStatus === 'Developing' && !s.isDeveloping) return false;
    if (activeStatus === 'Aligned' && !s.isAligned) return false;

    // Category filter
    if (activeCategory !== 'All' && s.category !== activeCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCat = (s.category || '').toLowerCase().includes(q);
      const matchWhy = (s.whyItMatters || '').toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchWhy) return false;
    }

    return true;
  });

  // Sorting
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.priorityScore - a.priorityScore || b.gapScore - a.gapScore;
    }
    if (sortBy === 'gap') {
      return b.gapScore - a.gapScore || b.priorityScore - a.priorityScore;
    }
    if (sortBy === 'importance') {
      const impWeight = (v) => (v === 'High' ? 3 : v === 'Medium' ? 2 : 1);
      return impWeight(b.roleImportance) - impWeight(a.roleImportance);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const getGapBadge = (gapIntensity) => {
    if (gapIntensity === 'Aligned') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Aligned
        </span>
      );
    }
    if (gapIntensity === 'High') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-xs border border-rose-200">
          <AlertCircle className="w-3 h-3 text-rose-600" />
          High Gap
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
        <Sparkles className="w-3 h-3 text-amber-600" />
        Medium Gap
      </span>
    );
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Target Role Skill Requirements</CardTitle>
            <CardDescription>
              Complete requirement matrix benchmarking your declared profile against target standards.
            </CardDescription>
          </div>

          <span className="text-xs font-semibold text-charcoal-500">
            Showing {sortedSkills.length} of {skills.length} Competencies
          </span>
        </div>

        {/* Integrated Filter Bar */}
        <div className="pt-3">
          <SkillGapFilters
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Desktop View: Clean Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                <th className="py-2.5 px-3">Competency</th>
                <th className="py-2.5 px-3">Your Level</th>
                <th className="py-2.5 px-3">Target Level</th>
                <th className="py-2.5 px-3">Gap Status</th>
                <th className="py-2.5 px-3">Role Importance</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/70">
              {sortedSkills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-charcoal-500">
                    No matching requirements found for current filter criteria.
                  </td>
                </tr>
              ) : (
                sortedSkills.map((s) => (
                  <tr
                    key={s.id || s.name}
                    className="hover:bg-canvas-subtle/60 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-xs text-charcoal-900">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-charcoal-400">
                        {s.category}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-charcoal-700">
                      {s.userLevel}
                    </td>
                    <td className="py-3 px-3 font-bold text-brand-800">
                      {s.requiredLevel}
                    </td>
                    <td className="py-3 px-3">
                      {getGapBadge(s.gapIntensity)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-charcoal-700">
                        {s.roleImportance}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="xs"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        onClick={() => onSelectSkill && onSelectSkill(s)}
                        className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Stacked Responsive Cards */}
        <div className="md:hidden space-y-3">
          {sortedSkills.length === 0 ? (
            <div className="p-6 text-center text-xs text-charcoal-500">
              No matching requirements found.
            </div>
          ) : (
            sortedSkills.map((s) => (
              <div
                key={s.id || s.name}
                className="p-3.5 rounded-lg bg-canvas-subtle/70 border border-surface-border space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400">
                      {s.category}
                    </span>
                    <h4 className="text-body-sm font-bold text-charcoal-900 mt-0.5">
                      {s.name}
                    </h4>
                  </div>
                  {getGapBadge(s.gapIntensity)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-surface-border">
                  <div>
                    <span className="text-[10px] text-charcoal-400 uppercase block font-semibold">
                      Your Level
                    </span>
                    <span className="font-semibold text-charcoal-800">
                      {s.userLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-600 uppercase block font-bold">
                      Target Level
                    </span>
                    <span className="font-bold text-brand-800">
                      {s.requiredLevel}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-500 font-medium">
                    Importance: {s.roleImportance}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                    onClick={() => onSelectSkill && onSelectSkill(s)}
                  >
                    Inspect Detail
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRequirementList;
