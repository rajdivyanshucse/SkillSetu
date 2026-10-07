import React from 'react';
import { Link } from '../../router/Router';
import { OrganizationLayout } from '../../components/organization/OrganizationLayout';
import OrganizationDevelopmentPrograms from '../../components/growth/OrganizationDevelopmentPrograms';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { BookOpen, ArrowLeft, Users, Layers } from 'lucide-react';
import { ORGANIZATION_DEVELOPMENT_PROGRAMS } from '../../data/growthData';

export default function OrganizationDevelopmentPage() {
  const totalParticipants = ORGANIZATION_DEVELOPMENT_PROGRAMS.reduce((acc, curr) => acc + curr.participants, 0);

  return (
    <OrganizationLayout activeRoute="/organization/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <Link
              to="/organization/growth"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-warm-brown transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Workforce Growth Overview
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
                Learning & Upskilling Programs
              </h1>
              <Badge variant="primary" size="sm">
                {ORGANIZATION_DEVELOPMENT_PROGRAMS.length} Active Initiatives
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Cohort-based development initiatives, technical upskilling curricula, and institutional training coverage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Total Cohort Participants
              </span>
              <span className="text-lg font-bold text-warm-brown">{totalParticipants} Engineers</span>
            </div>
          </div>
        </div>

        {/* Program Focus Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-charcoal-light/10 bg-warm-sand/20">
            <div className="flex items-center gap-2 text-xs font-bold text-warm-brown uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              Continuous Upskilling
            </div>
            <p className="text-xs text-charcoal-muted">
              Internal capability expansion ensuring technical teams evolve with cloud-native architectures.
            </p>
          </Card>

          <Card className="p-4 border-charcoal-light/10 bg-warm-sand/20">
            <div className="flex items-center gap-2 text-xs font-bold text-sage-dark uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              Curriculum Alignment
            </div>
            <p className="text-xs text-charcoal-muted">
              Learning tracks mapped directly to critical strategic initiatives identified in the 3-year workforce plan.
            </p>
          </Card>

          <Card className="p-4 border-charcoal-light/10 bg-warm-sand/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              Cohort Accountability
            </div>
            <p className="text-xs text-charcoal-muted">
              Collaborative peer review and project milestones without individual performance evaluation pressure.
            </p>
          </Card>
        </div>

        {/* Full Programs List */}
        <OrganizationDevelopmentPrograms
          programs={ORGANIZATION_DEVELOPMENT_PROGRAMS}
        />

        <GrowthDisclaimer isOrganization={true} />
      </div>
    </OrganizationLayout>
  );
}
