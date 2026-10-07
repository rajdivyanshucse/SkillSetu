import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Code,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const DevelopmentPlan = ({
  skill,
  onToggleActivity,
  className = '',
}) => {
  const { addToast } = useToast();

  if (!skill) return null;

  const pillars = [
    {
      type: 'learn',
      title: 'LEARN',
      subtitle: 'Core concepts & architecture to understand',
      icon: <BookOpen className="w-4 h-4 text-brand-700" />,
      content: skill.learn || 'Understand core compute (EC2/ECS), storage (S3), and security fundamentals.',
      activities: (skill.activities || []).filter((a) => a.type === 'learn' || !a.type),
    },
    {
      type: 'practice',
      title: 'PRACTICE',
      subtitle: 'Targeted hands-on exercises & configuration',
      icon: <Code className="w-4 h-4 text-brand-700" />,
      content: skill.practice || 'Work with compute, storage and IAM access permissions.',
      activities: (skill.activities || []).filter((a) => a.type === 'practice'),
    },
    {
      type: 'build',
      title: 'BUILD',
      subtitle: 'Deploy a practical backend application',
      icon: <Wrench className="w-4 h-4 text-brand-700" />,
      content: skill.build || 'Deploy a containerized Spring Boot backend service.',
      activities: (skill.activities || []).filter((a) => a.type === 'build'),
    },
    {
      type: 'validate',
      title: 'VALIDATE',
      subtitle: 'Demonstrate & verify competency in production',
      icon: <ShieldCheck className="w-4 h-4 text-brand-700" />,
      content: skill.validate || 'Document the architecture and test live public endpoints.',
      activities: (skill.activities || []).filter((a) => a.type === 'validate'),
    },
  ];

  const handleCheckbox = (actId, currentVal, actTitle) => {
    onToggleActivity && onToggleActivity(actId, !currentVal);
    addToast({
      title: !currentVal ? 'Milestone Completed!' : 'Milestone Unchecked',
      message: `"${actTitle}" has been updated in your roadmap progress.`,
      type: !currentVal ? 'success' : 'info',
      duration: 3000,
    });
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Development Plan: {skill.name}</CardTitle>
              <CardDescription>
                Career-oriented progression structured around Learn → Practice → Build → Validate.
              </CardDescription>
            </div>
          </div>

          <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-xs border border-brand-200/60 self-start sm:self-auto">
            {skill.targetLevel} Target Benchmark
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.type}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 rounded-xs bg-surface border border-surface-border text-charcoal-700">
                    {p.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-charcoal-900 block">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-charcoal-500 block">
                      {p.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-charcoal-700 mt-2 leading-relaxed font-medium">
                  {p.content}
                </p>
              </div>

              {/* Checkable activities */}
              <div className="pt-2.5 border-t border-surface-border/80 space-y-2">
                {p.activities.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Structured milestone guidance</span>
                  </div>
                ) : (
                  p.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-2 text-xs bg-surface p-2 rounded-md border border-surface-border"
                    >
                      <input
                        type="checkbox"
                        id={act.id}
                        checked={act.completed}
                        onChange={() => handleCheckbox(act.id, act.completed, act.title)}
                        className="mt-0.5 rounded-xs border-charcoal-400 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <label
                        htmlFor={act.id}
                        className={`leading-normal cursor-pointer select-none ${
                          act.completed
                            ? 'text-charcoal-400 line-through'
                            : 'text-charcoal-800 font-medium'
                        }`}
                      >
                        {act.title}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentPlan;
