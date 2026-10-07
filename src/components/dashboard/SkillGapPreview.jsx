import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ArrowRight, Sparkles, AlertCircle, TrendingUp, ShieldAlert } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const SkillGapPreview = ({ skillGaps = [], className = '' }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const handleViewAllGaps = () => {
    navigate('/dashboard/skill-gaps');
  };

  const getIntensityBadge = (intensity) => {
    if (intensity === 'High') {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
          High Gap
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
        Medium Gap
      </span>
    );
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200/60">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Priority Skill Gaps</CardTitle>
              <CardDescription>
                Skills that could strengthen your target-role alignment.
              </CardDescription>
            </div>
          </div>

          <Badge status="high_priority" size="sm">
            4 Critical Gaps
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {skillGaps.map((gap, idx) => (
            <motion.div
              key={gap.id || gap.skill}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="p-4 rounded-lg bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                      {gap.category}
                    </span>
                    <h4 className="text-body-md font-bold text-charcoal-900 mt-0.5">
                      {gap.skill}
                    </h4>
                  </div>
                  {getIntensityBadge(gap.gapIntensity)}
                </div>

                <p className="text-[11px] text-charcoal-600 leading-normal mb-3">
                  {gap.recommendation}
                </p>
              </div>

              <div className="pt-2.5 border-t border-surface-border/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-charcoal-500">
                  <span>Current:</span>
                  <span className="font-semibold text-charcoal-800">{gap.currentLevel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-700 font-semibold">
                  <span>Target:</span>
                  <span>{gap.targetLevel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between bg-canvas-subtle/40">
        <span className="text-xs text-charcoal-500">
          Ranked by target role relevance
        </span>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={handleViewAllGaps}
        >
          View Skill Gaps
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillGapPreview;
