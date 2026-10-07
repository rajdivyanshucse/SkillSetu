import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Minus, Activity, Sparkles, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const MarketSignals = ({ marketSignals = [], className = '' }) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Market Skill Signals</CardTitle>
              <CardDescription>
                Skills appearing frequently across relevant roles.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
            Illustrative market signals
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-border text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                <th className="py-2 px-1">Competency</th>
                <th className="py-2 px-2">Demand Signal</th>
                <th className="py-2 px-2">Direction</th>
                <th className="py-2 px-1 text-right">Trajectory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {marketSignals.map((item, idx) => (
                <tr
                  key={item.skill}
                  className="hover:bg-canvas-subtle/50 transition-colors"
                >
                  <td className="py-2.5 px-1">
                    <div className="font-semibold text-charcoal-900">
                      {item.skill}
                    </div>
                    <div className="text-[10px] text-charcoal-400">
                      {item.category}
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span
                      className={`
                        inline-flex items-center px-1.5 py-0.2 rounded-xs text-[10px] font-semibold
                        ${
                          item.demand === 'High'
                            ? 'bg-brand-50 text-brand-800 border border-brand-200/60'
                            : 'bg-canvas-muted text-charcoal-600 border border-surface-border'
                        }
                      `}
                    >
                      {item.demand} Demand
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1 text-charcoal-700 font-medium">
                      {item.direction === 'Rising' ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-800 font-semibold">Rising</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-3 h-3 text-charcoal-400" />
                          <span className="text-charcoal-600">Stable</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-1 text-right font-mono font-semibold text-charcoal-700">
                    {item.trajectory}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px] text-charcoal-500">
          <span>Synthesized across target engineering archetypes</span>
          <span className="text-charcoal-400">Mock Data Telemetry</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSignals;
