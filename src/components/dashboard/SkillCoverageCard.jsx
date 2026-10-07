import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SkillCoverageCard = ({ skillCoverage = {}, className = '' }) => {
  const { navigate } = useRouter();
  const categories = skillCoverage.categories || [];

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-brand-500';
    if (percentage >= 60) return 'bg-brand-400';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-charcoal-400';
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Skill Coverage</CardTitle>
              <CardDescription>
                Your current capability across important skill areas.
              </CardDescription>
            </div>
          </div>

          <Badge status="neutral" size="sm">
            {skillCoverage.overallPercentage || 72}% Overall
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Highlight Highlights */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-md bg-canvas-subtle/80 border border-surface-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">
              Strongest Area
            </span>
            <span className="text-body-sm font-bold text-brand-800 mt-0.5 block">
              {skillCoverage.strongestCategory || 'Programming (88%)'}
            </span>
          </div>

          <div className="p-3 rounded-md bg-canvas-subtle/80 border border-surface-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block">
              Development Area
            </span>
            <span className="text-body-sm font-bold text-amber-800 mt-0.5 block">
              {skillCoverage.developmentCategory || 'Cloud & DevOps (38%)'}
            </span>
          </div>
        </div>

        {/* Category breakdown meters */}
        <div className="space-y-3 pt-1">
          {categories.map((cat, idx) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-charcoal-900">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-charcoal-500">
                    {cat.status}
                  </span>
                  <span className="font-bold text-charcoal-900">{cat.percentage}%</span>
                </div>
              </div>

              <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getBarColor(cat.percentage)}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between bg-canvas-subtle/40">
        <span className="text-xs text-charcoal-500">
          Mapped across 7 competency domains
        </span>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => navigate('/dashboard/skill-intelligence')}
        >
          View Skill Intelligence
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillCoverageCard;
