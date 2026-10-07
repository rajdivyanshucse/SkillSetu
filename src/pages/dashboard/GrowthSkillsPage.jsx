import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import SkillGrowthTable from '../../components/growth/SkillGrowthTable';
import SkillGrowthCard from '../../components/growth/SkillGrowthCard';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Target, ArrowLeft, Layers, Sparkles } from 'lucide-react';
import { loadGrowthData, saveGrowthData, calculateSkillProgress } from '../../utils/growthIntelligence';

export default function GrowthSkillsPage() {
  const [growthState, setGrowthState] = useState(() => loadGrowthData());
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const loaded = loadGrowthData();
    setGrowthState(loaded);
    if (loaded.skills && loaded.skills.length > 0) {
      setSelectedSkill(loaded.skills[0]);
    }
  }, []);

  const handleUpdateProgress = (skillId, newProgress, newCurrentLevel) => {
    const updatedSkills = (growthState.skills || []).map((s) => {
      if (s.id === skillId) {
        return {
          ...s,
          progress: newProgress,
          currentLevel: newCurrentLevel ?? s.currentLevel,
          lastUpdated: 'Just now',
          status: newProgress >= 100 ? 'Mastered' : newProgress >= 60 ? 'Developing' : 'In Progress'
        };
      }
      return s;
    });

    const updatedState = {
      ...growthState,
      skills: updatedSkills,
      activities: [
        {
          id: `act_${Date.now()}`,
          activity: `Updated progress for ${updatedSkills.find((s) => s.id === skillId)?.name || 'skill'}`,
          date: 'Just now',
          relatedSkill: updatedSkills.find((s) => s.id === skillId)?.name,
          impact: `+${newProgress}% level updated`,
          type: 'skill_update'
        },
        ...(growthState.activities || [])
      ]
    };

    saveGrowthData(updatedState);
    setGrowthState(updatedState);

    // Update selected skill view if active
    if (selectedSkill && selectedSkill.id === skillId) {
      setSelectedSkill(updatedSkills.find((s) => s.id === skillId));
    }
  };

  const skillProgress = calculateSkillProgress(growthState.skills || []);

  return (
    <DashboardLayout activeRoute="/dashboard/growth">
      <div className="space-y-6 animate-fade-in">
        {/* Top Breadcrumb & Header */}
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
                Skill Growth Tracking
              </h1>
              <Badge variant="primary" size="sm">
                {growthState.skills?.length || 0} Skills Configured
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Monitor self-reported skill proficiency levels, progress velocity, and development activities aligned with your target role.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Average Progress
              </span>
              <span className="text-lg font-bold text-warm-brown">{skillProgress}%</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Table & Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkillGrowthTable
              skills={growthState.skills || []}
              onUpdateProgress={handleUpdateProgress}
              onSelectSkill={(skill) => setSelectedSkill(skill)}
              selectedSkillId={selectedSkill?.id}
            />
          </div>

          <div className="space-y-6">
            {selectedSkill ? (
              <SkillGrowthCard skill={selectedSkill} />
            ) : (
              <Card className="p-6 text-center text-charcoal-muted">
                <Target className="w-8 h-8 mx-auto mb-2 text-charcoal-light opacity-50" />
                <p className="text-sm">Select a skill to inspect related roadmap stages and learning activities.</p>
              </Card>
            )}

            <Card className="p-4 bg-warm-sand/20 border-charcoal-light/10">
              <h4 className="text-xs font-bold uppercase text-warm-charcoal tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-warm-brown" />
                Connected Modules
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  to="/dashboard/skill-gaps"
                  className="flex items-center justify-between p-2 rounded bg-white border border-charcoal-light/10 hover:border-warm-brown/30 text-warm-charcoal transition-all"
                >
                  <span>Skill Gap Intelligence</span>
                  <span className="text-warm-brown font-medium">View Analysis →</span>
                </Link>
                <Link
                  to="/dashboard/career-roadmap"
                  className="flex items-center justify-between p-2 rounded bg-white border border-charcoal-light/10 hover:border-warm-brown/30 text-warm-charcoal transition-all"
                >
                  <span>Career Roadmap Stages</span>
                  <span className="text-warm-brown font-medium">Explore Tracks →</span>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
