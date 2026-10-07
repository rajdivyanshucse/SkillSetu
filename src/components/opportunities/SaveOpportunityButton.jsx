import React from 'react';
import { Bookmark } from 'lucide-react';
import { useToast } from '../ui/Toast';
import {
  getStoredSavedOpportunities,
  saveStoredSavedOpportunities,
} from '../../data/opportunityData';

export const SaveOpportunityButton = ({
  jobId,
  isSaved,
  onToggle,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const { addToast } = useToast();

  const handleToggle = (e) => {
    e.stopPropagation();
    const savedIds = getStoredSavedOpportunities();
    let updated;
    let nextSavedState;

    if (savedIds.includes(jobId)) {
      updated = savedIds.filter((id) => id !== jobId);
      nextSavedState = false;
      addToast({
        title: 'Opportunity Removed',
        message: 'Removed from your saved opportunities list.',
        type: 'info',
        duration: 2500,
      });
    } else {
      updated = [...savedIds, jobId];
      nextSavedState = true;
      addToast({
        title: 'Opportunity Saved',
        message: 'Saved to your tracked opportunities list.',
        type: 'success',
        duration: 2500,
      });
    }

    saveStoredSavedOpportunities(updated);
    if (onToggle) {
      onToggle(nextSavedState, updated);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? 'Remove from saved opportunities' : 'Save opportunity'}
      title={isSaved ? 'Saved opportunity' : 'Save opportunity'}
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-sm transition-all duration-150 cursor-pointer
        ${
          isSaved
            ? 'bg-brand-50 text-brand-700 border border-brand-300 hover:bg-brand-100 hover:border-brand-400 shadow-xs'
            : 'bg-surface text-charcoal-500 border border-surface-border hover:text-charcoal-900 hover:bg-canvas-subtle hover:border-surface-border-strong'
        }
        ${isSmall ? 'p-1.5 text-xs' : 'p-2 text-body-sm'}
        ${className}
      `}
    >
      <Bookmark
        className={`
          transition-transform duration-150
          ${isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'}
          ${isSaved ? 'fill-brand-600 text-brand-700 scale-105' : 'text-charcoal-500'}
        `}
      />
      {showLabel && (
        <span className="font-semibold text-xs select-none">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default SaveOpportunityButton;
