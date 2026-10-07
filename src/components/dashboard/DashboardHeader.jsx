import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { useRouter } from '../../router/Router';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const DashboardHeader = ({
  userName = 'Rahul',
  subtitle = "Here's your current career intelligence snapshot.",
  completeness = 92,
  targetRole = 'Backend Software Engineer',
  className = '',
}) => {
  const { navigate } = useRouter();

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const firstName = userName ? userName.split(' ')[0] : 'Rahul';

  return (
    <div
      className={`
        bg-surface border border-surface-border rounded-xl p-5 sm:p-6 shadow-subtle
        flex flex-col md:flex-row md:items-center justify-between gap-4
        ${className}
      `}
    >
      {/* Left: Greeting & Career Target context */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-xs border border-brand-200/60">
            <Sparkles className="w-3 h-3 text-brand-600" />
            <span>Target: {targetRole}</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] text-charcoal-400">
            <Calendar className="w-3 h-3" />
            <span>{currentDateStr}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          {getGreeting()}, {firstName}
        </h1>

        <p className="text-body-sm text-charcoal-600 max-w-xl">
          {subtitle}
        </p>
      </div>

      {/* Right: Profile Completeness & Action */}
      <div className="flex items-center gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0">
        <div className="p-2.5 px-3.5 rounded-lg bg-canvas-subtle border border-surface-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
            {completeness}%
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal-500">
              Profile Completeness
            </span>
            <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {completeness >= 90 ? 'Calibrated' : 'In Progress'}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => navigate('/onboarding/review')}
          className="shrink-0"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
