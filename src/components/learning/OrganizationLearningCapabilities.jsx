import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Sparkles, Users, Briefcase, CalendarCheck } from 'lucide-react';
import { useRouter } from '../../router/Router';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import { organizationLearningCapabilities } from '../../data/learningData';

export const OrganizationLearningCapabilities = ({
  capabilities = organizationLearningCapabilities,
}) => {
  const { navigate } = useRouter();

  if (!capabilities || capabilities.length === 0) return null;

  return (
    <div className="p-5 rounded-lg bg-surface border border-surface-border shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-body-sm font-bold text-charcoal-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            Workforce Capability Learning & Gap Resolution
          </h3>
          <p className="text-xs text-charcoal-500">
            Current workforce coverage vs. target requirements and active training pipeline capacity
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/organization/planning')}
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Workforce Planning Scenarios</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-border text-charcoal-500 bg-canvas-subtle/50 text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 font-bold">Capability / Domain</th>
              <th className="py-2.5 px-3 font-bold">Current Coverage</th>
              <th className="py-2.5 px-3 font-bold">Target Coverage</th>
              <th className="py-2.5 px-3 font-bold">Learning Coverage</th>
              <th className="py-2.5 px-3 font-bold">Gap Delta</th>
              <th className="py-2.5 px-3 font-bold">Priority</th>
              <th className="py-2.5 px-3 font-bold">Potential Action</th>
              <th className="py-2.5 px-3 font-bold text-right">Planning Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {capabilities.map((cap) => (
              <tr key={cap.id} className="hover:bg-canvas-subtle/40 transition-colors">
                {/* Capability */}
                <td className="py-3 px-3">
                  <span className="font-bold text-charcoal-900 block">{cap.skill}</span>
                  <span className="text-[10px] text-charcoal-500">{cap.participantsCount} engineers enrolled</span>
                </td>

                {/* Current */}
                <td className="py-3 px-3 font-mono font-semibold text-charcoal-700">
                  {cap.currentCoverage}%
                </td>

                {/* Target */}
                <td className="py-3 px-3 font-mono font-semibold text-brand-800">
                  {cap.targetCoverage}%
                </td>

                {/* Learning Coverage */}
                <td className="py-3 px-3">
                  <div className="space-y-1">
                    <span className="font-mono font-bold text-emerald-800 text-[11px] block">
                      {cap.learningCoverage}%
                    </span>
                    <div className="w-16 h-1 bg-canvas-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${cap.learningCoverage}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Gap Delta */}
                <td className="py-3 px-3 font-mono font-bold text-amber-700">
                  -{cap.capabilityGap} pts
                </td>

                {/* Priority */}
                <td className="py-3 px-3">
                  <Badge
                    variant={cap.priority === 'High' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {cap.priority}
                  </Badge>
                </td>

                {/* Action */}
                <td className="py-3 px-3">
                  <span className="font-medium text-charcoal-800 text-[11px] px-2 py-0.5 rounded bg-canvas-subtle border border-surface-border">
                    {cap.potentialAction}
                  </span>
                </td>

                {/* Link */}
                <td className="py-3 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => navigate('/organization/planning')}
                    className="text-brand-600 hover:text-brand-800 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Plan</span>
                    <ArrowRight className="w-3 h-3" />
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

export default OrganizationLearningCapabilities;
