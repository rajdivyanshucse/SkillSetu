import React from 'react';
import { Sparkles, TrendingUp, MapPin, Layers, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { opportunityMarketSignals } from '../../data/opportunityData';

export const OpportunityIntelligence = ({ className = '' }) => {
  const { topRoleCategories, commonSkillSignals, locationSignals } = opportunityMarketSignals;

  return (
    <Card className={`p-5 space-y-4 bg-surface ${className}`}>
      <CardHeader className="p-0 pb-3 border-b border-surface-border">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle>Opportunity Intelligence</CardTitle>
              <CardDescription>
                Aggregated signals across relevant backend and engineering opportunities.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            Signal Synthesis
          </span>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Top Role Categories */}
        <div className="p-3.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
            <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
            <span>Top Role Distributions</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {topRoleCategories.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-charcoal-700">
                <span className="text-[11px] font-medium truncate">{item.name}</span>
                <span className="font-mono text-[11px] font-bold text-brand-800 bg-surface px-1.5 py-0.2 rounded-xs border border-surface-border">
                  {item.share}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Skill Signals */}
        <div className="p-3.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span>In-Demand Skill Signals</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {commonSkillSignals.map((item) => (
              <div
                key={item.name}
                className="p-1.5 rounded-xs bg-surface border border-surface-border flex items-center justify-between text-[11px]"
              >
                <span className="font-semibold text-charcoal-900 truncate">{item.name}</span>
                <span className="text-[9px] font-bold text-brand-700">{item.frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location Hubs */}
        <div className="p-3.5 rounded-lg bg-canvas-subtle/80 border border-surface-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Opportunity Geographic Hubs</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {locationSignals.map((item) => (
              <div key={item.city} className="flex items-center justify-between text-charcoal-700">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[11px] font-semibold text-charcoal-900">{item.city}</span>
                  <span className="text-[10px] text-charcoal-400">({item.type})</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-charcoal-700">
                  {item.share}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Disclaimer Notice */}
      <div className="pt-2 border-t border-surface-border flex items-center gap-2 text-[11px] text-charcoal-500">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span>
          Illustrative prototype data for the SkillSetu experience — does not reflect real-time live labor market queries.
        </span>
      </div>
    </Card>
  );
};

export default OpportunityIntelligence;
