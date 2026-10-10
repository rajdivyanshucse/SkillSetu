import React from 'react';
import { TrendingUp, Minus, Sparkles, AlertTriangle, TrendingDown } from 'lucide-react';

/**
 * MarketSignalBadge Component
 * Phase 37: Standardized market direction signals.
 * 
 * Semantics:
 * - GROWING  -> sage / emerald with TrendingUp
 * - STABLE   -> slate / charcoal with Minus
 * - EMERGING -> warm brown / brand with Sparkles
 * - VOLATILE -> amber with AlertTriangle
 * - DECLINING-> muted rose with TrendingDown
 * 
 * Accompanying text labels and icons are always present for accessibility.
 */

export const MARKET_SIGNAL_CONFIG = {
  GROWING: {
    key: 'GROWING',
    label: 'Growing Demand',
    shortLabel: 'Growing',
    description: 'Historical observations indicate increasing role demand over recent observation periods.',
    colorClasses: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotColor: '#1F6948',
    icon: TrendingUp,
  },
  STABLE: {
    key: 'STABLE',
    label: 'Stable Demand',
    shortLabel: 'Stable',
    description: 'Demand remains established as a core requirement across baseline benchmarks.',
    colorClasses: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: '#524E46',
    icon: Minus,
  },
  EMERGING: {
    key: 'EMERGING',
    label: 'Emerging Signal',
    shortLabel: 'Emerging',
    description: 'Early upward signal observed in adjacent and forward-looking role postings.',
    colorClasses: 'bg-amber-50/80 text-amber-900 border-amber-300',
    dotColor: '#8C5E3C',
    icon: Sparkles,
  },
  VOLATILE: {
    key: 'VOLATILE',
    label: 'Volatile Signal',
    shortLabel: 'Volatile',
    description: 'Demand fluctuates across specialized sectors or cyclical hiring periods.',
    colorClasses: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: '#8B5B14',
    icon: AlertTriangle,
  },
  DECLINING: {
    key: 'DECLINING',
    label: 'Declining Trend',
    shortLabel: 'Declining',
    description: 'Reduced frequency in modern benchmarks compared to prior historical observations.',
    colorClasses: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: '#9E2A22',
    icon: TrendingDown,
  },
};

export const normalizeMarketSignal = (signal = '') => {
  const norm = String(signal).toUpperCase().trim();
  if (norm.includes('GROW') || norm.includes('RIS') || norm.includes('HIGH')) {
    if (norm.includes('EMERG')) return MARKET_SIGNAL_CONFIG.EMERGING;
    return MARKET_SIGNAL_CONFIG.GROWING;
  }
  if (norm.includes('EMERG')) return MARKET_SIGNAL_CONFIG.EMERGING;
  if (norm.includes('STABLE') || norm.includes('STEADY')) return MARKET_SIGNAL_CONFIG.STABLE;
  if (norm.includes('VOLATILE') || norm.includes('MODERATE')) return MARKET_SIGNAL_CONFIG.VOLATILE;
  if (norm.includes('DECLIN') || norm.includes('LOW')) return MARKET_SIGNAL_CONFIG.DECLINING;
  return MARKET_SIGNAL_CONFIG.GROWING;
};

export const MarketSignalBadge = ({
  signal = 'GROWING',
  size = 'sm',
  showIcon = true,
  short = false,
  className = '',
}) => {
  const config = typeof signal === 'object' && signal.key
    ? signal
    : normalizeMarketSignal(signal);

  const Icon = config.icon || TrendingUp;

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5 gap-1'
    : size === 'md'
    ? 'text-xs px-2.5 py-1 gap-1.5'
    : 'text-[11px] px-2 py-0.5 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${config.colorClasses} ${sizeClasses} ${className}`}
      title={config.description}
    >
      {showIcon && <Icon className={size === 'xs' ? 'w-2.5 h-2.5 shrink-0' : 'w-3 h-3 shrink-0'} />}
      <span>{short ? config.shortLabel : config.label}</span>
    </span>
  );
};

export default MarketSignalBadge;
