import React, { useState } from 'react';
import { Compass, Plus, X, Check, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { futureSkillCategories } from '../../data/organizationData';

export const FutureSkillSelector = ({
  futureSkills = [],
  onAddFutureSkill,
  onUpdateFutureSkill,
  onRemoveFutureSkill,
}) => {
  const [customFutureSkill, setCustomFutureSkill] = useState('');

  const importanceLevels = ['Low', 'Medium', 'High', 'Critical'];
  const horizons = ['0–12 months', '1–2 years', '2–3 years', '3+ years'];

  const handleTogglePreset = (skillName) => {
    const isAlready = futureSkills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );

    if (isAlready) {
      onRemoveFutureSkill(skillName);
    } else {
      onAddFutureSkill({
        name: skillName,
        category: 'Future Competency',
        currentImportance: 'Medium',
        futureImportance: 'Critical',
        horizon: '0–12 months',
      });
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customFutureSkill.trim()) return;
    onAddFutureSkill({
      name: customFutureSkill.trim(),
      category: 'Emerging Skill',
      currentImportance: 'Medium',
      futureImportance: 'High',
      horizon: '1–2 years',
    });
    setCustomFutureSkill('');
  };

  return (
    <div className="space-y-6">
      {/* Preset Quick-Add Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Select Emerging & Strategic Skills
        </label>
        <p className="text-xs text-charcoal-500">
          Identify technologies and capabilities that will drive your organization's roadmap over the next 1–3 years.
        </p>

        <div className="flex items-center flex-wrap gap-2 pt-1">
          {futureSkillCategories.map((sk) => {
            const isSelected = futureSkills.some(
              (s) => s.name.toLowerCase() === sk.toLowerCase()
            );
            return (
              <button
                key={sk}
                type="button"
                onClick={() => handleTogglePreset(sk)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border cursor-pointer
                  ${
                    isSelected
                      ? 'bg-brand-100 text-brand-900 border-brand-300 shadow-2xs'
                      : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:border-surface-border-strong'
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

        {/* Custom Add */}
        <form onSubmit={handleAddCustom} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={customFutureSkill}
            onChange={(e) => setCustomFutureSkill(e.target.value)}
            placeholder="Add custom future skill (e.g. Vector Databases, Quantum Computing)..."
            className="px-3 py-1.5 text-xs bg-surface border border-surface-border rounded-md text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden max-w-sm flex-1"
          />
          <Button type="submit" variant="outline" size="xs">
            Add Skill
          </Button>
        </form>
      </div>

      {/* Configured Future Skills List */}
      <div className="space-y-3 pt-3 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Configured Future Capability Horizons ({futureSkills.length})
          </label>
          <span className="text-[11px] text-charcoal-500">
            Define planning horizons & criticality
          </span>
        </div>

        {futureSkills.length === 0 ? (
          <div className="p-6 text-center text-xs text-charcoal-500 bg-surface border border-surface-border rounded-xl">
            No future skills selected yet. Select from the emerging skill presets above.
          </div>
        ) : (
          <div className="space-y-3">
            {futureSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-surface border border-surface-border rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-0.5 min-w-44">
                  <h4 className="text-body-sm font-bold text-charcoal-900">
                    {skill.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-charcoal-400 uppercase">
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-3">
                  {/* Current Importance */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">
                      Current:
                    </span>
                    <select
                      value={skill.currentImportance || 'Medium'}
                      onChange={(e) =>
                        onUpdateFutureSkill(skill.name, { currentImportance: e.target.value })
                      }
                      className="px-2 py-1 text-xs font-semibold bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-800 cursor-pointer"
                    >
                      {importanceLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Future Importance */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">
                      Future:
                    </span>
                    <select
                      value={skill.futureImportance || 'Critical'}
                      onChange={(e) =>
                        onUpdateFutureSkill(skill.name, { futureImportance: e.target.value })
                      }
                      className="px-2 py-1 text-xs font-bold bg-brand-50 border border-brand-200 text-brand-800 rounded-sm cursor-pointer"
                    >
                      {importanceLevels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Horizon */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500">
                      Horizon:
                    </span>
                    <select
                      value={skill.horizon || '0–12 months'}
                      onChange={(e) =>
                        onUpdateFutureSkill(skill.name, { horizon: e.target.value })
                      }
                      className="px-2 py-1 text-xs font-semibold bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-800 cursor-pointer"
                    >
                      {horizons.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveFutureSkill(skill.name)}
                    className="p-1 rounded-sm text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                    title="Remove skill"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureSkillSelector;
