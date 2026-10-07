import React, { useState, useEffect } from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { planningHorizons } from '../../data/workforcePlanningData';
import { useToast } from '../ui/Toast';

export const ScenarioConfigurator = ({
  isOpen,
  onClose,
  currentScenario,
  onSaveConfiguration,
}) => {
  const { addToast } = useToast();

  const [horizonMonths, setHorizonMonths] = useState(24);
  const [growthPercent, setGrowthPercent] = useState(15);
  const [demandMultiplier, setDemandMultiplier] = useState(1.25);
  const [attrition, setAttrition] = useState('Moderate (12%)');
  const [actionMix, setActionMix] = useState({
    hiring: 45,
    upskilling: 40,
    reskilling: 5,
    internalMobility: 10,
  });

  useEffect(() => {
    if (currentScenario) {
      setHorizonMonths(currentScenario.horizonMonths || 24);
      setGrowthPercent(Math.round((currentScenario.growthRate || 0.15) * 100));
      setDemandMultiplier(currentScenario.skillDemandMultiplier || 1.25);
      setAttrition(currentScenario.attritionAssumption || 'Moderate (12%)');
      setActionMix(currentScenario.defaultActionMix || {
        hiring: 45,
        upskilling: 40,
        reskilling: 5,
        internalMobility: 10,
      });
    }
  }, [currentScenario, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMixChange = (key, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    setActionMix((prev) => ({
      ...prev,
      [key]: num,
    }));
  };

  const handleSave = () => {
    const updated = {
      ...currentScenario,
      horizonMonths,
      horizon: `${horizonMonths} Months`,
      growthRate: growthPercent / 100,
      workforceGrowth: `+${growthPercent}%`,
      skillDemandMultiplier: parseFloat(demandMultiplier),
      attritionAssumption: attrition,
      defaultActionMix: actionMix,
    };

    if (onSaveConfiguration) {
      onSaveConfiguration(updated);
    }
    addToast({
      title: 'Planning Scenario Updated',
      message: 'Configured assumptions successfully calibrated for the workspace.',
      type: 'success',
      duration: 3000,
    });
    onClose();
  };

  const totalMix = (actionMix.hiring || 0) + (actionMix.upskilling || 0) + (actionMix.reskilling || 0) + (actionMix.internalMobility || 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="configurator-title"
    >
      <div className="bg-surface border border-surface-border rounded-2xl max-w-lg w-full shadow-modal p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 id="configurator-title" className="text-body font-bold text-charcoal-900 leading-tight">
                Scenario Assumption Configurator
              </h3>
              <p className="text-[11px] text-charcoal-500">
                Calibrate planning parameters for {currentScenario?.name || 'Scenario'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-800 hover:bg-canvas-subtle transition-colors cursor-pointer"
            aria-label="Close configurator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* Horizon Selection */}
          <div className="space-y-1.5">
            <label className="text-charcoal-700 font-bold block">
              Planning Horizon
            </label>
            <div className="grid grid-cols-3 gap-2">
              {planningHorizons.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHorizonMonths(h.value)}
                  className={`
                    p-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer
                    ${
                      horizonMonths === h.value
                        ? 'bg-brand-50 text-brand-800 border-brand-300 shadow-2xs font-bold'
                        : 'bg-canvas-subtle text-charcoal-700 border-surface-border hover:bg-canvas-muted'
                    }
                  `}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Workforce Growth */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-charcoal-700 font-bold">
                Workforce Growth Assumption: <span className="font-mono text-brand-700">+{growthPercent}%</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={growthPercent}
              onChange={(e) => setGrowthPercent(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 font-mono">
              <span>0% (Flat)</span>
              <span>+10%</span>
              <span>+25% (Rapid)</span>
            </div>
          </div>

          {/* Skill Demand Multiplier */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-charcoal-700 font-bold">
                Skill Demand Multiplier: <span className="font-mono text-brand-700">{demandMultiplier}x</span>
              </label>
            </div>
            <input
              type="range"
              min="0.9"
              max="1.5"
              step="0.05"
              value={demandMultiplier}
              onChange={(e) => setDemandMultiplier(parseFloat(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal-400 font-mono">
              <span>0.9x (Conservative)</span>
              <span>1.2x (Standard)</span>
              <span>1.5x (Accelerated)</span>
            </div>
          </div>

          {/* Action Mix Breakdown */}
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <div className="flex justify-between items-center">
              <label className="text-charcoal-700 font-bold">
                Action Mix Allocations
              </label>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs ${totalMix === 100 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                Total: {totalMix}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-charcoal-500 block mb-1">External Hiring (%)</span>
                <input
                  type="number"
                  value={actionMix.hiring}
                  onChange={(e) => handleMixChange('hiring', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-subtle rounded-lg border border-surface-border font-mono font-bold text-charcoal-900"
                />
              </div>
              <div>
                <span className="text-[11px] text-charcoal-500 block mb-1">Internal Upskilling (%)</span>
                <input
                  type="number"
                  value={actionMix.upskilling}
                  onChange={(e) => handleMixChange('upskilling', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-subtle rounded-lg border border-surface-border font-mono font-bold text-charcoal-900"
                />
              </div>
              <div>
                <span className="text-[11px] text-charcoal-500 block mb-1">Internal Mobility (%)</span>
                <input
                  type="number"
                  value={actionMix.internalMobility}
                  onChange={(e) => handleMixChange('internalMobility', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-subtle rounded-lg border border-surface-border font-mono font-bold text-charcoal-900"
                />
              </div>
              <div>
                <span className="text-[11px] text-charcoal-500 block mb-1">Reskilling Pathways (%)</span>
                <input
                  type="number"
                  value={actionMix.reskilling}
                  onChange={(e) => handleMixChange('reskilling', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-canvas-subtle rounded-lg border border-surface-border font-mono font-bold text-charcoal-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-surface-border">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Apply Scenario Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioConfigurator;
