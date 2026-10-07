import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Search, Layers, TrendingUp, Info } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useRouter } from '../../router/Router';
import { skillCompensationAssociations } from '../../data/compensationData';
import { SkillCompensationSignals } from '../../components/compensation/SkillCompensationSignals';
import { CompensationMethodology } from '../../components/compensation/CompensationMethodology';
import { CompensationDisclaimer } from '../../components/compensation/CompensationDisclaimer';
import { Button } from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export const CompensationSkillsPage = () => {
  const { navigate } = useRouter();

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
                Skill Associations
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight">
              Skill-Associated Compensation Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-600 max-w-2xl leading-relaxed">
              Analyze observational relationships between specialized technical competencies and advertised compensation distributions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/career-roadmap')}
              className="text-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Career Roadmap Alignment
            </Button>
          </div>
        </div>

        {/* Full Skills Compensation Component */}
        <SkillCompensationSignals
          skills={skillCompensationAssociations}
          title="All Cataloged Skill Signals"
          subtitle="Explore presence rates and median advertised spans across 10 key technical capability areas."
        />

        {/* Methodology & Disclaimers */}
        <CompensationMethodology />
        <CompensationDisclaimer type="skillAssociation" />
      </div>
    </DashboardLayout>
  );
};
