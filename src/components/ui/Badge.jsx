import React from 'react';
import { Check, Sparkles, AlertCircle, Clock, ShieldCheck, Flame, Zap } from 'lucide-react';

const statusConfig = {
  active: {
    label: 'Active',
    bg: 'bg-status-success-bg',
    border: 'border-status-success-border',
    text: 'text-status-success-text',
    dot: 'bg-status-success-dot',
    icon: Check,
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-status-info-bg',
    border: 'border-status-info-border',
    text: 'text-status-info-text',
    dot: 'bg-status-info-dot',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-status-success-bg',
    border: 'border-status-success-border',
    text: 'text-status-success-text',
    dot: 'bg-status-success-dot',
    icon: Check,
  },
  verified: {
    label: 'Verified',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-600',
    icon: ShieldCheck,
  },
  at_risk: {
    label: 'At Risk',
    bg: 'bg-status-danger-bg',
    border: 'border-status-danger-border',
    text: 'text-status-danger-text',
    dot: 'bg-status-danger-dot',
    icon: AlertCircle,
  },
  high_priority: {
    label: 'High Priority',
    bg: 'bg-status-warning-bg',
    border: 'border-status-warning-border',
    text: 'text-status-warning-text',
    dot: 'bg-status-warning-dot',
    icon: Flame,
  },
  recommended: {
    label: 'Recommended',
    bg: 'bg-brand-50',
    border: 'border-brand-200',
    text: 'text-brand-800',
    dot: 'bg-brand-500',
    icon: Sparkles,
  },
  emerging: {
    label: 'Emerging',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-600',
    icon: Zap,
  },
  new: {
    label: 'New',
    bg: 'bg-brand-100',
    border: 'border-brand-300',
    text: 'text-brand-900',
    dot: 'bg-brand-600',
  },
  neutral: {
    label: 'Neutral',
    bg: 'bg-canvas-subtle',
    border: 'border-surface-border',
    text: 'text-charcoal-700',
    dot: 'bg-charcoal-400',
  },
};

export const Badge = ({
  children,
  status = 'neutral',
  variant = 'subtle', // 'subtle' | 'outline' | 'solid' | 'dot'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = false,
  showDot = false,
  className = '',
}) => {
  const config = statusConfig[status] || statusConfig.neutral;
  const content = children || config.label;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
    lg: 'text-body-sm px-3 py-1 gap-1.5 font-medium',
  };

  if (variant === 'dot') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-charcoal-700 font-medium ${className}`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
        <span>{content}</span>
      </span>
    );
  }

  let styleClasses = '';
  if (variant === 'subtle') {
    styleClasses = `${config.bg} ${config.text} border ${config.border}`;
  } else if (variant === 'outline') {
    styleClasses = `bg-transparent ${config.text} border ${config.border}`;
  } else if (variant === 'solid') {
    styleClasses = `bg-charcoal-900 text-white border border-charcoal-900`;
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-xs select-none tracking-tight
        ${sizeClasses[size] || sizeClasses.md}
        ${styleClasses}
        ${className}
      `}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />}
      {icon && IconComponent && <IconComponent className="w-3 h-3 shrink-0" />}
      <span>{content}</span>
    </span>
  );
};

export default Badge;
