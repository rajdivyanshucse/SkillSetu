import React from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, Layers, Briefcase, MapPin, Sparkles, TrendingUp, Info } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { normalizedRoles } from '../../data/compensationData';
import { Button } from '../ui/Button';
import Badge from '../ui/Badge';

export const CompensationComparison = ({
  roleIds = [],
  onRemoveRole,
  onClearAll,
  className = '',
}) => {
  const { navigate } = useRouter();

  const comparedRoles = roleIds
    .map((id) => normalizedRoles.find((r) => r.id === id))
    .filter(Boolean);

  if (comparedRoles.length === 0) {
    return (
      <div className={`bg-surface p-6 rounded-lg border border-surface-border text-center space-y-3 ${className}`}>
        <Layers className="w-8 h-8 text-charcoal-400 mx-auto" />
        <h4 className="text-sm font-bold text-charcoal-900">No Roles Selected for Comparison</h4>
        <p className="text-xs text-charcoal-500 max-w-md mx-auto">
          Select 2 to 4 roles from the catalog above to view a neutral, side-by-side compensation comparison.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-surface p-4 sm:p-5 rounded-lg border border-surface-border shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border/70">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              Side-by-Side Role Compensation Comparison
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Neutral observational comparison across {comparedRoles.length} selected role archetypes.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200/60">
            {comparedRoles.length} / 4 Selected
          </span>
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-charcoal-500 hover:text-charcoal-800 cursor-pointer font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="py-2.5 px-3 bg-canvas-subtle/50 font-bold text-charcoal-700 w-44">
                Comparison Dimension
              </th>
              {comparedRoles.map((role) => (
                <th
                  key={role.id}
                  className="py-2.5 px-3 bg-surface font-bold text-charcoal-900 min-w-[200px]"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                        {role.category}
                      </span>
                      <span className="text-sm font-extrabold">{role.title}</span>
                    </div>
                    {onRemoveRole && (
                      <button
                        type="button"
                        onClick={() => onRemoveRole(role.id)}
                        className="text-charcoal-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                        title="Remove role"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/70">
            {/* Advertised Median */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Advertised Median
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 font-extrabold text-charcoal-900 text-sm">
                  ₹{role.medianLpa} LPA
                </td>
              ))}
            </tr>

            {/* Typical Span */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Advertised Range (P25–P75)
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 font-semibold text-charcoal-800">
                  {role.typicalRange}
                </td>
              ))}
            </tr>

            {/* Common Experience */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Tenure Band
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 text-charcoal-700">
                  {role.commonExperience}
                </td>
              ))}
            </tr>

            {/* Work Mode */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Primary Work Mode
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 text-charcoal-700">
                  {role.primaryWorkMode}
                </td>
              ))}
            </tr>

            {/* Opportunity Sample Volume */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Prototype Catalog Volume
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 text-charcoal-700">
                  {role.opportunityCount} listings
                </td>
              ))}
            </tr>

            {/* Associated Top Skills */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Core Capability Stack
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3 text-charcoal-700">
                  <div className="flex flex-wrap gap-1">
                    {role.topSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.2 rounded-xs bg-canvas-muted text-charcoal-700 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Growth / Demand Signal */}
            <tr>
              <td className="py-2.5 px-3 font-semibold text-charcoal-600 bg-canvas-subtle/40">
                Demand Signal
              </td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3">
                  <Badge variant="neutral" size="sm">
                    {role.growthSignal || 'Active'}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="py-2.5 px-3 bg-canvas-subtle/40"></td>
              {comparedRoles.map((role) => (
                <td key={role.id} className="py-2.5 px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/compensation/roles/${role.id}`)}
                    className="w-full text-xs flex items-center justify-center gap-1"
                  >
                    View Detail
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Neutral Comparison Notice */}
      <div className="pt-2 text-[11px] text-charcoal-500 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
        <span>
          SkillSetu provides side-by-side observational data. It does not rank roles, identify "winners", or recommend career paths solely on compensation.
        </span>
      </div>
    </div>
  );
};
