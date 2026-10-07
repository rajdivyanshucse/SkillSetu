import React from 'react';
import { Building2, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

export const DepartmentPlanning = ({
  departmentProjections = [],
  scenarioName = 'Growth',
  className = '',
}) => {
  return (
    <div className={`bg-surface rounded-2xl border border-surface-border shadow-2xs overflow-hidden space-y-3 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-body-sm font-bold text-charcoal-900 leading-tight">
              Departmental Headcount & Capability Projections
            </h4>
            <span className="text-[11px] text-charcoal-500">
              Department-level capacity differences under {scenarioName} scenario
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-charcoal-700 bg-canvas-subtle border border-surface-border px-2.5 py-1 rounded-md">
          {departmentProjections.length} Departments
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-canvas-subtle/60 text-charcoal-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-4">Department</th>
              <th className="py-2.5 px-3">Current Headcount</th>
              <th className="py-2.5 px-3">Projected Headcount</th>
              <th className="py-2.5 px-3">Net Difference</th>
              <th className="py-2.5 px-3">Priority Capability Vector</th>
              <th className="py-2.5 px-4 text-right">Potential Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/70 text-charcoal-800">
            {departmentProjections.map((dept) => (
              <tr key={dept.department} className="hover:bg-canvas-subtle/50 transition-colors">
                <td className="py-3 px-4 font-bold text-charcoal-900">
                  {dept.department}
                </td>

                <td className="py-3 px-3 font-mono text-charcoal-700">
                  {dept.currentHeadcount} staff
                </td>

                <td className="py-3 px-3 font-mono font-bold text-brand-700">
                  {dept.projectedHeadcount} staff
                </td>

                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                    {dept.difference}
                  </span>
                </td>

                <td className="py-3 px-3 font-medium text-charcoal-700">
                  {dept.priorityCapability}
                </td>

                <td className="py-3 px-4 text-right">
                  <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-md">
                    {dept.potentialAction}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPlanning;
