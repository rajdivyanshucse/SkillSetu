import React from 'react';
import { motion } from 'framer-motion';
import { OrganizationOnboardingSidebar } from './OrganizationOnboardingSidebar';
import { OrganizationOnboardingHeader } from './OrganizationOnboardingHeader';

export const OrganizationOnboardingLayout = ({
  currentStepId,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col lg:flex-row text-charcoal-900 font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        <OrganizationOnboardingSidebar currentStepId={currentStepId} />
      </div>

      {/* Mobile Sticky Header */}
      <OrganizationOnboardingHeader currentStepId={currentStepId} />

      {/* Main Form Content Container */}
      <main className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto max-w-4xl mx-auto w-full">
        <motion.div
          key={currentStepId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6 w-full"
        >
          {/* Step Header */}
          {(title || subtitle) && (
            <div className="space-y-1 pb-4 border-b border-surface-border">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-body-sm text-charcoal-600 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          <div className="w-full">{children}</div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrganizationOnboardingLayout;
