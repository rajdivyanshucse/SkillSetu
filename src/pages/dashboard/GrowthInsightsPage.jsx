import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import GrowthInsights from '../../components/growth/GrowthInsights';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, ArrowRight, Compass, DollarSign, Briefcase } from 'lucide-react';
import {
  loadGrowthData,
  loadProjects,
  loadMilestones,
  generateGrowthInsights
} from '../../utils/growthIntelligence';

export default function GrowthInsightsPage() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const growth = loadGrowthData();
    const projects = loadProjects();
    const milestones = loadMilestones();

    const generated = generateGrowthInsights({
      skills: growth.skills || [],
      learningCourses: growth.learningCourses || [],
      projects,
      milestones,
      targetRole: growth.targetRole
    });

    setInsights(generated);
  }, []);

  return (
    <DashboardLayout activeRoute="/dashboard/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-charcoal-light/10 pb-5">
          <div>
            <Link
              to="/dashboard/growth"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-muted hover:text-warm-brown transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Professional Growth Overview
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-warm-charcoal tracking-tight">
                Professional Growth Insights & Signals
              </h1>
              <Badge variant="primary" size="sm">
                {insights.length} Signals Identified
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Objective pattern synthesis across your skill velocity, learning trajectory, project evidence, and market relevance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm" className="px-3 py-1">
              Deterministic Evaluation Model
            </Badge>
          </div>
        </div>

        {/* Main Insights Component */}
        <GrowthInsights insights={insights} />

        {/* Connected Signals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-warm-brown uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4" />
                Opportunities Match
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                Market Opportunity Signals
              </h4>
              <p className="text-xs text-charcoal-muted mb-3">
                See how your growing backend and cloud capability expands match rates across prototype roles.
              </p>
            </div>
            <Link to="/dashboard/opportunities" className="inline-flex items-center gap-1 text-xs font-medium text-warm-brown hover:underline">
              View Matched Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-warm-brown uppercase tracking-wider mb-2">
                <DollarSign className="w-4 h-4" />
                Compensation Patterns
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                Compensation Intelligence
              </h4>
              <p className="text-xs text-charcoal-muted mb-3">
                Explore advertised salary bands across skills you are currently developing.
              </p>
            </div>
            <Link to="/dashboard/compensation" className="inline-flex items-center gap-1 text-xs font-medium text-warm-brown hover:underline">
              View Compensation Signals <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          <Card className="p-4 border-charcoal-light/10 hover:border-warm-brown/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-warm-brown uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                Career Roadmap
              </div>
              <h4 className="text-sm font-semibold text-warm-charcoal mb-1">
                Strategic Next Steps
              </h4>
              <p className="text-xs text-charcoal-muted mb-3">
                Review multi-stage milestones sequenced specifically for your targeted career path.
              </p>
            </div>
            <Link to="/dashboard/career-roadmap" className="inline-flex items-center gap-1 text-xs font-medium text-warm-brown hover:underline">
              Inspect Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>

        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
