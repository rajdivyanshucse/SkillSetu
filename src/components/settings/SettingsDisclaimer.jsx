import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { SETTINGS_DISCLAIMER } from '../../data/settingsData';

export const SettingsDisclaimer = ({ type = 'individual', className = '' }) => {
  const text = SETTINGS_DISCLAIMER[type] || SETTINGS_DISCLAIMER.individual;

  return (
    <div
      className={`rounded-lg p-4 bg-canvas-subtle/80 border border-surface-border flex items-start gap-3 text-xs text-charcoal-600 leading-relaxed ${className}`}
    >
      <div className="p-1 rounded bg-stone-200/70 text-stone-700 shrink-0 mt-0.5">
        <Info className="w-3.5 h-3.5" />
      </div>
      <div>
        <span className="font-semibold text-charcoal-800">Prototype Environment Notice: </span>
        {text}
      </div>
    </div>
  );
};

export default SettingsDisclaimer;
