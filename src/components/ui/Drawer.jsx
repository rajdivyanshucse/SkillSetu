import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export const Drawer = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  size, // alias for width
  position = 'right', // 'right' | 'left'
  showCloseButton = true,
  className = '',
}) => {
  const effectiveWidth = size || width;
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose && onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const isLeft = position === 'left';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-[2px]"
          />

          <div className={`fixed inset-y-0 ${isLeft ? 'left-0 pr-10' : 'right-0 pl-10'} flex max-w-full`}>
            <motion.div
              initial={{ x: isLeft ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isLeft ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className={`
                w-screen ${widthClasses[effectiveWidth] || widthClasses.md}
                bg-surface ${isLeft ? 'border-r' : 'border-l'} border-surface-border shadow-drawer
                flex flex-col h-full z-10
                ${className}
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="p-5 border-b border-surface-border flex items-start justify-between gap-4">
                  <div>
                    {title && (
                      <h3 className="text-section-title text-charcoal-900 font-semibold tracking-tight">
                        {title}
                      </h3>
                    )}
                    {description && (
                      <p className="text-body-sm text-charcoal-500 mt-1 leading-normal">
                        {description}
                      </p>
                    )}
                  </div>
                  {showCloseButton && (
                    <IconButton
                      icon={<X className="w-4 h-4" />}
                      size="sm"
                      variant="ghost"
                      onClick={onClose}
                      ariaLabel="Close drawer"
                      className="text-charcoal-400 hover:text-charcoal-700 shrink-0"
                    />
                  )}
                </div>
              )}

              {/* Body */}
              <div className="p-5 overflow-y-auto flex-1">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="p-4 px-5 border-t border-surface-border bg-canvas-subtle/50 flex items-center justify-end gap-2.5">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const BottomSheet = ({
  isOpen = false,
  onClose,
  title,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`
              relative w-full bg-surface rounded-t-xl border-t border-surface-border shadow-modal
              max-h-[85vh] overflow-y-auto z-10 p-5 pt-3
              ${className}
            `}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1 bg-charcoal-300 rounded-full mx-auto mb-4" />

            {title && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
                <h3 className="text-body-md font-semibold text-charcoal-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
