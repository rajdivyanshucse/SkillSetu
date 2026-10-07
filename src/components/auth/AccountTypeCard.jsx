import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export const AccountTypeCard = ({
  id,
  title,
  subtitle,
  description,
  audience = [],
  icon,
  isSelected = false,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(id)}
      className={`
        p-6 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between
        ${isSelected
          ? 'bg-surface border-brand-500 ring-2 ring-brand-500/20 shadow-card'
          : 'bg-surface border-surface-border hover:border-surface-border-strong shadow-subtle hover:shadow-card'
        }
      `}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-md border transition-colors ${
            isSelected
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'bg-canvas-subtle border-surface-border text-charcoal-700'
          }`}>
            {icon}
          </div>

          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-brand-500 border-brand-500 text-white'
              : 'bg-surface border-surface-border'
          }`}>
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        <div>
          <h3 className="text-section-title font-bold text-charcoal-900">{title}</h3>
          <p className="text-body-sm text-charcoal-600 mt-1 leading-normal">
            {description}
          </p>
        </div>

        {audience.length > 0 && (
          <div className="pt-3 border-t border-surface-border space-y-1.5">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-charcoal-400 block">
              Ideal For:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {audience.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-2 py-0.5 rounded-xs bg-canvas-subtle text-charcoal-700 border border-surface-border"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-3 border-t border-surface-border flex items-center justify-between text-xs font-semibold">
        <span className={isSelected ? 'text-brand-700' : 'text-charcoal-500'}>
          {subtitle || 'Select plan'}
        </span>
        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-brand-600 translate-x-0.5' : 'text-charcoal-400'}`} />
      </div>
    </motion.div>
  );
};

export default AccountTypeCard;
