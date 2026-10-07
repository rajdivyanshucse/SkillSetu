import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-charcoal-900 text-white hover:bg-charcoal-800 active:bg-charcoal-950 border border-charcoal-900 shadow-subtle',
  brand: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 border border-brand-600 shadow-subtle',
  'brand-subtle': 'bg-brand-50 text-brand-700 hover:bg-brand-100 active:bg-brand-200 border border-brand-200/70',
  secondary: 'bg-surface text-charcoal-900 hover:bg-surface-hover active:bg-surface-active border border-surface-border shadow-subtle',
  outline: 'bg-transparent text-charcoal-700 hover:bg-canvas-subtle active:bg-canvas-muted border border-surface-border',
  ghost: 'bg-transparent text-charcoal-700 hover:bg-canvas-subtle hover:text-charcoal-900 active:bg-canvas-muted border border-transparent',
  destructive: 'bg-status-danger-bg text-status-danger-text hover:bg-red-100 active:bg-red-200 border border-status-danger-border',
  'destructive-solid': 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-700 shadow-subtle',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-sm',
  sm: 'h-8 px-3 text-body-sm font-medium gap-1.5 rounded-sm',
  md: 'h-9 px-4 text-body-sm font-medium gap-2 rounded-sm',
  lg: 'h-11 px-5 text-body-md font-medium gap-2.5 rounded-md',
};

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.08 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && rightIcon && (
        <span className="shrink-0 inline-flex items-center">{rightIcon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export const IconButton = React.forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  ariaLabel,
  onClick,
  ...props
}, ref) => {
  const iconSizes = {
    xs: 'w-7 h-7 rounded-sm',
    sm: 'w-8 h-8 rounded-sm',
    md: 'w-9 h-9 rounded-sm',
    lg: 'w-11 h-11 rounded-md',
  };

  const baseClasses = 'inline-flex items-center justify-center font-sans select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  const variantClasses = variants[variant] || variants.ghost;
  const sizeClasses = iconSizes[size] || iconSizes.md;

  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={disabled || isLoading ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.08 }}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon
      )}
    </motion.button>
  );
});

IconButton.displayName = 'IconButton';

export default Button;
