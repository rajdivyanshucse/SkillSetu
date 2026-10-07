import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dropdown = ({
  trigger,
  children,
  align = 'left', // 'left' | 'right'
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={() => setIsOpen(false)}
            className={`
              absolute z-50 mt-1.5 min-w-[180px] p-1.5 bg-surface border border-surface-border
              rounded-md shadow-dropdown ${alignClasses[align] || alignClasses.left}
              ${className}
            `}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({
  icon,
  children,
  onClick,
  shortcut,
  variant = 'default', // 'default' | 'destructive'
  disabled = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'text-charcoal-700 hover:bg-canvas-subtle hover:text-charcoal-900',
    destructive: 'text-status-danger-text hover:bg-red-50 hover:text-red-800',
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-2.5 py-1.5 text-body-sm rounded-xs
        transition-colors duration-100 cursor-pointer select-none text-left
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="w-4 h-4 text-charcoal-500 shrink-0 flex items-center">{icon}</span>}
        <span>{children}</span>
      </div>

      {shortcut && (
        <span className="text-[11px] font-mono text-charcoal-400 pl-3">{shortcut}</span>
      )}
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="h-px bg-surface-border my-1 -mx-1" />
);

export const DropdownHeader = ({ children }) => (
  <div className="px-2.5 py-1 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
    {children}
  </div>
);

export default Dropdown;
