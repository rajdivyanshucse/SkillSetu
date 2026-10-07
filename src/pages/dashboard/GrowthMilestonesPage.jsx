import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import CareerMilestones from '../../components/growth/CareerMilestones';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Award, ArrowLeft } from 'lucide-react';
import { loadMilestones, saveMilestones, calculateMilestoneProgress, loadGrowthData, saveGrowthData } from '../../utils/growthIntelligence';

export default function GrowthMilestonesPage() {
  const [milestones, setMilestones] = useState(() => loadMilestones());

  useEffect(() => {
    setMilestones(loadMilestones());
  }, []);

  const handleToggleStatus = (milestoneId) => {
    const updatedMilestones = milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'completed' ? 'in_progress' : m.status === 'in_progress' ? 'completed' : 'in_progress';
        return {
          ...m,
          status: nextStatus,
          date: nextStatus === 'completed' ? 'Just now' : m.date
        };
      }
      return m;
    });

    const targetMilestone = updatedMilestones.find((m) => m.id === milestoneId);

    saveMilestones(updatedMilestones);
    setMilestones(updatedMilestones);

    // Save activity
    const growthData = loadGrowthData();
    const updatedActivities = [
      {
        id: `act_${Date.now()}`,
        activity: `Updated milestone status: ${targetMilestone?.title}`,
        date: 'Just now',
        relatedSkill: targetMilestone?.relatedSkills?.[0] || 'Career Journey',
        impact: `Status: ${targetMilestone?.status}`,
        type: 'milestone_completed'
      },
      ...(growthData.activities || [])
    ];
    saveGrowthData({ ...growthData, activities: updatedActivities });
  };

  const progress = calculateMilestoneProgress(milestones);

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
                Career Milestones & Key Achievements
              </h1>
              <Badge variant="primary" size="sm">
                {progress.completed} of {progress.total} Completed
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Key professional stepping stones marking tangible progress from foundational readiness to production excellence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Milestone Progress
              </span>
              <span className="text-lg font-bold text-warm-brown">{progress.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Main Milestone Timeline Component */}
        <CareerMilestones
          milestones={milestones}
          onToggleStatus={handleToggleStatus}
        />

        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
