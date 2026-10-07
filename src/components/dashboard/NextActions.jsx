import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Award, BookOpen, Layers } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const NextActions = ({
  recommendations = [],
  completeness = 92,
  className = '',
}) => {
  const { navigate } = useRouter();
  const { addToast } = useToast();

  const handleAction = (item) => {
    if (item.type === 'profile') {
      navigate('/onboarding/profile');
      return;
    }

    if (item.type === 'roadmap') {
      navigate('/dashboard/career-roadmap');
      return;
    }

    if (item.type === 'skill') {
      navigate('/dashboard/skill-gaps');
      return;
    }

    if (item.type === 'topic') {
      navigate('/dashboard/skill-gaps');
      return;
    }

    navigate('/dashboard/career-roadmap');
  };

  // Filter recommendations: hide "Complete profile" if 100% complete
  const visibleItems = recommendations.filter((r) => {
    if (r.conditional === 'profile_incomplete' && completeness >= 100) {
      return false;
    }
    return true;
  });

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Recommended Next Steps</CardTitle>
              <CardDescription>
                Focus on actions that can strengthen your profile.
              </CardDescription>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-wider font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            Action Plan
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {visibleItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="p-4 rounded-lg bg-canvas-subtle/70 border border-surface-border hover:border-surface-border-strong hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50/80 px-2 py-0.2 rounded-xs border border-brand-200/50">
                    {item.tag}
                  </span>
                  <span className="text-[11px] font-semibold text-charcoal-400">
                    Step 0{idx + 1}
                  </span>
                </div>

                <h4 className="text-body-sm font-bold text-charcoal-900 mt-1">
                  {item.title}
                </h4>

                <p className="text-[11px] text-charcoal-600 mt-1 leading-normal">
                  {item.reason}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-surface-border/80 flex items-center justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3 h-3" />}
                  onClick={() => handleAction(item)}
                  className="text-xs font-semibold text-brand-700 hover:text-brand-900"
                >
                  {item.actionText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NextActions;
