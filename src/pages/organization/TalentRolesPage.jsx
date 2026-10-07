import React from 'react';
import { Briefcase, ArrowLeft, Plus, Users, Sparkles, Layers } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { talentRoles } from '../../data/talentRoleData';
import { mockCandidates } from '../../data/talentData';
import { RoleRequirementCard } from '../../components/talent/RoleRequirementCard';
import { Button } from '../../components/ui/Button';

export const TalentRolesPage = () => {
  const { navigate } = useRouter();

  return (
    <OrganizationLayout activeRoute="/organization/talent">
      <div className="space-y-6 pb-12">
        {/* Back and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/organization/talent')}
            className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Talent Discovery</span>
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/organization/talent')}
            className="cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" />
            <span>Explore All Talent</span>
          </Button>
        </div>

        {/* Banner */}
        <div className="bg-surface p-6 rounded-2xl border border-surface-border shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="text-heading font-bold text-charcoal-900 tracking-tight">
                Target Role Requirements Configuration
              </h1>
            </div>
            <p className="text-xs text-charcoal-600">
              Calibrated role specifications used by the Talent Compatibility engine to score candidate alignment.
            </p>
          </div>

          <div className="p-3 bg-canvas-subtle rounded-xl border border-surface-border text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-charcoal-500 block">Active Roles</span>
            <span className="text-lg font-black font-mono text-brand-700">{talentRoles.length} Roles</span>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {talentRoles.map((role) => {
            const matchingCount = mockCandidates.filter((c) => {
              const reqs = role.requiredSkills || [];
              const matchedReqs = reqs.filter((r) => c.skills && c.skills[r] >= 6);
              return matchedReqs.length >= Math.ceil(reqs.length * 0.6);
            }).length;

            return (
              <RoleRequirementCard
                key={role.id}
                role={role}
                candidateMatchCount={matchingCount}
              />
            );
          })}
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default TalentRolesPage;
