import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Sparkles, ArrowRight, CheckCircle2, Wrench } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const ProjectRecommendation = ({
  projects = [],
  className = '',
}) => {
  const { addToast } = useToast();

  const handleStartProject = (title) => {
    addToast({
      title: 'Project Portfolio Workspace',
      message: `Project workspace & automated repository verification for "${title}" will connect in Phase 8.`,
      type: 'info',
      duration: 3500,
    });
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Advanced':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            Advanced Project
          </span>
        );
      case 'Intermediate':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200">
            Intermediate Project
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Foundational Project
          </span>
        );
    }
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Build to Strengthen Your Profile</CardTitle>
              <CardDescription>
                Hands-on practical projects that synthesize multiple calibrated skills into verifiable portfolio proof.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60 self-start sm:self-auto">
            Practical Application
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id || idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    {proj.category}
                  </span>
                  {getDifficultyBadge(proj.difficulty)}
                </div>

                <h4 className="text-body-sm font-bold text-charcoal-900 leading-snug">
                  {proj.title}
                </h4>

                <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">
                  {proj.purpose}
                </p>

                {/* Skills chips */}
                <div className="pt-2.5 flex flex-wrap gap-1.5">
                  {proj.skillsPracticed.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded-xs bg-surface border border-surface-border text-charcoal-800 font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border/80 flex items-center justify-between">
                <span className="text-[11px] text-charcoal-400 font-mono">
                  {proj.estimatedTime}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  onClick={() => handleStartProject(proj.title)}
                  className="text-xs font-semibold"
                >
                  Start Project
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectRecommendation;
