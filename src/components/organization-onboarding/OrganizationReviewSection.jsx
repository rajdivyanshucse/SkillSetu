import React from 'react';
import { Edit2, Building2, Layers, Users, Sparkles, Target, Compass, Sliders, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const OrganizationReviewSection = ({ data }) => {
  const { navigate } = useRouter();

  const totalEmployees = Object.values(data.workforce?.departments || {}).reduce(
    (acc, v) => acc + (parseInt(v, 10) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* 1. Organization Overview */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Organization Overview
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/company')}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Name:</span>
            <span className="font-semibold text-charcoal-900">{data.company?.name || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Type:</span>
            <span className="font-semibold text-charcoal-900">{data.company?.type || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Size:</span>
            <span className="font-semibold text-charcoal-900">{data.company?.size || '—'} employees</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Primary Location:</span>
            <span className="font-semibold text-charcoal-900">{data.company?.primaryLocation || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Founded:</span>
            <span className="font-semibold text-charcoal-900">{data.company?.foundedYear || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Website:</span>
            <span className="font-semibold text-charcoal-900 truncate block">{data.company?.website || '—'}</span>
          </div>
        </div>

        {data.company?.description && (
          <div className="pt-2 text-xs text-charcoal-600">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-0.5">Overview:</span>
            <p className="leading-relaxed">{data.company.description}</p>
          </div>
        )}
      </Card>

      {/* 2. Industry & Business */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Industry & Business Functions
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/industry')}
          >
            Edit
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Primary Industry:</span>
            <span className="font-semibold text-charcoal-900">{data.industry?.primaryIndustry || '—'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
              Business Functions:
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {(data.industry?.businessFunctions || []).map((fn) => (
                <span
                  key={fn}
                  className="px-2 py-0.5 rounded-xs bg-canvas-subtle text-charcoal-800 border border-surface-border text-[11px] font-semibold"
                >
                  {fn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Workforce Profile */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Workforce Structure ({totalEmployees} Total)
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/workforce')}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {Object.entries(data.workforce?.departments || {}).map(([dept, count]) => (
            <div key={dept} className="p-2 bg-canvas-subtle rounded-md border border-surface-border">
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block truncate">{dept}</span>
              <span className="font-mono font-bold text-charcoal-900 text-sm">{count} ppl</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Current Workforce Skills */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Current Workforce Skills ({(data.skills || []).length})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/skills')}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {(data.skills || []).map((sk) => (
            <div
              key={sk.name}
              className="p-2.5 bg-canvas-subtle rounded-md border border-surface-border flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-charcoal-900 block">{sk.name}</span>
                <span className="text-[10px] text-charcoal-400 uppercase">{sk.category}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-1.5 py-0.2 rounded-xs border border-brand-200 block">
                  {sk.capabilityLevel}
                </span>
                <span className="text-[10px] text-charcoal-500 font-mono mt-0.5 block">
                  {sk.coveragePct}% coverage
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Strategic Priorities & Challenges */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Strategic Priorities & Challenges
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/priorities')}
          >
            Edit
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
              Top Priorities:
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {(data.priorities?.strategicPriorities || []).map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-xs bg-brand-50 text-brand-800 border border-brand-200 text-[11px] font-semibold"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
              Workforce Challenges:
            </span>
            <div className="flex items-center flex-wrap gap-1.5">
              {(data.priorities?.workforceChallenges || []).map((c) => (
                <span
                  key={c}
                  className="px-2 py-0.5 rounded-xs bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 6. Future Skills */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Future Skill Horizons ({(data.futureSkills || []).length})
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/future-skills')}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {(data.futureSkills || []).map((fs) => (
            <div
              key={fs.name}
              className="p-2.5 bg-canvas-subtle rounded-md border border-surface-border flex items-center justify-between"
            >
              <span className="font-bold text-charcoal-900">{fs.name}</span>
              <span className="text-[10px] font-mono font-bold text-brand-700 bg-surface px-1.5 py-0.5 rounded-xs border border-surface-border">
                {fs.horizon} ({fs.futureImportance})
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 7. Development Preferences */}
      <Card className="p-5 space-y-3 bg-surface">
        <div className="flex items-center justify-between pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-600" />
            <h3 className="text-body-sm font-bold text-charcoal-900">
              Workforce Development Preferences
            </h3>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<Edit2 className="w-3 h-3" />}
            onClick={() => navigate('/organization/onboarding/preferences')}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Strategy:</span>
            <span className="font-semibold text-charcoal-900">{data.preferences?.workforceStrategy || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Remote Support:</span>
            <span className="font-semibold text-charcoal-900">{data.preferences?.remoteSupport || '—'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">Budget Allocation:</span>
            <span className="font-semibold text-charcoal-900">{data.preferences?.budgetTier || '—'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrganizationReviewSection;
