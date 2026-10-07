import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, Layers, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const UpcomingDevelopment = ({
  upcomingSkills = [],
  onSelectSkill,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Coming Up</CardTitle>
              <CardDescription>
                Next sequenced milestones in your personalized learning path.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500 bg-canvas-subtle px-2 py-0.5 rounded-xs border border-surface-border">
            Pipeline
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {upcomingSkills.map((s, idx) => (
            <motion.div
              key={s.id || s.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-3.5 rounded-xl bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong transition-all flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold text-charcoal-400">
                    {s.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200/60">
                    {s.priority || 'High'}
                  </span>
                </div>

                <h4 className="text-body-sm font-bold text-charcoal-900 mt-0.5">
                  {s.name}
                </h4>

                <div className="flex items-center gap-2 text-xs pt-1 text-charcoal-600">
                  <span>{s.currentLevel}</span>
                  <span className="text-charcoal-300">→</span>
                  <span className="font-bold text-brand-700">{s.targetLevel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="xs"
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  onClick={() => onSelectSkill && onSelectSkill(s)}
                  className="text-xs font-semibold text-brand-700"
                >
                  View Plan
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDevelopment;
