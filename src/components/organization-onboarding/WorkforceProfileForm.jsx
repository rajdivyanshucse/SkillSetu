import React from 'react';
import { Users, Info, TrendingUp, Award } from 'lucide-react';
import { Card } from '../ui/Card';

export const WorkforceProfileForm = ({
  workforceData,
  onChange,
  errors = {},
}) => {
  const departments = workforceData.departments || {
    Engineering: 120,
    Product: 30,
    Sales: 45,
    Marketing: 20,
    Finance: 15,
    HR: 12,
    Operations: 60,
    'Data & Analytics': 20,
    Other: 10,
  };

  const experienceDistribution = workforceData.experienceDistribution || {
    '0–2 years': '25%',
    '3–5 years': '40%',
    '6–10 years': '25%',
    '10+ years': '10%',
  };

  const handleDeptCountChange = (deptName, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = {
      ...departments,
      [deptName]: num,
    };
    onChange({ departments: updated });
  };

  const handleExpChange = (expKey, val) => {
    const updated = {
      ...experienceDistribution,
      [expKey]: val,
    };
    onChange({ experienceDistribution: updated });
  };

  const totalCalculatedEmployees = Object.values(departments).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Total Workforce Banner */}
      <div className="bg-surface border border-brand-200 rounded-xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Total Estimated Workforce
            </h3>
          </div>
          <p className="text-xs text-charcoal-600">
            Automatically tallied across your organizational departments.
          </p>
        </div>

        <div className="text-right sm:text-center p-3 rounded-lg bg-canvas-subtle border border-surface-border min-w-32">
          <span className="text-3xl font-black text-brand-700 font-mono block">
            {totalCalculatedEmployees}
          </span>
          <span className="text-[10px] uppercase font-bold text-charcoal-400">
            Active Employees
          </span>
        </div>
      </div>

      {/* Approximate Notice */}
      <div className="p-3 rounded-lg bg-canvas-subtle/80 border border-surface-border flex items-center gap-2 text-xs text-charcoal-600">
        <Info className="w-4 h-4 text-charcoal-400 shrink-0" />
        <span>
          Use approximate workforce counts for this prototype. Exact headcounts can be synced via HRIS in future phases.
        </span>
      </div>

      {/* Department Breakdown Inputs */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Workforce Distribution by Department
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(departments).map(([dept, count]) => (
            <div
              key={dept}
              className="p-3 bg-surface border border-surface-border rounded-lg flex items-center justify-between gap-3 shadow-2xs hover:border-surface-border-strong transition-colors"
            >
              <span className="text-xs font-semibold text-charcoal-800 truncate">
                {dept}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  min="0"
                  value={count}
                  onChange={(e) => handleDeptCountChange(dept, e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-mono font-bold text-right bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
                />
                <span className="text-[10px] text-charcoal-400">ppl</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Distribution */}
      <div className="space-y-3 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Workforce Seniority & Experience Breakdown
          </label>
          <span className="text-[11px] text-charcoal-500">
            Approximate team tenure proportions
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(experienceDistribution).map(([bracket, pct]) => (
            <div
              key={bracket}
              className="p-3 bg-surface border border-surface-border rounded-lg space-y-1.5 shadow-2xs"
            >
              <span className="text-[11px] font-bold text-charcoal-700 block truncate">
                {bracket}
              </span>
              <input
                type="text"
                value={pct}
                onChange={(e) => handleExpChange(bracket, e.target.value)}
                placeholder="e.g. 30%"
                className="w-full px-2 py-1 text-xs font-mono font-bold bg-canvas-subtle border border-surface-border rounded-sm text-charcoal-900 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes / Growth Context */}
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
          Workforce Scaling Notes & Objectives
        </label>
        <textarea
          rows={2}
          value={workforceData.workforceNotes || ''}
          onChange={(e) => onChange({ workforceNotes: e.target.value })}
          placeholder="e.g. Scaling cloud engineering and AI/ML capabilities over the next 12-18 months..."
          className="w-full px-3.5 py-2.5 text-body-sm font-medium bg-surface border border-surface-border rounded-lg text-charcoal-900 placeholder:text-charcoal-400 focus:ring-1 focus:ring-brand-500 focus:outline-hidden"
        />
      </div>
    </div>
  );
};

export default WorkforceProfileForm;
