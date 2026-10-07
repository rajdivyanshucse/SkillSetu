import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles, ExternalLink, CalendarCheck, Briefcase } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { organizationCapabilityDevelopment } from '../../data/growthData';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';

export const OrganizationCapabilityDevelopment = ({
  capabilities = organizationCapabilityDevelopment,
  className = '',
  title = 'Aggregate Workforce Capability Progress',
  subtitle = 'Strategic capability development tracking across engineering and data business units.',
}) => {
  const { navigate } = useRouter();

  return (
    <div className={`bg-surface rounded-lg border border-surface-border shadow-xs space-y-3 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-surface-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900 tracking-tight">
              {title}
            </h3>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/organization/planning')}
            className="text-xs flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Workforce Planning Gaps
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-canvas-subtle/80 border-b border-surface-border text-charcoal-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3.5">Capability Domain</th>
              <th className="py-2.5 px-3">Unit</th>
              <th className="py-2.5 px-3">Current Coverage</th>
              <th className="py-2.5 px-3">Target</th>
              <th className="py-2.5 px-3 min-w-[140px]">Development Progress</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Development Action</th>
              <th className="py-2.5 px-3 text-right">Talent Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {capabilities.map((cap) => (
              <tr
                key={cap.id}
                className="hover:bg-canvas-subtle/50 transition-colors"
              >
                {/* Capability */}
                <td className="py-3 px-3.5 font-bold text-charcoal-900">
                  <div>
                    <span>{cap.skill}</span>
                    <span className="text-[10px] text-brand-700 font-medium block">
                      {cap.growthRate}
                    </span>
                  </div>
                </td>

                {/* Department */}
                <td className="py-3 px-3 text-charcoal-600 font-medium">
                  {cap.department}
                </td>

                {/* Current Coverage */}
                <td className="py-3 px-3 text-charcoal-900 font-bold">
                  {cap.currentCoverage}%
                </td>

                {/* Target Coverage */}
                <td className="py-3 px-3 text-charcoal-600 font-medium">
                  {cap.targetCoverage}%
                </td>

                {/* Progress */}
                <td className="py-3 px-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-charcoal-700">
                      <span>{cap.developmentProgress}%</span>
                      <span className="text-[10px] text-charcoal-500">
                        {cap.participantsCount} enrolled
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-canvas-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full"
                        style={{ width: `${cap.developmentProgress}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Priority */}
                <td className="py-3 px-3">
                  <Badge
                    variant={
                      cap.priority === 'High'
                        ? 'danger'
                        : cap.priority === 'Medium'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {cap.priority}
                  </Badge>
                </td>

                {/* Development Action */}
                <td className="py-3 px-3 text-charcoal-700 font-medium">
                  <span className="px-1.5 py-0.5 rounded-xs bg-canvas-muted text-[11px] border border-surface-border/60">
                    {cap.developmentPath}
                  </span>
                </td>

                {/* External Talent Link */}
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/organization/talent')}
                    className="text-brand-600 hover:text-brand-800 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Briefcase className="w-3 h-3" />
                    {cap.talentPoolSignal}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationCapabilityDevelopment;
