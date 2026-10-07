import React, { useState } from 'react';
import { Scale, ArrowLeft, Plus, Layers, RotateCcw } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { normalizedRoles } from '../../data/compensationData';
import {
  getStoredCompensationPreferences,
  saveStoredCompensationPreferences,
} from '../../utils/compensationIntelligence';
import { CompensationComparison } from '../../components/compensation/CompensationComparison';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CompensationComparePage = () => {
  const { navigate } = useRouter();

  const [selectedRoleIds, setSelectedRoleIds] = useState(() => {
    const stored = getStoredCompensationPreferences();
    return stored?.compareIds || ['backend-software-engineer', 'data-engineer', 'devops-engineer'];
  });

  const [addRoleId, setAddRoleId] = useState('');

  const handleAddRole = () => {
    if (!addRoleId || selectedRoleIds.includes(addRoleId)) return;
    if (selectedRoleIds.length >= 4) {
      const updated = [...selectedRoleIds.slice(1), addRoleId];
      setSelectedRoleIds(updated);
      const existing = getStoredCompensationPreferences() || {};
      saveStoredCompensationPreferences({ ...existing, compareIds: updated });
    } else {
      const updated = [...selectedRoleIds, addRoleId];
      setSelectedRoleIds(updated);
      const existing = getStoredCompensationPreferences() || {};
      saveStoredCompensationPreferences({ ...existing, compareIds: updated });
    }
    setAddRoleId('');
  };

  const handleRemoveRole = (roleId) => {
    const updated = selectedRoleIds.filter((id) => id !== roleId);
    setSelectedRoleIds(updated);
    const existing = getStoredCompensationPreferences() || {};
    saveStoredCompensationPreferences({ ...existing, compareIds: updated });
  };

  const handleClearAll = () => {
    setSelectedRoleIds([]);
    const existing = getStoredCompensationPreferences() || {};
    saveStoredCompensationPreferences({ ...existing, compareIds: [] });
  };

  const availableToAdd = normalizedRoles.filter((r) => !selectedRoleIds.includes(r.id));

  return (
    <DashboardLayout activeRoute="/dashboard/compensation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard/compensation')}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Compensation Home
              </button>
              <span className="text-charcoal-300">•</span>
              <Badge variant="brand" size="sm">
                Role Comparison
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Compare Role Compensation
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Evaluate advertised compensation parameters, experience requirements, work arrangements, and key skills across up to 4 role archetypes side-by-side.
            </p>
          </div>

          {/* Add Role Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {availableToAdd.length > 0 && selectedRoleIds.length < 4 && (
              <div className="flex items-center gap-1.5">
                <select
                  value={addRoleId}
                  onChange={(e) => setAddRoleId(e.target.value)}
                  className="text-xs py-1.5 px-2.5 bg-canvas-subtle border border-surface-border rounded-md text-charcoal-800 focus:outline-none cursor-pointer"
                >
                  <option value="">Select a role to add...</option>
                  {availableToAdd.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddRole}
                  disabled={!addRoleId}
                  className="text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table Component */}
        <CompensationComparison
          roleIds={selectedRoleIds}
          onRemoveRole={handleRemoveRole}
          onClearAll={handleClearAll}
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="general" />
      </div>
    </DashboardLayout>
  );
};
