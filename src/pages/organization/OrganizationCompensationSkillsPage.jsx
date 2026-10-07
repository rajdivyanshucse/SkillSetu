import React from 'react';
import { Sparkles, ArrowLeft, Layers, TrendingUp, Info } from 'lucide-react';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import { useRouter } from '../../router/Router';
import { skillCompensationAssociations } from '../../data/compensationData';
import { SkillCompensationSignals } from '../../components/compensation/SkillCompensationSignals';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const OrganizationCompensationSkillsPage = () => {
  const { navigate } = useRouter();

  return (
    <OrganizationLayout activeRoute="/organization/compensation">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-surface p-5 sm:p-6 rounded-lg border border-surface-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/organization/compensation')}
                className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Compensation Overview
              </button>
              <span className="text-charcoal-300">•</span>
              <Badge variant="brand" size="sm">
                Skill Analysis
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Skill-Associated Opportunity Analysis
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Examine opportunity presence rates, advertised compensation quartiles, and role coverage across critical technical capabilities.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/organization/planning/skills')}
              className="text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Future Skills
            </Button>
          </div>
        </div>

        {/* Skill Compensation Signals Table / Grid */}
        <SkillCompensationSignals
          skills={skillCompensationAssociations}
          title="Organization Skill Intelligence Signals"
          subtitle="Observational market data for capability investment and talent acquisition context."
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="organizationPlanning" />
      </div>
    </OrganizationLayout>
  );
};
