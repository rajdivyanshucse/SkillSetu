import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

export const FocusAreaCard = ({ focusAreas = [], className = '' }) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const handleExploreRoadmap = () => {
    navigate('/dashboard/career-roadmap');
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Advanced':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            Advanced
          </span>
        );
      case 'Intermediate':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-brand-50 text-brand-800 border border-brand-200">
            Intermediate
          </span>
        );
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Foundational
          </span>
        );
    }
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>What should you focus on first?</CardTitle>
              <CardDescription>
                Curated competency priorities to sequence your career development roadmap.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            Focus Roadmap
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {focusAreas.map((area, idx) => (
            <motion.div
              key={area.id || idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50/80 px-2 py-0.5 rounded-xs border border-brand-200/50">
                    {area.priority}
                  </span>
                  {getDifficultyBadge(area.difficulty)}
                </div>

                <h4 className="text-body-sm font-bold text-charcoal-900 mt-1">
                  {area.title}
                </h4>

                <div className="text-[11px] font-semibold text-brand-700 mt-0.5">
                  Target: {area.skillArea}
                </div>

                <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">
                  {area.reason}
                </p>
              </div>

              <div className="pt-2.5 border-t border-surface-border/80 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                  Suggested First Step:
                </span>
                <p className="text-charcoal-800 font-medium leading-normal text-[11px]">
                  {area.suggestedFirstStep}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between bg-canvas-subtle/40">
        <span className="text-xs text-charcoal-500">
          Sequenced by prerequisite dependency
        </span>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={handleExploreRoadmap}
        >
          Explore Career Roadmap
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FocusAreaCard;
