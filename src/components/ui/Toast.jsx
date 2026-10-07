import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const toastIcons = {
  success: <CheckCircle2 className="w-4 h-4 text-status-success-dot shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-status-danger-dot shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-status-warning-dot shrink-0" />,
  info: <Info className="w-4 h-4 text-status-info-dot shrink-0" />,
};

const toastStyles = {
  success: 'bg-surface border-status-success-border',
  error: 'bg-surface border-status-danger-border',
  warning: 'bg-surface border-status-warning-border',
  info: 'bg-surface border-status-info-border',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({
    title,
    message,
    type = 'info', // 'success' | 'error' | 'warning' | 'info'
    duration = 4000,
    action,
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, action }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-md
                border shadow-dropdown ${toastStyles[toast.type] || toastStyles.info}
              `}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{toastIcons[toast.type]}</div>
                <div>
                  {toast.title && (
                    <h5 className="text-body-sm font-semibold text-charcoal-900 leading-tight">
                      {toast.title}
                    </h5>
                  )}
                  {toast.message && (
                    <p className="text-xs text-charcoal-600 mt-0.5 leading-normal">
                      {toast.message}
                    </p>
                  )}
                  {toast.action && (
                    <button
                      type="button"
                      onClick={() => {
                        toast.action.onClick && toast.action.onClick();
                        removeToast(toast.id);
                      }}
                      className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-800 underline cursor-pointer"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 text-charcoal-400 hover:text-charcoal-700 rounded-xs hover:bg-canvas-subtle transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      addToast: (toast) => console.log('Toast triggered:', toast),
      removeToast: () => {},
    };
  }
  return context;
};

export default ToastProvider;
