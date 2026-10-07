import React, { useState, useMemo } from 'react';
import { GitCompare, ArrowLeft, RotateCcw, Plus, Sparkles, ShieldCheck } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { mockCandidates, STORAGE_KEY_TALENT_COMPARE } from '../../data/talentData';
import { talentRoles, getTalentRoleById, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';
import { TalentComparison } from '../../components/talent/TalentComparison';
import { TargetRoleSelector } from '../../components/talent/TargetRoleSelector';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const TalentComparePage = () => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED_TALENT_ROLE) || talentRoles[0].id;
    } catch (e) {
      return talentRoles[0].id;
    }
  });

  const activeRole = useMemo(() => getTalentRoleById(selectedRoleId), [selectedRoleId]);

  const [compareIds, setCompareIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TALENT_COMPARE);
      const parsed = raw ? JSON.parse(raw) : [];
      // Default to first 3 candidates if empty for rich initial demo
      if (!parsed || parsed.length === 0) {
        return ['candidate-001', 'candidate-004', 'candidate-008'];
      }
      return parsed;
    } catch (e) {
      return ['candidate-001', 'candidate-004', 'candidate-008'];
    }
  });

  const comparedCandidates = useMemo(() => {
    return compareIds
      .map((id) => mockCandidates.find((c) => c.id === id))
      .filter(Boolean);
  }, [compareIds]);

  const handleRemoveCandidate = (id) => {
    const updated = compareIds.filter((item) => item !== id);
    setCompareIds(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TALENT_COMPARE, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update compare in localStorage:', e);
    }
    addToast({
      title: 'Candidate Removed',
      message: 'Candidate was removed from comparison.',
      type: 'info',
      duration: 2500,
    });
  };

  const handleClearAll = () => {
    setCompareIds([]);
    try {
      localStorage.setItem(STORAGE_KEY_TALENT_COMPARE, JSON.stringify([]));
    } catch (e) {
      console.warn('Failed to clear compare in localStorage:', e);
    }
    addToast({
      title: 'Comparison Cleared',
      message: 'All candidates have been removed from the comparison matrix.',
      type: 'info',
      duration: 2500,
    });
  };

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Back and Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/talent')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Talent Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/organization/talent')}
              className="cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Candidate</span>
            </Button>

            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 font-semibold px-2.5 py-1.5 rounded-lg border border-surface-border hover:bg-canvas-subtle transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Page Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Candidate Side-by-Side Comparison
              </h1>
              <p className="text-xs text-charcoal-600">
                Compare multi-dimensional candidate alignments against {activeRole.title} requirements.
              </p>
            </div>
          </div>
        </div>

        {/* Target Role Selector */}
        <TargetRoleSelector
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
        />

        {/* Comparison Component */}
        <TalentComparison
          candidates={comparedCandidates}
          role={activeRole}
          onRemoveCandidate={handleRemoveCandidate}
        />
      </div>
    </OrganizationLayout>
  );
};

export default TalentComparePage;
