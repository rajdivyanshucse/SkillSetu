import React from 'react';
import { Layers, ArrowRight, UserPlus, BookOpen, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';
import { useRouter } from '../../router/Router';

export const CapabilityGapTable = ({
  capabilities = [],
  className = '',
}) => {
  const { navigate } = useRouter();

  const getActionBadge = (action) => {
    if (action.includes('Hire') && action.includes('Upskill')) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent-50 text-accent-800 border border-accent-200">
          {action}
        </span>
      );
    }
    if (action.includes('Hire')) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
          {action}
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
        {action}
      </span>
    );
  };

  return (
    <div className={`bg-surface rounded-2xl border border-surface-border shadow-2xs overflow-hidden space-y-3 ${className}`}>
      {/* Table Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-charcoal-900 leading-tight">
              Capability Gap & Potential Action Matrix
            </h4>
            <span className="text-[11px] text-charcoal-500">
              Granular capacity delta calculations and potential workforce interventions
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-charcoal-700 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          {capabilities.length} Capabilities
        </span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-canvas-subtle/60 text-charcoal-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">Capability Domain</th>
              <th className="py-2.5 px-3">Current Capacity</th>
              <th className="py-2.5 px-3">Projected Requirement</th>
              <th className="py-2.5 px-3">Capacity Gap</th>
              <th className="py-2.5 px-3">Future Importance</th>
              <th className="py-2.5 px-3">Coverage</th>
              <th className="py-2.5 px-3">Potential Action</th>
              <th className="py-2.5 px-4 text-right">Talent Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
            {capabilities.map((cap) => (
              <tr key={cap.id} className="hover:bg-canvas-subtle/50 transition-colors">
                <td className="py-3 px-4 font-bold text-charcoal-900">
                  <div className="flex flex-col">
                    <span>{cap.name}</span>
                    <span className="text-[10px] text-charcoal-400 font-normal">{cap.category}</span>
                  </div>
                </td>

                <td className="py-3 px-3 font-mono font-bold text-charcoal-800">
                  {cap.currentCapacity} units
                </td>

                <td className="py-3 px-3 font-mono font-bold text-brand-700">
                  {cap.projectedRequirement} units
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-danger-700 bg-danger-50 border border-danger-200 px-2 py-0.5 rounded-md text-[11px]">
                    +{cap.capacityGap}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className="font-semibold text-charcoal-700">
                    {cap.importance}
                  </span>
                </td>

                <td className="py-3 px-3 font-mono text-charcoal-700">
                  {cap.currentCoveragePct}%
                </td>

                <td className="py-3 px-3">
                  {getActionBadge(cap.defaultAction)}
                </td>

                <td className="py-3 px-4 text-right">
                  {cap.talentPoolSignalCount > 0 ? (
                    <button
                      type="button"
                      onClick={() => navigate('/organization/talent')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 cursor-pointer"
                      title="Explore matching candidate profiles in Talent Discovery"
                    >
                      <span>{cap.talentPoolSignalCount} in Pool</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-charcoal-400 text-[11px]">Internal Only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CapabilityGapTable;
