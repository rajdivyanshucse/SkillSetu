import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Link, useRouter } from '../../router/Router';
import { OnboardingSidebar } from './OnboardingSidebar';
import { useOnboarding } from './OnboardingContext';

export const OnboardingLayout = ({
  stepIndex = 1,
  children,
  className = '',
}) => {
  const { calculateCompleteness } = useOnboarding();
  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden p-4 border-b border-surface-border bg-surface flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="text-body-sm font-bold text-charcoal-900">SkillSetu Calibration</span>
          </Link>
          <span className="text-xs font-mono font-bold text-brand-700">
            Step {stepIndex} of 8 ({completeness}%)
          </span>
        </div>
        {/* Mobile Mini Progress bar */}
        <div className="w-full h-1 bg-canvas-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Main App Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full bg-surface rounded-2xl border border-surface-border shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          {/* Left Column: Sidebar Progress (~30% on desktop) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3.5">
            <OnboardingSidebar currentStepIndex={stepIndex} />
          </div>

          {/* Right Column: Step Form Content (~70% on desktop) */}
          <div className="lg:col-span-8 xl:col-span-8.5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-y-auto">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`max-w-3xl w-full mx-auto ${className}`}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
