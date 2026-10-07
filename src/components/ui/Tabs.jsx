import React from 'react';
import { motion } from 'framer-motion';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'underline', // 'underline' | 'pills' | 'segmented'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-body-sm px-3.5 py-2 gap-2',
    lg: 'text-body-md px-4 py-2.5 gap-2.5',
  };

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 bg-canvas-subtle border border-surface-border rounded-md ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                relative px-3 py-1 text-xs font-medium rounded-sm transition-colors duration-150
                flex items-center gap-1.5 cursor-pointer select-none
                ${isActive ? 'text-charcoal-900 font-semibold' : 'text-charcoal-500 hover:text-charcoal-800'}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="segmentedIndicator"
                  className="absolute inset-0 bg-surface rounded-sm shadow-subtle border border-surface-border"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-pill ${
                      isActive ? 'bg-canvas-subtle text-charcoal-700' : 'bg-charcoal-200/60 text-charcoal-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                relative rounded-sm font-medium transition-all duration-150
                flex items-center cursor-pointer select-none
                ${sizeStyles[size] || sizeStyles.md}
                ${isActive 
                  ? 'bg-charcoal-900 text-white shadow-subtle' 
                  : 'bg-surface text-charcoal-600 border border-surface-border hover:bg-surface-hover hover:text-charcoal-900'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-pill ${
                    isActive ? 'bg-charcoal-800 text-charcoal-200' : 'bg-canvas-subtle text-charcoal-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant (default)
  return (
    <div className={`flex items-center border-b border-surface-border gap-6 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              relative pb-3 font-medium transition-colors duration-150
              flex items-center gap-2 cursor-pointer select-none whitespace-nowrap
              ${size === 'sm' ? 'text-xs' : 'text-body-sm'}
              ${isActive ? 'text-charcoal-900 font-semibold' : 'text-charcoal-500 hover:text-charcoal-800'}
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-brand-100 text-brand-800 font-semibold' : 'bg-canvas-subtle text-charcoal-500'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
