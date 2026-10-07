import React, { useState, useEffect } from 'react';
import { Link } from '../../router/Router';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import LearningProgress from '../../components/growth/LearningProgress';
import LearningRoadmap from '../../components/growth/LearningRoadmap';
import GrowthDisclaimer from '../../components/growth/GrowthDisclaimer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react';
import { loadGrowthData, saveGrowthData, calculateLearningProgress } from '../../utils/growthIntelligence';

export default function GrowthLearningPage() {
  const [growthState, setGrowthState] = useState(() => loadGrowthData());

  useEffect(() => {
    setGrowthState(loadGrowthData());
  }, []);

  const handleUpdateCourseProgress = (courseId, newProgress) => {
    const updatedCourses = (growthState.learningCourses || []).map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          progress: newProgress,
          status: newProgress >= 100 ? 'Completed' : newProgress > 0 ? 'In Progress' : 'Not Started'
        };
      }
      return course;
    });

    const updatedCourse = updatedCourses.find((c) => c.id === courseId);

    const updatedState = {
      ...growthState,
      learningCourses: updatedCourses,
      activities: [
        {
          id: `act_${Date.now()}`,
          activity: `Updated learning progress for ${updatedCourse?.title || 'course'}`,
          date: 'Just now',
          relatedSkill: updatedCourse?.relatedSkill,
          impact: `${newProgress}% progress recorded`,
          type: newProgress >= 100 ? 'course_completed' : 'course_started'
        },
        ...(growthState.activities || [])
      ]
    };

    saveGrowthData(updatedState);
    setGrowthState(updatedState);
  };

  const learningCourses = growthState.learningCourses || [];
  const avgProgress = calculateLearningProgress(learningCourses);
  const completedCount = learningCourses.filter((c) => c.status === 'Completed' || c.progress >= 100).length;

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
                Learning Progress & Curriculum
              </h1>
              <Badge variant="primary" size="sm">
                {learningCourses.length} Modules
              </Badge>
            </div>
            <p className="text-sm text-charcoal-muted mt-1 max-w-2xl">
              Track completion across structured courses, technical topics, and concept exercises.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Modules Completed
              </span>
              <span className="text-lg font-bold text-warm-brown">
                {completedCount} / {learningCourses.length}
              </span>
            </div>
            <div className="bg-warm-sand/40 border border-charcoal-light/10 rounded-lg px-3.5 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider block">
                Avg Completion
              </span>
              <span className="text-lg font-bold text-sage-dark">{avgProgress}%</span>
            </div>
          </div>
        </div>

        {/* 4-Stage Learning Methodology View */}
        <LearningRoadmap />

        {/* Main Learning Activities List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LearningProgress
              courses={learningCourses}
              onUpdateProgress={handleUpdateCourseProgress}
            />
          </div>

          <div className="space-y-6">
            <Card className="p-5 border-charcoal-light/10">
              <h3 className="text-sm font-semibold text-warm-charcoal mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-warm-brown" />
                Connected Career Roadmap
              </h3>
              <p className="text-xs text-charcoal-muted mb-4">
                Your learning modules are sequenced in tandem with your multi-phase development plan.
              </p>
              <Link to="/dashboard/career-roadmap">
                <Button variant="secondary" size="sm" className="w-full justify-between text-xs">
                  <span>Open Roadmap Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>

            <Card className="p-5 bg-warm-sand/20 border-charcoal-light/10">
              <h3 className="text-sm font-semibold text-warm-charcoal mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warm-brown" />
                Learning Best Practices
              </h3>
              <ul className="space-y-2 text-xs text-charcoal-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                  <span>Pair each conceptual module with a hands-on coding lab or repository project.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                  <span>Prioritize core backend architecture before deep-diving into cloud orchestration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                  <span>Document architectural trade-offs to reinforce system design fluency.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <GrowthDisclaimer />
      </div>
    </DashboardLayout>
  );
}
