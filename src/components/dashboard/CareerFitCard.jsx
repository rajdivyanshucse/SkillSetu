import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const CareerFitCard = ({ careerFit = {}, className = '' }) => {
  const { navigate } = useRouter();
  const roles = careerFit.roles || [];

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-brand-500';
    if (score >= 65) return 'bg-amber-600';
    return 'bg-charcoal-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'High Alignment', status: 'verified' };
    if (score >= 65) return { label: 'Moderate Fit', status: 'neutral' };
    return { label: 'Developing Fit', status: 'neutral' };
  };

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-sm bg-brand-50 text-brand-700 border border-brand-200/60">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Your Career Fit</CardTitle>
              <CardDescription>
                How your current profile aligns with selected career paths.
              </CardDescription>
            </div>
          </div>

          <Badge status="recommended" size="sm">
            Target Focus
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="space-y-3.5">
          {roles.map((role, idx) => {
            const badgeInfo = getScoreBadge(role.compatibility);
            return (
              <motion.div
                key={role.id || role.title}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className={`
                  p-3.5 rounded-lg border transition-all
                  ${
                    role.isTarget
                      ? 'bg-brand-50/40 border-brand-200/80 shadow-xs'
                      : 'bg-canvas-subtle/50 border-surface-border hover:border-surface-border-strong'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-body-sm font-bold text-charcoal-900 truncate">
                      {role.title}
                    </span>
                    {role.isTarget && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 shrink-0">
                        Target Role
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-body-sm font-extrabold text-charcoal-900">
                      {role.compatibility}%
                    </span>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="w-full h-2 bg-canvas-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${role.compatibility}%` }}
                    transition={{ duration: 0.6, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                    className={`h-full rounded-full ${getScoreColor(role.compatibility)}`}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-charcoal-500">
                  <span className="truncate">{role.description}</span>
                  <span className="font-semibold text-charcoal-700 shrink-0 ml-2">
                    {badgeInfo.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer Callout */}
        <div className="p-3 rounded-md bg-canvas-subtle border border-surface-border flex items-start gap-2 text-xs text-charcoal-600">
          <Info className="w-4 h-4 text-charcoal-500 shrink-0 mt-0.5" />
          <p className="leading-normal text-[11px]">
            {careerFit.disclaimer ||
              'Compatibility reflects profile alignment with role requirements. It does not represent hiring probability.'}
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between bg-canvas-subtle/40">
        <span className="text-xs text-charcoal-500">
          5 Role Archetypes Calibrated
        </span>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => navigate('/dashboard/career-intelligence')}
        >
          Explore Career Intelligence
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CareerFitCard;
