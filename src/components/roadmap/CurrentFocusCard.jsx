import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Play, BookOpen, Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const CurrentFocusCard = ({
  focusSkill,
  onContinue,
  className = '',
}) => {
  const skill = focusSkill || {
    name: 'AWS Cloud Fundamentals',
    category: 'Cloud',
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    priority: 'Critical',
    whyItMatters: 'Cloud infrastructure knowledge commonly appears alongside backend engineering responsibilities.',
    activities: [
      { id: 'act-1', title: 'Understand AWS global infrastructure, regions, VPCs, and IAM security models', completed: true },
      { id: 'act-2', title: 'Provision S3 buckets and configure secure presigned upload URLs', completed: false },
      { id: 'act-3', title: 'Deploy a containerized backend service to AWS App Runner / ECS', completed: false },
      { id: 'act-4', title: 'Verify health checks, CloudWatch logs, and RDS connection pooling', completed: false },
    ],
  };

  const acts = skill.activities || [];
  const completedCount = acts.filter((a) => a.completed).length;
  const progressPct = acts.length > 0 ? Math.round((completedCount / acts.length) * 100) : 25;

  return (
    <Card className={`border-brand-300 bg-gradient-to-br from-surface via-brand-50/20 to-surface shadow-subtle ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-500 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Your Current Focus</CardTitle>
              <CardDescription>
                Highest priority competency scheduled for active development.
              </CardDescription>
            </div>
          </div>

          <Badge status="high_priority" size="md">
            Active Priority
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        {/* Main Focus Detail Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-4 sm:p-5 rounded-xl bg-surface border border-brand-200/80 shadow-xs">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-xs">
                {skill.category || 'Cloud'}
              </span>
              <span className="text-xs text-charcoal-500 font-medium">
                Stage 03: Cloud & Deployment
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
              {skill.name}
            </h3>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                Why now?
              </span>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                {skill.whyItMatters ||
                  'Cloud capability is one of the primary priority gaps identified for your selected backend role.'}
              </p>
            </div>

            {/* Level comparison */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-charcoal-500 font-medium">
                Current: <strong className="text-charcoal-800">{skill.currentLevel}</strong>
              </span>
              <span className="text-charcoal-300 font-bold">→</span>
              <span className="text-brand-700 font-bold">
                Target: {skill.targetLevel}
              </span>
            </div>
          </div>

          {/* Progress & Quick Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-xl bg-canvas-subtle/80 border border-surface-border shrink-0">
            <div className="space-y-1 text-left lg:text-right w-full">
              <div className="flex items-baseline justify-between lg:justify-end gap-2">
                <span className="text-2xl font-black text-brand-700">
                  {progressPct}%
                </span>
                <span className="text-[10px] uppercase font-bold text-charcoal-400">
                  Completed
                </span>
              </div>
              <div className="w-full sm:w-36 h-2 bg-canvas-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onContinue && onContinue(skill)}
              className="w-full sm:w-auto"
            >
              Continue Development
            </Button>
          </div>
        </div>

        {/* 3 Sub-step milestones preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(acts.slice(0, 3) || []).map((sub, idx) => (
            <div
              key={sub.id || idx}
              className={`
                p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all
                ${
                  sub.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-surface border-surface-border text-charcoal-700'
                }
              `}
            >
              <div
                className={`
                  w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold
                  ${
                    sub.completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-canvas-muted text-charcoal-500'
                  }
                `}
              >
                {sub.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div className="leading-snug line-clamp-2">
                {sub.title}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentFocusCard;
