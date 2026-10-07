import React from 'react';
import { Eye, EyeOff, Building2, Briefcase, Lock, Check } from 'lucide-react';
import Card from '../ui/Card';

export const visibilityOptions = [
  {
    id: 'private',
    title: 'Private Workspace',
    description: 'Your profile, skills, and progress are completely private. Only visible to you in your local session.',
    icon: Lock,
    badge: 'Maximum Privacy',
  },
  {
    id: 'limited',
    title: 'Limited Anonymized Capability',
    description: 'Only aggregate skill domain counts and experience tier are discoverable. No personal identifiers.',
    icon: EyeOff,
    badge: 'Anonymized',
  },
  {
    id: 'visible_opportunities',
    title: 'Visible to Opportunities',
    description: 'Your capability matrix and target role are matched against relevant job postings in Job Intelligence.',
    icon: Briefcase,
    badge: 'Recommended',
  },
  {
    id: 'visible_organizations',
    title: 'Visible to Organizations',
    description: 'Verified organization accounts can discover your profile in Talent Discovery candidate pipelines.',
    icon: Building2,
    badge: 'Open to Connect',
  },
];

export const ProfileVisibilityCard = ({
  value = 'visible_opportunities',
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      {visibilityOptions.map((opt) => {
        const isSelected = value === opt.id;
        const Icon = opt.icon;

        return (
          <div
            key={opt.id}
            onClick={() => !disabled && onChange && onChange(opt.id)}
            className={`
              p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4
              ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-500/20 shadow-xs'
                  : 'border-surface-border bg-white hover:border-brand-300 hover:bg-canvas-subtle/30'
              }
              ${disabled ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isSelected ? 'bg-brand-100 text-brand-800' : 'bg-canvas-subtle text-charcoal-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-body-sm font-bold text-charcoal-900">{opt.title}</h4>
                  {opt.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-charcoal-600 border border-stone-200">
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-caption text-charcoal-500 leading-relaxed max-w-xl">
                  {opt.description}
                </p>
              </div>
            </div>

            <div
              className={`
                w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors
                ${
                  isSelected
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-charcoal-300 bg-white'
                }
              `}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileVisibilityCard;
