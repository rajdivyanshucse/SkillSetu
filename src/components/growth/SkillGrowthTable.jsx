import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowUpDown, Search, Edit3, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const SkillGrowthTable = ({
  skills = [],
  onUpdateSkillProgress,
  className = '',
}) => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editLevel, setEditLevel] = useState(5);

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (skill) => {
    setEditingSkillId(skill.id);
    setEditLevel(skill.currentLevel || 5);
  };

  const handleSaveEdit = (skillId) => {
    if (onUpdateSkillProgress) {
      onUpdateSkillProgress(skillId, Number(editLevel));
    }
    setEditingSkillId(null);
  };

  return (
    <div className={`bg-surface rounded-lg border border-surface-border shadow-xs space-y-3 ${className}`}>
      {/* Search and Filters Header */}
      <div className="p-4 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
            Skill Growth & Progression Matrix
          </h3>
          <p className="text-xs text-charcoal-500">
            Self-reported prototype development tracking across calibrated skills.
          </p>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-canvas-subtle/70 border border-surface-border rounded-md text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-canvas-subtle/80 border-b border-surface-border text-charcoal-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3.5">Skill / Competency</th>
              <th className="py-2.5 px-3">Starting</th>
              <th className="py-2.5 px-3">Current Level</th>
              <th className="py-2.5 px-3">Target</th>
              <th className="py-2.5 px-3 min-w-[140px]">Development Progress</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {filteredSkills.map((skill) => {
              const isEditing = editingSkillId === skill.id;

              return (
                <tr
                  key={skill.id}
                  className="hover:bg-canvas-subtle/50 transition-colors"
                >
                  {/* Skill Name */}
                  <td className="py-3 px-3.5 font-bold text-charcoal-900">
                    <div>
                      <span>{skill.name}</span>
                      <span className="text-[10px] text-charcoal-500 font-normal block">
                        {skill.category}
                      </span>
                    </div>
                  </td>

                  {/* Starting Level */}
                  <td className="py-3 px-3 text-charcoal-600 font-medium">
                    {skill.startingLevel} / 10
                  </td>

                  {/* Current Level */}
                  <td className="py-3 px-3 text-charcoal-900 font-extrabold">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={editLevel}
                          onChange={(e) => setEditLevel(e.target.value)}
                          className="w-16 accent-brand-600"
                        />
                        <span className="text-xs font-bold text-brand-700 w-4">
                          {editLevel}
                        </span>
                      </div>
                    ) : (
                      <span>{skill.currentLevel} / 10</span>
                    )}
                  </td>

                  {/* Target Level */}
                  <td className="py-3 px-3 text-charcoal-600 font-medium">
                    {skill.targetLevel} / 10
                  </td>

                  {/* Progress Bar */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-charcoal-700">
                        <span>{skill.progressPct}%</span>
                        <span className="text-[10px] text-charcoal-400">
                          {skill.completedActivities || 0}/{skill.activitiesCount || 0} activities
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-canvas-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${skill.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        skill.status.includes('Advanced')
                          ? 'success'
                          : skill.status.includes('Early')
                          ? 'warning'
                          : 'brand'
                      }
                      size="sm"
                    >
                      {skill.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(skill.id)}
                          className="px-2 py-1 bg-brand-600 text-white rounded text-[11px] font-semibold hover:bg-brand-700 cursor-pointer flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(skill)}
                          className="p-1 text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-muted rounded cursor-pointer"
                          title="Update self-reported level"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/career-roadmap')}
                        className="p-1 text-charcoal-400 hover:text-brand-600 hover:bg-canvas-muted rounded cursor-pointer"
                        title="View in roadmap"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkillGrowthTable;
