import React from 'react';
import { CAPABILITY_STATES } from '../../utils/capabilityAdapter';
import Tooltip from './Tooltip';

/**
 * CapabilityStateBadge component
 * Displays transparent, evidence-grounded capability states:
 * - Demonstrated (Sage)
 * - Developing (Amber)
 * - Self-Reported (Slate/Neutral)
 * - Evidence Needed (Subtle Crimson)
 */
export const CapabilityStateBadge = ({
  state = 'SELF_REPORTED',
  size = 'md', // 'sm' | 'md' | 'lg'
  showDot = true,
  showTooltip = true,
  className = '',
}) => {
  const stateObj =
    typeof state === 'string'
      ? CAPABILITY_STATES[state] ||
        Object.values(CAPABILITY_STATES).find((s) => s.label.toLowerCase() === state.toLowerCase()) ||
        CAPABILITY_STATES.SELF_REPORTED
      : state;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size] || 'text-xs px-2.5 py-1 font-medium';

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5 mr-1.5',
    md: 'w-2 h-2 mr-1.5',
    lg: 'w-2.5 h-2.5 mr-2',
  }[size] || 'w-2 h-2 mr-1.5';

  const badgeContent = (
    <span
      className={`inline-flex items-center rounded-full border ${stateObj.colorClasses} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Capability state: ${stateObj.label}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${dotSizeClasses}`}
          style={{ backgroundColor: stateObj.dotColor }}
          aria-hidden="true"
        />
      )}
      <span>{stateObj.label}</span>
    </span>
  );

  if (showTooltip && stateObj.description) {
    return (
      <Tooltip content={stateObj.description} position="top">
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
};

export default CapabilityStateBadge;
