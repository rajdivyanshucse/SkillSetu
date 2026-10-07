import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Layers, CheckCircle2, Info } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { SETTINGS_METHODOLOGY } from '../../data/settingsData';

export const SettingsMethodology = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-surface-border bg-surface overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-canvas-subtle/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-body-sm font-bold text-charcoal-900 font-serif">
                {SETTINGS_METHODOLOGY.title}
              </h4>
              <Badge variant="outline" className="text-[10px] bg-stone-50 text-charcoal-600 border-stone-200">
                Transparent Settings Model
              </Badge>
            </div>
            <p className="text-caption text-charcoal-500 mt-0.5">
              How user configurations and privacy boundaries dynamically recalibrate intelligence layers
            </p>
          </div>
        </div>

        <div className="text-charcoal-400 p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-surface-border space-y-4 text-xs text-charcoal-700">
          <div className="p-3 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-1.5 font-mono text-[11px]">
            <div className="text-charcoal-500 font-sans uppercase font-bold text-[10px] tracking-wider">
              Settings Formulation
            </div>
            <div className="text-brand-800 font-semibold">{SETTINGS_METHODOLOGY.equation}</div>
            <div className="text-charcoal-600 pt-1 border-t border-stone-200/60 font-sans text-xs">
              <strong>Pipeline:</strong> {SETTINGS_METHODOLOGY.pipeline}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {SETTINGS_METHODOLOGY.steps.map((st) => (
              <div
                key={st.step}
                className="p-3 rounded-lg border border-surface-border bg-white flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px]">
                    {st.step}
                  </span>
                  <span className="font-bold text-charcoal-900 text-xs">{st.title}</span>
                </div>
                <p className="text-charcoal-600 text-[11px] leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SettingsMethodology;
