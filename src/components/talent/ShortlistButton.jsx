import React from 'react';
import { Bookmark, Check } from 'lucide-react';
import { STORAGE_KEY_TALENT_SHORTLIST } from '../../data/talentData';
import { useToast } from '../ui/Toast';

export const ShortlistButton = ({
  candidateId,
  candidateName = 'Candidate',
  shortlist = [],
  onToggleShortlist,
  size = 'md',
  variant = 'outline',
  className = '',
}) => {
  const { addToast } = useToast();
  const isShortlisted = shortlist.includes(candidateId);

  const handleToggle = (e) => {
    e.stopPropagation();
    let updated;
    if (isShortlisted) {
      updated = shortlist.filter((id) => id !== candidateId);
      addToast({
        title: 'Removed from Shortlist',
        message: `${candidateName} was removed from your saved talent shortlist.`,
        type: 'info',
        duration: 3000,
      });
    } else {
      updated = [...shortlist, candidateId];
      addToast({
        title: 'Added to Shortlist',
        message: `${candidateName} has been shortlisted for role evaluation.`,
        type: 'success',
        duration: 3000,
      });
    }

    try {
      localStorage.setItem(STORAGE_KEY_TALENT_SHORTLIST, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist shortlist:', err);
    }

    if (onToggleShortlist) {
      onToggleShortlist(updated);
    }
  };

  const buttonSizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs'
    : 'px-3.5 py-2 text-xs font-semibold';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isShortlisted ? `Remove ${candidateName} from shortlist` : `Shortlist ${candidateName}`}
      className={`
        inline-flex items-center gap-1.5 rounded-lg border transition-all cursor-pointer select-none
        ${buttonSizeClasses}
        ${
          isShortlisted
            ? 'bg-accent-50 text-accent-800 border-accent-300 hover:bg-accent-100 font-bold shadow-2xs'
            : 'bg-surface text-charcoal-700 border-surface-border hover:bg-canvas-subtle hover:text-charcoal-900'
        }
        ${className}
      `}
    >
      <Bookmark
        className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-accent-600 text-accent-700' : 'text-charcoal-400'}`}
      />
      <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
    </button>
  );
};

export default ShortlistButton;
