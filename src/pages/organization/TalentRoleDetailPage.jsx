import React from 'react';
import { Briefcase, ArrowLeft, Users, CheckCircle2, Sparkles, Layers, ArrowRight, Clock, MapPin } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { getTalentRoleById, STORAGE_KEY_SELECTED_TALENT_ROLE } from '../../data/talentRoleData';
import { mockCandidates } from '../../data/talentData';
import { calculateTalentCompatibility } from '../../utils/talentMatching';
import { Button } from '../../components/ui/Button';

export const TalentRoleDetailPage = ({ roleId }) => {
  const { navigate } = useRouter();
  const role = getTalentRoleById(roleId);

  const matchedCandidates = mockCandidates
    .map((c) => ({
      candidate: c,
      comp: calculateTalentCompatibility(c, role),
    }))
    .sort((a, b) => b.comp.overallCompatibility - a.comp.overallCompatibility);

  const handleExploreWithRole = () => {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED_TALENT_ROLE, role.id);
    } catch (e) {
      console.warn('Failed to set selected role:', e);
    }
    navigate('/organization/talent');
  };

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/talent/roles')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Roles</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExploreWithRole}
            className="cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            <span>Explore Matching Talent ({matchedCandidates.length})</span>
          </Button>
        </div>

        {/* Role Overview Card */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                    {role.department}
                  </span>
                  <span className="text-xs text-charcoal-400">•</span>
                  <span className="text-xs font-semibold text-charcoal-600">
                    {role.workMode}
                  </span>
                </div>
                <h1 className="text-heading font-bold text-charcoal-900 tracking-tight mt-1">
                  {role.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-charcoal-600">
              <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center">
                <span className="text-[10px] text-charcoal-400 block font-bold uppercase">Experience Baseline</span>
                <span className="font-bold text-charcoal-900 font-mono text-sm">{role.experience}</span>
              </div>
              <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center">
                <span className="text-[10px] text-charcoal-400 block font-bold uppercase">Locations</span>
                <span className="font-bold text-charcoal-900 text-sm">{role.suggestedLocations?.join(', ')}</span>
              </div>
            </div>
          </div>

          <p className="text-body-sm text-charcoal-700 leading-relaxed pt-2 border-t border-surface-border/60">
            {role.description}
          </p>
        </div>

        {/* Requirements Breakdown (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Skills */}
          <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-body-sm font-bold text-charcoal-900">
                Required Core Skills ({role.requiredSkills?.length || 0})
              </h3>
            </div>
            <p className="text-xs text-charcoal-500">
              Essential prerequisites required for immediate role contribution.
            </p>
            <div className="space-y-2 pt-2">
              {role.requiredSkills?.map((sk) => (
                <div
                  key={sk}
                  className="p-3 rounded-xl bg-canvas-subtle border border-surface-border flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-charcoal-900">{sk}</span>
                  <span className="text-[10px] font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                    Required Core
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="text-body-sm font-bold text-charcoal-900">
                Preferred Value-Add Skills ({role.preferredSkills?.length || 0})
              </h3>
            </div>
            <p className="text-xs text-charcoal-500">
              Complementary capabilities that accelerate technical depth and autonomous execution.
            </p>
            <div className="space-y-2 pt-2">
              {role.preferredSkills?.map((sk) => (
                <div
                  key={sk}
                  className="p-3 rounded-xl bg-canvas-subtle border border-surface-border flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-charcoal-900">{sk}</span>
                  <span className="text-[10px] font-semibold text-charcoal-600 bg-canvas border border-surface-border px-2 py-0.5 rounded-md">
                    Preferred
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Matching Candidates Preview */}
        <div className="bg-surface p-5 rounded-2xl border border-surface-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Top Aligned Talent Profiles ({matchedCandidates.length})
            </h3>
            <button
              type="button"
              onClick={handleExploreWithRole}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View In Discovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchedCandidates.slice(0, 3).map(({ candidate, comp }) => (
              <div
                key={candidate.id}
                onClick={() => navigate(`/organization/talent/${candidate.id}`)}
                className="p-4 rounded-xl border border-surface-border bg-canvas-subtle/50 hover:bg-surface hover:border-brand-300 transition-all cursor-pointer flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-charcoal-900">
                      {candidate.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs">
                      {comp.overallCompatibility}%
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 line-clamp-1">
                    {candidate.headline}
                  </p>
                </div>
                <div className="text-[10px] text-charcoal-400 pt-1 border-t border-surface-border/60 flex items-center justify-between">
                  <span>{candidate.experienceYears}y Exp</span>
                  <span className="text-brand-600 font-semibold">Inspect</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default TalentRoleDetailPage;
