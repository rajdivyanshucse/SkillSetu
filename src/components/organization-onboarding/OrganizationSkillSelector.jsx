import React, { useState } from 'react';
import { Sparkles, Plus, X, Layers, Check, Info, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { organizationSkillCategories } from '../../data/organizationData';

export const OrganizationSkillSelector = ({
  skills = [],
  onAddSkill,
  onUpdateSkill,
  onRemoveSkill,
  errors = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Programming');
  const [customSkillName, setCustomSkillName] = useState('');

  const categories = Object.keys(organizationSkillCategories);
  const currentCategorySkills = organizationSkillCategories[selectedCategory] || [];

  const capabilityLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleToggleCategorySkill = (skillName) => {
    const isAlreadySelected = skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );

    if (isAlreadySelected) {
      onRemoveSkill(skillName);
    } else {
      onAddSkill({
        name: skillName,
        category: selectedCategory,
        capabilityLevel: 'Intermediate',
        coveragePct: 50,
      });
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customSkillName.trim()) return;
    onAddSkill({
      name: customSkillName.trim(),
      category: selectedCategory,
      capabilityLevel: 'Intermediate',
      coveragePct: 50,
    });
    setCustomSkillName('');
  };

  return (
    <div className="space-y-6">
      {/* Scope Disclaimer Notice */}
      <div className="p-3.5 rounded-lg bg-brand-50/70 border border-brand-200/80 flex items-start gap-2.5 text-xs text-charcoal-700">
        <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-brand-900">Workforce Inventory Scope:</strong> Map organization-level workforce competencies and approximate coverage percentages. This is an aggregate capability model for your company, not an individual profile.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Select Capability Category
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const countInCat = skills.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border
                  ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-700 shadow-xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
                  }
                `}
              >
                {cat} {countInCat > 0 && `(${countInCat})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Skills in Active Category */}
      <div className="p-4 bg-canvas-subtle/70 rounded-xl border border-surface-border space-y-3">
        <span className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block">
          Available {selectedCategory} Competencies (Click to add/remove)
        </span>

        <div className="flex items-center flex-wrap gap-2">
          {currentCategorySkills.map((sk) => {
            const isSelected = skills.some(
              (s) => s.name.toLowerCase() === sk.toLowerCase()
            );
            return (
              <button
                key={sk}
                type="button"
                onClick={() => handleToggleCategorySkill(sk)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-100 text-brand-900 border-brand-300 shadow-2xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-surface hover:border-brand-300'
                  }
                `}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-brand-700" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-charcoal-400" />
                )}
                <span>{sk}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Skill Add */}
        <form onSubmit={handleAddCustom} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={customSkillName}
            onChange={(e) => setCustomSkillName(e.target.value)}
            placeholder={`Add other ${selectedCategory} skill...`}
            className="px-3 py-1.5 text-xs bg-surface border border-surface-border rounded-md text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden max-w-xs flex-1"
          />
          <Button type="submit" variant="outline" size="xs">
            Add Custom Skill
          </Button>
        </form>
      </div>

      {/* Selected Skills Inventory Table / Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Selected Workforce Skills Inventory ({skills.length})
          </label>
          <span className="text-[11px] text-charcoal-500">
            Set team capability & coverage %
          </span>
        </div>

        {skills.length === 0 ? (
          <div className="p-6 text-center text-xs text-charcoal-500 bg-surface border border-surface-border rounded-xl">
            No skills selected yet. Choose competencies from the categories above.
          </div>
        ) : (
          <div className="space-y-2.5">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="p-3.5 bg-surface border border-surface-border rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-44">
                  <div className="flex items-center gap-2">
                    <h4 className="text-body-sm font-bold text-charcoal-900">
                      {skill.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-charcoal-400 uppercase">
                      {skill.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-4">
                  {/* Capability Level */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">
                      Level:
                    </span>
                    <select
                      value={skill.capabilityLevel || 'Intermediate'}
                      onChange={(e) =>
                        onUpdateSkill(skill.name, { capabilityLevel: e.target.value })
                      }
                      className="px-2 py-1 text-xs font-semibold bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-800 cursor-pointer"
                    >
                      {capabilityLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Coverage Percentage */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">
                      Coverage:
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="5"
                        max="100"
                        step="5"
                        value={skill.coveragePct || 50}
                        onChange={(e) =>
                          onUpdateSkill(skill.name, {
                            coveragePct: Math.min(
                              100,
                              Math.max(5, parseInt(e.target.value, 10) || 5)
                            ),
                          })
                        }
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-900"
                      />
                      <span className="text-xs text-charcoal-500">%</span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveSkill(skill.name)}
                    className="p-1 rounded-sm text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove skill"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.skills && (
          <p className="text-xs text-rose-600 font-medium">{errors.skills}</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationSkillSelector;
