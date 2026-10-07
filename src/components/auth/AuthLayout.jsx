import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { Link } from '../../router/Router';
import { SkillSetuAuthVisual } from './SkillSetuAuthVisual';

export const AuthLayout = ({
  children,
  showBackToHome = true,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-canvas text-charcoal font-sans flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Mobile Bar (Visible on mobile/tablet) */}
      <div className="lg:hidden p-4 border-b border-surface-border bg-surface flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="text-body-sm font-bold text-charcoal-900">SkillSetu</span>
        </Link>
        {showBackToHome && (
          <Link
            href="/"
            className="text-xs text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        )}
      </div>

      {/* Main Grid Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full bg-surface rounded-2xl border border-surface-border shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Left Column: SkillSetu Intelligence Visual (~40% on desktop) */}
          <div className="hidden lg:block lg:col-span-5 bg-canvas-subtle">
            <SkillSetuAuthVisual />
          </div>

          {/* Right Column: Authentication Form Container (~60% on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            {/* Desktop Back Link */}
            {showBackToHome && (
              <div className="hidden lg:flex justify-end pb-4">
                <Link
                  href="/"
                  className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </Link>
              </div>
            )}

            {/* Form Slot */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`max-w-md w-full mx-auto ${className}`}
            >
              {children}
            </motion.div>

            {/* Subtle Bottom Help Note */}
            <div className="pt-8 text-center text-xs text-charcoal-400">
              <span>SkillSetu Enterprise Intelligence · </span>
              <Link href="/about" className="hover:underline">
                Responsible AI & Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
